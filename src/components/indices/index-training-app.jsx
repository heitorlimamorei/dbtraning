"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  INDEX_CATEGORIES,
  INDEX_EXERCISES,
} from "@/data/index-training-data";
import {
  BLOCK_BYTES,
  isWithinTolerance,
  parseNumericAnswer,
} from "@/lib/index-calculations";
import styles from "./index-training-app.module.css";

const numberFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
});

function formatNumber(value) {
  return numberFormatter.format(value);
}

function formatBytes(value) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let result = value;
  let unit = 0;
  while (result >= 1024 && unit < units.length - 1) {
    result /= 1024;
    unit += 1;
  }
  return `${formatNumber(result)} ${units[unit]}`;
}

function Difficulty({ value }) {
  const labels = ["", "Fundamentos", "Fácil", "Médio", "Difícil"];
  return <span className={styles.difficulty}>{labels[value] ?? "Avançado"}</span>;
}

function SchemaSummary({ exercise }) {
  return (
    <div className={styles.schemaBox}>
      <div className={styles.schemaHeader}>
        <span>{exercise.table.name}</span>
        <span>{exercise.table.amount.toLocaleString("pt-BR")} registros</span>
      </div>
      <div className={styles.fields}>
        {exercise.table.fields.map((field) => (
          <span
            className={`${styles.field} ${
              exercise.indexFields?.includes(field) ? styles.indexedField : ""
            }`}
            key={field.name}
          >
            <strong>{field.name}</strong>
            <small>{field.size} B</small>
            {field.pk && <em>PK</em>}
            {field.fk && <em>FK</em>}
          </span>
        ))}
      </div>
    </div>
  );
}

