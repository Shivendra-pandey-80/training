handleScrolling(event) {
    console.log(event.movementX)
    const { x, y } = this.getCanvasCoordinates(event);
    const { x: scrollX, y: scrollY } = this.sheetRenderer.scrollManager.getScroll();

    // Check if the pointer is near the edges to trigger scrolling
    const edgeDistance = 30; // Distance from edge to start scrolling
    const canvas = this.sheetRenderer.canvases.spreadsheet;
    if (x-scrollX < canvas.clientWidth -edgeDistance) {
        // this.sheetRenderer.scrollManager.scroll(-10, 0); // Scroll left
        // console.log("left");
        // console.log(x-scrollX, canvas.clientWidth,edgeDistance)
    } else if (x-scrollX > canvas.clientWidth - edgeDistance) {
        this.sheetRenderer.scrollManager.scroll(10, 0); // Scroll right
        // console.log("right");
        // console.log(x-scrollX, canvas.clientWidth,edgeDistance)
    }

    if (y < canvas.clientHeight + scrollY) {
        this.sheetRenderer.scrollManager.scroll(0, -10); // Scroll up
    } else if (y > canvas.clientHeight - edgeDistance) {
        this.sheetRenderer.scrollManager.scroll(0, 10); // Scroll down
    }
    
}
