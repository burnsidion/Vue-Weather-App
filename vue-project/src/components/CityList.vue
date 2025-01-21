<template>
  <div class="border-4 border-weather-secondary">
    <div v-for="city in savedCities" :key="city.id">
      <CityCard 
        @click="goToCityView(city)"
        :city="city" />
    </div>
    <p 
      v-if="savedCities.length === 0"
      class="text-center">
        No locations added, to start tracking a location, search in the field above.
    </p>
  </div>
</template>

<script setup>
import axios from "axios";
import { z } from "zod";
import { ref } from "vue";
import CityCard from "./CityCard.vue";
import { useRouter } from "vue-router";

const savedCities = ref([]);

const weatherUrl = `${import.meta.env.VITE_API_URL}/api/weather`;

const getCities = async () => {
  if(localStorage.getItem('savedCities')) {
    savedCities.value = JSON.parse(
      localStorage.getItem("savedCities")
    );

    const requests = [];
    savedCities.value.forEach(( /** @type {any} */city) => {
      requests.push(axios.get( `${weatherUrl}?q=${encodeURI(JSON.stringify({
          city: city.city, 
          state: city.state, 
          lat: city.coords.lat,
          lon: city.coords.long
        }))}`).then((v) => v.data)); 
      });
      const weatherData = await Promise.all(requests);

      //Flicker Delay 
      await new Promise((res) => setTimeout(res, 1000));

      weatherData.forEach((value, index) => {
        savedCities.value[index].weather = value;
      });
    }
};

await getCities();

const router = useRouter(); 
const goToCityView = async (city) => {
  router.push({
    name: 'cityView',
    params: {
       city: city.city,
       state: city.state
    },
    query: {
      id: city.id,
      lat: city.coords.lat,
      long: city.coords.long
    }
  })
}
</script>