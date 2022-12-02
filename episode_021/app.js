const doorsElement = document.querySelector('.doors');
const bitcoinPriceElement = document.querySelector('.bitcoin-price');

let prevPrice = 0;

async function getBitcoinPrice() {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd', {
    cache: 'no-cache',
  });
  const json = await response.json();
  bitcoinPriceElement.textContent = new Intl.NumberFormat(`en-US`, {
      currency: `USD`,
      style: 'currency',
  }).format(json.bitcoin.usd);
  if (prevPrice <= json.bitcoin.usd) {
    document.body.style.backgroundColor = '#00873E';
  } else {
    document.body.style.backgroundColor = '#D6001C';
  }
  prevPrice = json.bitcoin.usd;
  setTimeout(getBitcoinPrice, 5 * 1000);
}

async function getBirds() {
  let birds = [];
  let after = '';
  for (let i = 0; i < 3; i++) {
    const response = await fetch('https://www.reddit.com/r/birdswitharms/top.json?sort=top&t=all&after=' + after);
    const json = await response.json();
    after = json.data.after
    const birdPosts = json.data.children.filter((post) => {
      return post.data.post_hint === 'image' && post.data.over_18 === false;
    }).map((post) => post.data);
    birds = birds.concat(birdPosts);
  }
  const randomBirds = [];
  for (let i = 0; i < 25; i++) {
    const randomIndex = Math.floor(Math.random() * birds.length);
    const [randomBird] = birds.splice(randomIndex, 1);
    randomBirds.push(randomBird);
  }
  localStorage.setItem('birbs', JSON.stringify(randomBirds));
  return randomBirds;
}

async function init() {
  let randomBirds = [];
  if (!localStorage.getItem('birbs')) {
    randomBirds = await getBirds();
  } else {
    randomBirds = JSON.parse(localStorage.getItem('birbs'));
  }

  const todayMonth = new Date().getMonth();
  const todayDate = new Date().getDate();

  for (let i = 0; i < 25; i++) {
    const doorElement = document.createElement('div');
    const doorImage = document.createElement('img');
    const doorNumber = document.createElement('span');
    const doorClick = () => {
      if (todayMonth !== 11) return;
      if (todayDate >= i + 1) {
        doorNumber.remove();
        doorImage.src = randomBirds[i].url;
        doorImage.classList.add('bird-image');
        localStorage.setItem(i, true);
        doorElement.removeEventListener('click', doorClick);
      }
    };
    doorElement.classList.add('door');
    if (localStorage.getItem(i)) {
      doorImage.src = randomBirds[i].url;
      doorImage.classList.add('bird-image');
      doorElement.append(doorImage);
      doorsElement.append(doorElement);
    } else {
      doorImage.src = 'door.png';
      doorNumber.textContent = i + 1;
      doorElement.addEventListener('click', doorClick);
      doorNumber.classList.add('door-number');
      doorElement.append(doorImage);
      doorElement.append(doorNumber);
      doorsElement.append(doorElement);
    }
  }

  getBitcoinPrice();
}

init();