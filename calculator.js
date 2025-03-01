const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scale = 20; // Size of each block (snake segment and food)
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let food;
let score;
let direction;
let gameInterval;

function startGame() {
    canvas.width = 400;
    canvas.height = 400;
    snake = new Snake();
    food = new Food();
    score = 0;
    direction = 'RIGHT';
    gameInterval = setInterval(gameLoop, 100);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.move();
    snake.draw();

    if (snake.collidesWithWalls() || snake.collidesWithSelf()) {
        gameOver();
    }

    food.draw();
    if (snake.eatsFood(food)) {
        score++;
        food = new Food(); // Generate new food
        document.getElementById("score").textContent = "Score: " + score;
    }
}

function gameOver() {
    clearInterval(gameInterval);
    alert("Game Over! Your score is " + score);
    startGame();
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== 'DOWN') {
        direction = 'UP';
    } else if (event.key === "ArrowDown" && direction !== 'UP') {
        direction = 'DOWN';
    } else if (event.key === "ArrowLeft" && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (event.key === "ArrowRight" && direction !== 'LEFT') {
        direction = 'RIGHT';
    }
});

class Snake {
    constructor() {
        this.body = [
            { x: 4, y: 4 },
            { x: 3, y: 4 },
            { x: 2, y: 4 }
        ];
        this.direction = direction;
    }

    draw() {
        ctx.fillStyle = "#00FF00";
        for (let i = 0; i < this.body.length; i++) {
            const segment = this.body[i];
            ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale);
        }
    }

    move() {
        const head = { ...this.body[0] };

        if (this.direction === 'UP') head.y -= 1;
        if (this.direction === 'DOWN') head.y += 1;
        if (this.direction === 'LEFT') head.x -= 1;
        if (this.direction === 'RIGHT') head.x += 1;

        this.body.unshift(head);
        this.body.pop();
    }

    collidesWithWalls() {
        const head = this.body[0];
        return head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows;
    }

    collidesWithSelf() {
        const head = this.body[0];
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }

    eatsFood(food) {
        const head = this.body[0];
        return head.x === food.x && head.y === food.y;
    }
}

class Food {
    constructor() {
        this.x = Math.floor(Math.random() * columns);
        this.y = Math.floor(Math.random() * rows);
    }

    draw() {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(this.x * scale, this.y * scale, scale, scale);
    }
}

startGame();
