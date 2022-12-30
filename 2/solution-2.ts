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

type Win = 'WIN';
type Loss = 'LOSS';
type Draw = 'DRAW';

type Outcome = Win | Loss | Draw;

const outcomeScoreMapping: Record<Outcome, number> = {
  WIN: 6,
  LOSS: 0,
  DRAW: 3,
};

const outcomeCharToMoveMapping: Record<string, Outcome> = {
  X: 'LOSS',
  Y: 'DRAW',
  Z: 'WIN',
};

interface Round {
  opponent: MoveOption;
  outcome: Outcome;
}

const getRoundFromLine = (line: string): Round => {
  const [opponentChar, outcomeCharChar] = line.split(' ');

  return {
    opponent: opponentCharToMoveMapping[opponentChar],
    outcome: outcomeCharToMoveMapping[outcomeCharChar],
  };
};

const losingMoveMap: Record<MoveOption, MoveOption> = {
  ROCK: 'SCISSORS',
  PAPER: 'ROCK',
  SCISSORS: 'PAPER',
}

const winningMoveMap: Record<MoveOption, MoveOption> = {
  ROCK: 'PAPER',
  PAPER: 'SCISSORS',
  SCISSORS: 'ROCK',
}

const getSelfMove = ({ opponent, outcome }: Round): MoveOption => {
  switch (outcome) {
    case 'DRAW':
      return opponent;
      
    case 'LOSS':
      return losingMoveMap[opponent];

    case 'WIN':
      return winningMoveMap[opponent];
  }
};

const getRoundScore = (round: Round): number => {
  const selfMove = getSelfMove(round);

  const scoreFromMoveChoice = moveScoreMapping[selfMove];


  return scoreFromMoveChoice + outcomeScoreMapping[round.outcome];
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
