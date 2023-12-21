"use strict";
import * as fs from 'fs';

const start = (): void => {
    console.log(solve_pt1());
    console.log(solve_pt2());
};



const solve_pt1 = () => {
    try {
        let data = fs.readFileSync('src/input.dec20.txt', 'utf8');
        const lines = data.split('\n');
        let modules = {};
        for(let line of lines){
            let parts = line.split(' -> ');
            let type = 'bro';
            let on = false;
            let register = {};
            if (parts[0][0] === '%') {
                parts[0] = parts[0].replace('%', '');
                type = 'ff';
            }
            if (parts[0][0] === '&') {
                parts[0] = parts[0].replace('&', '');
                type = 'con'
            }            

            modules[parts[0]] = {type: type, on, register, targets: parts[1].split(',').map(o => o.trim())};
        }
        // set up default con registers
        for(let keyOne of Object.keys(modules)){
            if (modules[keyOne]["type"] !== "con") continue;
            for (let keyTwo of Object.keys(modules)){
                if (keyOne === keyTwo) continue;
                let targets = modules[keyTwo]["targets"].filter(o => o === keyOne);
                if (targets.length > 0) modules[keyOne]["register"][keyTwo] = 'low';
            }
        }

        let high = 0;
        let low = 0;
        // console.log(modules);
        for(let i = 0; i < 10000000; i++){
            let oneResult = pulse('button|low|broadcaster', modules);
            // console.log(oneResult);
            high += oneResult.highCount;
            low += oneResult.lowCount;
        }
        // console.log(modules);
        console.log({high, low});
        console.log(high * low);
        

        return high * low;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const pulse = (input, modules) => {
    let pulses = [input];
    let lowCount = 0;
    let highCount = 0;
    let rx = false;
    while(pulses.length > 0) {
        let pulse = pulses.shift();
        // console.log(pulse);
        let dest = pulse.split('|')[2];
        let module = modules[dest];
        let freq = pulse.split('|')[1];
        if (freq === 'low') lowCount += 1;
        else highCount += 1;
        if (!module) {
            // test / output modules
            if (dest === 'rx' && freq === 'low') {
                console.log("@@@@@@ " + pulse);
                rx = true;
                break;
            }
            continue;
        }
        if (module.type === 'bro'){
            module.targets.forEach(o => pulses.push(dest + "|" + freq + "|" + o));
        } else if (module.type === 'ff'){
            if (freq === 'high') continue;
            module.on = !module.on;
            if (module.on) module.targets.forEach(o => pulses.push(dest + "|high|" + o));
            else module.targets.forEach(o => pulses.push(dest + "|low|" + o));
        } else if (module.type === 'con') {
            let source = pulse.split('|')[0];
            module.register[source] = freq;

            let allHigh = true;
            for(let oneRegister of Object.values(module.register)){
                if (oneRegister !== 'high') {
                    allHigh = false;
                    break;
                }
            }
            if (allHigh) module.targets.forEach(o => pulses.push(dest + "|low|" + o));
            else module.targets.forEach(o => pulses.push(dest + "|high|" + o));
        } 
    }
    return {lowCount, highCount, rx};
}


const solve_pt2 = () => {
    try {
        // let data = fs.readFileSync('src/input.dec20.txt', 'utf8');
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