/*
1. get a random word from a dictionary api
2. scramble that word
3. display scrambled word
4. chat can attempt to guess the word with !guess banana hax hax hax
5. the correct guess can do !place bonsai 3 9

*/

const guesserElement = document.querySelector('#guesser');
const randomWordElement = document.querySelector('#randomWord');
const definitionElement = document.querySelector('#definition');
const gridElement = document.querySelector('.grid');

let currentWord = '';
let currentDefinition = '';
let currentWinner = '';
const images = [];

function updateGrid() {
  gridElement.innerHTML = '';
  images.forEach((image) => {
    const imageElement = document.createElement('img');
    imageElement.src = image.src;
    imageElement.style.gridColumn = image.col;
    imageElement.style.gridRow = image.row;
    gridElement.appendChild(imageElement);
  });
}

function scrambleWord(word) {
  const hat = [...word];
  let scrambledWord = '';
  while (hat.length) {
    const randomIndex = Math.floor(Math.random() * hat.length);
    const randomLetter = hat[randomIndex];
    scrambledWord += randomLetter;
    hat.splice(randomIndex, 1);
  }
  return scrambledWord;
}

async function getRandomWord() {
  const response = await fetch('https://random-words-api.vercel.app/word');
  const json = await response.json();
  const [{ word, definition }] = json;
  return { word, definition };
}

function resetGame({ word, definition }) {
  // reveal one letter of the definition every 10 seconds?
  currentWord = word;
  currentDefinition = definition;
  currentWinner = '';
  console.log(currentWord);
  guesserElement.textContent = '';
  randomWordElement.textContent = scrambleWord(word);
  definitionElement.textContent = currentDefinition;
}

getRandomWord()
  .then(resetGame);

const client = new tmi.Client({
  connection: { reconnect: true },
  channels: ['codinggarden'],
});

client.connect();

client.on('message', (channel, tags, message, self) => {
  if (!currentWord) return;
  const [command, ...args] = message.split(' ');
  if (command === '!guess') {
    if (currentWinner) return;
    const guess = args.join(' ');
    if (guess === currentWord) {
      console.log('WINNER!', guess, tags['display-name']);
      randomWordElement.textContent = currentWord;
      definitionElement.textContent = currentDefinition;
      currentWinner = tags['user-id'];
      guesserElement.textContent = `${tags['display-name']} has guessed:`;
    } else {
      console.log('INCORRECT GUESS!', guess, tags['display-name']);
    }
  } if (command === '!place' && tags['user-id'] === currentWinner) {
    const [name, row, col] = args;
    images.push({
      src: 'images/bonsai.png',
      row: row || 3,
      col: col || 5,
    });
    updateGrid();
    getRandomWord()
      .then(resetGame);
  }
});
