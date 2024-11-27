// ============================
// Game Variables and Constants
// ============================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const playBtn = document.getElementById("playBtn");

const initialDinoState = {
    x: 100,
    y: 150,
    width: 20,
    height: 40,
    dy: 0,
    gravity: 0.3,
    jumpForce: -12,
    isJumping: false,
    isDucking: false,
};

let dino;
let obstacles, flyingObstacle, score;
let isGameOver = false, isGameStarted = false;
const obstacleSpeed = 1;
const flyingObstacleSpeed = 1;
const gapBetweenObstacles = 100;

// ============================
// Intial Game setup
// ============================
function gameSetup() {
    obstacles = [];
    flyingObstacle = null;
    score = 0;
    isGameOver = false;
    dino = initialDinoState;
}

// ============================
// Start Game
// ============================
function startGame() {
    gameSetup();
    drawGame();
    playBtn.textContent = "Restart";
    playBtn.disabled = true;
    //playBtn.style.display = "none";

    isGameStarted = true;
}

// ============================
// Create ground obstacles
// ============================
function createGroundObstacle() {
  const size = Math.random() * 15 + 15;
  const obstacle = {
    x: canvas.width,
    y: canvas.height - size,
    width: size,
    height: size,
  };
  obstacles.push(obstacle);
}

// ============================
// Create flying obstacles
// ============================
function createFlyingObstacle() {
  const bird = {
    x: canvas.width,
    y: dino.y - 10, // Position the bird at the same height as the dino's head
    width: 20,
    height: 20,
  };
  flyingObstacle = bird;
}

// ============================
// Detect Collision
// ============================
function detectCollision(dino, obstacle) {
  return (
    dino.x < obstacle.x + obstacle.width &&
    dino.x + dino.width > obstacle.x &&
    dino.y < obstacle.y + obstacle.height &&
    dino.y + dino.height > obstacle.y
  );
}


// ============================
// Drawing and Game Loop
// ============================
function drawGame() {
  if (isGameOver) {
    ctx.font = "20px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Game Over!", canvas.width / 2 - 80, canvas.height / 2);
    ctx.fillText(`Score: ${score}`, canvas.width / 2 - 50, canvas.height / 2 + 40);
    
    // Show "Play Again" button
    //playBtn.style.display = "block";
    playBtn.textContent = "Restart";
    playBtn.disabled = false;
    isGameStarted = false;
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Draw Dino (based on its jumping or ducking state)
  ctx.fillStyle = "green";
  if (dino.isDucking) {
    ctx.fillRect(dino.x, dino.y + 20, dino.width, dino.height - 20); // Ducking behavior
  } else {
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
  }

  // Draw ground obstacles
  ctx.fillStyle = "red";
  for (let i = 0; i < obstacles.length; i++) {
    const obs = obstacles[i];
    obs.x -= obstacleSpeed; // Move the obstacle to the left
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    if (obs.x + obs.width < 0) {
      obstacles.splice(i, 1);
      i--; // Remove obstacle once it's off-screen
      score++;
    }

    // Detect collision with the dino
    if (detectCollision(dino, obs) && !dino.isDucking) {
      isGameOver = true;
    }
  }

  // Draw flying obstacle
  if (flyingObstacle) {
    flyingObstacle.x -= flyingObstacleSpeed;
    ctx.fillStyle = "blue";
    ctx.fillRect(flyingObstacle.x, flyingObstacle.y, flyingObstacle.width, flyingObstacle.height);

    // Collision detection for flying obstacle
    if (detectCollision(dino, flyingObstacle) && !dino.isDucking) {
      isGameOver = true;
    }

    if (flyingObstacle.x + flyingObstacle.width < 0) {
      flyingObstacle = null; // Remove flying obstacle once it's off-screen
      score++;
    }
  }

  // Dino gravity and jump logic
  dino.y += dino.dy;
  dino.dy += dino.gravity;

  // Prevent the dino from falling below the ground
  if (dino.y > canvas.height - dino.height) {
    dino.y = canvas.height - dino.height;
    dino.isJumping = false;
  }

  // Spawn new obstacles (ground or flying)
  if (Math.random() < 0.003) {
    if (!flyingObstacle) {
      if (Math.random() < 0.5) {
        createGroundObstacle();
      } else {
        createFlyingObstacle();
      }
    }
  }

  // Display score
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(`Score: ${score}`, 10, 30);

  // Recursively call game loop
  requestAnimationFrame(drawGame);
}

// ============================
// Manual control to Jump
// ============================
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !dino.isJumping && isGameStarted) {
    dino.dy = dino.jumpForce;
    dino.isJumping = true;
  }
  if (e.code === "ArrowDown") {
    dino.isDucking = true; // Start ducking
  }
});


// =======================================
// Manual control to Duck
// ---------------------------------------
// Stop ducking when the key is released
// =======================================
document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowDown") {
    dino.isDucking = false; // Stop ducking
  }
});

// ===================================
// Start/Restart game on button click
// ===================================
playBtn.addEventListener("click", startGame);

