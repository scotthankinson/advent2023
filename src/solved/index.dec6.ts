"use strict";
import * as fs from 'fs';

const start = (): void => {
    console.log(solve_pt1());
    // console.log(solve_pt2()); // Just delete the kerning in the original input
};



const solve_pt1 = () => {
    try {
        let data = fs.readFileSync('src/input.dec6.txt', 'utf8');
        const lines = data.split('\n');
        let times = lines[0].replace('Time:', '').split(' ').filter(o => o.trim().length > 0).map(o => parseInt(o));
        let distances = lines[1].replace('Distance:', '').split(' ').filter(o => o.trim().length > 0).map(o => parseInt(o));
        
        let marginOfError = 1;
        for(let i = 0; i < times.length; i++){
            let oneTime = times[i];
            let oneDistance = distances[i];
            let oneRaceResults = [];
            for(let j = 0; j < oneTime; j++){
                oneRaceResults.push((oneTime - j) * j);
            }
            let winners = oneRaceResults.filter(o => o > oneDistance).length;
            marginOfError = marginOfError * winners;
        }

        return marginOfError;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


/*
const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.dec6.txt', 'utf8');
        const lines = data.split('\n');
        console.log(lines);

        return 0;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}
*/



start();


export default start;