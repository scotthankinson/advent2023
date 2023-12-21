"use strict";
import * as fs from 'fs';

const start = (): void => {
    console.log(solve_pt1());
    console.log(solve_pt2());
};



const solve_pt1 = () => {
    if (1 === 1) return 0;
    try {
        let data = fs.readFileSync('src/input.dec19.txt', 'utf8');
        const lines = data.split('\n');
        let workflows = {};
        let parts = [];
        let onWorkflows = true;

        for (let line of lines) {
            if (line.length === 0) {
                onWorkflows = false;
                continue;
            }

            if (onWorkflows) {
                let ruleName = line.split('{')[0];
                let ruleValue = [];
                line.split('{')[1].replace('}', '').split(",").forEach(o => {
                    let oneRule = { 'leftOperand': '', 'rightOperand': 0, 'operator': '', 'destination': '', 'default': '' }
                    if (o.split(':').length === 1) {
                        oneRule.default = o;
                    } else {
                        let check = o.split(':')[0];
                        // Looks like only < and > are allowed
                        if (check.indexOf('<') > -1) {
                            oneRule.operator = '<';
                            oneRule.leftOperand = check.split('<')[0];
                            oneRule.rightOperand = parseInt(check.split('<')[1]);
                        } else if (check.indexOf('>') > -1) {
                            oneRule.operator = '>';
                            oneRule.leftOperand = check.split('>')[0];
                            oneRule.rightOperand = parseInt(check.split('>')[1]);
                        } else {
                            console.log("!!!!!!!!!!!!  Found a new operator");
                        }
                        oneRule.destination = o.split(':')[1];
                    }
                    // console.log(JSON.stringify(oneRule));
                    ruleValue.push(oneRule);
                });
                workflows[ruleName] = ruleValue;
            }
            else {
                let part = {};
                line = line.replace('{', '').replace('}', '');
                line.split(',').forEach(o => {
                    part[o.split('=')[0]] = parseInt(o.split('=')[1]);
                });
                // console.log(part);
                parts.push(part);
            }
        }

        // console.log(Object.keys(workflows));
        let accepted = [];
        for (let part of parts) {
            let currentWorkflow = workflows['in'];
            // console.log(part);
            while (true) {
                let destination = '';
                // console.log(JSON.stringify(currentWorkflow));
                for (let i = 0; i < currentWorkflow.length; i++) {
                    let currentRule = currentWorkflow[i];
                    if (currentRule.default.length > 0) {
                        destination = currentRule.default;
                    } else {
                        let left = part[currentRule.leftOperand];
                        let condition = false;
                        if (currentRule.operator === '>') {
                            condition = left > currentRule.rightOperand;
                        } else {
                            condition = left < currentRule.rightOperand;
                        }
                        if (condition) {
                            console.log("(" + currentRule.leftOperand + currentRule.operator + currentRule.rightOperand + ") ");
                            destination = currentRule.destination;
                            break;
                        } else {
                            console.log("!(" + currentRule.leftOperand + currentRule.operator + currentRule.rightOperand + ") ");
                        }
                    }
                }
                console.log("Reached destination " + destination);
                if (destination === 'R') {
                    break;
                } else if (destination === 'A') {
                    // console.log('Accepted ' + JSON.stringify(part));
                    accepted.push(part);
                    break;
                } else {
                    currentWorkflow = workflows[destination];
                }
            }
        }

        let result = 0;
        accepted.forEach(o => {
            result += o.x;
            result += o.m;
            result += o.a;
            result += o.s;
        });
        // console.log(accepted);
        console.log(parts);

        return result;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}


const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.dec19.txt', 'utf8');
        let lines = data.split('\n');
        let workflows = {};
        let values = { x: new Set(), m: new Set(), a: new Set(), s: new Set() };
        lines = simplify(lines);
        // for(let line of lines) console.log(line);
        // if (1 === 1) return 0;
        
        for (let line of lines) {
            if (line.length === 0) {
                break;
            }

            let ruleName = line.split('{')[0];
            let ruleValue = [];
            line.split('{')[1].replace('}', '').split(",").forEach(o => {
                let oneRule = { 'leftOperand': '', 'rightOperand': 0, 'operator': '', 'destination': '', 'default': '' }
                if (o.split(':').length === 1) {
                    oneRule.default = o;                    
                } else {
                    let check = o.split(':')[0];
                    oneRule.destination = o.split(':')[1];
                    // Looks like only < and > are allowed
                    if (check.indexOf('<') > -1) {
                        // a < 2500
                        oneRule.operator = '<';
                        oneRule.leftOperand = check.split('<')[0];
                        oneRule.rightOperand = parseInt(check.split('<')[1]);
                        if (oneRule.destination === 'R') {
                            values[oneRule.leftOperand].add(oneRule.rightOperand);
                        } else {
                            values[oneRule.leftOperand].add(oneRule.rightOperand);
                            values[oneRule.leftOperand].add(oneRule.rightOperand - 1);
                        }
                        
                    } else if (check.indexOf('>') > -1) {
                        // a > 2500
                        oneRule.operator = '>';
                        oneRule.leftOperand = check.split('>')[0];
                        oneRule.rightOperand = parseInt(check.split('>')[1]);
                        if (oneRule.destination === 'R') {
                            values[oneRule.leftOperand].add(oneRule.rightOperand);
                        } else {
                            values[oneRule.leftOperand].add(oneRule.rightOperand);
                            values[oneRule.leftOperand].add(oneRule.rightOperand + 1);
                        }
                    } else {
                        console.log("!!!!!!!!!!!!  Found a new operator");
                    }
                }
                // console.log(JSON.stringify(oneRule));
                ruleValue.push(oneRule);
            });
            workflows[ruleName] = ruleValue;
            
        }

        // console.log(Object.keys(workflows).length);

        // console.log(values);
        let evalStrings = new Set<string>();
        console.log("Found " + values['x'].size * values['m'].size * values['a'].size * values['s'].size + " interesting coordinates");
        let xArray = Array.from(values['x'].values());
        let mArray = Array.from(values['m'].values());
        let aArray = Array.from(values['a'].values());
        let sArray = Array.from(values['s'].values());
        // console.log(values);
        for (let x = 0; x < values['x'].size; x++) {
            console.log("Permutations for x = " + (x + 1) + " of " + values['x'].size + ", " + evalStrings.size + " constraints");
            for (let m = 0; m < values['m'].size; m++) {
                for (let a = 0; a < values['a'].size; a++) {
                    for (let s = 0; s < values['s'].size; s++) {
                        let part = { x: xArray[x], m: mArray[m], a: aArray[a], s: sArray[s] };
                        // console.log(part);

                        let partValues = evaluatePart(workflows, part);
                        if (partValues.accepted) {
                            evalStrings.add(partValues.evalString);
                        }
                    }
                }
            }
        }

        console.log(evalStrings);

        let possible = 0;
        for (let oneEval of evalStrings) {
            let evalParts = oneEval.split(" && ");
            let [minX, minM, minA, minS] = [1, 1, 1, 1];
            let [maxX, maxM, maxA, maxS] = [4000, 4000, 4000, 4000];
            for (let i = 0; i < evalParts.length; i++) {
                // rule-specific constraints
                // console.log(evalParts[i]);
                if (evalParts[i][0] === '!') {
                    // !(a > 2500)
                    // !(a < 2500)
                    let oneEval = evalParts[i].replace('!', '').replace('(', '').replace(')', '');
                    if (oneEval.indexOf('>') > -1) {
                        let oneEvalParts = oneEval.split('>');
                        let oneEvalLeftOperand = oneEvalParts[0];
                        let oneEvalRightOperand = parseInt(oneEvalParts[1]);
                        if (oneEvalLeftOperand === 'x') maxX = oneEvalRightOperand;
                        if (oneEvalLeftOperand === 'm') maxM = oneEvalRightOperand;
                        if (oneEvalLeftOperand === 'a') maxA = oneEvalRightOperand;
                        if (oneEvalLeftOperand === 's') maxS = oneEvalRightOperand;
                    } else {
                        let oneEvalParts = oneEval.split('<');
                        let oneEvalLeftOperand = oneEvalParts[0];
                        let oneEvalRightOperand = parseInt(oneEvalParts[1]);
                        if (oneEvalLeftOperand === 'x') minX = oneEvalRightOperand;
                        if (oneEvalLeftOperand === 'm') minM = oneEvalRightOperand;
                        if (oneEvalLeftOperand === 'a') minA = oneEvalRightOperand;
                        if (oneEvalLeftOperand === 's') minS = oneEvalRightOperand;
                    }
                } else {
                    // (a > 2500)
                    // (a < 2500)
                    let oneEval = evalParts[i].replace('!', '').replace('(', '').replace(')', '');
                    if (oneEval.indexOf('>') > -1) {
                        let oneEvalParts = oneEval.split('>');
                        let oneEvalLeftOperand = oneEvalParts[0];
                        let oneEvalRightOperand = parseInt(oneEvalParts[1]);
                        if (oneEvalLeftOperand === 'x') minX = Math.max(minX, oneEvalRightOperand + 1);
                        if (oneEvalLeftOperand === 'm') minM = Math.max(minM, oneEvalRightOperand + 1);
                        if (oneEvalLeftOperand === 'a') minA = Math.max(minA, oneEvalRightOperand + 1);
                        if (oneEvalLeftOperand === 's') minS = Math.max(minS, oneEvalRightOperand + 1);
                    } else {
                        let oneEvalParts = oneEval.split('<');
                        let oneEvalLeftOperand = oneEvalParts[0];
                        let oneEvalRightOperand = parseInt(oneEvalParts[1]);
                        if (oneEvalLeftOperand === 'x') maxX = Math.min(maxX, oneEvalRightOperand - 1);
                        if (oneEvalLeftOperand === 'm') maxM = Math.min(maxM, oneEvalRightOperand - 1);
                        if (oneEvalLeftOperand === 'a') maxA = Math.min(maxA, oneEvalRightOperand - 1);
                        if (oneEvalLeftOperand === 's') maxS = Math.min(maxS, oneEvalRightOperand - 1);
                    }
                }
            }
            let localPossibility = (maxX - minX + 1) * (maxM - minM + 1) * (maxA - minA + 1) * (maxS - minS + 1);
            console.log("Local possibility for " + oneEval + " is " + localPossibility);
            // console.log([minX, maxX, minM, maxM, minA, maxA, minS, maxS]);
            possible += localPossibility;
        }

        // Test input:        167,409,079,868,000
        // Expected:          167,409,079,868,000
        
        // Actual input:
        //                          16,475,804,400
        //                          15,222,564,720
        //                          2 minutes per [x], 355 [x] values = 14ish hours, 75,734,400 per x
        //                          x : constraints
        //                          0-30 : 375
        //                          30: 375
        //                          31: 376
        //                          35: 377
        //                          41: 378
        //                          43: 382
        //                          46: 394
        //                          48: 395
        //                          52: 401
        //                          56: 402
        //                          60: 405
        //                          62: 406
        //                          75: 410
        //                          77: 411
        //                          92 : 412
        //                          103 : 413
        //                          104: 414
        //                          129: 418
        //                          160 : 419
        //                          185 : 420
        //                          230 : 421
        //                          267 : 422
        //                          292 : 424
        //                          141882534122898

        return possible;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}

