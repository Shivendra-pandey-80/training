
class Node {
    constructor(row, col, data) {
        this.row = row;
        this.col = col;
        this.data = data;
        this.left = null;
        this.right = null;
        this.top = null;
        this.bottom = null;
    }
}

export class LinkedList {

    // Initialize Class Variables
    constructor(horizontalArr, verticalArr, miniCanvas) {
        this.horizontalArr = horizontalArr;
        this.verticalArr = verticalArr;
        this.miniCanvas = miniCanvas;
        this.head = null;
        this.size = 0;
    }

    len() {
        return this.size
    }

    isempty() {
        return this.size == 0
    }

    createNewNode(row, col, data) {

        let rowInd = row - 1;
        let colInd = col - 1;

        let newNode = new Node(this.verticalArr[rowInd].value, this.horizontalArr[colInd].value, data)

        //keep the head at first element
        if (this.isempty())
            this.head = newNode;

        //placing along row
        if (!this.verticalArr[rowInd].next) {
            //if first element in row
            this.verticalArr[rowInd].next = newNode;
        }
        else if (this.verticalArr[rowInd].next.col > col) {
            //if first element in row but replaced
            let tempNode = this.verticalArr[row].next;
            newNode.right = tempNode;
            this.verticalArr[rowInd].next = newNode;
            tempNode.left = newNode;
        }
        else {
            let temp = this.verticalArr[rowInd].next;
            while (temp.right != null && temp.right.col.data < col) {
                temp = temp.right;
            }
            if (temp.right != null) {
                newNode.right = temp.right;
                temp.right.left = newNode;
            }
            temp.right = newNode;
            newNode.left = temp;
        }

        //placing along column
        if (!this.horizontalArr[colInd].next) {
            //first element in col
            this.horizontalArr[colInd].next = newNode;
        } else if (this.horizontalArr[colInd].next.row.data > row) {
            //replaced first element in column
            let tempNode = this.horizontalArr[colInd].next;
            newNode.bottom = tempNode;
            this.horizontalArr[colInd].next = newNode;
            tempNode.top = newNode;
        }
        else {
            let temp = this.horizontalArr[colInd].next;
            while (temp.bottom != null && temp.bottom.row.data < row) {
                temp = temp.bottom;
            }
            if (temp.bottom != null) {
                newNode.bottom = temp.bottom;
                temp.bottom.top = newNode;
            }
            temp.bottom = newNode;
            newNode.top = temp;
        }
        this.size += 1
    }

    deleteNode(row, col) {

        let rowInd = row - 1;
        let colInd = col - 1;

        if (!this.verticalArr[rowInd].next || this.verticalArr[rowInd].next.row.data > row) {
            // not found
        }
        let temp = this.verticalArr[rowInd].next;

        if (this.verticalArr[rowInd].next.col.data == col) {
            // first element of row

            temp.right ? temp.right.left = null : "";

            this.horizontalArr[colInd].next == temp ? this.horizontalArr[colInd].next = temp.bottom : this.horizontalArr[colInd].next = null;
            this.verticalArr[rowInd].next = temp.right;
        }
        else {
            // found else where

            while (temp.right != null && temp.col.data != col) {
                temp = temp.right;
            }
            if (temp.col.data == col) {
                temp.left ? temp.left.right = temp.right : ""
                temp.right ? temp.right.left = temp.left : ""
            }
        }


        temp.top ? temp.top.bottom = temp.bottom : "";
        temp.bottom ? temp.bottom.top = temp.top : "";

        temp.left = null;
        temp.right = null;
        temp.top = null;
        temp.bottom = null;


    }


    insertARow(ind) {
        let rowInd = ind - 1;
        this.miniCanvas.addRowAtInd(rowInd)
    }

    insertACol(ind) {
        let colInd = ind - 1;
        this.miniCanvas.addColAtInd(colInd)
    }

    deleteARow(ind) {
        let rowInd = ind - 1;
        this.miniCanvas.deleteRowAtInd(rowInd)
    }

    deleteACol(ind) {
        let colInd = ind - 1;
        this.miniCanvas.deleteColAtInd(colInd)
    }


