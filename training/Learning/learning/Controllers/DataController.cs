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
            await UploadAndSplitStream(request.TableName!, request.Columns!.Count, request.TempFilePath!);
            Console.WriteLine("Hello");


            // Delete the temporary file
            System.IO.File.Delete(request.TempFilePath!);
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
        var listOfData = new List<Dictionary<string, object>>();
        using (var connection = new MySqlConnection(dbConnString))
        {
            await connection.OpenAsync();

            // Sanitize the table name to prevent SQL injection
            string sanitizedTableName = MySqlHelper.EscapeString(request.TableName);

            var query = $@"SELECT CONCAT('SELECT rowId, ', GROUP_CONCAT(COLUMN_NAME ORDER BY ORDINAL_POSITION SEPARATOR ', '), 
            ' FROM {sanitizedTableName} ', 
            ' ORDER BY rowId ASC LIMIT @limit OFFSET @offset') AS sql_query
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = '{sanitizedTableName}'
            AND COLUMN_NAME != 'rowId'
            AND TABLE_SCHEMA = 'training';";
            var command = new MySqlCommand(query, connection);
            // Execute the query to get the dynamic SQL command
            var result = command.ExecuteScalar()?.ToString();
            query = result + ";";

            // var query = $"SELECT `rowid`, * FROM `{sanitizedTableName}` ORDER BY `rowid` ASC LIMIT @limit OFFSET @offset";

            using (command = new MySqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@limit", request.Limit);
                command.Parameters.AddWithValue("@offset", request.Offset);



                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var row = new Dictionary<string, object>();
                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            string columnName = reader.GetName(i);
                            // Console.WriteLine(columnName);
                            object? value = reader.IsDBNull(i) ? null : reader.GetValue(i);
                            row[columnName] = value!;
                        }
                        listOfData.Add(row);
                    }
                }
            }
        }


        return Ok(listOfData);
    }



    [HttpPost("updateData")]
    public async Task<IActionResult> UpdateData([FromBody] UpdateRequest request)
    {
        try
        {
            using (var connection = new MySqlConnection(dbConnString))
            {
                await connection.OpenAsync();

                // Sanitize table name to prevent SQL injection
                string? sanitizedTableName = MySqlHelper.EscapeString(request.TableName);

                // Prepare the SET clause for the update query
                var setClauses = new List<string>();
                foreach (var column in request.Columns!)
                {
                    setClauses.Add($"`{MySqlHelper.EscapeString(column.Key)}` = @{column.Key}");

                }

                string setClause = string.Join(", ", setClauses);


                // Create the update query
                var query = $"UPDATE `{sanitizedTableName}` SET {setClause} WHERE `rowid` = @id";


                using (var command = new MySqlCommand(query, connection))
                {
                    // Bind column values to parameters
                    foreach (var column in request.Columns)
                    {
                        command.Parameters.AddWithValue($"@{column.Key}", column.Value);
                    }

                    // Bind the ID for the WHERE clause
                    command.Parameters.AddWithValue("@id", request.Rowid);

                    var affectedRows = await command.ExecuteNonQueryAsync();

                    if (affectedRows > 0)
                    {
                        return Ok("Data updated successfully");
                    }
                    else
                    {
                        return Ok("No rows were updated");
                    }
                }
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // Request class for update
    public class UpdateRequest
    {
        public string? TableName { get; set; }
        public int Rowid { get; set; }
        public Dictionary<string, object>? Columns { get; set; }
    }



    [HttpPost("searchData")]
    public async Task<IActionResult> SearchData([FromBody] SearchRequest request)
    {
        Console.WriteLine("in serach data");
        try
        {
            using (var connection = new MySqlConnection(dbConnString))
            {
                await connection.OpenAsync();

                // Sanitize table name to prevent SQL injection
                string? sanitizedTableName = MySqlHelper.EscapeString(request.TableName);

                // Prepare the WHERE clause with LIKE for the search query
                var whereClauses = new List<string>();
                foreach (var column in request.Columns!)
                {
                    whereClauses.Add($"`{MySqlHelper.EscapeString(column.Key)}` LIKE @{column.Key}");
                }

                string whereClause = string.Join(" OR ", whereClauses);

                // Create the search query using LIKE operator
                var query = $"SELECT * FROM `{sanitizedTableName}` WHERE {whereClause}";
                Console.WriteLine(query);
            

                using (var command = new MySqlCommand(query, connection))
                {
                    // Bind search values to parameters using LIKE
                    foreach (var column in request.Columns)
                    {
                        command.Parameters.AddWithValue($"@{column.Key}", $"%{column.Value}%");
                        Console.WriteLine(column);
                    }

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var results = new List<Dictionary<string, object>>();
                        while (await reader.ReadAsync())
                        {
                            var row = new Dictionary<string, object>();
                            for (var i = 0; i < reader.FieldCount; i++)
                            {
                                row[reader.GetName(i)] = reader.GetValue(i);
                            }
                            results.Add(row);
                        }

                        return Ok(results);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }


    public class SearchRequest
{
    public string? TableName { get; set; }
    public Dictionary<string, string>? Columns { get; set; } // Key: Column Name, Value: Search Term
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
                AlterTableAddColumns(action.TableName!, action.NewColumns!);
                break;
            case "truncate":
                // Upload only up to specified columns
                UploadTruncatedMiscRows(action.TableName!, action.ColumnCount);
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
        string CorrectTableName = NameCorrection(request.TableName!);
        var query = new StringBuilder($"CREATE TABLE `{CorrectTableName}` (");

        bool hasPrimaryKey = false;

        for (int i = 0; i < request.Columns!.Count; i++)
        {
            var column = request.Columns[i];

            // Sanitize column name
            string CorrectColumnName = NameCorrection(column.Name!);

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