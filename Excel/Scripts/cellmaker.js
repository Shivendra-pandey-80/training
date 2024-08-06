class HeaderCell {
    constructor(x, y, width, height, value,row,col) {
        this.x = x;
        this.y = y;
        this.row = row;
        this.col = col;
        this.width = width;
        this.height = height;
        this.value = value;
        this.isSelected = false;
    }
}


export class HeaderCellManager {
    constructor(visibleWidth, visibleHeight, scale = 1) {
        this.minCellSize = 30;
        this.baseCellWidth = 80;
        this.baseCellHeight = 40;
        this.scale = scale;
        this.visibleWidth = visibleWidth * 2;
        this.visibleHeight = visibleHeight * 2;
        this.horizontalHeaderCells = new Map();
        this.verticalHeaderCells = new Map();
        this.customCellSizes = { horizontal: {}, vertical: {} };
        this.update(visibleWidth, visibleHeight, scale);
    }

    update(visibleWidth, visibleHeight, scale) {
        this.visibleWidth = visibleWidth;
        this.visibleHeight = visibleHeight;
        this.scale = scale;
        this.updateCells();
    }

    updateCells() {
        const cellWidth = Math.max(this.minCellSize, this.baseCellWidth * this.scale);
        const cellHeight = Math.max(this.minCellSize, this.baseCellHeight * this.scale);

        // Update horizontal cells
        const horizontalCellCount = Math.ceil(this.visibleWidth / cellWidth) + 1;
        for (let i = 0; i < horizontalCellCount; i++) {
            const x = i * cellWidth;
            if (!this.horizontalHeaderCells.has(i)) {
                this.horizontalHeaderCells.set(i, new HeaderCell(x, 0, cellWidth, this.minCellSize, this.numberToColumnName(i + 1), 0, i + 1));
            } else {
                const cell = this.horizontalHeaderCells.get(i);
                cell.width = cellWidth;
                cell.x = x;
            }
        }

        // Update vertical cells
        const verticalCellCount = Math.ceil(this.visibleHeight / cellHeight) + 1;
        for (let i = 0; i < verticalCellCount; i++) {
            const y = i * cellHeight;
            if (!this.verticalHeaderCells.has(i)) {
                this.verticalHeaderCells.set(i, new HeaderCell(0, y, this.minCellSize, cellHeight, i + 1, i + 1, 0));
            } else {
                const cell = this.verticalHeaderCells.get(i);
                cell.height = cellHeight;
                cell.y = y;
            }
        }
    }

    numberToColumnName(num) {
        let columnName = '';
        while (num > 0) {
            num--;
            columnName = String.fromCharCode(65 + (num % 26)) + columnName;
            num = Math.floor(num / 26);
        }
        return columnName;
    }

    

    getHorizontalHeaderCells(scrollX) {
        const cellWidth = Math.max(this.minCellSize, this.baseCellWidth * this.scale);
        const startIndex = Math.floor(scrollX / cellWidth);
        const visibleCells = [];
        for (let i = startIndex; i < startIndex + Math.ceil(this.visibleWidth / cellWidth) + 1; i++) {
            if (!this.horizontalHeaderCells.has(i)) {
                const x = i * cellWidth;
                this.horizontalHeaderCells.set(i, new HeaderCell(x, 0, cellWidth, this.minCellSize, this.numberToColumnName(i + 1), 0, i + 1));
            }
            const cell = this.horizontalHeaderCells.get(i);
            cell.x = i * cellWidth;
            visibleCells.push(cell);
        }

        return visibleCells;
    }

    getVerticalHeaderCells(scrollY) {
        const cellHeight = Math.max(this.minCellSize, this.baseCellHeight * this.scale);
        const startIndex = Math.floor(scrollY / cellHeight);
        const visibleCells = [];

        for (let i = startIndex; i < startIndex + Math.ceil(this.visibleHeight / cellHeight) + 1; i++) {
            if (!this.verticalHeaderCells.has(i)) {
                const y = i * cellHeight;
                this.verticalHeaderCells.set(i, new HeaderCell(0, y, this.minCellSize, cellHeight, i + 1, i + 1, 0));
            }
            const cell = this.verticalHeaderCells.get(i);
            cell.y = i * cellHeight;
            visibleCells.push(cell);
        }

        return visibleCells;
    }

    getTotalWidth() {
        return this.horizontalHeaderCells.size * Math.max(this.minCellSize, this.baseCellWidth * this.scale);
    }

    getTotalHeight() {
        return this.verticalHeaderCells.size * Math.max(this.minCellSize, this.baseCellHeight * this.scale);
    }

    setCustomCellSize(isHorizontal, index, size) {
        if (isHorizontal) {
            this.customCellSizes.horizontal[index] = size;
            if (this.horizontalHeaderCells.has(index)) {
                this.horizontalHeaderCells.get(index).width = size;
            }
        } else {
            this.customCellSizes.vertical[index] = size;
            if (this.verticalHeaderCells.has(index)) {
                this.verticalHeaderCells.get(index).height = size;
            }
        }
        this.updateCells();
    }

     
    getCellSize(type, index) {
        return type === 'horizontal'
            ? this.horizontalCells[index].width
            : this.verticalCells[index].height;
    }

    setCustomCellSize(type, index, size) {
        if (type === 'horizontal') {
            this.horizontalCells[index].width = size;
        } else {
            this.verticalCells[index].height = size;
        }

        // Update positions of subsequent cells
        this.updateCellPositions(type, index);
    }

    updateCellPositions(type, fromIndex) {
        console.log(this.horizontalHeaderCells)
        if (type === 'horizontal') {
            for (let i = fromIndex + 1; i < this.horizontalCells.length; i++) {
                this.horizontalCells[i].x = this.horizontalCells[i - 1].x + this.horizontalCells[i - 1].width;
            }
        } else {
            for (let i = fromIndex + 1; i < this.verticalCells.length; i++) {
                this.verticalCells[i].y = this.verticalCells[i - 1].y + this.verticalCells[i - 1].height;
            }
        }
    }
}