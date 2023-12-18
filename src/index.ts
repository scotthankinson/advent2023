"use strict";
import * as fs from 'fs';
const start = (): void => {
    console.log(solve_pt1());
    console.log(solve_pt2_naive());
    console.log(solve_pt2());
};



const solve_pt1 = () => {
    if (1 === 1) return 0;
    try {
        let data = fs.readFileSync('src/input.dec18.txt', 'utf8');
        const lines = data.split('\n');
        let pos = {x: 0, y: 0};
        let digger = {};
        for(let line of lines) {
            let parts = line.split(' ');
            let direction = parts[0];
            let distance = parseInt(parts[1]);
            let color = parts[2];
            if (direction === 'R'){
                for(let i = 0; i < distance; i++){
                    pos.x += 1;
                    digger[pos.x + ',' + pos.y] = color;
                }
            } else if (direction === 'L'){
                for(let i = 0; i < distance; i++){
                    pos.x -= 1;
                    digger[pos.x + ',' + pos.y] = color;
                }
            } else if (direction === 'U'){
                for(let i = 0; i < distance; i++){
                    pos.y -= 1;
                    digger[pos.x + ',' + pos.y] = color;
                }
            } else if (direction === 'D'){
                for(let i = 0; i < distance; i++){
                    pos.y += 1;
                    digger[pos.x + ',' + pos.y] = color;
                }
            }
        }
        console.log("Finished outlining at " + JSON.stringify(pos));
        
        
        let minX = 0;
        let minY = 0;
        let maxX = 0;
        let maxY = 0;
        
        for(let key of Object.keys(digger)){
            let x = parseInt(key.split(',')[0]);
            let y = parseInt(key.split(',')[1]);
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }
        minY -= 1;
        minX -= 1;
        maxY += 1;
        maxX += 1;

        // Cache values to keep from recalculating
        console.log("Bounding Box set to " + minX + ',' + minY + ' to ' + maxX + ',' + maxY);
        
        let fill = {};
        for(let y = minY; y <= maxY; y++){
            for(let x = minX; x <= maxX; x++) {
                if (!digger[x + ',' + y]) {
                    let inside = false;
                    for(let testX = 0; testX < x; testX++) {
                        if (digger[testX + ',' + y]) {
                            if (digger[testX + ',' + (y - 1)] && digger[testX + ',' + (y + 1)]){
                                // clean cross
                                inside = !inside;
                            } else if (digger[testX + ',' + (y - 1)]){
                                // wall looking for a bottom
                                while(digger[testX + ',' + y]){
                                    testX += 1;
                                }
                                testX -= 1;
                                if (digger[testX + ',' + (y + 1)]) {
                                    inside = !inside;
                                }
                            } else if (digger[testX + ',' + (y + 1)]) {
                                // wall looking for a top
                                while(digger[testX + ',' + y]){
                                    testX += 1;
                                }
                                testX -= 1;
                                if (digger[testX + ',' + (y - 1)]) {
                                    inside = !inside;
                                }
                            }
                        }
                    }
                    if (inside) fill[x + ',' + y] = "#";
                }
            }
        }
        // console.log(fill);
        for(let key of Object.keys(fill)){
            if (!digger[key]) digger[key] = '#';
            else {
                console.log("oops!");
            }
        }


        console.log(draw(digger, minX, minY, maxX, maxY));

        // 99731 incorrect --- too generous of a fill calculation
        return 0;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const draw = (digger, minX, minY, maxX, maxY) => {
    let count = 0;
    // console.log(minX + ',' + minY + ' to ' + maxX + ',' + maxY);
    for(let y = minY; y <= maxY; y++){
        let line = '';
        for(let x = minX; x <= maxX; x++){
            if (digger[x + ',' + y]) {
                line += "#";
                count += 1;
            } else {
                line += '.';
            }
        }
        // console.log(line);
    }
    return count;
}



const solve_pt2_naive = () => {
    if (1 === 1) return 0;
    try {
        let data = fs.readFileSync('src/input.dec18.txt', 'utf8');
        const lines = data.split('\n');
        let converted = [];
        let perimeter = 0;
        for(let line of lines) {
            /*
            if (1 === 1){
                converted = lines;
                break;
            }*/
            let parts = line.split(' ');
            // let direction = parts[0];
            // let distance = parseInt(parts[1]);
            let color = parts[2];
            let distance = parseInt(color.replace("(", "").replace(")","").replace("#", "").slice(0,5), 16);
            let instruction = color.replace("(", "").replace(")","").replace("#", "").slice(-1);
            let direction = "";
            if (instruction === '0') direction = 'R';
            if (instruction === '1') direction = 'D';
            if (instruction === '2') direction = 'L';
            if (instruction === '3') direction = 'U';
            // console.log(distance);
            // console.log(direction);
            converted.push(direction + " " + distance + " " + "#");
        }
        
        let pos = {x: 0, y: 0};
        let digger = {};
        let minX = 0;
        let minY = 0;
        let maxX = 0;
        let maxY = 0;
        
        for(let line of converted) {
            console.log("Outlining for " + line);
            let parts = line.split(' ');
            let direction = parts[0];
            let distance = parseInt(parts[1]);
            perimeter += distance;
            let color = parts[2];
            if (direction === 'R'){
                for(let i = 0; i < distance; i++){
                    pos.x += 1;
                    if (pos.x > maxX) maxX = pos.x;
                    digger[pos.x + ',' + pos.y] = color;
                }
            } else if (direction === 'L'){
                for(let i = 0; i < distance; i++){
                    pos.x -= 1;
                    if (pos.x < minX) minX = pos.x;
                    digger[pos.x + ',' + pos.y] = color;
                }
            } else if (direction === 'U'){
                for(let i = 0; i < distance; i++){
                    pos.y -= 1;
                    if (pos.y < minY) minY = pos.y;
                    digger[pos.x + ',' + pos.y] = color;
                }
            } else if (direction === 'D'){
                for(let i = 0; i < distance; i++){
                    pos.y += 1;
                    if (pos.y > maxY) maxY = pos.y;
                    digger[pos.x + ',' + pos.y] = color;
                }
            }
            
        }
        console.log("Finished outlining at " + JSON.stringify(pos));
        
        // Cache values to keep from recalculating
        console.log("Bounding Box set to " + minX + ',' + minY + ' to ' + maxX + ',' + maxY + ' with perimeter ' + perimeter);
        
        /*
        for(let key of Object.keys(digger)){
            let x = parseInt(key.split(',')[0]);
            let y = parseInt(key.split(',')[1]);
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }
        // 1,440,001,186,328 coordinates
        minY -= 1;
        minX -= 1;
        maxY += 1;
        maxX += 1;
        */

        console.log(count(digger, minX, minY, maxX, maxY));
        return 0;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const count = (digger, minX, minY, maxX, maxY) => {
    let count = 0;
    // console.log(digger);
    for(let y = minY; y <= maxY; y++) {
        console.log("Counting for " + y + " of " + maxY + ": " + count);
        let inside = false;
        for(let x = minX; x <= maxX; x++) {
            // console.log("Evaluating " + x + ',' + y + ": " + inside);
            if (!digger [x + ',' + y]) {
                if (inside) count = count + 1;
            }
            
            if (digger[x + ',' + y]) {
                // console.log("Top: " + x + ',' + (y - 1) + ": " + digger[x + ',' + (y - 1)] );
                // console.log("At: " + x + ',' + y + ": " + digger[x + ',' + y] );
                // console.log("Bottom: " + x + ',' + (y + 1) + ": " + digger[x + ',' + (y + 1)] );
                // console.log(digger[x + ',' + y]);
                if (digger[x + ',' + (y - 1)] && digger[x + ',' + (y + 1)]){
                    // clean cross
                    // console.log("Clean Cross at " + x + ',' + y);
                    inside = !inside;
                    count += 1;    
                } else if (digger[x + ',' + (y - 1)]) {
                    // wall looking for a bottom
                    // console.log("Need Bottom " + x + ',' + y);
                    while(digger[x + ',' + y]){
                        count += 1;
                        x += 1;
                    }
                    x -= 1;
                    if (digger[x + ',' + (y + 1)]) {
                        inside = !inside;
                    }
                } else if (digger[x + ',' + (y + 1)]) {
                    // wall looking for a top
                    // console.log("Need Top " + x + ',' + y);
                    while(digger[x + ',' + y]) {
                        count += 1;
                        x += 1;
                    }
                    x -= 1;
                    if (digger[x + ',' + (y - 1)]) {
                        inside = !inside;
                    }
                } else {
                    console.log("OOOps!");
                }
            }
        }
    }

    // basic puzzle input gets to 952,408,144,115, real input will take years
    return count;
}


const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.dec18.txt', 'utf8');
        const lines = data.split('\n');
        let converted = [];
        let perimeter = 0;
        for(let line of lines) {
            /*
            if ( 1 === 1) {
                converted = lines;
                break;
            }*/
            let parts = line.split(' ');
            let color = parts[2];
            let distance = parseInt(color.replace("(", "").replace(")","").replace("#", "").slice(0,5), 16);
            let instruction = color.replace("(", "").replace(")","").replace("#", "").slice(-1);
            let direction = "";
            if (instruction === '0') direction = 'R';
            if (instruction === '1') direction = 'D';
            if (instruction === '2') direction = 'L';
            if (instruction === '3') direction = 'U';
            converted.push(direction + " " + distance + " " + "#");
        }
        
        let pos = {x: 0, y: 0};
        let minX = 0;
        let minY = 0;
        let maxX = 0;
        let maxY = 0;
        
        let spans = [];
        for(let line of converted) {
            console.log("Outlining for " + line);
            let parts = line.split(' ');
            let direction = parts[0];
            let distance = parseInt(parts[1]);
            perimeter += distance;
            // let color = parts[2];
            // Only care about horizontal lines for our scan
            if (direction === 'R') {
                let span = {fromX: pos.x, y: pos.y, distance: distance, orientation: "H"};
                spans.push(span);
                pos.x = span.fromX + distance;
                if (pos.x > maxX) maxX = pos.x;
            } else if (direction === 'L'){
                let span = {fromX: pos.x - distance, y: pos.y, distance: distance, orientation: "H"};
                spans.push(span);
                pos.x = span.fromX;
                if (pos.x < minX) minX = pos.x;
            } else if (direction === 'U'){
                // let span = {fromX: pos.x, toX: pos.x, fromY: pos.y - distance, toY: pos.y, orientation: "V"};
                // spans.push(span);
                pos.y = pos.y - distance;
                if (pos.y < minY) minY = pos.y;
            } else if (direction === 'D'){
                // let span = {fromX: pos.x, toX: pos.x, fromY: pos.y, toY: pos.y + distance, orientation: "V"};
                // spans.push(span);
                pos.y = pos.y + distance;
                if (pos.y > maxY) maxY = pos.y;
            }   
        }
        console.log("Finished outlining at " + JSON.stringify(pos));
        console.log("Bounding Box set to " + minX + ',' + minY + ' to ' + maxX + ',' + maxY + ' with perimeter ' + perimeter);
        
        spans.sort((a, b) => a.y - b.y);
        
        let count = 0;
        let rowTracker = {};
        for(let y = minY; y <= maxY; y++) {
            if (y % 10000 === 0) console.log("Processing " + y + " of " + maxY);
            let rowSpans = spans.filter(o => o.y === y);
            let toFlip = [];
            for(let row of rowSpans) {
                let existingData = Object.keys(rowTracker).filter(o => o >= row.fromX && o <= row.fromX + row.distance);
                if (existingData.length === 0) {
                    for(let x = row.fromX; x <= row.fromX + row.distance; x++){
                        rowTracker[x] = '#';
                    }
                } else {
                    let from = row.fromX;
                    let to = row.fromX + row.distance;
                    if (rowTracker[row.fromX - 1]) {
                        from += 1;
                    }
                    if (rowTracker[to + 1]) {
                        to -= 1;
                    }
                    if (existingData[0] == row.fromX && existingData[existingData.length -1] === row.fromX + row.distance) continue;
                    for(let x = from; x <= to; x++){
                        if (rowTracker[x]) toFlip.push(x);
                        else rowTracker[x] = '#';
                    }
                }
            }

            // let line = '';
            for(let x = minX; x <= maxX; x++){
                // if (rowTracker[x]) line += '#';
                // else line += '.';
                if (rowTracker[x]) count += 1;
            }
            // console.log(line);
            toFlip.forEach(o => delete rowTracker[o]);
        }
        return count;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


start();


export default start;