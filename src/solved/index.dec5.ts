"use strict";
import * as fs from 'fs';

const start = (): void => {
    console.log(solve_pt1());
    console.log(solve_pt2());
};



const solve_pt1 = () => {
    try {
        if (1 === 1) return 0; // skip processing
        let data = fs.readFileSync('src/input.dec5.txt', 'utf8');
        const lines = data.split('\n');
        let mode = 'seed';
        let seeds = [];
        let maps = {};
        for(let line of lines){
            if (line.trim().length === 0) continue;
            if (line.startsWith('seeds:')){
                seeds = line.replace('seeds: ', '').split(' ').map(o => parseInt(o));
            } else if (line.indexOf('-to-') >= 0) {
                mode = line.split(' ')[0];
            } else {
                if (!maps[mode]) maps[mode] = [];
                let parts = line.split(' ');
                maps[mode].push({
                    'sourceFrom': parseInt(parts[1]),
                    'sourceTo': parseInt(parts[1]) + parseInt(parts[2]) - 1,
                    'offset': parseInt(parts[0]) - parseInt(parts[1])
                });
            }
        }
        
        let minSeed = 999999999;
        for(let i = 0; i < seeds.length; i++){
            let location = findLocation(seeds[i], maps);
            if (location < minSeed) minSeed = location;
        }   

        return minSeed;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.dec5.txt', 'utf8');
        const lines = data.split('\n');
        let mode = 'seed';
        let seeds = [];
        let maps = {};
        for(let line of lines){
            if (line.trim().length === 0) continue;
            if (line.startsWith('seeds:')){
                seeds = line.replace('seeds: ', '').split(' ').map(o => parseInt(o));
            } else if (line.indexOf('-to-') >= 0) {
                mode = line.split(' ')[0];
            } else {
                if (!maps[mode]) maps[mode] = [];
                let parts = line.split(' ');
                maps[mode].push({
                    'sourceFrom': parseInt(parts[1]),
                    'sourceTo': parseInt(parts[1]) + parseInt(parts[2]) - 1,
                    'offset': parseInt(parts[0]) - parseInt(parts[1])
                });
            }
        }

        let foundMinSeed = 9999999999999;
        while (seeds.length > 0){
            console.log(seeds.length + " left to process");
            let from = seeds.shift();
            let range = seeds.shift();
            console.log("From: " + from + " for " + range + " entries");
            for(let i = 0; i < range; i++){
                let checkSeed = findLocation(from + i, maps);
                if (checkSeed < foundMinSeed) foundMinSeed = checkSeed;
            }
        }
        return foundMinSeed;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const findLocation = (seed, maps) => {
    //console.log("----------");
    //console.log("Seed " + seed);
    let soil = seed;
    for(let j = 0; j < maps['seed-to-soil'].length; j++){
        if (seed >= maps['seed-to-soil'][j].sourceFrom && seed <= maps['seed-to-soil'][j].sourceTo){
            soil = seed + maps['seed-to-soil'][j].offset;
            break;
        }
    }
    //console.log("Soil " + soil);
    let fertilizer = soil;
    for(let j = 0; j < maps['soil-to-fertilizer'].length; j++){
        if (fertilizer >= maps['soil-to-fertilizer'][j].sourceFrom && fertilizer <= maps['soil-to-fertilizer'][j].sourceTo){
            fertilizer = soil + maps['soil-to-fertilizer'][j].offset;
            break;
        }
    }
    //console.log("Fertilizer " + fertilizer);
    let water = fertilizer;
    for(let j = 0; j < maps['fertilizer-to-water'].length; j++){
        if (water >= maps['fertilizer-to-water'][j].sourceFrom && water <= maps['fertilizer-to-water'][j].sourceTo){
            water = fertilizer + maps['fertilizer-to-water'][j].offset;
            break;
        }
    }
    //console.log("Water " + water);
    let light = water;
    for(let j = 0; j < maps['water-to-light'].length; j++){
        if (light >= maps['water-to-light'][j].sourceFrom && light <= maps['water-to-light'][j].sourceTo){
            light = water + maps['water-to-light'][j].offset;
            break;
        }
    }
    //console.log("Light " + light);
    let temperature = light;
    for(let j = 0; j < maps['light-to-temperature'].length; j++){
        if (temperature >= maps['light-to-temperature'][j].sourceFrom && temperature <= maps['light-to-temperature'][j].sourceTo){
            temperature = light + maps['light-to-temperature'][j].offset;
            break;
        }
    }
    //console.log("Temperature " + temperature);
    let humidity = temperature;
    for(let j = 0; j < maps['temperature-to-humidity'].length; j++){
        if (humidity >= maps['temperature-to-humidity'][j].sourceFrom && humidity <= maps['temperature-to-humidity'][j].sourceTo){
            humidity = temperature + maps['temperature-to-humidity'][j].offset;
            break;
        }
    }
    //console.log("Humidity " + humidity);
    let location = humidity;
    for(let j = 0; j < maps['humidity-to-location'].length; j++){
        if (location >= maps['humidity-to-location'][j].sourceFrom && location <= maps['humidity-to-location'][j].sourceTo){
            location = humidity + maps['humidity-to-location'][j].offset;
            break;
        }
    }
    //console.log("Location " + location);
    
    return location;
}



start();


export default start;