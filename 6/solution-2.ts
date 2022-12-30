import * as fs from 'fs';
import * as path from 'path';
import { string, array, readonlyArray } from 'fp-ts';
import { pipe, flow } from 'fp-ts/function';

const problemFile = fs.readFileSync(path.join(__dirname, 'problem.txt'), 'utf-8');

const hasDuplicates = (chars: string[]): boolean => new Set(chars).size !== chars.length;

const getCharsProcessedToFindMarker = (markerLength: number) => (chars: string[]): number | null => {
  const potentialMarker = chars.slice(0, markerLength);

  let i = markerLength;

  while (i <= chars.length) {
    const isValidMarker = !hasDuplicates(potentialMarker);

    if (isValidMarker) return i;

    potentialMarker.shift();
    potentialMarker.push(chars[i]);

    i++;
  }

  return null;
};

const main = () => {
  const result = pipe(problemFile, string.split(''), readonlyArray.toArray, getCharsProcessedToFindMarker(14));

  console.log(result);
};

main();
