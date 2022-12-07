import { slurp } from "../utils";

const line = slurp()[0];

let final : number;
const markerSize = 14;

for ( let i = 0; i < line.length; i++ ) {
    const set = new Set( line.substring( i, i + markerSize ).split('') );
    if ( set.size == markerSize ) {
        final = i + markerSize;
        break;
    }
}

console.log( final );