// async performSearch() {
//     await this.fetch.find();  // Assuming this fetches the data
//     this.search_result = this.fetch.find_data;  // Fetched result
//     this.search_data = this.fetch.search.toLowerCase();  // Convert search term to lowercase
    
//     let rowColumnData = [];  // Array to store rowid and corresponding column index
  
//     // Iterate over each row
//     this.search_result.forEach((row) => {
//       let foundInColumnIndex = null;
  
//       // Get all the column names of the current row and iterate over them with their index
//       Object.keys(row).forEach((columnName, index) => {
//         if (this.isMatch(row[columnName])) {
//           foundInColumnIndex = index;  // Store the index of the column where the match is found
//         }
//       });
  
//       // If a match is found, store the rowid and column index info
//       if (foundInColumnIndex !== null) {
//         rowColumnData.push({
//           rowid: row.rowid+1,  // Store the rowid
//           columnIndex: foundInColumnIndex+2  // Store the column index where match was found
//         });
//       }
//     });
  
//     // Sort the results by rowid in ascending order
//     rowColumnData.sort((a, b) => {
//       return a.rowid - b.rowid;
//     });
  
//     // Log the first row-column pair
//     console.log("row",rowColumnData[0].rowid, "col",rowColumnData[0].columnIndex);
//     console.log("vertical",this.verticalCells[0], "horizontal",this.horizontalCells[0]);
  
//     // Start the scroll loop
//     this.scrollUntilTarget(rowColumnData[0].rowid);
//   }
  
//   // Helper function to check if the search term is a substring (case-insensitive)
//   isMatch(value) {
//     if (value) {
//       return value.toString().toLowerCase().includes(this.search_data);
//     }
//     return false;
//   }
  
//   // Recursive function that uses requestAnimationFrame to scroll until target row is reached
//   scrollUntilTarget(targetRow) {
//     // Perform the scroll action
//     this.scrollManager.scroll(0, 1);
  
//     // Check if the scroll position has reached the target row
//     console.log(this.verticalCells[0].row , targetRow)
//     if (this.verticalCells[0].row === targetRow) {
//       console.log("Target row reached:", targetRow);
//       return;  // Stop the animation loop when the target is reached
//     }
  
//     // Continue calling scroll until the target row is reached
//     requestAnimationFrame(() => this.scrollUntilTarget(targetRow));
//   }
  