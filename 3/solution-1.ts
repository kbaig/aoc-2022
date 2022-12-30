import * as fs from 'fs';
import * as path from 'path';

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

const main = () => {
  const result = problemFile
    .split('\n')
    .map((line) => {
      const capacity = line.length / 2;

      const compartment1 = line.slice(0, capacity);
      const compartment2 = line.slice(capacity);

      const compartment1Set = new Set(compartment1);

      const repeatedType = compartment2.split('').find((item) => compartment1Set.has(item));

      if (!repeatedType) throw new Error('Nothing repeated');

      return repeatedType;
    })
    .map((repeatedType) => priorities[repeatedType])
    .reduce((a, b) => a + b);

  console.log(result);
};

main();
