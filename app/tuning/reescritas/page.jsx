import { TuningApp } from "@/components/tuning/tuning-app";
import {
  REWRITE_TUNING_CATEGORIES,
  REWRITE_TUNING_QUESTIONS,
} from "@/data/tuning-rewrite-data";

export const metadata = {
  title: "Reescritas de Tuning BD",
  description:
    "Questões intermediárias e difíceis sobre reescrita de operadores SQL.",
};

export default function RewriteTuningPage() {
  return (
    <TuningApp
      categories={REWRITE_TUNING_CATEGORIES}
      pageDescription="DISTINCT · EXCEPT · desigualdade · LIKE · UNION · IA Avaliadora"
      pageTitle="Reescritas de Tuning BD"
      questions={REWRITE_TUNING_QUESTIONS}
      siblingTabs={[
        {
          count: 7,
          href: "/tuning",
          icon: "⚡",
          label: "Sintonia de Consulta",
          position: "before",
        },
        {
          count: 6,
          href: "/tuning/desafios",
          icon: "◆",
          label: "Desafios",
          position: "before",
        },
      ]}
    />
  );
}
