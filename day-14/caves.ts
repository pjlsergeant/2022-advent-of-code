import { slurp } from "../utils";

type V = [ x: number, y: number ];
type O = '#' | 'o' | '-';

class ElfMap {
    data: Record< number, Record< number, O >> = {};

    minY: number;
    maxY: number;
    minX: number;
    maxX: number;

    constructor() {}

    set(x: number, y: number, what: O ) {
        this.updateBounds( x, y );
        if ( ! this.data[x] ) this.data[x] = {};
        this.data[x][y] = what;
    }

    get( x: number, y:number): O {
        return this.data[x]?.[y];
    }

    draw(): string {
        let image = '';
        for ( let y = this.minY; y <= this.maxY; y++ ) {
            for ( let x = this.minX; x <= this.maxX; x++ ) {
                image += this.data[x]?.[y] ?? '.'
            }
            image += '\n';
        }
        return image;
    }

    updateBounds(x: number, y:number) {
        if ( typeof this.minY === "undefined" ) {
            this.minY = y;
            this.maxY = y;
        }
        if ( typeof this.minX === "undefined" ) {
            this.minX = x;
            this.maxX = x;
        }
        if ( x > this.maxX ) this.maxX = x;
        if ( x < this.minX ) this.minX = x;
        if ( y > this.maxY ) this.maxY = y;
        if ( y < this.minY ) this.minY = y;
    }
}

function range( from: V, to: V ) : V[] {
    let makeNew : (i: number) => V;
    let bounds : V;

    if ( from[0] === to[0] ) {
        makeNew = (y: number) : V => [ from[0], y ];
        bounds = [ from[1], to[1] ].sort() as V;
    } else if ( from[1] === to[1]) {
        makeNew = (x: number) : V => [ x, from[1] ];
        bounds = [ from[0], to[0] ].sort() as V;
    } else {
        console.error( { from, to });
        throw new Error("diag");
    }

    let range : V[] = [];
    for ( let i = bounds[0]; i <= bounds[1]; i++ ) {
        range.push( makeNew(i) );
    }

    return range;
}

const em = new ElfMap();
const lines = slurp();
for ( const line of lines ) {
    const coords = line.split(/ -> /).map( c => c.split(',').map( c => parseInt(c)) ) as V[];
    let head = coords.shift();
    for ( const point of coords ) {
        range( head, point ).forEach( v => em.set( ...v, '#' ) );
        head = point;
    }
}

let floor = em.maxY + 2;
let total1 = 0;
while ( ! em.get( 500, 0 ) ) {
    if ( addSand([500, 0], em) ) {
        total1++;
    }
}

console.log( em.draw() );
console.log( total1 );

function addSand( point : V, em: ElfMap ) : boolean {
    if ( point[1] >= floor ) {
        em.set( ...point, '-' );
        return false;
    }

    for ( const dir of [[0,1],[-1,1],[1,1]] ) {
        const newPoint : V = [ point[0] + dir[0], point[1] + dir[1] ];
        if ( ! em.get( ...newPoint ) ) {
            // it's free, recurse
            return addSand( newPoint, em );
        }
    }

    // it's blocked, add it in
    em.set( ...point, 'o' );
    return true;
}
