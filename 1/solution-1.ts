import * as fs from 'fs';
import * as path from 'path';

const problemFile = fs.readFileSync(path.join(__dirname, 'problem.txt'), 'utf-8');

const main = () => {
  const caloriesByElf = problemFile
    .split('\n\n')
    .map((block) => block.split('\n').map(Number).reduce((a, b) => a + b))
    
  const result = Math.max(...caloriesByElf)

  console.log(result);
};

main();
