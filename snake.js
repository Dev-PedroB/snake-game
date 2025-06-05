const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20; // Size of each square
const canvasSize = 400;
let snake = [
    { x: 9 * box, y: 10 * box },
    { x: 8 * box, y: 10 * box }
];
let direction = null;
let nextDirection = null; // Prevent instant reverse
let food = randomFoodPosition();
let score = 0;
let gameInterval = null;
let gameOver = false;

function randomFoodPosition() {
    return {
        x: Math.floor(Math.random() * (canvasSize / box)) * box,
        y: Math.floor(Math.random() * (canvasSize / box)) * box
    };
}

function drawSnake() {
    ctx.fillStyle = '#4CAF50';
    snake.forEach((segment, i) => {
        ctx.fillRect(segment.x, segment.y, box, box);
    });
}

function drawFood() {
    ctx.fillStyle = '#FFEB3B';
    ctx.fillRect(food.x, food.y, box, box);
}

function moveSnake() {
    if (nextDirection && !isOpposite(nextDirection, direction)) {
        direction = nextDirection;
    }
    if (!direction) return; // Immovable if no direction set
    let head = { ...snake[0] };
    if (direction === 'LEFT') head.x -= box;
    if (direction === 'UP') head.y -= box;
    if (direction === 'RIGHT') head.x += box;
    if (direction === 'DOWN') head.y += box;

    // Check collision with wall
    if (
        head.x < 0 || head.x >= canvasSize ||
        head.y < 0 || head.y >= canvasSize
    ) {
        endGame();
        return;
    }

    // Check collision with self
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            endGame();
            return;
        }
    }

    snake.unshift(head);

    // Check if fruit eaten
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').textContent = 'Score: ' + score;
        food = randomFoodPosition();
    } else {
        snake.pop();
    }
}

function isOpposite(dir1, dir2) {
    return (dir1 === 'LEFT' && dir2 === 'RIGHT') ||
           (dir1 === 'RIGHT' && dir2 === 'LEFT') ||
           (dir1 === 'UP' && dir2 === 'DOWN') ||
           (dir1 === 'DOWN' && dir2 === 'UP');
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
}

function gameLoop() {
    if (!gameOver) {
        moveSnake();
        draw();
    }
}

function startGame() {
    document.getElementById('instructions').classList.add('hidden');
    document.getElementById('mobile-controls').classList.remove('hidden');
    if (!gameInterval && direction) {
        gameInterval = setInterval(gameLoop, 100);
    }
}

document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') nextDirection = 'LEFT';
    else if (e.key === 'ArrowUp' && direction !== 'DOWN') nextDirection = 'UP';
    else if (e.key === 'ArrowRight' && direction !== 'LEFT') nextDirection = 'RIGHT';
    else if (e.key === 'ArrowDown' && direction !== 'UP') nextDirection = 'DOWN';
    // Start the game on first key press
    if (!gameInterval && (nextDirection || direction)) {
        direction = nextDirection || direction;
        startGame();
    }
});

// Mobile arrow controls
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

if (upBtn && downBtn && leftBtn && rightBtn) {
    upBtn.addEventListener('touchstart', function(e) { e.preventDefault(); if (direction !== 'DOWN') nextDirection = 'UP'; if (!gameInterval) { direction = 'UP'; startGame(); } });
    leftBtn.addEventListener('touchstart', function(e) { e.preventDefault(); if (direction !== 'RIGHT') nextDirection = 'LEFT'; if (!gameInterval) { direction = 'LEFT'; startGame(); } });
    downBtn.addEventListener('touchstart', function(e) { e.preventDefault(); if (direction !== 'UP') nextDirection = 'DOWN'; if (!gameInterval) { direction = 'DOWN'; startGame(); } });
    rightBtn.addEventListener('touchstart', function(e) { e.preventDefault(); if (direction !== 'LEFT') nextDirection = 'RIGHT'; if (!gameInterval) { direction = 'RIGHT'; startGame(); } });
    // Allow click for desktop
    upBtn.addEventListener('click', function() { if (direction !== 'DOWN') nextDirection = 'UP'; if (!gameInterval) { direction = 'UP'; startGame(); } });
    leftBtn.addEventListener('click', function() { if (direction !== 'RIGHT') nextDirection = 'LEFT'; if (!gameInterval) { direction = 'LEFT'; startGame(); } });
    downBtn.addEventListener('click', function() { if (direction !== 'UP') nextDirection = 'DOWN'; if (!gameInterval) { direction = 'DOWN'; startGame(); } });
    rightBtn.addEventListener('click', function() { if (direction !== 'LEFT') nextDirection = 'RIGHT'; if (!gameInterval) { direction = 'RIGHT'; startGame(); } });
}


function endGame() {
    gameOver = true;
    clearInterval(gameInterval);
    document.getElementById('gameOver').classList.remove('hidden');
    document.getElementById('mobile-controls').classList.add('hidden');
}

document.getElementById('restartBtn').onclick = function() {
    // Reset everything
    snake = [
        { x: 9 * box, y: 10 * box },
        { x: 8 * box, y: 10 * box }
    ];
    direction = null;
    nextDirection = null;
    food = randomFoodPosition();
    score = 0;
    document.getElementById('score').textContent = 'Score: 0';
    document.getElementById('gameOver').classList.add('hidden');
    document.getElementById('instructions').classList.remove('hidden');
    document.getElementById('mobile-controls').classList.add('hidden');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    gameOver = false;
    clearInterval(gameInterval);
    gameInterval = null;
};

draw();
