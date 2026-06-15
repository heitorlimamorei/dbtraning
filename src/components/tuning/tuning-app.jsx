"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ActiveTextareaProvider } from "@/contexts/active-textarea-context";
import { DbProvider } from "@/contexts/db-context";
import { TUNING_CATEGORIES, TUNING_QUESTIONS } from "@/data/tuning-data";
import { useSqlite } from "@/hooks/use-sqlite";
import { SchemaSidebar } from "@/components/training/schema-sidebar";
import { DbStatus } from "@/components/training/db-status";
import { TuningQuestionCard } from "@/components/tuning/tuning-question-card";

const DIFFICULTY_FILTERS = ["Todas", "Fácil", "Médio", "Difícil", "Avançado"];

export function TuningApp({
  categories = TUNING_CATEGORIES,
  questions = TUNING_QUESTIONS,
  pageDescription = "Sintonia de Consultas · IMDB-sample · IA Avaliadora",
  pageTitle = "Treinamento de Tuning BD",
  siblingTabs = [
    {
      count: 6,
      href: "/tuning/desafios",
      icon: "◆",
      label: "Desafios",
      position: "after",
    },
    {
      count: 12,
      href: "/tuning/reescritas",
      icon: "⇄",
      label: "Reescritas",
      position: "after",
    },
  ],
}) {
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0].id);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState(0);
  const { database, status } = useSqlite();

  const filteredQuestions = useMemo(
    () =>
      questions.filter(
        (question) =>
          question.category === activeCategoryId &&
          (difficultyFilter === 0 || question.difficulty === difficultyFilter),
      ),
    [activeCategoryId, difficultyFilter, questions],
  );

  const activeCategory = useMemo(
    () => categories.find((category) => category.id === activeCategoryId),
    [activeCategoryId, categories],
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
                background: "linear-gradient(135deg, #2D1A3B, #4B2B64)",
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
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <h1
                        style={{
                          fontSize: 22,
                          fontWeight: 800,
                          letterSpacing: -0.5,
                          margin: 0,
                        }}
                      >
                        {pageTitle}
                      </h1>
                      <Link 
                        href="/"
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          borderRadius: 8,
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 600,
                          padding: "4px 10px",
                          textDecoration: "none",
                        }}
                      >
                        ← Voltar ao Clássico
                      </Link>
                    </div>
                    <p
                      style={{
                        color: "#B496CD",
                        fontSize: 13,
                        fontWeight: 500,
                        margin: "3px 0 0",
                      }}
                    >
                      {pageDescription}
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
                  {siblingTabs
                    .filter((tab) => tab.position === "before")
                    .map((tab) => (
                      <TuningPageTab key={tab.href} tab={tab} />
                    ))}
                  {categories.map((category) => {
                    const isActive = activeCategoryId === category.id;
                    const questionCount = questions.filter(
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
                          color: isActive ? "#fff" : "#B496CD",
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
                  {siblingTabs
                    .filter((tab) => tab.position !== "before")
                    .map((tab) => (
                      <TuningPageTab key={tab.href} tab={tab} />
                    ))}
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

              {filteredQuestions.map((question, index) => (
                <TuningQuestionCard
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

function TuningPageTab({ tab }) {
  return (
    <Link
      href={tab.href}
      style={{
        alignItems: "center",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 11,
        color: "#B496CD",
        display: "flex",
        fontSize: 12,
        fontWeight: 700,
        gap: 7,
        padding: "9px 14px",
        textDecoration: "none",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: 17 }}>{tab.icon}</span>
      <span>{tab.label}</span>
      <span
        style={{
          background: "rgba(255,255,255,0.08)",
          borderRadius: 7,
          fontSize: 10,
          fontWeight: 800,
          padding: "1px 7px",
        }}
      >
        {tab.count}
      </span>
    </Link>
  );
}
