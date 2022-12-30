import * as fs from 'fs';
import * as path from 'path';
import { flow, identity, pipe } from 'fp-ts/function';
import { array, string, readonlyArray, number } from 'fp-ts';

const problemFile = fs.readFileSync(path.join(__dirname, 'problem.txt'), 'utf-8');

const getTopN =
  (topN: number) =>
  (ns: number[]): number[] => {
    const result = ns.slice(0, topN);

    ns.slice(topN).forEach((n) => {
      result.sort((a, b) => a - b);

      const indexOfSmallerNumber = result.findIndex((memberOfResult) => n > memberOfResult);

      if (indexOfSmallerNumber === -1) return;

      result.splice(indexOfSmallerNumber, 1, n);
    });

    return result;
  };

const sum = array.reduce(number.MonoidSum.empty, number.MonoidSum.concat);

const main = () => {
  const result = pipe(
    problemFile,
    string.split('\n\n'),
    readonlyArray.toArray,
    array.map(flow(string.split('\n'), readonlyArray.toArray, array.map(Number), sum)),
    getTopN(3),
    sum,
  );

  console.log(result);
};

main();

array.foldLeft;
