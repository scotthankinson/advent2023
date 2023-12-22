"use strict";
import * as fs from 'fs';

const start = (): void => {
    console.log(solve_pt1());
    console.log(solve_pt2());
};



const solve_pt1 = () => {
    if (1 === 1) return 0;
    try {
        let data = fs.readFileSync('src/input.dec21.txt', 'utf8');
        const lines = data.split('\n');
        let map = {};
        let positions = new Set<string>();
        for (let y = 0; y < lines.length; y++) {
            for (let x = 0; x < lines[0].length; x++) {
                if (lines[y][x] === 'S') {
                    map[x + ',' + y] = '.';
                    positions.add(x + ',' + y);
                } else {
                    map[x + ',' + y] = lines[y][x];
                }
            }
        }

        console.log(map);
        console.log(positions);
        for (let i = 0; i < 64; i++) {
            let steps = Array.from(positions.values());
            console.log(steps);
            positions.clear();
            console.log("Calculating movement for " + steps.length + " destination(s)");
            for (let step of steps) {
                // console.log(step);
                let x = parseInt(step.split(',')[0]);
                let y = parseInt(step.split(',')[1]);
                // north
                if (y > 0 && map[x + ',' + (y - 1)] === '.') {
                    positions.add(x + ',' + (y - 1));
                }
                // east
                if (x < lines[0].length && map[(x + 1) + ',' + y] === '.') {
                    positions.add((x + 1) + ',' + y);
                }
                // south
                if (y < lines.length && map[x + ',' + (y + 1)] === '.') {
                    positions.add(x + ',' + (y + 1));
                }
                // west
                if (x > 0 && map[(x - 1) + ',' + y] === '.') {
                    positions.add((x - 1) + ',' + y);
                }
            }
            let count = draw(map, positions, lines[0].length, lines.length);
            console.log(count);
        }

        return positions.size;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const draw = (map, positions, maxX, maxY) => {
    let count = 0;
    console.log("--------------------");
    for (let y = 0; y < maxY; y++) {
        let line = "";
        for (let x = 0; x < maxX; x++) {
            if (map[x + ',' + y] !== '.') {
                line += map[x + ',' + y];
            } else if (positions.has(x + ',' + y)) {
                line += 'O';
                count += 1;
            } else {
                line += '.';
            }
        }
        console.log(line);
    }
    return count;
}

const checkFrame = (positions, maxX, maxY, frame) => {
    let frameX = parseInt(frame.split(',')[0]);
    let frameY = parseInt(frame.split(',')[1]);
    let minX = 0 + (frameX * maxX);
    let minY = 0 + (frameY * maxY);
    frameX = maxX + (frameX * maxX);
    frameY = maxY + (frameY * maxY);

    let count = 0;
    for (let y = minY; y < frameY; y++) {
        for (let x = minX; x < frameX; x++) {
            if (positions.has(x + ',' + y)) {
                count += 1;
            }
        }
    }
    return count;
}

const purgeFrame = (positions, maxX, maxY, frame) => {
    let frameX = parseInt(frame.split(',')[0]);
    let frameY = parseInt(frame.split(',')[1]);
    let minX = 0 + (frameX * maxX);
    let minY = 0 + (frameY * maxY);
    frameX = maxX + (frameX * maxX);
    frameY = maxY + (frameY * maxY);

    for (let y = minY; y < frameY; y++) {
        for (let x = minX; x < frameX; x++) {
            if (positions.has(x + ',' + y)) {
                positions.delete(x + ',' + y);
            }
        }
    }
}

// https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
const mod = (n, m) => {
    return ((n % m) + m) % m;
}

const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.dec21.txt', 'utf8');
        const lines = data.split('\n');
        let map = {};
        let positions = new Set<string>();
        for (let y = 0; y < lines.length; y++) {
            for (let x = 0; x < lines[0].length; x++) {
                if (lines[y][x] === 'S') {
                    map[x + ',' + y] = '.';
                    positions.add(x + ',' + y);
                } else {
                    map[x + ',' + y] = lines[y][x];
                }
            }
        }

        // console.log(map);
        // console.log(positions);
        let maxX = lines[0].length;
        let maxY = lines.length;
        let frameHistory = {};
        let oscillations = [];
        let lastCount = 0;
        
        for (let i = 0; i < 100; i++) {
            let steps = Array.from(positions.values());
            positions.clear();
            let stepMinY = 0;
            let stepMinX = 0;
            let stepMaxY = 0;
            let stepMaxX = 0;

            for (let step of steps) {
                // console.log(step);
                let x = parseInt(step.split(',')[0]);
                let y = parseInt(step.split(',')[1]);
                if (x > stepMaxX) stepMaxX = x;
                if (x < stepMinX) stepMinX = x;
                if (y > stepMaxY) stepMaxY = y;
                if (y < stepMinY) stepMinY = y;
                // console.log("--- Variations on " + x + ',' + y + " ---");

                let normalizedX = mod(x, maxX);
                let normalizedY = mod(y, maxY);
                // north
                let northY = mod(y - 1, maxY);
                // console.log('North: ' + normalizedX + ',' + northY + " for " + x + ',' + y);
                if (map[normalizedX + ',' + northY] === '.') {
                    positions.add(x + ',' + (y - 1));
                }
                // east
                let eastX = mod(x + 1, maxX);
                // console.log('East: ' + eastX + ',' + normalizedY + " for " + x + ',' + y);
                if (map[eastX + ',' + normalizedY] === '.') {
                    positions.add((x + 1) + ',' + y);
                }
                // south
                let southY = mod(y + 1, maxY);
                // console.log('South: ' + normalizedX + ',' + southY + " for " + x + ',' + y);
                if (map[normalizedX + ',' + southY] === '.') {
                    positions.add(x + ',' + (y + 1));
                }
                // west
                let westX = mod(x - 1, maxX);
                // console.log('West: ' + westX + ',' + normalizedY + " for " + x + ',' + y);
                if (map[westX + ',' + normalizedY] === '.') {
                    positions.add((x - 1) + ',' + y);
                }
            }

            let frameMinY = Math.floor(stepMinY / maxY);
            let frameMinX = Math.floor(stepMinX / maxX);
            let frameMaxY = Math.floor(stepMaxY / maxY);
            let frameMaxX = Math.floor(stepMaxX / maxX);
            // console.log("Need to evaluate " + frameMinX + ',' + frameMinY + " to " + frameMaxX + ',' + frameMaxY);

            let count = 0;
            let frameCount = 0;
            let activeFrameCount = 0;
            let stableFrameCount = 0;
            for (let y = frameMinY; y <= frameMaxY; y++) {
                for (let x = frameMinX; x <= frameMaxX; x++) {
                    frameCount += 1;
                    if (!frameHistory[x + ',' + y]) {
                        frameHistory[x + ',' + y] = { key: x + ',' + y, history: [], stable: false , first: i, last: 0};
                    }

                    if (frameHistory[x + ',' + y].stable) {
                        stableFrameCount += 1;
                        purgeFrame(positions, maxX, maxY, x + ',' + y);
                        let currentValue = frameHistory[x + ',' + y].history.shift();
                        // console.log("Stable frame " + x + ',' + y + " oscillating to " + currentValue);
                        // Stable frame 0,0 oscillating to 7451
                        // Stable frame 0,0 oscillating to 7344
                        count += currentValue;
                        frameHistory[x + ',' + y].history.push(currentValue);
                    } else {
                        activeFrameCount += 1;
                        let oneCount = checkFrame(positions, lines[0].length, lines.length, x + ',' + y);
                        if (oneCount === 0) continue;
                        count += oneCount;
                        frameHistory[x + ',' + y].history.push(oneCount);
                        if (frameHistory[x + ',' + y].history.length > 4) {
                            // check for stable oscillations
                            let last4 = frameHistory[x + ',' + y].history.slice(-4);
                            if (last4[0] === last4[2] && last4[1] === last4[3]) {
                                // console.log(x + ',' + y + ": " + frameHistory[x + ',' + y].history);
                                frameHistory[x + ',' + y].stable = true;
                                frameHistory[x + ',' + y].last = i;
                                frameHistory[x + ',' + y].history = [last4[0], last4[1]];
                                if (oscillations.length === 0) oscillations = [last4[0], last4[1]];
                                // console.log("Stabilized " + x + ',' + y + " with " + frameHistory[x + ',' + y].history + ' after adding ' + oneCount);
                            }
                        }
                    }
                }
            }
            // frame 0,0 starts at 0 and stabilizes at 12, 12 = 39, 13 = 42, 14 = 39, 15 = 42

            // frame 1,0 starts at 8 and stabilizes at 25, 25 = 39, 26 = 42, 27 = 39, 28 = 42   
            // frame 2,0 starts at 32 and stabilizes at 49, 49 = 39, 50 = 42, 51 = 39, 52 = 42 exactly matches 1,0
            // frame -1,0 starts at 6 and stabilizes at 21, 21 = 39, 22 = 42        starts with 1 but takes 15
            // frame -2,0 starts at 21 and stabilizes at 36, 36 = 39, 37 = 42       starts with 3 but takes 15
            // frame -3,0 starts at 32 and stabilizes at 47                         starts with 2 but takes 15

            // frame 0,1 starts at 7 and stabilizes at 27, 27=39, 28=42 
            // frame 0,2 starts at 21 and stabilizes at 38
            // frame 0,3 starts at 32 and stabilizes at 49

            // frame 0,-1 starts at 8 and stabilizes at 22
            // frame 0,-2 starts at 21 and stabilizes at 35 (with 42)
            // frame 0,-3 starts at 32 and stabilizes at 46 (with 42)
            if ((i + 1) % 100 === 0) console.log(i + ": " + count + " over " + frameCount + " frames, still tracking " + positions.size);
            if ((i + 1) % 100 === 0) console.log(i + ": " + stableFrameCount + " stable frames, " + activeFrameCount + " active frames; oscillations are " + oscillations);
            lastCount = count;
        }
        
        for(let oneFrame of Object.values(frameHistory)){
            if (oneFrame["stable"]) console.log(oneFrame);
        }
        // console.log(positions.size);
        return lastCount;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();


export default start;


/*

// ratio calculation too imprecise

console.log(collection);
let overshoot = 5000;
// Target: 26,501,365
//    60:  26,891,508
//    61:  26,681,382
//    62:  26,542,648
//    63:  26,658,192
let averageStepsToIncrement = 0;
for(let oneEntry of collection){
    averageStepsToIncrement += oneEntry.i / oneEntry.ratio;
}
averageStepsToIncrement = averageStepsToIncrement / collection.length;
console.log("Average Steps to increment: " + averageStepsToIncrement.toPrecision(3));

while(collection[collection.length - 1].i < overshoot) {
    // ratio = steps / i / base = (next whole number)
    // 
    let last = collection[collection.length - 1];
    let next = JSON.parse(JSON.stringify(last));
    next.i = next.i + averageStepsToIncrement;
    next.ratio = Math.floor(next.ratio) + 1;
    next.integerI = Math.round(next.i);
    next.steps = next.ratio * Math.round(next.i) * next.baseRatio;
    // console.log(next);
    collection.push(next);
}
console.log(collection.slice(-2));
 
// Sample Input:
// In exactly 6 steps, he can still reach 16 garden plots.
// 2.6666x
// In exactly 10 steps, he can reach any of 50 garden plots.
// 5x 
// In exactly 50 steps, he can reach 1594 garden plots.
// 31.88x
// In exactly 100 steps, he can reach 6536 garden plots.
// 65.36x       roughly 2x
// In exactly 500 steps, he can reach 167004 garden plots.
// 334x         roughly 5x
// In exactly 1000 steps, he can reach 668697 garden plots.
// 668.697x     roughly 20x
// In exactly 5000 steps, he can reach 16733044 garden plots.
// 3346.6088    roughly 105x


// 1598 / 50 = 31.88
// 6536 / 100 = 65.36       2.05
// 26538 / 200 = 132.69     4.16
// 59895 / 300 == 199.45    6.25

// 1528 / 49 = 31.18        
// 6301 / 98 = 64.29        2.06
// 14316 / 147 = 97.38      3.12
// 25621 / 196 = 130.72     4.19
// 39885 / 245 = 162.8      5.22

*/
