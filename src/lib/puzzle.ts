export const SOLVED = [0, 1, 2, 3, 4, 5, 6, 7, 8];
export function neighbors(index: number): number[] {
  return [
    index - 3,
    index + 3,
    ...(index % 3 > 0 ? [index - 1] : []),
    ...(index % 3 < 2 ? [index + 1] : []),
  ].filter((i) => i >= 0 && i < 9);
}
export function moveTile(board: number[], index: number): number[] {
  const blank = board.indexOf(8);
  if (!neighbors(blank).includes(index)) return board;
  const copy = [...board];
  [copy[blank], copy[index]] = [copy[index], copy[blank]];
  return copy;
}
export function isSolved(board: number[]): boolean {
  return board.every((v, i) => v === i);
}
export function shufflePuzzle(steps = 22): number[] {
  let board = [...SOLVED];
  let previous = -1;
  for (let i = 0; i < steps; i++) {
    const blank = board.indexOf(8);
    const options = neighbors(blank).filter((n) => n !== previous);
    const target = options[Math.floor(Math.random() * options.length)];
    previous = blank;
    board = moveTile(board, target);
  }
  return isSolved(board) ? shufflePuzzle(steps) : board;
}
function distance(board: number[]): number {
  return board.reduce(
    (d, t, i) =>
      d +
      (t === 8
        ? 0
        : Math.abs((t % 3) - (i % 3)) +
          Math.abs(Math.floor(t / 3) - Math.floor(i / 3))),
    0,
  );
}
// A* with Manhattan distance: returns actual legal moves, never a visual shortcut.
export function solvePuzzle(board: number[]): number[][] {
  const start = board.join("");
  const queue = [{ board, g: 0, f: distance(board), path: [] as number[][] }];
  const costs = new Map([[start, 0]]);
  while (queue.length) {
    let best = 0;
    for (let i = 1; i < queue.length; i++)
      if (queue[i].f < queue[best].f) best = i;
    const current = queue.splice(best, 1)[0];
    if (isSolved(current.board)) return current.path;
    for (const index of neighbors(current.board.indexOf(8))) {
      const next = moveTile(current.board, index);
      const key = next.join("");
      const g = current.g + 1;
      if ((costs.get(key) ?? Infinity) <= g) continue;
      costs.set(key, g);
      queue.push({
        board: next,
        g,
        f: g + distance(next),
        path: [...current.path, next],
      });
    }
  }
  return [];
}
