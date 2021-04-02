const buttonsElement = document.querySelector('#buttons');
const imageElement = document.querySelector('#image');
const correctScoreElement = document.querySelector('#correct-score');
const wrongScoreElement = document.querySelector('#wrong-score');
const approvedElement = document.querySelector('.approved');
const quakerOatsElement = document.querySelector('.oated');

const championsUrl = 'https://ddragon.leagueoflegends.com/cdn/9.3.1/data/en_US/champion.json';
const getChampionUrl = (champion) => `https://ddragon.leagueoflegends.com/cdn/11.7.1/data/en_US/champion/${champion}.json`;

const wrongSound = new Audio('/sounds/bad.mp3');
const correctSound = new Audio('/sounds/good.mp3');
const stampSound = new Audio('https://freesound.org/data/previews/362/362622_3165091-hq.mp3');

const gameState = {
  classifier: null,
  correctGuesses: 0,
  wrongGuesses: 0,
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

function getRandomValue(array) {
  const randomIndex = getRandomIndex(array);
  return array[randomIndex];
}

async function getChampions() {
  const response = await fetch(championsUrl);
  const json = await response.json();
  return Object.keys(json.data);
}

async function getChampionSkins(champion) {
  const championUrl = getChampionUrl(champion);
  const response = await fetch(championUrl);
  const json = await response.json();
  return {
    champion,
    skins: json.data[champion].skins,
  };
}

function getRandomSkinUrl(info) {
  const skin = getRandomValue(info.skins);
  const skinUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${info.champion}_${skin.num}.jpg`;
  return skinUrl;
}

// getChampions()
//   .then(getRandomValue)
//   .then(getChampionSkins)
//   .then(displayChampionSkin)
//   .catch(console.error);

function getRandomNumber() {
  return Math.floor(Math.random() * 200);
}

async function getChampion() {
  const champions = await getChampions();
  const randomChampion = getRandomValue(champions);
  const info = await getChampionSkins(randomChampion);
  const skinUrl = getRandomSkinUrl(info);
  imageElement.style.transform = `translateX(-${getRandomNumber()}%) translateY(-${getRandomNumber()}%) scale(3)`;
  imageElement.src = skinUrl;
  imageElement.setAttribute('crossOrigin', 'anonymous');
  return new Promise((resolve) => {
    const loaded = () => {
      imageElement.removeEventListener('load', loaded);
      resolve();
    };
    imageElement.addEventListener('load', loaded);
  });
}

async function getSimilarWords(word) {
  const response = await fetch(`https://api.datamuse.com/words?ml=${word}`);
  const json = await response.json();
  return json;
}

async function displayGuessButtons(randomLabel) {
  const similarWords = await getSimilarWords(randomLabel);
  const wordsToDisplay = similarWords.slice(0, 10).map((item) => item.word);
  const randomIndex = getRandomIndex(wordsToDisplay);
  wordsToDisplay.splice(randomIndex, 0, randomLabel);
  wordsToDisplay.forEach((label) => {
    const button = document.createElement('button');
    button.textContent = label;
    buttonsElement.appendChild(button);
    button.addEventListener('click', () => userClickedGuess(randomLabel, label));
  });
}

async function userClickedGuess(answer, guess) {
  if (answer !== guess) {
    wrongSound.currentTime = 0;
    wrongSound.play();
    await sleep(100);
    const utterance = new SpeechSynthesisUtterance(`You are wrong! The answer was ${answer}`);
    speechSynthesis.speak(utterance);
    gameState.wrongGuesses += 1;
  } else {
    correctSound.currentTime = 0;
    correctSound.play();
    await sleep(100);
    const utterance = new SpeechSynthesisUtterance('You are correct!');
    speechSynthesis.speak(utterance);
    gameState.correctGuesses += 1;
  }
  correctScoreElement.textContent = gameState.correctGuesses;
  wrongScoreElement.textContent = gameState.wrongGuesses;
  imageElement.style.transform = 'scale(1)';
  buttonsElement.innerHTML = '';
  if (gameState.correctGuesses >= 5 || gameState.wrongGuesses >= 5) {
    if (gameState.correctGuesses >= 5) {
      stampSound.currentTime = 0;
      stampSound.play();
      approvedElement.classList.remove('hidden');
      const utterance = new SpeechSynthesisUtterance('Congratulations! You have been approved.');
      speechSynthesis.speak(utterance);
    } else {
      stampSound.currentTime = 0;
      stampSound.play();
      quakerOatsElement.classList.remove('hidden');
      const utterance = new SpeechSynthesisUtterance('You have failed. I am disappointed in you. Get oat.');
      speechSynthesis.speak(utterance);
    }
  } else {
    await sleep(3500);
    await getChampion();
    gameState.classifier.classify(document.querySelector('img'), (err, results) => {
      if (results.length) {
        const allLabels = results.reduce((labels, result) => labels.concat(result.label.split(', ')), []);
        const randomLabel = getRandomValue(allLabels);
        displayGuessButtons(randomLabel);
      }
    });
  }
}

async function initialize() {
  try {
    const [classifier] = await Promise.all([
      new Promise((resolve) => {
        const cl = ml5.imageClassifier('MobileNet', () => resolve(cl));
      }),
      getChampion(),
    ]);
    console.log('WE DID IT.');
    gameState.classifier = classifier;
    classifier.classify(document.querySelector('img'), (err, results) => {
      if (results.length) {
        const allLabels = results.reduce((labels, result) => labels.concat(result.label.split(', ')), []);
        const randomLabel = getRandomValue(allLabels);
        displayGuessButtons(randomLabel);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

initialize();
