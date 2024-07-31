import {Emaker} from './emaker.js'

class Excel {
    constructor(rowContainer, row, col) {
        this.rowContainer = rowContainer;
        this.col = col;
        this.row = row;
        this.init();
    }

    init() {
        this.constructExcel();
    }
 
    constructExcel() {
        const excel = document.createElement('div');
        excel.className = 'excel resizable';
        excel.setAttribute('id', `rowCol${this.row}_${this.col}`);
        excel.setAttribute('role', 'gridcell');
        excel.setAttribute('aria-rowindex', this.row);
        excel.setAttribute('aria-colindex', this.col);
        this.rowContainer.appendChild(excel);
        this.element = excel;
        let excel1 = new Emaker(excel,this.row,this.col)
    }
}

class Grid_maker {
    constructor(mainContainer, maxRow, maxCol) {
        this.mainContainer = mainContainer;
        this.maxRow = maxRow;
        this.maxCol = maxCol;
        this.currentRowCount = 0;
        this.rowArr = [];
        this.init();
    }

    addNewRow() {
        if (this.currentRowCount >= this.maxRow) {
            alert("No more excels can be added");
            return;
        }

        this.currentRowCount += 1;
        const row = document.createElement('div');
        row.className = 'row';
        row.id = `row_${this.currentRowCount}`;
        row.style.display = 'grid';
        row.style.gridTemplateColumns = '100%';

        const excel = new Excel(row, this.currentRowCount, 1);
        this.rowArr[this.currentRowCount - 1] = [excel];
        this.mainContainer.appendChild(row);
        this.updateGridTemplateRows();
    }

    addNewCol(rowNum) {
        if (rowNum > this.currentRowCount) return;
        let colCount = this.rowArr[rowNum - 1].length;
        if (colCount >= this.maxCol) {
            alert("No more excels can be added");
            return;
        }

        colCount += 1;
        const row = document.getElementById(`row_${rowNum}`);
        const excel = new Excel(row, rowNum, colCount);
        this.rowArr[rowNum - 1].push(excel);
        this.updateGridTemplateColumns(row);
    }

    handleResize() {
        const MIN_SIZE = 50; // Minimum size in pixels
        let isResizing = false;
        let currentRow = null;
        let currentCol = null;
        let initialSize = 0;
        let initialMousePos = 0;
        let isColumn = false;
    
        const startResize = (e, element, column) => {
            isResizing = true;
            isColumn = column;
            if (isColumn) {
                currentCol = element;
                initialSize = element.offsetWidth;
            } else {
                currentRow = element.closest('.row');
                initialSize = currentRow.offsetHeight;
            }
            initialMousePos = isColumn ? e.clientX : e.clientY;
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
            if (isColumn) {
                currentCol.classList.add('resizing');
            } else {
                currentRow.classList.add('resizing');
            }
        };
    
        const resize = (e) => {
            if (!isResizing) return;
            const containerRect = this.mainContainer.getBoundingClientRect();
            const maxSize = isColumn ? containerRect.width : containerRect.height;
            
            const delta = (isColumn ? e.clientX : e.clientY) - initialMousePos;
            let newSize = Math.max(MIN_SIZE, Math.min(initialSize + delta, maxSize - (this.rowArr.length - 1) * MIN_SIZE));
            
            if (isColumn) {
                currentCol.style.width = `${newSize}px`;
            } else {
                currentRow.style.height = `${newSize}px`;
            }
            
            this.updateGridLayout();
        };
    
        const stopResize = () => {
            isResizing = false;
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
            if (isColumn) {
                currentCol.classList.remove('resizing');
            } else if (currentRow) {
                currentRow.classList.remove('resizing');
            }
            currentCol = null;
            currentRow = null;
        };
    
        this.mainContainer.addEventListener('mousemove', (e) => {
            const target = e.target.closest('.excel.resizable');
            if (!target) return;
    
            const rect = target.getBoundingClientRect();
            const isNearRightEdge = Math.abs(e.clientX - rect.right) < 5;
            const isNearBottomEdge = Math.abs(e.clientY - rect.bottom) < 5;
    
            if (isNearRightEdge) {
                this.mainContainer.style.cursor = 'col-resize';
            } else if (isNearBottomEdge) {
                this.mainContainer.style.cursor = 'row-resize';
            } else {
                this.mainContainer.style.cursor = 'default';
            }
        });
    
        this.mainContainer.addEventListener('mousedown', (e) => {
            const target = e.target.closest('.excel.resizable');
            if (!target) return;
    
            const rect = target.getBoundingClientRect();
            const isNearRightEdge = Math.abs(e.clientX - rect.right) < 5;
            const isNearBottomEdge = Math.abs(e.clientY - rect.bottom) < 5;
    
            if (isNearRightEdge) {
                startResize(e, target, true);
            } else if (isNearBottomEdge) {
                startResize(e, target, false);
            }
        });
    }
  
    updateGridLayout() {
        const containerRect = this.mainContainer.getBoundingClientRect();
        const totalWidth = containerRect.width;
        const totalHeight = containerRect.height;
    
        // Update column widths
        this.rowArr.forEach(row => {
            const columns = row.map(excel => excel.element.offsetWidth);
            const rowTotalWidth = columns.reduce((a, b) => a + b, 0);
            row[0].element.parentElement.style.gridTemplateColumns = columns.map(width => `${width / rowTotalWidth * 100}%`).join(' ');
        });
    
        // Update row heights
        const rowHeights = this.rowArr.map(row => row[0].element.parentElement.offsetHeight);
        const totalRowHeight = rowHeights.reduce((a, b) => a + b, 0);
        
        // Adjust row heights to fit container
        const adjustedRowHeights = rowHeights.map(height => (height / totalRowHeight) * totalHeight);
        
        this.mainContainer.style.gridTemplateRows = adjustedRowHeights.map(height => `${height / totalHeight * 100}%`).join(' ');
    
        // Update each row's height
        this.rowArr.forEach((row, index) => {
            row[0].element.parentElement.style.height = `${adjustedRowHeights[index]}px`;
        });
    }

    updateGridTemplateRows() {
        this.mainContainer.style.gridTemplateRows = Array(this.currentRowCount).fill(`${100 / this.currentRowCount}%`).join(' ');
    }

    updateGridTemplateColumns(row) {
        const colCount = row.children.length;
        row.style.gridTemplateColumns = Array(colCount).fill(`${100 / colCount}%`).join(' ');
    }

    init() {
        this.mainContainer.style.display = 'grid';
        this.mainContainer.style.gridTemplateRows = '100%';
        this.addNewRow();
        this.addNewCol(1);

        this.handleResize();
        this.updateGridLayout();
    }
}

function init(mainContainer) {
    new Grid_maker(mainContainer, 3, 3);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded");
    let mainContainer = document.getElementById("mainContainer");
    init(mainContainer);
});