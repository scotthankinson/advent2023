"use strict";
import * as fs from 'fs';

const start = (): void => {
    // console.log(solve_pt1());
    console.log(solve_pt2());
};


/*
const solve_pt1 = () => {
    try {
        let data = fs.readFileSync('src/input.dec4.txt', 'utf8');
        const lines = data.split('\n');
        let cards = [];
        let total = 0;
        for(let line of lines) {
            let parts = line.split(': ')[1].split(' | ');
            let card = {'winners': parts[0].split(' ').filter(o => o.trim().length > 0), 'candidates': parts[1].split(' ').filter(o => o.trim().length > 0), 'matches': [], 'value': 0}
            for(let winner of card.winners){
                if (card.candidates.indexOf(winner) >= 0) card.matches.push(winner);
            }
            for(let i = 0; i < card.matches.length; i++){
                if (card.value === 0) card.value = 1;
                else card.value = card.value * 2;
            }
            total = total + card.value;
            console.log(card);
            cards.push(card);
        }
        return total;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}*/



const solve_pt2 = () => {
    try {
        let data = fs.readFileSync('src/input.dec4.txt', 'utf8');
        const lines = data.split('\n');
        let cards = [];
        for(let line of lines) {
            let parts = line.split(': ')[1].split(' | ');
            let card = {
                'card': line.split(': ')[0], 
                'winners': parts[0].split(' ').filter(o => o.trim().length > 0), 
                'candidates': parts[1].split(' ').filter(o => o.trim().length > 0), 
                'matches': [], 
                'copies': 1 
            }
            for(let winner of card.winners){
                if (card.candidates.indexOf(winner) >= 0) card.matches.push(winner);
            }
            cards.push(card);
        }

        let checkedCards = [];
        while (cards.length > 0) {
            let currentCard = cards.shift();
            checkedCards.push(currentCard);
            for(let i = 0; i < currentCard.copies; i++){
                for(let j = 0; j < currentCard.matches.length; j++){
                    cards[j].copies += 1;
                }
            }
        }
        let totalCards = 0;
        for(let card of checkedCards) {
            totalCards += card.copies;
        }
        console.log(cards);
        return totalCards;
    } catch (e) {
        console.log('Error:', e.stack);
    }
    return -1;
}



start();


export default start;