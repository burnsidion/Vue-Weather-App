<template>
    <div>

    </div>
</template>

<script setup>
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute()
const weatherMapAPIKey = "a1f462021e240a38a6de21f2df0c07c6";

const getWeatherData = async () => {
    try {
        const weather = await axios.get(
            `http://api.openweathermap.org/data/3.0/onecall?lat=${route.query.lat}&lon=${route.query.lat}&appid=${weatherMapAPIKey}`
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
</script>