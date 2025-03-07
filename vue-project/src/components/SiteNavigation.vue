<template>
    <header class="sticky top-0 bg-weather-primary shadow-lg">
        <nav class='container flex flex-col sm:flex-row items-center gap-4 text-ivory-color py-6'>
            <RouterLink :to="{ name: 'home' }">
                <div class="flex items-center gap-3">
                    <i class="fa-solid fa-sun text-2xl animate-pulse"></i>
                    <p class="text-2xl hover:animate-pulse">What's the Weather?</p>
                </div>
            </RouterLink>

            <div class="flex gap-3 flex-1 justify-end"> 
                <i 
                    class="fa-solid fa-circle-info text-xl hover:text-weather-secondary durration-150 cursor-pointer"
                    @click="toggleModal"></i>
                <i
                    v-if="route.query.preview"
                    class="fa-solid fa-plus text-xl hover:text-weather-secondary durration-150 cursor-pointer"
                    @click="addCity"></i>
            </div>
            <BaseModal :modalActive="modalActive" @close-modal="toggleModal"> 
                <div class="text-black">
                    <h1 class="text-2xl mb-1">About:</h1>
                    <p class="mb-4">
                        What's the Weather allows you to track the current and
                        future weather of cities of your choosing.
                    </p>
                    <h2 class="text-2xl">How it works:</h2>
                    <ol class="list-decimal list-inside mb-4">
                        <li>
                            Search for your city by entering the name into the
                            search bar.
                        </li>
                        <li>
                            Select a city within the results, this will take
                            you to the current weather for your selection.
                        </li>
                        <li>
                            Track the city by clicking on the "+" icon in the
                            top right. This will save the city to view at a
                            later time on the home page.
                        </li>
                    </ol>

                    <h2 class="text-2xl">Removing a city</h2>
                    <p>
                        If you no longer wish to track a city, simply select
                        the city within the home page. At the bottom of the
                        page, there will be am option to delete the city.
                    </p>
                </div>
            </BaseModal>
        </nav>
    </header>
</template>

<script setup>
import { RouterLink, useRoute, useRouter} from 'vue-router';
import BaseModal from './BaseModal.vue';
import { ref } from 'vue';
import { uid } from 'uid';

const modalActive = ref(null);
const savedCities = ref([]);
const route = useRoute();
const router = useRouter(); 

const addCity = () => {
    if(localStorage.getItem('savedCities')) {
        // @ts-ignore
        savedCities.value = JSON.parse(localStorage.getItem('savedCities'));
    }
    const locationObj = {
        id: uid(),
        state: route.params.state,
        city: route.params.city,
        coords: {
            lat: route.query.lat,
            long: route.query.long 
        },
    };

    // Check if city already exists in local storage
    const cityExists = savedCities.value.some(city => 
        city.state === locationObj.state && city.city === locationObj.city
    );

    // Only add the city if it doesn't already exist
    if (!cityExists) {
        savedCities.value.push(locationObj); 
        localStorage.setItem('savedCities', JSON.stringify(savedCities.value));
    } else {
        console.log('City already saved!');
    }

    const query = Object.assign({}, route.query);
    delete query.preview;
    query.id = locationObj.id;
    router.replace({ query });
}
const toggleModal = () => {
    // @ts-ignore
    modalActive.value = !modalActive.value;
}
</script>
