const currentTempEl = document.querySelector("#current-temp");
const weatherDescEl = document.querySelector("#weather-desc");
const weatherIconEl = document.querySelector("#weather-icon");
const forecastEl = document.querySelector("#forecast");

// Accra coordinates
const lat = 5.6037;
const lon = -0.1870;

// Choose units: metric (°C) or imperial (°F)
const units = "metric";

// INSERT YOUR KEY:
const appid = "67d78ccf22cc594178d6a8ad316b914e";

const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${appid}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${appid}`;

function formatTemp(t) {
  const unitSymbol = units === "metric" ? "°C" : "°F";
  return `${Math.round(t)}${unitSymbol}`;
}

function labelDay(dateObj, index) {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return dateObj.toLocaleDateString("en-US", { weekday: "long" });
}

function displayCurrent(data) {
  const desc = data.weather[0].description;
  const icon = data.weather[0].icon;

  currentTempEl.innerHTML = formatTemp(data.main.temp);
  weatherDescEl.textContent = desc;

  const iconSrc = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  weatherIconEl.src = iconSrc;
  weatherIconEl.alt = desc;
}

function displayForecast(data) {
  forecastEl.innerHTML = "";

  // Pick entries around 12:00:00 each day for next 3 days
  const noonEntries = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  // Get first 3 days from those noon entries
  const threeDays = noonEntries.slice(0, 3);

  threeDays.forEach((item, i) => {
    const d = new Date(item.dt * 1000);
    const dayLabel = labelDay(d, i);

    const li = document.createElement("li");
    li.innerHTML = `<strong>${dayLabel}:</strong> ${formatTemp(item.main.temp)}`;
    forecastEl.appendChild(li);
  });
}

async function apiFetch() {
  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);

    if (!currentRes.ok) throw Error(await currentRes.text());
    if (!forecastRes.ok) throw Error(await forecastRes.text());

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    displayCurrent(currentData);
    displayForecast(forecastData);
  } catch (err) {
    console.error(err);
    forecastEl.innerHTML = "<li>Weather data unavailable.</li>";
  }
}

apiFetch();