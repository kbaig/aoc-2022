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

const product = array.reduce(1, number.SemigroupProduct.concat);

type TallestTree = [height: number, index: number];

const initialTallestTree: TallestTree = [-1, -1];

const getTallestTreesFromLeft = flow(
  array.reduceRightWithIndex<number, [TallestTree[], TallestTree]>(
    [[initialTallestTree], initialTallestTree],
    (index, current, [maxes, tallestTreeSoFar]) => {
      const newMax = Math.max(current, tallestTreeSoFar[0]);

      const newTallest: TallestTree =
        newMax === current ? [current, index] : tallestTreeSoFar;

      return [[...maxes, newTallest], newTallest];
    },
  ),
  ([maxes]) => maxes,
  array.dropRight(1),
);

const writeGrid = (grid: number[][], filename: string) => {
  const file = pipe(
    grid,
    array.map(flow(array.map(String), array.intercalate(string.Monoid)(''))),
    array.intercalate(string.Monoid)('\n'),
  );

  fs.writeFileSync(path.join(__dirname, filename), file);
};

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

  const scenicScores = pipe(
    rows,
    array.mapWithIndex((i, row) =>
      pipe(
        row,
        array.mapWithIndex((j, tree) => {
          const bs = pipe(
            [tallestFromLeft, tallestFromRight],
            array.map((grid) => {
              const [tallestTreeHeight, tallestTreeIndex] = grid[i][j];
              if (tallestTreeIndex === -1 || tallestTreeHeight < tree) return j;
              return j - tallestTreeIndex;
            }),
          );

          const cs = pipe(
            [tallestFromTop, tallestFromBottom],
            array.map((grid) => {
              const [tallestTreeHeight, tallestTreeIndex] = grid[i][j];
              if (tallestTreeIndex === -1 || tallestTreeHeight < tree) return i;
              return i - tallestTreeIndex;
            }),
          );

          console.log([...bs, ...cs]);

          return pipe([...bs, ...cs], product);
        }),
      ),
    ),
  );

  writeGrid(scenicScores, 'scenisScores.txt');

  // writeGrid(tallestFromLeft, 'tallestFromLeft.txt');
  // writeGrid(tallestFromRight, 'tallestFromRight.txt');
  // writeGrid(tallestFromTop, 'tallestFromTop.txt');
  // writeGrid(tallestFromBottom, 'tallestFromBottom.txt');

  // console.log(result);
};

main();
