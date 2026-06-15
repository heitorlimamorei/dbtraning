"use client";

import { AIInsightAction } from "@/components/training/ai-insight-action";

const SQL_ACCENT = {
  border: "#7C4DFF40",
  panel: "#F8F7FF",
  soft: "#EEF2FF",
  text: "#5B3FD6",
};

export function QueryInsights({ question, sqlValue }) {
  return (
    <AIInsightAction
      accent={SQL_ACCENT}
      body={{
        expectedRa: question.answer,
        expectedSql: question.sqlAnswer,
        question: question.text,
        sql: sqlValue,
      }}
      buttonLabel="Analisar SQL"
      disabled={!sqlValue.trim()}
      endpoint="/api/insights"
      id={`sql-insights-${question.id}`}
      panelTitle="Insights SQL ANSI e eficiência"
    />
  );
}
