import * as fs from 'fs';
import * as path from 'path';

const problemFile = fs.readFileSync(path.join(__dirname, 'problem.txt'), 'utf-8');

type Rock = 'ROCK';
type Paper = 'PAPER';
type Scissors = 'SCISSORS';

type MoveOption = Rock | Paper | Scissors;

const moveScoreMapping: Record<MoveOption, number> = {
  ROCK: 1,
  PAPER: 2,
  SCISSORS: 3,
};

const opponentCharToMoveMapping: Record<string, MoveOption> = {
  A: 'ROCK',
  B: 'PAPER',
  C: 'SCISSORS',
};

const selfCharToMoveMapping: Record<string, MoveOption> = {
  X: 'ROCK',
  Y: 'PAPER',
  Z: 'SCISSORS',
};

interface Round {
  opponent: MoveOption;
  self: MoveOption;
}

const getRoundFromLine = (line: string): Round => {
  const [opponentChar, selfChar] = line.split(' ');

  return {
    opponent: opponentCharToMoveMapping[opponentChar],
    self: selfCharToMoveMapping[selfChar],
  };
};

type Win = 'WIN';
type Loss = 'LOSS';
type Draw = 'DRAW';

type Outcome = Win | Loss | Draw;

const outcomeScoreMapping: Record<Outcome, number> = {
  WIN: 6,
  LOSS: 0,
  DRAW: 3,
};

const getOutcome = ({ opponent, self }: Round): Outcome => {
  if (opponent === self) return 'DRAW';

  switch (self) {
    case 'ROCK':
      if (opponent === 'SCISSORS') return 'WIN';
      break;

    case 'PAPER':
      if (opponent === 'ROCK') return 'WIN'; // A Y
      break;

    case 'SCISSORS':
      if (opponent === 'PAPER') return 'WIN'; // B Z
      break;
  }

  return 'LOSS';
};

const getRoundScore = (round: Round): number => {
  const scoreFromMoveChoice = moveScoreMapping[round.self];

  const outcome = getOutcome(round);

  return scoreFromMoveChoice + outcomeScoreMapping[outcome];
};

const main = () => {
  console.log({
    score: problemFile
      .split('\n')
      .map(getRoundFromLine)
      .map(getRoundScore)
      .reduce((a, b) => a + b),
  });
};

main();
