export class HeaderCellFunctionality {
    constructor(sheetRenderer) {
        this.sheetRenderer = sheetRenderer;
        this.isDragging = false;
        this.dragStart = null;
        this.dragType = null; // 'row' or 'column'
        this.dragIndex = null;
        this.targetIndex = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        const hCanvas = this.sheetRenderer.canvases.horizontal;
        const vCanvas = this.sheetRenderer.canvases.vertical;

        hCanvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        vCanvas.addEventListener('mousedown', this.handleMouseDown.bind(this));

        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('mousemove', this.handleDrag.bind(this));
    }

    handleMouseDown(event) {
        const canvas = event.target;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const isHorizontal = canvas === this.sheetRenderer.canvases.horizontal;
        const scrollOffset = isHorizontal
            ? this.sheetRenderer.scrollManager.getScroll().x
            : this.sheetRenderer.scrollManager.getScroll().y;
        const cells = isHorizontal
            ? this.sheetRenderer.headerCellManager.getHorizontalHeaderCells(scrollOffset)
            : this.sheetRenderer.headerCellManager.getVerticalHeaderCells(scrollOffset);

        this.isDragging = true;
        this.dragType = isHorizontal ? 'column' : 'row';
        this.dragIndex = this.getDragIndex(cells, x, y, isHorizontal);
        this.dragStart = { x, y };
        console.log(this.dragIndex)

        // Highlight the dragged cell
        this.sheetRenderer.highlightDraggedCell(this.dragIndex, this.dragType);
    }

    handleMouseUp(event) {
        if (this.isDragging) {
            this.isDragging = false;
            this.finalizeDrag(event);
          
            this.sheetRenderer.clearDragHighlight();
        }
    }

    handleDrag(event) {
        if (!this.isDragging) return;

        const canvas = this.dragType === 'column'
            ? this.sheetRenderer.canvases.horizontal
            : this.sheetRenderer.canvases.vertical;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Get the current scroll position
        const scrollX = this.sheetRenderer.scrollManager.getScroll().x;
        const scrollY = this.sheetRenderer.scrollManager.getScroll().y;

        // Get visible cells, accounting for scroll position
        const cells = this.dragType === 'column'
            ? this.sheetRenderer.headerCellManager.getHorizontalHeaderCells(scrollX)
            : this.sheetRenderer.headerCellManager.getVerticalHeaderCells(scrollY);

        // Calculate the position including scroll offset
        const adjustedX = x + scrollX;
        const adjustedY = y + scrollY;

        // Find the target index
        const newTargetIndex = this.getDragIndex(cells, adjustedX, adjustedY, this.dragType === 'column');

        // If the target index has changed, perform the swap
        if (newTargetIndex !== this.targetIndex && newTargetIndex !== this.dragIndex) {
            this.sheetRenderer.swapRowOrColumn(this.dragIndex, newTargetIndex, this.dragType);
            this.dragIndex = newTargetIndex;
        }

        this.targetIndex = newTargetIndex;

        // Update the visual feedback
        this.sheetRenderer.updateDragPosition(this.dragIndex, this.targetIndex, this.dragType, { x, y });
    }

    getDragIndex(cells, x, y, isHorizontal) {
        let accumulatedSize = 0;
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            const cellSize = isHorizontal ? cell.width : cell.height;
            const position = isHorizontal ? x : y;
            
            if (position >= accumulatedSize && position < accumulatedSize + cellSize) {
                // If we're in the first half of the cell, return the current index
                // Otherwise, return the next index (for inserting after)
                return position < accumulatedSize + cellSize / 2 ? i : i + 1;
            }
            
            accumulatedSize += cellSize;
        }
        
        // If we've gone past all cells, return the last index + 1
        return cells.length;
    }

    finalizeDrag(event) {
        this.isDragging = false;
        
        this.sheetRenderer.moveRowOrColumn(this.dragIndex, this.targetIndex, this.dragType);
        

        // Reset drag state
        this.dragStart = null;
        this.dragIndex = null;
        this.targetIndex = null;
    }
}