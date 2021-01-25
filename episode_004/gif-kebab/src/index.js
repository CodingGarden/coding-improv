console.log(true === true);

const kebabElement = document.querySelector('#kebab');
const loadingElement = document.querySelector('#loading');

const corsImageProxy = 'https://cors-anywhere.herokuapp.com/';
const apiKey = 'Tne7LiT79HXXntOhyyXPzSDDuBAYMbJP';
const baseUrl = 'https://api.giphy.com/v1';

const tags = [
  'cola',
  'kebab',
  'arrow',
  'soccer',
  'wasps',
  'dog',
];

function getRandomTag() {
  const randomIndex = Math.floor(Math.random() * tags.length);
  return tags[randomIndex];
}

function getLabels(classification) {
  return classification.reduce((tags, result) => {
    return tags.concat(result.label.split(', '));
  }, []);
}

function modelLoaded() {
  console.log('Model Loaded!');
  getRandomGif();
}

const classifier = ml5.imageClassifier('MobileNet', modelLoaded);

async function getRandomGif(randomTag = getRandomTag()) {
  const randomResponse = await fetch(`${baseUrl}/gifs/random?api_key=${apiKey}&rating=G&tag=${randomTag}`);
  const randomJson = await randomResponse.json();
  console.log(randomJson);
  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('image-wrapper');
  const imageElement = document.createElement('img');
  imageElement.setAttribute('crossOrigin', 'anonymous');
  imageElement.src = `${corsImageProxy}${randomJson.data.image_url  }`;
  // imageElement.src = `${corsImageProxy}${randomJson.data.images['480w_still'].url}`;
  const tagElement = document.createElement('h1');
  tagElement.textContent = randomTag;
  const hr = document.createElement('hr');
  kebabElement.appendChild(hr);
  imageWrapper.appendChild(tagElement);
  imageWrapper.appendChild(imageElement);
  kebabElement.appendChild(imageWrapper);
  imageElement.addEventListener('load', () => {
    classifier.classify(imageElement, (err, results) => {
      const labels = getLabels(results);
      console.log(labels);
      const labelButtons = document.createElement('div');
      labels.forEach((label) => {
        const button = document.createElement('button');
        button.setAttribute('class', 'waves-effect waves-light btn');
        button.textContent = label;
        button.addEventListener('click', () => {
          loadingElement.style.display = '';
          const arrowElement = document.createElement('p');
          arrowElement.classList.add('arrow');
          arrowElement.textContent = '🔻';
          imageWrapper.appendChild(arrowElement);
          labelButtons.style.display = 'none';
          getRandomGif(label);
        });
        labelButtons.appendChild(button);
      });
      imageWrapper.appendChild(labelButtons);
      loadingElement.style.display = 'none';
      labelButtons.scrollIntoView();
    });
  });
}
