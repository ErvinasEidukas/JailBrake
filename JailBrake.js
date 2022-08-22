const hoodStyle = document.getElementById("hood");
const livesStyle = document.getElementsByClassName("heart-shape");
const lives = document.getElementsByClassName("heart-shape_red");
const scoreStyle = document.getElementById("score");
const ballStyle = document.getElementById("Ball");
const platformStyle = document.getElementById("Platform");
const gameZoneStyle = document.getElementById("GameZone");
const enemyMap = document.getElementById("EnemyMap");
const RightButton = document.getElementById("RightButton")
let Boxes;
ballStyle.style.backgroundColor = "blue";

const Enemy_numberOfRows = 5;
const Enemy_numberOfColumn = 12;


let gameZone_width = 800, gameZone_Height = 500;

//Window size
if (true) {
    gameZone_width = window.innerWidth * 0.8;
    gameZone_Height = window.innerHeight * 0.92;
}

//hood
hoodStyle.style.height = 1 / 16 * gameZone_Height + "px";

let score = 0;
let ballSpeed_x = gameZone_width * 0.00125;
let ballSpeed_y = ballSpeed_x;
let ball_x, ball_y;
let ball_size;

let platform_With = gameZone_width * 0.2;
let Platform_height = gameZone_Height * 0.03;
let platform_Speed = platform_With * 1 / 100;
let platform_x = gameZone_width / 2 - platform_With / 2;
let RightButtonTimer;
let LeftButtonTimer;
let GameLoop;


let enemyBoxSize_x = gameZone_width * 0.9 / Enemy_numberOfColumn;
let enemyBoxSize_y = gameZone_Height * 0.3 / Enemy_numberOfRows;
ballStyle.style.width = enemyBoxSize_y * 1 + "px";
ballStyle.style.height = enemyBoxSize_y * 1 + "px";
ball_size = enemyBoxSize_y * 1;

document.getElementById("RightButton").addEventListener("touchstart", RightButtonAction);
document.getElementById("RightButton").addEventListener("touchend", RightButtonActionMouseUp);

document.getElementById("LeftButton").addEventListener("touchstart", LeftButtonAction);
document.getElementById("LeftButton").addEventListener("touchend", LeftButtonActionMouseUp);

function setPlatformStartingPosition() {
    platformStyle.style.width = platform_With + "px";
    platformStyle.style.height = Platform_height + "px";
    platformStyle.style.left = platform_x + "px";
    platformStyle.style.bottom = Platform_height + "px";
}

function WindowClose() {
    window.close();
}

//Event button holding
//Right
function WhyleHoldingRight() {

    if (platform_x + platform_Speed > gameZone_width - platform_With) {
        platformStyle.style.left = gameZone_width - platform_With + "px";
        return;
    }

    platform_x += platform_Speed;
    platformStyle.style.left = platform_x + "px";
}

function RightButtonAction() {
    clearInterval(RightButtonTimer);
    clearInterval(LeftButtonTimer);
    RightButtonTimer = setInterval(WhyleHoldingRight, 1);
}

function RightButtonActionMouseUp() {
    clearInterval(RightButtonTimer);
    clearInterval(LeftButtonTimer);
}

//Left
function WhyleHoldingLeft() {

    if (platform_x - platform_Speed < 0) {
        platformStyle.style.left = "0px";
        return;
    }

    platform_x -= platform_Speed;
    platformStyle.style.left = platform_x + "px";
}

function LeftButtonAction() {
    clearInterval(LeftButtonTimer);
    clearInterval(RightButtonTimer);
    LeftButtonTimer = setInterval(WhyleHoldingLeft, 1);
}

function LeftButtonActionMouseUp() {
    clearInterval(RightButtonTimer);
    clearInterval(LeftButtonTimer);
}


//Map creation
function MapCreation() {
    for (let i = 0; i < Enemy_numberOfRows; i++) {
        let newRow = document.createElement("div");
        newRow.classList.add("Row");
        enemyMap.appendChild(newRow);

        for (let j = 0; j < Enemy_numberOfColumn; j++) {
            let newBox = document.createElement("div");
            newBox.classList.add("Box");
            newBox.classList.add("Box_show");
            newBox.style.width = enemyBoxSize_x + "px";
            newBox.style.height = enemyBoxSize_y + "px";
            newRow.appendChild(newBox);
        }
    }
}

function loadBoxes() {
    Boxes = document.getElementsByClassName("Box_show")
}

//Box creation
function CreatNewBox(element) {
    let newBox = document.createElement("div");
    newBox.classList.add("Box");
    newBox.classList.add("Box_show");
    element.appendChild(newBox);
}

