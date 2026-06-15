import assert from "node:assert/strict";
import test from "node:test";
import initSqlJs from "sql.js";
import { QUESTIONS, SEED_SQL } from "../src/data/training-data.js";
import {
  compareQueryResults,
  compileRA,
  parseRA,
} from "../src/lib/ra.js";

test("todos os gabaritos RA retornam o mesmo resultado do SQL", async () => {
  const SQL = await initSqlJs();
  const database = new SQL.Database();

  database.run(SEED_SQL);

  for (const question of QUESTIONS) {
    const compiled = compileRA(question.answer);
    const actual = database.exec(compiled.sql);
    const expected = database.exec(question.sqlAnswer);

    assert.equal(
      compareQueryResults(actual, expected),
      true,
      `${question.id} divergiu do SQL`,
    );
  }

  database.close();
});

test("rejeita relação e atributo inexistentes", () => {
  assert.throws(() => compileRA("π(name)(missing_table)"), /não existe/);
  assert.throws(() => compileRA("π(missing_column)(movies)"), /não existe/);
});

test("rejeita expressão incompleta", () => {
  assert.throws(() => parseRA("π(name)(movies"), /parêntese/);
});
