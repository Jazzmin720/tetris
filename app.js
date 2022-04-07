document.addEventListener('DOMContentLoaded', () => {})
const grid = document.querySelector('.grid-container')
const width = 10;
let squares = Array.from(document.querySelectorAll('.grid-container div'))
const scoreDisplay = document.querySelector('#score')
const startBtn = document.querySelector('#startButton')
let nextRandom = 0;
let timerId
let score = 0
//tetrominoes
const lTetromino = [
    [1, width + 1, width*2 + 1, 2], 
    [width, width + 1, width + 2, width*2 + 2], 
    [width, width *2, width*2 + 1, width*2 + 2],
    [1, width + 1, width*2 + 1, width*2]
]
const zTetromino = [
    [1, 2, width + 2, width + 3], 
    [4, 3, width + 3, width + 2], 
    [2, width + 2, width + 3, width*2 + 3],
    [2, width + 2, width + 1, width*2 + 1]
];
const tTetromino = [
    [1, 2, 3, width + 2], 
    [1, width + 1, width*2 + 1, width + 2], 
    [width + 1, width + 2, width + 3, 2],
    [2, width + 2, width*2 + 2, width + 1]
];
const oTetromino = [
    [1, 2, width + 1, width + 2], 
    [1, 2, width + 1, width + 2], 
    [1, 2, width + 1, width + 2], 
    [1, 2, width + 1, width + 2]
];
const iTetromino = [
    [0, width, width*2, width*3], 
    [width, width + 1, width + 2, width+ 3], 
    [0, width, width*2, width*3 ], 
    [width, width + 1, width + 2, width+ 3]
];
const theTetrominoes = [lTetromino, zTetromino, oTetromino, iTetromino, tTetromino]

let currentPosition = 4;
let currentRotation = 0;
//randomly select tetrominoes
let random = Math.floor(Math.random()*theTetrominoes.length);
let current = theTetrominoes[random][currentRotation];
//draw the first rotation in each index of the tetromino array
function draw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
    })
}

//undraw the tetromino
function undraw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
    })
}


//make the tetromino move down every second
/*timerId = setInterval(moveDown, 1000);*/
function moveDown(){
    undraw()
    currentPosition += width
    draw()
    freeze()
    
};
//freeze function
function freeze(){
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        random = nextRandom
        nextRandom = Math.floor(Math.random()*theTetrominoes.length)
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
    }
}
//move left
function moveLeft(){
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(!isAtLeftEdge) currentPosition -=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition +=1
    }
    draw()
}
//move right
function moveRight(){
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
    if(!isAtRightEdge) currentPosition +=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition -=1
    }
    draw()
}
//rotate
function rotate(){
    undraw()
    currentRotation ++
    if(currentRotation === current.length){
        currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
}
//show the tetromino that is up next
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
let displayIndex = 0
//tetrominoes without the rotations
const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth*2 + 1, 2],
    [1, 2, displayWidth + 2, displayWidth + 3],
    [1, 2, 3, displayWidth + 2], 
    [1, 2, displayWidth + 1, displayWidth + 2],
    [1, displayWidth + 1, displayWidth*2 + 1, displayWidth*3 + 1]
]
//display the mini grid tetrominoes
function displayShape(){
    displaySquares.forEach(square => {
        square.classList.remove('tetromino')
    })
    upNextTetrominoes[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
    })
}
//key codes
function control(e){
    if(e.keyCode === 37){
        moveLeft()
    } else if(e.keyCode === 38){
        rotate()
    } else if (e.keyCode === 39){
        moveRight()
    }
}
document.addEventListener('keyup', control)

//make the button work
startBtn.addEventListener('click',() => {
    if(timerId){
        clearInterval(timerId)
        timerId = null
    } else{
        draw()
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random()*theTetrominoes.length)
        displayShape()
    }
})
//add score
function addScore(){
    for(let i = 0; i < 199; i +=width){
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
        if(row.every(index => squares[index].classList.contains('taken'))){
            score +=10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
            })
            const squaresRemoved = squares.splice(i,width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        }
    }
}
//game over
function gameOver(){
    if(current.come(index => squares[currentPosition + index].classList.contains('taken'))){
        scoreDisplay.innerHTML = 'end'
        clearInterval(timerId)
    }
}