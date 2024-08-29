// fetchActualData(from, to) {
//   fetch(`https://localhost:7210/lazy/${from}/${to}`)
//     .then((response) => response.json())
//     .then((data) => {
//       // this.gridData.length = 0;
//       Object.keys(data[0]).forEach((d, i) => {
//         this.gridCols.push(d);
//       });
//       data.forEach((row, rowIndex) => {
//         this.gridData[rowIndex] = Object.values(row);
//         this.gridRows.push(rowIndex);
//       });
//      this.drawGrid();
//     })
//     .catch((error) => console.error("Error fetching data:", error));
// }