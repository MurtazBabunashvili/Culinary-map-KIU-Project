const KUTAISI_LAT = 42.2679;
const KUTAISI_LON = 42.697;
const WEATHER_URL =
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${KUTAISI_LAT}&longitude=${KUTAISI_LON}` +
  `&current_weather=true&wind_speed_unit=ms&timezone=Asia%2FTbilisi`;

const wmoLabel = (code) => {
  if (code === 0) return "მოწმენდილი";
  if (code <= 3) return "ნაწილობრივ ღრუბლიანი";
  if (code <= 48) return "ნისლი";
  if (code <= 57) return "ნამქერი";
  if (code <= 67) return "წვიმა";
  if (code <= 77) return "თოვლი";
  if (code <= 82) return "ძლიერი წვიმა";
  if (code <= 99) return "ქარიშხალი";
  return "უცნობი";
};

const locationIcon = `
  <svg class="weather-icon" width="15" height="15" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
`;

const windIcon = `
  <svg class="weather-icon" width="15" height="15" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M3 8h10a3 3 0 1 0-3-3"/>
    <path d="M3 12h15a3 3 0 1 1-3 3"/>
    <path d="M3 16h7"/>
  </svg>
`;

const weatherOpenIcon = `
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
`;

function ensureWeatherControls() {
  const widget = document.getElementById("weather-widget");
  if (!widget) return null;

  let openBtn = document.getElementById("weather-open-btn");
  if (!openBtn) {
    openBtn = document.createElement("button");
    openBtn.id = "weather-open-btn";
    openBtn.className = "weather-open-btn";
    openBtn.type = "button";
    openBtn.hidden = true;
    openBtn.setAttribute("aria-label", "ამინდის ბარათის გახსნა");
    openBtn.innerHTML = weatherOpenIcon;
    document.body.appendChild(openBtn);
  }

  openBtn.onclick = () => {
    widget.hidden = false;
    openBtn.hidden = true;
  };

  return { widget, openBtn };
}

function addWeatherCloseButton() {
  const controls = ensureWeatherControls();
  if (!controls) return;

  const { widget, openBtn } = controls;
  if (widget.querySelector(".weather-close")) return;

  const closeBtn = document.createElement("button");
  closeBtn.className = "weather-close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "ამინდის ბარათის დახურვა");
  closeBtn.textContent = "×";
  closeBtn.addEventListener("click", () => {
    widget.hidden = true;
    openBtn.hidden = false;
  });

  widget.prepend(closeBtn);
}

function setWeatherMessage(className, message) {
  const widget = document.getElementById("weather-widget");
  if (!widget) return;

  widget.innerHTML = `<p class="${className}">${message}</p>`;
  addWeatherCloseButton();
}

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
    setWeatherMessage("weather-error", "ამინდის მონაცემები მიუწვდომელია.");
    return;
  }

  const { temperature, windspeed, weathercode } = weather;
  const label = wmoLabel(weathercode);
  const roundedTemp = Math.round(temperature);
  const wind = Number(windspeed).toFixed(1);

  widget.innerHTML = `
    <div class="weather-inner">
      <div class="weather-city">
        ${locationIcon}
        ქუთაისი, საქართველო
      </div>
      <div class="weather-temp">${roundedTemp}°C</div>
      <div class="weather-desc">${label}</div>
      <div class="weather-meta">
        <span class="weather-wind">${windIcon} ${wind} მ/წმ</span>
        <span class="weather-badge">live</span>
      </div>
      <p class="weather-subtitle">დღის ამინდი — სეირნობისთვისა და რესტორნის არჩევისთვის</p>
    </div>
  `;
  addWeatherCloseButton();
}

async function loadKutaisiWeather() {
  const widget = document.getElementById("weather-widget");
  if (!widget) return;

  ensureWeatherControls();
  setWeatherMessage("weather-loading", "ამინდი იტვირთება…");

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
      setWeatherMessage("weather-error", "ამინდის მონაცემები მიუწვდომელია.");
      return;
    }
    renderWeatherWidget(weatherCb);
  });
}

document.addEventListener("DOMContentLoaded", loadKutaisiWeather);