function ExerciseCard({ exercise, index, color }) {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const results = useMemo(
    () =>
      Object.fromEntries(
        exercise.metrics.map((metric) => [
          metric.key,
          isWithinTolerance(answers[metric.key], exercise.answers[metric.key]),
        ]),
      ),
    [answers, exercise],
  );

  const answeredCount = exercise.metrics.filter(
    (metric) => Number.isFinite(parseNumericAnswer(answers[metric.key])),
  ).length;
  const correctCount = exercise.metrics.filter((metric) => results[metric.key]).length;
  const complete = answeredCount === exercise.metrics.length;

  function updateAnswer(key, value) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setChecked(false);
  }

  return (
    <article className={styles.exerciseCard}>
      <div className={styles.exerciseTop}>
        <span className={styles.exerciseNumber} style={{ background: color }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className={styles.exerciseHeading}>
          <div className={styles.titleRow}>
            <h3>{exercise.title}</h3>
            <Difficulty value={exercise.difficulty} />
          </div>
          <p>{exercise.context}</p>
        </div>
      </div>

      <SchemaSummary exercise={exercise} />

      <div className={styles.answerGrid}>
        {exercise.metrics.map((metric) => {
          const hasValue = Number.isFinite(parseNumericAnswer(answers[metric.key]));
          const status = checked && hasValue ? (results[metric.key] ? "correct" : "wrong") : "";
          return (
            <label className={`${styles.answerField} ${status ? styles[status] : ""}`} key={metric.key}>
              <span>{metric.label}</span>
              <div className={styles.inputWrap}>
                <input
                  aria-label={metric.label}
                  inputMode="decimal"
                  onChange={(event) => updateAnswer(metric.key, event.target.value)}
                  placeholder="Sua resposta"
                  value={answers[metric.key] ?? ""}
                />
                <small>{metric.unit}</small>
                {checked && hasValue && (
                  <b aria-label={results[metric.key] ? "Correto" : "Incorreto"}>
                    {results[metric.key] ? "✓" : "×"}
                  </b>
                )}
              </div>
              <em>{metric.hint}</em>
            </label>
          );
        })}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.checkButton}
          disabled={!complete}
          onClick={() => setChecked(true)}
          style={{ background: complete ? color : undefined }}
          type="button"
        >
          Verificar respostas
        </button>
        <button
          className={styles.solutionButton}
          onClick={() => setShowSolution((current) => !current)}
          type="button"
        >
          {showSolution ? "Ocultar resolução" : "Ver resolução"}
        </button>
        {checked && (
          <span className={correctCount === exercise.metrics.length ? styles.scorePerfect : styles.score}>
            {correctCount}/{exercise.metrics.length} corretas
          </span>
        )}
      </div>

      {checked && correctCount < exercise.metrics.length && (
        <p className={styles.feedback}>
          Revise os campos marcados. A faixa aceita vai de 99% a 101% do resultado.
        </p>
      )}

      {showSolution && (
        <div className={styles.solution}>
          <div>
            <span className={styles.eyebrow}>Raciocínio</span>
            <ol>
              {exercise.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </div>
          <div>
            <span className={styles.eyebrow}>Resultados exatos</span>
            <dl>
              {exercise.metrics.map((metric) => (
                <div key={metric.key}>
                  <dt>{metric.label}</dt>
                  <dd>
                    {formatNumber(exercise.answers[metric.key])} {metric.unit}
                    {metric.unit === "bytes" && exercise.answers[metric.key] >= 1024 && (
                      <small> ({formatBytes(exercise.answers[metric.key])})</small>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </article>
  );
}

export function IndexTrainingApp() {
  const [activeCategoryId, setActiveCategoryId] = useState(INDEX_CATEGORIES[0].id);
  const activeCategory = INDEX_CATEGORIES.find((item) => item.id === activeCategoryId);
  const exercises = INDEX_EXERCISES.filter((item) => item.category === activeCategoryId);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <nav className={styles.topNav} aria-label="Navegação principal">
            <Link href="/">Álgebra & SQL</Link>
            <Link href="/tuning">Tuning</Link>
            <Link href="/transacoes">Transações</Link>
          </nav>
          <div className={styles.hero}>
            <div>
              <span className={styles.kicker}>ARQUITETURA FÍSICA DE DADOS</span>
              <h1>Laboratório de índices</h1>
              <p>Aprenda a dimensionar arquivos, índices ordenados, multinível e árvores B+.</p>
            </div>
            <div className={styles.constants}>
              <span><small>BLOCO</small><strong>{formatBytes(BLOCK_BYTES)}</strong></span>
              <span><small>PONTEIRO</small><strong>16 B</strong></span>
              <span><small>TOLERÂNCIA</small><strong>±1%</strong></span>
            </div>
          </div>

          <div className={styles.tabs} role="tablist" aria-label="Tipos de cálculo">
            {INDEX_CATEGORIES.map((category) => {
              const active = category.id === activeCategoryId;
              const count = INDEX_EXERCISES.filter((item) => item.category === category.id).length;
              return (
                <button
                  aria-selected={active}
                  className={active ? styles.activeTab : ""}
                  key={category.id}
                  onClick={() => setActiveCategoryId(category.id)}
                  role="tab"
                  style={active ? { "--tab-color": category.color } : undefined}
                  type="button"
                >
                  <b>{category.icon}</b>
                  <span>{category.title}</span>
                  <small>{count}</small>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.lesson} style={{ "--category-color": activeCategory.color }}>
          <div>
            <span className={styles.eyebrow}>CONCEITO DA TRILHA</span>
            <h2>{activeCategory.subtitle}</h2>
            <p>{activeCategory.description}</p>
          </div>
          <div className={styles.formulas}>
            {activeCategory.formulas.map((formula) => <code key={formula}>{formula}</code>)}
          </div>
        </section>

        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>PRATIQUE</span>
            <h2>{exercises.length} exercícios guiados</h2>
          </div>
          <p>Use números em bytes. Separadores brasileiros (1.234,5) também são aceitos.</p>
        </div>

        <div className={styles.exerciseList}>
          {exercises.map((exercise, index) => (
            <ExerciseCard
              color={activeCategory.color}
              exercise={exercise}
              index={index}
              key={exercise.id}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
