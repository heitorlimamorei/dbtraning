import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { buildTuningPrompt } from "@/lib/tuning-prompt";

const MODEL = process.env.AI_INSIGHTS_MODEL || "gemini-2.5-flash";
const MAX_QUERY_LENGTH = 8_000;

export const maxDuration = 30;

function normalizeField(value, field, maxLength = MAX_QUERY_LENGTH) {
  if (typeof value !== "string") {
    throw new Error(`Campo "${field}" inválido.`);
  }

  const normalized = value.trim();

  if (normalized.length > maxLength) {
    throw new Error(`Campo "${field}" excede ${maxLength} caracteres.`);
  }

  return normalized;
}

export async function POST(request) {
  try {
    const body = await request.json();
    let question = normalizeField(body.question, "question", 1_500);
    if (question.includes("Consulta Original:")) {
      question = question.split("Consulta Original:")[0].trim();
    }
    const sql = normalizeField(body.sql ?? "", "sql");
    const expectedSql = normalizeField(body.expectedSql ?? "", "expectedSql");
    const originalSql = normalizeField(body.originalSql ?? "", "originalSql", 8_000);

    if (!question) {
      return Response.json({ error: "Exercício não informado." }, { status: 400 });
    }

    if (!sql) {
      return Response.json(
        { error: "Informe uma consulta SQL." },
        { status: 400 },
      );
    }

    const result = streamText({
      abortSignal: request.signal,
      model: google(MODEL),
      temperature: 0.1,
      system: `Você é um Engenheiro de Dados, DBA Sênior e tutor de SQL,
especialista em Projeto Físico e Sintonia de Bancos de Dados.

Avalie somente o SQL do aluno delimitado no prompt. Aponte apenas infrações que
ainda estejam presentes e ensine como corrigi-las com exemplos aplicáveis ao
exercício. Não dê apenas o nome da regra.

Nunca recomende "= NULL" ou "<> NULL". Não apresente como equivalente uma
reescrita que altera o conjunto de resultados, como trocar LIKE '%texto%' por
LIKE 'texto%', sem explicar claramente a mudança de requisito. Diferencie
correção semântica, orientação pedagógica e possível ganho de desempenho.

Se a solução já estiver adequada, reconheça isso e explique brevemente quais
técnicas o aluno aplicou corretamente.`,
      prompt: buildTuningPrompt({
        expectedSql,
        originalSql,
        question,
        sql,
      }),
    });

    return result.toUIMessageStreamResponse({
      onError(error) {
        console.error("AI insights failed:", error);
        return "Não foi possível gerar os insights de tuning. Verifique a chave do Google AI Studio e tente novamente.";
      },
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Requisição inválida." },
      { status: 400 },
    );
  }
}
