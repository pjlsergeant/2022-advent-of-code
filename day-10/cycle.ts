import { slurp } from '../utils';

const cycles = [1];

for ( const line of slurp() ) {
    const match = line.match(/(noop)|addx (-?\d+)/);
    // noop
    if ( match[1] ) {
        cycles.push( 0 );
    } else if ( match[2] ) {
        cycles.push( 0 );
        cycles.push( parseInt(match[2]) );
    }
}

let last = 0;
const summed = cycles.map( i => [ i, last += i ] );
const regAt = (i: number) => summed[i - 1][1];

let total1 = 0;
for ( const cycle of [ 20, 60, 100, 140, 180, 220] ) {
    const val = regAt( cycle );
    total1 += val * cycle;
}

let screen = '';
for ( let p = 1; p < cycles.length; p++ ) {
    const sprite = summed[p-1][1];
    const col = p % 40;

    console.log(`Starting cycle ${p}: begin executing ${summed[p][0]}, x is ${sprite}`);
    if ( [0,1,2].map( d => sprite + d ).includes(col) ) {
        screen += '#'
    } else {
        screen += '.'
    }
    if ( ! ( p % 40 ) ) {
        screen += '\n';
    }

    // console.log(`X: ${}`)
}

console.log( screen );