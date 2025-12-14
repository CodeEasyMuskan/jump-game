const boy = document.getElementById("boy");
const gameContainer = document.querySelector(".game-container");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");

let isJumping = false;
let position = 20;
let score = 0;
let gameOver = false;
let gameSpeed = 10;

// high score
let highScore = localStorage.getItem("jumpGameHighScore") || 0;
highScoreDisplay.textContent = "High Score: " + highScore;

// sounds
const gameStartSound = new Audio('gamestart.mp3');
const gameOverSound = new Audio('gameover.mp3');

// play game start sound on load
window.addEventListener("load", () => {
    gameStartSound.play();
});

// jump function
function jump() {
    if (isJumping || gameOver) return;
    isJumping = true;
    let jumpHeight = 150;
    let upInterval = setInterval(() => {
        if (position >= jumpHeight) {
            clearInterval(upInterval);
            let downInterval = setInterval(() => {
                if (position <= 20) {
                    clearInterval(downInterval);
                    isJumping = false;
                }
                position -= 12;
                boy.style.bottom = position + "px";
            }, 20);
        }
        position += 12;
        boy.style.bottom = position + "px";
    }, 20);
}

// jump on keyup
document.addEventListener("keydown", function(e) {
    if (!isJumping && !gameOver) {
        // Arrow Up, W, Z keys
        if (e.code === "ArrowUp" || e.key === "w" || e.key === "W" || e.key === "z" || e.key === "Z") {
            jump();
        }
    }
});


// mobile tap support
document.addEventListener("touchstart", function(e){
    if(!isJumping) jump();
});

// create holes
function createHole() {
    if (gameOver) return;

    const hole = document.createElement("div");
    hole.classList.add("hole");
    let holeWidth = Math.floor(Math.random() * 60) + 40;
    hole.style.width = holeWidth + "px";
    let holePosition = 800;
    hole.style.left = holePosition + "px";
    gameContainer.appendChild(hole);

    let moveHole = setInterval(() => {
        if(holePosition < -holeWidth){
            clearInterval(moveHole);
            gameContainer.removeChild(hole);
            if(!gameOver){
                score++;
                scoreDisplay.textContent = "Score: " + score;
                if(score % 5 === 0) gameSpeed += 1;
            }
        }

        // collision detection
        if(holePosition > 50 && holePosition < 50 + 80 && position <= 20){
            clearInterval(moveHole);
            gameOver = true;
            gameOverSound.play();
            if(score > highScore){
                localStorage.setItem("jumpGameHighScore", score);
            }
            setTimeout(() => {
                alert("Game Over! Your Score: " + score);
                window.location.reload();
            }, 300);
        }

        holePosition -= gameSpeed;
        hole.style.left = holePosition + "px";
    }, 20);

    if(!gameOver){
        setTimeout(createHole, Math.random() * 3000 + 1000);
    }
}

createHole();
