"use strict";
import * as fs from 'fs';

const start = (): void => {
    // console.log(solve_pt1());
    console.log(solve_pt2());
};

/*
const solve_pt1 = () => {
    try {
        let data = fs.readFileSync('src/input.dec1.txt', 'utf8');
        const lines = data.split('\n');
        let total = 0;
        for(let line of lines) {
            let numbers = line.split('').filter(o => o >= '0' && o <= '9');
            let value = parseInt(numbers[0] + numbers[numbers.length - 1]);
            console.log(line + ": " + value);
            total += value;
        }
        console.log(lines);

        return total;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}
*/

const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.dec1.txt', 'utf8');
        const lines = data.split('\n');
        let total = 0;
        for(let line of lines) {
            let modifiedLine = line;
            while(modifiedLine.indexOf('one') >= 0) modifiedLine = modifiedLine.replace("one", "o1ne");
            while(modifiedLine.indexOf('two') >= 0) modifiedLine = modifiedLine.replace("two", "t2wo");
            while(modifiedLine.indexOf('three') >= 0) modifiedLine = modifiedLine.replace("three", "t3hree");
            while(modifiedLine.indexOf('four') >= 0) modifiedLine = modifiedLine.replace("four", "f4our");
            while(modifiedLine.indexOf('five') >= 0) modifiedLine = modifiedLine.replace("five", "f5ive");
            while(modifiedLine.indexOf('six') >= 0) modifiedLine = modifiedLine.replace("six", "s6ix");
            while(modifiedLine.indexOf('seven') >= 0) modifiedLine = modifiedLine.replace("seven", "s7even");
            while(modifiedLine.indexOf('eight') >= 0) modifiedLine = modifiedLine.replace("eight", "e8ight");
            while(modifiedLine.indexOf('nine') >= 0) modifiedLine = modifiedLine.replace("nine", "n9ine");
            let numbers = modifiedLine.split('').filter(o => o >= '0' && o <= '9');
            let value = parseInt(numbers[0] + numbers[numbers.length - 1]);
            console.log(line + ": " + modifiedLine + ": " + value);
            total += value;
        }
        // console.log(lines);

        return total;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();


export default start;