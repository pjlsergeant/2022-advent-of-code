import { slurp } from "../utils";

type Input = number | Input[];

const lines = slurp().filter(l => l.length).map(l => eval(l));
lines.push([[2]], [[6]]);
lines.sort(recSort);

let total2 = 1;

for (let i = 1; i < lines.length; i++) {
    if (recSort(lines[i], [[2]]) === 0) total2 *= i + 1;
    if (recSort(lines[i], [[6]]) === 0) total2 *= i + 1;
}

console.log(total2);

function recSort(left: Input, right: Input): number {
    if ((typeof left === 'number') && (typeof right === 'number')) {
        return left - right;
    }

    const leftList = Array.isArray(left) ? left : [left];
    const rightList = Array.isArray(right) ? right : [right];

    const larger = leftList.length > rightList.length ? leftList.length : rightList.length;

    for (let i = 0; i < larger; i++) {
        if (i >= leftList.length) return -1;
        if (i >= rightList.length) return 1;

        const itemSort = recSort(leftList[i], rightList[i]);
        if (itemSort) return itemSort;

    }
    return 0;

}

