import { IndexTrainingApp } from "@/components/indices/index-training-app";

export const metadata = {
  title: "Laboratório de Índices BD",
  description:
    "Exercícios guiados de organização de arquivos, índices primários, secundários, multinível e árvores B+.",
};

export default function IndexesPage() {
  return <IndexTrainingApp />;
}
