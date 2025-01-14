<template>
    <div>

    </div>
</template>

<script setup>
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute()
const weatherMapAPIKey = "61cf1a006d47c12d87fcdb86c327fe27";

const getWeatherData = async () => {
    try {
        const weather = await axios.get(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${route.query.lat}&lon=${route.query.long}&exclude={part}&appid=${weatherMapAPIKey}`
        );
        console.log(weather)

        // calculate the current date/time 
        const localOffset = new Date().getTimezoneOffset() * 6000;
        const utc = weather.data.current.dt * 1000 + localOffset;
        weather.data.currentTime = utc + 1000 * weather.data.timezone_offset

        //calculate hourly weather offset
        weather.data.hourly.forEach((hour) => {
            const utc = hour.dt * 1000 + localOffset;
            hour.currentTime = utc + 1000 * weather.data.timezone_offset
        })
        return weather;
    } catch(error) {
        console.log(error)
    }
}


const weatherData = await getWeatherData();
console.log(weatherData);
</script>