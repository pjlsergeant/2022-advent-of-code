import { slurp } from "../utils";

const rows = slurp();
const heights : number[][] = [];

type C = { x: number; y: number; debug?: string; };
const routes : Record< number, Record< number, C[] > > = {};
let fringe : C[] = [];

// Parse
for ( let y = 0; y < rows.length; y++ ) {
    heights.push(Array(rows.length));
    routes[y] = {};

    for ( let x = 0; x < rows[0].length; x++ ) {
        const height = rows[y].charCodeAt(x) - 97;
        if ( height === -14 ) {
            heights[y][x] = 'a'.charCodeAt(0) - 97;
        } else if ( height === -28 ) {
            routes[y][x] = [{ x, y }];
            fringe.push({ y, x });
            heights[y][x] = 'z'.charCodeAt(0) - 97;
        } else {
            heights[y][x] = height;
        }
    }
}

console.log({ fringe, heights });

let winner : C[];

// Find a route; this is as much A* as I remember from school
search:
while(fringe.length) {
    // // add a fringe sort step
    // fringe = fringe.sort( (a, b) => {
    //     const stepsA = Math.abs( a.x - goal.x ) + Math.abs( a.y - goal.y );
    //     const stepsB = Math.abs( b.x - goal.x ) + Math.abs( b.y - goal.y );
    //     return stepsA - stepsB;
    // } );
    // work it

    const target = fringe.shift();
    // Number of steps to get here from the origin
    const pathLength = routes[ target.y ][ target.x ].length;
    debug('target', {target, pathLength } );

    // Every possible direction we could head
    const directions : [ number, number, string ][] = [ [-1,0, '^'], [1,0, 'v'], [0,-1, '<'],[0,1, '>']]
    for ( const d of directions ) {
        // Coordinates
        const possible = { x: target.x + d[0], y: target.y + d[1], debug: d[2] };
        debug('possible', {possible});
        // Discard if that would be off piste
        if ( possible.x < 0 || possible.y < 0 || possible.x === rows[0].length || possible.y === rows.length ) {
            debug('off-piste');
            continue;
        }

        // Discard if that would be too steep
        if (( heights[possible.y][possible.x] - heights[target.y][target.x]) < -1 ) {
            debug('too steep', { from: heights[target.y][target.x], to: heights[possible.y][possible.x] } );
            continue;
        }

        // Do we have a shorter path there already?
        if ( routes[ possible.y ][ possible.x ]?.length <= pathLength + 1 ) {
            debug('shorter path');
            continue;
        }

        routes[ possible.y ][ possible.x ] = [
            ...routes[ target.y ][ target.x ],
            possible
        ];

        // WINNER
        if ( heights[possible.y][possible.x] === 0 ) {
            if ( ( ! winner ) || ( routes[ possible.y ][ possible.x ].length < winner.length ) ) {
                winner = routes[ possible.y ][ possible.x ];
            }
        }

        // Update the fringe
        fringe.push( possible );
    }
}

if ( ! winner ) {
    throw new Error("No route found");
}

// console.log( { winner, steps: winner.length - 1 } );
console.log( draw(winner) );
console.log( winner.length - 1 );

function draw( route: C[] ) {
    let map : string[][] = [];
    for ( let y = 0; y < rows.length; y++ ) {
        let row : string[] = [];
        map.push( row );
        for ( let x = 0; x < rows[0].length; x++ ) {
            row.push('.');
        }
    }

    let item = 0;
    for ( const step of route ) {
        map[ step.y ][step.x] = '*'; // String.fromCharCode( item++ + 97 );
    }

    return map.map( r => r.join('') ).join('\n');
}


function debug(str: string, args?: any) {
    console.log( str, args );
}