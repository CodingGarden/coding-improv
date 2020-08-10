const API_URL = 'https://restcountries.eu/rest/v2/all?fields=name;alpha2Code;alpha3Code;altSpellings';

export default async function getCountries() {
  const response = await fetch(API_URL);
  const json = await response.json();
  return json.reduce((data, country) => {
    const items = [country.name]
      .concat(country.alpha2Code)
      .concat(country.alpha3Code)
      .concat(country.altSpellings);
    data.names.set(country.alpha2Code.toLowerCase(), country.name);
    items.forEach((item) => {
      data.map.set(item.toLowerCase(), country.alpha2Code.toLowerCase());
    });
    return data;
  }, {
    names: new Map(),
    map: new Map(),
  });
}
