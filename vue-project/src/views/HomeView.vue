<template>
  <main class="container text-ivory-color">
    <div class="nfc-search-input pt-4 mb-5 relative">
      <input 
        @input="getSearchResults"
        type="text"
        v-model="searchQuery"
        placeholder="Search for a city..."
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary 
        focus:outline-none 
        focus:shadow-[0px_1px_0_0_#004E71]
        animate-pulse"
        >
        <ul 
          v-if="mapboxSearchResults"
          class="absolute bg-weather-city-search text-ivory-color w-full shadow-md py-2 px-1 top-[66px]">
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
              class="py-2 cursor-pointer text-ivory-color"
              @click="previewCity(searchResult)"
              >
                {{  searchResult.properties.full_address }}
            </li>
          </template>
        </ul>
        <h1 class="mt-5 text-center text-2xl">Your Currently Tracked Cities</h1>
    </div>


    <div class="nfc-city-list flex flex-col gap-4 border-4 border-weather-secondary h-[600px] overflow-y-scroll">
      <Suspense>
        <CityList />
        
        <template #fallback>
          <CityCardSkeleton />
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup>
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { ref } from 'vue';

import CityList from '@/components/CityList.vue';
import CityCardSkeleton from '../components/CityCardSkeleton.vue';

const searchQuery = ref("");
const queryTimeout = ref(null);
const mapboxSearchResults = ref(null);
const searchError = ref(null)
const mapBoxUrl = `${import.meta.env.VITE_API_URL}/api/search`;
const trackedCities = ref([]);

const route = useRoute();
if(localStorage.getItem('savedCities')) {
        // @ts-ignore
        trackedCities.value = JSON.parse(localStorage.getItem('savedCities'));
    }

const getSearchResults = () => {
  // @ts-ignore
  clearTimeout(queryTimeout.value)
  // @ts-ignore
  queryTimeout.value = setTimeout(async () => {
    if(searchQuery.value !== '') {
      try {
        const results = await axios.get(
        `${mapBoxUrl}?q=${searchQuery.value}&types=place`
      );
      mapboxSearchResults.value = results.data.features;
      } catch {
        // @ts-ignore
        searchError.value = true
      }
    
      return;
    }
      mapboxSearchResults.value = null;
  }, 300)
};

const router = useRouter();

const previewCity = (/** @type {any} */ searchResult) => {
  const city = searchResult.properties.context.place.name;
  const state = searchResult.properties.context.region.name;

  const lat = searchResult.geometry.coordinates[1];
  const long = searchResult.geometry.coordinates[0];
  
  const cityExists = trackedCities.value.some(trackedCity => 
    trackedCity.state === state && trackedCity.city === city
  );

  if(!cityExists) {
    router.push({
      name: "cityView",
      params: { state: state, city: city },
      query: { 
        lat: lat,
        long: long,
        preview: true,
      },
    })
  } else {
    router.push({
      name: "cityView",
      params: { state: state, city: city },
      query: { 
        lat: lat,
        long: long
      },
    })
  }
}
</script>

