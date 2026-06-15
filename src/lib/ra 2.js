export const RA_OPERATIONS = ["π", "σ", "⋈", "∪", "∩", "−", "γ", "ρ", "×", "÷"];
export const RA_RELATIONS = [
  "movies",
  "actors",
  "roles",
  "directors",
  "movies_directors",
  "movies_genres",
  "directors_genres",
];

export const RA_OPERATION_NAMES = {
  π: "Projeção (π)",
  σ: "Seleção (σ)",
  "⋈": "Junção (⋈)",
  "∪": "União (∪)",
  "∩": "Interseção (∩)",
  "−": "Diferença (−)",
  γ: "Agregação (γ)",
  ρ: "Renomear (ρ)",
  "×": "Produto (×)",
  "÷": "Divisão (÷)",
};

export function compareRA(userExpression, answerExpression) {
  if (!userExpression || !userExpression.trim()) {
    return null;
  }

  const normalize = (value) =>
    value.replace(/\s+/g, "").replace(/['']/g, "'").toLowerCase();

  if (normalize(userExpression) === normalize(answerExpression)) {
    return {
      extraOps: [],
      extraRels: [],
      missingOps: [],
      missingRels: [],
      score: 1,
      status: "correct",
    };
  }

  const userOps = RA_OPERATIONS.filter((operation) =>
    userExpression.includes(operation),
  );
  const answerOps = RA_OPERATIONS.filter((operation) =>
    answerExpression.includes(operation),
  );
  const userRelations = RA_RELATIONS.filter((relation) =>
    userExpression.toLowerCase().includes(relation),
  );
  const answerRelations = RA_RELATIONS.filter((relation) =>
    answerExpression.toLowerCase().includes(relation),
  );

  const missingOps = answerOps.filter((operation) => !userOps.includes(operation));
  const extraOps = userOps.filter((operation) => !answerOps.includes(operation));
  const missingRels = answerRelations.filter(
    (relation) => !userRelations.includes(relation),
  );
  const extraRels = userRelations.filter(
    (relation) => !answerRelations.includes(relation),
  );

  const total = answerOps.length + answerRelations.length;
  const correct =
    answerOps.length -
    missingOps.length +
    (answerRelations.length - missingRels.length);
  const score = total > 0 ? correct / total : 0;

  return {
    extraOps,
    extraRels,
    missingOps,
    missingRels,
    score,
    status: score === 1 ? "near" : score >= 0.7 ? "partial" : "wrong",
  };
}
