// @ts-nocheck
const express = require('express');
require('dotenv').config();

const qs = require('qs');
const axios = require('axios');
const { z } = require('zod');

const app = express();

app.use(express.static(path.join(__dirname, '../vue-project/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../vue-project/dist/index.html'));
});

const mapBoxUrl = 'https://api.mapbox.com/search/geocode/v6/forward';
const mapboxAPIKey = process.env.MAPBOX_API_KEY;

const weatherMapUrl = 'https://api.openweathermap.org/data/3.0/onecall';
const weatherMapAPIKey = process.env.WEATHERMAP_API_KEY;

app.use(express.json())

app.get('/', async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  let query = request.query;
  query.access_token = mapboxAPIKey;
  let queryString = qs.stringify(query);
  await axios.get(`${mapBoxUrl}?${queryString}`).then((res) => {
    response.send(res.data);
  });
});

app.get('/weather', async ({ query }, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  try {
    // convert q string to json
    const qObj = JSON.parse(query.q);

    // validate json fields
    const zparams = z.object({
      lon: z.coerce.number(),
      lat: z.coerce.number()
    }).parse(qObj);

    // create a search params
    const qparams = new URLSearchParams({ ...zparams, appid: weatherMapAPIKey, units: 'imperial' });

    // generate weather api url
    const rUrl = `${weatherMapUrl}?${qparams.toString()}`;
    const data = await axios.get(rUrl).then(r => r.data);
    response.send(data);
  } catch (error) {
    console.error(error.message)
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
