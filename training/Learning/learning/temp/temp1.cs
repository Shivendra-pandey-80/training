// [HttpPost("uploadAndProcessFile")]
// public async Task<IActionResult> UploadAndProcessFile(IFormFile file)
// {
//     if (file == null || file.Length == 0)
//     {
//         return BadRequest("No file uploaded.");
//     }

//     string uploadPath = Path.Combine(Path.GetTempPath(), "uploads");
//     Directory.CreateDirectory(uploadPath);

//     int numberOfParts = 10;
//     var partFiles = new string[numberOfParts];

//     long partSize = file.Length / numberOfParts;

//     // Split the file into 10 parts
//     using (var stream = file.OpenReadStream())
//     {
//         var tasks = new Task[numberOfParts];
//         for (int i = 0; i < numberOfParts; i++)
//         {
//             int partIndex = i;
//             partFiles[partIndex] = Path.Combine(uploadPath, $"part_{partIndex}.csv");

//             tasks[partIndex] = Task.Run(() =>
//             {
//                 using var fileStream = new FileStream(partFiles[partIndex], FileMode.Create);
//                 long bytesToWrite = partSize;
//                 byte[] buffer = new byte[8192];
//                 int bytesRead;

//                 while (bytesToWrite > 0 && (bytesRead = stream.Read(buffer, 0, (int)Math.Min(buffer.Length, bytesToWrite))) > 0)
//                 {
//                     fileStream.Write(buffer, 0, bytesRead);
//                     bytesToWrite -= bytesRead;
//                 }
//             });
//         }

//         await Task.WhenAll(tasks);
//     }

//     // Concurrently process each part
//     var processTasks = partFiles.Select(partFile =>
//         Task.Run(() => ProcessFile(partFile))
//     );

//     await Task.WhenAll(processTasks);

//     return Ok("File uploaded and processed successfully.");
// }

// private async Task ProcessFile(string filePath)
// {
//     // Simulate processing of the file
//     using var reader = new StreamReader(filePath);
//     string? line;
//     var records = new List<DataModel>();

//     while ((line = await reader.ReadLineAsync()) != null)
//     {
//         if (string.IsNullOrWhiteSpace(line)) continue;
//         var columns = line.Split(',');

//         if (columns.Length < 14) continue;  // Skip invalid lines

//         records.Add(new DataModel
//         {
//             Email_id = columns[0],
//             Name = columns[1],
//             Country = columns[2],
//             // ...other columns
//         });

//         if (records.Count >= 10000)  // Process in batches
//         {
//             await ConvertToQuery(records);
//             records.Clear();
//         }
//     }

//     if (records.Count > 0)
//     {
//         await ConvertToQuery(records);
//     }

//     // Optionally delete the file after processing
//     File.Delete(filePath);
// }


// [HttpPost("uploadAndSplitStream")]
// public async Task<IActionResult> UploadAndSplitStream()
// {
//     string uploadPath = Path.Combine(Path.GetTempPath(), "uploads");
//     Directory.CreateDirectory(uploadPath);

//     int numberOfParts = 10;
//     var partFiles = new string[numberOfParts];
//     var partStreams = new StreamWriter[numberOfParts];

//     // Create and open 10 temporary files for writing
//     for (int i = 0; i < numberOfParts; i++)
//     {
//         partFiles[i] = Path.Combine(uploadPath, $"part_{i}.csv");
//         partStreams[i] = new StreamWriter(new FileStream(partFiles[i], FileMode.Create));
//     }

//     using var reader = new StreamReader(Request.Body);
//     int currentPart = 0;
//     long totalLinesRead = 0;
//     long linesPerPart = 1000;  // Set this based on your logic (e.g., dividing the stream)

//     string? line;
//     while ((line = await reader.ReadLineAsync()) != null)
//     {
//         // Write the line to the current part file
//         await partStreams[currentPart].WriteLineAsync(line);

//         totalLinesRead++;

//         // Check if we need to move to the next part
//         if (totalLinesRead >= linesPerPart && currentPart < numberOfParts - 1)
//         {
//             currentPart++;
//             totalLinesRead = 0;
//         }
//     }

//     // Close all part streams
//     for (int i = 0; i < numberOfParts; i++)
//     {
//         await partStreams[i].FlushAsync();
//         partStreams[i].Dispose();
//     }

//     // Now process each part concurrently
//     var processTasks = partFiles.Select(partFile =>
//         Task.Run(() => ProcessFile(partFile))
//     );

//     await Task.WhenAll(processTasks);

//     return Ok("File uploaded and split successfully.");
// }
