using System.Diagnostics;
using System.Text;
using learning.Models;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.IO;
using System.Data;

namespace learning.Controllers;

[ApiController]

[Route("api/[controller]")]

public class DataController : ControllerBase
{
    //this class will handle various apis for the data

    public IConfiguration? configuration;//this will store the configuration settings present in appsetting.json
    private readonly string? dbConnString;//this is the string required to connect to mysql db


    //initializing the rabbitmq publisher and consumer

    private readonly RabbitMQPublisher publisher;

    public DataController(IConfiguration _configuration, RabbitMQPublisher _publisher)
    {
        //constructor
        configuration = _configuration;//updating the value
        dbConnString = configuration.GetConnectionString("DBConnectionString");//updating the value

        publisher = _publisher;
    }

  

    [HttpPost("uploadAndCreateTable")]
    public async Task<IActionResult> UploadAndCreateTable()
    {
        Console.WriteLine(1234);
        try
        {
            var file = Request.Form.Files[0];
            var tempPath = Path.GetTempFileName();
            using (var stream = new FileStream(tempPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Read the header
            string? header;
            using (var reader = new StreamReader(tempPath))
            {
                header = await reader.ReadLineAsync();
            }

            if (string.IsNullOrEmpty(header))
            {
                return BadRequest("CSV file is empty or invalid.");
            }

            Console.WriteLine("saved the file");
            // Send the header back to the client
            return Ok(new { columns = header.Split(','), tempFilePath = tempPath });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }



    [HttpPost("createTableAndUpload1")]
    public async Task<ActionResult> CreateTableAndUpload1([FromBody] TableCreationRequest request)
    {
        Console.WriteLine(((DateTimeOffset)DateTime.UtcNow).ToUnixTimeMilliseconds());
        try
        {
            var createTableQuery = BuildCreateTableQuery(request);
            await publisher.SendChunk(createTableQuery);
            // Now proceed with file upload and processing
            await UploadAndSplitStream(request.TableName, request.Columns.Count, request.TempFilePath);
            Console.WriteLine("Hello");


            // Delete the temporary file
            System.IO.File.Delete(request.TempFilePath);
            return Ok("File saved");
        }
        catch (Exception ex)
        {
            Console.WriteLine(((DateTimeOffset)DateTime.UtcNow).ToUnixTimeMilliseconds());
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }


    private async Task UploadAndSplitStream(string tableName, int expectedColumnCount, string tempFilePath)
    {
        string uploadPath = Path.Combine("C:\\ProgramData\\MySQL2\\MySQL Server 8.0\\Uploads\\", "uploads");
        Directory.CreateDirectory(uploadPath);

        int numberOfParts = 4;
        var partFiles = new string[numberOfParts];
        var partStreams = new StreamWriter[numberOfParts];
        var processTasks = new Task[numberOfParts];
        var miscFile = Path.Combine(uploadPath, "miscellaneous.csv");
        var miscStream = new StreamWriter(miscFile);

        // Initialize part files and streams
        for (int i = 0; i < numberOfParts; i++)
        {
            partFiles[i] = Path.Combine(uploadPath, $"part_{i}.csv");
            partStreams[i] = new StreamWriter(partFiles[i]);
        }

        using var reader = new StreamReader(tempFilePath);
        int currentPart = 0;
        long totalLinesRead = 0;
        long linesPerPart = 25000;
        await reader.ReadLineAsync();

        string? line;
        while ((line = await reader.ReadLineAsync()) != null)
        {
            if (string.IsNullOrWhiteSpace(line))
            {
                continue;
            }
            var columns = line.Split(',');

            if (columns.Length < expectedColumnCount)
            {
                // Pad with null values
                line = string.Join(",", columns.Concat(Enumerable.Repeat("NULL", expectedColumnCount - columns.Length)));
                await partStreams[currentPart].WriteLineAsync(line);
            }
            else if (columns.Length > expectedColumnCount)
            {
                // Write to miscellaneous file
                await miscStream.WriteLineAsync(line);
            }
            else
            {
                await partStreams[currentPart].WriteLineAsync(line);
            }

            totalLinesRead++;

            // Switch to next part if linesPerPart is reached
            if (totalLinesRead >= linesPerPart && currentPart < numberOfParts - 1)
            {
                await partStreams[currentPart].FlushAsync();
                partStreams[currentPart].Dispose();

                int partIndex = currentPart;
                processTasks[partIndex] = Task.Run(() => ProcessFile(partFiles[partIndex], tableName));

                currentPart++;
                totalLinesRead = 0;
            }
        }

        // Handle the last part
        await partStreams[currentPart].FlushAsync();
        partStreams[currentPart].Dispose();
        processTasks[currentPart] = Task.Run(() => ProcessFile(partFiles[currentPart], tableName));

        // Close miscellaneous file
        await miscStream.FlushAsync();
        miscStream.Dispose();

        // Wait for all processing tasks to complete
        await Task.WhenAll(processTasks.Where(t => t != null));

        // Handle miscellaneous rows
        if (new FileInfo(miscFile).Length > 0)
        {
            // Notify the user about miscellaneous rows and ask for action
            // This could be done through a separate API endpoint or WebSocket
            Console.WriteLine("Miscellaneous rows found. User action required.");
        }
    }



    private async Task ProcessFile(string filePath, string tableName)
    {
        try
        {
            var loadQuery = $@"
            LOAD DATA INFILE '{filePath.Replace("\\", "/")}'
            INTO TABLE `{tableName}`
            FIELDS TERMINATED BY ',' 
            LINES TERMINATED BY '\r\n'; ";
            await publisher.SendChunk(loadQuery);



        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error processing file {filePath}: {ex.Message}");
        }
    }



    [HttpPost("fetchData")]
    public async Task<ActionResult<List<Dictionary<string, object>>>> GetData([FromBody] Fetchdata request)
    {
        // Console.WriteLine("boris");
        var listOfData = new List<Dictionary<string, object>>();
        // Console.WriteLine(request.Offset);
        using (var connection = new MySqlConnection(dbConnString))
        {
            await connection.OpenAsync();

            // Sanitize the table name to prevent SQL injection
            string sanitizedTableName = MySqlHelper.EscapeString(request.TableName);
            // Console.WriteLine(sanitizedTableName);

            var query = $"SELECT * FROM `{sanitizedTableName}` ORDER BY `name` ASC LIMIT @limit OFFSET @offset";

            using (var command = new MySqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@limit", request.Limit);
                command.Parameters.AddWithValue("@offset", request.Offset);
                Console.WriteLine(query);
                Console.WriteLine(request.Limit);
                Console.WriteLine(request.Offset);

                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        // Console.WriteLine(reader);
                        var row = new Dictionary<string, object>();
                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            string columnName = reader.GetName(i);
                            // Console.WriteLine(columnName);
                            object value = reader.IsDBNull(i) ? null : reader.GetValue(i);
                            row[columnName] = value;
                        }
                        listOfData.Add(row);
                    }
                }
            }
        }
        

        return Ok(listOfData);
    }



[HttpPost("updateData")]
public async Task<ActionResult> UpdateData([FromBody] List<Dictionary<string, object>> records)
{
    using (var connection = new MySqlConnection(dbConnString))
    {
        await connection.OpenAsync();

        using (var transaction = await connection.BeginTransactionAsync())
        {
            try
            {
                foreach (var record in records)
                {
                    if (!record.ContainsKey("id"))
                    {
                        return BadRequest("Each record must contain an 'id' field for updating.");
                    }

                    // Get the ID of the record to update
                    var recordId = record["id"];
                    
                    // Build the SQL query dynamically based on the fields in the dictionary
                    var updateFields = new List<string>();
                    var parameters = new Dictionary<string, object>();

                    foreach (var keyValue in record)
                    {
                        if (keyValue.Key != "id")
                        {
                            updateFields.Add($"`{MySqlHelper.EscapeString(keyValue.Key)}` = @{keyValue.Key}");
                            parameters.Add($"@{keyValue.Key}", keyValue.Value ?? DBNull.Value);
                        }
                    }

                    if (updateFields.Count == 0)
                    {
                        continue; // No fields to update for this record
                    }

                    var query = $"UPDATE `your_table_name` SET {string.Join(", ", updateFields)} WHERE `id` = @id";
                    
                    using (var command = new MySqlCommand(query, connection, transaction))
                    {
                        command.Parameters.AddWithValue("@id", recordId);

                        // Add the parameters for the dynamic fields
                        foreach (var param in parameters)
                        {
                            command.Parameters.AddWithValue(param.Key, param.Value);
                        }

                        await command.ExecuteNonQueryAsync();
                    }
                }

                await transaction.CommitAsync();
                return Ok("Records updated successfully.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}








    [HttpPost("cmr")]
    public IActionResult Cmr()
    {
        Console.WriteLine("inchedkmis");
        string miscFilePath = Path.Combine("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\", "uploads", "miscellaneous.csv");
        bool hasMiscellaneousRows = System.IO.File.Exists(miscFilePath) && new FileInfo(miscFilePath).Length > 0;
        Console.WriteLine("aftercheckmis");
        return Ok(new { hasMiscellaneousRows });
    }

    [HttpPost("handleMiscellaneousRows")]
    public IActionResult HandleMiscellaneousRows([FromBody] MiscRowsAction action)
    {
        Console.WriteLine("Hello");
        switch (action.Action)
        {
            case "delete":
                // Delete the miscellaneous file
                System.IO.File.Delete(Path.Combine("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\", "uploads", "miscellaneous.csv"));
                break;
            case "alterTable":
                // Alter the table to add new columns
                AlterTableAddColumns(action.TableName, action.NewColumns);
                break;
            case "truncate":
                // Upload only up to specified columns
                UploadTruncatedMiscRows(action.TableName, action.ColumnCount);
                break;
            default:
                return BadRequest("Invalid action specified");
        }

        return Ok("Miscellaneous rows handled successfully");
    }

    private void AlterTableAddColumns(string tableName, List<string> newColumns)
    {
        var connectionString = "server=localhost;port=3306;user=root;password=root;database=training;pooling=true";

        using (var connection = new MySqlConnection(connectionString))
        {
            connection.Open();

            foreach (var column in newColumns)
            {
                var alterQuery = $"ALTER TABLE `{tableName}` ADD COLUMN `{NameCorrection(column)}` VARCHAR(255)";
                using (var command = new MySqlCommand(alterQuery, connection))
                {
                    command.ExecuteNonQuery();
                }
            }
        }
    }

    private void UploadTruncatedMiscRows(string tableName, int columnCount)
    {
        var miscFile = Path.Combine("C:\\ProgramData\\MySQL2\\MySQL Server 8.0\\Uploads\\", "uploads", "miscellaneous.csv");
        var truncatedFile = Path.Combine("C:\\ProgramData\\MySQL2\\MySQL Server 8.0\\Uploads\\", "uploads", "truncated.csv");

        using (var reader = new StreamReader(miscFile))
        using (var writer = new StreamWriter(truncatedFile))
        {
            string? line;
            while ((line = reader.ReadLine()) != null)
            {
                var columns = line.Split(',');
                var truncatedLine = string.Join(",", columns.Take(columnCount));
                writer.WriteLine(truncatedLine);
            }
        }

        ProcessFile(truncatedFile, tableName).Wait();
        System.IO.File.Delete(truncatedFile);
    }

    public class MiscRowsAction
    {
        public string? Action { get; set; }
        public string? TableName { get; set; }
        public List<string>? NewColumns { get; set; }
        public int ColumnCount { get; set; }
    }


    private string BuildCreateTableQuery(TableCreationRequest request)
    {
        // Sanitize table name
        string CorrectTableName = NameCorrection(request.TableName);
        var query = new StringBuilder($"CREATE TABLE `{CorrectTableName}` (");

        bool hasPrimaryKey = false;

        for (int i = 0; i < request.Columns.Count; i++)
        {
            var column = request.Columns[i];

            // Sanitize column name
            string CorrectColumnName = NameCorrection(column.Name);

            query.Append($"`{CorrectColumnName}` {column.Type}");

            if (!column.AllowNull)
            {
                query.Append(" NOT NULL");
            }

            if (column.IsPrimaryKey)
            {
                if (hasPrimaryKey)
                {
                    throw new InvalidOperationException("Only one primary key is allowed.");
                }
                query.Append(" PRIMARY KEY");
                hasPrimaryKey = true;
            }

            if (i < request.Columns.Count - 1)
            {
                query.Append(", ");
            }
        }

        query.Append(")");
        return query.ToString();
    }

    private string NameCorrection(string identifier)
    {
        // Replace spaces with underscores
        identifier = identifier.Replace(" ", "_");

        // Remove any characters that are not alphanumeric or underscores
        identifier = new string(identifier.Where(c => char.IsLetterOrDigit(c) || c == '_').ToArray());

        // Ensure the identifier doesn't start with a number
        if (identifier.Length > 0 && char.IsDigit(identifier[0]))
        {
            identifier = "_" + identifier;
        }

        return identifier;
    }


    public class TableCreationRequest
    {
        public string? TableName { get; set; }
        public List<ColumnDefinition>? Columns { get; set; }
        public string? TempFilePath { get; set; }
    }

     public class Fetchdata
    {
        public string? TableName { get; set; }
        public int? Limit { get; set; }
        public int? Offset { get; set; }
    }

    public class ColumnDefinition
    {
        public string? Name { get; set; }
        public string? Type { get; set; }
        public bool AllowNull { get; set; }
        public bool IsPrimaryKey { get; set; }
    }


}