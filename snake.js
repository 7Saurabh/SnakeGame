const snake = document.querySelector(".snake")
let boxes = document.querySelectorAll(".box")
const scoreLabel = document.querySelector('.score')

/*
    SNAKE BOX SIZE (SBZ) is actually to arrange snake boxes
    To change actual snake box size change from CSS

    SBZ is calculated by actual snake box size + 5
*/
const SBZ = 45 // which is a constant (SNAKE BOX SIZE) 

let score = 0

// { x: (xlocation px), y: (ylocation px) },
let snakeState = []

boxes.forEach((box, index) => {
    // SETTING INITIAL POSITION FOR THE SNAKE
    box.style.left = `${index * SBZ}px`
    box.style.top = '0px'
    // storing initial location for every box including snakeHead
    snakeState[index] = { x: index * SBZ, y: 0 }
})

//  CODE TO SPAWN EATABLES
const eatables = document.querySelectorAll('.eatable')
const eatablesState = [{ x: 55, y: 220 }, { x: 110, y: 110 }, { x: 275, y: 385 }, { x: 385, y: 165 }, { x: 330, y: 275 }]

eatables.forEach((eatable, index) => {
    eatable.style.transform = `translate(${eatablesState[index].x}px, ${eatablesState[index].y}px)` // According to index of eatables present in dom
    eatable.innerText = `${eatablesState[index].x}, ${eatablesState[index].y}`
    // eatable.innerText = `${eatable.getBoundingClientRect().x}, ${eatable.getBoundingClientRect().y}`
})


function arrangeSnakeTailNode(tailNode) {

    tailNode.style.left = `${snakeState[snakeState.length - 1].x}px`
    tailNode.style.top = `${snakeState[snakeState.length - 1].y}px`
    snakeState[snakeState.length] = { x: snakeState[snakeState.length - 1].x, y: snakeState[snakeState.length - 1].y }
}

function appendSnakeTail() {
    snakeSize = document.querySelectorAll('.box').length - 1
    const tail = document.createElement("div")
    tail.classList.add("box")
    tail.id = `box${snakeSize + 1}`
    tail.innerText = snakeSize + 1
    document.querySelector('.snake').appendChild(tail)
    arrangeSnakeTailNode(tail)
}

function checkSnakeEats() {
    const snakeHeadPosX = snakeState[snakeState.length - 1].x
    const snakeHeadPosY = snakeState[snakeState.length - 1].y

    if (snakeHeadPosX !== 0 && snakeHeadPosY !== 0) { // This avoid error which causes score to increase due to some inaccuracy 
        // basically it ensures if snake is not on (0, 0)
        eatables.forEach((eatable, index) => {
            if ((snakeHeadPosX > eatable.getBoundingClientRect().x - 30 && snakeHeadPosX < eatable.getBoundingClientRect().x + 30)
                && (snakeHeadPosY > eatable.getBoundingClientRect().y - 30 && snakeHeadPosY < eatable.getBoundingClientRect().y + 30)) {
                //console.log(`snakepos: ${snakeHeadPosX},${snakeHeadPosY} || eatablepos: ${eatable.getBoundingClientRect().x}, ${eatable.getBoundingClientRect().y}`)
                eatables[index].remove()
                appendSnakeTail()
                score++
                scoreLabel.innerText = score
            }
        })
    }

}

function checkSnakeHitsTail() {
    // WORK REMAINS
    // protect the 2nd index also with head
    const snakeHeadPosX = snakeState[snakeState.length - 1].x
    const snakeHeadPosY = snakeState[snakeState.length - 1].y
    if (snakeHeadPosX !== 0 && snakeHeadPosY !== 0) { // This avoid error which causes score to increase due to some inaccuracy 
        // basically it ensures if snake is not on (0, 0)

        const previousTail = snakeState.pop()
        // This avoids the issue where if snake tail grows, it was showing snake ate his tail

        snakeState.forEach((snakepos, index) => {
            if (index != (snakeState.length - 1)) {
                if ((snakeHeadPosX > snakepos.x - 30 && snakeHeadPosX < snakepos.x + 30)
                    && (snakeHeadPosY > snakepos.y - 30 && snakeHeadPosY < snakepos.y + 30)) {
                    //console.log(`snakeheadpos: ${snakeHeadPosX},${snakeHeadPosY} || snakepos: ${snakepos.x}, ${snakepos.y}`)
                    gameOver()
                }
            }
        })

        // Again it pushes
        snakeState.push(previousTail)
    }

}

let frameCount = 0
const frameDelay = 12 // Update the game every 6 frames
let currentDirection = null

