"use strict";
import * as fs from 'fs';

const start = (): void => {
    console.log(solve_pt1());
    // console.log(solve_pt2());
};



const solve_pt1 = () => {
    try {
        let data = fs.readFileSync('src/input.dec7.txt', 'utf8');
        const lines = data.split('\n');
        let hands = [];
        for(let line of lines){
            let parts = line.split(' ');
            hands.push({
                'hand': parts[0], 
                'bid': parseInt(parts[1]), 
                'rank': 0
            })
        }
        for(let i = 0; i < hands.length; i++){
            hands[i].rank = handEvaluator(hands[i].hand);
            // console.log(hands[i]);
        }
        hands.sort((h1,h2) => {
            if (h1.rank > h2.rank) {
                return 1;
            }
        
            if (h1.rank < h2.rank) {
                return -1;
            }

            for(let i = 0; i < h1.hand.length; i++){
                let tiebreak = cardEvaluator(h1.hand[i], h2.hand[i]);
                if (tiebreak !== 0) return tiebreak;
            }
            
        });
        let winnings = 0;
        for(let i = 0; i < hands.length; i++){
            console.log(hands[i]);
            winnings += hands[i].bid * (i + 1);
        }

        return winnings;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
    // 249573028
}

let cardEvaluator = (card1 : string, card2: string) => {
    let card1Value = 0;
    let card2Value = 0;
    if (card1 === 'A') card1Value = 14;
    else if (card1 === 'K') card1Value = 13;
    else if (card1 === 'Q') card1Value = 12;
    else if (card1 === 'J') card1Value = 1;  // part 2
    else if (card1 === 'T') card1Value = 10;
    else card1Value = parseInt(card1);
    if (card2 === 'A') card2Value = 14;
    else if (card2 === 'K') card2Value = 13;
    else if (card2 === 'Q') card2Value = 12;
    else if (card2 === 'J') card2Value = 1; // part 2
    else if (card2 === 'T') card2Value = 10;
    else card2Value = parseInt(card2);
    if (card1Value > card2Value) return 1;
    if (card1Value < card2Value) return -1;
    return 0;
}

let handEvaluator = (hand: string) => {
    // pt2
    let updatedHand = hand;
    if (updatedHand.split('').filter( o => o === 'J').length > 0) {
        let cards = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
        let wilds = cards.map(o => handEvaluator(updatedHand.replace('J', o).replace('J', o).replace('J', o).replace('J', o).replace('J', o)));
        // console.log(wilds);
        let bestWild = 0;
        for(let i = 0; i < wilds.length; i++){
            if (wilds[i] > wilds[bestWild]) {
                bestWild = i;
            }
        }
        updatedHand = updatedHand.replace('J', cards[bestWild]).replace('J', cards[bestWild]).replace('J', cards[bestWild]).replace('J', cards[bestWild]).replace('J', cards[bestWild])
        // console.log(updatedHand);
    } 
    
    let counts = {};
    updatedHand.split('').forEach(o => !counts[o] ? counts[o] = 1 : counts[o] = counts[o] + 1);
    console.log(counts);
    let copies = Object.values(counts);
    // Values:  
    // 5ok = 10000
    // 4ok = 5000
    // FH = 1000
    // 3ok = 500
    // 2P = 250
    // P = 100
    // HC = 0
    if (copies.indexOf(5) > -1) return 10000;
    else if (copies.indexOf(4) > -1) return 5000;
    else if (copies.indexOf(3) > -1 && copies.indexOf(2) > -1) return 1000;
    else if (copies.indexOf(3) > -1) return 500;
    else if (copies.filter(o => o === 2).length === 2) return 250;
    else if (copies.indexOf(2) > -1) return 100;

    else return 0;
}

/*
const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.dec7.txt', 'utf8');
        const lines = data.split('\n');
        console.log(lines);

        return 0;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}
*/



start();


export default start;