const mainElement = document.querySelector('main');
const cardsElement = document.querySelector('#cards');
const emojis = ['🤓', '🎭', '🌱', '🎉', '🎈', '🚀', '💩', '✨', '🌵', '🐛', '🎆', '💚', '🤣', '📳'];

function getStartingEmojis() {
  const allEmojis = emojis.slice();
  const startingEmojis = [];

  while (startingEmojis.length < 12) {
    const randomIndex = Math.floor(Math.random() * allEmojis.length);
    startingEmojis.push(allEmojis[randomIndex]);
    allEmojis.splice(randomIndex, 1);
  }
  return startingEmojis;
}

function shuffleArray(array) {
  const shuffledArray = [];

  while (array.length) {
    const randomIndex = Math.floor(Math.random() * array.length);
    shuffledArray.push(array[randomIndex]);
    array.splice(randomIndex, 1);
  }

  return shuffledArray;
}

function startGame() {
  const gameState = {
    flipped: [],
    score: 0,
  };
  const startingEmojis = getStartingEmojis();
  const emojisWithPairs = shuffleArray(startingEmojis.concat(startingEmojis));
  emojisWithPairs.forEach((emoji) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.innerHTML = `
      <div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <img src="can.png">
          </div>
          <div class="flip-card-back">
            <h1 class="emoji">${emoji}</h1>
          </div>
        </div>
      </div>
    `;
    cardsElement.appendChild(cardElement);
    cardElement.addEventListener('click', () => {
      if (cardElement.classList.contains('card-correct') || cardElement.classList.contains('flip-card-flipped')) return;
      if (gameState.flipped.length < 2) {
        cardElement.classList.add('flip-card-flipped');
        gameState.flipped.push({ emoji, element: cardElement });
      }

      if (gameState.flipped.length === 2) {
        if (gameState.flipped[0].emoji === gameState.flipped[1].emoji) {
          gameState.flipped.forEach((flipped) => {
            flipped.element.classList.remove('card');
            flipped.element.classList.add('card-correct');
          });
          gameState.flipped = [];
          gameState.score += 1;
          if (gameState.score === startingEmojis.length) {
            setTimeout(() => {
              const fireworks = new Fireworks(mainElement);
              fireworks.start();
              cardsElement.style.opacity = '0.2';
            }, 700);
          }
        } else {
          setTimeout(() => {
            gameState.flipped = [];
            document.querySelectorAll('.card').forEach((card) => {
              card.classList.remove('flip-card-flipped');
            });
          }, 700);
        }
      }
    });
  });
}

startGame();