    insertAndShiftRight(row, col, value) {

        let newNode = new Node(this.verticalArr[row - 1].value, this.horizontalArr[col - 1].value, value);

        let temp = this.verticalArr[row - 1].next;
        console.log(temp)

        while (temp.col.data < col) {
            temp = temp.right;
        }

        let currEle = temp;

        let topOfCurr = currEle.top;
        let bottomOfCurr = currEle.bottom;
        let leftOfCurr = currEle.left;
        let rightOfCurr = currEle.right;

        if (leftOfCurr) {
            leftOfCurr.right = newNode;
        }
        else {
            this.verticalArr[row - 1].next = newNode;
        }

        newNode.left = leftOfCurr;
        newNode.right = currEle;
        currEle.left = newNode;

        newNode.top = topOfCurr;
        newNode.bottom = bottomOfCurr;

        topOfCurr ? topOfCurr.bottom = newNode : ""
        bottomOfCurr ? bottomOfCurr.top = newNode : ""

        if(this.horizontalArr[row-1].next == currEle){
            this.horizontalArr[row-1].next = newNode;
        }

        temp = currEle;
        let nextEle = rightOfCurr;

        console.log(temp)

        while (temp != null) {
            let ind = temp.col.data;
            console.log(ind)
            console.log(temp.col.data)
            console.log(temp)
            temp.col = this.horizontalArr[ind].value;
            if (nextEle != null) {
                
                temp.top = nextEle.top;
                temp.bottom = nextEle.bottom;

                nextEle.top ? nextEle.top.bottom = temp : this.horizontalArr[nextEle.col.data - 1].next = temp;
                nextEle.bottom ? nextEle.bottom.top = temp : ""

                nextEle = nextEle.right;

            }
            else {
                let nextColInd = temp.col.data-1;
                console.log(nextColInd , temp,nextEle)
                let verticalTemp = this.horizontalArr[nextColInd].next;

                if (verticalTemp==null) {
                    this.horizontalArr[nextColInd].next = temp;
                    temp.bottom = null;
                    temp.top = null;
                }
                else {
                    console.log(verticalTemp)
                    // console.log(row,col,value)
                    while (verticalTemp.bottom != null && verticalTemp.row.data < row) {
                        verticalTemp = verticalTemp.bottom;
                    }
                    temp.bottom = verticalTemp.bottom;
                    temp.top = verticalTemp;

                    verticalTemp.bottom ? verticalTemp.bottom.top = temp : ""
                    verticalTemp.bottom = temp;

                }

            }
            temp = temp.right;
        }


    }




    // insertAndShiftDown(row, col, value) {

    //     let newNode = new Node(this.verticalArr[row - 1].value, this.horizontalArr[col - 1].value, value);

    //     let temp = this.verticalArr[row - 1].next;
    //     console.log(temp)

    //     while (temp.col.data < col) {
    //         temp = temp.right;
    //     }

    //     let currEle = temp;

    //     let topOfCurr = currEle.top;
    //     let bottomOfCurr = currEle.bottom;
    //     let leftOfCurr = currEle.left;
    //     let rightOfCurr = currEle.right;

    //     if (leftOfCurr) {
    //         leftOfCurr.right = newNode;
    //     }
    //     else {
    //         this.verticalArr[row - 1].next = newNode;
    //     }

    //     newNode.left = leftOfCurr;
    //     newNode.right = currEle;
    //     currEle.left = newNode;

    //     newNode.top = topOfCurr;
    //     newNode.bottom = bottomOfCurr;

    //     topOfCurr ? topOfCurr.bottom = newNode : ""
    //     bottomOfCurr ? bottomOfCurr.top = newNode : ""

    //     temp = currEle;
    //     let nextEle = rightOfCurr;

    //     console.log(temp)

    //     while (temp != null) {
    //         let ind = temp.col.data;
    //         console.log(ind)
    //         console.log(temp.col.data)
    //         console.log(temp)
    //         temp.col = this.horizontalArr[ind].value;
    //         if (nextEle != null) {
    //             temp.top = nextEle.top;
    //             temp.bottom = nextEle.bottom;

    //             nextEle.top ? nextEle.top.bottom = temp : this.horizontalArr[nextEle.col.data - 1].next = temp;
    //             nextEle.bottom ? nextEle.bottom.top = temp : ""

    //             nextEle = nextEle.right;

    //         }
    //         else {
    //             let nextColInd = temp.col.data;
    //             let verticalTemp = this.horizontalArr[nextColInd].next;

    //             if (!verticalTemp) {
    //                 this.horizontalArr[nextColInd].next = temp;
    //                 temp.bottom = null;
    //                 temp.top = null;
    //             }
    //             else {
    //                 console.log(verticalTemp)
    //                 // console.log(row,col,value)
    //                 while (verticalTemp.bottom != null && verticalTemp.row.data < row) {
    //                     verticalTemp = verticalTemp.bottom;
    //                 }
    //                 temp.bottom = verticalTemp.bottom;
    //                 temp.top = verticalTemp;

    //                 verticalTemp.bottom ? verticalTemp.bottom.top = temp : ""
    //                 verticalTemp.bottom = temp;

    //             }

    //         }
    //         temp = temp.right;
    //     }


    // }



}

