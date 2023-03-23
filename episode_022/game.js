import kaboom from "https://unpkg.com/kaboom@2000.2.9/dist/kaboom.mjs";

const gameItemsElement = document.querySelector('#game-items');
const gameItems = ['cactus', 'chips', 'dinosaur', 'soccer'];

kaboom({
  width: 320,
  height: 240,
  background: [0, 0, 0],
  scale: 2,
});

loadSprite("floor", "/sprites/tile000.png");
loadSprite("grass", "/sprites/tile062.png");
loadSprite("item", "/sprites/house/tiles/tile147.png");
loadSprite("item_searched", "/sprites/house/tiles/tile132.png");
loadSprite("door", "/sprites/house/tiles/tile029.png");
const houseSprites = [
  "/sprites/tile194.png",
  "/sprites/tile206.png",
  "/sprites/tile218.png",
];
houseSprites.forEach((sprite, index) => {
  loadSprite(`house_${index}`, sprite);
});
const houseEdgeSprites = [
  { name: "house_floor", image: "/sprites/house/tiles/tile048.png" },
  { name: "house_left_edge", image: "/sprites/house/tiles/tile020.png" },
  { name: "house_right_edge", image: "/sprites/house/tiles/tile018.png" },
  { name: "house_top_edge", image: "/sprites/house/tiles/tile035.png" },
  { name: "house_bottom_edge", image: "/sprites/house/tiles/tile003.png" },
  { name: "house_top_left_corner_edge", image: "/sprites/house/tiles/tile033.png" },
  { name: "house_top_right_corner_edge", image: "/sprites/house/tiles/tile032.png" },
  { name: "house_bottom_left_corner_edge", image: "/sprites/house/tiles/tile017.png" },
  { name: "house_bottom_right_corner_edge", image: "/sprites/house/tiles/tile016.png" },
];
const edgeSprites = [
  { name: "left_edge", image: "/sprites/tile062.png" },
  { name: "right_edge", image: "/sprites/tile060.png" },
  { name: "top_edge", image: "/sprites/tile073.png" },
  { name: "bottom_edge", image: "/sprites/tile049.png" },
  { name: "top_left_corner_edge", image: "/sprites/tile084.png" },
  { name: "top_right_corner_edge", image: "/sprites/tile085.png" },
  { name: "bottom_left_corner_edge", image: "/sprites/tile096.png" },
  { name: "bottom_right_corner_edge", image: "/sprites/tile097.png" },
];
[...edgeSprites, ...houseEdgeSprites].forEach((sprite) => {
  loadSprite(sprite.name, sprite.image);
});
loadSpriteAtlas("/sprites/pikachu.png", {
  pikachu: {
    x: 0,
    y: 0,
    width: 112,
    height: 16,
    sliceX: 7,
    anims: {
      idle: {
        from: 0,
        to: 2,
        speed: 10,
        loop: true,
      },
    },
  },
});
loadSprite("key", "/sprites/tile000.png");

const baseLevel = [
  "┌----------------┐",
  "{                }",
  "{                }",
  "{                }",
  "{                }",
  "{                }",
  "{                }",
  "{                }",
  "{                }",
  "{                }",
  "{                }",
  "{                }",
  "L================┙",
];

const houseLevel = baseLevel.slice();
houseLevel[baseLevel.length - 1] = "L========|=======┙";

const possibleItems = [
  'cactus', 'chips', 'dinosaur', 'soccer',
];

