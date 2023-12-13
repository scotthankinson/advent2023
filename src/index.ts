"use strict";
import * as fs from 'fs';

const start = (): void => {
    console.log(solve_pt1());
    console.log(solve_pt2());
};



const solve_pt1 = () => {
    try {
        let data = fs.readFileSync('src/input.dec12.txt', 'utf8');
        const lines = data.split('\n');
        let total = 0;
        let idx = 0;
        for(let line of lines) {
            let localTotal = calculatePossibilities(line);
            console.log(idx + ":" + line + "     " + localTotal);
            total += localTotal;
            idx += 1;
        }

        return total;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const getBigLine = (line) => {
    let damagedRecord = line.split(' ')[0];
    let validateRecord = line.split(' ')[1];
    damagedRecord =  damagedRecord + '?' + damagedRecord + '?' + damagedRecord + "?" + damagedRecord + "?" + damagedRecord;
    validateRecord = validateRecord + ',' + validateRecord + ',' + validateRecord + ',' + validateRecord + ',' + validateRecord
    console.log(damagedRecord + ' ' + validateRecord);
    return damagedRecord + ' ' + validateRecord;
}

// StackOverflow algorithm for k choose n 
// https://stackoverflow.com/questions/64414816/can-you-return-n-choose-k-combinations-in-javascript-using-array-flatmap
const choose = (arr, k, prefix=[]) => {
    if (k == 0) return [prefix];
    return arr.flatMap((v, i) =>
        choose(arr.slice(i+1), k-1, [...prefix, v])
    );
}

const calculatePossibilities = (line) => {
    let validMoves = 0;
    let damagedRecord = line.split(' ')[0];
    let validateRecord = line.split(' ')[1].split(',').map(o => parseInt(o));
    let fillSpots = [];
    for(let i = 0; i < line.length; i++){
        if (line[i] === '?') fillSpots.push(i);
    }
    
    let options = [];
    for(let i = 0; i <= fillSpots.length; i++) {
        choose(fillSpots, i).forEach(o => options.push(o));
    }
    // console.log(fillSpots);
    // console.log(options);
    
    // console.log(damagedRecord);
    for(let option of options) {
        let copy : string = (' ' + damagedRecord).slice(1);
        while(copy.indexOf("?") > -1) copy = copy.replace("?", ".");
        for(let i = 0; i < option.length; i++){
            copy = copy.slice(0, option[i]) + '#' + copy.slice(option[i] + 1);
        }
        let checkRecord = JSON.stringify(copy.split('.').filter(o => o.length > 0).map(o => o.length));
        // console.log(checkRecord);
        if (checkRecord === JSON.stringify(validateRecord)){
            validMoves += 1;
        }
        // console.log("Option: " + option + ", " + copy);
    }

    return validMoves;
}

const solve_pt2 = () => {
    if (1 === 1) return 0;
    try {
        let data = fs.readFileSync('src/input.dec12.txt', 'utf8');
        const lines = data.split('\n');
        let total = 0;
        let idx = 0;
        for(let line of lines) {
            let localTotal = calculatePossibilities(getBigLine(line));
            console.log(idx + ":" + line + "     " + localTotal);
            total += localTotal;
            idx += 1;
        }

        return total;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();


export default start;