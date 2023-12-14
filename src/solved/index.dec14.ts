"use strict";
import * as fs from 'fs';

const start = (): void => {
    console.log(solve_pt1());
    console.log(solve_pt2());
};



const solve_pt1 = () => {
    if (1 === 1) return 0;
    try {
        let data = fs.readFileSync('src/input.dec14.txt', 'utf8');
        const lines = data.split('\n');
        console.log(lines);
        let map = {};
        for(let y = 0; y < lines.length; y++ ){
            for(let x= 0; x < lines[0].length; x++){
                map[x +',' + y] = lines[y][x];
            }
        }
        console.log(map);
        draw(map, lines.length, lines[0].length);
        let start = JSON.stringify(map);
        let out = "";
        while (start !== out) {
            start = out;
            for(let y = 0; y < lines.length; y++ ){
                for(let x= 0; x < lines[0].length; x++){
                    
                    if (map[x + ',' + (y - 1)] && map[x + ',' + y] === 'O' && map[x + ',' + (y - 1)] === '.'){
                        map[x + ',' + (y - 1)] = 'O';
                        map[x + ',' + y] = '.';
                    }
                }
            }
            out = JSON.stringify(map);
            draw(map, lines.length, lines[0].length);
        }

        let weight = 0;
        for(let y = 0; y < lines.length; y++ ){
            for(let x= 0; x < lines[0].length; x++){
                if (map[x +',' + y] === 'O') weight += lines.length - y;
            }
        }
        
        return weight;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const draw = (map, maxY, maxX) => {
    console.log("".padStart(maxX, "-"));
    for(let y = 0; y < maxY; y++){
        let line = '';
        for(let x = 0; x < maxX; x++){
            line += map[x + ',' + y];
        }
        console.log(line);
    }
    console.log("".padStart(maxX, "-"));
}

const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.dec14.txt', 'utf8');
        const lines = data.split('\n');
        let map = {};
        for(let y = 0; y < lines.length; y++ ){
            for(let x= 0; x < lines[0].length; x++){
                map[x +',' + y] = lines[y][x];
            }
        }
        draw(map, lines.length, lines[0].length);
        let cycles = 0;
        let history = {};
        while (cycles < 1000000000) {

            let rockSpots = [];
            for(let key of Object.keys(map)){
                if (map[key] === 'O') rockSpots.push(key);
            }
            if (history[JSON.stringify(rockSpots)]){
                map = JSON.parse(history[JSON.stringify(rockSpots)].map);
                history[JSON.stringify(rockSpots)].cycles.push(cycles);
                cycles +=1;
                console.log(cycles + ": Used the cheaty bridge!!!! " + Object.keys(history).length);

                if (cycles > 2000) break;
                continue;
            } else {
                console.log(cycles + ": Booooring: " + Object.keys(history).length);
            }

            // North
            let change = true;
            while (change) {
                change = false;
                for(let y = 0; y < lines.length; y++ ){
                    for(let x= 0; x < lines[0].length; x++){
                        
                        if (map[x + ',' + (y - 1)] && map[x + ',' + y] === 'O' && map[x + ',' + (y - 1)] === '.'){
                            map[x + ',' + (y - 1)] = 'O';
                            map[x + ',' + y] = '.';
                            change = true;
                        }
                    }
                }
                // draw(map, lines.length, lines[0].length);
            }

            // West
            change = true;
            while (change) {
                change = false;
                for(let y = 0; y < lines.length; y++ ){
                    for(let x= 0; x < lines[0].length; x++){
                        
                        if (map[(x - 1) + ',' + y] && map[x + ',' + y] === 'O' && map[(x - 1) + ',' + y] === '.'){
                            map[(x - 1) + ',' + y] = 'O';
                            map[x + ',' + y] = '.';
                            change = true;
                        }
                    }
                }
                // draw(map, lines.length, lines[0].length);
            }

            // South
            change = true;
            while (change) {
                change = false;
                for(let y = 0; y < lines.length; y++ ){
                    for(let x= 0; x < lines[0].length; x++){
                        
                        if (map[x + ',' + (y + 1)] && map[x + ',' + y] === 'O' && map[x + ',' + (y + 1)] === '.'){
                            map[x + ',' + (y + 1)] = 'O';
                            map[x + ',' + y] = '.';
                            change = true;
                        }
                    }
                }
                // draw(map, lines.length, lines[0].length);
            }

            // East
            change = true;
            while (change) {
                change = false;
                for(let y = 0; y < lines.length; y++ ){
                    for(let x= 0; x < lines[0].length; x++){
                        
                        if (map[(x + 1) + ',' + y] && map[x + ',' + y] === 'O' && map[(x + 1) + ',' + y] === '.'){
                            map[(x + 1) + ',' + y] = 'O';
                            map[x + ',' + y] = '.';
                            change = true;
                        }
                    }
                }
                // draw(map, lines.length, lines[0].length);
            }

            let cycleWeight = weight(map, lines.length, lines[0].length);
            if (cycles % 10000 === 0) {
                console.log("Cycles: " + cycles + ", Weight: " + cycleWeight);
                draw(map, lines.length, lines[0].length);
            }

            cycles += 1;
            history[JSON.stringify(rockSpots)] = {
                map: JSON.stringify(map), 
                cycles: [cycles], 
                weight: cycleWeight
            }
        }

        // console.log(history);
        let weights = [];
        let candidates = [];
        // grab all the keys with >5 entries and diff the last two entries to get the period
        for(let key of Object.keys(history)) {
            weights.push(history[key].weight);
            if (history[key].cycles.length > 10){
                candidates.push({ 
                    'cycle': history[key].cycles[10], 
                    'period': history[key].cycles[10] - history[key].cycles[9], 
                    'weight': history[key].weight});
            }
        };
        console.log(JSON.stringify(weights));
        console.log(candidates);

        while (candidates[0].cycle < (1000000000 - 1)){
            let oneCandidate = candidates.shift();
            oneCandidate.cycle = oneCandidate.cycle + oneCandidate.period;
            candidates.push(oneCandidate);
            if (oneCandidate.cycle % 100000 === 0) console.log(oneCandidate.cycle);
        }
        console.log(candidates);
        // test cycles from below
       
        // { weight, firstAppearance, cycle}
        /*
        let testCycles = [
            [99621, 175, 9], 
            [99625, 176, 9], 
            [99652, 177, 9],
            [99654, 178, 9],
            [99646, 179, 9],
            [99641, 180, 9],
            [99630, 181, 9],
            [99623, 182, 9], 
            [99618, 183, 9], 
        ]
        console.log("Looking for a winner in " + testCycles);

        let start = 1000000000;
        while (start > 183) {
            start -= 9;
        }
        console.log(start);
        */
        // 99630 is not the right answer -- off by 1 error! it was 99641
        // 99623 -- too low? (fixed off by 1)

        
        return candidates[0].weight;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const weight = (map, maxY, maxX) => {
    // bottom up weight instead of top down
    let weight = 0;
    for(let y = maxY - 1; y >= 0; y--){
        for(let x = 0; x < maxX; x++){
            if (map[x +',' + y] === 'O') weight += maxY - y;
        }
    }
    return weight;
    /*
    let weight = 0;
    for(let y = 0; y < maxY; y++ ){
        for(let x= 0; x < maxX; x++){
            if (map[x +',' + y] === 'O') weight += maxY - y;
        }
    }
    return weight;
    */
}


start();


export default start;

 /*
        {
  '98585': [ 0 ],
  '98656': [ 1 ],
  '98849': [ 2 ],
  '99092': [ 3 ],
  '99323': [ 4 ],
  '99551': [ 5 ],
  '99595': [ 166 ],
  '99598': [ 165 ],
  '99614': [ 167 ],
  '99615': [ 174 ],
  '99618': [
    183, 192, 201,
    210, 219, 228,
    237, 246, 255
  ],
  '99621': [
    175, 184, 193, 202,
    211, 220, 229, 238,
    247, 256
  ],
  '99623': [
    182, 191, 200,
    209, 218, 227,
    236, 245, 254
  ],
  '99624': [ 164 ],
  '99625': [
    173, 176, 185, 194,
    203, 212, 221, 230,
    239, 248, 257
  ],
  '99628': [ 168, 169 ],
  '99630': [
    181, 190, 199,
    208, 217, 226,
    235, 244, 253
  ],
  '99632': [ 172 ],
  '99635': [ 170 ],
  '99637': [ 171 ],
  '99641': [
    180, 189, 198,
    207, 216, 225,
    234, 243, 252
  ],
  '99646': [
    179, 188, 197,
    206, 215, 224,
    233, 242, 251
  ],
  '99651': [ 163 ],
  '99652': [
    177, 186, 195,
    204, 213, 222,
    231, 240, 249
  ],
  '99654': [
    178, 187, 196,
    205, 214, 223,
    232, 241, 250
  ],
  '99672': [ 162 ],
  '99684': [ 153 ],
  '99685': [ 152, 154 ],
  '99687': [ 155 ],
  '99688': [ 161 ],
  '99692': [ 156 ],
  '99699': [ 157 ],
  '99700': [ 160 ],
  '99702': [ 158 ],
  '99706': [ 159 ],
  '99707': [ 151 ],
  '99728': [ 150 ],
  '99767': [ 149 ],
  '99788': [ 6 ],
  '99814': [ 148 ],
  '99852': [ 147 ],
  '99898': [ 146 ],
  '99934': [ 145 ],
  '99967': [ 144 ],
  '100011': [ 143 ],
  '100069': [ 142 ],
  '100118': [ 7, 141 ],
  '100183': [ 140 ],
  '100245': [ 139 ],
  '100310': [ 138 ],
  '100375': [ 137 ],
  '100399': [ 8 ],
  '100433': [ 136 ],
  '100482': [ 135 ],
  '100535': [ 134 ],
  '100572': [ 133 ],
  '100593': [ 132 ],
  '100611': [ 131 ],
  '100618': [ 9 ],
  '100622': [ 130 ],
  '100641': [ 129 ],
  '100652': [ 128 ],
  '100669': [ 127 ],
  '100683': [ 126 ],
  '100696': [ 125 ],
  '100721': [ 124 ],
  '100746': [ 123 ],
  '100777': [ 122 ],
  '100808': [ 10 ],
  '100826': [ 121 ],
  '100880': [ 120 ],
  '100924': [ 119 ],
  '100961': [ 11 ],
  '100966': [ 118 ],
  '100993': [ 117 ],
  '101027': [ 116 ],
  '101030': [ 12 ],
  '101048': [ 115 ],
  '101078': [ 114 ],
  '101104': [ 113 ],
  '101123': [ 112 ],
  '101128': [ 13 ],
  '101140': [ 111 ],
  '101153': [ 110 ],
  '101183': [ 109 ],
  '101215': [ 108 ],
  '101245': [ 14 ],
  '101257': [ 107 ],
  '101285': [ 106 ],
  '101318': [ 105 ],
  '101351': [ 15 ],
  '101355': [ 104 ],
  '101394': [ 103 ],
  '101413': [ 102 ],
  '101442': [ 101 ],
  '101475': [ 16 ],
  '101479': [ 100 ],
  '101520': [ 99 ],
  '101559': [ 98 ],
  '101594': [ 17 ],
  '101600': [ 97 ],
  '101646': [ 96 ],
  '101691': [ 95 ],
  '101712': [ 18 ],
  '101746': [ 94 ],
  '101791': [ 88 ],
  '101792': [ 85, 89 ],
  '101793': [ 86, 93 ],
  '101795': [ 87 ],
  '101800': [ 90 ],
  '101805': [ 91 ],
  '101807': [ 84 ],
  '101810': [ 92 ],
  '101830': [ 83 ],
  '101847': [ 19 ],
  '101853': [ 82 ],
  '101881': [ 81 ],
  '101893': [ 80 ],
  '101896': [ 78, 79 ],
  '101910': [ 77 ],
  '101937': [ 76 ],
  '101955': [ 75 ],
  '101960': [ 72 ],
  '101965': [ 73 ],
  '101970': [ 71, 74 ],
  '101991': [ 70 ],
  '101995': [ 20 ],
  '102021': [ 69 ],
  '102044': [ 68 ],
  '102053': [ 67 ],
  '102068': [ 66 ],
  '102091': [ 65 ],
  '102119': [ 21 ],
  '102128': [ 64 ],
  '102180': [ 63 ],
  '102222': [ 22 ],
  '102227': [ 62 ],
  '102277': [ 61 ],
  '102313': [ 60 ],
  '102322': [ 23 ],
  '102372': [ 59 ],
  '102431': [ 24, 58 ],
  '102501': [ 57 ],
  '102537': [ 25 ],
  '102574': [ 56 ],
  '102627': [ 26 ],
  '102634': [ 55 ],
  '102691': [ 54 ],
  '102709': [ 27 ],
  '102753': [ 53 ],
  '102808': [ 52 ],
  '102818': [ 28 ],
  '102861': [ 51 ],
  '102906': [ 50 ],
  '102907': [ 49 ],
  '102926': [ 48 ],
  '102940': [ 29 ],
  '102963': [ 47 ],
  '102992': [ 46 ],
  '103008': [ 30 ],
  '103017': [ 45 ],
  '103041': [ 31 ],
  '103045': [ 44 ],
  '103058': [ 32 ],
  '103061': [ 43 ],
  '103073': [ 33 ],
  '103083': [ 42 ],
  '103098': [ 41 ],
  '103114': [ 40 ],
  '103125': [ 39 ],
  '103129': [ 34, 38 ],
  '103165': [ 36 ],
  '103167': [ 35 ],
  '103170': [ 37 ]
}*/
