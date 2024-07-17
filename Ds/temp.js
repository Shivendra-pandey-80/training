insertCellShiftRight(row,col){
    let newNode = new Node(this.sharedRows[row],this.Shared[col])
    if (!this.rowHeaders[row]) {
        if (row == 0 ){
            this.rowHeaders[row] = newNode;
        }
        else{
            this._ensureSharedRefs(row,0)
            let tempNode = new Node(this.sharedRows[row], this.sharedCols[0])
            this.sharedCols[0].value = colValue;
            this.rowHeaders[row] = tempNode;
            tempNode.nextCol = newNode;
            newNode.prevCol = tempNode;
        }
    else{
        let current = this.rowHeaders[row];
            while (current.nextCol) {
                current = current.nextCol;
            }
            current.nextCol = newNode;
            newNode.prevCol = current;
    }
}