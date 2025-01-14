<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input 
        @input="getSearchResults"
        type="text"
        v-model="searchQuery"
        placeholder="Search for a city or state"
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary 
        focus:outline-none 
        focus:shadow-[0px_1px_0_0_#004E71]"
        >
        <ul 
          v-if="mapboxSearchResults"
          class="absolute bg-weather-secondary text-white w-full shadow-m py-2 px-1 top-[66px]">
          <p v-if="searchError"> 
            Sorry, looks like he's dead, Jim. Please try again. 
          </p>
          <p v-if="!serverError && mapboxSearchResults.length === 0">
            No search results for given query, please try another search term
          </p>
          <template v-else>
            <li
              v-for="searchResult in mapboxSearchResults"
              :key="searchResult.id"
              class="py-2 cursor-pointer text-white"
              @click="previewCity(searchResult)"
              >
                {{  searchResult.properties.full_address }}
            </li>
          </template>
        </ul>
    </div>
  </main>
</template>

<script setup>
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import CityView from './CityView.vue';

const searchQuery = ref("");
const queryTimeout = ref(null);
const mapboxAPIKey = "pk.eyJ1IjoiaWFuYnVybnNpZGU4OSIsImEiOiJjbTV2cW5ua3EwNHl1MnFvbXc1cndtd2xpIn0.umsTgfwi6r9wU4_IhrdNnQ";
const mapboxSearchResults = ref(null);
const searchError = ref(null)

const getSearchResults = () => {
  clearTimeout(queryTimeout.value)
  queryTimeout.value = setTimeout(async () => {
    if(searchQuery.value !== '') {
      try {
        const results = await axios.get(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${searchQuery.value}.json&access_token=${mapboxAPIKey}&types=place`
      );
      mapboxSearchResults.value = results.data.features;
      } catch {
        searchError.value = true
      }
    
      return;
    }
      mapboxSearchResults.value = null;
  }, 300)
};

const router = useRouter();

const previewCity = (searchResult) => {
  const city = searchResult.properties.context.place.name;
  const state = searchResult.properties.context.region.name;

  const lat = searchResult.geometry.coordinates[1];
  const long = searchResult.geometry.coordinates[0];

  router.push({
    name: "cityView",
    params: { state: state, city: city },
    query: { 
      lat: lat,
      long: long,
      preview: true,
    },
  })
  console.log(searchResult, city, state, lat, long);
}
</script>

