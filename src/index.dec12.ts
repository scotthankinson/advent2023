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

// StackOverflow algorithm for n choose k
// https://stackoverflow.com/questions/64414816/can-you-return-n-choose-k-combinations-in-javascript-using-array-flatmap
const choose = (arr, k, prefix = []) => {
    if (k == 0) return [prefix];
    return arr.flatMap((v, i) =>
        choose(arr.slice(i + 1), k - 1, [...prefix, v])
    );
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
    let damagedRecordBase = (' ' + damagedRecord).slice(1);
    while (damagedRecordBase.indexOf("?") > -1) damagedRecordBase = damagedRecordBase.replace("?", ".");
    let validateRecord = line.split(' ')[1].split(',').map(o => parseInt(o));
    let fillSpots = [];
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '?') fillSpots.push(i);
    }
    // i = 0 to fillSpots.length fills WAAAAAY more scenarios than we actually use
    let totalPounds = 0;
    validateRecord.forEach(o => totalPounds += o);
    let poundsToFill = totalPounds - (damagedRecord.split('#').length - 1);
    console.log("Calculating n choose k for " + fillSpots.length + ":" + poundsToFill);
    //let candidates = choose(fillSpots, poundsToFill);
    //console.log(candidates.length + " possibilities");
    // console.log("Working " + poundsToFill + " of " + fillSpots.length + ", " + candidates.length + " candidates to check");
    //candidates.forEach((option) => {
    // let idx = 0;
    for (let option of combinations(fillSpots, poundsToFill)){
        // console.log(option);
        let copy: string = (' ' + damagedRecordBase).slice(1);
        for (let i = 0; i < option.length; i++) {
            copy = copy.slice(0, option[i]) + '#' + copy.slice(option[i] + 1);
        }
        let checkRecord = JSON.stringify(copy.split('.').filter(o => o.length > 0).map(o => o.length));
        if (checkRecord === JSON.stringify(validateRecord)) {
            // console.log(copy);
            // console.log(checkRecord);
            // console.log(validateRecord);
            validMoves += 1;
            if (validMoves % 1000 === 0) console.log(validMoves);
        }
        // if (idx % 1000000 === 0) console.log("idx: " + idx);
        // idx += 1;
    };

    return validMoves;
}

// REAL PUZZLE TIME!
// 5: 4 * 17.25 * 17.25 * 17.25 * 17.25 = 354173.765625
// [ 4, 69 ]
// 

// ??.?????.????.?????.????.?????.????.?????.????.?????.? 3,1,3,1,3,1,3,1,3,1
// ...?????.????. ?????.????. ?????.????. ?????.????. ?????.?
//       13           13          13          13       4            = 114,244
// ??.?????.? 3,1
//      4    
// ??.?????.????.?????.? 3,1,3,1
//           69
// ??.?????.????.?????.????.?????.? 3,1,3,1,3,1
//          ?

// 16 arrangements of 3,2,1,3,2,1,3,2,1,3,2,1,3,2,1
// ????.#...#...?????.#...#...?????.#...#...?????.#...#...?????.#...#...
// ####.#...#...?????.#...#...?????.#...#...?????.#...#...?????.#...#... --> fixed
//     1           2             2            2              2            --> 2^4 = 16


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
    /// if (1 === 1) return 0;
    try {
        let data = fs.readFileSync('src/input.dec12_2.txt', 'utf8');
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

        let results = [];
        let artificalTotal = 0;
        let skips = 0;
        for (let i = 0; i < lines.length; i++) {
            // Pick up where we left off
            if ((i + 1) < 365) continue;
            if (lines[i].indexOf('|') > -1) {
                let parts = lines[i].split('|');
                console.log((i+1) + ": CACHE HIT: " + parts[0]);
                artificalTotal += parseInt(parts[0]);
                results.push([parseInt(parts[1]), parseInt(parts[2])])
                continue;
            }
            skips += 1;
            // if (1 === 1) continue;
            let bigLine = getBigLine(lines[i]);
            console.log(bigLine);
            // Eureka!  test two segments -- the first result is part 1, the multiplier will be the same for parts 2-5
            // Womp womp, fails for some of the inputs with a decimal result (line 2 - line = 17, line?line = 633)
            // console.log(lines[i].split(' ')[0].length);
            let double = lines[i].split(' ')[0] + "?" + lines[i].split(' ')[0] + " " + lines[i].split(' ')[1] + "," + lines[i].split(' ')[1];
            // console.log(double.split(' ')[0].length);

            let oneCopy = calculatePossibilities(lines[i]);
            let twoCopies = calculatePossibilities(double);
            let multiplier = twoCopies / oneCopy;
            let localResult = oneCopy * multiplier * multiplier * multiplier * multiplier;
            console.log((i + 1) + ": " + oneCopy + " * " + multiplier + " * " + multiplier + " * " + multiplier + " * " + multiplier + " = " + localResult);
            console.log([oneCopy, twoCopies]);
            results.push([oneCopy, twoCopies]);
        }

        //        532,757,996 --> calculated / confirmed with the double tuple method
        // 23,335,508,537,374 is too low
        // 30,338,035,833,503 is too low
        //  2,729,378,470,257 from # 2
        // 86,845,757,175,551 --> Incorrect (added the #. instead of #? check)
        // 86,845,757,175,982 is too high
        // console.log(JSON.stringify(results));
        let finalResult = 0;
        for(let i = 0; i < results.length; i++){
            let multiplier = results[i][1] / results[i][0];
            // console.log(multiplier);
            finalResult = finalResult + (results[i][0]  * multiplier * multiplier * multiplier * multiplier);
        }
        console.log("Final Result: " + finalResult);
        console.log("Cache Result: " + artificalTotal);
        console.log("Missing " + skips);
        return finalResult;
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

start();


export default start;