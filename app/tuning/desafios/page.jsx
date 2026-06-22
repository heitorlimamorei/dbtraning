import { TuningApp } from "@/components/tuning/tuning-app";
import {
  ADVANCED_TUNING_CATEGORIES,
  ADVANCED_TUNING_QUESTIONS,
} from "@/data/tuning-advanced-data";

export const metadata = {
  title: "Desafios de Tuning BD",
  description: "Questões difíceis e avançadas de sintonia de consultas SQL.",
};

export default function AdvancedTuningPage() {
  return (
    <TuningApp
      categories={ADVANCED_TUNING_CATEGORIES}
      pageDescription="Questões difíceis e avançadas · IMDB-sample · IA Avaliadora"
      pageTitle="Desafios de Tuning BD"
      questions={ADVANCED_TUNING_QUESTIONS}
      siblingTabs={[
        {
          count: 7,
          href: "/tuning",
          icon: "⚡",
          label: "Sintonia de Consulta",
          position: "before",
        },
        {
          count: 12,
          href: "/tuning/reescritas",
          icon: "⇄",
          label: "Reescritas",
          position: "after",
        },
        {
          count: 8,
          href: "/tuning/nulos",
          icon: "∅",
          label: "Nulos",
          position: "after",
        },
      ]}
    />
  );
}