const houses = [];
const allChests = [];
let startX = 64 + 16;
let startY = 32;
for (let row = 0; row < 4; row++) {
  startX = 64 + 16;
  for (let house = 0; house < 7; house++) {
    const randomHouseIndex = Math.floor(Math.random() * 3);
    const houseName = `house_${randomHouseIndex}`;
    const chests = [];
    const numChests = 3 + Math.floor(Math.random() * 3);
    const possibleX = Array.from({ length: 6 }, (_, i) => i * 2);
    const possibleY = Array.from({ length: 5 }, (_, i) => i * 2);
    for (let i = 0; i < numChests; i++) {
      const randomXIndex = Math.floor(possibleX.length * Math.random());
      const [randomX] = possibleX.splice(randomXIndex, 1);
      const randomYIndex = Math.floor(possibleY.length * Math.random());
      const [randomY] = possibleY.splice(randomYIndex, 1);
      const x = 32 + Math.floor(randomX * 16);
      const y = 32 + Math.floor(randomY * 16);
      if (x >= width()) {
        x -= 96;
      }
      if (y >= height() - 16) {
        y -= 96;
      }
      const chestName = `chest_${i}`;
      const chest = {
        sprite: [pos(x, y), area(), solid(), chestName],
        searched: false,
        item: null,
        x,
        y,
        name: chestName,
      };
      chests.push(chest);
      allChests.push(chest);
    }
    houses.push({
      sprite: [sprite(houseName), pos(startX, startY), area(), solid(), `house_${houses.length}`],
      chests,
    });
    startX += 24;
  }
  startY += 48;
}

// allChests
// pick 4 random...
for (let i = 0; i < 4; i++) {
  const randomItemIndex = randi(0, possibleItems.length);
  const [randomItem] = possibleItems.splice(randomItemIndex, 1);
  const randomChestIndex = randi(0, allChests.length);
  const [randomChest] = allChests.splice(randomChestIndex, 1);
  randomChest.item = randomItem;
}

const SPEED = 320 / 2;

function playerMoveScene(player, dialog) {
  const dirs = {
    left: LEFT,
    right: RIGHT,
    up: UP,
    down: DOWN,
  };

  for (const dir in dirs) {
    onKeyDown(dir, () => {
      if (!dialog.active()) {
        player.move(dirs[dir].scale(SPEED));
      }
    });
  }
}

const state = {
  pikachu: {
    x: 32,
    y: 32,
  },
  inventory: [],
};

function updateGameItems() {
  let htmlItems = [];
  gameItems.forEach((item) => {
    if (state.inventory.includes(item)) {
      htmlItems.push(`<span style="color: grey;">${item}</span>`);
    } else {
      htmlItems.push(`<span>${item}</span>`);
    }
  });
  gameItemsElement.innerHTML = htmlItems.join(', ');
}

updateGameItems();

function addDialog() {
  const dWidth = width() * .6;
  const dHeight = height() * .6;
  const pad = 16;
  const x = (width() - dWidth) / 2;
  const y = (height() - dHeight) / 2;
  const bg = add([
    pos(x, y),
    rect(dWidth, dHeight),
    color(0, 0, 0),
    z(100),
  ]);
  const lines = [];
  for (let i = 0; i < 7; i++) {
    const txt = add([
      text("", {
        width: dWidth,
        size: 16,
      }),
      pos(x + pad, y + pad + (i * 16)),
      z(100),
    ]);
    txt.hidden = true;
    lines.push(txt);
  }
  bg.hidden = true;
  return {
    say(items) {
      for (let i = 0; i < 7; i++) {
        if (items[i]) {
          lines[i].text = items[i];
          lines[i].hidden = false;
        } else {
          lines[i].text = '';
          lines[i].hidden = true;
        }
      }
      bg.hidden = false;
    },
    dismiss() {
      if (!this.active()) {
        return;
      }
      lines.forEach((line) => {
        line.text = "";
        line.hidden = true;
      })
      bg.hidden = true;
    },
    active() {
      return !bg.hidden;
    },
    destroy() {
      bg.destroy();
      lines.forEach((line) => {
        line.destroy();
      });
    },
  };
}

