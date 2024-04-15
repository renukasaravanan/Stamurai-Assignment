const apiKey = "8f8b19ffebcef286681beb96f4111925"; // Replace with your OpenWeatherMap API key

// Get city name from URL parameter
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const cityName = urlParams.get("city");
let forecast = [];
let isForcasteClicked = false;
const weatherInfoParent = document.createElement("div");
let locationdata = {
  latitude: 1,
  longitude: 2,
};

// function redirectToMappage(cityName) {
//window.location.href = `map.html?city=${encodeURIComponent(cityName)}`;
//}

// Fetch weather data
fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
)
  .then((response) => response.json())
  .then((data) => {
    const weatherInfo = document.getElementById("weatherInfo");

    weatherInfo.innerHTML = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Weather: ${data.weather[0].description}</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
                <p>Atmospheric Pressure: ${data.main.pressure} hPa</p>
             
            `;
    weatherInfo.appendChild(weatherInfoParent);
    locationdata.latitude = data.coord.lat;
    locationdata.longitude = data.coord.lon;
    // Fetch forecast data
    return fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
    );
  })
  .then((response) => response.json())
  .then((data) => {
    forecast = data.list;
  })
  .catch((error) => console.error("Error fetching weather data:", error));

function displayWeatherForecast() {
  const table = document.createElement("table");
  // Create a table for forecast data
  if (!isForcasteClicked) {
    table.innerHTML = `
            <thead>WEATHER FORCASTING</THEAD>   
            <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Temperature (°C)</th>
                        <th>Weather</th>
                        <th>Humidity (%)</th>
                    </tr>
                </thead>
                <tbody>
                    ${forecast
                      .map((entry) => {
                        const dateTime = entry.dt_txt.split(" ");
                        const date = dateTime[0];
                        const time = dateTime[1];
                        return `
                            <tr>
                                <td>${date}</td>
                                <td>${time}</td>
                                <td>${entry.main.temp}</td>
                                <td>${entry.weather[0].description}</td>
                                <td>${entry.main.humidity}</td>
                            </tr>
                        `;
                      })
                      .join("")}
                </tbody>
            `;
    weatherInfoParent.appendChild(table);
    isForcasteClicked = true;
  } else {
    weatherInfoParent.remove(table);
    isForcasteClicked = false;
  }
}

function displayMapElement() {
  displayMap(locationdata.latitude, locationdata.longitude);
}
function displayMap(latitude, longitude) {
  const map = L.map("map").setView([latitude, longitude], 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([latitude, longitude]).addTo(map).bindPopup("Location").openPopup();
}
