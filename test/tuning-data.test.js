import assert from "node:assert/strict";
import test from "node:test";

import initSqlJs from "sql.js";

import { ADVANCED_TUNING_QUESTIONS } from "../src/data/tuning-advanced-data.js";
import { TUNING_QUESTIONS } from "../src/data/tuning-data.js";
import { NULL_TUNING_QUESTIONS } from "../src/data/tuning-null-data.js";
import { REWRITE_TUNING_QUESTIONS } from "../src/data/tuning-rewrite-data.js";
import { SEED_SQL } from "../src/data/training-data.js";

function normalizeResult(result) {
  if (result.length === 0) {
    return { columns: [], rows: [] };
  }

  return {
    columns: result[0].columns,
    rows: result[0].values
      .map((row) => JSON.stringify(row))
      .sort(),
  };
}

async function assertEquivalentQueries(questions) {
  const SQL = await initSqlJs();
  const database = new SQL.Database();
  database.run(SEED_SQL);

  for (const question of questions) {
    const original = normalizeResult(database.exec(question.originalSql));
    const rewritten = normalizeResult(database.exec(question.sqlAnswer));

    assert.deepEqual(
      rewritten,
      original,
      `${question.id} não preservou o resultado da consulta original`,
    );
  }
}

test("consultas originais e reescritas de tuning são equivalentes", async () => {
  await assertEquivalentQueries(TUNING_QUESTIONS);
});

test("consultas difíceis e avançadas preservam os resultados", async () => {
  await assertEquivalentQueries(ADVANCED_TUNING_QUESTIONS);
});

test("reescritas de operadores preservam os resultados", async () => {
  await assertEquivalentQueries(REWRITE_TUNING_QUESTIONS);
});

test("reescritas de nulos preservam os resultados", async () => {
  await assertEquivalentQueries(NULL_TUNING_QUESTIONS);
});

test("enunciados de tuning possuem consultas e orientações completas", () => {
  for (const question of [
    ...TUNING_QUESTIONS,
    ...ADVANCED_TUNING_QUESTIONS,
    ...REWRITE_TUNING_QUESTIONS,
    ...NULL_TUNING_QUESTIONS,
  ]) {
    assert.match(question.text, /^Exercício \d+:/);
    assert.ok(question.originalSql.trim().endsWith(";"));
    assert.ok(question.sqlAnswer.trim().endsWith(";"));
    assert.ok(question.hint.length > 40);
    assert.ok(question.concepts.length >= 2);
  }
});

test("o lote de nulos substitui IS NULL e IS NOT NULL", () => {
  const originalSql = NULL_TUNING_QUESTIONS.map(
    (question) => question.originalSql,
  ).join("\n");
  const rewrittenSql = NULL_TUNING_QUESTIONS.map(
    (question) => question.sqlAnswer,
  ).join("\n");

  assert.equal(NULL_TUNING_QUESTIONS.length, 8);
  assert.match(originalSql, /\bIS\s+NULL\b/i);
  assert.match(originalSql, /\bIS\s+NOT\s+NULL\b/i);
  assert.doesNotMatch(rewrittenSql, /\bIS\s+NULL\b/i);
  assert.doesNotMatch(rewrittenSql, /\bIS\s+NOT\s+NULL\b/i);
  assert.match(rewrittenSql, /\bJOIN\b/i);
  assert.match(rewrittenSql, /\bHAVING\s+COUNT\(/i);
  assert.match(rewrittenSql, /\bBETWEEN\b/i);

  assert.equal(
    NULL_TUNING_QUESTIONS.filter((question) => question.difficulty === 2)
      .length,
    5,
  );
  assert.equal(
    NULL_TUNING_QUESTIONS.filter((question) => question.difficulty === 3)
      .length,
    3,
  );
});

test("o lote de reescritas cobre os operadores pedidos nos níveis médio e difícil", () => {
  const originalSql = REWRITE_TUNING_QUESTIONS.map(
    (question) => question.originalSql,
  ).join("\n");
  const rewrittenSql = REWRITE_TUNING_QUESTIONS.map(
    (question) => question.sqlAnswer,
  ).join("\n");

  assert.equal(REWRITE_TUNING_QUESTIONS.length, 12);
  assert.match(originalSql, /\bDISTINCT\b/i);
  assert.match(originalSql, /\bEXCEPT\b/i);
  assert.match(originalSql, /<>|!=/);
  assert.match(originalSql, /LIKE\s+'%[^']+%'/i);
  assert.match(rewrittenSql, /\bUNION\b/i);
  assert.match(rewrittenSql, /LIKE\s+'[^%'][^']*%'/i);
  assert.match(rewrittenSql, /=\s*'The Matrix'/i);
  assert.match(rewrittenSql, /=\s*'Action'/i);
  assert.doesNotMatch(rewrittenSql, /\bDISTINCT\b/i);
  assert.doesNotMatch(rewrittenSql, /\bEXCEPT\b/i);
  assert.doesNotMatch(rewrittenSql, /<>|!=/);
  assert.doesNotMatch(rewrittenSql, /LIKE\s+'%/i);

  assert.equal(
    REWRITE_TUNING_QUESTIONS.filter((question) => question.difficulty === 2)
      .length,
    6,
  );
  assert.equal(
    REWRITE_TUNING_QUESTIONS.filter((question) => question.difficulty === 3)
      .length,
    6,
  );
});

test("o novo lote contém apenas questões difíceis e avançadas", () => {
  assert.ok(ADVANCED_TUNING_QUESTIONS.length >= 6);

  for (const question of ADVANCED_TUNING_QUESTIONS) {
    assert.ok(
      question.difficulty === 3 || question.difficulty === 4,
      `${question.id} possui dificuldade fora do lote avançado`,
    );
  }
});
