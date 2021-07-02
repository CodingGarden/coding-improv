/* eslint-disable prefer-destructuring */
const desktopElement = document.querySelector('.desktop');
const iconsElement = document.querySelector('.desktop-icons');
const batteryElement = document.querySelector('.battery-percent');
const statsElement = document.querySelector('.stats');
const scoreElement = document.querySelector('.score');
const gameOverElement = document.querySelector('.game-over');
const percentElement = document.querySelector('.percent');

const gameState = {
  running: true,
  batteryPercent: 100,
  points: 0,
  icons: 0,
};

const images = [{
  points: 10,
  batteryCost: -10,
  url: 'butter.png',
}, {
  points: 100,
  batteryCost: -5,
  url: 'bonzi-cursor.png',
}, {
  points: 200,
  batteryCost: 20,
  url: 'rainbow.png',
}];

iconsElement.addEventListener('click', (e) => {
  console.log(e);
  if (!gameState.running) return;
  const imageElement = document.createElement('img');
  imageElement.classList.add('desktop-icon');
  const value = Math.random();
  gameState.icons += 1;
  let image = images[1];
  if (value <= 0.2) {
    image = images[2];
  } else if (value <= 0.6) {
    image = images[0];
  }
  gameState.batteryPercent += image.batteryCost;
  gameState.points += image.points;
  imageElement.src = image.url;
  imageElement.style.left = (e.layerX / iconsElement.clientWidth) * 100 + '%';
  imageElement.style.top = (e.layerY / iconsElement.clientHeight) * 100 + '%';
  iconsElement.append(imageElement);

  if (gameState.batteryPercent > 100) {
    gameState.batteryPercent = 100;
  }

  const percent = gameState.batteryPercent + '%';
  batteryElement.style.width = percent;
  percentElement.textContent = percent;

  if (gameState.batteryPercent <= 20) {
    batteryElement.style.background = 'red';
    desktopElement.style.filter = 'brightness(40%)';

  } else {
    batteryElement.style.background = '';
    desktopElement.style.filter = '';
  }

  scoreElement.textContent = gameState.points;

  if (gameState.batteryPercent <= 0) {
    gameState.running = false;
    gameOverElement.style.display = 'flex';
    statsElement.textContent = `You scored: ${gameState.points} points. You created ${gameState.icons} icons.`;
    desktopElement.style.filter = '';
  }
});
