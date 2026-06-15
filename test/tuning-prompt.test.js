import assert from "node:assert/strict";
import test from "node:test";

import { buildTuningPrompt } from "../src/lib/tuning-prompt.js";

test("o prompt de tuning inclui a questão e o SQL atuais", () => {
  const values = {
    expectedSql: "SELECT expected FROM reference;",
    originalSql: "SELECT original FROM source;",
    question: "Exercício atual e único",
    sql: "SELECT student FROM answer;",
  };

  const prompt = buildTuningPrompt(values);

  for (const value of Object.values(values)) {
    assert.ok(prompt.includes(value));
  }

  assert.equal(prompt.includes("${question}"), false);
  assert.equal(prompt.includes("${sql"), false);
  assert.equal(prompt.includes("${expectedSql}"), false);
  assert.equal(prompt.includes("${originalSql"), false);
});

test("o prompt exige orientações práticas sem substituições SQL incorretas", () => {
  const prompt = buildTuningPrompt({
    expectedSql: "SELECT expected FROM reference;",
    originalSql: "SELECT original FROM source;",
    question: "Exercício de tuning",
    sql: "SELECT student FROM answer;",
  });

  assert.match(prompt, /Nunca sugira "= NULL"/);
  assert.match(prompt, /LIKE '%texto%'/);
  assert.match(prompt, /não troque silenciosamente/i);
  assert.match(prompt, /índice de texto completo/i);
  assert.match(prompt, /\*\*Trecho atual\*\*, \*\*Como corrigir\*\*/);
  assert.match(prompt, /Impacto semântico/);
  assert.match(prompt, /não afirme que sempre causam varredura completa/i);
  assert.match(prompt, /não armazena[m]? NULL|não armazenam NULL/i);
  assert.match(prompt, /sem EXPLAIN/i);
});
