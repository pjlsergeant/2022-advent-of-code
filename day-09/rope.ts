// 5:50
import { slurp } from "../utils";

const lines = slurp();

type Unit = -1 | 0 | 1;
type D = [Unit, Unit];
type V = [number, number];
const inputs: Record<string, D> = {
    U: [0, 1],
    D: [0, -1],
    L: [-1, 0],
    R: [1, 0]
};

const cmp = (a: number, b: number): Unit => a < b ? -1 : a > b ? 1 : 0;
const dir = (h: V, t: V): D => [cmp(h[0], t[0]), cmp(h[1], t[1])];
const add = (f: V, t: D): V => [f[0] + t[0], f[1] + t[1]];
const same = (h: V, t: V): boolean => h[0] == t[0] && h[1] == t[1];

const knots: V[] = Array(10).fill([0, 0]);

const visited1: Set<string> = new Set();
const visited2: Set<string> = new Set();

for (const line of lines) {
    const [direction, steps] = line.split(' ');

    for (let i = 0; i < parseInt(steps); i++) {
        // Move the head
        knots[0] = add(knots[0], inputs[direction]);

        for (let k = 1; k < knots.length; k++) {
            const hLoc = knots[k - 1];
            const tLoc = knots[k];

            const maybe = add(tLoc, dir(hLoc, tLoc));
            const maybeD = dir(hLoc, maybe);
            if (!(maybeD[0] === 0 && maybeD[1] === 0)) {
                knots[k] = maybe;
            }

            if (k === 1) {
                visited1.add(`${tLoc[0]}-${tLoc[1]}`);
            } else if (k === 9) {
                visited2.add(`${tLoc[0]}-${tLoc[1]}`);
            }
        }
    }

    draw(knots);
}

const total1 = visited1.size;
const total2 = visited2.size;

console.log({ total1, total2 });

function draw(knots: V[]) {
    let map = '';
    for (let y = 15; y >= -5; y--) {
        for (let x = -11; x < 15; x++) {
            let char = '.';
            if (x === 0 && y === 0) char = 's';

            for (let k = knots.length - 1; k >= 0; k--) {
                if (same([x, y], knots[k])) {
                    char = String(k);
                }
            }

            map += char;
        }
        map += '\n';
    }
    map += '\n';
    console.log(map);
}