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

        let bigLines = [];
        for(let i = 0; i < lines.length; i++){
            console.log(getBigLine(lines[i]));
            if (lines[i].split(' ')[0].split('').filter(o => o !== '?').length === 0) {
                // TODO: the first entry (??? 1,1) breaks completely, but the 4th and 5th are all ??? and don't break
                bigLines.push(lines[i].split(' ')[0] + '? ' + lines[i].split(' ')[1]);
                bigLines.push(lines[i].split(' ')[0] + '? ' + lines[i].split(' ')[1]);
                bigLines.push(lines[i].split(' ')[0] + '? ' + lines[i].split(' ')[1]);
                bigLines.push(lines[i].split(' ')[0] + '? ' + lines[i].split(' ')[1]);
                bigLines.push(lines[i]);
                bigLines.push('');
            } else {
                bigLines.push(lines[i].split(' ')[0] + '? ' + lines[i].split(' ')[1]);
                bigLines.push(lines[i].split(' ')[0] + '? ' + lines[i].split(' ')[1]);
                bigLines.push(lines[i].split(' ')[0] + '? ' + lines[i].split(' ')[1]);
                bigLines.push(lines[i].split(' ')[0] + '? ' + lines[i].split(' ')[1]);
                bigLines.push(lines[i]);
                bigLines.push('');
            } 
        }
        console.log(bigLines);
        let results = [];
        let total = 0;
        for(let line of bigLines) {
            if (line.trim().length === 0) {
                results.push(total);
                console.log(total);
                total = 0;
                continue;
            }
            let localTotal = calculatePossibilities(line);
            // console.log(localTotal);
            if (total === 0) total = localTotal;
            else total = total * localTotal;
        }
        console.log(results);
        /*
        // if (1 === 1) return;
        let bigLinesAfter = [];
        let bigLinesBefore = [];
        for(let i = 0; i < lines.length; i++) {
            console.log(getBigLine(lines[i]));
            bigLinesAfter.push(lines[i].split(' ')[0] + '? ' + lines[i].split(' ')[1]);
            bigLinesAfter.push(lines[i].split(' ')[0] + '? ' + lines[i].split(' ')[1]);
            bigLinesAfter.push(lines[i].split(' ')[0] + '? ' + lines[i].split(' ')[1]);
            bigLinesAfter.push(lines[i].split(' ')[0] + '? ' + lines[i].split(' ')[1]);
            bigLinesAfter.push(lines[i]);
            bigLinesAfter.push('');

            bigLinesBefore.push(lines[i]);
            bigLinesBefore.push('?' + lines[i]);
            bigLinesBefore.push('?' + lines[i]);
            bigLinesBefore.push('?' + lines[i]);
            bigLinesBefore.push('?' + lines[i]);
            bigLinesBefore.push('');
        }

        // console.log(bigLinesAfter);
        // console.log(bigLinesBefore);

        let afterResults = [];
        let afterTotal = 0;
        for(let line of bigLinesAfter) {
            if (line.trim().length === 0) {
                afterResults.push(afterTotal);
                afterTotal = 0;
                continue;
            }
            let localTotal = calculatePossibilities(line);
            // console.log(localTotal);
            if (afterTotal === 0) afterTotal = localTotal;
            else afterTotal = afterTotal * localTotal;
        }

        let beforeResults = [];
        let beforeTotal = 0;
        for(let line of bigLinesBefore) {
            if (line.trim().length === 0) {
                beforeResults.push(beforeTotal);
                beforeTotal = 0;
                continue;
            }
            let localTotal = calculatePossibilities(line);
            console.log(localTotal);
            if (beforeTotal === 0) beforeTotal = localTotal;
            else beforeTotal = beforeTotal * localTotal;
        }

        console.log(bigLinesAfter);
        console.log(afterResults);
        console.log("--------------");
        console.log(bigLinesBefore);
        console.log(beforeResults);
        // Correct Test Values present as After, Before, Both, Before, Before, After
        //                                Min, Max, Both, Max, Max, Min
        let darts = [];
        for(let i = 0; i < afterResults.length; i++) {
            let checker = lines[i].split(' ')[0].split('');
            let left = 0;
            let right = 0;
            for(let j = 0; j < checker.length; j++){
                if (checker[j] === '#' && j < checker.length/2) left += 1;
                else if (checker[j] === '#' && j > checker.length / 2) right += 1; 
            }
            if (left > right) darts.push(afterResults[i])
            else darts.push(beforeResults[i]);
        }
        console.log(darts);
        */
        return 0;
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