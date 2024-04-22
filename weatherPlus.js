// Declare a variable to store weather data
let weatherData;

// Setup function called by p5.js library
function setup() {
  // Create a canvas with specified dimensions and assign it an id
  createCanvas(1200, 400).id('weatherCanvas');

  // Create input field for city search
  let searchInput = createInput('Copenhagen');
  searchInput.position(20, 20); // Position the input field
  searchInput.attribute('placeholder', 'Enter city name'); // Set placeholder text
  searchInput.attribute('id', 'search-input'); // Assign an id for easier access

  // Create search button
  let searchButton = createButton('Search');
  searchButton.position(180, 20); // Position the search button
  searchButton.mousePressed(() => {
    // When button is clicked, fetch weather data for the entered city
    let cityName = searchInput.value();
    fetchWeatherData(cityName);
  });

  // Fetch weather data for default city (Copenhagen)
  fetchWeatherData('Copenhagen');
}

// Asynchronous function to fetch weather data from the server
async function fetchWeatherData(city) {
  try {
    // Send a GET request to the server to retrieve weather data for the specified city
    const response = await fetch(`http://localhost:5000/weather/${city}`);
    
    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    // Parse the JSON response into weatherData variable
    weatherData = await response.json();

    // Convert forecast dates to JavaScript Date objects
    weatherData.forecast.forEach(forecast => {
      forecast.date = new Date(forecast.date);
    });

    // Call the displayWeather function to visualize the weather data
    displayWeather();
  } catch (error) {
    // Log any errors to the console and show an alert message to the user
    console.error('Error fetching weather data:', error);
    alert('Failed to fetch weather data. Please try again later.');
  }
}

// Function to display weather information on the canvas
function displayWeather() {
  // Select the weatherCanvas element and add a border
  let canvas = select('#weatherCanvas');
  canvas.style('border', '1px solid #000');

  // Set the background color of the canvas
  background('skyblue');

  // Check if weatherData is available
  if (weatherData) {
    // Set text properties
    fill(255);
    textSize(18);
    textAlign(CENTER);

    // Display current weather information
    text(`${weatherData.city}`, width / 2, 50);
    text(`Current Temperature: ${weatherData.currentTemp} °C`, width / 2, 85);
    getWeatherIcon(weatherData.currentCondition, icon => {
      if (icon) {
        image(icon, width / 2 - 25, 85, 50, 50); // Display weather icon
      }
    });
    text(`${weatherData.currentCondition}`, width / 2, 150);

    // Calculate the maximum width needed for each column in the forecast grid
    let maxColumnWidth = 0;
    for (let i = 0; i < 5; i++) {
      let forecast = weatherData.forecast[i];
      let dateWidth = textWidth(forecast.date.toLocaleDateString());
      let tempWidth = textWidth(`Avg Temp: ${forecast.avgTemp} °C`);
      let columnWidth = max(dateWidth, tempWidth) + 12;
      maxColumnWidth = max(maxColumnWidth, columnWidth);
    }

    // Calculate grid dimensions and offset for centering
	let gridWidth = maxColumnWidth * 5;
	let xOffset = (width - gridWidth) / 1.5 - maxColumnWidth / 2; 
	let yOffset = 170;
	let dayHeight = 150;

    // Draw the forecast grid
    stroke(255);
    for (let i = 0; i < 5; i++) {
      let forecast = weatherData.forecast[i];
      let x = xOffset + i * maxColumnWidth;
      let y = yOffset;

      // Draw background rectangle for each day
      fill('skyblue');
      rect(x, y, maxColumnWidth, dayHeight);

      // Display date and average temperature for each day
      textAlign(CENTER);
      fill(255);
      text(forecast.date.toLocaleDateString(), x + maxColumnWidth / 2, y + 25);
      text(`Avg Temp: ${forecast.avgTemp} °C`, x + maxColumnWidth / 2, y + 55);

      // Display weather condition icon and text below
      getWeatherIcon(forecast.condition, icon => {
        if (icon) {
          image(icon, x + maxColumnWidth / 2 - 25, y + 60, 50, 50);
        }
      });
      text(`${forecast.condition}`, x + maxColumnWidth / 2, y + 130);
    }
  } else {
    // If weatherData is not available, display a loading message
    fill(255);
    text('Loading weather data...', width / 2, 100);
  }
}

// Function to fetch and display weather condition icons
function getWeatherIcon(condition, callback) {
  // Map weather conditions to corresponding icon URLs
  switch (condition.toLowerCase()) {
    case 'clear':
      return loadImage('https://openweathermap.org/img/wn/01d.png', img => callback(img));
    case 'clouds':
      return loadImage('https://openweathermap.org/img/wn/03d.png', img => callback(img));
    case 'rain':
      return loadImage('https://openweathermap.org/img/wn/10d.png', img => callback(img));
    case 'snow':
      return loadImage('https://openweathermap.org/img/wn/13d.png', img => callback(img));
    case 'thunderstorm':
      return loadImage('https://openweathermap.org/img/wn/11d.png', img => callback(img));
    case 'mist':
      return loadImage('https://openweathermap.org/img/wn/50d.png', img => callback(img));
  }
}
