// [HttpPost("uploadAndSplitStream")]
// public async Task<IActionResult> UploadAndSplitStream()
// {
//     Console.WriteLine("------------------------------------------");
//     Stopwatch stopwatch = new Stopwatch();
//     stopwatch.Start();

//     string uploadPath = Path.Combine(Path.GetTempPath(), "uploads");
//     Directory.CreateDirectory(uploadPath);
//     Console.WriteLine(uploadPath);

//     int numberOfParts = 10;
//     var partFiles = new string[numberOfParts];
//     var partStreams = new StreamWriter[numberOfParts];
//     var processTasks = new Task[numberOfParts];

//     // Initialize part files and streams
//     for (int i = 0; i < numberOfParts; i++)
//     {
//         partFiles[i] = Path.Combine(uploadPath, $"part_{i}.csv");
//         partStreams[i] = new StreamWriter(partFiles[i]);
//     }

//     using var reader = new StreamReader(Request.Body);
//     int currentPart = 0;
//     long totalLinesRead = 0;
//     long linesPerPart = 10000;

//     // Skip the first few lines (e.g., headers)
//     await reader.ReadLineAsync();  // Adjust the number of skipped lines based on your file
//     await reader.ReadLineAsync();
//     await reader.ReadLineAsync();
//     await reader.ReadLineAsync();
//     await reader.ReadLineAsync();

//     string? line;
//     while ((line = await reader.ReadLineAsync()) != null)
//     {
//         if (string.IsNullOrWhiteSpace(line))
//         {
//             continue;
//         }

//         await partStreams[currentPart].WriteLineAsync(line);
//         totalLinesRead++;

//         // Switch to next part if linesPerPart is reached
//         if (totalLinesRead >= linesPerPart && currentPart < numberOfParts - 1)
//         {
//             await partStreams[currentPart].FlushAsync();
//             partStreams[currentPart].Dispose();

//             int partIndex = currentPart;
//             processTasks[partIndex] = Task.Run(() => ProcessFile(partFiles[partIndex]));

//             currentPart++;
//             totalLinesRead = 0;
//         }
//     }

//     // Handle the last part
//     await partStreams[currentPart].FlushAsync();
//     partStreams[currentPart].Dispose();
//     processTasks[currentPart] = Task.Run(() => ProcessFile(partFiles[currentPart]));

//     // Wait for all processing tasks to complete
//     await Task.WhenAll(processTasks.Where(t => t != null));
//     stopwatch.Stop();
//     TimeSpan elapsed = stopwatch.Elapsed;
//     Console.WriteLine($"Total Elapsed time after Restart: {elapsed}");

//     return Ok("File uploaded, split, and processed successfully.");
// }

// private async Task ProcessFile(string filePath)
// {
//     try
//     {
//         // Simulate processing using LOAD DATA INFILE
//         var connectionString = "your-connection-string";  // Replace with your actual connection string

//         using (var connection = new MySqlConnection(connectionString))
//         {
//             await connection.OpenAsync();

//             var loadQuery = $@"
//                 LOAD DATA INFILE '{filePath.Replace("\\", "/")}'
//                 INTO TABLE usertest2
//                 FIELDS TERMINATED BY ',' 
//                 ENCLOSED BY '\"'
//                 LINES TERMINATED BY '\n'
//                 IGNORE 1 LINES
//                 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24);";

//             using (var command = new MySqlCommand(loadQuery, connection))
//             {
//                 await command.ExecuteNonQueryAsync();
//             }
//         }
//     }
//     catch (Exception ex)
//     {
//         Console.WriteLine($"Error processing file {filePath}: {ex.Message}");
//     }
// }



// LOAD DATA INFILE 'C:\\ProgramData\\MySQL2\\MySQL Server 8.0\\Uploads\\uploads\\part_0.csv' INTO TABLE usertest2
//                 FIELDS TERMINATED BY ',' 
//                 LINES TERMINATED BY '\n'; 