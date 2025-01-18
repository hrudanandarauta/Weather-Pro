const API_KEY = "3c7242d62158cedd152c4c6a94efffee";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

const themeToggle = document.getElementById("themeToggle");
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const dateInput = document.getElementById("dateInput");
const weatherResult = document.getElementById("weatherResult");

const cityNameEl = document.getElementById("cityName");
const tempEl = document.getElementById("temp");
const conditionEl = document.getElementById("condition");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("windSpeed");

// Toggle Theme
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("bg-gray-900");
  document.body.classList.toggle("text-white");
  document.body.classList.toggle("bg-gradient-to-b");
});

// Fetch weather data
async function fetchWeather(city, date) {
  const endpoint = date
    ? `${BASE_URL}forecast?q=${city}&appid=${API_KEY}&units=metric`
    : `${BASE_URL}weather?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("City not found. Please try again.");
    const data = await response.json();

    if (date) {
      displayForecast(data, date);
    } else {
      displayWeather(data);
    }
  } catch (error) {
    alert(error.message);
  }
}

// Display current weather
function displayWeather(data) {
  weatherResult.classList.remove("hidden");

  cityNameEl.textContent = `City: ${data.name}`;
  tempEl.textContent = `Temperature: ${data.main.temp}°C`;
  conditionEl.textContent = `Condition: ${capitalizeFirstLetter(
    data.weather[0].description
  )}`;
  humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeedEl.textContent = `Wind Speed: ${data.wind.speed} m/s`;

  setDynamicBackground(data.main.temp);
}

// Display forecast weather
function displayForecast(data, date) {
  const selectedDate = new Date(date).toISOString().split("T")[0];
  const forecast = data.list.find((entry) =>
    entry.dt_txt.startsWith(selectedDate)
  );

  if (!forecast) {
    alert("No forecast available for the selected date.");
    return;
  }

  weatherResult.classList.remove("hidden");

  cityNameEl.textContent = `City: ${data.city.name}`;
  tempEl.textContent = `Temperature: ${forecast.main.temp}°C`;
  conditionEl.textContent = `Condition: ${capitalizeFirstLetter(
    forecast.weather[0].description
  )}`;
  humidityEl.textContent = `Humidity: ${forecast.main.humidity}%`;
  windSpeedEl.textContent = `Wind Speed: ${forecast.wind.speed} m/s`;

  setDynamicBackground(forecast.main.temp);
}

// Set background dynamically based on temperature
function setDynamicBackground(temp) {
  document.body.className = ""; // Reset background classes
  if (temp < 15) {
    document.body.classList.add("bg-gradient-to-b", "from-blue-700", "to-blue-300");
  } else if (temp < 30) {
    document.body.classList.add("bg-gradient-to-b", "from-yellow-500", "to-orange-300");
  } else {
    document.body.classList.add("bg-gradient-to-b", "from-red-500", "to-orange-600");
  }
}

// Helper: Capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Event listeners
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  const date = dateInput.value;

  if (city) {
    fetchWeather(city, date);
  } else {
    alert("Please enter a city name.");
  }
});
