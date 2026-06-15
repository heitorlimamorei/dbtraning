"use client";

import { AIInsightAction } from "@/components/training/ai-insight-action";

const TUNING_ACCENT = {
  border: "#FF525240",
  panel: "#FFF0F0",
  soft: "#FFEAEA",
  text: "#D32F2F",
};

export function TuningInsights({ question, sqlValue }) {
  return (
    <AIInsightAction
      accent={TUNING_ACCENT}
      body={{
        expectedSql: question.sqlAnswer,
        originalSql: question.originalSql,
        question: question.text,
        sql: sqlValue,
      }}
      buttonLabel="Ask Wlad"
      disabled={!sqlValue.trim()}
      endpoint="/api/tuning-insights-v2"
      id={`tuning-insights-${question.id}`}
      iconAlt="Avatar do Wlad"
      iconSrc="/images/ask-wlad.png"
      panelTitle="Ask Wlad · Avaliação de Tuning"
    />
  );
}
