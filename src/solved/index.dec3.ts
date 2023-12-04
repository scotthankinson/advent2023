"use strict";
import * as fs from 'fs';

const start = (): void => {
    // console.log(solve_pt1());
    console.log(solve_pt2());
};


/*
const solve_pt1 = () => {
    try {
        let data = fs.readFileSync('src/input.dec3.txt', 'utf8');
        const lines = data.split('\n');
        let symbols = {};
        let numbers = {};
        for(let y  = 0; y < lines.length; y++) {
            for(let x = 0; x < lines[0].length; x++){
                if (lines[y][x] === ".") continue;
                if (lines[y][x] >= '0' && lines[y][x]  <= '9') {
                    let newX = x;
                    // left scan
                    let number = "";
                    while(lines[y][newX - 1] && lines[y][newX - 1] >= '0' && lines[y][newX - 1]  <= '9') newX -= 1;
                    let root = newX + "," + y;
                    while (lines[y][newX] >= '0' && lines[y][newX]  <= '9') {
                        number = number + lines[y][newX];
                        newX += 1;
                    }
                    numbers[x + "," + y] = root + ":" + number;
                    continue;
                }
                symbols[x + "," + y] = lines[y][x];
            }
        }
        console.log(numbers);
        console.log(symbols);

        let sumAdjacent = new Set<string>();
        for(let oneNumber of Object.keys(numbers)){
            let x = parseInt(oneNumber.split(",")[0]);
            let y = parseInt(oneNumber.split(",")[1]);

            // Top left
            if (symbols[(x - 1) + "," + (y - 1)]) sumAdjacent.add(numbers[oneNumber]);
            //Top
            if (symbols[(x) + "," + (y - 1)]) sumAdjacent.add(numbers[oneNumber]);
            // Top Right
            if (symbols[(x + 1) + "," + (y - 1)]) sumAdjacent.add(numbers[oneNumber]);
            // Left
            if (symbols[(x - 1) + "," + (y)]) sumAdjacent.add(numbers[oneNumber]);
            // Right 
            if (symbols[(x + 1) + "," + (y)]) sumAdjacent.add(numbers[oneNumber]);
            // Bottom left
            if (symbols[(x - 1) + "," + (y + 1)]) sumAdjacent.add(numbers[oneNumber]);
            //Bottom
            if (symbols[(x) + "," + (y + 1)]) sumAdjacent.add(numbers[oneNumber]);
            // Bottom Right
            if (symbols[(x + 1) + "," + (y + 1)]) sumAdjacent.add(numbers[oneNumber]);
        }
        let total = 0;
        console.log(sumAdjacent);
        for(let value of sumAdjacent.values()){
            total += parseInt(value.split(":")[1]);
        }
        console.log(sumAdjacent);
        return total;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}
*/

const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.dec3.txt', 'utf8');
        const lines = data.split('\n');
        let symbols = {};
        let numbers = {};
        for(let y  = 0; y < lines.length; y++) {
            for(let x = 0; x < lines[0].length; x++){
                if (lines[y][x] === ".") continue;
                if (lines[y][x] >= '0' && lines[y][x]  <= '9') {
                    let newX = x;
                    // left scan
                    let number = "";
                    while(lines[y][newX - 1] && lines[y][newX - 1] >= '0' && lines[y][newX - 1]  <= '9') newX -= 1;
                    let root = newX + "," + y;
                    while (lines[y][newX] >= '0' && lines[y][newX]  <= '9') {
                        number = number + lines[y][newX];
                        newX += 1;
                    }
                    numbers[x + "," + y] = root + ":" + number;
                    continue;
                }
                symbols[x + "," + y] = lines[y][x];
            }
        }
        console.log(numbers);
        console.log(symbols);


        let product = 0;
        for(let oneSymbol of Object.keys(symbols)) {
            let adjacentNumbers = new Set<string>();
            if (symbols[oneSymbol] !== "*") continue;
            let x = parseInt(oneSymbol.split(",")[0]);
            let y = parseInt(oneSymbol.split(",")[1]);

            // Top left
            if (numbers[(x - 1) + "," + (y - 1)]) adjacentNumbers.add(numbers[(x - 1) + "," + (y - 1)]);
            //Top
            if (numbers[(x) + "," + (y - 1)]) adjacentNumbers.add(numbers[(x) + "," + (y - 1)]);
            // Top Right
            if (numbers[(x + 1) + "," + (y - 1)]) adjacentNumbers.add(numbers[(x + 1) + "," + (y - 1)]);
            // Left
            if (numbers[(x - 1) + "," + (y)]) adjacentNumbers.add(numbers[(x - 1) + "," + (y)]);
            // Right 
            if (numbers[(x + 1) + "," + (y)]) adjacentNumbers.add(numbers[(x + 1) + "," + (y)]);
            // Bottom left
            if (numbers[(x - 1) + "," + (y + 1)]) adjacentNumbers.add(numbers[(x - 1) + "," + (y + 1)]);
            //Bottom
            if (numbers[(x) + "," + (y + 1)]) adjacentNumbers.add(numbers[(x) + "," + (y + 1)]);
            // Bottom Right
            if (numbers[(x + 1) + "," + (y + 1)]) adjacentNumbers.add(numbers[(x + 1) + "," + (y + 1)]);

            if (adjacentNumbers.size === 2) {
                let values = Array.from(adjacentNumbers.values());
                product += parseInt(values[0].split(':')[1]) * parseInt(values[1].split(':')[1]);
            }
        }        
        
        return product;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();


export default start;