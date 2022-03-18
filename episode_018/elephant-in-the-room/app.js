const gameBoard = document.querySelector('#game-board');
const timerElement = document.querySelector('#timer');

for (let row = 0; row < 10; row += 1) {
  for (let col = 0; col < 10; col += 1) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.row = row + 1;
    cell.dataset.col = col + 1;
    cell.id = `cell-${col + 1}-${row + 1}`;
    cell.style.gridColumn = col + 1;
    cell.style.gridRow = row + 1;
    gameBoard.append(cell);
  }
}

async function getRandomElephants() {
  const allElephantsArray = allElephants.data.query.search.edges;
  const elephants = [3, 3, 2, 1].map((size) => {
    const randomIndex = Math.floor(Math.random() * allElephantsArray.length);
    const [randomElement] = allElephantsArray.splice(randomIndex, 1);
    return {
      size,
      url: randomElement.node.asset.imageUrl,
    };
  });

  function getRandomCoordinates(size, others) {
    const x = 1 + Math.floor(Math.random() * (11 - size));
    const y = 1 + Math.floor(Math.random() * (11 - size));
    if (
      others.every(
        (otherElephant) => !(
          x < otherElephant.x + otherElephant.size
            && x + size > otherElephant.x
            && y < otherElephant.y + otherElephant.size
            && size + y > otherElephant.y
        ),
      )
    ) {
      return {
        x,
        y,
      };
    }
    return getRandomCoordinates(size, others);
  }

  elephants.forEach((elephant) => {
    elephant.hits = 0;
    elephant.totalHits = elephant.size * elephant.size;
    const others = elephants.filter(
      (other) => other !== elephant && other.x && other.y,
    );
    const { x, y } = getRandomCoordinates(elephant.size, others);
    elephant.x = x;
    elephant.y = y;
    const imgWrapper = document.createElement('div');
    imgWrapper.classList.add('image-wrapper');
    imgWrapper.style.gridRow = elephant.y;
    imgWrapper.style.gridRowEnd = elephant.y + elephant.size;
    imgWrapper.style.gridColumn = elephant.x;
    imgWrapper.style.gridColumnEnd = elephant.x + elephant.size;
    const img = document.createElement('img');
    img.src = elephant.url;
    elephant.element = img;
    imgWrapper.append(img);
    gameBoard.append(imgWrapper);
  });

  return elephants;
}

getRandomElephants()
  .then((elephants) => {
    init(elephants);
  });

const client = new tmi.Client({
  channels: ['codinggarden'],
});

client.connect();

const guessLength = 17 * 1000;

const gameState = {
  guessing: true,
  timerEnd: Date.now() + (guessLength),
  guessedCells: new Set(),
  foundElephants: 0,
};

const hasVoted = new Set();
const votes = new Map();

function showVotes() {
  [...votes]
    .forEach(([coord, numVotes]) => {
      const [column, row] = coord.split(',');
      const cell = document.querySelector(`#cell-${column}-${row}`);
      cell.innerHTML = `<span>${numVotes}</span>`;
    });
}

client.on('message', (channel, tags, message) => {
  // !elephant-vote 5 10
  let [command, column, row] = message.split(' ');
  if (command === '!elephant-vote' && !hasVoted.has(tags.username)) {
    if (isNaN(row) || isNaN(column)) return;
    if (row < 1 || row > 10) return;
    if (column < 1 || column > 10) return;
    row = parseInt(row, 10);
    column = parseInt(column, 10);
    const coord = `${column},${row}`;
    if (gameState.guessedCells.has(coord)) return;
    hasVoted.add(tags.username);
    votes.set(coord, (votes.get(coord) || 0) + 1);
    showVotes();
  }
});

function init(elephants) {
  setInterval(() => {
    if (gameState.guessing) {
      const secondsLeft = Math.floor((gameState.timerEnd - Date.now()) / 1000);
      timerElement.textContent = `0:${secondsLeft.toString().padStart(2, '0')}`;
      if (secondsLeft <= 0) {
        gameState.guessing = false;
        const votesArray = [...votes];
        if (votesArray.length) {
          let [[mostVotedCoord, mostNumVotes]] = votesArray;
          votesArray.forEach(([coord, numVotes]) => {
            if (numVotes > mostNumVotes) {
              mostNumVotes = numVotes;
              mostVotedCoord = coord;
            }
          });
          gameState.guessedCells.add(mostVotedCoord);
          const [column, row] = mostVotedCoord.split(',');
          const cell = document.querySelector(`#cell-${column}-${row}`);
          let wasHit = false;
          elephants.forEach((elephant) => {
            if (column >= elephant.x
              && column <= elephant.x + (elephant.size - 1)
              && row >= elephant.y
              && row <= elephant.y + (elephant.size - 1)) {
              elephant.hits += 1;
              wasHit = true;
              if (elephant.hits === elephant.totalHits) {
                elephant.element.style.opacity = '1';
                gameState.foundElephants += 1;
              }
              console.log('HIT', elephant);
            }
          });
          if (wasHit) {
            cell.classList.add('hit');
          } else {
            cell.classList.add('miss');
          }
        }
        if (gameState.foundElephants === elephants.length) {
          document.querySelectorAll('.cell').forEach((element) => {
            element.classList.add('miss');
            element.textContent = '';
          });
          timerElement.textContent = 'You found them all! New game starting soon...';
          setTimeout(() => {
            window.location = '/';
          }, 10 * 1000);
        } else {
          gameState.timerEnd = Date.now() + (guessLength);
          gameState.guessing = true;
          votes.clear();
          hasVoted.clear();
          document.querySelectorAll('.cell').forEach((element) => {
            element.textContent = '';
          });
        }
      }
    }
  }, 500);
}
