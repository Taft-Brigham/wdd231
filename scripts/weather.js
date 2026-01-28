// select HTML elements in the document
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

const url = 'https://api.openweathermap.org/data/2.5/weather?lat=49.7499&lon=6.6371&units=metric&appid=67d78ccf22cc594178d6a8ad316b914e';


async function apiFetch() {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(data); 
      displayResults(data);
    } else {
      throw Error(await response.text());
    }
  } catch (error) {
    console.log(error);
  }
}

apiFetch();


function displayResults(data) {
  // temperature (metric = °C)
  currentTemp.innerHTML = `${Math.round(data.main.temp)}&deg;C`;

  // icon + description
  const iconCode = data.weather[0].icon;
  const desc = data.weather[0].description;

  // Use the icon library (this supports sizing like @2x)
  const iconsrc = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  weatherIcon.setAttribute('src', iconsrc);
  weatherIcon.setAttribute('alt', desc);
  captionDesc.textContent = desc;
}