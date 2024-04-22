let weatherData;

function setup() {
  let canvas = createCanvas(1200, 400).id('weatherCanvas');
  canvas.style('border', '1px solid #000');
  textAlign(CENTER);
  textSize(18);
  
  let searchInput = createInput('Copenhagen');
  searchInput.position(20, 20);
  searchInput.attribute('placeholder', 'Enter city name');
  searchInput.attribute('id', 'search-input');

  let searchButton = createButton('Search');
  searchButton.position(180, 20);
  searchButton.mousePressed(() => {
    let cityName = searchInput.value();
    fetchWeatherData(cityName);
  });
  
  fetchWeatherData('Copenhagen');
}

async function fetchWeatherData(city) {
  try {
    const response = await fetch(`http://localhost:5000/weather/${city}`);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    weatherData = await response.json();

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
  background('skyblue');
  
  if (weatherData) {
    fill(255);
    text(`${weatherData.city}`, width / 2, 50);
    text(`Current Temperature: ${weatherData.currentTemp} °C`, width / 2, 85);
    textStyle(BOLD);
    getWeatherIcon(weatherData.currentCondition, icon => {
      if (icon) {
        image(icon, width / 2 - 25, 85, 50, 50);
      }
    });
    text(`${weatherData.currentCondition}`, width / 2, 150);

    let maxColumnWidth = 0;
    for (let i = 0; i < 5; i++) {
      let forecast = weatherData.forecast[i];
      let dateWidth = textWidth(forecast.date.toLocaleDateString());
      let tempWidth = textWidth(`Avg Temp: ${forecast.avgTemp} °C`);
      let columnWidth = max(dateWidth, tempWidth) + 2;
      maxColumnWidth = max(maxColumnWidth, columnWidth);
    }

    let xOffset = (width - maxColumnWidth * 5) / 2 + maxColumnWidth;
    let yOffset = 170;
    let dayHeight = 150;

    stroke(255);
    for (let i = 0; i < 5; i++) {
      let forecast = weatherData.forecast[i];
      let x = xOffset + i * maxColumnWidth;
      let y = yOffset;

      fill('skyblue');
      rect(x, y, maxColumnWidth, dayHeight);

      fill(255);
      text(forecast.date.toLocaleDateString(), x + maxColumnWidth / 2, y + 25);
      text(`Avg Temp: ${forecast.avgTemp} °C`, x + maxColumnWidth / 2, y + 55);
      getWeatherIcon(forecast.condition, icon => {
        if (icon) {
          image(icon, x + maxColumnWidth / 2 - 25, y + 60, 50, 50);
        }
      });
      text(`${forecast.condition}`, x + maxColumnWidth / 2, y + 130);
    }
  } else {
    fill(255);
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
  }
}