function moveSnake() {
    const boxes = document.querySelectorAll('.box')
    const winHeight = window.innerHeight
    const winWidth = window.innerWidth
    const error = 5

    checkSnakeEats()
    checkSnakeHitsTail()
    if (frameCount % frameDelay === 0) {
        if (currentDirection === 'right') {
            boxes.forEach((box, index) => {
                if (index != (boxes.length - 1)) {
                    box.style.left = `${snakeState[index + 1].x}px`
                    box.style.top = `${snakeState[index + 1].y}px`

                    snakeState[index].x = snakeState[index + 1].x
                    snakeState[index].y = snakeState[index + 1].y
                }
                else {
                    // check if snakeHead colides to edges
                    if ((snakeState[snakeState.length - 1].x + error) > winWidth) {
                        box.style.left = `0px`
                        snakeState[snakeState.length - 1].x = 0
                    }
                    else {
                        box.style.left = `${snakeState[snakeState.length - 1].x + SBZ}px`
                        snakeState[index].x = snakeState[snakeState.length - 1].x + SBZ
                    }
                }
            })
        }

        if (currentDirection === 'up') {
            boxes.forEach((box, index) => {
                if (index !== (boxes.length - 1)) { //for other than head
                    box.style.left = `${snakeState[index + 1].x}px`
                    box.style.top = `${snakeState[index + 1].y}px`

                    snakeState[index].x = snakeState[index + 1].x
                    snakeState[index].y = snakeState[index + 1].y
                }
                else {
                    // console.log(snakeState[snakeState.length - 1])
                    // check if snakeHead colides to edges
                    if ((snakeState[snakeState.length - 1].y - error) < 0) {
                        box.style.top = `${winHeight}px`
                        snakeState[snakeState.length - 1].y = winHeight
                    }
                    else {
                        box.style.top = `${snakeState[snakeState.length - 1].y - SBZ}px`
                        snakeState[index].y = snakeState[snakeState.length - 1].y - SBZ
                    }
                }
            })
        }

        if (currentDirection === 'left') {
            boxes.forEach((box, index) => {
                if (index !== (boxes.length - 1)) { //for other than head
                    box.style.left = `${snakeState[index + 1].x}px`
                    box.style.top = `${snakeState[index + 1].y}px`

                    snakeState[index].x = snakeState[index + 1].x
                    snakeState[index].y = snakeState[index + 1].y
                }
                else {
                    // check if snakeHead colides to edges
                    if ((snakeState[snakeState.length - 1].x - error) < 0) {
                        box.style.left = `${winWidth}px`
                        snakeState[snakeState.length - 1].x = winWidth
                    }
                    else {
                        box.style.left = `${snakeState[snakeState.length - 1].x - SBZ}px`
                        snakeState[index].x = snakeState[snakeState.length - 1].x - SBZ
                    }
                }
            })
        }

        if (currentDirection === 'down') {
            boxes.forEach((box, index) => {
                if (index !== (boxes.length - 1)) { //for other than head
                    box.style.left = `${snakeState[index + 1].x}px`
                    box.style.top = `${snakeState[index + 1].y}px`

                    snakeState[index].x = snakeState[index + 1].x
                    snakeState[index].y = snakeState[index + 1].y
                }
                else {
                    // console.log(snakeState[snakeState.length - 1])
                    // check if snakeHead colides to edges
                    if ((snakeState[snakeState.length - 1].y + error) > winHeight) {
                        box.style.top = '0px'
                        snakeState[snakeState.length - 1].y = 0
                    }
                    else {
                        box.style.top = `${snakeState[snakeState.length - 1].y + SBZ}px`
                        snakeState[index].y = snakeState[snakeState.length - 1].y + SBZ
                    }
                }
            })
        }
        frameCount = 0 // Reset frame counter
    }
    frameCount++
    requestAnimationFrame(moveSnake)

}

requestAnimationFrame(moveSnake)

const directionState = []
document.addEventListener("keydown", handleKeyDown = (event) => {
    const prevDirection = directionState[directionState.length - 1]
    if (event.key === 'ArrowDown' && prevDirection !== 'up') {
        currentDirection = "down"
        directionState[directionState.length] = currentDirection
    }

    if (event.key === 'ArrowUp' && prevDirection !== 'down') {
        currentDirection = "up"
        directionState[directionState.length] = currentDirection
    }

    if (event.key === 'ArrowRight' && prevDirection !== 'left') {
        currentDirection = "right"
        directionState[directionState.length] = currentDirection
    }

    if (event.key === 'ArrowLeft' && prevDirection !== 'right') {
        currentDirection = "left"
        directionState[directionState.length] = currentDirection
    }

})

function stopSnake() {
    currentDirection = null
}
const gameOverContainer = document.querySelector('.game-over-container')
const opacityChangers = document.querySelectorAll('.opacity-changer')

function gameOver() {
    document.removeEventListener('keydown', handleKeyDown)
    stopSnake()
    gameOverContainer.style.display = "flex"
    opacityChangers.forEach(opacityChanger => opacityChanger.style.opacity = '20%')
}

function tryAgain() {
    location.reload()
}