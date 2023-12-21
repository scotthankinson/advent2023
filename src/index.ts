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
        for(let y = 0; y < lines.length; y++){
            for(let x= 0; x < lines[0].length; x++) {
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
        for(let i = 0; i < 64; i++) {
            let steps = Array.from(positions.values());
            console.log(steps);
            positions.clear();
            console.log("Calculating movement for " + steps.length + " destination(s)");
            for(let step of steps) {
                // console.log(step);
                let x = parseInt(step.split(',')[0]);
                let y = parseInt(step.split(',')[1]);
                // north
                if (y > 0 && map[x + ',' + (y - 1)] === '.'){
                    positions.add(x + ',' + (y-1));
                }
                // east
                if (x < lines[0].length && map[(x + 1) + ',' + y] === '.'){
                    positions.add((x + 1) + ',' + y);
                }
                // south
                if (y < lines.length && map[x + ',' + (y + 1)] === '.'){
                    positions.add(x + ',' + (y+1));
                }
                // west
                if (x > 0 && map[(x - 1) + ',' + y] === '.'){
                    positions.add((x - 1) + ',' + y);
                }
            }
            draw(map, positions, lines[0].length, lines.length);
        }
        
        return positions.size;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const draw = (map, positions, maxX, maxY) => {
    console.log("--------------------");
    for(let y = 0; y < maxY; y++) {
        let line = "";
        for(let x = 0; x < maxX; x++) {
            if (map[x + ',' + y] !== '.') {
                line += map[x + ',' + y];
            } else if (positions.has(x + ',' + y)) {
                line += 'O';
            } else {
                line += '.';
            }
        }
        console.log(line);
    }
}
const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.dec21.txt', 'utf8');
        const lines = data.split('\n');
        let map = {};
        let positions = new Set<string>();
        for(let y = 0; y < lines.length; y++){
            for(let x= 0; x < lines[0].length; x++) {
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
        for(let i = 0; i < 10; i++) {
            let steps = Array.from(positions.values());
            // console.log(steps);
            positions.clear();
            console.log("Calculating movement for " + steps.length + " destination(s)");
            for(let step of steps) {
                // console.log(step);
                let x = parseInt(step.split(',')[0]);
                let y = parseInt(step.split(',')[1]);
                // ((this%n)+n)%n;
                let normalizedX = x % lines[0].length;
                if ( normalizedX < 0) normalizedX += lines[0].length;
                let normalizedY = y % lines.length;
                if ( normalizedY < 0) normalizedX += lines.length;
                console.log("Evaluating " + x + ',' + y + " as " + normalizedX + ',' + normalizedY);
                // north
                let northY = (y - 1) % lines.length > 0 ? (y - 1) % lines.length : ((y - 1) % lines.length ) + lines.length;
                if (map[normalizedX + ',' + northY] === '.'){
                    console.log('North: ' + normalizedX + ',' + northY);
                    positions.add(x + ',' + (y-1));
                }
                // east
                let eastX = (x + 1) % lines[0].length > 0 ? (x + 1) % lines[0].length : ((x + 1) % lines[0].length ) + lines[0].length;
                if (map[eastX + ',' + normalizedY] === '.'){
                    console.log('East: ' + eastX + ',' + normalizedY);
                    positions.add((x + 1) + ',' + y);
                }
                // south
                let southY = (y + 1) % lines.length > 0 ? (y + 1) % lines.length : ((y + 1) % lines.length ) + lines.length;
                if (map[normalizedX + ',' + southY] === '.'){
                    console.log('South: ' + normalizedX + ',' + southY);
                    positions.add(x + ',' + (y+1));
                }
                // west
                let westX = (x - 1) % lines[0].length > 0 ? (x - 1) % lines[0].length : ((x - 1) % lines[0].length ) + lines[0].length;
                if (map[westX + ',' + normalizedY] === '.'){
                    console.log('West: ' + westX + ',' + normalizedY);
                    positions.add((x - 1) + ',' + y);
                }
            }
            // draw(map, positions, lines[0].length, lines.length);
        }
        
        console.log(positions);
        return positions.size;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();


export default start;