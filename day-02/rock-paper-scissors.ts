import { slurp } from '../utils';

type Element = "rock" | "paper" | "scissors";

const shapeScore : Record< Element, number > = {
    rock: 1,
    paper: 2,
    scissors: 3
};

const rules : Record< Element, Element[] > = {
    rock: ['paper', 'rock', 'scissors'],
    paper: ['scissors', 'paper', 'rock'],
    scissors: ['rock', 'scissors', 'paper'],
}

// 1 if a wins, -1 if b wins, 0 if a draw
function play( a: Element, b: Element ) {
    return rules[a].indexOf(b) - 1;
}

function playScore( me: Element, them: Element ) {
    const result = play( me, them );
    const score = (result * 3) + 3;
    return score;
}

const elfDecoder : { [id: string]: Element } = {
    A: 'rock',
    B: 'paper',
    C: 'scissors',
};

const myDecoder : { [id: string]: Element } = {
    X: 'rock',
    Y: 'paper',
    Z: 'scissors',
};

const myStrategy : { [id: string]: -1 | 0 | 1 } = {
    X: 1,
    Y: 0,
    Z: -1,
};

const lines : [keyof typeof elfDecoder, keyof typeof myDecoder][] = slurp().map( l => l.split(/ /)) as any;

let part1total = 0;
let part2total = 0;

for ( const line of lines ) {
    const them = elfDecoder[ line[0] ];

    // part 1
    {
        const me = myDecoder[ line[1] ];
        const myScore = playScore( me, them ) + shapeScore[ me ];
        part1total += myScore;
    }

    // part 2
    {
        const strategy = myStrategy[ line[1] ];
        const me = rules[ them ][ 1 + strategy ];
        const myScore = playScore( me, them ) + shapeScore[ me ];
        // console.log("Go", {me, them, strategy, myScore});
        part2total += myScore;
    }
}

console.log( "results", { part1total, part2total } );