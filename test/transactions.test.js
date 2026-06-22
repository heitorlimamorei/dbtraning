import test from "node:test";
import assert from "node:assert/strict";
import { TRANSACTION_EXERCISES } from "../src/data/transaction-data.js";
import {
  analyzeDirtyReads,
  analyzeSerializability,
  analyzeTimestampOrdering,
  compareEdgeSets,
} from "../src/lib/transactions.js";

test("o modulo de transacoes contem pelo menos 20 walkthroughs", () => {
  assert.ok(TRANSACTION_EXERCISES.length >= 20);
  assert.ok(TRANSACTION_EXERCISES.every((exercise) => exercise.walkthrough.length >= 3));
});

test("o Sa dos slides nao e serializavel por conflito", () => {
  const exercise = TRANSACTION_EXERCISES.find((item) => item.id === "tx09");
  const analysis = analyzeSerializability(exercise.transactions, exercise.schedule);

  assert.equal(analysis.serializable, false);
  assert.ok(analysis.cycle.length > 0);
  assert.equal(compareEdgeSets("T1->T3, T2->T1, T2->T3, T3->T1, T3->T2", analysis.edges).correct, true);
});

test("a ordem c2, c3, c1 torna o Sa dos slides nao recuperavel", () => {
  const exercise = TRANSACTION_EXERCISES.find((item) => item.id === "tx05");
  const analysis = analyzeDirtyReads(exercise.schedule, exercise.commitOrder);

  assert.equal(analysis.recoverable, false);
  assert.deepEqual(
    analysis.dirtyReads.map((read) => read.read),
    ["r1(y)", "r3(x)", "r1(z)"],
  );
});

test("os exercicios grandes de recuperacao possuem resultado esperado", () => {
  const expected = new Map([
    ["tx21", false],
    ["tx22", true],
    ["tx23", false],
    ["tx24", false],
    ["tx25", false],
    ["tx26", true],
  ]);

  for (const [id, recoverable] of expected) {
    const exercise = TRANSACTION_EXERCISES.find((item) => item.id === id);
    const analysis = analyzeDirtyReads(exercise.schedule, exercise.commitOrder);

    assert.equal(analysis.recoverable, recoverable, id);
  }
});

test("timestamp aborta a transacao antiga quando rTS e maior", () => {
  const exercise = TRANSACTION_EXERCISES.find((item) => item.id === "tx18");
  const analysis = analyzeTimestampOrdering(exercise.schedule);

  assert.deepEqual(analysis.aborted, ["T1"]);
  assert.deepEqual(analysis.effectiveSchedule, ["r2(x)", "w2(x)"]);
});
