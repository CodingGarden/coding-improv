/*
1. get a random word from a dictionary api
2. scramble that word
3. display scrambled word
4. chat can attempt to guess the word with !guess banana hax hax hax
5. the correct guess can do !place bonsai 3 9

*/

//the winners element
const winnersElement = document.querySelector('#winners');
const guesserElement = document.querySelector('#guesser');
const randomWordElement = document.querySelector('#randomWord');
const definitionElement = document.querySelector('#definition');
const gridElement = document.querySelector('.grid');

let currentWord = '';
let currentDefinition = '';
//it's false vefore the first reset, get set to false everytime
//someone correctly guess and stays false until the next reset.
let canGuess = false;
const images = [];
//the array of winners
const winners=[];

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
  //after each reset the chat can start to guess again
  canGuess=true;
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

//function to get the string of winners. It can contain the same
//winner multiple times if it guessed correctly multiple times.
//It's not dinstinct so that everyone can see how many images can place.
function getWinnersString(){
  return winners.map(winner => winner.username).join(", ");
}

client.on('message', (channel, tags, message, self) => {
  if (!currentWord) return;
  const [command, ...args] = message.split(' ');
  if (command === '!guess') {
    //if canGuess it's false it means we are waiting for the game to
    //reset either after a correct guess or the first time the page load
    if (!canGuess) return;
    const guess = args.join(' ');
    //lower casing the guess and the current word for case insensitivity
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      console.log('WINNER!', guess, tags['display-name']);
      randomWordElement.textContent = currentWord;
      definitionElement.textContent = currentDefinition;
      //push the current winner to the array of winners. Adding userId
      //to avoid cheating (like changing the display name) and the display
      //name to show the list of winners.
      winners.push({
        userId: tags['user-id'],
        username: tags['display-name']
      })
      //set the can guess to false
      canGuess=false;
      //recalculate and show the updated list of winners.
      winnersElement.textContent=`Winners: ${getWinnersString()}`;
      guesserElement.textContent = `${tags['display-name']} has guessed:`;
      //show the correct word and the guesser for 10 seconds than reset the game
      setTimeout(()=> getRandomWord().then(resetGame),10000);
    } else {
      console.log('INCORRECT GUESS!', guess, tags['display-name']);
    }
  } if (command === '!place' && winners.map(winner => winner.userId).includes(tags['user-id'])) {
    //it can enter here only if the command is !place and the id of
    //the sender is in the winners array
    const [name, row, col] = args;
    images.push({
      src: 'images/bonsai.png',
      row: row || 3,
      col: col || 5,
    });
    updateGrid();
    //remove one occurence of the "placer" from the winners array
    winners.splice(winners.findIndex(elem => elem.userId === tags["user-id"]), 1);
    //update the winners element
    winnersElement.textContent=`Winners: ${getWinnersString()}`;
  }
});
