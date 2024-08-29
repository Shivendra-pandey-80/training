// [HttpGet("{tableName}")]
// public async Task<ActionResult<List<Dictionary<string, object>>>> GetData(string tableName, [FromQuery] int limit = 10, [FromQuery] int offset = 0)
// {
//     var listOfData = new List<Dictionary<string, object>>();

//     using (var connection = new MySqlConnection(dbConnString))
//     {
//         await connection.OpenAsync();

//         // Sanitize the table name to prevent SQL injection
//         string sanitizedTableName = MySqlHelper.EscapeString(tableName);

//         var query = $"SELECT * FROM `{sanitizedTableName}` LIMIT @limit OFFSET @offset";

//         using (var command = new MySqlCommand(query, connection))
//         {
//             command.Parameters.AddWithValue("@limit", limit);
//             command.Parameters.AddWithValue("@offset", offset);

//             using (var reader = await command.ExecuteReaderAsync())
//             {
//                 while (await reader.ReadAsync())
//                 {
//                     var row = new Dictionary<string, object>();
//                     for (int i = 0; i < reader.FieldCount; i++)
//                     {
//                         string columnName = reader.GetName(i);
//                         object value = reader.IsDBNull(i) ? null : reader.GetValue(i);
//                         row[columnName] = value;
//                     }
//                     listOfData.Add(row);
//                 }
//             }
//         }
//     }

//     return Ok(listOfData);
// }


// export class UploadAndFetch {
//   constructor(sheet) {
//     this.sheet = sheet;
//     this.data = null;
//     this.from = 0;
//     this.to = 10; // Initial batch size
//     this.tableName = null;
//   }

//   async uploadAndCreateTable() {
//     const formData = new FormData();
//     formData.append('file', this.sheet.file);

//     try {
//       const response = await fetch('/api/Data/uploadAndCreateTable', {
//         method: 'POST',
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const result = await response.json();
//       return result;
//     } catch (error) {
//       console.error('Error:', error);
//       throw error;
//     }
//   }

//   async createTableAndUpload(tableCreationRequest) {
//     try {
//       const response = await fetch('/api/Data/createTableAndUpload1', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(tableCreationRequest)
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const result = await response.json();
//       this.data = result;
//       this.tableName = tableCreationRequest.TableName;
//       return result;
//     } catch (error) {
//       console.error('Error:', error);
//       throw error;
//     }
//   }

//   async fetchMoreData() {
//     if (!this.tableName) {
//       throw new Error('Table name is not set. Please create a table first.');
//     }

//     try {
//       const response = await fetch(`/api/Data/fetchData`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           tableName: this.tableName,
//           from: this.from,
//           to: this.to
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const newData = await response.json();
//       this.data = this.data ? [...this.data, ...newData] : newData;
      
//       // Update from and to for the next fetch
//       this.from = this.to;
//       this.to += 10; // Increase by 10 each time, adjust as needed

//       return newData;
//     } catch (error) {
//       console.error('Error:', error);
//       throw error;
//     }
//   }

//   async checkMiscellaneousRows() {
//     if (!this.tableName) {
//       throw new Error('Table name is not set. Please create a table first.');
//     }

//     try {
//       const response = await fetch('/api/Data/checkMiscellaneousRows', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(this.tableName)
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error:', error);
//       throw error;
//     }
//   }

//   async handleMiscellaneousRows(action) {
//     if (!this.tableName) {
//       throw new Error('Table name is not set. Please create a table first.');
//     }

//     try {
//       const response = await fetch('/api/Data/handleMiscellaneousRows', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...action,
//           TableName: this.tableName
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error:', error);
//       throw error;
//     }
//   }
// }