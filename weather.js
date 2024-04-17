const apiKey = "8f8b19ffebcef286681beb96f4111925"; 

// Get city name from URL parameter
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const cityName = urlParams.get("city");
let forecast = [];
let isWeatherDisplayed = false;
let isMapDisplayed = false;
let locationdata = {
  latitude: 1,
  longitude: 2,
};
let map = null; // Store map reference globally

function updateBackgroundImage(temp) {
  const body = document.querySelector("body");
  if (temp > 30) {
    body.style.backgroundImage = "url('hot.jpg')";
  } else if (temp > 20 && temp <= 30) {
    body.style.backgroundImage = "url('sunny.jpg')";
  } else if (temp < 20 && temp >= 10) {
    body.style.backgroundImage = "url('rainy.jpg')";
  } else if (temp < 10) {
    body.style.backgroundImage = "url('cold.png')";
  } else {
    // Default background image or no change
    body.style.backgroundImage = ""; // Clears the background image
  }
}

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
    locationdata.latitude = data.coord.lat;
    locationdata.longitude = data.coord.lon;

    // Changes background image based on temperature
    updateBackgroundImage(data.main.temp);
    
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
  const weatherTable = document.getElementById("weatherTable");

  if (!isWeatherDisplayed) {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        forecast = data.list;

        const table = document.createElement("table");
        table.id = "weatherTable"; // Assigned an ID to the table
        table.innerHTML = `
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
        weatherInfo.appendChild(table); // Append the new table to the weather container
        isWeatherDisplayed = true;
      })
      .catch((error) =>
        console.error("Error fetching weather forecast data:", error)
      );
  } else {
    // Remove the weather forecast table only
    if (weatherTable) {
      weatherTable.remove();
    }
    isWeatherDisplayed = false;
  }
}

function displayMapElement() {
  const mapContainer = document.getElementById("map");

  if (!isMapDisplayed) {
    if (!map) {
      // Create map if not already created
      map = L.map("map").setView(
        [locationdata.latitude, locationdata.longitude],
        10
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([locationdata.latitude, locationdata.longitude])
        .addTo(map)
        .bindPopup("Location")
        .openPopup();
    }

    mapContainer.style.display = "block";
    isMapDisplayed = true;
  } else {
    mapContainer.style.display = "none";
    isMapDisplayed = false;
  }
}
