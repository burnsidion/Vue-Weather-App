<template>
  <div>
    <h1 class="mb-2 text-center text-xl">Your Currently Tracked Cities</h1>
    <div v-for="city in savedCities" :key="city.id">
      <CityCard :city="city" />
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { z } from "zod";
import { ref } from "vue";
import CityCard from "./CityCard.vue";

const citiesJsonStr = z.string().parse(localStorage.getItem("savedCities"));
const citiesJson = JSON.parse(citiesJsonStr);
const savedCities = ref(citiesJson);

const getCities = async () => {
  const requests = savedCities.value.map(( /** @type {any} */city) => {
    return axios.get( `http://localhost:3000/weather?q=${encodeURI(JSON.stringify({
            city: city.city, 
            state: city.state, 
            lat: Number(city.lat),
            lon: Number(city.lon)
        }))}`).then((v) => v.data);
  });
  const weatherData = await Promise.all(requests);
  weatherData.forEach((value, index) => {
    savedCities.value[index].weather = value;
  });
};

await getCities();
</script>