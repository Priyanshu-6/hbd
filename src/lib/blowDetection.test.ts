import { test } from "node:test";
import assert from "node:assert/strict";
import { createBlowDetector } from "./blowDetection.ts";

test("silence and a brief click do not blow candles", () => {
  const detect = createBlowDetector(0);
  for (let t = 0; t < 650; t += 20)
    assert.equal(detect(0.002, t).triggered, false);
  assert.equal(detect(0.003, 700).triggered, false);
  assert.equal(detect(0.1, 720).triggered, false);
  assert.equal(detect(0.002, 740).triggered, false);
  assert.equal(detect(0.002, 900).triggered, false);
});
test("a gentle sustained sound blows the candles", () => {
  const detect = createBlowDetector(0);
  for (let t = 0; t < 650; t += 20) detect(0.003, t);
  assert.equal(detect(0.025, 700).ready, true);
  assert.equal(detect(0.025, 780).triggered, false);
  assert.equal(detect(0.025, 820).triggered, true);
});
test("steady ambient music is calibrated out; a louder breath triggers", () => {
  const detect = createBlowDetector(0);
  for (let t = 0; t < 650; t += 20) detect(0.02, t);
  for (let t = 700; t < 1300; t += 20)
    assert.equal(detect(0.025, t).triggered, false);
  detect(0.07, 1400);
  assert.equal(detect(0.07, 1520).triggered, true);
});
