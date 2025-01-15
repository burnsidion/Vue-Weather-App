const express = require('express')
require('dotenv').config()

// const homeRouter = express.Router();

const qs = require('qs')
const axios = require('axios')

const app = express()
const port = 3000

const mapBoxUrl = 'https://api.mapbox.com/search/geocode/v6/forward';
const mapboxAPIKey = process.env.MAPBOX_API_KEY;

// const weatherMapUrl = 'https://api.openweathermap.org/data/3.0/onecall';
// const weatherMapAPIKey = process.env.WEATHERMAP_API_KEY;

app.get('/', (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  let query = request.query;
  query.access_token = mapboxAPIKey;
  let queryString = qs.stringify(query);
  axios.get(`${mapBoxUrl}?${queryString}`).then((res) => {
    response.send(res.data)
  })
});

// app.get('/city', (request, response, next ) => {
//   response.set('Access-Control-Allow-Origin', '*');
//   let query = request.query;
//   query.appid = weatherMapAPIKey;
//   let queryString = qs.stringify(query);
//   next()
//   axios.get(`${weatherMapUrl}?${queryString}`).then((res) => {
//     response.send(res.data)
//   })
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
