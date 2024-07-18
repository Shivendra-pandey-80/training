
//imports
import { Scroll } from '../scripts/scroll.js'
// import {Canvas} from '../scripts/canvas.js'

import { MiniCanvas } from './scripts/miniCanvas.js';


import { LinkedList } from './scripts/linkedList.js'

//onPageLoaded
document.addEventListener('DOMContentLoaded', (e) => {

    console.log("DOM Content Loaded");

    //All Initializations
    const verticalBar = document.getElementById('verticalBar')
    const horizontalBar = document.getElementById('horizontalBar')
    const fullCanvas = document.getElementById('fullCanvas')
    const horizontalScroll = document.getElementById('horizontalScroll')
    const verticalScroll = document.getElementById('verticalScroll')


    const horizontalCanvas = document.getElementById('horizontalCanvas')
    const verticalCanvas = document.getElementById('verticalCanvas')
    const spreadsheetCanvas = document.getElementById('spreadsheetCanvas')

    //intiating ScrollFunctionalities
    new Scroll(fullCanvas, horizontalBar, horizontalScroll, verticalBar, verticalScroll);

    //initiating Canvas Formation
    const numOfCols = 10;
    const numOfRows = 10;
    const initialWidth = 100;
    const initialHeight = 30;


    let miniCanvas = new MiniCanvas(numOfRows, numOfCols, 100, 30, 60, 30)

    const horizontalArr = miniCanvas.horizontalArr;
    const verticalArr = miniCanvas.verticalArr;

    const ll = new LinkedList(horizontalArr, verticalArr, miniCanvas);
    ll.createNewNode(1, 1, "a");
    ll.createNewNode(1, 2, "a");
    ll.createNewNode(1, 3, "a");

    ll.createNewNode(2, 1, "b1");
    ll.createNewNode(2, 2, "b2");
    ll.createNewNode(2, 3, "b3");

    ll.createNewNode(3, 1, "c");
    ll.createNewNode(3, 2, "c");
    ll.createNewNode(3, 3, "c");

    // ll.createNewNode(10,10,"shivendra")

    // ll.insertACellInRowBeforeInd(2,2,"new")
    ll.insertAndShiftRight(1, 1, "afirst")
    ll.insertAndShiftRight(3, 3, "new 1")
    ll.insertAndShiftRight(3, 3, "new 2")
    ll.insertAndShiftRight(3, 3, "new 3")


    // ll.insertARow(2);
    // ll.insertACol(5);
    // ll.createNewNode(5,5,"5 wala")
    // ll.createNewNode(50,50,"50 wala")
    // ll.insertARow(5);
    setTimeout(() => {

        miniCanvas.printArrs()

    }, 2000);
    // for (let i = 0; i < verticalArr.length; i++) {
    //     console.log(verticalArr[i].next)
    //     if (verticalArr[i].next) {
    //         let temp = verticalArr[i].next;
    //         while (temp.right) {
    //             // console.log(temp.data)
    //             temp = temp.right;
    //         }
    //     }
    // }

    console.log("column wise")
    for (let i = 0; i < horizontalArr.length; i++) {
        console.log(horizontalArr[i].next)
        if (horizontalArr[i].next) {
            let temp = horizontalArr[i].next;
            while (temp.bottom) {
                // console.log(temp.data)
                temp = temp.bottom;
            }
        }
    }




})

