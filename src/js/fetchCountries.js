export default fetchCountries;
import '@pnotify/core/dist/BrightTheme';
import refs from './refs';
import countryTpl from '../templates/country-card';

const { inputEl, countryListEl } = refs;
const { error } = require('@pnotify/core');
const _debounce = require('lodash.debounce');

inputEl.addEventListener('input', _debounce(onSearch, 500));
inputEl.addEventListener('mouseup', () => (inputEl.value = ''));

function fetchCountries(searchQuery) {
  return fetch(`https://restcountries.eu/rest/v2/name/${searchQuery}`)
    .then(response => response.json())
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
    .catch(myError);
}

function onSearch(e) {
  countryListEl.innerHTML = '';
  const searchQuery = e.target.value;

  fetchCountries(searchQuery);
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
