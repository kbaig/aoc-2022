import * as fs from "fs";
import * as path from "path";
import { array, readonlyArray, string, number, option } from "fp-ts";
import { pipe, flow, identity } from "fp-ts/function";
import { transpose } from "../util/transpose";
import { product } from "../util/product";

const problemFile = fs.readFileSync(
  path.join(__dirname, "problem.txt"),
  "utf-8",
);

type HeightMap = Record<number, number>;

const getHeightMapFromLeft = flow(
  array.reduceWithIndex<number, Array<HeightMap>>(
    [{}],
    (index, currentRecords, currentTree) => {
      return [
        ...currentRecords,
        {
          ...currentRecords[currentRecords.length - 1],
          [currentTree]: index,
        },
      ];
    },
  ),
  array.dropRight(1),
);

const digits = array.makeBy(10, identity);

const getTreeScenicScoreFromLeft = (
  heightMap: HeightMap,
  treeHeight: number,
  index: number,
): number => {
  const heightsToCheck = digits.slice(treeHeight);

  const viewBlockingTreeIndex = pipe(
    heightsToCheck,
    array.map((height) => (height in heightMap ? heightMap[height] : 0)),
    (indexes) => Math.max(...indexes),
  );

  const scenicScore = index - viewBlockingTreeIndex;

  return scenicScore;
};

const getScenicScoresFromLeft = (rows: number[][]) => {
  const heightMapsFromLeft = pipe(rows, array.map(getHeightMapFromLeft));

  return pipe(
    rows,
    array.mapWithIndex((rowIndex, row) =>
      pipe(
        row,
        array.mapWithIndex((colIndex, tree) =>
          getTreeScenicScoreFromLeft(
            heightMapsFromLeft[rowIndex][colIndex],
            tree,
            colIndex,
          ),
        ),
      ),
    ),
  );
};

const getScenicScoresFromRight = (rows: number[][]) => {
  const reversedRows = pipe(rows, array.map(array.reverse));

  const reversedHeightMapsFromRight = pipe(
    reversedRows,
    array.map(getHeightMapFromLeft),
  );

  return pipe(
    reversedRows,
    array.mapWithIndex((rowIndex, row) =>
      pipe(
        row,
        array.mapWithIndex((colIndex, tree) =>
          getTreeScenicScoreFromLeft(
            reversedHeightMapsFromRight[rowIndex][colIndex],
            tree,
            colIndex,
          ),
        ),
        array.reverse,
      ),
    ),
  );
};

const main = () => {
  const rows = pipe(
    problemFile,
    string.split("\n"),
    readonlyArray.toArray,
    array.map(
      flow(
        string.split(""),
        readonlyArray.toArray,
        array.map((char) => parseInt(char)),
      ),
    ),
  );

  const scenicScoresFromLeft = getScenicScoresFromLeft(rows);
  const scenicScoresFromRight = getScenicScoresFromRight(rows);

  const columns = transpose(rows);

  const scenicScoresFromTop = pipe(columns, getScenicScoresFromLeft, transpose);
  const scenicScoresFromBottom = pipe(
    columns,
    getScenicScoresFromRight,
    transpose,
  );

  const scenicScores = pipe(
    rows,
    array.mapWithIndex((rowIndex, row) =>
      pipe(
        row,
        array.mapWithIndex((colIndex) =>
          pipe(
            [
              scenicScoresFromLeft,
              scenicScoresFromRight,
              scenicScoresFromTop,
              scenicScoresFromBottom,
            ],
            array.map((scenicScoreGrid) => scenicScoreGrid[rowIndex][colIndex]),
            product,
          ),
        ),
      ),
    ),
  );

  const topScenicScore = pipe(
    scenicScores,
    array.map((rowScenicScores) => Math.max(...rowScenicScores)),
    (scenicScoresPerRow) => Math.max(...scenicScoresPerRow),
  );

  console.log(topScenicScore);
};

main();
