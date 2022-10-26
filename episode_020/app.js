const startButtonElement = document.querySelector('#startButton');
const backgroundImageElement = document.querySelector('.background');
const copyrightElement = document.querySelector('.copyright');
const morganElement = document.querySelector('.morgan');
let images = null;

const getQuoteFiles = () => ([
  'change.wav',
  'dream.wav',
  'hard-to-fail.wav',
  'never.wav',
  'ownlife.wav',
  'reach-a-port.wav',
  'success-dictionary.wav',
  'success.wav',
  'sunshine.wav',
]);



let currentRandomQuote = '';
let quoteFiles = getQuoteFiles();

function getRandomQuote() {
  if (!quoteFiles.length) {
    quoteFiles = getQuoteFiles();
  }
  const randomIndex = Math.floor(Math.random() * quoteFiles.length);
  const [quote] = quoteFiles.splice(randomIndex, 1);
  if (quote === currentRandomQuote) {
    return getRandomQuote();
  }
  currentRandomQuote = quote;
  return quote;
}

async function getRandomSpaceBackground() {
  if (!images) {
    const response = await fetch(`./images.json`);
    images = await response.json();
  }
  return images[Math.floor(Math.random() * images.length)];
}

backgroundImageElement.addEventListener('load', () => {
  backgroundImageElement.style.opacity = 1;
  if (copyrightElement.textContent) {
    copyrightElement.textContent = `© ${copyrightElement.textContent}`;
    copyrightElement.style.opacity = 1;
  }
});

async function setSpaceBackground() {
  backgroundImageElement.style.opacity = 0;
  copyrightElement.style.opacity = 0;
  setTimeout(async () => {
    const randomImage = await getRandomSpaceBackground();
    copyrightElement.textContent = randomImage.copyright;
    backgroundImageElement.src = randomImage.hdurl || randomImage.url;
  }, 1500);
}

setSpaceBackground();

function playRandomQuote(timeout = 3000) {
  setTimeout(() => {
    const randomY = Math.floor(Math.random() * (window.innerHeight - morganElement.clientHeight));
    const randomX = Math.floor(Math.random() * (window.innerWidth - morganElement.clientWidth));
    morganElement.style.top = `${randomY}px`;
    morganElement.style.left = `${randomX}px`;
    morganElement.style.opacity = 1;
    const randomQuote = getRandomQuote();
    const voiceAudio = new Audio(`./quotes/${randomQuote}`);
    voiceAudio.play();
    voiceAudio.addEventListener('ended', () => {
      morganElement.style.opacity = 0;
      setTimeout(() => {
        playRandomQuote();
        setSpaceBackground();
      }, 3000);
    });
  }, timeout);
}

let hasClicked = false;

document.addEventListener('click', () => {
  if (hasClicked) return;
  startButtonElement.style.display = 'none';
  hasClicked = true;
  const backgroundAudio = new Audio('./space.wav');
  backgroundAudio.volume = 0.2;
  backgroundAudio.loop = true;
  backgroundAudio.play();
  playRandomQuote(500);
});