"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  TRANSACTION_CATEGORIES,
  TRANSACTION_EXERCISES,
} from "@/data/transaction-data";
import { TransactionCard } from "@/components/transactions/transaction-card";

const DIFFICULTY_FILTERS = ["Todas", "Facil", "Medio", "Dificil", "Avancado"];

export function TransactionApp() {
  const [activeCategoryId, setActiveCategoryId] = useState(TRANSACTION_CATEGORIES[0].id);
  const [difficultyFilter, setDifficultyFilter] = useState(0);

  const activeCategory = useMemo(
    () => TRANSACTION_CATEGORIES.find((category) => category.id === activeCategoryId),
    [activeCategoryId],
  );

  const filteredExercises = useMemo(
    () =>
      TRANSACTION_EXERCISES.filter(
        (exercise) =>
          exercise.category === activeCategoryId &&
          (difficultyFilter === 0 || exercise.difficulty === difficultyFilter),
      ),
    [activeCategoryId, difficultyFilter],
  );

  return (
    <div
      style={{
        background: "#F2F3F7",
        fontFamily: "var(--font-sans)",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          background: "linear-gradient(135deg, #17324D, #38516B)",
          color: "#fff",
          padding: "20px 24px 16px",
        }}
      >
        <div style={{ margin: "0 auto", maxWidth: 980 }}>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 10 }}>
                <h1
                  style={{
                    fontSize: 22,
                    fontWeight: 850,
                    margin: 0,
                  }}
                >
                  Transações e Concorrência
                </h1>
                <Link
                  href="/"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "5px 10px",
                    textDecoration: "none",
                  }}
                >
                  Clássico
                </Link>
                <Link
                  href="/tuning"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "5px 10px",
                    textDecoration: "none",
                  }}
                >
                  Tuning
                </Link>
                <Link
                  href="/indices"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "5px 10px",
                    textDecoration: "none",
                  }}
                >
                  Índices
                </Link>
              </div>
              <p
                style={{
                  color: "#B7C6D5",
                  fontSize: 13,
                  fontWeight: 550,
                  margin: "4px 0 0",
                }}
              >
                20 walkthroughs · completude · recuperabilidade · grafos · 2PL · timestamp
              </p>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                color: "#DDE7F1",
                fontSize: 12,
                fontWeight: 700,
                padding: "8px 11px",
              }}
            >
              Graphology + SVG
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 7,
              marginTop: 16,
              overflowX: "auto",
              paddingBottom: 4,
            }}
          >
            {TRANSACTION_CATEGORIES.map((category) => {
              const isActive = activeCategoryId === category.id;
              const count = TRANSACTION_EXERCISES.filter(
                (exercise) => exercise.category === category.id,
              ).length;

              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategoryId(category.id);
                    setDifficultyFilter(0);
                  }}
                  style={{
                    alignItems: "center",
                    background: isActive ? category.color : "rgba(255,255,255,0.06)",
                    border: "none",
                    borderRadius: 8,
                    color: isActive ? "#fff" : "#B7C6D5",
                    cursor: "pointer",
                    display: "flex",
                    fontSize: 12,
                    fontWeight: 800,
                    gap: 7,
                    padding: "9px 13px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
                    {category.icon}
                  </span>
                  <span>{category.title}</span>
                  <span
                    style={{
                      background: "rgba(255,255,255,0.18)",
                      borderRadius: 7,
                      fontSize: 10,
                      padding: "1px 7px",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main
        style={{
          margin: "0 auto",
          maxWidth: 980,
          padding: "20px 16px 42px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div>
            <h2
              style={{
                color: "#1A1D29",
                fontSize: 16,
                fontWeight: 800,
                margin: 0,
              }}
            >
              {activeCategory.subtitle}
            </h2>
            <p
              style={{
                color: "#8B8FA3",
                fontSize: 12,
                margin: "2px 0 0",
              }}
            >
              {filteredExercises.length} exercícios
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {DIFFICULTY_FILTERS.map((label, index) => (
              <button
                key={label}
                onClick={() => setDifficultyFilter(index)}
                style={{
                  background: difficultyFilter === index ? `${activeCategory.color}15` : "#fff",
                  border:
                    difficultyFilter === index
                      ? `2px solid ${activeCategory.color}`
                      : "1px solid #E2E4EA",
                  borderRadius: 8,
                  color: difficultyFilter === index ? activeCategory.color : "#8B8FA3",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "5px 11px",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {filteredExercises.map((exercise, index) => (
          <TransactionCard
            key={exercise.id}
            categoryColor={activeCategory.color}
            exercise={exercise}
            index={index}
          />
        ))}
      </main>
    </div>
  );
}
