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

  if (str === '') {
    return;
  }

  countriesApiService.query = str;

  countriesApiService
    .fetchArticles()
    .then(data => {
      refs.countriesList.innerHTML = '';
      refs.countriesInfo.innerHTML = '';

      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length <= 10) {
        data.map(country => {
          appendMarkup(country);
        });
      } else if (data.length === 1) {
        data.map(country => {
          appendCountryMarkup(country);
        });
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function appendMarkup(data) {
  refs.countriesList.insertAdjacentHTML(
    'afterbegin',
    `<li class="country__item">
        <img src="${data.flags.svg}" alt="" width="30" />
        <p class="country-header">${data.name.official}</p>
      </li>`
  );
}

function appendCountryMarkup(data) {
  console.log(data);
  refs.countriesList.insertAdjacentHTML(
    'afterbegin',
    `<li class="country__item">
        <img src="${data.flags.svg}" alt="" width="50" />
        <p class="country-header country-header--fsize">${data.name.common}</p>
      </li>`
  );

  refs.countriesInfo.insertAdjacentHTML(
    'afterbegin',
    `<p><b>Capital:</b> ${data.capital}</p>
    <p><b>Population:</b> ${data.population}</p>
    <p><b>Languages:</b> ${Object.values(data.languages).join(', ')}</p>`
  );
}
