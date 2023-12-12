"use strict";
import * as fs from 'fs';

const start = (): void => {
    console.log(solve_pt1());
    console.log(solve_pt2());
};



const solve_pt1 = () => {
    if (1 === 1) return 0;
    try {
        let data = fs.readFileSync('src/input.dec10.txt', 'utf8');
        const lines = data.split('\n');
        let map = {'start': ''};
        for(let y = 0; y < lines.length; y++){
            for(let x = 0; x < lines[0].length; x++) {
                if (lines[y][x] === 'S') map.start = x + ',' + y;
                if (lines[y][x] === '.') continue;
                map[x+','+y] = {symbol: lines[y][x], validMoves: [], distance: -1};
                
            }
        }
        for(let key of Object.keys(map)) {
            if (key === 'start') continue;
            canMove(key, map);
        }
        for(let key of Object.keys(map)){
            if (key === 'start') continue;
            if (map[key].symbol !== 'S' && map[key].validMoves.length !== 2)
                delete map[key];
        }
        // canMove(map.start, map);
        let moves = [map.start];
        map[map.start].distance = 0;
        while (moves.length > 0) {
            let next = moves.shift();
            if (map[next].distance > 0) continue;
            map[next].validMoves.forEach(o => moves.push(o));
            if (map[map[next].validMoves[0]].distance >= 0) {
                map[next].distance = map[map[next].validMoves[0]].distance + 1;
            } 
            if (map[map[next].validMoves[1]].distance >= 0) {
                map[next].distance = map[map[next].validMoves[1]].distance + 1;
            }
        }

        console.log(map);
        let greatestDistance = 0;
        for(let key of Object.keys(map)){
            if (map[key].distance > greatestDistance) greatestDistance = map[key].distance;
        }
        
        return greatestDistance;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

let canMove = (currentPos, map) => {
    let x = parseInt(currentPos.split(',')[0]);
    let y = parseInt(currentPos.split(',')[1]);
    let symbol = map[currentPos].symbol;
    // console.log(symbol + ' at ' + currentPos);
    // console.log(map[x + ',' + (y - 1)]);
    if (map[x + ',' + (y - 1)] && ['|', '7', 'F', 'S'].indexOf(map[x + ',' + (y - 1)].symbol) > -1 ) {
        // console.log("Valid step U to " + map[x + ',' + (y - 1)].symbol);
        if (['|', 'L', 'J', 'S'].indexOf(symbol) > -1){
            map[currentPos].validMoves.push(x + ',' + (y - 1));
        }
    } 
    // console.log(map[x + ',' + (y + 1)]);
    if ( map[x + ',' + (y + 1)]  && ['|', 'L', 'J', 'S'].indexOf(map[x + ',' + (y + 1)].symbol) > -1 ) {
        // console.log("Valid step D to " + map[x + ',' + (y + 1)].symbol);
        if (['|', 'F', '7', 'S'].indexOf(symbol) > -1){
            map[currentPos].validMoves.push(x + ',' + (y + 1));
        }

    }
    // console.log(map[(x - 1) + ',' + y]);
    if (map[(x - 1) + ',' + y] && ['-', 'L', 'F', 'S'].indexOf(map[(x - 1) + ',' + y].symbol) > -1 ) {
        // console.log("Valid step L to " + map[(x - 1) + ',' + y].symbol);
        if (['-', '7', 'J', 'S'].indexOf(symbol) > -1){
            map[currentPos].validMoves.push((x - 1) + ',' + y);
        }
    }
    // console.log(map[(x + 1) + ',' + y]);
    if (map[(x + 1) + ',' + y] && ['-', '7', 'J', 'S'].indexOf(map[(x + 1) + ',' + y].symbol) > -1 ) {
        // console.log("Valid step R to " + map[(x + 1) + ',' + y].symbol);
        if (['-', 'L', 'F', 'S'].indexOf(symbol) > -1){
            map[currentPos].validMoves.push((x + 1) + ',' + y);
        }
    }
}

const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.dec10.txt', 'utf8');
        const lines = data.split('\n');
        let map = {'start': ''};
        for(let y = 0; y < lines.length; y++){
            for(let x = 0; x < lines[0].length; x++) {
                if (lines[y][x] === 'S') map.start = x + ',' + y;
                if (lines[y][x] === '.') continue;
                map[x+','+y] = {symbol: lines[y][x], validMoves: [], distance: -1};
                
            }
        }
        for(let key of Object.keys(map)) {
            if (key === 'start') continue;
            canMove(key, map);
        }
        for(let key of Object.keys(map)){
            if (key === 'start') continue;
            if (map[key].symbol !== 'S' && map[key].validMoves.length !== 2)
                delete map[key];
        }
        let moves = [map.start];
        map[map.start].distance = 0;
        while (moves.length > 0) {
            let next = moves.shift();
            if (map[next].distance > 0) continue;
            map[next].validMoves.forEach(o => moves.push(o));
            if (map[map[next].validMoves[0]].distance >= 0) {
                map[next].distance = map[map[next].validMoves[0]].distance + 1;
            } 
            if (map[map[next].validMoves[1]].distance >= 0) {
                map[next].distance = map[map[next].validMoves[1]].distance + 1;
            }
        }
        // Keys that did not get walked by the Pipe convert to '.'
        Object.keys(map).filter(o => map[o].distance <= 0).forEach(o => map[o].symbol = '.');
        
        for(let y = 0; y < lines.length; y++){
            let line = "";
            for(let x = 0; x < lines[0].length; x++) {
                if (map[x + ',' + y]) line += map[x + ',' + y].symbol;
                else line += '.';
            }
            console.log(line);
        }
        console.log();
        


        console.log(map.start);
        console.log(map[map.start]);
        // Manually set S to the appropriate symbol; test inputs are 'F', puzzle input is '7'
        map[map.start].symbol = '-';
        let encloseMap = {};
        for(let y = 0; y < lines.length; y++){
            for(let x = 0; x < lines[0].length; x++) {
                if (map[x + ',' + y]) encloseMap[x + ',' + y] = map[x + ',' + y].symbol; // loop
                else encloseMap[x + ',' + y] = ".";
            }
        }

        
        // Horizontal scan flips on |, 7, F, L, J; | is a cross but 7F are +.5 and LJ are -.5
        for(let y = 0; y < lines.length; y++) {
            let pipeStack = [];
            for(let x = 0; x < lines[0].length; x++) {
                if (['-', '7', 'F', 'L', 'J', '|'].indexOf(encloseMap[x + ',' + y]) > -1) {
                    if (encloseMap[x + ',' + y] === '-') continue;
                    if (encloseMap[x + ',' + y] === '|') pipeStack.unshift('|');
                    if (encloseMap[x + ',' + y] === '7' && pipeStack[pipeStack.length - 1] === 'F') {
                        pipeStack.pop();
                    } else if (encloseMap[x + ',' + y] === '7' && pipeStack[pipeStack.length - 1] === 'L') {
                        pipeStack.pop();
                        pipeStack.unshift('|');
                    } else if (encloseMap[x + ',' + y] === 'J' && pipeStack[pipeStack.length - 1] === 'F') {
                        pipeStack.pop();
                        pipeStack.unshift('|');
                    } else if (encloseMap[x + ',' + y] === 'J' && pipeStack[pipeStack.length - 1] === 'L') {
                        pipeStack.pop();
                    } else if (encloseMap[x + ',' + y] === 'L') pipeStack.push('L');
                    else if (encloseMap[x + ',' + y] === 'F') pipeStack.push('F');
                } else {
                    encloseMap[x + ',' + y] = pipeStack.length % 2 === 0 ? 'O' : 'I';
                }
            }
        }

        let total = 0;
        for(let y = 0; y < lines.length; y++){
            let line = "";
            for(let x = 0; x < lines[0].length; x++) {
                line += encloseMap[x + ',' + y];
                if (encloseMap[x + ',' + y] === 'I') total += 1;
            }
            console.log(line);
        }
        console.log();
        // 2223 too high
        // 2231 too high
        
        return total;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();


export default start;