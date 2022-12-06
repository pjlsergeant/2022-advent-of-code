import { slurp } from "../utils";

const lines = slurp();
const line = lines[0];

let final : number;
const markerSize = 14;

for ( let i = 0; i < line.length; i++ ) {
    const set = new Set( line.substring( i, i + markerSize ).split('') );
    console.log( set );
    const uniq = set.size;
    if ( uniq == markerSize ) {
        final = i + markerSize;
        break;
    }
}

console.log( final );