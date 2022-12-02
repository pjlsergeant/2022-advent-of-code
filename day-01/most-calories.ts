import { slurp } from '../utils';

const lines = slurp('./day-01/input.txt');
const elves = [0];
for ( const val of lines ) {
    if ( val.length ) {
        elves[0] += parseInt( val );
    } else {
        elves.unshift(0);
    }
}

elves.sort((a,b) => b - a);

const topElf = elves[0];
const topElves = [0, 1, 2].reduce( ( total, i ) => total += elves[i], 0);

console.log({ topElf, topElves });
