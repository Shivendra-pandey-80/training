// [HttpPost("insertMultipleData")]
// public async Task<IActionResult> PostMultipleData(IFormFile file)
// {
//     Console.WriteLine("-------------");
//     Console.WriteLine(((DateTimeOffset)DateTime.UtcNow).ToUnixTimeMilliseconds());

//     if (file == null || file.Length == 0)
//     {
//         return BadRequest("No file uploaded.");
//     }

//     using var stream = file.OpenReadStream();
//     int chunkSize = 1000000; // Adjust based on your file size and available memory
//     int numberOfChunks = (int)Math.Ceiling((double)file.Length / chunkSize);
    
//     var tasks = new Task[numberOfChunks];

//     for (int i = 0; i < numberOfChunks; i++)
//     {
//         int startPosition = i * chunkSize;
//         tasks[i] = ProcessCsvChunk(stream, startPosition, chunkSize);
//     }

//     await Task.WhenAll(tasks);

//     Console.WriteLine(((DateTimeOffset)DateTime.UtcNow).ToUnixTimeMilliseconds());

//     return Ok();
// }

// private async Task ProcessCsvChunk(Stream stream, int startPosition, int chunkSize)
// {
//     const int batchSize = 10000;
//     stream.Seek(startPosition, SeekOrigin.Begin);
    
//     using var reader = new StreamReader(stream, leaveOpen: true);
    
//     if (startPosition > 0)
//     {
//         // If not the first chunk, read and discard until the next newline
//         while (reader.Peek() != -1 && reader.Read() != '\n') { }
//     }
//     else
//     {
//         // Skip header for the first chunk
//         await reader.ReadLineAsync();
//     }

//     var records = new List<DataModel>(batchSize);
//     string? line;
//     int bytesRead = 0;

//     while (bytesRead < chunkSize && (line = await reader.ReadLineAsync()) != null)
//     {
//         bytesRead += System.Text.Encoding.UTF8.GetByteCount(line + Environment.NewLine);

//         if (string.IsNullOrWhiteSpace(line))
//             continue;

//         var columns = line.Split(',');
//         if (columns.Length < 14)
//             continue;

//         try
//         {
//             records.Add(new DataModel
//             {
//                 Email_id = columns[0],
//                 Name = columns[1],
//                 Country = columns[2],
//                 State = columns[3],
//                 City = columns[4],
//                 Telephone_number = int.TryParse(columns[5], out int tel) ? tel : 0,
//                 Address_line_1 = columns[6],
//                 Address_line_2 = columns[7],
//                 Date_of_birth = columns[8],
//                 Gross_salary_FY2019_20 = int.TryParse(columns[9], out int sal19) ? sal19 : 0,
//                 Gross_salary_FY2020_21 = int.TryParse(columns[10], out int sal20) ? sal20 : 0,
//                 Gross_salary_FY2021_22 = int.TryParse(columns[11], out int sal21) ? sal21 : 0,
//                 Gross_salary_FY2022_23 = int.TryParse(columns[12], out int sal22) ? sal22 : 0,
//                 Gross_salary_FY2023_24 = int.TryParse(columns[13], out int sal23) ? sal23 : 0
//             });

//             if (records.Count == batchSize)
//             {
//                 await ConvertToQuery(records);
//                 records.Clear();
//             }
//         }
//         catch (Exception ex)
//         {
//             Console.WriteLine($"Error processing line: {ex.Message}");
//         }
//     }

//     if (records.Count > 0)
//     {
//         await ConvertToQuery(records);
//     }
// }

// private async Task ConvertToQuery(List<DataModel> records)
// {
//     var queryBuilder = new StringBuilder();
//     queryBuilder.Append("INSERT INTO usertest2 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) VALUES ");

//     bool isFirstValueEntry = true;

//     foreach (var record in records)
//     {
//         if (!isFirstValueEntry)
//         {
//             queryBuilder.Append(',');
//         }

