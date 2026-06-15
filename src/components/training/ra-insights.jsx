"use client";

import { AIInsightAction } from "@/components/training/ai-insight-action";

const RA_ACCENT = {
  border: "#00897B40",
  panel: "#F1FBF9",
  soft: "#E8F5F2",
  text: "#00796B",
};

export function RAInsights({ question, raValue }) {
  return (
    <AIInsightAction
      accent={RA_ACCENT}
      body={{
        expectedRa: question.answer,
        expectedSql: question.sqlAnswer,
        question: question.text,
        relationalAlgebra: raValue,
      }}
      buttonLabel="Analisar RA"
      disabled={!raValue.trim()}
      endpoint="/api/ra-insights"
      id={`ra-insights-${question.id}`}
      panelTitle="Qualidade da álgebra relacional"
    />
  );
}
