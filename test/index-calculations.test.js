import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateBplusIndex,
  calculateOrderedIndex,
  calculateStaticMultilevelIndex,
  calculateTable,
  isWithinTolerance,
  parseNumericAnswer,
} from "../src/lib/index-calculations.js";

test("calcula a organização física do arquivo Atores", () => {
  const result = calculateTable([{ size: 16 }, { size: 160 }], 10_000);
  assert.deepEqual(result, {
    amount: 10_000,
    recordSize: 176,
    blockFactor: 11,
    blocksAmount: 910,
    waste: 112,
    size: 1_863_680,
  });
});

test("calcula índice ordenado primário", () => {
  const result = calculateOrderedIndex([{ size: 16 }], 910);
  assert.equal(result.recordSize, 32);
  assert.equal(result.blockFactor, 64);
  assert.equal(result.blocksAmount, 15);
  assert.equal(result.blocksToRetrieve, 5);
});

test("calcula índice estático multinível somando todos os níveis", () => {
  const result = calculateStaticMultilevelIndex([{ size: 16 }], 910);
  assert.equal(result.blocksAmount, 16);
  assert.equal(result.size, 32_768);
  assert.equal(result.blocksToRetrieve, 3);
});

test("calcula métricas da árvore B+", () => {
  const result = calculateBplusIndex({ size: 11 }, 3_500);
  assert.equal(result.leafRecordSize, 27);
  assert.equal(result.leafBlockFactor, 52);
  assert.equal(result.leafAmount, 68);
  assert.equal(result.treeOrder, 89);
  assert.equal(result.indexBlockFactor, 61);
  assert.equal(result.indexAmount, 3);
  assert.equal(result.blocksAmount, 71);
});

test("aceita respostas até 1% para mais ou para menos", () => {
  assert.equal(isWithinTolerance("990", 1000), true);
  assert.equal(isWithinTolerance("1.010", 1000), true);
  assert.equal(isWithinTolerance("989,99", 1000), false);
  assert.equal(isWithinTolerance("1.010,01", 1000), false);
  assert.equal(parseNumericAnswer("1.234,5"), 1234.5);
});
