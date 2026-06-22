"use client";

import { useMemo, useState } from "react";
import {
  analyzeCompleteness,
  analyzeDirtyReads,
  analyzeSerializability,
  analyzeTimestampOrdering,
  compareEdgeSets,
  findDirectedCycle,
  transactionIdsFrom,
} from "@/lib/transactions";
import { GraphView } from "@/components/transactions/graph-view";

function DifficultyBadge({ level }) {
  const labels = ["", "Facil", "Medio", "Dificil", "Avancado"];
  const colors = ["", "#59A14F", "#F28E2B", "#E15759", "#B07AA1"];

  return (
    <span
      style={{
        border: `1px solid ${colors[level]}55`,
        borderRadius: 12,
        color: colors[level],
        fontSize: 11,
        fontWeight: 700,
        padding: "2px 10px",
      }}
    >
      {"●".repeat(level)} {labels[level]}
    </span>
  );
}

function ConceptTags({ concepts }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      {concepts.map((concept) => (
        <span
          key={concept}
          style={{
            background: "#F0F1F5",
            borderRadius: 6,
            color: "#8B8FA3",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 0.3,
            padding: "2px 8px",
            textTransform: "uppercase",
          }}
        >
          {concept}
        </span>
      ))}
    </div>
  );
}

function OperationList({ operations }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {operations.map((operation, index) => (
        <span
          key={`${operation}-${index}`}
          style={{
            background: "#282C34",
            borderRadius: 7,
            color: "#F8F9FC",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            fontWeight: 700,
            padding: "5px 8px",
          }}
        >
          {operation}
        </span>
      ))}
    </div>
  );
}

