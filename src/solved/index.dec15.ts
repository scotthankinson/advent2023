"use strict";
import * as fs from 'fs';

const start = (): void => {
    console.log(solve_pt1());
    console.log(solve_pt2());
};



const solve_pt1 = () => {
    if (1===1) return 0;
    try {
        let data = fs.readFileSync('src/input.dec15.txt', 'utf8');
        const lines = data.split('\n').join('').split(',');
        console.log(lines);
        
        let sum = 0;
        for(let i = 0; i < lines.length; i++){
            sum += hash(lines[i]);
            console.log(hash(lines[i]));
        }
        
        return sum;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const hash = (input) => {
    let currentValue = 0;
    for(let oneChar of input.split('')){
        // console.log(oneChar + ':' + oneChar.charCodeAt(0));
        currentValue += oneChar.charCodeAt(0);
        currentValue *= 17;
        currentValue = currentValue % 256;
    }

    return currentValue;
}
const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.dec15.txt', 'utf8');
        const lines = data.split('\n').join('').split(',');
        console.log(lines);
        
        let boxArray = {};
        for(let i = 0; i < lines.length; i++) {
            // console.log(lines[i]);
            let parts = [];
            if (lines[i].indexOf("=") > -1) parts = lines[i].split('=');
            else parts = [lines[i].replace('-', ''), '-'];
            
            let label = parts[0];
            let box = hash(parts[0]);
            let operation = parts[1];
            // console.log(box + ": " + label + ' ' + operation);
            if (operation !== '-') {
                // Add/Update
                if (!boxArray[box] ) {
                    boxArray[box] = [{label: label, lens: operation}];
                } else {
                    let exists = false;
                    for(let j = 0; j < boxArray[box].length; j++) {
                        if (boxArray[box][j].label === label) {
                            exists = true;
                            boxArray[box][j].lens = operation;
                            break;
                        }
                    }
                    if (!exists) boxArray[box].push({label: label, lens: operation});
                }
            } else {
                // Remove
                if (boxArray[box]){
                    for(let j = 0; j < boxArray[box].length; j++) {
                        if (boxArray[box][j].label === label) {
                            boxArray[box][j].lens = '';
                            boxArray[box] = boxArray[box].filter(o => o.lens.length > 0);
                            if (boxArray[box].length === 0) delete boxArray[box];
                            break;
                        }
                    }
                }
            }
            // console.log(i + ":" + lines[i]);
            // console.log(boxArray);
        }
        
        let focusingPower = 0;
        for(let key of Object.keys(boxArray)){
            for(let i = 0; i < boxArray[key].length; i++){
                let box = 1 + parseInt(key);
                let slot = i + 1;
                let focalLength = parseInt(boxArray[key][i].lens);
                // console.log(box * slot * focalLength);
                focusingPower += box * slot * focalLength;
            }
        }

        // 244845 too low -- do they have labels contained in labels?
        return focusingPower;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();


export default start;