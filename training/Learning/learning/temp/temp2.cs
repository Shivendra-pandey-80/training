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

//     using (var stream = file.OpenReadStream())
//     {
//         var tasks = new Task[numberOfParts];
//         using var reader = new StreamReader(stream);
        
//         for (int i = 0; i < numberOfParts; i++)
//         {
//             int partIndex = i;
//             partFiles[partIndex] = Path.Combine(uploadPath, $"part_{partIndex}.csv");

//             tasks[partIndex] = Task.Run(async () =>
//             {
//                 using var fileStream = new FileStream(partFiles[partIndex], FileMode.Create);
//                 using var writer = new StreamWriter(fileStream);

//                 long bytesWritten = 0;
//                 char[] buffer = new char[8192];
//                 int charsRead;

//                 while (bytesWritten < partSize && (charsRead = await reader.ReadAsync(buffer, 0, buffer.Length)) > 0)
//                 {
//                     await writer.WriteAsync(buffer, 0, charsRead);
//                     bytesWritten += Encoding.UTF8.GetByteCount(buffer, 0, charsRead);
//                 }

//                 // Ensure we complete the last line before splitting
//                 if (partIndex < numberOfParts - 1) // Skip for the last part
//                 {
//                     string? line;
//                     while ((line = await reader.ReadLineAsync()) != null)
//                     {
//                         await writer.WriteLineAsync(line);
//                         break;  // Write one additional line to complete the current part
//                     }
//                 }
//             });
//         }

//         await Task.WhenAll(tasks);
//     }

//     // Process each part concurrently
//     var processTasks = partFiles.Select(partFile =>
//         Task.Run(() => ProcessFile(partFile))
//     );

//     await Task.WhenAll(processTasks);

//     return Ok("File uploaded and processed successfully.");
// }