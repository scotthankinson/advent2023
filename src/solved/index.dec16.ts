"use strict";
import * as fs from 'fs';

const start = (): void => {
    console.log(solve_pt1());
    console.log(solve_pt2());
};



const solve_pt1 = () => {
    if (1 === 1) return 0;
    try {
        let data = fs.readFileSync('src/input.dec16.txt', 'utf8');
        const lines = data.split('\n');
        console.log(lines);
        let beams = [{x: -1, y: 0, dir: 'R'}];
        let crossed = new Set<string>();
        let repeats = new Set<string>();
        let count = 0;
        while (beams.length > 0){
            console.log("Active Beams: " + beams.length);
            let beam = beams.shift();
            if (repeats.has(JSON.stringify(beam))) continue;
            repeats.add(JSON.stringify(beam));
            console.log("Evaluate " + JSON.stringify(beam));
            crossed.add(beam.x + ',' + beam.y);
            let travel = JSON.parse(JSON.stringify(beam));
            if (beam.dir === 'R'){
                travel.x = travel.x + 1;
                if (travel.x >= lines[0].length) {
                    console.log("Terminating " + JSON.stringify(travel));
                    continue;
                }
            } else if (beam.dir === 'U') {
                travel.y = travel.y - 1;
                if (travel.y < 0) {
                    console.log("Terminating " + JSON.stringify(travel));
                    continue;
                }
            } else if (beam.dir === 'L') {
                travel.x = travel.x - 1;
                if (travel.x < 0) {
                    console.log("Terminating " + JSON.stringify(travel));
                    continue;
                }
            } else if (beam.dir === 'D') {
                travel.y = travel.y + 1;
                if (travel.y >= lines.length) {
                    console.log("Terminating " + JSON.stringify(travel));
                    continue;
                }
            }
            console.log("Travel to " + JSON.stringify(travel));
            let point = lines[travel.y][travel.x];
            if (point === '.') {
                beams.unshift(travel);
            } else if (point === '-' && (travel.dir === 'L' || travel.dir === 'R')) {
                beams.unshift(travel);
            } else if (point === '|' && (travel.dir === 'U' || travel.dir === 'D')) {
                beams.unshift(travel);
            } else if (point === '-') {
                let travelRight = JSON.parse(JSON.stringify(travel));
                travelRight.dir = 'R';
                let travelLeft = JSON.parse(JSON.stringify(travel));
                travelLeft.dir = 'L';
                beams.push(travelRight);
                beams.push(travelLeft);
            } else if (point === '|'){
                let travelUp = JSON.parse(JSON.stringify(travel));
                travelUp.dir = 'U';
                let travelDown = JSON.parse(JSON.stringify(travel));
                travelDown.dir = 'D';
                beams.push(travelUp);
                beams.push(travelDown);
            } else if (point === "\\") {
                if (travel.dir === "R") travel.dir = "D";
                else if (travel.dir === "D") travel.dir = "R";
                else if (travel.dir === "L") travel.dir = "U";
                else if (travel.dir === "U") travel.dir = "L";
                beams.unshift(travel);
            } else if (point === '/') {
                if (travel.dir === "R") travel.dir = "U";
                else if (travel.dir === "U") travel.dir = "R";
                else if (travel.dir === "L") travel.dir = "D";
                else if (travel.dir === "D") travel.dir = "L";
                beams.unshift(travel);
            }
            count += 1;
            // draw(lines, crossed);
        }

        // 8125 --> -1, 0 starter square is not on themap
        // 8126 too high --> fixed entering from off the map
        // 8152 too high
        console.log("Finished in " + count);
        draw(lines, crossed);
        return crossed.size - 1;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const draw = (lines, crossed) => {
    for(let y = 0; y < lines.length; y++){
        let line = '';
        for(let x = 0; x < lines[0].length; x++){
            if (crossed.has(x + ',' + y)) {
                line += 'X';
            } else {
                line += lines[y][x]; 
            }
        }
        console.log(line);
    }
    console.log("");
}


const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.dec16.txt', 'utf8');
        const lines = data.split('\n');
        let maxEnergy = 0;
        for(let i = 0; i < lines.length; i++){
            console.log("Vertical " + i);
            let energy = checkPoint(-1, i, "R", lines);
            if (energy > maxEnergy) maxEnergy = energy;
            energy = checkPoint(lines[0].length, i, "L", lines);
            if (energy > maxEnergy) maxEnergy = energy;
        }
        for(let i = 0; i < lines[0].length; i++){
            console.log("Horizontal " + i);
            let energy = checkPoint(i, -1, "D", lines);
            if (energy > maxEnergy) maxEnergy = energy;
            energy = checkPoint(i,lines.length, "U", lines);
            if (energy > maxEnergy) maxEnergy = energy;
        }

        return maxEnergy;        
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const checkPoint = (x, y, dir, lines)=>{
    let beams = [{x, y, dir}];
    let crossed = new Set<string>();
    let repeats = new Set<string>();
    let count = 0;
    while (beams.length > 0){
        // console.log("Active Beams: " + beams.length);
        let beam = beams.shift();
        if (repeats.has(JSON.stringify(beam))) continue;
        repeats.add(JSON.stringify(beam));
        // console.log("Evaluate " + JSON.stringify(beam));
        crossed.add(beam.x + ',' + beam.y);
        let travel = JSON.parse(JSON.stringify(beam));
        if (beam.dir === 'R'){
            travel.x = travel.x + 1;
            if (travel.x >= lines[0].length) {
                // console.log("Terminating " + JSON.stringify(travel));
                continue;
            }
        } else if (beam.dir === 'U') {
            travel.y = travel.y - 1;
            if (travel.y < 0) {
                // console.log("Terminating " + JSON.stringify(travel));
                continue;
            }
        } else if (beam.dir === 'L') {
            travel.x = travel.x - 1;
            if (travel.x < 0) {
                // console.log("Terminating " + JSON.stringify(travel));
                continue;
            }
        } else if (beam.dir === 'D') {
            travel.y = travel.y + 1;
            if (travel.y >= lines.length) {
                // console.log("Terminating " + JSON.stringify(travel));
                continue;
            }
        }
        // console.log("Travel to " + JSON.stringify(travel));
        let point = lines[travel.y][travel.x];
        if (point === '.') {
            beams.unshift(travel);
        } else if (point === '-' && (travel.dir === 'L' || travel.dir === 'R')) {
            beams.unshift(travel);
        } else if (point === '|' && (travel.dir === 'U' || travel.dir === 'D')) {
            beams.unshift(travel);
        } else if (point === '-') {
            let travelRight = JSON.parse(JSON.stringify(travel));
            travelRight.dir = 'R';
            let travelLeft = JSON.parse(JSON.stringify(travel));
            travelLeft.dir = 'L';
            beams.push(travelRight);
            beams.push(travelLeft);
        } else if (point === '|'){
            let travelUp = JSON.parse(JSON.stringify(travel));
            travelUp.dir = 'U';
            let travelDown = JSON.parse(JSON.stringify(travel));
            travelDown.dir = 'D';
            beams.push(travelUp);
            beams.push(travelDown);
        } else if (point === "\\") {
            if (travel.dir === "R") travel.dir = "D";
            else if (travel.dir === "D") travel.dir = "R";
            else if (travel.dir === "L") travel.dir = "U";
            else if (travel.dir === "U") travel.dir = "L";
            beams.unshift(travel);
        } else if (point === '/') {
            if (travel.dir === "R") travel.dir = "U";
            else if (travel.dir === "U") travel.dir = "R";
            else if (travel.dir === "L") travel.dir = "D";
            else if (travel.dir === "D") travel.dir = "L";
            beams.unshift(travel);
        }
        count += 1;
        // draw(lines, crossed);
    }
    // draw(lines, crossed);
    return crossed.size - 1;
}

start();


export default start;