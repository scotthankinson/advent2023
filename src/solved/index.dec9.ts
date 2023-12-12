"use strict";
import * as fs from 'fs';

const start = (): void => {
    console.log(solve_pt1());
    console.log(solve_pt2());
};



const solve_pt1 = () => {
    try {
        if (1 === 1) return 0;
        let data = fs.readFileSync('src/input.dec9.txt', 'utf8');
        const lines = data.split('\n');
        let total = 0;
        for(let line of lines) {
            let history = {0: line.split(' ').map(o => parseInt(o))};
            let depth = 0;
            while (history[depth].filter(o => o !== 0).length > 0) {
                depth = depth + 1;
                history[depth] = new Array<number>(history[depth - 1].length - 1);
                for(let i = 0; i < history[depth].length; i++){
                    history[depth][i] = history[depth - 1][i + 1] - history[depth - 1][i];
                }
            }
            history[depth].push(0); // 0 

            while (depth > 0){
                let valueToAdd = history[depth][history[depth].length - 1];
                history[depth - 1].push(valueToAdd + history[depth - 1][history[depth - 1].length - 1]);
                depth -= 1;
            }
            
            console.log(history);
            total += history[0][history[0].length - 1];
        }

        // 1806622158 TOO HIGH; negatives are allowed, need to check for 0 explicitly
        return total;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.dec9.txt', 'utf8');
        const lines = data.split('\n');
        let total = 0;
        for(let line of lines) {
            let history = {0: line.split(' ').map(o => parseInt(o))};
            let depth = 0;
            while (history[depth].filter(o => o !== 0).length > 0) {
                depth = depth + 1;
                history[depth] = new Array<number>(history[depth - 1].length - 1);
                for(let i = 0; i < history[depth].length; i++){
                    history[depth][i] = history[depth - 1][i + 1] - history[depth - 1][i];
                }
            }
            history[depth].unshift(0); // 0 

            while (depth > 0){
                let valueToUnshift = history[depth][0];
                history[depth - 1].unshift(history[depth - 1][0] - valueToUnshift);
                depth -= 1;
            }
            
            console.log(history);
            total += history[0][0];
        }

        // 1806622158 TOO HIGH; negatives are allowed, need to check for 0 explicitly
        return total;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();


export default start;