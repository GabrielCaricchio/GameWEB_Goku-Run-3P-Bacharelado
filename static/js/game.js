const mario    = document.getElementById('mario');
const pipe     = document.getElementById('pipe');
const gameOver = document.getElementById('game-over-screen');
const scoreEl  = document.getElementById('score');
const hiEl     = document.getElementById('hiscore');
const container= document.getElementById('game-container');

let gameRunning   = false;
let isJumping     = false;
let score         = 0;
let hiScore       = 0;
let pipeX         = 1060;
let pipeSpeed     = 5;
let animFrame;
let scoreInterval;
let marioBottom   = 46;
let jumpVelocity  = 0;
let gravity       = 1.8;
const jumpPower   = 25;
const groundY     = 46;

function startGame() {
  gameRunning  = true;
  isJumping    = false;
  score        = 0;
  pipeX        = 1060;
  pipeSpeed    = 7;
  marioBottom  = groundY;
  jumpVelocity = 0;
  mario.style.display = '';
  mario.style.bottom = groundY + 'px';
  pipe.style.right = 'auto';
  pipe.style.left  = pipeX + 'px';
  gameOver.classList.remove('show');
  updateScore();
  loop();
}

function jump() {
  if (!gameRunning) { startGame(); return; }
  if (!isJumping) {
    isJumping    = true;
    jumpVelocity = jumpPower;
  }
}

function loop() {
  if (!gameRunning) return;

  // Pipe movement
  pipeX -= pipeSpeed;
  if (pipeX < -120) {
    pipeX = 1060;
    pipeSpeed += 0.3; // acelera com o tempo
  }
  pipe.style.left = pipeX + 'px';

  // Jump physics
  if (isJumping) {
    marioBottom  += jumpVelocity;
    jumpVelocity -= gravity;
    if (marioBottom <= groundY) {
      marioBottom  = groundY;
      isJumping    = false;
      jumpVelocity = 0;
    }
  }
  mario.style.bottom = marioBottom + 'px';

  // Score
  score++;
  scoreEl.textContent = Math.floor(score / 6);

  // Collision detection
  const marioRect = {
    left:   182,
    right:  182 + 68,
    bottom: marioBottom,
    top:    marioBottom + 94
  };
  const pipeRect = {
    left:   pipeX + 7,
    right:  pipeX + 48,
    bottom: groundY,
    top:    groundY + 72
  };

  const hit = marioRect.right  > pipeRect.left  &&
              marioRect.left   < pipeRect.right &&
              marioRect.bottom < pipeRect.top   &&
              marioRect.top    > pipeRect.bottom;

  if (hit) {
    endGame();
    return;
  }

  animFrame = requestAnimationFrame(loop);
}

function endGame() {
  gameRunning = false;
  cancelAnimationFrame(animFrame);
  mario.style.display = 'none';
  const final = Math.floor(score / 6);
  if (final > hiScore) {
    hiScore = final;
    hiEl.textContent = hiScore;
  }
  scoreEl.textContent = final;
  gameOver.classList.add('show');
}

function updateScore() {
  hiEl.textContent = hiScore;
}

// Controls
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    jump();
  }
});
container.addEventListener('click', () => jump());
document.getElementById('restart-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  startGame();
});

// Start on load
startGame();