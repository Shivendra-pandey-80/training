export class Scroll {
    constructor(fullCanvas, horizontalBar, horizontalScroll, verticalBar, verticalScroll) {
        this.fullCanvas = fullCanvas;
        this.horizontalBar = horizontalBar;
        this.horizontalScroll = horizontalScroll;
        this.verticalBar = verticalBar;
        this.verticalScroll = verticalScroll;
        this.init();
    }

    init() {
        this.updateHorizontalScrollBar();
        this.updateVerticalScrollBar();
    }

    updateScrollBar() {

    }

    updateGrid() {

    }


    updateHorizontalScrollBar() {

        this.horizontalBar.addEventListener('mousedown', (e) => {
            e.preventDefault();

            let isHorizontalScrolling = true;
            let startMouseX = e.clientX;
            let startBarLeft = this.horizontalBar.offsetLeft;
            let prevBarWidth = this.horizontalBar.offsetWidth;

            const onMouseMove = (e) => {
                e.preventDefault();
                if (isHorizontalScrolling) {
                    const currentMouseX = e.clientX;
                    const diffX = currentMouseX - startMouseX;
                    let newLeft = startBarLeft + diffX;
                    let maxBarLeft = this.horizontalScroll.clientWidth - this.horizontalBar.offsetWidth;

                    newLeft < 0 ? newLeft = 0 : "";

                    if (newLeft > maxBarLeft) {
                        newLeft = maxBarLeft;
                        this.horizontalBar.style.width = `${prevBarWidth * 0.9}px`;
                        this.horizontalBar.style.left = `${newLeft / 2}px`;
                        startBarLeft = this.horizontalScroll.clientWidth / 2;
                        startMouseX = e.clientX;
                        prevBarWidth = prevBarWidth * 0.9;
                    }
                    else {
                        this.horizontalBar.style.left = `${newLeft}px`
                    }


                }
            };

            const onMouseUp = (e) => {
                isHorizontalScrolling = false;
                this.fullCanvas.removeEventListener('mousemove', onMouseMove);
                this.fullCanvas.removeEventListener('mouseup', onMouseUp);
                this.fullCanvas.removeEventListener('mouseleave', onMouseUp)
            };

            this.fullCanvas.addEventListener('mousemove', onMouseMove);
            this.fullCanvas.addEventListener('mouseup', onMouseUp);
            this.fullCanvas.addEventListener('mouseleave', onMouseUp);
        });

    }

    updateVerticalScrollBar() {

        this.verticalBar.addEventListener('mousedown', (e) => {
            e.preventDefault();

            let isVerticalScrolling = true;
            let startMouseY = e.clientY;
            let startBarTop = this.verticalBar.offsetTop;
            let prevBarHeight = this.verticalBar.offsetHeight;

            const onMouseMove = (e) => {
                if (isVerticalScrolling) {
                    const currentMouseY = e.clientY;
                    const diffY = currentMouseY - startMouseY;
                    let newTop = startBarTop + diffY;
                    let maxBarTop = this.verticalScroll.clientHeight - this.verticalBar.offsetHeight;

                    newTop < 0 ? newTop = 0 : "";

                    if (newTop > maxBarTop) {
                        newTop = maxBarTop;
                        this.verticalBar.style.height = `${prevBarHeight * 0.9}px`;
                        this.verticalBar.style.top = `${newTop / 2}px`;
                        startBarTop = this.verticalScroll.clientHeight / 2;
                        startMouseY = e.clientY;
                        prevBarHeight = prevBarHeight * 0.9;
                    }

                    this.verticalBar.style.top = `${newTop}px`

                }
            };

            const onMouseUp = (e) => {
                isVerticalScrolling = false;
                this.fullCanvas.removeEventListener('mousemove', onMouseMove);
                this.fullCanvas.removeEventListener('mouseup', onMouseUp);
                this.fullCanvas.removeEventListener('mouseleave', onMouseUp);
            };

            this.fullCanvas.addEventListener('mousemove', onMouseMove);
            this.fullCanvas.addEventListener('mouseup', onMouseUp);
            this.fullCanvas.addEventListener('mouseleave', onMouseUp)
        });


    }

}


