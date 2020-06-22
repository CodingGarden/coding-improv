import Vue from 'https://unpkg.com/vue@2.6.11/dist/vue.esm.browser.js';

import chickens from './chickens.js';

const darkModeButton = document.querySelector('#darkModeButton');

const app = new Vue({
  el: '#app',
  data: () => ({
    currentChickenIndex: 0,
  }),
  computed: {
    currentChicken() {
      return chickens[this.currentChickenIndex % chickens.length];
    },
  },
});

darkModeButton.addEventListener('click', () => {
  if (document.body.classList.contains('dark-mode')) {
    darkModeButton.textContent = '💡';
  } else {
    darkModeButton.textContent = '☀️';
  }

  document.body.classList.toggle('dark-mode');
});
