import { slurp } from "../utils";

const lines = slurp();

let total1 = 0;
let total2 = 0;

for (const line of lines) {
    const [a, b] = line.split(/,/).map(e => e.split('-').map(d => parseInt(d)));

    // complete overlap
    if (
        (a[0] >= b[0] && a[1] <= b[1]) ||
        (b[0] >= a[0] && b[1] <= a[1])
    ) {
        total1++;
    }

    // partial overlap
    let contains2 = false;
    if (
        (a[0] >= b[0] && a[0] <= b[1]) || // a0 is in b range
        (a[1] >= b[0] && a[1] <= b[1]) || // a1 is in b range
        (a[0] <= b[0] && a[1] >= b[1])    // b is a subset of a
    ) {
        total2++;
    }
}

console.log("Results", { total1, total2 })