const simplify = (lines) => {
    let workflows = {};
    for (let line of lines) {
        if (line.length === 0) {
            break;
        }

        let ruleName = line.split('{')[0];
        let ruleValue = [];
        line.split('{')[1].replace('}', '').split(",").forEach(o => {
            ruleValue.push(o);
        });
        workflows[ruleName] = ruleValue;
    }

    let toPrune = [];
    // per previous outputs, each instruction is only ever called from one place -- simplify formulas
    for(let key of Object.keys(workflows)) {   
        while (workflows[key][workflows[key].length -1] !== 'A' && workflows[key][workflows[key].length -1] !== 'R' && workflows[key][workflows[key].length -1].indexOf(':') === -1) {
            let tail = workflows[key].pop();
            workflows[tail].forEach(o => workflows[key].push(o));
            toPrune.push(tail);
        }        
    }
    toPrune.forEach(o => delete workflows[o]);

    // all workflows now end in 'A' or 'R' -- make them explicit conditions
    // real puzzle has overlapping rule names (ab, abc, xy, xyz) so match whole string    
    toPrune = [];
    for(let key of Object.keys(workflows)) { 
        console.log("AR Checks IN " + key + ": " + workflows[key]);
        if (workflows[key].length === 1) {
            toPrune.push(key);
        } else if(workflows[key][workflows[key].length - 1] === 'A' || workflows[key][workflows[key].length - 1] === 'R') {
            let tail = workflows[key].pop();
            let last = workflows[key][workflows[key].length - 1];
            if (last.indexOf('>') > -1) {
                let lastParts = last.split('>');
                last = lastParts[0] + '<' + (parseInt(lastParts[1]) + 1) + ':' + tail;
            } else {
                let lastParts = last.split('<');
                last = lastParts[0] + '>' + (parseInt(lastParts[1]) - 1) + ':' + tail;
            }
            if (last.split(':')[1] === workflows[key][workflows[key].length - 1].split(':')[1]) {                
                // added an A:A or an R:R
                workflows[key].pop();
                last = tail;
            }
            workflows[key].push(last);
        } else if (workflows[key].length > 1) {
            // A:A or R:R resulting from simplification
            // qnx{m<291:R,m>290:R} ==> qnx{R}
            let last = workflows[key][workflows[key].length - 1];
            let penultimate = workflows[key][workflows[key].length - 2];
            if (last.split(':')[1] === penultimate.split(':')[1]) {
                let lastNumber = 0;
                let lastLetter = '';
                let lastSymbol = '';
                if (last.indexOf('>') > -1){
                    lastLetter = last.split(':')[1].split('>')[0];
                    lastNumber = parseInt(last.split(':')[0].split('>')[1]);
                    lastSymbol = '>';
                } else {
                    lastLetter = last.split(':')[1].split('<')[0];
                    lastNumber = parseInt(last.split(':')[0].split('<')[1]);
                    lastSymbol = '<';
                }

                let penNumber = 0;
                let penLetter = '';
                let penSymbol = '';
                if (penultimate.indexOf('>') > -1){
                    penLetter = penultimate.split(':')[1].split('>')[0];
                    penNumber = parseInt(penultimate.split(':')[0].split('>')[1]);
                    penSymbol = '>';
                } else {
                    penLetter = penultimate.split(':')[1].split('<')[0];
                    penNumber = parseInt(penultimate.split(':')[0].split('<')[1]);
                    penSymbol = '<';
                }
                if (penSymbol !== lastSymbol && penLetter === lastLetter){
                    // Single letter created by upstream replacement
                    if (Math.abs(lastNumber - penNumber) === 1) {
                        workflows[key].pop();
                        workflows[key].pop();
                        workflows[key].push(lastLetter);
                    }
                }
            }
        }
        console.log("AR Checks OUT " + key + ": " + workflows[key]);
    }

    console.log("Pruning: " );
    console.log(toPrune);
    toPrune.forEach(o => {
        for(let key of Object.keys(workflows)) {
            // console.log("Looking for " + o + " in " + key + ":" + workflows[key]);
            // console.log("Replace with " + workflows[o]);
            for(let i = 0; i < workflows[key].length; i++) {
                if (workflows[key][i].split(':')[1] === o){
                    workflows[key][i] = workflows[key][i].replace(':' + o, ':' + workflows[o][0]);
                }
                
            }
        }
        delete workflows[o];    
    });

    
    // console.log(workflows);
    let restored = [];
    let tryAgain = false;
    Object.keys(workflows).forEach(key => {
        let oneRestore = key + "{" + workflows[key].join(',') + "}";
        restored.push(oneRestore)
        if (workflows[key][workflows[key].length -1] === 'A') tryAgain = true;
        if (workflows[key][workflows[key].length -1] === 'R') tryAgain = true;
    });
    // console.log(restored);
    if (tryAgain) return simplify(restored);
    else return restored;
}


