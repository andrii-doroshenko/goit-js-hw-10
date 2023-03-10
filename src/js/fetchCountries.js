import { Notify } from 'notiflix';

export default class CountriesApiService {
  constructor() {
    this.searchQuery = '';
  }

  fetchArticles() {
    const url = `https://restcountries.com/v3.1/name/${this.searchQuery}?fields=name,capital,population,flags,languages`;

    return fetch(url).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    });
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
