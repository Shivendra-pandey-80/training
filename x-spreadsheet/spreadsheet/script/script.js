document.addEventListener('DOMContentLoaded', function() {
    var sheetContainer = document.getElementById('sheetContainer');
    var rowContainer = document.getElementById('rowContainer');
    var columnContainer = document.getElementById('columnContainer');

    function syncScroll(e) {
        if (e.target === sheetContainer) {
            rowContainer.scrollTop = sheetContainer.scrollTop;
            columnContainer.scrollLeft = sheetContainer.scrollLeft;
        } 
    }

    sheetContainer.addEventListener('scroll', syncScroll);
});


document.addEventListener('DOMContentLoaded',function(){

    // calling all the DOM component
    var sheetContainer = document.getElementById('sheetContainer');
    var rowContainer = document.getElementById('rowContainer');
    var columnContainer = document.getElementById('columnContainer');
    var sheetCanvas = document.getElementById('spreadsheet');
    var rowCanvas = document.getElementById('row');
    var columnCanvas = document.getElementById('column');
    var sheetCtx = sheetCanvas.getContext('2d');
    var rowCtx = rowCanvas.getContext('2d');
    var columnCtx = columnCanvas.getContext('2d');

    MIN_cellheight = 30;
    MIN_cellwidth = 30;
    const ROWS = 400;
    const COLS = 32;
    const RESIZE_HANDLE_WIDTH = 5;

    let columnWidths = Array(COLS).fill(100);
    let columnheight = Array(COLS).fill(100)
    let data = Array(ROWS).fill().map(() => Array(COLS).fill(''));

    var pageSize = 50; // Number of rows/columns to load per page

    var resizingRow = false;
    var resizingCol = false;

    // Set canvas sizes
    sheetCanvas.width = sheetContainer.clientWidth;
    sheetCanvas.height = sheetContainer.clientHeight;
    rowCanvas.width = rowContainer.clientWidth;
    rowCanvas.height = sheetContainer.clientHeight;
    columnCanvas.width = sheetContainer.clientWidth;
    columnCanvas.height = columnContainer.clientHeight;

    function render(ctx,canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawCellContents();
    }

    function drawGrid(){
        render(sheetCtx, sheetCanvas);
        render(rowCtx, rowCanvas);
        render(columnCtx, columnCanvas);

        sheetCtx.strokeStyle = '#ddd';
        rowCtx.strokeStyle = '#ddd';
        columnCtx.strokeStyle = '#ddd';
        sheetCtx.lineWidth = 1;
        rowCtx.lineWidth = 1;
        columnCtx.lineWidth = 1;
        
        for (let c = 0; c<= COLS; c++){
            var x = offsetX + c*colWidth;
            sheetCtx.beginPath();
            sheetCtx.moveTo(0, y);
            sheetCtx.lineTo(sheetCanvas.width, y);
            sheetCtx.stroke();

            if (offsetX === 0) {
                rowCtx.beginPath();
                rowCtx.moveTo(0, y);
                rowCtx.lineTo(rowCanvas.width, y);
                rowCtx.stroke();
            }

            if (j < COLS) { 
                // Draw resize handle
                ctx.fillStyle = '#f0f0f0';
                ctx.fillRect(x - RESIZE_HANDLE_WIDTH / 2, 0, RESIZE_HANDLE_WIDTH, ROWS * CELL_HEIGHT);
            }
                    
        }

        // To draw rows
        for (let i = 0; i <= ROWS; i++) {
            var x = offsetX + c * colWidth;
            sheetCtx.beginPath();
            sheetCtx.moveTo(x, offsetY);
            sheetCtx.lineTo(x, offsetY + rows * rowHeight);
            sheetCtx.stroke();

            if (offsetY === 0) { 
                columnCtx.beginPath();
                columnCtx.moveTo(x, 0);
                columnCtx.lineTo(x, columnCanvas.height);
                columnCtx.stroke();
            }

            if (i < COLS) { 
                // Draw resize handle
                ctx.fillStyle = '#f0f0f0';
                ctx.fillRect(x - RESIZE_HANDLE_WIDTH / 2, 0, RESIZE_HANDLE_WIDTH, ROWS * CELL_HEIGHT);
            }

        }


       

    }


})

