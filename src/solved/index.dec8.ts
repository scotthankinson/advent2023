"use strict";
import * as fs from 'fs';

const start = (): void => {
    // console.log(solve_pt1());
    console.log(solve_pt2());
};


/*
const solve_pt1 = () => {
    try {
        let data = fs.readFileSync('src/input.dec8.txt', 'utf8');
        const lines = data.split('\n');
        let instructions = lines.shift().split('');
        lines.shift();
        let mapDirectives = {};
        for(let line of lines){
            let key = line.split(' = ')[0];
            let values = line.split(' = ')[1].split(',').map(o => o.trim().replace('(', '').replace(')',''));
            mapDirectives[key] = {'L': values[0], 'R': values[1]};
        }
        
        let currentLocation = 'AAA';
        let steps = 0;
        while (currentLocation !== 'ZZZ'){
            steps += 1;
            let instruction = instructions.shift();
            instructions.push(instruction);
            currentLocation = mapDirectives[currentLocation][instruction];
        }
        console.log(instructions);
        console.log(mapDirectives);
        console.log(steps);
        console.log(currentLocation);
        return 0;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}
*/


const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.dec8.txt', 'utf8');
        const lines = data.split('\n');
        let instructions = lines.shift().split('');
        lines.shift();
        let mapDirectives = {};
        let currentLocations = [];
        for(let line of lines){
            let key = line.split(' = ')[0];
            let values = line.split(' = ')[1].split(',').map(o => o.trim().replace('(', '').replace(')',''));
            mapDirectives[key] = {'L': values[0], 'R': values[1]};
            if (key[key.length - 1] === 'A') currentLocations.push(key);
        }
        
        let steps = 0;
        let lcm = Array<number>(currentLocations.length).fill(0);
        while (currentLocations.filter( o => o[o.length -1] !== 'Z').length > 0){
            steps += 1;
            let wandering = currentLocations.filter( o => o[o.length -1] !== 'Z').length;
            if (wandering < currentLocations.length) {
                console.log(steps + ": " + wandering);
                console.log(currentLocations);    
                console.log(lcm);
            }
            let instruction = instructions.shift();
            instructions.push(instruction);
            for(let i = 0; i < currentLocations.length; i++){
                currentLocations[i] = mapDirectives[currentLocations[i]][instruction];    
                if (currentLocations[i][currentLocations[i].length - 1] === 'Z' && lcm[i] === 0) lcm[i] = steps;
            }
            if (lcm.filter(o => o === 0).length === 0) break;
            
        }
        console.log(instructions);
        console.log(mapDirectives);
        console.log(steps);
        console.log(currentLocations);
        console.log(lcm); // plug into LCM calculator
        return 0;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();


export default start;