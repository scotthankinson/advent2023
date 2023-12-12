"use strict";
import * as fs from 'fs';

const start = (): void => {
    console.log(solve_pt1());
    console.log(solve_pt2());
};



const solve_pt1 = () => {
    if (1 === 1) return 0;
    try {
        let data = fs.readFileSync('src/input.dec11.txt', 'utf8');
        const lines = data.split('\n');
        let emptyRows = [];
        let emptyCols = [];
        for(let i = 0; i < lines.length; i++) {
            if (lines[i].split('').filter(o => o === '#').length === 0) emptyRows.unshift(i);
        }
        for(let i = 0; i < lines[0].length; i++){
            let col = [];
            for(let j = 0; j < lines.length; j++){
                col.push(lines[j][i]);
            }
            if (col.filter(o => o === '#').length === 0) emptyCols.unshift(i);
        }
        let blankLine = lines[emptyRows[0]];
        console.log(emptyRows);
        console.log(emptyCols);
        for(let i = 0; i < emptyRows.length; i++){
            lines.splice(emptyRows[i], 0, blankLine);
        }
        for(let i = 0; i < emptyCols.length; i++){
            for(let j = 0; j < lines.length; j++) { 
                lines[j] = lines[j].slice(0,emptyCols[i]) + '.' + lines[j].slice(emptyCols[i]);
            }
        }

        let map = {};
        let count = 1;
        for(let y = 0; y < lines.length; y++){
            for(let x= 0; x < lines[0].length; x++){
                if (lines[y][x] === '#'){
                    map[x + ',' + y] = count;
                    count += 1;
                }
            }
        }
        let distances = [];
        let total = 0;
        for(let key of Object.keys(map)) {
            for(let pair of Object.keys(map)){
                if (key === pair) continue;
                let keyX = parseInt(key.split(',')[0]);
                let keyY = parseInt(key.split(',')[1]);
                let pairX = parseInt(pair.split(',')[0]);
                let pairY = parseInt(pair.split(',')[1]);
                let distance = Math.abs(keyX - pairX) + Math.abs(keyY - pairY);
                distances.push(distance);
                total += distance;
            }
        }
        for(let i = 0; i < lines.length; i++){
            console.log(lines[i]);
        }
        
        return total / 2;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.dec11.txt', 'utf8');
        const lines = data.split('\n');
        let emptyRows = [];
        let emptyCols = [];
        for(let i = 0; i < lines.length; i++) {
            if (lines[i].split('').filter(o => o === '#').length === 0) emptyRows.push(i);
        }
        for(let i = 0; i < lines[0].length; i++){
            let col = [];
            for(let j = 0; j < lines.length; j++){
                col.push(lines[j][i]);
            }
            if (col.filter(o => o === '#').length === 0) emptyCols.push(i);
        }

        let map = {};
        let count = 1;
        for(let y = 0; y < lines.length; y++){
            for(let x= 0; x < lines[0].length; x++){
                if (lines[y][x] === '#'){
                    map[x + ',' + y] = count;
                    count += 1;
                }
            }
        }

        console.log(emptyRows);
        console.log(emptyCols);
        console.log(map);
        let expansion = 999999; // 1 to 10 is +9
        let  expandedMap = {};
        for(let key of Object.keys(map)){
            let keyX = parseInt(key.split(',')[0]);
            let newX = keyX;
            for(let i = 0; i < emptyCols.length; i++){
                // console.log("Key: " + keyX + ", Col: " + emptyCols[i]);
                if (keyX < emptyCols[i]) continue;
                else newX += expansion;
            }
            let keyY = parseInt(key.split(',')[1]);
            let newY = keyY;
            for(let i = 0; i < emptyRows.length; i++){
                // console.log("Key: " + keyY + ", Row: " + emptyRows[i]);
                if (keyY < emptyRows[i]) continue;
                else newY += expansion;
            }
            expandedMap[newX + ',' + newY] = map[key];   
        }
        console.log(expandedMap);
        let distances = [];
        let total = 0;
        for(let key of Object.keys(expandedMap)) {
            for(let pair of Object.keys(expandedMap)){
                if (key === pair) continue;
                let keyX = parseInt(key.split(',')[0]);
                let keyY = parseInt(key.split(',')[1]);
                let pairX = parseInt(pair.split(',')[0]);
                let pairY = parseInt(pair.split(',')[1]);
                let distance = Math.abs(keyX - pairX) + Math.abs(keyY - pairY);
                distances.push(distance);
                total += distance;
            }
        }
        // expected 1030 got 1030
        // expected 8410 got 8410
        // 82000210 is too low ---- duh that was the sample problem
        
        return total / 2;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();


export default start;