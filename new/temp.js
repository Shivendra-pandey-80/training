
//imports
import { Scroll } from './scripts/scroll.js'
import { MiniCanvas } from './scripts/miniCanvas.js';
import { LinkedList } from './scripts/linkedList.js'

export class Sheet {

    constructor(container,row,col,rowContainer) {
        this.row = row ;
        this.col = col;
        this.rowContainer = rowContainer

        console.log(container)
        this.mainContainer = container;
        this.horizontalCnvCtx = null;
        this.verticalCnvCtx = null;
        this.spreadsheetCnvCtx = null;
        

        this.horizontalCanvas = null;
        this.verticalCanvas = null;
        this.spreadsheetCanvas = null;


        this.verticalBar = null;
        this.horizontalBar = null;
        this.fullCanvas = null;
        this.horizontalScroll = null;
        this.verticalScroll = null;

        this.createCanvas()

        setTimeout(() => {

            console.log("calling init")
            this.init()

        }, 10);
    }

    createCanvas() {
        const topSection = document.createElement('div');
        topSection.className = 'topSection';

        const nothing = document.createElement('div');
        nothing.className = 'nothing'

        const upperCanvas = document.createElement('div');
        upperCanvas.className = 'upperCanvas';

        const horizontalCanvas = document.createElement('canvas');
        horizontalCanvas.setAttribute('id', `horizontalCanvas${this.row}_${this.col}`);
        horizontalCanvas.className = 'horizontalCanvas'


        upperCanvas.appendChild(horizontalCanvas);
        topSection.appendChild(nothing)
        topSection.appendChild(upperCanvas);

        let middleSection = document.createElement('div');
        middleSection.className = 'middleSection';

        let verticalCanvas = document.createElement('canvas');
        verticalCanvas.setAttribute('id', `verticalCanvas${this.row}_${this.col}`);
        verticalCanvas.className = 'verticalCanvas'


        let fullCanvas = document.createElement('div');
        fullCanvas.setAttribute('id', `fullCanvas${this.row}_${this.col}`);
        fullCanvas.className = 'fullCanvas'


        let spreadsheetCanvas = document.createElement('canvas');
        spreadsheetCanvas.setAttribute('id', `spreadsheetCanvas${this.row}_${this.col}`);
        spreadsheetCanvas.className = 'spreadsheetCanvas'


        let verticalScroll = document.createElement('div');
        verticalScroll.setAttribute('id', `verticalScroll${this.row}_${this.col}`);
        verticalScroll.className = 'verticalScroll';


        let verticalBar = document.createElement('div');
        verticalBar.className = 'verticalBar'
        verticalBar.setAttribute('id', `verticalBar${this.row}_${this.col}`)


        verticalScroll.appendChild(verticalBar)


        let horizontalScroll = document.createElement('div');
        horizontalScroll.setAttribute('id', `horizontalScroll${this.row}_${this.col}`);
        horizontalScroll.className = 'horizontalScroll';


        let horizontalBar = document.createElement('div');
        horizontalBar.setAttribute('id', `horizontalBar${this.row}_${this.col}`)
        horizontalBar.className = 'horizontalBar'


        horizontalScroll.appendChild(horizontalBar);

        fullCanvas.appendChild(spreadsheetCanvas);
        fullCanvas.appendChild(verticalScroll);
        fullCanvas.appendChild(horizontalScroll);

        middleSection.appendChild(verticalCanvas);
        middleSection.appendChild(fullCanvas);

        let inputEle = document.createElement('input');
        inputEle.setAttribute('type', 'text');
        inputEle.setAttribute('id', 'cellInput')

        this.mainContainer.appendChild(topSection);
        this.mainContainer.appendChild(middleSection);
        this.mainContainer.appendChild(inputEle)

        console.log("created canvas")




    }



