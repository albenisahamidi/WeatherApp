const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const errorMessage = document.getElementById("error-message");
const weatherResult = document.getElementById("weather-result");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const cityName = cityInput.value.trim();
  if (!cityName) {
    errorMessage.textContent = "Please write the city name.";
    weatherResult.innerHTML = "";
    return;
  }

  errorMessage.textContent = "";
  weatherResult.innerHTML = "Loading...";

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      cityName
    )}&count=1`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      errorMessage.textContent = "City not found. Please try again";
      weatherResult.innerHTML = "";
      return;
    }

    const cityInfo = geoData.results[0];
    const { latitude, longitude, name, country } = cityInfo;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const current = weatherData.current_weather;

    weatherResult.innerHTML = `
    <div class="weather-card">
    <h2>${name}, ${country || ""}</h2>
    <ul class="weather-list">
        <li><strong>Temperature:</strong> ${current.temperature} °C</li> 
        <li><strong>Wind speed:</strong> ${current.windspeed} km/h</li>
      <li><strong>Time:</strong> ${current.time}</li>
    </ul>
    </div> 
    `;
  } catch (error) {
    errorMessage.textContent = "An error occurred while fetching weather data";
    weatherResult.innerHTML = "";
  }
});
