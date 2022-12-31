import * as fs from 'fs';
import * as path from 'path';
import { string, array, readonlyArray } from 'fp-ts';
import { pipe, flow } from 'fp-ts/function';
import { transpose } from '../util/transpose';

const problemFile = fs.readFileSync(path.join(__dirname, 'problem.txt'), 'utf-8');


const getStacksFromInitialStateLines = (lines: string[]): string[][] => {
  const containersLines = lines.slice(0, lines.length - 1).reverse();
  const indexLine = lines[lines.length - 1];

  const indicesContainingValues = pipe(
    Array.from(indexLine),
    array.mapWithIndex((i, char) => [i, char] as const),
    array.filter(([i, char]) => !Number.isNaN(parseInt(char))),
    array.map(([i]) => i),
  );

  return pipe(
    containersLines,
    array.map((line) =>
      pipe(
        indicesContainingValues,
        array.map((index) => line[index]),
      ),
    ),
    transpose,
    array.map(array.filter((container) => container !== ' ')),
  );
};

interface Move {
  from: number;
  to: number;
}

const getMovesFromLines = array.chain(
  flow(string.split(' '), readonlyArray.toArray, (splitLine): Move[] => {
    const iterations = parseInt(splitLine[1]);
    const from = parseInt(splitLine[3]) - 1;
    const to = parseInt(splitLine[5]) - 1;

    return array.replicate(iterations, { from, to });
  }),
);

const applyMoveToStacks = (stacks: string[][], {from,to}: Move): void => {
  const popped = stacks[from].pop()

  if (popped) stacks[to].push(popped)
}

const main = () => {
  const [initialStateLines, movesLines] = pipe(
    problemFile,
    string.split('\n\n'),
    readonlyArray.toArray,
    array.map(flow(string.split('\n'), readonlyArray.toArray)),
  );

  const stacks = getStacksFromInitialStateLines(initialStateLines);
  const moves = getMovesFromLines(movesLines)

  moves.forEach(move => applyMoveToStacks(stacks, move))

    const result = pipe(
      stacks,
      array.map(stack => stack[stack.length - 1]),
      
    ).join('')

  

  console.log(result);
};

main();
