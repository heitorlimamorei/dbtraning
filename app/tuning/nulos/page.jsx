import { TuningApp } from "@/components/tuning/tuning-app";
import {
  NULL_TUNING_CATEGORIES,
  NULL_TUNING_QUESTIONS,
} from "@/data/tuning-null-data";

export const metadata = {
  title: "Nulos em Tuning BD",
  description:
    "Questões intermediárias e difíceis para substituir IS NULL e IS NOT NULL.",
};

export default function NullTuningPage() {
  return (
    <TuningApp
      categories={NULL_TUNING_CATEGORIES}
      pageDescription="IS NULL · IS NOT NULL · anti-junção · domínio · IA Avaliadora"
      pageTitle="Reescritas de Nulos em Tuning BD"
      questions={NULL_TUNING_QUESTIONS}
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
        {
          count: 12,
          href: "/tuning/reescritas",
          icon: "⇄",
          label: "Reescritas",
          position: "before",
        },
      ]}
    />
  );
}
