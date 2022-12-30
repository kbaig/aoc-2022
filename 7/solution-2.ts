import * as fs from 'fs';
import * as path from 'path';
import { string, array, readonlyArray } from 'fp-ts';
import { pipe, flow } from 'fp-ts/function';

const problemFile = fs.readFileSync(path.join(__dirname, 'problem.txt'), 'utf-8');


const main = () => {
  const result = pipe(problemFile);

  console.log(result);
};

main();
