const gameElement = document.querySelector('#game');
const balloonElement = document.querySelector('#balloon');

const state = {
  titles: [],
  all_titles: [],
  balloon: {
    element: balloonElement,
    position: {
      x: 0,
      y: 0,
    },
    velocity: {
      x: 0,
      y: 0,
    },
  },
};

function addRandomMovie() {
  const index = Math.floor(Math.random() * state.all_titles.length);
  const [movie] = state.all_titles.splice(index, 1);
  if (!movie.poster_path) {
    return addRandomMovie();
  }
  movie.element = document.createElement('div');
  movie.element.classList.add('title-cloud');
  movie.element.innerHTML = `
  <img class="cloud" src="cloud.webp" />
  <img class="poster" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" />`;
  movie.position = {
    x: Math.floor(Math.random() * (window.innerWidth - 200)),
    y: Math.floor(Math.random() * (window.innerHeight - 200)),
  };
  movie.velocity = {
    x: (Math.random() > 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 5)),
    y: 0,
  };
  movie.element.querySelector('.cloud').style.opacity = 0.5 + Math.random() * 0.4;
  gameElement.append(movie.element);
  state.titles.push(movie);
}

function update() {
  state.balloon.position.x += state.balloon.velocity.x;
  state.balloon.position.y += state.balloon.velocity.y;

  if (state.balloon.position.x >= window.innerWidth) {
    state.balloon.position.x = -200;
  } else if (state.balloon.position.x < -200) {
    state.balloon.position.x = window.innerWidth - 10;
  }

  if (state.balloon.position.y >= window.innerHeight) {
    state.balloon.position.y = -200;
  } else if (state.balloon.position.y < -200) {
    state.balloon.position.y = window.innerHeight;
  }

  const balloonRect = balloonElement.getBoundingClientRect();
  // balloonRect.
  state.titles.forEach((title) => {
    title.position.x += title.velocity.x;
    title.position.y += title.velocity.y;

    if (title.position.x >= window.innerWidth) {
      title.position.x = -200;
    } else if (title.position.x <= -200) {
      title.position.x = window.innerWidth - 10;
    }
    const titleRect = title.element.getBoundingClientRect();
    if (balloonRect.x < titleRect.x + titleRect.width &&
      balloonRect.x + balloonRect.width > titleRect.x &&
      balloonRect.y < titleRect.y + titleRect.height &&
      balloonRect.height + balloonRect.y > titleRect.y) {
      title.remove = true;
    }
    // const collidingX = (balloonRect.x >= titleRect.x
    //   && balloonRect.x <= titleRect.x + titleRect.width)
    //   || (balloonRect.x + balloonRect.width >= titleRect.x
    //     && balloonRect.x + balloonRect.width <= titleRect.x + titleRect.width);

    // const collidingY = (balloonRect.y >= titleRect.y
    //     && balloonRect.y <= titleRect.y + titleRect.height)
    //   || (balloonRect.y + balloonRect.height >= titleRect.y
    //     && balloonRect.y + balloonRect.height <= titleRect.y + titleRect.height);
  });
}

function draw() {
  state.balloon.element.style.top = state.balloon.position.y + 'px';
  state.balloon.element.style.left = state.balloon.position.x + 'px';

  state.titles.forEach((title) => {
    title.element.style.top = title.position.y + 'px';
    title.element.style.left = title.position.x + 'px';

    if (title.remove) {
      state.titles = state.titles.filter((other) => other.id !== title.id);
      title.element.remove();
      addRandomMovie();
    }
  });

  update();
  requestAnimationFrame(draw);
}

async function init() {
  const client = new tmi.Client({
    channels: ['codinggarden'],
  });
  client.connect();
  client.on('message', (channel, tags, message, self) => {
    message = message.toLowerCase();
    // !balloon up
    // !balloon down
    // !balloon right
    // !balloon left
    const [command, direction] = message.split(' ');
    if (direction && command === '!balloon') {
      if (direction === 'up') {
        state.balloon.velocity.y -= 1;
      } else if (direction === 'down') {
        state.balloon.velocity.y += 1;
      } else if (direction === 'left') {
        state.balloon.velocity.x -= 1;
      } else if (direction === 'right') {
        state.balloon.velocity.x += 1;
      }
    }
  });

  const response = await fetch('./titles.json');
  state.all_titles = await response.json();
  for (let i = 0; i < 5; i += 1) {
    addRandomMovie();
  }
  state.balloon.position = {
    x: window.innerWidth / 2 - balloonElement.clientWidth / 2,
    y: window.innerHeight - balloonElement.clientHeight - 20,
  };
  requestAnimationFrame(draw);
}

window.addEventListener('DOMContentLoaded', () => {
  init();
});
