"use client";

import { useMemo, useState } from "react";
import { ActiveTextareaProvider } from "@/contexts/active-textarea-context";
import { DbProvider } from "@/contexts/db-context";
import { CATEGORIES, QUESTIONS } from "@/data/training-data";
import { useSqlite } from "@/hooks/use-sqlite";
import { SchemaSidebar } from "@/components/training/schema-sidebar";
import { DbStatus } from "@/components/training/db-status";
import { SymbolsBar } from "@/components/training/symbols-bar";
import { QuestionCard } from "@/components/training/question-card";

const DIFFICULTY_FILTERS = ["Todas", "Fácil", "Médio", "Difícil", "Avançado"];

export function TrainingApp() {
  const [activeCategoryId, setActiveCategoryId] = useState("ho04");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState(0);
  const { database, status } = useSqlite();

  const filteredQuestions = useMemo(
    () =>
      QUESTIONS.filter(
        (question) =>
          question.category === activeCategoryId &&
          (difficultyFilter === 0 || question.difficulty === difficultyFilter),
      ),
    [activeCategoryId, difficultyFilter],
  );

  const activeCategory = useMemo(
    () => CATEGORIES.find((category) => category.id === activeCategoryId),
    [activeCategoryId],
  );

  return (
    <ActiveTextareaProvider>
      <DbProvider value={database}>
        <div
          style={{
            background: "#F2F3F7",
            display: "flex",
            fontFamily: "var(--font-sans)",
            minHeight: "100vh",
          }}
        >
          <SchemaSidebar
            collapsed={sidebarCollapsed}
            dbStatus={status}
            setCollapsed={setSidebarCollapsed}
          />

          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            <header
              style={{
                background: "linear-gradient(135deg, #1A1D29, #2D3148)",
                color: "#fff",
                padding: "20px 24px 16px",
              }}
            >
              <div style={{ margin: "0 auto", maxWidth: 900 }}>
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
                    <h1
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        letterSpacing: -0.5,
                        margin: 0,
                      }}
                    >
                      Treinamento BD
                    </h1>
                    <p
                      style={{
                        color: "#9CA0B0",
                        fontSize: 13,
                        fontWeight: 500,
                        margin: "3px 0 0",
                      }}
                    >
                      Álgebra Relacional & SQL · IMDB-sample · SQLite no navegador
                    </p>
                  </div>
                  <DbStatus status={status} />
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
                  {CATEGORIES.map((category) => {
                    const isActive = activeCategoryId === category.id;
                    const questionCount = QUESTIONS.filter(
                      (question) => question.category === category.id,
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
                          background: isActive
                            ? category.color
                            : "rgba(255,255,255,0.06)",
                          border: "none",
                          borderRadius: 11,
                          color: isActive ? "#fff" : "#9CA0B0",
                          cursor: "pointer",
                          display: "flex",
                          fontSize: 12,
                          fontWeight: 700,
                          gap: 7,
                          padding: "9px 14px",
                          transition: "all 0.2s",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span style={{ fontSize: 17 }}>{category.icon}</span>
                        <span>{category.title}</span>
                        <span
                          style={{
                            background: isActive
                              ? "rgba(255,255,255,0.25)"
                              : "rgba(255,255,255,0.08)",
                            borderRadius: 7,
                            fontSize: 10,
                            fontWeight: 800,
                            padding: "1px 7px",
                          }}
                        >
                          {questionCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </header>

            <main
              style={{
                flex: 1,
                margin: "0 auto",
                maxWidth: 900,
                padding: "20px 16px 40px",
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
                      fontWeight: 700,
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
                    {filteredQuestions.length} questões
                  </p>
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  {DIFFICULTY_FILTERS.map((label, index) => (
                    <button
                      key={label}
                      onClick={() => setDifficultyFilter(index)}
                      style={{
                        background:
                          difficultyFilter === index
                            ? `${activeCategory.color}15`
                            : "#fff",
                        border:
                          difficultyFilter === index
                            ? `2px solid ${activeCategory.color}`
                            : "1px solid #E2E4EA",
                        borderRadius: 8,
                        color:
                          difficultyFilter === index
                            ? activeCategory.color
                            : "#8B8FA3",
                        cursor: "pointer",
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "4px 11px",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <SymbolsBar />

              {filteredQuestions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  categoryColor={activeCategory.color}
                  index={index}
                  question={question}
                />
              ))}

              {filteredQuestions.length === 0 && (
                <div
                  style={{
                    color: "#8B8FA3",
                    fontSize: 14,
                    padding: 40,
                    textAlign: "center",
                  }}
                >
                  Nenhuma questão com esse filtro.
                </div>
              )}
            </main>
          </div>
        </div>
      </DbProvider>
    </ActiveTextareaProvider>
  );
}
