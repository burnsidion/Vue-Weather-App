const express = require('express');
require('dotenv').config();
const qs = require('qs');
const axios = require('axios');
const { z } = require('zod');
const path = require('path');
const cors = require('cors');

const app = express();

// Use CORS Middleware
app.use(cors());
app.use(express.json());

// Serve Vue Frontend
app.use(express.static(path.join(__dirname, '../vue-project/dist')));

// API Routes
const mapBoxUrl = 'https://api.mapbox.com/search/geocode/v6/forward';
const mapboxAPIKey = process.env.MAPBOX_API_KEY;

const weatherMapUrl = 'https://api.openweathermap.org/data/3.0/onecall';
const weatherMapAPIKey = process.env.WEATHERMAP_API_KEY;

// Mapbox Geocoding API Proxy
app.get('/api/search', async (req, res) => {
  try {
    let query = req.query;
    query.access_token = mapboxAPIKey; // Add API key to the query
    let queryString = qs.stringify(query);

    const mapboxResponse = await axios.get(`${mapBoxUrl}?${queryString}`);
    res.send(mapboxResponse.data);
  } catch (error) {
    console.error('Error fetching data from Mapbox API:', error.message);
    res.status(500).send({ error: 'Failed to fetch search results' });
  }
});

// OpenWeatherMap API Proxy
app.get('/api/weather', async (req, res) => {
  try {

    // Convert q string to JSON
    const qObj = JSON.parse(req.query.q);

    // Validate JSON fields
    const zparams = z.object({
      lon: z.coerce.number(),
      lat: z.coerce.number(),
    }).parse(qObj);

    const qparams = new URLSearchParams({
      ...zparams,
      appid: weatherMapAPIKey,
      units: 'imperial',
    });

    const rUrl = `${weatherMapUrl}?${qparams.toString()}`;

    // Fetch data from OpenWeatherMap
    const weatherResponse = await axios.get(rUrl);

    res.send(weatherResponse.data);
  } catch (error) {
    console.error('Error in /api/weather route:', error.message);
    res.status(500).send({ error: 'Failed to fetch weather data' });
  }
});

// Handle Vue Frontend SPA Routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../vue-project/dist/index.html'));
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
