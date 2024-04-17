let currentPage = 1;
const pageSize = 20; // Number of cities to fetch per page
let cityData = []; // To store all city data

function fetchCities() {
  const apiUrl = `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&rows=${pageSize}&start=${
    (currentPage - 1) * pageSize
  }`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      cityData = data.records;
      displayCities(cityData);
    })
    .catch((error) => console.error("Error fetching city data:", error));
}

function displayCities(cities) {
  const tableBody = document.querySelector("#cityTable tbody");
  tableBody.innerHTML = ""; // Clear previous data
  cities.forEach((city) => {
    const cityName = city.fields.name;
    const country = city.fields.cou_name_en;
    const timezone = city.fields.timezone;

    const row = document.createElement("tr");
    row.innerHTML = `
        <td><a href="#" onclick="redirectToWeatherPage('${cityName}')">${cityName}</a></td>
        <td>${country}</td>
        <td>${timezone}</td>
        
    `;
    tableBody.appendChild(row);
  });
}

function loadMoreCities() {
  currentPage++;
  fetchCities();
}

function sortTable(columnIndex, sortOrder) {
  const sortBy =
    columnIndex === 0 ? "name" : columnIndex === 1 ? "cou_name_en" : "timezone";
  cityData.sort((a, b) => {
    const aValue = a.fields[sortBy].toUpperCase();
    const bValue = b.fields[sortBy].toUpperCase();
    if (sortOrder === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });
  displayCities(cityData);
}

// Filter city by name
function filterCity() {
  const searchText = document
    .getElementById("cityFilterInput")
    .value.trim()
    .toLowerCase();
  const filteredCities = cityData.filter((city) =>
    city.fields.name.toLowerCase().includes(searchText)
  );
  displayCities(filteredCities);
}

// Filter city by country
function filterCountry() {
  const searchText = document
    .getElementById("countryFilterInput")
    .value.trim()
    .toLowerCase();
  const filteredCities = cityData.filter((city) =>
    city.fields.cou_name_en.toLowerCase().includes(searchText)
  );
  displayCities(filteredCities);
}

// Filter city by timezone
function filterTimezone() {
  const searchText = document
    .getElementById("timezoneFilterInput")
    .value.trim()
    .toLowerCase();
  const filteredCities = cityData.filter((city) =>
    city.fields.timezone.toLowerCase().includes(searchText)
  );
  displayCities(filteredCities);
}

// Redirect to weather page for the selected city
function redirectToWeatherPage(cityName) {
  window.location.href = `weather.html?city=${encodeURIComponent(cityName)}`;

  //  window.location.href = `map.html?city=${encodeURIComponent(cityName)}`;
}

// Initial load
fetchCities();

// Infinite scroll
window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    loadMoreCities();
  }
});

// Autocomplete functionality
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function () {
  const searchTerm = this.value.toUpperCase();
  const filteredCities = cityData.filter((city) =>
    city.fields.name.toUpperCase().includes(searchTerm)
  );
  updateCityOptions(filteredCities);
});

// This gives the city details searched in top of the table.

document
  .getElementById("searchInput")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      const searchText = event.target.value.trim().toLowerCase();
      const tableBody = document.querySelector("#cityTable tbody");
      const rows = tableBody.querySelectorAll("tr");

      // Hide all rows initially
      rows.forEach((row) => {
        row.style.display = "none";
      });

      // Find the matching city and display its details
      const matchingCity = cityData.find(
        (city) => city.fields.name.trim().toLowerCase() === searchText
      );
      if (matchingCity) {
        tableBody.innerHTML = ""; // Clear existing rows
        const row = document.createElement("tr");
        row.innerHTML = `
        <td><a href="#" onclick="redirectToWeatherPage('${matchingCity.fields.name}')">${matchingCity.fields.name}</a></td>
        <td>${matchingCity.fields.cou_name_en}</td>
        <td>${matchingCity.fields.timezone}</td>
      `;
        tableBody.appendChild(row);
      }
    }
  });

function updateCityOptions(filteredCities) {
  const datalist = document.createElement("datalist");
  datalist.id = "cityList";
  filteredCities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city.fields.name;
    datalist.appendChild(option);
  });
  const existingDatalist = document.getElementById("cityList");
  if (existingDatalist) {
    existingDatalist.parentNode.removeChild(existingDatalist);
  }
  document.body.appendChild(datalist);
  searchInput.setAttribute("list", "cityList");
}

function toggleDropdown(event, columnIndex) {
  const dropdown = event.currentTarget.querySelector(".dropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}
