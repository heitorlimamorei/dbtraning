"use client";

import { useCallback, useState } from "react";
import { useDb } from "@/contexts/db-context";
import { ResultsTable } from "@/components/training/results-table";
import { HighlightedSQL } from "@/components/training/sql-highlight";
import { SQLEditor } from "@/components/training/editors";
import { TuningInsights } from "@/components/tuning/tuning-insights";

function DifficultyBadge({ level }) {
  const labels = ["", "Fácil", "Médio", "Difícil", "Avançado"];
  const colors = ["", "#6BCB77", "#E8A87C", "#E57373", "#BA68C8"];
  const safeLevel = level > 4 ? 4 : level;

  return (
    <span
      style={{
        border: `1px solid ${colors[safeLevel]}40`,
        borderRadius: 12,
        color: colors[safeLevel],
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.5,
        padding: "2px 10px",
      }}
    >
      {"●".repeat(safeLevel)} {labels[safeLevel]}
    </span>
  );
}

function ConceptTags({ concepts }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
      {concepts.map((concept) => (
        <span
          key={concept}
          style={{
            background: "#F0F1F5",
            borderRadius: 6,
            color: "#8B8FA3",
            fontSize: 10,
            fontWeight: 600,
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

export function TuningQuestionCard({ categoryColor, index, question }) {
  const database = useDb();
  const [sqlValue, setSqlValue] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  const executeSql = useCallback(
    (sql) => {
      if (!database || !sql.trim()) {
        return;
      }

      setRunning(true);

      try {
        const start = performance.now();
        const response = database.exec(sql.trim());
        const end = performance.now();

        if (response.length === 0) {
          setResult({
            columns: ["(sem resultados)"],
            error: null,
            rows: [],
            time: end - start,
          });
        } else {
          setResult({
            columns: response[0].columns,
            error: null,
            rows: response[0].values,
            time: end - start,
          });
        }
      } catch (error) {
        setResult({
          columns: null,
          error: error.message,
          rows: null,
          time: null,
        });
      }

      setRunning(false);
    },
    [database],
  );

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E8EAF0",
        borderRadius: 16,
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
          padding: "14px 20px",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: `${categoryColor}18`,
            borderRadius: 10,
            color: categoryColor,
            display: "flex",
            flexShrink: 0,
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            fontWeight: 800,
            height: 34,
            justifyContent: "center",
            width: 34,
          }}
        >
          {index + 1}
        </div>
        <div style={{ flex: 1 }}>
          <p
            style={{
              color: "#1A1D29",
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 1.6,
              margin: 0,
              whiteSpace: "pre-wrap",
            }}
          >
            {question.text}
          </p>
          {question.originalSql && (
            <div
              style={{
                marginTop: 12,
                background: "#282C34",
                borderLeft: "3px solid #BA68C8",
                borderRadius: 8,
                padding: "12px 16px",
              }}
            >
              <div
                style={{
                  color: "#BA68C8",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1,
                  marginBottom: 6,
                  textTransform: "uppercase",
                }}
              >
                Consulta Original
              </div>
              <pre
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  lineHeight: 1.6,
                  margin: 0,
                  whiteSpace: "pre-wrap",
                }}
              >
                <HighlightedSQL code={question.originalSql} />
              </pre>
            </div>
          )}
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 6,
            }}
          >
            <DifficultyBadge level={question.difficulty} />
            <ConceptTags concepts={question.concepts} />
          </div>
        </div>
      </div>
      <div style={{ padding: "14px 20px" }}>
        <div style={{ marginBottom: 12 }}>
          <label
            style={{
              color: "#8B8FA3",
              display: "block",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.8,
              marginBottom: 6,
              textTransform: "uppercase",
            }}
          >
            SQL Tunado
          </label>
          <div data-editor="sql">
            <SQLEditor
              onChange={setSqlValue}
              onRun={() => executeSql(sqlValue)}
              placeholder="Digite a consulta SQL reescrita (otimizada)..."
              value={sqlValue}
            />
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <button
            onClick={() => executeSql(sqlValue)}
            disabled={!database || running || !sqlValue.trim()}
            style={{
              alignItems: "center",
              background:
                !database || !sqlValue.trim()
                  ? "#E2E4EA"
                  : "linear-gradient(135deg, #43A047, #66BB6A)",
              border: "none",
              borderRadius: 10,
              boxShadow:
                !database || !sqlValue.trim()
                  ? "none"
                  : "0 2px 8px rgba(67,160,71,0.3)",
              color: "#fff",
              cursor: !database || !sqlValue.trim() ? "default" : "pointer",
              display: "inline-flex",
              fontSize: 12,
              fontWeight: 700,
              gap: 6,
              opacity: running ? 0.7 : 1,
              padding: "8px 18px",
            }}
          >
            {running ? "⏳" : "▶"} Executar SQL
            <span style={{ fontSize: 9, fontWeight: 500, opacity: 0.7 }}>
              Ctrl+↵
            </span>
          </button>
          <button
            onClick={() => setShowHint(!showHint)}
            style={{
              background: showHint ? "#FFF9E6" : "#fff",
              border: "1px solid #E2E4EA",
              borderRadius: 10,
              color: "#8B8FA3",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              padding: "8px 16px",
            }}
          >
            💡 {showHint ? "Ocultar" : "Dica"}
          </button>
          
          {/* Botão para chamar a IA do Tuning */}
          <TuningInsights question={question} sqlValue={sqlValue} />

          <button
            onClick={() => setShowAnswer(true)}
            style={{
              background: showAnswer ? "#E8F5E9" : categoryColor,
              border: "none",
              borderRadius: 10,
              color: showAnswer ? "#2E7D32" : "#fff",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
              padding: "8px 16px",
            }}
          >
            {showAnswer ? "✓ Sugestão (Gabarito)" : "Ver Sugestão"}
          </button>
        </div>

        {result && (
          <ResultsTable
            columns={result.columns}
            error={result.error}
            rows={result.rows}
            time={result.time}
          />
        )}

        {showHint && (
          <div
            style={{
              background: "#FFFDE7",
              borderLeft: "3px solid #FFD54F",
              borderRadius: 10,
              color: "#795548",
              fontSize: 13,
              lineHeight: 1.6,
              marginTop: 12,
              padding: "12px 16px",
            }}
          >
            💡 {question.hint}
          </div>
        )}

        {showAnswer && (
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                background: "#282C34",
                borderLeft: "3px solid #61AFEF",
                borderRadius: 10,
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    color: "#61AFEF",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Sugestão de SQL Otimizado
                </div>
                <button
                  onClick={() => executeSql(question.sqlAnswer)}
                  disabled={!database}
                  style={{
                    background: "#2D3148",
                    border: "1px solid #43A04740",
                    borderRadius: 6,
                    color: "#66BB6A",
                    cursor: database ? "pointer" : "default",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "3px 12px",
                  }}
                >
                  ▶ Rodar sugestão
                </button>
              </div>
              <pre
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  lineHeight: 1.7,
                  margin: 0,
                  whiteSpace: "pre-wrap",
                }}
              >
                <HighlightedSQL code={question.sqlAnswer} />
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
