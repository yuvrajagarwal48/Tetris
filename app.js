
document.addEventListener('DOMContentLoaded',() => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const width = 10
    //console.log(squares)
    const startBtn=document.querySelector('#start-button')
    const scoreDisplay=document.querySelector('#score')
    let timerId
    let score=0
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue',
        'pink',
        'brown'
      ]

    //make the various shapes
    let lTetromino=[[1,width+1,width*2+1,width*2+2],
                [width,width*2,width+1,width+2],
                [1,2,width+2,width*2+2],
                [width*2,width*2+1,width*2+2,width+2]]
    let jTetromino=[[1,width+1,width*2+1,width*2],
                [width,width*2,width*2+1,width*2+2],
                [1,2,width+1,width*2+1],
                [width,width+1,width+2,width*2+2]]
    let tTetromino=[[width,width+1,1,width*2+1],
                [width,width+1,width+2,1],
                [1,width+1,width*2+1,width+2],
                [width,width+1,width+2,width*2+1]]
    let sTetromino=[[1,width+1,width+2,width*2+2],
                [width*2,width*2+1,width+1,width+2],
                [1,width+1,width+2,width*2+2],
                [width*2,width*2+1,width+1,width+2]]
    let zTetromino=[[2,width+2,width+1,width*2+1],
                [width,width+1,width*2+1,width*2+2],
                [2,width+2,width+1,width*2+1],
                [width,width+1,width*2+1,width*2+2]]
    let oTetromino=[[1,2,width+1,width+2],
                [1,2,width+1,width+2],
                [1,2,width+1,width+2],
                [1,2,width+1,width+2]]
    let iTetromino=[[1,width+1,width*2+1,width*3+1],
                [width,width+1,width+2,width+3],
                [1,width+1,width*2+1,width*3+1],
                [width,width+1,width+2,width+3]]

    //define the different variables for rotation,postion and shapes
    const Tetrominoes=[lTetromino,jTetromino,tTetromino,sTetromino,zTetromino,oTetromino,iTetromino]
    let random = Math.floor(Math.random()*Tetrominoes.length)    
    let currentPosition=4
    let currentRotation=0
    let current=Tetrominoes[random][currentRotation]
    let nextRandom=0

    //draw the shapes
    function draw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor=colors[random]
        })
    }
    //draw()

    //delete the shapes
    function undraw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor=''
        })
    }

    //the shapes move down
    function moveDown(){
        undraw()
        currentPosition+=width
        draw()
        freeze()
    }
    
    //freezes the shapes so it does not go out of bounds
    function freeze(){
        if (current.some(index => squares[currentPosition+index+width].classList.contains('taken'))){
            current.forEach(index => squares[currentPosition+index].classList.add('taken'))
        random=nextRandom
        nextRandom = Math.floor(Math.random()*Tetrominoes.length)    
        currentPosition=4
        currentRotation=0
        current=Tetrominoes[random][currentRotation]
        draw()
        displayShape()
        addScore()
        gameOver()
        }    
    }

    function moveLeft(){
        undraw()
        const isAtLeftEdge=current.some(index => (currentPosition+index)%width === 0 )
        if (!isAtLeftEdge) currentPosition -=1
        if (current.some(index => squares[currentPosition+index].classList.contains('taken'))){
            currentPosition+=1
            
        }
        draw()
    }
    function moveRight(){
        undraw()
        const isAtRightEdge=current.some(index => (currentPosition+index+1)%width === 0 )
        if (!isAtRightEdge) currentPosition +=1
        if (current.some(index => squares[currentPosition+index].classList.contains('taken'))){
            currentPosition-=1
            
        }
        draw()
    }

    function checkRotatedPosition(P){
        P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
        if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
          if (isAtRight()){            //use actual position to check if it's flipped over to right side
            currentPosition += 1    //if so, add one to wrap it back around
            checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
            }
        }
        else if (P % width > 5) {
          if (isAtLeft()){
            currentPosition -= 1
          checkRotatedPosition(P)
          }
        }
      }

    function rotate(){
        undraw()
        currentRotation++
        if(currentRotation==current.length){
            currentRotation=0
        }
        // if (Tetrominoes[random][currentRotation].some(index => (currentPosition+index)%width === 0 ) || Tetrominoes[random][currentRotation].some(index => (currentPosition+index+1)%width === 0 )){
        //     currentRotation--
        // }
        current=Tetrominoes[random][currentRotation]
        checkRotatedPosition()
        draw()
    }

    function control(e){
        if (e.keyCode===37){
            moveLeft()
        }
        else if(e.keyCode===38){
            rotate()
        }
        else if(e.keyCode===39){
            moveRight()
        } 
        else if(e.keyCode===40){
            moveDown()
        }
    }
    document.addEventListener('keyup',control)




    //the shapes move down every second
    //let timerId=setInterval(moveDown,1000)


    //Displaying the next tetromino in mini-grid
    const displaySquares=document.querySelectorAll('.mini-grid div')
    const displayWidth=4
    const nextTetrominoes=[
                        [1,displayWidth+1,displayWidth*2+1,displayWidth*2+2],//lTetromino
                        [1,displayWidth+1,displayWidth*2+1,displayWidth*2],//jTetromino
                        [displayWidth,displayWidth+1,1,displayWidth*2+1], //tTetromino
                        [1,displayWidth+1,displayWidth+2,displayWidth*2+2], //sTetromino
                        [2,displayWidth+2,displayWidth+1,displayWidth*2+1], //zTetromino
                        [1,2,displayWidth+1,displayWidth+2], //oTetromino
                        [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1]//iTetromino
                        ]
    let displayIndex=0
    function displayShape(){
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor=''
        })
        nextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex+index].classList.add('tetromino')
            displaySquares[currentPosition + index].style.backgroundColor=colors[nextRandom]           
            
        })
    }


    startBtn.addEventListener('click',()=>{
        if(timerId){
            clearInterval(timerId)
            timerId=null
        }else{
            draw()
            timerId=setInterval(moveDown,1000)
            nextRandom = Math.floor(Math.random()*Tetrominoes.length) 
            displayShape()
        }
    })

    function addScore(){
        for(let i=0;i<199;i+=width){
            const row=[i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]
            if (row.every(index => squares[index].classList.contains('taken'))){
                score+=10
                scoreDisplay.innerHTML=score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[currentPosition + index].style.backgroundColor=''
                })
                const squaresRemoved=squares.splice(i,width)
                squares=squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }

        }
    }
    function gameOver(){
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
            scoreDisplay.innerHTML='END'
            clearInterval(timerId)
        }
    }
    

    

    



})