document.addEventListener('DOMContentLoaded', function() {
    var sheetContainer = document.getElementById('sheetContainer');
    var rowContainer = document.getElementById('rowContainer');
    var columnContainer = document.getElementById('columnContainer');
    var sheetCanvas = document.getElementById('spreadsheet');
    var rowCanvas = document.getElementById('row');
    var columnCanvas = document.getElementById('column');
    var sheetCtx = sheetCanvas.getContext('2d');
    var rowCtx = rowCanvas.getContext('2d');
    var columnCtx = columnCanvas.getContext('2d');

    var rowHeight = 20; // Height of each row
    var colWidth = 100; // Width of each column
    var pageSize = 50; // Number of rows/columns to load per page
    var totalRows = 0;
    var totalCols = 0;

    var resizingRow = false;
    var resizingCol = false;
    var startY, startX;
    var resizeRowIndex, resizeColIndex;

    // Set canvas sizes
    sheetCanvas.width = sheetContainer.clientWidth;
    sheetCanvas.height = sheetContainer.clientHeight;
    rowCanvas.width = rowContainer.clientWidth;
    rowCanvas.height = sheetContainer.clientHeight;
    columnCanvas.width = sheetContainer.clientWidth;
    columnCanvas.height = columnContainer.clientHeight;

    function clearCanvas(ctx, canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawGrid(rows, cols, offsetY, offsetX) {
        clearCanvas(sheetCtx, sheetCanvas);
        clearCanvas(rowCtx, rowCanvas);
        clearCanvas(columnCtx, columnCanvas);

        sheetCtx.strokeStyle = '#ddd';
        rowCtx.strokeStyle = '#ddd';
        columnCtx.strokeStyle = '#ddd';

        for (var r = 0; r < rows; r++) {
            var y = offsetY + r * rowHeight;
            sheetCtx.beginPath();
            sheetCtx.moveTo(0, y);
            sheetCtx.lineTo(sheetCanvas.width, y);
            sheetCtx.stroke();

            if (offsetX === 0) { // Draw row labels
                rowCtx.beginPath();
                rowCtx.moveTo(0, y);
                rowCtx.lineTo(rowCanvas.width, y);
                rowCtx.stroke();
            }
        }

        for (var c = 0; c < cols; c++) {
            var x = offsetX + c * colWidth;
            sheetCtx.beginPath();
            sheetCtx.moveTo(x, offsetY);
            sheetCtx.lineTo(x, offsetY + rows * rowHeight);
            sheetCtx.stroke();

            if (offsetY === 0) { // Draw column labels
                columnCtx.beginPath();
                columnCtx.moveTo(x, 0);
                columnCtx.lineTo(x, columnCanvas.height);
                columnCtx.stroke();
            }
        }
    }

    function loadMoreRows() {
        var rowsToAdd = pageSize;
        var colsToAdd = Math.ceil(sheetCanvas.width / colWidth);

        drawGrid(rowsToAdd, colsToAdd, totalRows * rowHeight, 0);
        totalRows += rowsToAdd;
    }

    function loadMoreColumns() {
        var colsToAdd = pageSize;
        var rowsToAdd = Math.ceil(sheetCanvas.height / rowHeight);

        drawGrid(rowsToAdd, colsToAdd, 0, totalCols * colWidth);
        totalCols += colsToAdd;
    }

    function checkScroll() {
        var scrollHeight = sheetContainer.scrollHeight;
        var scrollTop = sheetContainer.scrollTop;
        var clientHeight = sheetContainer.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight * 0.75) {
            loadMoreRows();
        }
    }

    function syncScroll() {
        rowContainer.scrollTop = sheetContainer.scrollTop;
        columnContainer.scrollLeft = sheetContainer.scrollLeft;
    }

    function onMouseDown(e) {
        var rect = columnCanvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        if (y <= rowHeight) {
            resizeColIndex = Math.floor(x / colWidth);
            startX = x;
            resizingCol = true;
            columnCanvas.style.cursor = 'col-resize';
        }

        rect = rowCanvas.getBoundingClientRect();
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;

        if (x <= colWidth) {
            resizeRowIndex = Math.floor(y / rowHeight);
            startY = y;
            resizingRow = true;
            rowCanvas.style.cursor = 'row-resize';
        }
    }

    function onMouseMove(e) {
        if (resizingCol) {
            var rect = columnCanvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            colWidth += x - startX;
            startX = x;
            drawGrid(totalRows, totalCols, 0, 0);
        }

        if (resizingRow) {
            var rect = rowCanvas.getBoundingClientRect();
            var y = e.clientY - rect.top;
            rowHeight += y - startY;
            startY = y;
            drawGrid(totalRows, totalCols, 0, 0);
        }
    }

    function onMouseUp() {
        resizingRow = false;
        resizingCol = false;
        columnCanvas.style.cursor = 'default';
        rowCanvas.style.cursor = 'default';
    }

    sheetContainer.addEventListener('scroll', function() {
        checkScroll();
        syncScroll();
    });

    columnCanvas.addEventListener('mousedown', onMouseDown);
    rowCanvas.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    loadMoreRows();
    loadMoreColumns();
});

