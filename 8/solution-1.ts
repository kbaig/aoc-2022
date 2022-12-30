import * as fs from 'fs';
import * as path from 'path';
import { array, readonlyArray, string, number } from 'fp-ts';
import { pipe, flow } from 'fp-ts/function';

const problemFile = fs.readFileSync(
  path.join(__dirname, 'problem.txt'),
  'utf-8',
);

const transpose = <T>(array: T[][]): T[][] =>
  array[0].map((_, colIndex) => array.map((row) => row[colIndex]));

const sum = array.reduce(0, number.SemigroupSum.concat);

const writeMap = (map: number[][], filename: string) => {
  const file = pipe(
    map,
    array.map(flow(array.map(String), array.intercalate(string.Monoid)(''))),
    array.intercalate(string.Monoid)('\n'),
  );

  fs.writeFileSync(path.join(__dirname, filename), file);
};

const getTallestTreesFromLeft = flow(
  array.reduce<number, [number[], number]>(
    [[0], 0],
    ([maxes, maxSoFar]: [number[], number], current: number) => {
      const newMax = Math.max(current, maxSoFar);
      return [[...maxes, newMax], newMax];
    },
  ),
  ([maxes]) => maxes,
  array.dropRight(1),
);

const getTallestTreesFromRight = (row: number[]) =>
  pipe(row, array.reverse, getTallestTreesFromLeft, array.reverse);

const main = () => {
  const rows = pipe(
    problemFile,
    string.split('\n'),
    readonlyArray.toArray,
    array.map(
      flow(
        string.split(''),
        readonlyArray.toArray,
        array.map((char) => parseInt(char)),
      ),
    ),
  );

  const columns = transpose(rows);

  const tallestFromLeft = pipe(rows, array.map(getTallestTreesFromLeft));
  const tallestFromRight = pipe(rows, array.map(getTallestTreesFromRight));
  const tallestFromTop = pipe(
    columns,
    array.map(getTallestTreesFromLeft),
    transpose,
  );
  const tallestFromBottom = pipe(
    columns,
    array.map(getTallestTreesFromRight),
    transpose,
  );

  const visibleTrees = pipe(
    rows,
    array.mapWithIndex((i, row) =>
      pipe(
        row,
        array.mapWithIndex((j, tree) =>
          pipe(
            i === 0 ||
              i === row.length - 1 ||
              j === 0 ||
              j === columns[0].length - 1 ||
              pipe(
                [
                  tallestFromLeft,
                  tallestFromRight,
                  tallestFromTop,
                  tallestFromBottom,
                ],
                array.some((grid) => grid[i][j] < tree),
              ),
            Number,
          ),
        ),
      ),
    ),
  );

  writeMap(visibleTrees, 'visibleTrees.txt');
  writeMap(tallestFromLeft, 'tallestFromLeft.txt');
  writeMap(tallestFromRight, 'tallestFromRight.txt');
  writeMap(tallestFromTop, 'tallestFromTop.txt');
  writeMap(tallestFromBottom, 'tallestFromBottom.txt');

  const result = pipe(visibleTrees, array.map(sum), sum);

  console.log(result);
};

main();
