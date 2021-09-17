import './sass/main.scss';
import '@pnotify/core/dist/BrightTheme';
import refs from './js/refs';
import fetchCountries from './js/fetchCountries';
import countryTpl from './templates/country-card';

const { inputEl, countryListEl } = refs;
const { error } = require('@pnotify/core');
const _debounce = require('lodash.debounce');

inputEl.addEventListener('input', _debounce(onSearch, 500));

function onSearch(e) {
  countryListEl.innerHTML = '';
  const searchQuery = e.target.value;

  fetchCountries(searchQuery)
    .then(data => {
      if (data.length === 1) {
        return data;
      }
      if (data.length !== 1 && data.length <= 10) {
        return countryListEl.insertAdjacentHTML('beforeend', countryListMarkup(data));
      }
      if (data.length > 10) {
        throw new Error();
      }
    })
    .then(createCountryMarkup)
    .catch(myError)
    .finally(() => (inputEl.value = ''));
}

function createCountryMarkup(country) {
  return countryListEl.insertAdjacentHTML('beforeend', countryTpl(country));
}

function myError() {
  error({
    text: 'Too many matches found. Please enter a more specific query!',
    width: '250px',
    delay: 3000,
    closer: false,
    sticker: false,
    maxTextHeight: null,
  });
}

function countryListMarkup(countries) {
  return countries.map(country => `<li>${country.name}</li>`).join('');
}
