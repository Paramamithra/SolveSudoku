let fillid='0-0'

window.onload = function () {
    // Call the initialize function when loading the page
    initialize();
  }

function initialize(){

    createBoard();
    createButtons();
    document.addEventListener("keydown", (e) => {processInput(e);});
}

function createBoard(){
    grey=0;
    for (let x=0; x<9;x++){
        for (let y=0; y<9; y++){
        tile=document.createElement("span");
        tile.id=x.toString()+'-'+y.toString()
        tile.classList.add("tile");
        tile.innerText = "";
        if (y==2 || y==5){
            tile.classList.add("right");
        }
        if(x==2||x==5){
            tile.classList.add("bottom");
        }
        if (grey){
            tile.classList.add("color1");
            grey=0;
        }
        else{
            tile.classList.add("color2");
            grey=1;
        }
        tile.addEventListener("click", processclick)
        tile.addEventListener("mouseover", ()=>{tile=document.getElementById(event.target.id);
            tile.classList.add("highlight");});
        tile.addEventListener("mouseout",()=>{tile=document.getElementById(event.target.id);
            tile.classList.remove("highlight");});
        document.getElementById("game").appendChild(tile);
        }
    }
}

function createButtons(){
    tile=document.createElement("span");
    tile.classList.add("button");
    tile.classList.add("color1");
    tile.innerText="SOLVE"
    tile.addEventListener("click",solveBoard);
    document.getElementById("solve").appendChild(tile);

    grey=0
    for (let x=1; x<10; x++){
        tile=document.createElement("span");
        tile.id="Digit"+x.toString();
        tile.classList.add("keys");
        if (grey){
            tile.classList.add("color1");
            grey=0;
        }
        else{
            tile.classList.add("color2");
            grey=1;
        }
        tile.innerText=x.toString();
        tile.addEventListener("click", processKey);
        document.getElementById("keys").appendChild(tile);
    }

    tile=document.createElement("span");
    tile.id="Delete";
    tile.classList.add("keys");
    if (grey){
        tile.classList.add("color1");
        grey=0;
        }
    else{
        tile.classList.add("color2");
        grey=1;
        }
    tile.innerText="⌫"
    tile.addEventListener("click", processKey);
    document.getElementById("keys").appendChild(tile);
}

function processclick(){
    tile=document.getElementById(fillid);
    tile.classList.remove("selected");
    fillid=event.target.id;
    tile=document.getElementById(fillid);
    tile.classList.add("selected");
}

function processInput(e){
    tile=document.getElementById(fillid);
    if ("Digit1" <= e.code && e.code <= "Digit9") {
        if (e.code[5]!=tile.innerText){
            if (checkRow(e.code[5])){
                if (checkColumn(e.code[5])){
                    if (checkBox(e.code[5])){
                        tile.innerText=e.code[5];
                    }
                }
            }
        }
    }
    if ("Numpad1" <= e.code && e.code <= "Numpad9") {
        if (e.code[6]!=tile.innerText){
            if (checkRow(e.code[6])){
                if (checkColumn(e.code[6])){
                    if (checkBox(e.code[6])){
                        tile.innerText=e.code[6];
                    }
                }
            }
        }
    }
    if (e.code=="ArrowUp"){
        if (fillid[0]!="0"){
            tile=document.getElementById(fillid);
            tile.classList.remove("selected");
            fillid=Number(fillid[0])-1+fillid.slice(1)
            tile=document.getElementById(fillid);
            tile.classList.add("selected");
    }
}
if (e.code=="ArrowDown"){
    if (fillid[0]!="8"){
        tile=document.getElementById(fillid);
        tile.classList.remove("selected");
        fillid=Number(fillid[0])+1+fillid.slice(1)
        tile=document.getElementById(fillid);
        tile.classList.add("selected");
}
}
if (e.code=="ArrowLeft"){
    if (fillid[2]!="0"){
        tile=document.getElementById(fillid);
        tile.classList.remove("selected");
        let nextCol=Number(fillid[2])-1;
        fillid=fillid.slice(0,2)+nextCol;
        tile=document.getElementById(fillid);
        tile.classList.add("selected");
}
}
if (e.code=="ArrowRight"){
    if (fillid[2]!="8"){
        tile=document.getElementById(fillid);
        tile.classList.remove("selected");
        let nextCol=Number(fillid[2])+1;
        fillid=fillid.slice(0,2)+nextCol;
        tile=document.getElementById(fillid);
        tile.classList.add("selected");
}
}
    if (e.code=="Backspace"){
        tile.innerText='';
    }
    if (e.code=="Delete"){
        tile.innerText='';
    }
}

function processKey() {
  // This function is for processing key presses in the displayed keyboard
  // create an event
  let e = { code: this.id };
  // call the process input function with this event
  processInput(e);
}