    init() {

        this.horizontalCanvas = document.getElementById(`horizontalCanvas${this.row}_${this.col}`);
        console.log(this.horizontalCanvas)
        this.verticalCanvas = document.getElementById(`verticalCanvas${this.row}_${this.col}`);

        this.fullCanvas = document.getElementById(`fullCanvas${this.row}_${this.col}`);

        this.spreadsheetCanvas = document.getElementById(`spreadsheetCanvas${this.row}_${this.col}`);

        this.verticalScroll = document.getElementById(`verticalScroll${this.row}_${this.col}`);

        this.verticalBar = document.getElementById(`verticalBar${this.row}_${this.col}`);

        this.horizontalScroll = document.getElementById(`horizontalScroll${this.row}_${this.col}`);

        this.horizontalBar = document.getElementById(`horizontalBar${this.row}_${this.col}`);



        // this.horizontalCanvas.width = this.horizontalCanvas.parentElement.offsetWidth;
        // this.horizontalCanvas.height = this.horizontalCanvas.parentElement.offsetHeight;
        
        // this.verticalCanvas.width = this.verticalCanvas.parentElement.offsetWidth;
        // this.verticalCanvas.height = this.verticalCanvas.parentElement.offsetHeight;
        // this.spreadsheetanvaCs.width = this.spreadsheetCanvas.parentElement.offsetWidth;
        // this.spreadsheetCanvas.height = this.spreadsheetCanvas.parentElement.offsetHeight;


        this.horizontalCnvCtx = this.horizontalCanvas.getContext('2d');
        this.verticalCnvCtx = this.verticalCanvas.getContext('2d');
        this.spreadsheetCnvCtx = this.spreadsheetCanvas.getContext('2d');


        //scalling canvas
        this.scallingCanvas();


        //initiating Canvas Formation
        const inititalNumOfCols = 1000;
        const initialNumOfRows = 500;
        const initialWidthHorizontal = 100;
        const initialHeightHorizontal = this.horizontalCanvas.clientHeight;
        const initialWidthVertical = this.verticalCanvas.clientWidth;
        const initialHeightVertical = 30;
        const resizeWidth = 12;
        const resizeHeight = 8;

        const offsetSharpness = 0.5;


        // let miniCanvas = new MiniCanvas(initialNumOfRows, inititalNumOfCols, initialWidthHorizontal, initialHeightHorizontal, initialWidthVertical, initialHeightVertical, resizeWidth, resizeHeight, offsetSharpness, this.getCnv, this.getCtx)

        // const horizontalArr = miniCanvas.horizontalArr;
        // const verticalArr = miniCanvas.verticalArr;

        // const ll = new LinkedList(horizontalArr, verticalArr, miniCanvas);

        // //intiating ScrollFunctionalities
        // new Scroll(this.fullCanvas, this.horizontalBar, this.horizontalScroll, this.verticalBar, this.verticalScroll, miniCanvas);

    }


    get getCtx() {
        return [this.horizontalCnvCtx, this.verticalCnvCtx, this.spreadsheetCnvCtx];
    }

    get getCnv() {
        return [this.horizontalCanvas, this.verticalCanvas, this.spreadsheetCanvas]
    }

    scallingCanvas() {

        const dpr = window.devicePixelRatio;

        console.log(this.horizontalCanvas.clientWidth)
        console.log(this.horizontalCanvas.clientHeight)


        //scalling horizontal canvas

        this.horizontalCanvas.width = Math.floor(this.horizontalCanvas.clientWidth * dpr)
        this.horizontalCanvas.height = Math.floor(this.horizontalCanvas.clientHeight * dpr)

        // this.horizontalCnvCtx.scale(dpr, dpr)

        //scalling vertical canvas

        this.verticalCanvas.width = Math.floor(this.verticalCanvas.clientWidth * dpr)
        this.verticalCanvas.height = Math.floor(this.verticalCanvas.clientHeight * dpr)

        // this.verticalCnvCtx.scale(dpr, dpr)

        //scalling main canvas
        this.spreadsheetCanvas.width = Math.floor(this.spreadsheetCanvas.clientWidth * dpr)
        this.spreadsheetCanvas.height = Math.floor(this.spreadsheetCanvas.clientHeight * dpr)


        this.spreadsheetCnvCtx.scale(dpr, dpr)


    }


}