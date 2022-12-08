// 06:50
import { slurp } from '../utils'

const forest = slurp();
const trees = forest.map( r => r.split('') );

const height = forest.length;
const width = forest[0].length;

type C = { x: number; y : number};
let visible : C[] = [];

function range(from: number, to: number): number[] {
    let r = [];
    if ( from > to ) {
        for (let x = from - 1; x >= to; x-- ) {
            r.push( x );
        }
    } else {
        for (let x = from + 1; x <= to; x++ ) {
            r.push( x );
        }
    }
    return r;
}

let total2 = 0;

for ( let y = 0; y < height; y++ ) {
    for (let x = 0; x < width; x++ ) {

        const treeHeight = trees[y][x];

        const northBlocker = range( y, 0 ).reduce( (v, h) => v ? v : (trees[h][x] >= treeHeight) ? Math.abs( y - h ) : null, null );
        const viewNorth = northBlocker ? northBlocker : y;

        const southBlocker = range( y, height - 1 ).reduce( (v, h) => v ? v : (trees[h][x] >= treeHeight) ? Math.abs( y - h ) : null, null );
        const viewSouth = southBlocker ? southBlocker : ((height - 1) - y);

        const eastBlocker = range( x, 0 ).reduce( (v, h) => v ? v : (trees[y][h] >= treeHeight) ? Math.abs( x - h ) : null, null );
        const viewEast = eastBlocker ? eastBlocker : x;

        const westBlocker = range( x, width -1 ).reduce( (v, h) => v ? v : (trees[y][h] >= treeHeight) ? Math.abs( x - h ) : null, null );
        const viewWest = westBlocker ? westBlocker : ((width - 1) - x);


        let isVisible = northBlocker === null || southBlocker === null || eastBlocker === null || westBlocker === null;
        if ( isVisible ) {
            visible.push({x, y});
        }

        const scenic = viewNorth * viewSouth * viewEast * viewWest;
        if ( scenic > total2 ) {
            total2 = scenic;
        }
    }
}

console.log({ total1: visible.length, total2 });