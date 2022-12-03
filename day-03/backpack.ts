import { slurp } from '../utils';

function priority(char: string) {
    let asciiVal = char.charCodeAt(0);
    return asciiVal < 97 ? asciiVal - 38 : asciiVal - 96;
}

const lines = slurp();
let total1 : number = 0;
let total2 : number = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const halfway = Math.floor( line.length / 2 );
    const c1 = line.substring( 0, halfway );
    const c2 = line.substring( halfway );

    const dupes = new Set( c1.split('').filter( i => c2.includes(i) ) );
    const dupeValues = Object.fromEntries( Array.from( dupes ).map( i => [ i, priority(i )]));
    total1 += Object.values( dupeValues ).reduce( (p,c) => p + c, 0 );

    // every third line
    if ( ! ((i + 1) % 3) ) {
        const [ l1, l2, l3 ] = [0,1,2].map( j => lines[ i - j ] );
        const badge = l1.split('').find( j => l2.includes(j) && l3.includes(j) );
        total2 += priority(badge);
    }
}

console.log( "Total1", total1 );
console.log( "Total1", total2 );