function TransactionsTable({ transactions }) {
  return (
    <div
      style={{
        border: "1px solid #E2E4EA",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {Object.entries(transactions).map(([tx, operations]) => (
        <div
          key={tx}
          style={{
            alignItems: "center",
            borderBottom: "1px solid #E2E4EA",
            display: "grid",
            gap: 10,
            gridTemplateColumns: "54px 1fr",
            padding: "8px 10px",
          }}
        >
          <strong style={{ color: "#1A1D29", fontFamily: "var(--font-mono)" }}>{tx}</strong>
          <code style={{ color: "#5C6370", fontSize: 12 }}>{operations.join(", ")}</code>
        </div>
      ))}
    </div>
  );
}

function AnalysisBadge({ children, tone = "neutral" }) {
  const palette = {
    bad: { background: "#FDEBEC", color: "#B73E42" },
    good: { background: "#EAF6E8", color: "#2F7D32" },
    neutral: { background: "#EEF3FA", color: "#35658F" },
  };

  return (
    <span
      style={{
        background: palette[tone].background,
        borderRadius: 7,
        color: palette[tone].color,
        fontSize: 11,
        fontWeight: 800,
        padding: "5px 9px",
      }}
    >
      {children}
    </span>
  );
}

function GraphValidator({ color, edges }) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState(null);

  return (
    <div style={{ marginTop: 10 }}>
      <label
        style={{
          color: "#8B8FA3",
          display: "block",
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 0.8,
          marginBottom: 6,
          textTransform: "uppercase",
        }}
      >
        Validar arestas
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          onChange={(event) => {
            setValue(event.target.value);
            setResult(null);
          }}
          placeholder="Ex.: T1->T2, T2->T3"
          style={{
            background: "#fff",
            border: "1px solid #D5D7E0",
            borderRadius: 8,
            color: "#1A1D29",
            flex: 1,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            padding: "9px 10px",
          }}
          value={value}
        />
        <button
          onClick={() => setResult(compareEdgeSets(value, edges))}
          style={{
            background: color,
            border: "none",
            borderRadius: 8,
            color: "#fff",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 800,
            padding: "9px 13px",
            whiteSpace: "nowrap",
          }}
        >
          Validar
        </button>
      </div>
      {result && (
        <div
          style={{
            color: result.correct ? "#2F7D32" : "#B73E42",
            fontSize: 12,
            fontWeight: 700,
            lineHeight: 1.5,
            marginTop: 7,
          }}
        >
          {result.correct
            ? "Correto. As arestas batem com o grafo calculado."
            : `Ainda não. Faltando: ${result.missing.join(", ") || "nenhuma"}. Extras: ${
                result.extra.join(", ") || "nenhuma"
              }.`}
        </div>
      )}
    </div>
  );
}

export function TransactionCard({ categoryColor, exercise, index }) {
  const [showHint, setShowHint] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const completeness = useMemo(
    () => analyzeCompleteness(exercise.transactions, exercise.schedule),
    [exercise.schedule, exercise.transactions],
  );
  const recovery = useMemo(
    () =>
      exercise.commitOrder
        ? analyzeDirtyReads(exercise.schedule, exercise.commitOrder)
        : null,
    [exercise.commitOrder, exercise.schedule],
  );
  const serial = useMemo(
    () =>
      exercise.graphType === "precedence"
        ? analyzeSerializability(exercise.transactions, exercise.schedule)
        : null,
    [exercise.graphType, exercise.schedule, exercise.transactions],
  );
  const timestamp = useMemo(
    () =>
      exercise.category === "timestamp"
        ? analyzeTimestampOrdering(exercise.schedule)
        : null,
    [exercise.category, exercise.schedule],
  );

  const graph = useMemo(() => {
    if (serial) {
      return {
        cycle: serial.cycle,
        edges: serial.edges,
        nodes: serial.nodes,
        title: "Grafo de precedência",
      };
    }

    if (exercise.graph) {
      return {
        cycle: findDirectedCycle(exercise.graph.nodes, exercise.graph.edges),
        edges: exercise.graph.edges,
        nodes: exercise.graph.nodes,
        title: "Grafo de espera",
      };
    }

    return null;
  }, [exercise.graph, serial]);

  const txIds = transactionIdsFrom(exercise.transactions, exercise.schedule);
  const showComputedFeedback = showWalkthrough || showAnswer;

  return (
    <article
      style={{
        background: "#fff",
        border: "1px solid #E8EAF0",
        borderRadius: 8,
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        marginBottom: 16,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          alignItems: "flex-start",
          borderBottom: "1px solid #F0F1F5",
          display: "flex",
          gap: 14,
          padding: "15px 20px",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: `${categoryColor}18`,
            borderRadius: 8,
            color: categoryColor,
            display: "flex",
            flexShrink: 0,
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            fontWeight: 900,
            height: 34,
            justifyContent: "center",
            width: 34,
          }}
        >
          {index + 1}
        </div>
        <div style={{ minWidth: 0 }}>
          <h3
            style={{
              color: "#1A1D29",
              fontSize: 15,
              fontWeight: 800,
              margin: "0 0 4px",
            }}
          >
            {exercise.title}
          </h3>
          <p
            style={{
              color: "#1A1D29",
              fontSize: 14,
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            {exercise.objective}
          </p>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 8,
            }}
          >
            <DifficultyBadge level={exercise.difficulty} />
            <ConceptTags concepts={exercise.concepts} />
          </div>
        </div>
      </div>

      <div style={{ padding: "15px 20px" }}>
        <div
          className="transaction-exercise-grid"
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "minmax(220px, 0.8fr) minmax(260px, 1.2fr)",
          }}
        >
          <div>
            <div
              style={{
                color: "#8B8FA3",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 0.8,
                marginBottom: 7,
                textTransform: "uppercase",
              }}
            >
              Transações
            </div>
            <TransactionsTable transactions={exercise.transactions} />
          </div>
          <div>
            <div
              style={{
                color: "#8B8FA3",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 0.8,
                marginBottom: 7,
                textTransform: "uppercase",
              }}
            >
              Escalonamento Sa
            </div>
            <OperationList operations={exercise.schedule} />
            {exercise.commitOrder && (
              <div style={{ marginTop: 8 }}>
                <OperationList operations={exercise.commitOrder} />
              </div>
            )}
          </div>
        </div>

        {showComputedFeedback && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 12 }}>
            <AnalysisBadge tone={completeness.complete ? "good" : "bad"}>
              {completeness.complete ? "Completo" : "Incompleto"}
            </AnalysisBadge>
            {recovery && (
              <AnalysisBadge tone={recovery.recoverable ? "good" : "bad"}>
                {recovery.recoverable ? "Recuperável" : "Não recuperável"}
              </AnalysisBadge>
            )}
            {serial && (
              <AnalysisBadge tone={serial.serializable ? "good" : "bad"}>
                {serial.serializable ? "Serializável" : "Não serializável"}
              </AnalysisBadge>
            )}
            {graph && (
              <AnalysisBadge tone={graph.cycle ? "bad" : "good"}>
                {graph.cycle ? `Ciclo: ${graph.cycle.join(" -> ")}` : "Grafo acíclico"}
              </AnalysisBadge>
            )}
            {timestamp && timestamp.aborted.length > 0 && (
              <AnalysisBadge tone="bad">Abort: {timestamp.aborted.join(", ")}</AnalysisBadge>
            )}
            {timestamp && timestamp.aborted.length === 0 && (
              <AnalysisBadge tone="good">Sem abort</AnalysisBadge>
            )}
          </div>
        )}

        {graph && (
          <div style={{ marginTop: 12 }}>
            {showComputedFeedback && (
              <GraphView
                color={categoryColor}
                edges={graph.edges}
                nodes={graph.nodes.length ? graph.nodes : txIds}
                title={graph.title}
              />
            )}
            <GraphValidator color={categoryColor} edges={graph.edges} />
          </div>
        )}

        {showComputedFeedback && recovery && recovery.dirtyReads.length > 0 && (
          <div
            style={{
              background: "#F8F9FC",
              border: "1px solid #E2E4EA",
              borderRadius: 8,
              color: "#5C6370",
              fontSize: 12,
              lineHeight: 1.55,
              marginTop: 12,
              padding: "10px 12px",
            }}
          >
            <strong style={{ color: "#1A1D29" }}>Leituras sujas detectadas: </strong>
            {recovery.dirtyReads
              .map((read) => `${read.read} le ${read.write}${read.recoverabilityRisk ? " (risco)" : ""}`)
              .join("; ")}
          </div>
        )}

        {showComputedFeedback && timestamp && (
          <div
            style={{
              background: "#F8F9FC",
              border: "1px solid #E2E4EA",
              borderRadius: 8,
              color: "#5C6370",
              fontSize: 12,
              lineHeight: 1.55,
              marginTop: 12,
              padding: "10px 12px",
            }}
          >
            <strong style={{ color: "#1A1D29" }}>Escalonamento efetivo: </strong>
            {timestamp.effectiveSchedule.length ? timestamp.effectiveSchedule.join(", ") : "vazio"}
            {timestamp.rejected.length > 0 && (
              <div style={{ marginTop: 4 }}>
                Rejeições:{" "}
                {timestamp.rejected
                  .map((rejection) => `${rejection.operation} (${rejection.reason})`)
                  .join("; ")}
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
          <button
            onClick={() => setShowHint(!showHint)}
            style={{
              background: showHint ? "#FFF7E6" : "#fff",
              border: "1px solid #E2E4EA",
              borderRadius: 8,
              color: "#5C6370",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 800,
              padding: "8px 13px",
            }}
          >
            Dica
          </button>
          <button
            onClick={() => setShowWalkthrough(!showWalkthrough)}
            style={{
              background: showWalkthrough ? `${categoryColor}18` : "#fff",
              border: `1px solid ${showWalkthrough ? categoryColor : "#E2E4EA"}`,
              borderRadius: 8,
              color: showWalkthrough ? categoryColor : "#5C6370",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 800,
              padding: "8px 13px",
            }}
          >
            Walkthrough
          </button>
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            style={{
              background: showAnswer ? "#EAF6E8" : categoryColor,
              border: "none",
              borderRadius: 8,
              color: showAnswer ? "#2F7D32" : "#fff",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 800,
              padding: "8px 13px",
            }}
          >
            Resposta
          </button>
        </div>

        {showHint && (
          <div
            style={{
              background: "#FFF7E6",
              borderLeft: "3px solid #F2B84B",
              borderRadius: 8,
              color: "#7A5B18",
              fontSize: 13,
              lineHeight: 1.6,
              marginTop: 12,
              padding: "10px 12px",
            }}
          >
            {exercise.hint}
          </div>
        )}

        {showWalkthrough && (
          <ol
            style={{
              background: "#F8F9FC",
              border: "1px solid #E2E4EA",
              borderRadius: 8,
              color: "#3E4451",
              fontSize: 13,
              lineHeight: 1.65,
              margin: "12px 0 0",
              padding: "12px 16px 12px 34px",
            }}
          >
            {exercise.walkthrough.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        )}

        {showAnswer && (
          <div
            style={{
              background: "#EAF6E8",
              borderLeft: "3px solid #59A14F",
              borderRadius: 8,
              color: "#2F6831",
              fontSize: 13,
              fontWeight: 650,
              lineHeight: 1.6,
              marginTop: 12,
              padding: "10px 12px",
            }}
          >
            {exercise.answer}
          </div>
        )}
      </div>
    </article>
  );
}
