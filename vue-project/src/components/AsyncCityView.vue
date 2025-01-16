<template>
    <div class="flex flex-col flex-1 items-center">
        <!-- Banner -->
        <div v-if="route.query.preview" class="text-white p-4 bg-weather-secondary w-full text-center">
            <p>
                You are currently previewing this city, click the "+" to track this city!
            </p>
        </div>
        <!-- Weather Overview -->
        <div class="flex flex-col items-center text-white py-12 ">
            <h1 class="text-4xl mb-2"> {{ route.params.city }}</h1>
            <p class="text-sm mb-12">
                {{ currentDate }}
                {{ `, ${currentTime}` }}
            </p>
            <p class="text-8xl mb-8 ml-6">
                {{ currentTemp }}&deg;
            </p>
            <p>
                Feels Like: 
                {{ feelsLikeTemp }}&deg;
            </p>
            <p class="capitalize">
                {{  weatherDescription }}
            </p>
            <img 
                class="w-[150px] h-auto"
                :src="`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`" 
                alt="Small icon displaying current weather conditions">
        </div>

        <hr class="border-white border-opacity-10 border w-full">

        <!-- Hourly Weather  -->
        <div class="max-w-screen-md w-full py-12">
            <div class="mx-8 text-white">
                <h2 class="mb-4">
                    Hourly Weather
                </h2>
                <div class="flex gap-10 overflow-x-scroll">
                    <div 
                        v-for="hour in weatherData.hourly" 
                        :key="hour.dt"
                        class="flex flex-col gap-4 items-center">
                        <p class="whitespace-nowrap text-md">
                            {{ hourlyData(/** @type {any} */ hour) }}
                        </p>
                        <img 
                            class="w-auto h-[50px] object-cover"
                            :src="`https://openweathermap.org/img/wn/${weatherOverviewIcon(/** @type {any} */ hour)}@2x.png`" 
                            alt="Various icons displaying weather conditions over the rest of the day"
                        >
                        <p class="text-xl">
                            {{ hourlyTemp(/** @type {any} */ hour) }}&deg;
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <hr class="border-white border-opacity-10 border w-full">

        <!-- Weekly Weather  -->
        <div class="max-w-screen-md w-full py-12">
             <div class="mx-8 text-white">
                <h2 class="mb-4"> 7 Day Forecast </h2>
                <div 
                    v-for="day in weatherData.daily" 
                    :key="day.dt"
                    class="flex items-center">
                    <p class="flex-1">
                        {{ dayOfTheWeek(/** @type {any} */ day) }}
                    </p>
                    <img 
                        class="w-[50px] h-[50px] object-cover"
                        :src="`https://openweathermap.org/img/wn/${dailyIcon(/** @type {any} */ day)}@2x.png`" 
                        alt="Various icons displaying the weather for that day of the week">
                    
                    <div class="flex gap-2 flex-1 justify-end">
                        <p> H: {{ dailyHigh(/** @type {any} */ day) }} </p>
                        <p> L: {{ dailyLow(/** @type {any} */ day) }} </p>
                    </div>
                </div>
             </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute()

const getWeatherData = async (_route=route) => {
    try {
        const weather = await axios.get( `http://localhost:3000/weather?q=${encodeURI(JSON.stringify({
            city: route.params.city, 
            state: route.params.state, 
            lat: route.query['lat'],
            lon: route.query.long
        }))}`)

        // calculate the current date/time 
        const localOffset = new Date().getTimezoneOffset() * 60000;
        const utc = weather.data.current.dt * 1000 + localOffset;
        weather.data.currentTime = utc + 1000 * weather.data.timezone_offset;

        // calculate hourly weather offset
        weather.data.hourly.forEach((/** @type {any} */ hour) => {
            const utc = hour.dt * 1000 + localOffset;
            hour.currentTime = utc + 1000 * weather.data.timezone_offset;
        });

        return weather.data;

    } catch(error) {
        console.log(error)
    }
};

const weatherData = await getWeatherData();

const hourlyData = (/** @type {any} */ hour) => {
    return new Date(hour.currentTime)
    .toLocaleTimeString(
        "en-us",
        {
            hour: "numeric"
        }
    )
}

const weatherOverviewIcon = (/** @type {any} */ hour) => {
    return hour.weather[0].icon;
}

const hourlyTemp = (/** @type {any} */ hour) => {
    return Math.round(hour.temp);
}

const dayOfTheWeek = (/** @type {any} */ day) => {
    return new Date(day.dt * 1000)
    .toLocaleDateString(
        'en-us',
        {
            weekday: "long"
        }
    )
}

const dailyIcon = (/** @type {any} */ day) => {
    return day.weather[0].icon; 
}

const dailyHigh = (/** @type {any} */ day) => {
    return Math.round(day.temp.max)
}

const dailyLow = (/** @type {any} */ day) => {
    return Math.round(day.temp.min)
}
const currentDate = computed(() => {
    return new Date(weatherData.currentTime)
    .toLocaleDateString(
        'en-us',
        {
            weekday: "short",
            day: "2-digit",
            month: "long"
        }
    );
});

const currentTime = computed(() => {
    return new Date(weatherData.currentTime)
    .toLocaleTimeString(
        'en-us',
        {
            timestyle: "short"
        }
    );
});

const currentTemp = computed(() => {
    return Math.round(weatherData.current.temp);
});

const feelsLikeTemp = computed(() => {
    return Math.round(weatherData.current.feels_like);
});

const weatherDescription = computed(() => {
    return weatherData.current.weather[0].description;
});

const weatherIcon = computed(() => {
    return weatherData.current.weather[0].icon
});
</script>