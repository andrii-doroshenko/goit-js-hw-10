import './css/styles.css';
import { debounce } from 'debounce';
import CountriesApiService from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const countriesApiService = new CountriesApiService();

const refs = {
  countriesInput: document.querySelector('input#search-box'),
  countriesList: document.querySelector('.country-list'),
  countriesInfo: document.querySelector('.country-info'),
};

refs.countriesInput.addEventListener(
  'input',
  debounce(onSearch, DEBOUNCE_DELAY)
);

function onSearch(e) {
  e.preventDefault();
  const str = e.target.value.trim();

  if (!str) {
    return;
  }

  countriesApiService.query = str;

  countriesApiService
    .fetchArticles()
    .then(data => {
      countriesApiService.resetMarkup(refs);

      if (data.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length === 1) {
        refs.countriesList.insertAdjacentHTML(
          'afterbegin',
          appendCountryMarkup(data)
        );
        refs.countriesInfo.insertAdjacentHTML(
          'afterbegin',
          appendInfoMarkup(data)
        );
      } else if (data.length >= 2 && data.length <= 10) {
        refs.countriesList.insertAdjacentHTML('afterbegin', appendMarkup(data));
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function appendMarkup(data) {
  return data
    .map(country => {
      return `<li class="country__item">
        <img src="${country.flags.svg}" alt="The national flag of ${country.name.common}" width="30" />
        <p class="country-header">${country.name.official}</p>
      </li>`;
    })
    .join('\n\r');
}

function appendCountryMarkup(data) {
  return data
    .map(country => {
      return `<li class="country__item">
        <img src="${country.flags.svg}" alt="The national flag of ${country.name.common}" width="50" />
        <p class="country-header country-header--fsize">${country.name.common}</p>
      </li>`;
    })
    .join('\n\r');
}

function appendInfoMarkup(data) {
  return data
    .map(country => {
      return `<p><b>Capital:</b> ${country.capital}</p>
    <p><b>Population:</b> ${country.population}</p>
    <p><b>Languages:</b> ${Object.values(country.languages).join(', ')}</p>`;
    })
    .join('\n\r');
}
