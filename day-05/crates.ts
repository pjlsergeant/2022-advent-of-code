import { slurp } from "../utils";

const lines = slurp();

let mode = Symbol('crates');

const stacks : string[][] = [];

for (const line of lines) {
    if ( line.match(/]/) ) {
        for ( let i = 0; i < line.length / 4; i++ ) {
            const pos = (i * 4) + 1;
            const crate = line.substring(pos, pos + 1);
            if ( crate.match(/\w/)) {
                stacks[i] ||= [];
                stacks[i].push( crate );
            }
        }
    } else if ( line.match(/move/)) {
        const instruction = line.match(/move (\d+) from (\d+) to (\d+)/);
        const [ _, count, from, to ] = instruction.map( i => parseInt(i));
        const buffer = stacks[from - 1].splice(0, count) //.reverse();
        stacks[ to - 1 ].unshift( ...buffer );
    }
}

console.log( stacks.map( s => s[0] ).join('') );
