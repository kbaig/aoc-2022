import * as fs from 'fs';
import * as path from 'path';
import { string, array, readonlyArray } from 'fp-ts';
import { pipe } from 'fp-ts/function';

const problemFile = fs.readFileSync(path.join(__dirname, 'problem.txt'), 'utf-8');

interface CDLine {
  type: 'CD';
  dir: string;
}

interface LSLine {
  type: 'LS';
}

interface FileLine {
  type: 'FILE';
  filename: string;
  size: number;
}

interface DirLine {
  type: 'DIR';
  dir: string;
}

type Line = CDLine | LSLine | FileLine | DirLine;

type FileNode = FileLine;

interface DirNode extends DirLine {
  type: 'DIR';
  dir: string;
  parentDir?: DirNode;
  contents: Array<FileNode | DirNode>;
}

type Tree = Omit<DirNode, 'parentDir'>;

const getLineFromFileLine = (fileLine: string): Line => {
  const items = fileLine.split(' ');

  if (items[0] === 'dir')
    return {
      type: 'DIR',
      dir: items[1],
    };

  if (items[0] !== '$')
    return {
      type: 'FILE',
      filename: items[2],
      size: parseInt(items[1]),
    };

  if (items[1] === 'ls')
    return {
      type: 'LS',
    };

  return {
    type: 'CD',
    dir: items[2],
  };
};

const buildTreeFromLines = (lines: Line[]): Tree => {
  const tree: Tree = {
    type: 'DIR',
    dir: '/',
    contents: [],
  };

  return tree;
};

const getTreeSize = (tree: Tree): number => {
  let size = 0;

  tree.contents.forEach((content) => {
    switch (content.type) {
      case 'DIR':
        size += getTreeSize(content);
        break;
      case 'FILE':
        size += content.size;
        break;
    }
  });

  return size;
};

const findTreeWithDirName = (dir: string, tree: Tree): Tree | null => {
  if (tree.dir === dir) return tree;
  if (tree.contents.length === 0) return null;

  const nestedDirs = tree.contents.filter((content): content is DirNode => content.type === 'DIR');

  for (const nestedDir of nestedDirs) {
    const foundTree = findTreeWithDirName(dir, nestedDir);

    if (foundTree) return foundTree;
  }
};

const main = () => {
  const lines = pipe(problemFile, string.split('\n'), readonlyArray.toArray, array.map(getLineFromFileLine));

  const tree = buildTreeFromLines(lines);

  const dir = findTreeWithDirName(dir, tree)



  console.log(result);
};

main();
