// Import the express module
import express from 'express';
import path from 'path'; // Import the path module

// Create an instance of the express application
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow these HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow these headers
  next();
});

// Define the route and handler for fetching weather data
app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;
  const apiKey = 'd8e33d16a1d2cead140d8a9c579d7d4b';

  try {
    // Fetch current weather data
    const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const currentData = await currentResponse.json();

    // Fetch 5-day forecast data
    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const forecastData = await forecastResponse.json();

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }

    // Extract relevant information from the API responses
    const weatherData = {
      city: currentData.name,
      currentTemp: currentData.main.temp,
      currentCondition: currentData.weather[0].main,
      forecast: []
    };

    // Extract forecast data for the next 5 days
    for (let i = 0; i < 5; i++) {
      const forecast = forecastData.list[i * 8]; // Data is provided in 3-hour intervals, so we select every 8th item
      const date = new Date(forecast.dt_txt);
      const avgTemp = forecast.main.temp;
      const condition = forecast.weather[0].main;
      weatherData.forecast.push({ date, avgTemp, condition });
    }

    // Send the weather data as JSON response
    res.status(200).json(weatherData);
  } catch (error) {
    // Handle errors
    console.error('Error fetching weather data:', error);
    res.status(500).send('Internal server error');
  }
});

// Specify a port number for the server
const port = 5000;

// Start the server and listen to the port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
