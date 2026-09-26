import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SOLVED,
  isSolved,
  moveTile,
  neighbors,
  shufflePuzzle,
  solvePuzzle,
} from "./puzzle.ts";
test("legal movement cannot wrap around board edges", () => {
  assert.deepEqual(neighbors(2).sort(), [1, 5]);
  assert.equal(moveTile(SOLVED, 0), SOLVED);
  assert.deepEqual(moveTile(SOLVED, 7), [0, 1, 2, 3, 4, 5, 6, 8, 7]);
});
test("shuffles are solvable and auto-solve only makes legal moves", () => {
  for (let i = 0; i < 40; i++) {
    let board = shufflePuzzle();
    assert.equal(isSolved(board), false);
    const path = solvePuzzle(board);
    assert.ok(path.length > 0);
    for (const next of path) {
      const destination = next.indexOf(8);
      assert.ok(neighbors(board.indexOf(8)).includes(destination));
      assert.deepEqual(moveTile(board, destination), next);
      board = next;
    }
    assert.deepEqual(board, SOLVED);
  }
});
