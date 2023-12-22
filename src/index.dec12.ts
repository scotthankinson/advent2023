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
        const rawLines = data.split('\n');

        let lines = [];
        for (let line of rawLines) {
            // Less aggresive simplification
            let trimmedLine = '';
            // filter consecutive '.' which do nothing
            for (let i = 0; i < line.length; i++) {
                if (trimmedLine.endsWith('.') && line[i] === '.') {
                    continue;
                } else {
                    trimmedLine += line[i];
                }
            }
            lines.push(trimmedLine);
        }

        let total = 0;
        let idx = 0;
        for (let line of lines) {
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

// StackOverflow algorithm for n choose k which doesn't blow up the heap
// https://stackoverflow.com/questions/45813439/itertools-combinations-in-javascript
function* range(start: number, end: number) {
    for (; start <= end; ++start) { yield start; }
}

function last<T>(arr: T[]) { return arr[arr.length - 1]; }

function* numericCombinations(n: number, r: number, loc: number[] = []): IterableIterator<number[]> {
    const idx = loc.length;
    if (idx === r) {
        yield loc;
        return;
    }
    for (let next of range(idx ? last(loc) + 1 : 0, n - r + idx)) { yield* numericCombinations(n, r, loc.concat(next)); }
}


function* combinations<T>(arr: T[], r: number) {
    for (let idxs of numericCombinations(arr.length, r)) { yield idxs.map(i => arr[i]); }
}


const calculatePossibilities = (line) => {
    // console.log("Working " + line);
    let validMoves = 0;
    let damagedRecord = line.split(' ')[0];
    let damagedRecordCopy = (' ' + damagedRecord).slice(1);
    while (damagedRecordCopy.indexOf("?") > -1) damagedRecordCopy = damagedRecordCopy.replace("?", ".");
    let validateRecord = line.split(' ')[1].split(',').map(o => parseInt(o));
    let fillSpots = [];
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '?') fillSpots.push(i);
    }
    let totalPounds = 0;
    validateRecord.forEach(o => totalPounds += o);
    let poundsToFill = totalPounds - (damagedRecord.split('#').length - 1);
    // console.log("Calculating n choose k for " + fillSpots.length + ":" + poundsToFill);
    let idx = 0;
    for (let option of combinations(fillSpots, poundsToFill)){
        // console.log(option);
        let copy: string = (' ' + damagedRecordCopy).slice(1);
        for (let i = 0; i < option.length; i++) {
            copy = copy.slice(0, option[i]) + '#' + copy.slice(option[i] + 1);
        }
        let checkRecord = JSON.stringify(copy.split('.').filter(o => o.length > 0).map(o => o.length));
        if (checkRecord === JSON.stringify(validateRecord)) {
            // console.log(copy);
            // console.log(checkRecord);
            // console.log(validateRecord);
            validMoves += 1;
            // if (validMoves % 1000 === 0) console.log(validMoves + " valid moves after " + idx + " attempts");
        }
        // if (idx % 1000000 === 0) console.log("idx: " + idx);
        idx += 1;
    };

    return validMoves;
}

const calculatePossibilitiesFromDots = (line) => {
    console.log("Working " + line);
    let validMoves = 0;
    let damagedRecord = line.split(' ')[0];
    let validateRecord = line.split(' ')[1].split(',').map(o => parseInt(o));
    
    let fillSpots = [];
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '?') fillSpots.push(i);
    }

    let exampleInput : string = validateRecord.map(o => ''.padEnd(o, '#') + '.').join('');
    exampleInput = exampleInput.substring(0, exampleInput.length - 1);
    let currentDots = damagedRecord.split('').filter(o => o === '.').length;
    let currentPounds = damagedRecord.split('').filter(o => o === '#').length; 
    let targetPounds = exampleInput.split('').filter(o => o === '#').length;
    let targetDots = damagedRecord.length - targetPounds;
    let missingPounds = targetPounds - currentPounds;
    let missingDots = targetDots - currentDots;
    // console.log({missingDots, missingPounds});
    let fillToken = "#";
    let fillAmount = missingPounds;
    let defaultToken = ".";
    if (missingDots < missingPounds) {
        fillToken = ".";
        fillAmount = missingDots;
        defaultToken = "#";
    }
    
    console.log("Calculating n choose k for " + fillSpots.length + ":" + fillAmount);
    let fixedPoints = []; // calculate the points that are the same in every solution
    for (let option of combinations(fillSpots, fillAmount)){
        // console.log(option);
        let copy: string = (' ' + damagedRecord).slice(1);
        while(copy.indexOf("?") > -1) copy = copy.replace("?", defaultToken);
        for (let i = 0; i < option.length; i++) {
            copy = copy.slice(0, option[i]) + fillToken + copy.slice(option[i] + 1);
        }
        

        let checkRecord = JSON.stringify(copy.split('.').filter(o => o.length > 0).map(o => o.length));
        if (checkRecord === JSON.stringify(validateRecord)) {
            validMoves += 1;
            if (fixedPoints.length === 0) {
                fixedPoints = copy.split('');
                for(let i = 0; i < fixedPoints.length; i++){
                    if (fixedPoints[i] === damagedRecord[i]) fixedPoints[i] = "";
                }
            } else {
                let local = copy.split('');
                for(let i = 0; i < fixedPoints.length; i++){
                    if (fixedPoints[i] !== local[i]) fixedPoints[i] = "";
                }
            }
        }
    };
    return { validMoves, fixedPoints} ;
}


