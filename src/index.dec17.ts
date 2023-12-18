"use strict";
import * as fs from 'fs';
import { PriorityQueue, ICompare} from '@datastructures-js/priority-queue';

const start = (): void => {
    console.log(solve_pt1());
    console.log(solve_pt2());
};

interface PathEntry {
    x: number, 
    y: number, 
    dir: string, 
    straight: number, 
    moves: number, 
    heat: number, 
    history: string
}

const calculateHeat = (path, lines) => {
    let testPos = {x: 0,y: 0, heat: 0};
    for(let i = 0; i < path.length; i++){
        if (path[i] == ">") testPos.x += 1;
        else if (path[i] == "v") testPos.y += 1;
        else if (path[i] == "^") testPos.y -= 1;
        else if (path[i] == "<") testPos.x -= 1;

        testPos.heat += parseInt(lines[testPos.y][testPos.x]);   
        console.log(testPos);
    }
}
const solve_pt1 = () => {
    try {
        let data = fs.readFileSync('src/input.dec17.txt', 'utf8');
        const lines = data.split('\n');

        
        let comparePath: ICompare<PathEntry> = (a:PathEntry, b:PathEntry) => a.heat === b.heat ? a.history.length - b.history.length : a.heat - b.heat;
        let path = new PriorityQueue<PathEntry>(comparePath);
        path.enqueue({x: 0, y: 0, dir: '>', straight: 0, moves: 0, heat: 0, history: ""});
        let traveled = {};
        let distance = {'0,0': 0};
        let result = null;
        while(path.size() > 0) {
            // Sort is killing us, find a faster queue
            // path.sort((a, b) => a.heat - b.heat);
            let newNodes = [];
            let oneMove = path.dequeue();
            // console.log(JSON.stringify(oneMove));
            if (path.size() % 25000 === 0) {
                console.log("Traveled: " + Object.keys(traveled).length);
                console.log("Depth: " + path.size());
                console.log("Processing " + oneMove.x + "," + oneMove.y + "," + oneMove.dir + " with heat " + oneMove.heat + " and tail " + oneMove.history);
            }
            if (oneMove.x === lines[0].length -1 && oneMove.y === lines.length - 1){
                result = oneMove;
                break;
            }
            
            // TODO: Re=evaluate this straight calculation based on history?
            // Forward, Left, or Right UNLESS straight===3 then Left or Right
            if (oneMove.dir === '>') {
                if (oneMove.straight < 3 && oneMove.x < lines[0].length - 1) {
                    let copy = JSON.parse(JSON.stringify(oneMove));
                    copy.x += 1;
                    copy.straight += 1;
                    copy.moves += 1;
                    copy.heat += parseInt(lines[copy.y][copy.x]);
                    newNodes.push(copy);
                } 
                if (oneMove.y > 0){
                    let leftCopy = JSON.parse(JSON.stringify(oneMove));
                    leftCopy.dir = '^';
                    leftCopy.y -= 1;
                    leftCopy.straight = 1;
                    leftCopy.moves += 1;
                    leftCopy.heat += parseInt(lines[leftCopy.y][leftCopy.x]);
                    newNodes.push(leftCopy);
                }
                if (oneMove.y < lines.length - 1){
                    let rightCopy = JSON.parse(JSON.stringify(oneMove));
                    rightCopy.dir = 'v';
                    rightCopy.y += 1;
                    rightCopy.straight = 1;
                    rightCopy.moves += 1;
                    rightCopy.heat += parseInt(lines[rightCopy.y][rightCopy.x]);
                    newNodes.push(rightCopy);    
                }
            } else if (oneMove.dir === '<'){
                if (oneMove.straight < 3 && oneMove.x > 0) {
                    let copy = JSON.parse(JSON.stringify(oneMove));
                    copy.x -= 1;
                    copy.straight += 1;
                    copy.moves += 1;
                    copy.heat += parseInt(lines[copy.y][copy.x]);
                    newNodes.push(copy);
                } 
                if (oneMove.y > 0){
                    let leftCopy = JSON.parse(JSON.stringify(oneMove));
                    leftCopy.dir = '^';
                    leftCopy.y -= 1;
                    leftCopy.straight = 1;
                    leftCopy.moves += 1;
                    leftCopy.heat += parseInt(lines[leftCopy.y][leftCopy.x]);
                    newNodes.push(leftCopy);
                }
                if (oneMove.y < lines.length - 1){
                    let rightCopy = JSON.parse(JSON.stringify(oneMove));
                    rightCopy.dir = 'v';
                    rightCopy.y += 1;
                    rightCopy.straight = 1;
                    rightCopy.moves += 1;
                    rightCopy.heat += parseInt(lines[rightCopy.y][rightCopy.x]);
                    newNodes.push(rightCopy);    
                }
            } else if (oneMove.dir === '^'){
                if (oneMove.straight < 3 && oneMove.y > 0) {
                    let copy = JSON.parse(JSON.stringify(oneMove));
                    copy.y -= 1;
                    copy.straight += 1;
                    copy.moves += 1;
                    copy.heat += parseInt(lines[copy.y][copy.x]);
                    newNodes.push(copy);
                } 
                if (oneMove.x > 0) {
                    let leftCopy = JSON.parse(JSON.stringify(oneMove));
                    leftCopy.dir = '<';
                    leftCopy.x -= 1;
                    leftCopy.straight = 1;
                    leftCopy.moves += 1;
                    leftCopy.heat += parseInt(lines[leftCopy.y][leftCopy.x]);
                    newNodes.push(leftCopy);
                }
                if (oneMove.x < lines[0].length - 1){
                    let rightCopy = JSON.parse(JSON.stringify(oneMove));
                    rightCopy.dir = '>';
                    rightCopy.x += 1;
                    rightCopy.straight = 1;
                    rightCopy.moves += 1;
                    rightCopy.heat += parseInt(lines[rightCopy.y][rightCopy.x]);
                    newNodes.push(rightCopy);    
                }
            } else if (oneMove.dir === 'v'){
                if (oneMove.straight < 3 && oneMove.y < lines.length - 1) {
                    let copy = JSON.parse(JSON.stringify(oneMove));
                    copy.y += 1;
                    copy.straight += 1;
                    copy.moves += 1;
                    copy.heat += parseInt(lines[copy.y][copy.x]);
                    newNodes.push(copy);
                }
                if (oneMove.x > 0) {
                    let leftCopy = JSON.parse(JSON.stringify(oneMove));
                    leftCopy.dir = '<';
                    leftCopy.x -= 1;
                    leftCopy.straight = 1;
                    leftCopy.moves += 1;
                    leftCopy.heat += parseInt(lines[leftCopy.y][leftCopy.x]);
                    newNodes.push(leftCopy);
                }
                if (oneMove.x < lines[0].length - 1){
                    let rightCopy = JSON.parse(JSON.stringify(oneMove));
                    rightCopy.dir = '>';
                    rightCopy.x += 1;
                    rightCopy.straight = 1;
                    rightCopy.moves += 1;
                    rightCopy.heat += parseInt(lines[rightCopy.y][rightCopy.x]);
                    newNodes.push(rightCopy);    
                }
            }

            while(newNodes.length > 0) {
                let oneNode = newNodes.shift();
                // console.log(oneNode);
                oneNode.history += oneNode.dir;
                let backTrackCheck = oneNode.x + ',' + oneNode.y + ',' + oneMove.dir + ',' + oneNode.straight;
                if (traveled[backTrackCheck]) continue;
                traveled[backTrackCheck] = oneNode.history;

                
                distance[oneNode.x + ',' + oneNode.y] = distance[oneNode.x + ',' + oneNode.y] ? Math.min(distance[oneNode.x + ',' + oneNode.y], oneNode.heat) : oneNode.heat;
                
                path.enqueue(oneNode);
            }
        }

        // 1141 incorrect
        // 1151 incorrect
        // 1152 incorrect
        // 1162 too high
        calculateHeat(result.history, lines);
        console.log(result);
        console.log(JSON.stringify(distance));
        
        return result.heat;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const solve_pt2 = () => {
    try {
        // let data = fs.readFileSync('src/input.dec17.txt', 'utf8');
        // const lines = data.split('\n');
        // console.log(lines);

        return 0;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();


export default start;