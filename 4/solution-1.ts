import * as fs from 'fs';
import * as path from 'path';

const problemFile = fs.readFileSync(path.join(__dirname, 'problem.txt'), 'utf-8');

interface Assignment {
  start: number;
  end: number;
}

const getDoAssignmentsOverlap = (a1: Assignment, a2: Assignment): boolean => {
  return (a1.start <= a2.start && a1.end >= a2.end) || (a2.start <= a1.start && a2.end >= a1.end)
};

const getAssignment = (assignmentStr: string): Assignment => {
  const [start, end] = assignmentStr.split('-');

  return {
    start: Number(start),
    end: Number(end),
  };
};

const main = () => {
  const result = problemFile
    .split('\n')
    .map((line) => line.split(',').map(getAssignment))
    .filter(([a1, a2]) => getDoAssignmentsOverlap(a1, a2)).length;

  console.log(result);
};

main();