// 16384 arrangements of 1,1,3,1,1,3,1,1,3,1,1,3,1,1,3
// .??..??...?##.?.??..??...?##.?.??..??...?##.?.??..??...?##.?.??..??...?##.
// .??..??...###.?.??..??...###.?.??..??...###.?.??..??...###.?.??..??...###. --> fixed 
//   4choose2      5choose2      5choose2         5choose2      5choose2            --> smaller problem space
//      6            10             10             10            10                 --> combinations  --> 
//      4            8              8               8             8                 --> valid choices  --> 16384


// 506250 arrangements of 3,2,1,3,2,1,3,2,1,3,2,1,3,2,1
// ?###??????????###??????????###??????????###??????????###????????
// .###.???????? .###.????????.###. ???????? .###.???????? .###.???????
//          15          15          15             15           10  --> 506250

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
        for (let line of rawLines) {
            // Less aggresive simplification
            let trimmedLine = '';
            // filter consecutive '.' which do nothing
            for (let i = 0; i < line.length; i++) {
                if (trimmedLine.endsWith('.') && line[i] === '.') {
                    continue;
                } else {
                    trimmedLine += line[i];
                }
            }
            lines.push(trimmedLine);
        }

        let total = 0;
        for (let i = 0; i < lines.length; i++) {
            let copy: string = (' ' + lines[i]).slice(1);
            let bigLine = getBigLine(copy);
            let fixer = calculatePossibilitiesFromDots(copy).fixedPoints;
            for(let z = 1; z < copy.length * 2 + 1; z++){
                let updateCheck = calculatePossibilitiesFromDots(bigLine.split(' ')[0].substring(0,copy.length + z) + ' ' + copy.split(' ')[1]);
                if (updateCheck.validMoves === 0) break;
                for(let y = 0; y < fixer.length; y++){
                    if (fixer[y] !== updateCheck.fixedPoints[y]) fixer[y] = "";
                }
            }
            console.log(fixer);
            for(let j = 0; j < fixer.length; j++) {
                if (fixer[j].length > 0 && fixer[j] === fixer[j]) {
                    copy = copy.slice(0, j) + fixer[j] + copy.slice(j + 1);
                }
            }
            console.log("Started: " + lines[i]);
            console.log("Fixed: " + copy);
            bigLine = getBigLine(copy);
            console.log(bigLine);
            
            // Last is still 25,140,840,660 combinations (39 choose 15)
            let oneLineResult = calculatePossibilitiesFromDots(bigLine).validMoves;
            console.log(oneLineResult);
            total += oneLineResult;
        }

        // 23,335,508,537,374 is too low
        // 24,033,270,270,083 is too low (default strategy)
        // 24,033,270,270,083
        // 30,338,035,833,503 is too low

        // 86,845,757,175,551 --> Incorrect (added the #. instead of #? check)
        // 86,845,757,175,982 is too high
        // console.log(JSON.stringify(results));
        return total;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const getBigLine = (line) => {
    let damagedRecord = line.split(' ')[0];
    let validateRecord = line.split(' ')[1];
    damagedRecord =  damagedRecord + "?" + damagedRecord + "?" + damagedRecord + "?" + damagedRecord + "?" + damagedRecord;
    validateRecord = validateRecord + ',' + validateRecord + ',' + validateRecord + ',' + validateRecord + ',' + validateRecord
    // console.log(damagedRecord + ' ' + validateRecord);
    return damagedRecord + ' ' + validateRecord;
}

start();


export default start;