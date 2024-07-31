let screen_width = screen.width;
let screen_height = screen.height;

const cell = {
    value: " ",
    isSelected: false
}

class spreadsheet{
    constructor(){
        const canvas = document.getElementById('spreadsheet');
        const ctx = canvas.getContext('2d');    
        const cellInput = document.getElementById('cellInput');
        const height = canvas.clientHeight;
        const width = canvas.clientWidth;
    }


}

// let screen_width = screen.width;
// let screen_height = screen.height;
// const canvas = document.getElementById('spreadsheet');
// const ctx = canvas.getContext('2d');
// const cellInput = document.getElementById('cellInput');

// const CELL_HEIGHT = 30;
// console.log(height/30)
// const ROWS = 400;
// const COLS = 16;
// const RESIZE_HANDLE_WIDTH = 5;

// let columnWidths = Array(COLS).fill(100);
// let data = Array(ROWS).fill().map(() => Array(COLS).fill(''));
// let isResizing = false;
// let resizingColumn = -1;

// function drawGrid() {
//     ctx.strokeStyle = '#ccc';
//     ctx.lineWidth = 1;

//     let x = 0;
//     for (let j = 0; j <= COLS; j++) {
//         ctx.beginPath();
//         ctx.moveTo(x, 0);
//         ctx.lineTo(x, ROWS * CELL_HEIGHT);
//         ctx.stroke();

//         if (j < COLS) { 
//             // Draw resize handle
//             ctx.fillStyle = '#f0f0f0';
//             ctx.fillRect(x - RESIZE_HANDLE_WIDTH / 2, 0, RESIZE_HANDLE_WIDTH, ROWS * CELL_HEIGHT);
//         }

//         if (j < COLS) x += columnWidths[j];
//     }

//     for (let i = 0; i <= ROWS; i++) {
//         ctx.beginPath();
//         ctx.moveTo(0, i * CELL_HEIGHT);
//         ctx.lineTo(canvas.width, i * CELL_HEIGHT);
//         ctx.stroke();
//     }
// }

// function drawCellContents() {
//     ctx.font = '14px Arial';
//     ctx.textAlign = 'left';
//     ctx.textBaseline = 'middle';
//     ctx.fillStyle = '#000';

//     let x = 0;
//     for (let j = 0; j < COLS; j++) {
//         for (let i = 0; i < ROWS; i++) {
//             ctx.fillText(data[i][j], x + 5, i * CELL_HEIGHT + CELL_HEIGHT / 2);
//         }
//         x += columnWidths[j];
//     }
// }

// function render() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     drawGrid();
//     drawCellContents();
// }

// function getColumnAtX(x) {
//     let accumulatedWidth = 0;
//     for (let i = 0; i < COLS; i++) {
//         accumulatedWidth += columnWidths[i];
//         if (x < accumulatedWidth) return i;
//     }
//     return -1;
// }

// function getColumnLeftPosition(col) {
//     let x = 0;
//     for (let i = 0; i < col; i++) {
//         x += columnWidths[i];
//     }
//     return x;
// }

// canvas.addEventListener('mousedown', (e) => {
//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     const col = getColumnAtX(x);

//     if (col > 0 && Math.abs(x - getColumnLeftPosition(col)) < RESIZE_HANDLE_WIDTH / 2) {
//         isResizing = true;
//         resizingColumn = col - 1;
//         canvas.style.cursor = 'col-resize';
//     } 
//     // else {.
//     //     console.log(x, y)
//     //     console.log("trying to select")

//     //     canvas.addEventListener('mousemove', (e) => {

//     //         const x = e.clientX - rect.left;
//     //         const y = e.clientY - rect.top;

//     //         console.log("mousemoving")
//     //         console.log(getColumnAtX(x));

//     //         const col = getColumnAtX(x);
//     //         const row = Math.floor(y / CELL_HEIGHT);

//     //         if (col !== -1 && row < ROWS) {

//     //         }
//     //     })
//     // }

//     canvas.addEventListener('mouseup',()=>{
//         return;
//     })
// });
// canvas.addEventListener('mousemove', (e) => {
//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;

//     if (isResizing) {
//         const newWidth = x - getColumnLeftPosition(resizingColumn);
//         if (newWidth > 10) {  // Minimum column width
//             columnWidths[resizingColumn] = newWidth;
//             render();
//         }
//     } else {
//         const col = getColumnAtX(x);
//         if (col > 0 && Math.abs(x - getColumnLeftPosition(col)) < RESIZE_HANDLE_WIDTH / 2) {
//             canvas.style.cursor = 'col-resize';
//         } else {
//             canvas.style.cursor = 'default';
//         }
//     }
// });

// canvas.addEventListener('mouseup', () => {
//     isResizing = false;
//     resizingColumn = -1;
//     canvas.style.cursor = 'default';
// });

// canvas.addEventListener('click', (e) => {
//     if (!isResizing) {
//         const rect = canvas.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;

//         const col = getColumnAtX(x);
//         const row = Math.floor(y / CELL_HEIGHT);

//         if (col !== -1 && row < ROWS) {
//             cellInput.style.display = 'block';
//             cellInput.style.left = `${rect.left + getColumnLeftPosition(col)}px`;
//             cellInput.style.top = `${rect.top + row * CELL_HEIGHT}px`;
//             cellInput.style.width = `${columnWidths[col]}px`;
//             cellInput.style.height = `${CELL_HEIGHT}px`;
//             cellInput.value = data[row][col];
//             cellInput.focus();

//             cellInput.onblur = () => {
//                 data[row][col] = cellInput.value;
//                 cellInput.style.display = 'none';
//                 render();
//             };
//         }
//     }
// });



// render();
