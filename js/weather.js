// Open-Meteo forecast for Kutaisi (no API key required)
// https://open-meteo.com/

const KUTAISI_LAT = 42.2679;
const KUTAISI_LON = 42.697;
const WEATHER_URL =
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${KUTAISI_LAT}&longitude=${KUTAISI_LON}` +
  `&current_weather=true&wind_speed_unit=ms&timezone=Asia%2FTbilisi`;

const wmoLabel = (code) => {
  if (code === 0) return "მოწმენდილი ☀️";
  if (code <= 3) return "ნაწილობრივ ღრუბლიანი ⛅";
  if (code <= 48) return "ნისლი 🌫️";
  if (code <= 57) return "ნამქერი 🌨️";
  if (code <= 67) return "წვიმა 🌧️";
  if (code <= 77) return "თოვლი ❄️";
  if (code <= 82) return "ძლიერი წვიმა 🌧️";
  if (code <= 99) return "ქარიშხალი ⛈️";
  return "უცნობი ☁️";
};

function fetchWeatherCallback(callback) {
  fetch(WEATHER_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      return res.json();
    })
    .then((data) => callback(null, data.current_weather))
    .catch((err) => callback(err, null));
}

function fetchWeatherPromise() {
  return fetch(WEATHER_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      return res.json();
    })
    .then((data) => data.current_weather)
    .catch((err) => {
      console.error("Promise fetch failed:", err);
      return null;
    });
}

async function fetchWeatherAsync() {
  try {
    const res = await fetch(WEATHER_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const { temperature, windspeed, weathercode } = data.current_weather;
    return { temperature, windspeed, weathercode };
  } catch (err) {
    console.error("Async/Await fetch failed:", err);
    return null;
  }
}

function renderWeatherWidget(weather) {
  const widget = document.getElementById("weather-widget");
  if (!widget) return;

  if (!weather) {
    widget.innerHTML = `<p class="weather-error">ამინდის მონაცემები მიუწვდომელია.</p>`;
    return;
  }

  const { temperature, windspeed, weathercode } = weather;
  const label = wmoLabel(weathercode);

  widget.innerHTML = `
    <div class="weather-inner">
      <div class="weather-city">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        ქუთაისი, საქართველო
      </div>
      <div class="weather-temp">${temperature}°C</div>
      <div class="weather-desc">${label}</div>
      <div class="weather-meta">
        <span>💨 ${windspeed} მ/წმ</span>
        <span class="weather-badge">live</span>
      </div>
    </div>
  `;
}

async function loadKutaisiWeather() {
  const widget = document.getElementById("weather-widget");
  if (!widget) return;

  widget.innerHTML = `<p class="weather-loading">ამინდი იტვირთება…</p>`;

  const weatherAsync = await fetchWeatherAsync();
  if (weatherAsync) {
    renderWeatherWidget(weatherAsync);
    return;
  }

  const weatherPromise = await fetchWeatherPromise();
  if (weatherPromise) {
    renderWeatherWidget(weatherPromise);
    return;
  }

  fetchWeatherCallback((err, weatherCb) => {
    if (err || !weatherCb) {
      widget.innerHTML = `<p class="weather-error">ამინდი ვერ ჩაიტვირთა 😔</p>`;
      return;
    }
    renderWeatherWidget(weatherCb);
  });
}

document.addEventListener("DOMContentLoaded", loadKutaisiWeather);
