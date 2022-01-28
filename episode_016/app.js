import kaboom from 'https://unpkg.com/kaboom/dist/kaboom.mjs';

const pantsElement = document.querySelector('#score');
const dragonImage = document.createElement('img');
dragonImage.src = '/images/dragon.gif';
dragonImage.className = 'dragon';
dragonImage.style.display = 'none';
document.body.appendChild(dragonImage);

kaboom({
  scale: 8,
  font: 'sinko',
  background: [255, 255, 255],
});

const SPEED = 50;
const JUMP_FORCE = 150;
const PIPE_OPEN = 240;
const PIPE_MIN = 70;
const CEILING = -60;
const state = {
  score: 0,
  gameOver: false,
};

loadSprite('frog', '/images/frog.png', {
  sliceX: 13,
  sliceY: 12,
  anims: {
    idle: {
      from: 104,
      to: 105,
      speed: 5,
      loop: true,
    },
    jump: {
      from: 105,
      to: 105 + 6,
      speed: 10,
      loop: true,
    },
  },
});

scene('game', () => {
  dragonImage.style.display = 'none';
  const player = add([
    sprite('frog'),
    pos(50, height() - 1),
    origin('center'),
    area(),
    body(),
  ]);

  player.play('idle');

  add([
    rect(width(), 24),
    area(),
    outline(1),
    pos(0, height()),
    solid(),
  ]);

  onKeyPress('up', () => {
    player.jump(JUMP_FORCE);
    player.play('jump');
    gravity(640);
  });

  onClick(() => {
    player.jump(JUMP_FORCE);
    player.play('jump');
    gravity(640);
  });

  player.onGround(() => {
    if (!isKeyDown('left') && !isKeyDown('right')) {
      player.play('idle');
    } else {
      player.play('jump');
    }
  });

  const maxHeight = height() - 50;
  const minHeight = 40;
  function spawnDragon() {
    const y = minHeight + Math.floor(Math.random() * maxHeight);

    add([
      pos(width(), y),
      rect(10, height() - y),
      color(0, 127, 255),
      outline(1),
      area(),
      move(LEFT, SPEED),
      cleanup(),
      'dragon',
      { passed: false },
    ]);
  }

  function addScore() {
    state.score += 1;
    const element = document.createElement('img');
    element.src = '/images/pants.png';
    pantsElement.appendChild(element);
  }

  onUpdate('dragon', (dragon) => {
    if (dragon.pos.x + dragon.width <= player.pos.x && dragon.passed === false) {
      addScore();
      dragon.passed = true;
    }
    if (state.gameOver) {
      dragon.move(0);
    }
  });

  player.onCollide('dragon', () => {
    if (state.gameOver) return;
    state.gameOver = true;
    go('gameOver');
  });

  loop(1, () => {
    if (state.gameOver) return;
    spawnDragon();
  });
});

scene('gameOver', () => {
  dragonImage.style.display = '';
  pantsElement.innerHTML = '';
  add([
    text('GAME OVER: ' + state.score),
    pos(width() / 2, height() / 2),
    scale(1),
    origin('center'),
  ]);

  onKeyPress('space', () => {
    state.score = 0;
    state.gameOver = false;
    go('game');
  });
  onClick(() => {
    state.score = 0;
    state.gameOver = false;
    go('game');
  });
});


go('game');
