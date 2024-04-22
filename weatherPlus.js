let weatherData;

function setup() {
  createCanvas(800, 400);
  
  // Create search input
  let searchInput = createInput('Copenhagen'); // Default city set to Copenhagen
  searchInput.position(20, 20);
  searchInput.attribute('placeholder', 'Enter city name');
  searchInput.attribute('id', 'search-input'); // Add an id for easier access

  // Create search button
  let searchButton = createButton('Search');
  searchButton.position(180, 20);
  searchButton.mousePressed(() => {
    let cityName = searchInput.value();
    fetchWeatherData(cityName);
  });
  
  // Fetch weather data for the default city
  fetchWeatherData('Copenhagen');
}

async function fetchWeatherData(city) {
  try {
    const response = await fetch(`http://localhost:5000/weather/${city}`);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    weatherData = await response.json();

    // Convert forecast dates to Date objects
    weatherData.forecast.forEach(forecast => {
      forecast.date = new Date(forecast.date);
    });

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

  background('skyblue'); // Set background color to sky blue

  if (weatherData) {
    // Set text color to white
    fill(255);
    textSize(16);
    textAlign(CENTER);

    // Display current weather
    text(`City: ${weatherData.city}`, width / 2, 50);
    text(`Current Temperature: ${weatherData.currentTemp} °C`, width / 2, 85);
    // Display weather condition icon for current condition
    getWeatherIcon(weatherData.currentCondition, icon => {
      if (icon) {
        image(icon, width / 2 - 25, 120, 50, 50); // Position the icon above the condition text
      }
    });
    text(`${weatherData.currentCondition}`, width / 2, 190); // Position the condition text below the icon

    // Calculate the maximum width needed for each column based on text length
    let maxColumnWidth = 0;
    for (let i = 0; i < 5; i++) {
      let forecast = weatherData.forecast[i];
      let dateWidth = textWidth(forecast.date.toLocaleDateString()); // Date width
      let tempWidth = textWidth(`Avg Temp: ${forecast.avgTemp} °C`);
      let columnWidth = max(dateWidth, tempWidth) + 20; // Add padding
      maxColumnWidth = max(maxColumnWidth, columnWidth);
    }

    // Display 5-day forecast
    let xOffset = (width - maxColumnWidth * 5) / 2;
    let yOffset = 200;
    let dayHeight = 150;

    stroke(255); // Set stroke color to white for grid borders
    for (let i = 0; i < 5; i++) {
      let forecast = weatherData.forecast[i];
      let x = xOffset + i * maxColumnWidth;
      let y = yOffset;

      // Draw forecast box with white fill
      fill('skyblue');
      rect(x, y, maxColumnWidth, dayHeight);

      // Display date
      textAlign(CENTER);
      fill(255); // Reset text color to white
      text(forecast.date.toLocaleDateString(), x + maxColumnWidth / 2, y + 40);

      // Display average temperature
      textAlign(CENTER);
      text(`Avg Temp: ${forecast.avgTemp} °C`, x + maxColumnWidth / 2, y + 80);

      // Display weather condition icon for forecast
      getWeatherIcon(forecast.condition, icon => {
        if (icon) {
          image(icon, x + maxColumnWidth / 2 - 25, y + 120, 50, 50);
        }
      });

      // Display condition text below icon
      textAlign(CENTER);
      text(`${forecast.condition}`, x + maxColumnWidth / 2, y + 190);
    }
  } else {
    // Display loading message
    fill(255); // Set text color to white
    text('Loading weather data...', width / 2, 100);
  }
}

function getWeatherIcon(condition, callback) {
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
    default:
      return null; // No icon found
  }
}
