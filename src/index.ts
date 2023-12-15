"use strict";
import * as fs from 'fs';

const start = (): void => {
    console.log(solve_pt1());
    console.log(solve_pt2());
};



const solve_pt1 = () => {
    if (1 === 1) return 0;
    try {
        let data = fs.readFileSync('src/input.dec12.txt', 'utf8');
        const lines = data.split('\n');
        let total = 0;
        let idx = 0;
        for(let line of lines) {
            let localTotal = calculatePossibilities(line);
            // console.log(idx + ":" + line + "     " + localTotal);
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
    // console.log(damagedRecord + ' ' + validateRecord);
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
        if (checkRecord === JSON.stringify(validateRecord)) {
            // console.log(option);
            validMoves += 1;
        }
        // console.log("Option: " + option + ", " + copy);
    }

    return validMoves;
}
// 16 arrangements of 3,2,1,3,2,1,3,2,1,3,2,1,3,2,1
// ????.#...#...?????.#...#...?????.#...#...?????.#...#...?????.#...#...
// ####.#...#...?????.#...#...?????.#...#...?????.#...#...?????.#...#... --> fixed
//                2             2            2              2            --> 2^4 = 16


// 16384 arrangements of 1,1,3,1,1,3,1,1,3,1,1,3,1,1,3
// .??..??...?##.?.??..??...?##.?.??..??...?##.?.??..??...?##.?.??..??...?##.
// .??..??...###.?.??..??...###.?.??..??...###.?.??..??...###.?.??..??...###. --> fixed 
//   4choose2      5choose2      5choose2         5choose2      5choose2            --> smaller problem space
//      6            10             10             10            10                 --> combinations  --> 
//      4            8              8               8             8                 --> valid choices  --> 16384


// 506250 arrangements of 3,2,1,3,2,1,3,2,1,3,2,1,3,2,1
// ?###??????????###??????????###??????????###??????????###????????
// .###.????????.###.????????.###.????????.###.????????.###.???????
//          21          21          21             21           10  --> 1,944,810 (off by 4x)

// 2500 arrangements    1,6,5,1,6,5,1,6,5,1,6,5,1,6,5
// ????.######..#####. ?????.######..#####. ?????.######..#####. ?????.######..#####. ?????.######..#####.
//        4                       5                   5                   5                   5                   --> valid choices --> 2500

// To solve:  break into solvable chunks and multiply together

/*
pt1 -> pt2
???.### 1,1,3 - 1 arrangement to 1 arrangement
.??..??...?##. 1,1,3 - 4 arrangements to 16384 arrangements
?#?#?#?#?#?#?#? 1,3,1,6 - 1 arrangement to 1 arrangement
????.#...#... 4,1,1 - 1 arrangement to 16 arrangements
????.######..#####. 1,6,5 - 4 arrangements to 2500 arrangements
?###???????? 3,2,1 - 10 arrangements to 506250 arrangements

*/

const solve_pt2 = () => {
    // if (1 === 1) return 0;
    try {
        let data = fs.readFileSync('src/input.dec12.txt', 'utf8');
        const rawLines = data.split('\n');

        let lines = [];
        for(let line of rawLines){
            lines.push(simplify(line));
        }
        
        let cacheData = fs.readFileSync('src/input.dec12_3.txt', 'utf8');
        const cacheLines = cacheData.split('\n');
        let cache = {};
        for (let i = 0; i < cacheLines.length; i++) {
            // console.log(cacheLines[i]);
            let parts = cacheLines[i].split('|');
            // console.log(parts);
            if (parts.length > 1) {
                if (parts[1] !== 'NOPE') { 
                    cache[parts[0]] = {'result': parseInt(parts[1])};
                } else {
                    cache[parts[0]] = {'result': 'NOPE', parts: []};
                    while(true){
                        i = i + 1;
                        if (cacheLines[i].trim().length === 0) break;
                        cache[parts[0]].parts.push(cacheLines[i]);
                    }
                } 
            }
        }
        
        let bigLines = [];
        for(let i = 0; i < lines.length; i++){
            const bigLine = getBigLine(rawLines[i]);
            console.log(bigLine);
            
            if (cache[bigLine] && cache[bigLine].result !== 'NOPE') {
                console.log("Cache Hit: " + cache[bigLine].result);
                continue;
            } else if (cache[bigLine] && cache[bigLine].parts) {
                // console.log(cache[bigLine].parts);
                let total = 0;
                for(let line of cache[bigLine].parts) {
                    let localTotal = calculatePossibilities(line);
                    // console.log(localTotal);
                    if (total === 0) total = localTotal;
                    else total = total * localTotal;
                }
                console.log("Cache Calc: " + total);

                let defaultCalc = [];
                total = 0;
                defaultCalc.push(rawLines[i].split(' ')[0] + '? ' + rawLines[i].split(' ')[1]);
                defaultCalc.push(rawLines[i].split(' ')[0] + '? ' + rawLines[i].split(' ')[1]);
                defaultCalc.push(rawLines[i].split(' ')[0] + '? ' + rawLines[i].split(' ')[1]);
                defaultCalc.push(rawLines[i].split(' ')[0] + '? ' + rawLines[i].split(' ')[1]);
                defaultCalc.push(rawLines[i]);
                for(let line of defaultCalc) {
                    let localTotal = calculatePossibilities(line);
                    // console.log(localTotal);
                    if (total === 0) total = localTotal;
                    else total = total * localTotal;
                }
                console.log("Default Calc: " + total);
                continue;
            }

            try {
                console.log(calculatePossibilities(bigLine));
            } catch (err) {
                console.log("Nope!");
            }
            
            bigLines.push(getBigLine(rawLines[i]));
        }
        // console.log(bigLines);
        if (1 === 1) return 0;
        let results = [];
        let total = 0;
        let idx = 0;
        for(let line of bigLines) {
            if (line.trim().length === 0) {
                results.push(total);
                console.log(idx + ": " + total);
                total = 0;
                idx += 1;
                continue;
            }
            let localTotal = calculatePossibilities(line);
            // console.log(localTotal);
            if (total === 0) total = localTotal;
            else total = total * localTotal;
        }
        // 23,335,508,537,374 is too low  --> Odd/Even before/after splits
        // 30,338,035,833,503 is too low
        // 86,845,757,175,982 is too high
        console.log(results);
        let finalResult = 0;
        results.forEach(o => finalResult += o);
        return finalResult;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

let simplify = (line) => {
    let damagedRecord = line.split(' ')[0];
    let validateRecord = line.split(' ')[1].split(',').map(o => parseInt(o));
    
    // Trim off any .'s
    while(damagedRecord[0] === '.') damagedRecord = damagedRecord.slice(1);
    while(damagedRecord.endsWith('.')) damagedRecord = damagedRecord.slice(0, -1);

    // Collapse any fixed #'s
    while(damagedRecord[0] === '#') {
        damagedRecord = damagedRecord.slice(1);
        validateRecord[0] = validateRecord[0] - 1;
        if (validateRecord[0] === 0) {
            validateRecord = validateRecord.slice(1);
            break;
        }
    }

    while(damagedRecord.endsWith('#')) {
        damagedRecord = damagedRecord.slice(0, -1);
        validateRecord[validateRecord.length - 1] = validateRecord[validateRecord.length -1 ] - 1;
        if (validateRecord[validateRecord.length - 1] === 0){
            validateRecord = validateRecord.slice(0, -1);
            break;
        }
    }

    let rebuilt = damagedRecord + " " + validateRecord.join(',');
    if (rebuilt.length < line.length) return simplify(rebuilt);
    else return rebuilt;
}

start();


export default start;