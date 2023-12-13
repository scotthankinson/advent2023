"use strict";
import * as fs from 'fs';

const start = (): void => {
    console.log(solve_pt1());
    console.log(solve_pt2());
};



const solve_pt1 = () => {
    if (1 === 1) return 0;
    try {
        let data = fs.readFileSync('src/input.dec13.txt', 'utf8');
        const lines = data.split('\n');
        let inputs = [];
        let oneInput = [];
        for(let line of lines){
            if (line.trim().length === 0) {
                inputs.push(oneInput);
                oneInput = [];
            } else {
                oneInput.push(line);
            }
        }
        console.log(inputs);
        let total = 0;
        for(let input of inputs) {
            total += solveSingleInput_pt1(input, 0);
        }

        return total;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const validateInflectionPoint = (inflection, lines) => {
    let top = inflection;
    let bottom = inflection - 1;
    let diff = 0;
    while ( top + diff < lines.length && bottom - diff >= 0) {
        if (lines[bottom - diff] !== lines[top + diff]) return false;
        diff += 1;
    }
    return true;
}

const solveSingleInput_pt1 = (lines, skip) => {
    let horizontalCounts = {};
    let inflectionPoints = [];
    for(let i = 0; i < lines.length; i++){
        if (!horizontalCounts[lines[i]]) horizontalCounts[lines[i]] = [i];
        else {
            if (i > 0 && horizontalCounts[lines[i]].indexOf(i - 1) > -1){
                inflectionPoints.push(i);
            }
            horizontalCounts[lines[i]].push(i);
        }
    }
    let validInflectionPoints = inflectionPoints.filter(o => validateInflectionPoint(o, lines));
    // pt2
    validInflectionPoints = validInflectionPoints.filter(o => o !== (skip/ 100 ));
    
    if (validInflectionPoints.length > 0){
        return validInflectionPoints[0] * 100;
    }
    
    let verticalLines = [];
    for(let i = 0; i < lines[0].length; i++){
        let line = "";
        for(let j = 0; j < lines.length; j++){
            line += lines[j][i];
        }
        verticalLines.push(line);
    }
    let verticalCounts = {};
    let verticalInflectionPoints = [];
    for(let i = 0; i < verticalLines.length; i++){
        if (!verticalCounts[verticalLines[i]]) verticalCounts[verticalLines[i]] = [i];
        else {
            if (i > 0 && verticalCounts[verticalLines[i]].indexOf(i - 1) > -1){
                verticalInflectionPoints.push(i);
            }
            verticalCounts[verticalLines[i]].push(i);
        }
    }
    let validVerticalInflectionPoints = verticalInflectionPoints.filter(o => validateInflectionPoint(o, verticalLines));
    // pt2
    validVerticalInflectionPoints = validVerticalInflectionPoints.filter(o => o !== skip);
    
    if (validVerticalInflectionPoints.length > 0){
        return validVerticalInflectionPoints[0];
    }

    // what to do with ties?
    // 25819 too low
    // 28956 (wrong answer with fixed sort)
    // 34993 - filtered false reflections
    return 0;
}

const solveSingleInput_pt2 = (lines) => {
    let falsePositive = solveSingleInput_pt1(lines, 0); // original inflection point value
    for(let y = 0; y < lines.length; y++){
        for(let x= 0; x < lines[0].length; x++){
            let copyLines = JSON.parse(JSON.stringify(lines));
            let flip = copyLines[y][x] === "." ? "#" : ".";
            copyLines[y] = copyLines[y].slice(0, x) + flip + copyLines[y].slice(x + 1);
            let localResult = solveSingleInput_pt1(copyLines, falsePositive);
            if (localResult > 0 && localResult !== falsePositive) {
                return localResult;
            } 
        }
    }
    console.log("----- No New Solutions! -------- ");
    console.log("Original: " + falsePositive);
    console.log(lines);
    
    return 0;
}


const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.dec13.txt', 'utf8');
        const lines = data.split('\n');
        let inputs = [];
        let oneInput = [];
        for(let line of lines){
            if (line.trim().length === 0) {
                inputs.push(oneInput);
                oneInput = [];
            } else {
                oneInput.push(line);
            }
        }
        // console.log(inputs);
        let total = 0;
        for(let input of inputs) {
            total += solveSingleInput_pt2(input);
        }

        // 22068 too low
        // 29341 just right
        // 43400 too high

        return total;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();


export default start;