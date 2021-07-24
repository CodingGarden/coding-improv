const cloudsElement = document.querySelector('.clouds');
const roadElement = document.querySelector('.road');
const scoreElement = document.querySelector('.score-value');

function getRandomNumber(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

const world = {
  gameOver: false,
  updateMs: 40,
  score: 0,
  objects: {
    clouds: [],
    roadLines: [],
    foods: [],
    dino: {
      isJumping: false,
      jumpTicks: 0,
      location: {
        y: -40,
      },
      element: document.querySelector('.dino'),
    },
  },
};

function init() {
  let currentCloud = 1;
  const maxClouds = 4;
  for (let i = 0; i < 20; i += 1) {
    const cloudImage = document.createElement('img');
    cloudImage.src = `cloud-${currentCloud}.png`;
    cloudImage.classList.add('cloud');
    const cloud = {
      element: cloudImage,
      velocity: getRandomNumber(1, 3),
      scale: getRandomNumber(0.7, 1.4),
      location: {
        x: getRandomNumber(-20, 100),
        y: getRandomNumber(-20, 60),
      },
    };
    cloudImage.style.transform = `scale(${cloud.scale})`;
    world.objects.clouds.push(cloud);
    cloudImage.style.opacity = cloud.location.y + '%';
    cloudImage.style.top = cloud.location.y + '%';
    cloudImage.style.left = cloud.location.x + '%';
    cloudsElement.append(cloudImage);
    currentCloud += 1;
    if (currentCloud > maxClouds) {
      currentCloud = 1;
    }
  }
  for (let i = 0; i < 4; i += 1) {
    const roadLineElement = document.createElement('div');
    roadLineElement.classList.add('road-line');
    const roadLine = {
      element: roadLineElement,
      velocity: 1.5,
      location: {
        y: 40,
        x: (i * 20) + (20 * i),
      },
    };
    world.objects.roadLines.push(roadLine);
    roadLine.element.style.top = roadLine.location.y + '%';
    roadLine.element.style.left = roadLine.location.x + '%';
    roadElement.append(roadLineElement);
  }
  for (let i = 0; i < 5; i++) {
    const foodImage = document.createElement('img');
    foodImage.classList.add('food');
    foodImage.src = Math.random() > 0.5 ? 'waffle.png' : 'cheesecake.png';
    foodImage.style.position = 'absolute';
    const food = {
      element: foodImage,
      velocity: 1.5,
      location: {
        y: 5,
        x: 100 + (i * 100) + getRandomNumber(0, 50),
      },
    };
    food.element.style.top = food.location.y + '%';
    food.element.style.left = food.location.x + '%';
    roadElement.append(foodImage);
    world.objects.foods.push(food);
  }

  draw();
}

function draw() {
  world.objects.clouds.forEach((cloud) => {
    cloud.element.style.opacity = cloud.location.y + '%';
    cloud.element.style.left = cloud.location.x + '%';
    cloud.element.style.transform = `scale(${cloud.scale})`;
  });
  world.objects.roadLines.forEach((roadLine) => {
    roadLine.element.style.left = roadLine.location.x + '%';
  });
  world.objects.foods.forEach((food) => {
    food.element.style.left = food.location.x + '%';
  });
  if (world.objects.dino.isJumping && !world.objects.dino.element.src.endsWith('dino/jump.gif')) {
    world.objects.dino.element.src = 'dino/jump.gif';
  } else if (!world.objects.dino.isJumping && !world.objects.dino.element.src.endsWith('dino/walk.gif')) {
    world.objects.dino.element.src = 'dino/walk.gif';
  }
  world.objects.dino.element.style.top = world.objects.dino.location.y + '%';

  if (!world.gameOver) {
    setTimeout(update, world.updateMs);
  } else {
    world.objects.dino.element.src = 'dino/jump.gif';
    world.objects.dino.element.style.transform = 'rotate(-90deg)';
  }

  scoreElement.textContent = world.score;
}

function update() {
  const dinoRect = world.objects.dino.element.getBoundingClientRect();
  const cloudsRect = cloudsElement.getBoundingClientRect();
  const roadRect = roadElement.getBoundingClientRect();
  world.objects.clouds.forEach((cloud) => {
    const cloudRect = cloud.element.getBoundingClientRect();
    if ((cloudRect.left + cloudRect.width) - 20 <= cloudsRect.left) {
      cloud.location.x = getRandomNumber(100, 120);
      cloud.location.y = getRandomNumber(-20, 60);
      cloud.scale = getRandomNumber(0.7, 1.4);
    } else {
      cloud.location.x -= cloud.velocity;
    }
  });
  world.objects.roadLines.forEach((roadLine) => {
    const roadLineRect = roadLine.element.getBoundingClientRect();
    if ((roadLineRect.left + roadLineRect.width) - 10 <= roadRect.left) {
      roadLine.location.x = 100;
    } else {
      roadLine.location.x -= roadLine.velocity;
    }
  });
  world.objects.foods.forEach((food, i) => {
    const foodRect = food.element.getBoundingClientRect();
    if (foodRect.left <= dinoRect.right - 80
      && dinoRect.bottom - 80 > foodRect.top
      && foodRect.left >= dinoRect.left + 20) {
      world.gameOver = true;
    }
    if ((foodRect.left + foodRect.width) <= roadRect.left) {
      const farthestFoodX = Math.max(...world.objects.foods.map((food) => food.location.x));
      food.location.x = farthestFoodX + 100 + getRandomNumber(0, 50);
      world.score += 1;
    } else {
      food.location.x -= food.velocity;
    }
  });

  if (world.objects.dino.isJumping) {
    if (world.objects.dino.jumpTicks <= 12) {
      world.objects.dino.location.y -= 9;
    } else if (world.objects.dino.jumpTicks >= 16) {
      world.objects.dino.location.y += 9;
    }
    world.objects.dino.jumpTicks += 1;
    if (world.objects.dino.jumpTicks === 28) {
      world.objects.dino.isJumping = false;
      world.objects.dino.location.y = -40;
      world.objects.dino.jumpTicks = 0;
      world.updateMs *= 0.95;
    }
  }
  draw();
}

init();

document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowUp') {
    world.objects.dino.isJumping = true;
  }
});

document.addEventListener('click', () => {
  world.objects.dino.isJumping = true;
});
