"use strict";
import * as fs from 'fs';

const start = (): void => {
    // console.log(solve_pt1());
    console.log(solve_pt2());
};


/*
const solve_pt1 = () => {
    try {
        let data = fs.readFileSync('src/input.dec2.txt', 'utf8');
        const lines = data.split('\n');
        let games = [];
        for(let line of lines) {
            let game = {};
            console.log(line);
            game['id'] = parseInt(line.split(":")[0].replace("Game ", ""));
            game['sets'] = [];
            let rawSets = line.split(":")[1].split(";"); 
            for(let rawSet of rawSets){
                let entries = rawSet.split(",");
                let set = {};
                for(let entry of entries) {
                    if (entry.indexOf("red") >= 0) set["red"] = parseInt(entry.split('').filter(o => o >= '0' && o <= '9').join(''));
                    if (entry.indexOf("blue") >= 0) set["blue"] = parseInt(entry.split('').filter(o => o >= '0' && o <= '9').join(''));
                    if (entry.indexOf("green") >= 0) set["green"] = parseInt(entry.split('').filter(o => o >= '0' && o <= '9').join(''));
                }
                game['sets'].push(set);
            }
            // console.log(game);
            games.push(game);
        }

        let possible = 0;
        for(let game of games) {
            let maxRed = 0;
            let maxGreen = 0;
            let maxBlue = 0;
            for(let set of game['sets']){
                console.log(set);
                if (set['red'] && set['red'] > maxRed) maxRed = set['red'];
                if (set['green'] && set['green'] > maxGreen) maxGreen = set['green'];
                if (set['blue'] && set['blue'] > maxBlue) maxBlue = set['blue'];
            }
            if (maxRed <= 12 && maxGreen <= 13 && maxBlue <= 14) {
                possible += game['id'];
            }
        }
        
        return possible;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}
*/


const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.dec2.txt', 'utf8');
        const lines = data.split('\n');
        let games = [];
        for(let line of lines) {
            let game = {};
            console.log(line);
            game['id'] = parseInt(line.split(":")[0].replace("Game ", ""));
            game['sets'] = [];
            let rawSets = line.split(":")[1].split(";"); 
            for(let rawSet of rawSets){
                let entries = rawSet.split(",");
                let set = {};
                for(let entry of entries) {
                    if (entry.indexOf("red") >= 0) set["red"] = parseInt(entry.split('').filter(o => o >= '0' && o <= '9').join(''));
                    if (entry.indexOf("blue") >= 0) set["blue"] = parseInt(entry.split('').filter(o => o >= '0' && o <= '9').join(''));
                    if (entry.indexOf("green") >= 0) set["green"] = parseInt(entry.split('').filter(o => o >= '0' && o <= '9').join(''));
                }
                game['sets'].push(set);
            }
            // console.log(game);
            games.push(game);
        }

        let totalPower = 0;
        for(let game of games) {
            let maxRed = 0;
            let maxGreen = 0;
            let maxBlue = 0;
            for(let set of game['sets']){
                console.log(set);
                if (set['red'] && set['red'] > maxRed) maxRed = set['red'];
                if (set['green'] && set['green'] > maxGreen) maxGreen = set['green'];
                if (set['blue'] && set['blue'] > maxBlue) maxBlue = set['blue'];
            }
            let power = maxRed * maxGreen * maxBlue;
            console.log(power);
            totalPower += power;
        }
        
        return totalPower;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();


export default start;