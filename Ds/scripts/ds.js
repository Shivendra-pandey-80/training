class Node {
    constructor(sharedRow, sharedCol, value, nextRow = null, nextCol = null, prevCol = null, prevRow = null) {
        this.sharedRow = sharedRow;
        this.sharedCol = sharedCol
        this.value = value;
        this.nextRow = nextRow;
        this.nextCol = nextCol;
        this.prevRow = prevRow;
        this.prevCol = prevCol;
    }
    // Getter and setter for row and column
    get rowValue() {
        return this.sharedRow.value;
    }
    set rowValue(newValue) {
        this.sharedRow.value = newValue;
    }
    get colValue() {
        return this.sharedCol.value;
    }
    set colValue(newValue) {
        this.sharedCol.value = newValue;
    }
}
class SparseMatrix {
    constructor() {
        this.rowHeaders = {}; // Stores the head of each row linked list
        this.colHeaders = {}; // Stores the head of each column linked list
        this.sharedRows = {}; // Stores shared row objects
        this.sharedCols = {}; // Stores shared column objects
    }
    // Helper function to ensure shared row and column objects exist
    _ensureSharedRefs(row, col) {
        if (!this.sharedRows[row]) {
            this.sharedRows[row] = { value: null }; // Create shared row object
        }
        if (!this.sharedCols[col]) {
            this.sharedCols[col] = { value: null }; // Create shared column object
        }
    }
    // Check if a cell already exists at the given row and column
    _cellExists(row, col) {
        let current = this.rowHeaders[row];
        while (current) {
            if (current.colValue === col) {
                return true;
            }
            current = current.nextCol;
        }
        return false;
    }
    // Insert a cell with shared row and column references
    createCell(row, col, rowValue, colValue, value) {
        if (this._cellExists(row, col)) {
            console.log("try other location");
            return;
        }
        this._ensureSharedRefs(row, col);
        let newNode = new Node(this.sharedRows[row], this.sharedCols[col], value);
        // Insert into row list
        if (!this.rowHeaders[row]) {
            this._ensureSharedRefs(row, 0);
            let tempNode = new Node(this.sharedRows[row], { value: 0 });
            this.sharedCols[0].value = colValue;
            this.rowHeaders[row] = tempNode;
            tempNode.nextCol = newNode;
            newNode.prevCol = tempNode;
        } else {
            let current = this.rowHeaders[row];
            let prev = null;
            while (current && current.colValue < col) {
                prev = current;
                current = current.nextCol;
            }
            if (prev) {
                prev.nextCol = newNode;
                newNode.prevCol = prev;
            } else {
                this.rowHeaders[row] = newNode;
            }
            newNode.nextCol = current;
            if (current) {
                current.prevCol = newNode;
            }
        }
        // Insert into column list
        if (!this.colHeaders[col]) {
            this._ensureSharedRefs(0, col);
            let tempNode = new Node({ value: 0 }, this.sharedCols[col]);
            this.sharedRows[0].value = rowValue;
            this.colHeaders[col] = tempNode;
            tempNode.nextRow = newNode;
            newNode.prevRow = tempNode;
        } else {
            let current = this.colHeaders[col];
            let prev = null;
            while (current && current.rowValue < row) {
                prev = current;
                current = current.nextRow;
            }
            if (prev) {
                prev.nextRow = newNode;
                newNode.prevRow = prev;
            } else {
                this.colHeaders[col] = newNode;
            }
            newNode.nextRow = current;
            if (current) {
                current.prevRow = newNode;
            }
        }
        // Set the initial values
        this.sharedRows[row].value = rowValue;
        this.sharedCols[col].value = colValue;
    }
    //insert a Row
    insertRow(newRowIndex, rowValue) {
        // Handle edge case: invalid row index
        if (newRowIndex <= 0) {
            throw new Error("Invalid row index");
        }
        // Create shared reference for the new row
        this._ensureSharedRefs(newRowIndex, 0);
        this.sharedRows[newRowIndex].value = rowValue;
        // Create a new root node for the row
        let newRowRoot = new Node(this.sharedRows[newRowIndex], { value: 0 });
        // Insert the new row into the row headers
        let prevRow = null;
        let nextRow = null;
        for (let i = newRowIndex ; i >= 0; i--) {
            if (this.rowHeaders[i]) {
                prevRow = i;
                break;
            }
        }
        for (let i = newRowIndex ; ; i++) {
            if (this.rowHeaders[i]) {
                nextRow = i;
                break;
            }
        }
        // Update row links
        if (prevRow !== null) {
            newRowRoot.prevRow = this.rowHeaders[prevRow];
            this.rowHeaders[prevRow].nextRow = newRowRoot;
        }
        if (nextRow !== null) {
            newRowRoot.nextRow = this.rowHeaders[nextRow];
            this.rowHeaders[nextRow].prevRow = newRowRoot;
        }
        this.rowHeaders[newRowIndex] = newRowRoot;
    }
    //Actually shift cell right
    _shiftCellsRight(row, col) {
        let current = this.rowHeaders[row];
        let prev = null;
        // Find the position to start shifting
        while (current && current.colValue < col) {
            prev = current;
            current = current.nextCol;
        }
        // Shift cells to the right
        while (current) {
            let oldColValue = current.colValue;
            let newColValue = oldColValue + 1;
            this._ensureSharedRefs(row, newColValue);
            // Create a new node for the shifted cell
            let newNode = new Node(current.sharedRow, this.sharedCols[newColValue], current.value);
            // Adjust row pointers
            newNode.nextCol = current.nextCol;
            newNode.prevCol = prev;
            if (current.nextCol) {
                current.nextCol.prevCol = newNode;
            }
            if (prev) {
                prev.nextCol = newNode;
            } else {
                this.rowHeaders[row] = newNode;
            }
            // Adjust column pointers
            if (!this.colHeaders[newColValue]) {
                // Create a root node for the new column if it doesn't exist
                this._ensureSharedRefs(0, newColValue);
                let rootNode = new Node({ value: 0 }, this.sharedCols[newColValue]);
                this.colHeaders[newColValue] = rootNode;
            }
            let currentInNewCol = this.colHeaders[newColValue];
            while (currentInNewCol.nextRow && currentInNewCol.nextRow.rowValue < row) {
                currentInNewCol = currentInNewCol.nextRow;
            }
            // Insert the new node
            newNode.prevRow = currentInNewCol;
            newNode.nextRow = currentInNewCol.nextRow;
            currentInNewCol.nextRow = newNode;
            if (newNode.nextRow) {
                newNode.nextRow.prevRow = newNode;
            }
            // Remove the node from the old column
            if (current.prevRow) {
                current.prevRow.nextRow = current.nextRow;
            } else {
                this.colHeaders[oldColValue] = current.nextRow;
            }
            if (current.nextRow) {
                current.nextRow.prevRow = current.prevRow;
            }
            prev = newNode;
            current = newNode.nextCol;
        }
    }
    //Cell shift right function
    insertCellShiftRight(row, col, rowValue, colValue, value) {
        this._ensureSharedRefs(row, col);
        // Shift cells to the right
        this._shiftCellsRight(row, col);
        // Insert the new cell
        this.createCell(row, col, rowValue, colValue, value);
    }
    //Actual shift cell down
    _shiftCellsDown(row, col) {
        let current = this.colHeaders[col];
        let prev = null;
        // Find the position to start shifting
        while (current && current.rowValue < row) {
            prev = current;
            current = current.nextRow;
        }
        // Shift cells down
        while (current) {
            let oldRowValue = current.rowValue;
            let newRowValue = oldRowValue + 1;
            this._ensureSharedRefs(newRowValue, col);
            // Create a new node for the shifted cell
            let newNode = new Node(this.sharedRows[newRowValue], current.sharedCol, current.value);
            // Adjust column pointers
            newNode.nextRow = current.nextRow;
            newNode.prevRow = prev;
            if (current.nextRow) {
                current.nextRow.prevRow = newNode;
            }
            if (prev) {
                prev.nextRow = newNode;
            } else {
                this.colHeaders[col] = newNode;
            }
            // Adjust row pointers
            if (!this.rowHeaders[newRowValue]) {
                // Create a root node for the new row if it doesn't exist
                this._ensureSharedRefs(newRowValue, 0);
                let rootNode = new Node(this.sharedRows[newRowValue], { value: 0 });
                this.rowHeaders[newRowValue] = rootNode;
            }
            let currentInNewRow = this.rowHeaders[newRowValue];
            while (currentInNewRow.nextCol && currentInNewRow.nextCol.colValue < col) {
                currentInNewRow = currentInNewRow.nextCol;
            }
            // Insert the new node in the row
            newNode.prevCol = currentInNewRow;
            newNode.nextCol = currentInNewRow.nextCol;
            currentInNewRow.nextCol = newNode;
            if (newNode.nextCol) {
                newNode.nextCol.prevCol = newNode;
            }
            // Remove the node from the old row
            if (this.rowHeaders[oldRowValue] === current) {
                this.rowHeaders[oldRowValue] = current.nextCol;
                if (current.nextCol) {
                    current.nextCol.prevCol = null;
                }
            } else {
                if (current.prevCol) {
                    current.prevCol.nextCol = current.nextCol;
                }
                if (current.nextCol) {
                    current.nextCol.prevCol = current.prevCol;
                }
            }
            // Update shared references
            newNode.sharedRow = this.sharedRows[newRowValue];
            newNode.rowValue = newRowValue;
            prev = newNode;
            current = newNode.nextRow;
        }
        // Update the column's shared reference value
        if (this.colHeaders[col]) {
            this.colHeaders[col].colValue = col;
        }
    }
    //Cell shift down function
    insertCellShiftDown(row, col, rowValue, colValue, value) {
        this._ensureSharedRefs(row, col);
       // Shift cells down
       this._shiftCellsDown(row, col);
       // Insert the new cell
       this.createCell(row, col, rowValue, colValue, value);
    }
    // Print the matrix
    printMatrixbyrow() {
        for (let row in this.rowHeaders) {
            let current = this.rowHeaders[row];
            let rowValues = [];
            while (current) {
                rowValues.push(`${current.value}`);
                current = current.nextCol;
            }
            console.log(rowValues.join(' -> '));
        }
    }
    printMatrixbycol() {
        for (let col in this.colHeaders) {
            let current = this.colHeaders[col];
            let rowValues = [];
            while (current) {
                rowValues.push(`${current.value}`);
                current = current.nextRow;
            }
            console.log(rowValues.join(' -> '));
        }
    }
    printMatrix() {
        // Find the maximum row and column indices
        let maxRow = Math.max(...Object.keys(this.sharedRows).map(Number), ...Object.keys(this.rowHeaders).map(Number));
        let maxCol = Math.max(...Object.keys(this.sharedCols).map(Number), ...Object.keys(this.colHeaders).map(Number));
        // Initialize an empty matrix
        let matrix = [];
        for (let i = 0; i <= maxRow; i++) {
            matrix.push(new Array(maxCol + 1).fill(null));
        }
        // Fill the matrix with values from row headers
        for (let row in this.rowHeaders) {
            let current = this.rowHeaders[row];
            while (current) {
                matrix[row][current.colValue] = current.value;
                current = current.nextCol;
            }
        }
        // Fill any missing values from column headers
        for (let col in this.colHeaders) {
            let current = this.colHeaders[col];
            while (current) {
                if (matrix[current.rowValue][col] === null) {
                    matrix[current.rowValue][col] = current.value;
                }
                current = current.nextRow;
            }
        }
        // Print the matrix
        for (let i = 0; i <= maxRow; i++) {
            let rowStr = matrix[i].map(value => (value !== null ? value : '0')).join(' ');
            console.log(rowStr);
        }
    }
    
}
let matrix = new SparseMatrix();
console.log("Checking for insertion of col");
matrix.createCell(1, 1, 1, 1, "A");
matrix.createCell(1, 2, 1, 2, "B");
matrix.createCell(1, 3, 1, 3, "C");
matrix.createCell(1, 4, 1, 4, "D");
matrix.createCell(1, 6, 1, 6, "E");
console.log("Print A->B->C->D->E");
matrix.printMatrixbyrow();
console.log("Print original matrix A | B | C | D || E");
matrix.printMatrixbycol();
console.log("Checking for insertion of row");
matrix.createCell(2, 1, 2, 1, "G");
matrix.createCell(3, 1, 3, 1, "H");
matrix.createCell(4, 1, 4, 1, "I");
matrix.printMatrix();
console.log("checking for right shift insert")
matrix.insertCellShiftRight(4, 1, 4, 1, "1");
matrix.insertCellShiftRight(4, 1, 4, 1, "2");
matrix.insertCellShiftRight(4, 1, 4, 1, "3");
matrix.insertCellShiftRight(4, 1, 4, 1, "4");
matrix.insertCellShiftRight(3, 1, 3, 1, "5");
matrix.insertCellShiftRight(3, 1, 3, 1, "6");
matrix.insertCellShiftRight(3, 1, 3, 1, "7");
matrix.insertCellShiftRight(3, 1, 3, 1, "8");
console.log("Print 4 row 1-2-3-4-I ");
matrix.printMatrixbyrow();
console.log("Print for col ");
matrix.printMatrixbycol();
matrix.printMatrix();
console.log("checking for down shift insert")
matrix.insertCellShiftDown(2, 2, 2, 2, "X");
matrix.insertCellShiftDown(2, 2, 2, 2, "X");


console.log("Print 4 row 1-2-3-4-I ");
matrix.printMatrixbyrow();
console.log("Print for col ");
matrix.printMatrixbycol();
matrix.printMatrix();

console.log("Check for inserting a row")
matrix.insertRow(5,5);
matrix.printMatrixbyrow();
console.log("Print for col ");
matrix.printMatrixbycol();
matrix.printMatrix();