function checkRow(num){
    row=fillid[0];
    for (let x=0;x<9;x++){
        if(document.getElementById(row.toString()+'-'+x.toString()).innerText==num){
            warning(row.toString()+'-'+x.toString())
            return false;
        }
    }
    return true;
}

function checkColumn(num){
    column=fillid[2];
    for (let x=0;x<9;x++){
        if(document.getElementById(x.toString()+'-'+column.toString()).innerText==num){
            warning(x.toString()+'-'+column.toString())
            return false;
        }
    }
    return true;
}

function checkBox(num){
    row=fillid[0];
    column=fillid[2];
    interrow=Math.floor(row/3);
    intercolumn=Math.floor(column/3);
    for (let x=(interrow)*3;x<(interrow)*3+3;x++){
        for (let y=(intercolumn)*3;y<(intercolumn)*3+3;y++){
            if(document.getElementById(x.toString()+'-'+y.toString()).innerText==num){
                warning(x.toString()+'-'+y.toString())
                return false;
            }
        }
    }
    return true;
}

async function warning(varid){
    tile=document.getElementById(varid);
    for (let x=0;x<2;x++){
        tile.classList.add("warning");
        await delay(100);
        tile.classList.remove("warning");
        await delay(50);
    }
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function solveBoard(){
    board=readBoard();
    updateBoard(board);
    refBoard=markBoard(board);
    let i=0;
    let data='check'
    let j=0;
    let start=0;
    while (data!=undefined){
        let data=backTrack(board,refBoard,i,j,start);
        if (data==undefined){break;}
        board=data.board;
        i=data.i;
        j=data.j;
        start=data.start;
        updateBoard(board);
    }
}

function readBoard(){
    let board=[]
    for (let x=0; x<9;x++){
        let temp=''
        for (let y=0; y<9; y++){
            tile=document.getElementById(x.toString()+'-'+y.toString());
            if (tile.innerText==''){
                temp=temp+'.';
            }
            else {
                temp=temp+tile.innerText;
            }
        }
        board.push(temp);
    }
    return board;
}

function updateBoard(board){
    for (let x=0;x<9;x++){
        for (let y=0;y<9;y++){
            tile=document.getElementById(x.toString()+'-'+y.toString());
            if (board[x][y]!='.'){
                tile.innerText=board[x][y];
            }
        }

    }
}

function markBoard(board){
    let refBoard=[];
    for (let x=0;x<9;x++){
        refRow='';
        for (let y=0;y<9;y++){
            if (board[x][y]!='.'){
                refRow=refRow+'1';
            }
            else{
                refRow=refRow+'0';
            }
        }
        refBoard.push(refRow);
    }
    return refBoard;    
}

function backTrack(board,refBoard,i,j,start){
    let k,l;
    for (let x=0;x<9;x++){
        if (x<i){
            continue;
        }
        for (let y=0;y<9;y++){
            if (y<j){
                continue;
            }
            if (board[x][y]=='.'){
                let data =fillElement(x,y,start,board);
                let check=data.check;
                board=data.board;
                start=0;
                if (!check){
                    let data=backTrackCord(board,refBoard,x,y-1);
                    k=data.k;
                    l=data.l;
                    start=Number(data.start);
                    board=data.board;
                    return {board:board,i:k,j:l,start:start};
                }
                else{
                    updateBoard(board);
                }
            }
        }
        j=0;
    }
    i=0;
}

function fillElement(row,column,start,board){
    let interBoardRow;
    for (let x=start+1;x<10;x++){
        if (board[row].includes(x.toString())){
            continue;
        }
        else {
            elecol='';
            for ( let y=0;y<9;y++){
                elecol=elecol+board[y][column];
            }
            if (elecol.includes(x.toString())){
                continue;
            }
            else{
                interBoardRow=getInterBoardRow(row,column);
                if (interBoardRow.includes(x.toString())){
                    continue;
                }
                else{
                    board[row]=board[row].slice(0,column)+x.toString()+board[row].slice(column+1);
                    return {check:true,
                            board:board};
                }
            }
        }
    }
    if (typeof board[row]=='number'){
        return {check:true,
            board:board};
    }
    return {check:false,
        board:board};
}

function getInterBoardRow(row,column){
    interRow=Math.floor(row/3);
    interColumn=Math.floor(column/3);
    return board[interRow*3].slice(interColumn*3,interColumn*3+3)+board[interRow*3+1].slice(interColumn*3,interColumn*3+3)+board[interRow*3+2].slice(interColumn*3,interColumn*3+3);
}

function backTrackCord(board,refBoard,i,j){
    for (let x=i;x>-1;x--){
        for (let y=j;y>-1;y--){
            if (refBoard[x][y]=='0'){
                start=board[x][y];
                board[x]=board[x].slice(0,y)+'.'+board[x].slice(y+1);
                return {k:x,
                    l:y,
                    start:start,
                    board:board};
            }
        }
        j=8;
    }
}