import { slurp } from "../utils";

type Dir = {
    children: Record<string, Dir>;
    name: string;
    files: Record<string, number>;
    listed: boolean;
    size: number;
};

const newDir = (name: string): Dir => ({ name, children: {}, files: {}, listed: false, size: 0 });

const root : Dir = newDir('/');
const cursor: [Dir, Dir[]] = [root, []];
let mode : string = 'cmd';

const lines = slurp();
lines.shift(); //: cd /

const debug = (what: string) => true ? console.log( what ) : '';

// build phase
for ( const line of lines ) {
    if ( mode === 'ls' ) {
        if ( line.indexOf('$') === 0 ) {
            debug('end of ls mode');
            cursor[0].listed = true;
            mode = 'cmd';
        } else {
            if ( cursor[0].listed ) {
                debug('not writing, dir already listed')
            } else {
                const match = line.match(/^dir (\w+)|^(\d+) ([a-z\.]+)/);
                if ( match[1]) {
                    debug(`recording dir ${match[1]}`);
                    cursor[0].children[ match[1] ] = newDir( match[1] );
                } else if ( match[2] ) {
                    const size = parseInt( match[2] );
                    const name = match[3];
                    debug(`recording file ${name} (size: ${size})`);
                    cursor[0].files[name] = size;
                } else {
                    throw new Error(`can't parse line: [${line}]`);
                }
            }
            continue;
        }
    }

    if ( line === '$ ls' ) {
        debug('switching to ls mode');
        mode = 'ls';
        continue;
    }

    const match = line.match(/\$ cd (.+)/);
    if ( ! match ) {
        throw new Error(`can't parse line: [${line}]`);
    }
    if ( match[1] === '..') {
        const [parent, ...path] = cursor[1];
        cursor[0] = parent;
        cursor[1] = path;
        debug(`up to parent: ${cursor[0].name}`);
    } else {
        cursor[0].children[ match[1] ] ||= newDir( match[1] );
        cursor[1].unshift( cursor[0] );
        cursor[0] = cursor[0].children[ match[1] ];
        debug(`into child: ${ cursor[0].name}`)
    }
}

// reduce phase
//   - process children
//   - add your files to your size

let total1 = 0;

const capacity   = 70_000_000;
const updateSize = 30_000_000;
const sizes : number[] = [];

function visit( dir: Dir ) : number {
    let childrenSize = Object.values( dir.children ).reduce( (acc: number, cur) => acc += visit(cur), 0 );
    let fileSize = Object.values( dir.files).reduce( (acc: number, cur ) => acc += cur, 0 );
    dir.size = childrenSize + fileSize;

    if ( dir.size <= 100_000 ) {
        total1 += dir.size;
    }

    sizes.push( dir.size );

    return dir.size;
}

visit( root );

const freeSpace = capacity - root.size;
const required = updateSize - freeSpace;

let total2 = capacity;
for ( const s of sizes ) {
    if ( s >= required ) {
        if ( s < total2 ) {
            total2 = s;
        }
    }
}

console.log("Results", { total1, total2 });