const resetButtonElement = document.querySelector('#resetButton');
const countdownElement = document.querySelector('#countdown');
const promptElement = document.querySelector('#prompt');
const definitionElement = document.querySelector('#definition');

const width = 300;
const height = 500;
const pixelSize = 10;

const prompts = [
  'Yorkshire Terrier',
  'pumpkin',
  'remote',
  'power cord',
  'foliage',
  'Philosophy',
  'nature',
  'mosquito',
  'Chicken',
  'brain',
];

const canvas = document.querySelector('#draw-area');
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');

let gameOver = false;

const currentLocation = {
  x: width / 2,
  y: height / 2,
};

resetButtonElement.addEventListener('click', () => {
  startRound();
});

document.body.addEventListener('keydown', (e) => {
  if (gameOver) return;
  drawPixel('black');
  switch(e.code) {
    case 'KeyW': {
      currentLocation.y -= pixelSize;
      break;
    }
    case 'KeyA': {
      currentLocation.x -= pixelSize;
      break;
    }
    case 'KeyS': {
      currentLocation.y += pixelSize;
      break;
    }
    case 'KeyD': {
      currentLocation.x += pixelSize;
      break;
    }
    default: break;
  }
  if (currentLocation.x < 0) {
    currentLocation.x = 0;
  } else if (currentLocation.x + pixelSize > width) {
    currentLocation.x = width - pixelSize;
  }
  if (currentLocation.y < 0) {
    currentLocation.y = 0;
  } else if (currentLocation.y + pixelSize > height) {
    currentLocation.y = height - pixelSize;
  }
  drawPixel('grey');
});

function drawPixel(color) {
  ctx.fillStyle = color || 'black';
  ctx.fillRect(currentLocation.x, currentLocation.y, pixelSize, pixelSize);
}

function getRandomValue(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

async function getRandomPrompt(prompt) {
  const response = await fetch(`https://api.datamuse.com/words?ml=${prompt}&md=d`);
  const json = await response.json();
  const nouns = json.filter((item) => item.tags.includes('n'));
  if (!nouns.length) {
    console.log(prompt);
  }
  const randomRelated = getRandomValue(nouns);
  return {
    word: randomRelated.word,
    definition: (randomRelated.defs || ['not found']).find((def) => def.startsWith('n')).replace('n\t', ''),
  };
}

async function startRound() {
  resetButtonElement.style.display = 'none';
  gameOver = false;
  countdownElement.textContent = '60';
  currentLocation.x = width / 2;
  currentLocation.y = height / 2;
  const endTime = Date.now() + (60 * 1000);
  const initialPrompt = getRandomValue(prompts);
  const prompt = await getRandomPrompt(initialPrompt);
  promptElement.textContent = prompt.word;
  definitionElement.textContent = prompt.definition;

  ctx.fillStyle = '#F8FA90';
  ctx.fillRect(0, 0, width, height);

  drawPixel();

  const countDownInterval = setInterval(() => {
    const secondsLeft = Math.floor((endTime - Date.now()) / 1000);
    countdownElement.textContent = secondsLeft;
    if (secondsLeft <= 0) {
      countdownElement.textContent = 'GAME OVER';
      gameOver = true;
      clearInterval(countDownInterval);
      resetButtonElement.style.display = '';
    }
  }, 500);
}

startRound();