
// This is used to make the excel in each div with name of rowCol{rownum}_{colnum}
export class Emaker{
    // The consturctor is used to call basic function and assigning basic values
    // excel gives the div in which you want to append the whole excel 
    constructor(excel,row,col){
        this.row = row; 
        this.col = col;
        this.excel = excel;
        this.createExcel();
        
 
    }

    createExcel(){

        // Setting up mutation observer , that only when new child get appended on excel this.init() get called
        const observer = new MutationObserver((mutationsList,observer)=>{
            for(let mutation of mutationsList){
                if(mutation.type === 'childList'){
                    this.init();
                    observer.disconnect();
                }
            }
        });

        observer.observe(this.excel,{childList: true});
       
        // topSection for appending the A,B,C,D canvas 
        let topSection = document.createElement('div');
        topSection.className = 'topSection';
        // nothing for nothing
        let nothing = document.createElement('div');
        nothing.className = 'nothing';
        // now adding the upper canvas 
        let upperCanvas = document.createElement('div');
        upperCanvas.className = 'upperCanvas';
        let horizontalCanvas = document.createElement('canvas');
        horizontalCanvas.setAttribute('id', `horizontalCanvas${this.row}_${this.col}`);
        horizontalCanvas.className = 'horizontalCanvas';
        // Appending all the element in the topsection
        upperCanvas.appendChild(horizontalCanvas);
        topSection.appendChild(nothing)
        topSection.appendChild(upperCanvas);

        // mid Section for canvases
        let midSection = document.createElement('div');
        midSection.className = 'middleSection';

        // vertical canvas for 1,2,3 
        let verticalCanvas = document.createElement('canvas');
        verticalCanvas.setAttribute('id', `verticalCanvas${this.row}_${this.col}`);
        verticalCanvas.className = 'verticalCanvas'

        // creating a div main-canvas and scrolling
        let fullCanvas = document.createElement('div');
        fullCanvas.setAttribute('id', `fullCanvas${this.row}_${this.col}`);
        fullCanvas.className = 'fullCanvas'

        // creating the main canvas
        let spreadsheetCanvas = document.createElement('canvas');
        spreadsheetCanvas.setAttribute('id', `spreadsheetCanvas${this.row}_${this.col}`);
        spreadsheetCanvas.className = 'spreadsheetCanvas'

        // creating the div for Vertical Scroll
        let verticalScroll = document.createElement('div');
        verticalScroll.setAttribute('id', `verticalScroll${this.row}_${this.col}`);
        verticalScroll.className = 'verticalScroll';

        // Creating the bar for the same
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

        midSection.appendChild(verticalCanvas);
        midSection.appendChild(fullCanvas);

        // Appending all the element on the excel
        this.excel.appendChild(topSection);
        this.excel.appendChild(midSection);


        
       
    }

    init() {


        // Calling all the element which are responsive and client can deal with them
        this.horizontalCanvas = document.getElementById(`horizontalCanvas${this.row}_${this.col}`);
        
        this.verticalCanvas = document.getElementById(`verticalCanvas${this.row}_${this.col}`);

        this.fullCanvas = document.getElementById(`fullCanvas${this.row}_${this.col}`);

        this.spreadsheetCanvas = document.getElementById(`spreadsheetCanvas${this.row}_${this.col}`);

        this.verticalScroll = document.getElementById(`verticalScroll${this.row}_${this.col}`);

        this.verticalBar = document.getElementById(`verticalBar${this.row}_${this.col}`);

        this.horizontalScroll = document.getElementById(`horizontalScroll${this.row}_${this.col}`);

        this.horizontalBar = document.getElementById(`horizontalBar${this.row}_${this.col}`);
        console.log(this.horizontalCanvas)

        this.horizontalCnvCtx = this.horizontalCanvas.getContext('2d');
        this.verticalCnvCtx = this.verticalCanvas.getContext('2d');
        this.spreadsheetCnvCtx = this.spreadsheetCanvas.getContext('2d');


        // Scalling Canvas 
        // We will scale the canvas individually , with respect to div, screen that scaling will take care of both

    
    }

    
}