
insertRow(newRowIndex, rowValue) {
    // Handle edge case: invalid row index
    if (newRowIndex < 0) {
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
    for (let i = newRowIndex - 1; i >= 0; i--) {
        if (this.rowHeaders[i]) {
            prevRow = i;
            break;
        }
    }
    for (let i = newRowIndex + 1; ; i++) {
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
    // Iterate through all columns and insert nodes in the new row
    for (let col in this.colHeaders) {
        col = parseInt(col);
        this._ensureSharedRefs(newRowIndex, col);
        let newNode = new Node(this.sharedRows[newRowIndex], this.sharedCols[col], null);
        // Find the correct position in the column
        let current = this.colHeaders[col];
        let prev = null;
        while (current && current.rowValue < newRowIndex) {
            prev = current;
            current = current.nextRow;
        }
        // Insert the new node in the column
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
        // Link the new node in the row
        if (newRowRoot.nextCol) {
            let temp = newRowRoot.nextCol;
            newRowRoot.nextCol = newNode;
            newNode.prevCol = newRowRoot;
            newNode.nextCol = temp;
            temp.prevCol = newNode;
        } else {
            newRowRoot.nextCol = newNode;
            newNode.prevCol = newRowRoot;
        }
    }
}