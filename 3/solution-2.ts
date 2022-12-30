import * as fs from 'fs';
import * as path from 'path';
import { string, set, readonlyArray, array, nonEmptyArray, number, function as F, identity as id } from 'fp-ts';
import { pipe, flow, identity } from 'fp-ts/function';
import {Semigroup} from 'fp-ts/lib/Semigroup';
import {Monoid} from 'fp-ts/lib/Monoid';

const problemFile = fs.readFileSync(path.join(__dirname, 'problem.txt'), 'utf-8');

const lowercasePriorities = Object.fromEntries(
  Array(26)
    .fill(null)
    .map((_, i) => {
      const code = i + 97;

      return [String.fromCharCode(code), code - 96];
    }),
);

const uppercasePriorities = Object.fromEntries(
  Array(26)
    .fill(null)
    .map((_, i) => {
      const code = i + 65;

      return [String.fromCharCode(code), code - 38];
    }),
);

const priorities = {
  ...lowercasePriorities,
  ...uppercasePriorities,
};

const stringIntersectionSemigroup = set.getIntersectionSemigroup(string.Eq);

const getBadgeType = flow(
  array.map((rucksackContents: string) => new Set(rucksackContents)),
  array.matchLeft(
    () => new Set<string>(),
    (head, tail) => pipe(tail, array.reduce(head, stringIntersectionSemigroup.concat)),
  ),
  (set) => Array.from(set)[0],
);

const sum = array.reduce(number.MonoidSum.empty, number.MonoidSum.concat);

const main = () => {
  const result = pipe(
    problemFile,
    string.split('\n'),
    readonlyArray.toArray,
    array.chunksOf(3),
    array.map(flow(getBadgeType, (badgeType) => priorities[badgeType])),
    sum,
  );

  console.log(result);
};

main();


