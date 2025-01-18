<template>
    <div 
        class="flex py-6 px-3 bg-weather-secondary rounded-md shadow-md cursor-pointer border-4 border-weather-primary hover:animate-bounce"
        tabindex="0">
        <div class="flex flex-col flex-1">
            <h2 class="text-3xl"> {{ city.city }} </h2>
            <h3> {{ city.state }}</h3>
        </div>
        <div class="flex flex-col gap-2">
            <p class="text-3xl self-end"> {{ rounder(city.weather.current.temp) }}&deg;</p>
            <div class="flex gap-2 self-end">
                <span class="text-xs self-end">
                    H: {{ rounder(city.weather.daily[0].temp.max) }}&deg;
                </span>
                <span class="text-xs">
                    L: {{ rounder(city.weather.daily[0].temp.min) }}&deg;
                </span>
            </div>
            <span class="capitalize self-end">
                {{ city.weather.current.weather[0].description }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
defineProps({
    city: { 
        type: Object,
        default: () => {},
    }
})

const weatherIcon = (city) => {
    return city.weather.current.weather[0].icon;
};

const rounder = (value) => {
    return Math.round(value);
}
</script> 