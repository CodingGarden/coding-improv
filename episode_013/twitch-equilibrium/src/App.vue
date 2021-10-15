<template>
  <div class="app">
    <div class="title" v-if="gameState.started && gameState.over">
      <h3>GAME OVER: YOU <span v-if="gameState.win">WIN</span><span v-else>LOSE</span></h3>
    </div>
    <div class="title" v-if="gameState.started && !gameState.over && gameState.equilibrium">
      <h3>EQUILIBRIUM REACHED FOR: {{gameState.time_in_equilibrium}}</h3>
    </div>
    <div class="scale">
      <div class="scale-base">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/TriangleArrow-Up.svg/277px-TriangleArrow-Up.svg.png">
      </div>
      <div
        class="scale-beam"
        :style="{
          transform: `rotate(${rotationAngle}deg)`
        }"
      >
        <div class="left">
          <span class="emoji" v-for="item in items.left" :key="item.id">
            {{item.emoji}}
          </span>
        </div>
        <div class="right">
          <span class="emoji" v-for="item in items.right" :key="item.id">
            {{item.emoji}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue';

const gameState = reactive({
  started: false,
  over: false,
  win: false,
  equilibrium: false,
  time_in_equilibrium: 0,
});

const items = reactive({
  left: [{
    id: 1,
    emoji: '🎃',
    weight: 3,
  }],
  right: [{
    id: 2,
    emoji: '🎃',
    weight: 3,
  }],
});

const leftWeight = computed(() => items.left.reduce((total, { weight }) => total + weight, 0));
const rightWeight = computed(() => items.right.reduce((total, { weight }) => total + weight, 0));

const rotationAngle = computed(() => {
  const angle = rightWeight.value / Math.max(1, rightWeight.value + leftWeight.value) * 90 - 45;
  return Math.floor(angle);
});

watch(rotationAngle, () => {
  const angle = Math.abs(rotationAngle.value);
  console.log({ angle });
  if (angle === 0) {
    gameState.equilibrium = true;
  } else {
    gameState.equilibrium = false;
    gameState.time_in_equilibrium = 0;
  }

  if (angle >= 30) {
    gameState.over = true;
    const audio = new Audio('https://freesound.org/data/previews/175/175409_1326576-lq.mp3');
    audio.play();
    resetGame();
  }
});

setInterval(() => {
  if (!gameState.started || gameState.over) return;
  if (gameState.equilibrium) {
    gameState.time_in_equilibrium += 1;
  }
  if (gameState.time_in_equilibrium === 10) {
    gameState.over = true;
    gameState.win = true;
    const audio = new Audio('https://freesound.org/data/previews/49/49477_52325-lq.mp3');
    audio.play();
    resetGame();
  }
}, 1000);

function resetGame() {
  setTimeout(() => {
    gameState.started = false;
    gameState.over = false;
    gameState.win = false;
    gameState.equilibrium = false;
    gameState.time_in_equilibrium = 0;
    items.left = [{
      id: 1,
      emoji: '🎃',
      weight: 3,
    }];
    items.right = [{
      id: 2,
      emoji: '🎃',
      weight: 3,
    }];
  }, 8000);
}

const client = new tmi.Client({
	channels: [ 'codinggarden' ]
});

client.connect();

// !scale left pumpkin
// !scale right glass
// !scale left mustache
// !scale left beans
const sides = new Set(['left', 'right']);
const validItems = new Map([
  ['pumpkin', {
    emoji: '🎃',
    weight: 3,
  }],
  ['mustache', {
    emoji: '👩‍🚒',
    weight: 4,
  }],
  ['glass', {
    emoji: '🥛',
    weight: 1,
  }],
  ['beans', {
    emoji: '🥫',
    weight: 2,
  }],
  ['car', {
    emoji: '🚙',
    weight: 5,
  }],
]);
client.on('message', (channel, tags, message, self) => {
  if (gameState.over) return;
  const [command, ...args] = message.split(' ');
  if (command === '!scale') {
    const [side, itemName] = args;
    if (sides.has(side)) {
      const emojiInfo = validItems.get(itemName);
      if (emojiInfo) {
        gameState.started = true;
        items[side].push({
          id: tags.id,
          emoji: emojiInfo.emoji,
          weight: emojiInfo.weight,
        });
      }
    }
  }
});
</script>

<style lang="scss">
body {
  margin: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

body::before {
  content: "";
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  filter: sepia(100%);
  background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('https://i.pinimg.com/originals/bb/e7/1e/bbe71eb59fd0bb6c919d128230e8b522.jpg');
  background-size: cover;
  background-position: center;
}

#app {
  width: 100%;
  height: 100%;
}

.app {
  width: 100%;
  height: 100%;
  position: relative;
}

.title {
  color: white;
  position: absolute;
  top: 2rem;
  text-align: center;
  font-family: sans-serif;
  width: 100%;
}

.emoji {
  font-size: 1.2rem;
  margin: 0rem;
  padding: 0rem;
  line-height: 90%;
}

.scale {
  position: absolute;
  bottom: 0px;
  height: 30%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .scale-beam {
    width: 80%;
    height: 10%;
    background: #FFBA08;
    position: absolute;
    top: 0px;
    transform-origin: center;
    transition-duration: 1s;
    .left {
      position: absolute;
      left: 10px;
      display: flex;
      flex-wrap: wrap-reverse;
      justify-content: center;
      align-items: center;
      // direction: rtl;
      width: 40%;
      transform: translateY(-100%);
    }

    .right {
      position: absolute;
      right: 10px;
      display: flex;
      flex-wrap: wrap-reverse;
      justify-content: center;
      align-items: center;
      // direction: rtl;
      width: 40%;
      transform: translateY(-100%);
    }
  }

  .scale-base {
    height: 100%;
    img {
      height: 100%;
      width: auto;
      filter: brightness(0.3) invert(.3) sepia(.9) hue-rotate(180deg) saturate(300%);
      z-index: -1;
    }
  }
}
</style>