//         queryBuilder.Append($"(" +
//             $"'{MySqlHelper.EscapeString(record.Email_id)}', " +
//             $"'{MySqlHelper.EscapeString(record.Name)}', " +
//             $"'{MySqlHelper.EscapeString(record.Country)}', " +
//             $"'{MySqlHelper.EscapeString(record.State)}', " +
//             $"'{MySqlHelper.EscapeString(record.City)}', " +
//             $"{record.Telephone_number}, " +
//             $"'{MySqlHelper.EscapeString(record.Address_line_1)}', " +
//             $"'{MySqlHelper.EscapeString(record.Address_line_2)}', " +
//             $"'{MySqlHelper.EscapeString(record.Date_of_birth)}', " +
//             $"{record.Gross_salary_FY2019_20}, " +
//             $"{record.Gross_salary_FY2020_21}, " +
//             $"{record.Gross_salary_FY2021_22}, " +
//             $"{record.Gross_salary_FY2022_23}, " +
//             $"{record.Gross_salary_FY2023_24})");

//         isFirstValueEntry = false;
//     }

//     queryBuilder.Append(';');

//     publisher.SendChunk(queryBuilder.ToString());
// }




// --------------------------------------------------------------------------------



// [HttpPost("insertMultipleData")]
// public async Task<IActionResult> PostMultipleData(IFormFile file)
// {
//     Console.WriteLine("-------------");
//     Console.WriteLine(((DateTimeOffset)DateTime.UtcNow).ToUnixTimeMilliseconds());

//     if (file == null || file.Length == 0)
//     {
//         return BadRequest("No file uploaded.");
//     }

//     using var stream = file.OpenReadStream();
//     const int linesPerChunk = 10000;  // Set to 10,000 lines per chunk

//     // We will process in parallel, creating a task for each chunk
//     var tasks = new List<Task>();
//     using var reader = new StreamReader(stream);

//     // Skip header
//     await reader.ReadLineAsync();

//     while (!reader.EndOfStream)
//     {
//         // Process linesPerChunk lines in each task
//         tasks.Add(ProcessCsvChunk(reader, linesPerChunk));
//     }

//     await Task.WhenAll(tasks);

//     Console.WriteLine(((DateTimeOffset)DateTime.UtcNow).ToUnixTimeMilliseconds());

//     return Ok();
// }

// private async Task ProcessCsvChunk(StreamReader reader, int linesPerChunk)
// {
//     const int batchSize = 10000;
//     var records = new List<DataModel>(batchSize);

//     string? line;
//     int lineCount = 0;

//     while (lineCount < linesPerChunk && (line = await reader.ReadLineAsync()) != null)
//     {
//         if (string.IsNullOrWhiteSpace(line))
//             continue;

//         var columns = line.Split(',');
//         if (columns.Length < 14)
//             continue;

//         try
//         {
//             records.Add(new DataModel
//             {
//                 Email_id = columns[0],
//                 Name = columns[1],
//                 Country = columns[2],
//                 State = columns[3],
//                 City = columns[4],
//                 Telephone_number = int.TryParse(columns[5], out int tel) ? tel : 0,
//                 Address_line_1 = columns[6],
//                 Address_line_2 = columns[7],
//                 Date_of_birth = columns[8],
//                 Gross_salary_FY2019_20 = int.TryParse(columns[9], out int sal19) ? sal19 : 0,
//                 Gross_salary_FY2020_21 = int.TryParse(columns[10], out int sal20) ? sal20 : 0,
//                 Gross_salary_FY2021_22 = int.TryParse(columns[11], out int sal21) ? sal21 : 0,
//                 Gross_salary_FY2022_23 = int.TryParse(columns[12], out int sal22) ? sal22 : 0,
//                 Gross_salary_FY2023_24 = int.TryParse(columns[13], out int sal23) ? sal23 : 0
//             });

//             lineCount++;

//             if (records.Count == batchSize)
//             {
//                 await ConvertToQuery(records);
//                 records.Clear();
//             }
//         }
//         catch (Exception ex)
//         {
//             Console.WriteLine($"Error processing line: {ex.Message}");
//         }
//     }

//     // Process any remaining records
//     if (records.Count > 0)
//     {
//         await ConvertToQuery(records);
//     }
// }