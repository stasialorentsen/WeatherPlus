let weatherData;
let cities = {
  'Amsterdam': 'Amsterdam',
  'Athens': 'Athens',
  'Berlin': 'Berlin',
  'Brussels': 'Brussels',
  'Budapest': 'Budapest',
  'Copenhagen': 'Copenhagen',
  'Dublin': 'Dublin',
  'Helsinki': 'Helsinki',
  'Lisbon': 'Lisbon',
  'London': 'London',
  'Madrid': 'Madrid',
  'Oslo': 'Oslo',
  'Paris': 'Paris',
  'Prague': 'Prague',
  'Rome': 'Rome',
  'Stockholm': 'Stockholm',
  'Vienna': 'Vienna',
  'Warsaw': 'Warsaw'
};

function setup() {
  createCanvas(800, 400);
  
  // Create city dropdown menu
  let citySelect = createSelect();
  citySelect.position(20, 20);
  for (let cityName in cities) {
    citySelect.option(cityName);
  }
  citySelect.changed(() => {
    let selectedCity = citySelect.value();
    fetchWeatherData(selectedCity);
  });
  
  // Fetch weather data for the default city
  fetchWeatherData('Amsterdam');
}

async function fetchWeatherData(city) {
  try {
    const response = await fetch(`http://localhost:5000/weather/${city}`);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    weatherData = await response.json();
    displayWeather();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('Failed to fetch weather data. Please try again later.');
  }
}

function displayWeather() {
  // Adjust canvas size to fit the entire forecast
  let canvasWidth = 1200; // Adjust as needed
  let canvasHeight = 400; // Adjust as needed
  resizeCanvas(canvasWidth, canvasHeight);

  background(220);
  textSize(16);
  textAlign(CENTER);
  fill(0); // Set text color to black

  if (weatherData) {
    // Display current weather
    text(`City: ${weatherData.city}`, width / 2, 50);
    text(`Current Temperature: ${weatherData.currentTemp} °C`, width / 2, 100);
    text(`Current Condition: ${weatherData.currentCondition}`, width / 2, 150);

    // Calculate the maximum width needed for each column based on text length
    let maxColumnWidth = 0;
    for (let i = 0; i < 5; i++) {
      let forecast = weatherData.forecast[i];
      let dateWidth = textWidth(forecast.date);
      let tempWidth = textWidth(`Avg Temp: ${forecast.avgTemp} °C`);
      let conditionWidth = textWidth(`Condition: ${forecast.condition}`);
      let columnWidth = max(dateWidth, tempWidth, conditionWidth) + 20; // Add padding
      maxColumnWidth = max(maxColumnWidth, columnWidth);
    }

    // Display 5-day forecast
    let xOffset = (width - maxColumnWidth * 5) / 2;
    let yOffset = 200;
    let dayHeight = 150;
    for (let i = 0; i < 5; i++) {
      let forecast = weatherData.forecast[i];
      let x = xOffset + i * maxColumnWidth;
      let y = yOffset;

      // Draw forecast box
      stroke(0);
      fill(255);
      rect(x, y, maxColumnWidth, dayHeight);

      // Display date
      textAlign(CENTER);
      fill(0); // Reset text color to black
      text(forecast.date, x + maxColumnWidth / 2, y + 30);

      // Display average temperature
      textAlign(CENTER);
      text(`Avg Temp: ${forecast.avgTemp} °C`, x + maxColumnWidth / 2, y + 70);

      // Display rain/cloud condition
      textAlign(CENTER);
      text(`Condition: ${forecast.condition}`, x + maxColumnWidth / 2, y + 110);
    }
  } else {
    fill(0); // Set text color to black
    text('Loading weather data...', width / 2, 100);
  }
}
