const $book = $('#book');
const pagePercent = 0.8;

async function load() {
  window.addEventListener('resize', () => {
    $book.turn('size', window.innerWidth * pagePercent, window.innerHeight * pagePercent);
  });
  const response = await fetch('/recipes.json');
  const json = await response.json();
  let html = '';
  json.forEach((recipe) => {
    html += `<div class="page">
      <div class="info">
        <h2>${recipe.title}</h2>
        <p>${recipe.description}</p>
        <small>Yields: ${recipe.yields}</small>
      </div>
      <div class="recipe-info">
        <div class="left">
          <h3>Ingredients</h3>
          <ul>
            ${recipe.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join('')}
          </ul>
          <h3>Directions</h3>
          <ul>
            ${recipe.directions.map((direction) => `<li>${direction}</li>`).join('')}
          </ul>
        </div>
        <div class="right">
          <img class="recipe-image" src="${recipe.image_url}" alt="${recipe.title}">
          <h3>Nutrition Facts</h3>
          <ul>
            ${recipe.nutrition.map((fact) => `<li>${fact}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>`;
  });
  $book.append(html);
  $book.turn({
    width: window.innerWidth * pagePercent,
    height: window.innerHeight * pagePercent,
    autoCenter: true,
    duration: 1200,
    display: 'single',
  });
}

load();
