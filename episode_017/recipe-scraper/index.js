const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');

const ALL_RECIPES = 'https://www.popcorn.org/Recipes/All-Recipes';

async function getRecipes() {
  const { data } = await axios.get(ALL_RECIPES);
  const $ = cheerio.load(data);
  const recipes = [];
  $('.article_card').each((index, element) => {
    const $element = $(element);
    const titleLink = $($element.find('a.article_title_link'));
    const image_url = $element.find('img').first().attr('src');
    recipes.push({
      title: titleLink.text().trim(),
      url: titleLink.attr('href'),
      image_url: `https://www.popcorn.org${image_url}`,
    });
  });
  fs.writeFileSync('recipes.json', JSON.stringify(recipes, null, 2), 'utf-8');
  await recipes.reduce(async (promise, recipe) => {
    try {
      await promise;
      console.log('Getting recipe:', recipe.title);
      const { data: page_data } = await axios.get(recipe.url);
      const $page = cheerio.load(page_data);
      let description = '';
      let yields = '';
      const paragraphs = $page('p');
      for (let i = 0; i < paragraphs.length; i += 1) {
        const element = $(paragraphs[i]);
        const text = element.text().trim();
        if (text && !description) {
          description = text;
        } else if (text && !yields) {
          yields = text.replace('Yield:', '').trim();
          break;
        }
      }
      const $recipeDetails = $page('.recipe_details');
      const ingredients = [];
      const directions = [];
      $recipeDetails.find('ul li').each((index, element) => {
        ingredients.push($(element).text().trim());
      });
      $recipeDetails.find('ol li').each((index, element) => {
        directions.push($(element).text().trim());
      });
      const nutritionFactsText = $($recipeDetails.find('.six.columns p')).text().trim();
      const nutritionFacts = nutritionFactsText.split('\n');
      recipe.ingredients = ingredients;
      recipe.directions = directions;
      recipe.nutrition = nutritionFacts;
      recipe.description = description;
      recipe.yields = yields;
      fs.writeFileSync('recipes.json', JSON.stringify(recipes, null, 2), 'utf-8');
    } catch (error) {
      console.log('Error getting recipe:', recipe.title, error.message);
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }, Promise.resolve());
  fs.writeFileSync('recipes.json', JSON.stringify(recipes, null, 2), 'utf-8');
}

getRecipes();