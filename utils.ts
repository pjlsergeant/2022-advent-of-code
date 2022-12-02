import { readFileSync } from "node:fs";
import * as path from "node:path";

export function slurp(filename: string = path.dirname(process.argv[1]) + '/input.txt') {
    const lines = readFileSync(filename).toString().split(/\n/);
    console.log(`Read ${lines.length} lines from ${filename}`);
    return lines;
}