const evaluatePart = (workflows, part) => {
    let accepted = false;
    let currentWorkflow = workflows['in'];
    let path = ['in'];
    let evalString = '';
    // console.log(part);
    while (true) {
        let destination = '';
        // console.log(currentWorkflow);
        for (let i = 0; i < currentWorkflow.length; i++) {
            let currentRule = currentWorkflow[i];
            if (currentRule.default.length > 0) {
                destination = currentRule.default;
            } else {
                let left = part[currentRule.leftOperand];
                let condition = false;
                if (currentRule.operator === '>') {
                    condition = left > currentRule.rightOperand;
                } else {
                    condition = left < currentRule.rightOperand;
                }
                if (condition) {
                    evalString += "(" + currentRule.leftOperand + currentRule.operator + currentRule.rightOperand + ") && ";
                    destination = currentRule.destination;
                    break;
                } else {
                    evalString += "!(" + currentRule.leftOperand + currentRule.operator + currentRule.rightOperand + ") && "
                }
            }
        }
        // console.log("Reached destination " + destination);
        path.push(destination);
        if (destination === 'R') {
            break;
        } else if (destination === 'A') {
            accepted = true;
            break;
        } else {
            currentWorkflow = workflows[destination];
            
            // if (!currentWorkflow){
                //console.log("@@@@@@@@@@@@@@@");
                //console.log(workflows);
                //console.log(currentWorkflow);
                //console.log(destination);
            //}
        }
    }
    evalString = evalString.substring(0, evalString.length - 4)
    return { accepted, path, evalString };
}

start();


export default start;