function listenInventory(dialog) {
  onKeyPress('i', () => {
    if (dialog.active()) {
      if (state.inventory.length === gameItems.length) {
        go('win');
      }
      dialog.dismiss();
    } else {
      const message = [
        'Inventory:',
      ];
      if (!state.inventory.length) {
        message.push('No items!')
        message.push('')
        message.push('')
      } else {
        for (let i = 0; i < 4; i++) {
          if (state.inventory[i]) {
            message.push(`1 x ${state.inventory[i]}`);
          } else {
            message.push('');
          }
        }
      }
      dialog.say(message.concat([
        '',
        '(press i to exit)'
      ]));
    }
  });
}

scene("main", () => {
  addLevel(baseLevel, {
    width: 16,
    height: 16,
    pos: vec2(16, 16),
    " ": () => [sprite("floor")],
    "}": () => [sprite("right_edge"), area(), solid()],
    "{": () => [sprite("left_edge"), area(), solid()],
    L: () => [sprite("bottom_left_corner_edge"), area(), solid()],
    "┙": () => [sprite("bottom_right_corner_edge"), area(), solid()],
    "┌": () => [sprite("top_left_corner_edge"), area(), solid()],
    "┐": () => [sprite("top_right_corner_edge"), area(), solid()],
    "=": () => [sprite("bottom_edge"), area(), solid()],
    "-": () => [sprite("top_edge"), area(), solid()],
  });

  add([sprite("pikachu", { anim: "idle" }), pos(state.pikachu.x, state.pikachu.y), area(), solid(), "player"]);

  const player = get("player")[0];
  houses.forEach(({ sprite }, index) => {
    add(sprite);
    player.onCollide(`house_${index}`, (a, collision) => {
      if (collision && collision.isTop()) {
        state.pikachu.x = player.pos.x;
        state.pikachu.y = player.pos.y;
        go("house", index);
      }
    });
  });

  
  const dialog = addDialog();
  playerMoveScene(player, dialog);
  listenInventory(dialog);
});

scene("house", (index) => {
  addLevel(houseLevel, {
    width: 16,
    height: 16,
    pos: vec2(16, 16),
    " ": () => [sprite("house_floor")],
    "}": () => [sprite("house_right_edge"), area(), solid()],
    "{": () => [sprite("house_left_edge"), area(), solid()],
    L: () => [sprite("house_bottom_left_corner_edge"), area(), solid()],
    "┙": () => [sprite("house_bottom_right_corner_edge"), area(), solid()],
    "┌": () => [sprite("house_top_left_corner_edge"), area(), solid()],
    "┐": () => [sprite("house_top_right_corner_edge"), area(), solid()],
    "=": () => [sprite("house_bottom_edge"), area(), solid()],
    "-": () => [sprite("house_top_edge"), area(), solid()],
    "|": () => [sprite("door"), area(), solid(), "door"],
  });

  add([sprite("pikachu", { anim: "idle" }), pos(320 / 2, 240 - 48), area(), solid(), "player"]);

  const player = get("player")[0];
  player.onCollide("door", (data) => {
    go("main");
  });

  const house = houses[index];
  house.chests.forEach((chest) => {
    const sprite_name = chest.searched ? 'item_searched' : 'item';
    const chestInstance = add([sprite(sprite_name), ...chest.sprite]);
    player.onCollide(chest.name, (data) => {
      if (!chest.searched) {
        chest.searched = true;
        destroy(chestInstance);
        add([sprite('item_searched'), ...chest.sprite]);
        if (chest.item) {
          state.inventory.push(chest.item);
          updateGameItems();
          dialog.say([
            `Found ${chest.item}!`,
            '',
            '',
            '',
            '',
            '',
            '(press i to exit)',
          ]);
        }
      }
    });
  });

  const dialog = addDialog();
  playerMoveScene(player, dialog);
  listenInventory(dialog);
});

scene("win", () => {
  add([text("You Win!", {
    size: 32,
  }), pos(width() / 2, height() / 2), origin("center")]);
});

go("main", 0);


// add([sprite("item"), pos(64, 64), area(), solid(), "item"]);

  // const dialog = addDialog();