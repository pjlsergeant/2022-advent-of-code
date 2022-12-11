import { slurp } from "../utils";

type Monkey = ReturnType<typeof makeMonkey>;

const lines = slurp().join('\n');
const monkeys = lines.split(/\n\n+/).map(s => makeMonkey(s));
const maxWorry = monkeys.map(m => m.divisible).reduce((a, c) => a * c, 1);

// Run it
Array(10_000).fill(1).map(i => playRound(monkeys, maxWorry));

const mostActive = monkeys.map(m => m.inspections).sort((a, b) => b - a);
console.log(mostActive);
console.log({ total: mostActive[0] * mostActive[1] });

function playRound(monkeys: Monkey[], maxWorry: number) {
    let count = 0;
    for (const monkey of monkeys) {
        while (monkey.items.length) {
            // Monkey takes an item to examine
            const item = monkey.items.shift();
            // I get more worried about it
            const newWorryScore = applyOperation(monkey.operation, item);
            // This is still banded by my maximum worry; floor is simply so this
            // can solve both
            const boundedWorryScore = Math.floor(newWorryScore % maxWorry);
            // Monkey examines
            const test = 0 === (boundedWorryScore % monkey.divisible);
            // Chooses another monkey to throw to
            const toMonkey = test ? monkey.ifTrue : monkey.ifFalse;
            // It moves on
            monkeys[toMonkey].items.push(boundedWorryScore);

            monkey.inspections++;
        }

        count++;
    }
}

function applyOperation(operation: string, old: number): number {
    const newValue = parseInt(eval(`old ${operation}`));
    return newValue;
}

function makeMonkey(input: string) {
    const match = input.match(/Monkey (\d+):\s+Starting items: ([\d ,]+)\s+Operation: new = old (. (old|\d+))\s+Test: divisible by (\d+)\s+If true: throw to monkey (\d)\s+If false: throw to monkey (\d)/);
    const action = {
        monkeyId: parseInt(match[1]),
        items: match[2].split(/, /).map(i => parseInt(i)),
        operation: match[3],
        divisible: parseInt(match[5]),
        ifTrue: parseInt(match[6]),
        ifFalse: parseInt(match[7]),
        inspections: 0,
    }
    return action;
}