function checkPlatformColision() {
    let platform = platformStyle.getBoundingClientRect();
    let ballPosition = ballStyle.getBoundingClientRect();

    if (platform.bottom >= ballPosition.top &&
        platform.top <= ballPosition.bottom &&
        platform.right >= ballPosition.left &&
        platform.left <= ballPosition.right) {
        return true;
    }
}

//Chek colision
function checkColision(element) {
    let elementPosition = element.getBoundingClientRect();
    let ballPosition = ballStyle.getBoundingClientRect();

    // Colision rules
    if (elementPosition.bottom >= ballPosition.top &&
        elementPosition.top <= ballPosition.bottom &&
        elementPosition.right >= ballPosition.left &&
        elementPosition.left <= ballPosition.right) {


        ballStyle.style.backgroundColor = "red";

        if (ballSpeed_x > 0 && ballSpeed_y > 0) {
            if (ballPosition.right < elementPosition.left + ballSpeed_y) {
                ballSpeed_x *= -1;
            }
            else {
                ballSpeed_y *= -1;

            }
        }
        else if (ballSpeed_x < 0 && ballSpeed_y > 0) {
            if (ballPosition.left > elementPosition.right - ballSpeed_y) {
                ballSpeed_x *= -1;
            }
            else {
                ballSpeed_y *= -1;

            }
        }
        else if (ballSpeed_x > 0 && ballSpeed_y < 0) {
            if (ballPosition.right < elementPosition.left - ballSpeed_y) {
                ballSpeed_x *= -1;
            }
            else {
                ballSpeed_y *= -1;

            }
        }
        else if (ballSpeed_x < 0 && ballSpeed_y < 0) {
            if (ballPosition.left > elementPosition.right + ballSpeed_y) {
                ballSpeed_x *= -1;
            }
            else {
                ballSpeed_y *= -1;

            }
        }
        return true;
    }
    else {
        ballStyle.style.backgroundColor = "green";
    }
}

//Ball Starting position
function BallStartingPosition() {
    gameZoneStyle.style.width = gameZone_width + "px";
    gameZoneStyle.style.height = gameZone_Height + "px";
    ball_x = gameZone_width / 2;
    ball_y = gameZone_Height - 100;

    ballStyle.style.top = ball_y + "px";
    ballStyle.style.left = ball_x + "px";
}

function setEnemyMap() {
    enemyMap.style.position = "absolute"
    enemyMap.style.top = "50px";
    enemyMap.style.left = (gameZone_width / 2 - (enemyBoxSize_x * (Enemy_numberOfColumn / 2.0))) + "px";
}

function moveBall() {
    ball_x += ballSpeed_x;
    ball_y += ballSpeed_y;

    ballStyle.style.left = ball_x + "px";
    ballStyle.style.top = ball_y + "px";

    if (checkColision(platformStyle)) {
        return;
    }

    //right Wall || left wall
    if (ball_x >= gameZone_width - ball_size || ball_x <= 0) {
        if (ball_x >= gameZone_width - ball_size) {
            ball_x = gameZone_width - ball_size;
        }
        else {
            ball_x = 0
        }
        ballSpeed_x *= -1;
    }

    //bottom wall
    if (ball_y + ball_size >= gameZone_Height) {
        //BallStartingPosition();
        if (lives[0] != null) {
            lives[0].classList.remove("heart-shape_red")

            if (lives[0] == null) {
                clearInterval(GameLoop);
                document.getElementById("GameOver-menu").style.display = "flex";
                document.getElementById("GameOver-Score").innerHTML = "Your Score: " + score;
            }
        }
        ball_y = gameZone_Height - ball_size;
        ballSpeed_y *= -1;
    }

    //top wall
    if (ball_y < 0) {
        ball_y = 0;
        ballSpeed_y *= -1;
    }

    for (let i = 0; i < Boxes.length; i++) {
        let found = checkColision(Boxes[i]);
        if (found) {
            Boxes[i].classList.remove("Box_show");
            score += 100;
            scoreStyle.innerHTML = "Score: " + score;
            break;
        }
    }
}


function StartGame() {
    //Starting configurations
    for (let i = 0; i < livesStyle.length; i++) {
        livesStyle[i].classList.add("heart-shape_red");
    }
    score = 0;
    setPlatformStartingPosition()

    document.getElementById("GameOver-menu").style.display = "none";
    document.getElementById("GameStart-menu").style.display = "none";
    GameLoop = setInterval(moveBall, 1);
}

