"use client";

import { RA_OPERATION_NAMES } from "@/lib/ra";

export function RACheckResult({ result }) {
  if (!result) {
    return null;
  }

  if (result.status === "correct") {
    return (
      <div
        style={{
          alignItems: "center",
          background: "#E8F5E9",
          border: "1px solid #66BB6A50",
          borderRadius: 10,
          display: "flex",
          gap: 10,
          marginTop: 10,
          padding: "12px 16px",
        }}
      >
        <span style={{ fontSize: 22 }}>✅</span>
        <div>
          <div style={{ color: "#2E7D32", fontSize: 13, fontWeight: 700 }}>
            Expressão correta!
          </div>
          <div style={{ color: "#43A047", fontSize: 11, marginTop: 2 }}>
            Sua álgebra relacional corresponde ao gabarito após a normalização.
          </div>
        </div>
      </div>
    );
  }

  const feedbackConfig = {
    near: {
      background: "#FFF8E1",
      border: "#FFD54F50",
      color: "#E65100",
      icon: "🟡",
      label: "Quase lá! Operadores e relações corretos, mas a estrutura difere.",
    },
    partial: {
      background: "#FFF3E0",
      border: "#FFB74D50",
      color: "#BF360C",
      icon: "🟠",
      label: "Parcialmente correto.",
    },
    wrong: {
      background: "#FFEBEE",
      border: "#EF9A9A50",
      color: "#B71C1C",
      icon: "❌",
      label: "Expressão muito diferente do gabarito.",
    },
  }[result.status];

  const percentage = Math.round(result.score * 100);

  return (
    <div
      style={{
        background: feedbackConfig.background,
        border: `1px solid ${feedbackConfig.border}`,
        borderRadius: 10,
        marginTop: 10,
        padding: "12px 16px",
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 18 }}>{feedbackConfig.icon}</span>
        <span
          style={{
            color: feedbackConfig.color,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {feedbackConfig.label}
        </span>
        <span
          style={{
            background: feedbackConfig.border,
            borderRadius: 6,
            color: feedbackConfig.color,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            marginLeft: "auto",
            opacity: 0.8,
            padding: "2px 8px",
          }}
        >
          {percentage}% similar
        </span>
      </div>
      <div
        style={{
          background: "#E0E0E0",
          borderRadius: 4,
          height: 4,
          marginBottom: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: percentage >= 70 ? "#FFA726" : "#EF5350",
            borderRadius: 4,
            height: "100%",
            transition: "width 0.4s ease",
            width: `${percentage}%`,
          }}
        />
      </div>
      {result.missingOps.length > 0 && (
        <div
          style={{
            alignItems: "center",
            color: "#5D4037",
            display: "flex",
            flexWrap: "wrap",
            fontSize: 12,
            gap: 6,
            marginBottom: 5,
          }}
        >
          <strong>Operadores faltando:</strong>
          {result.missingOps.map((operation) => (
            <span
              key={operation}
              style={{
                background: "#FFCCBC",
                borderRadius: 6,
                color: "#BF360C",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                padding: "1px 8px",
              }}
            >
              {operation} {RA_OPERATION_NAMES[operation]}
            </span>
          ))}
        </div>
      )}
      {result.extraOps.length > 0 && (
        <div
          style={{
            alignItems: "center",
            color: "#5D4037",
            display: "flex",
            flexWrap: "wrap",
            fontSize: 12,
            gap: 6,
            marginBottom: 5,
          }}
        >
          <strong>Operadores a mais:</strong>
          {result.extraOps.map((operation) => (
            <span
              key={operation}
              style={{
                background: "#E3F2FD",
                borderRadius: 6,
                color: "#1565C0",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                padding: "1px 8px",
              }}
            >
              {operation} {RA_OPERATION_NAMES[operation]}
            </span>
          ))}
        </div>
      )}
      {result.missingRels.length > 0 && (
        <div
          style={{
            alignItems: "center",
            color: "#5D4037",
            display: "flex",
            flexWrap: "wrap",
            fontSize: 12,
            gap: 6,
            marginBottom: 5,
          }}
        >
          <strong>Relações faltando:</strong>
          {result.missingRels.map((relation) => (
            <code
              key={relation}
              style={{
                background: "#FFCCBC",
                borderRadius: 6,
                color: "#BF360C",
                padding: "1px 8px",
              }}
            >
              {relation}
            </code>
          ))}
        </div>
      )}
      {result.extraRels.length > 0 && (
        <div
          style={{
            alignItems: "center",
            color: "#5D4037",
            display: "flex",
            flexWrap: "wrap",
            fontSize: 12,
            gap: 6,
            marginBottom: 5,
          }}
        >
          <strong>Relações a mais:</strong>
          {result.extraRels.map((relation) => (
            <code
              key={relation}
              style={{
                background: "#E3F2FD",
                borderRadius: 6,
                color: "#1565C0",
                padding: "1px 8px",
              }}
            >
              {relation}
            </code>
          ))}
        </div>
      )}
      {result.missingOps.length === 0 &&
        result.extraOps.length === 0 &&
        result.missingRels.length === 0 &&
        result.extraRels.length === 0 && (
          <div style={{ color: "#5D4037", fontSize: 12 }}>
            Operadores e relações corretos. Revise a estrutura e as condições das junções.
          </div>
        )}
    </div>
  );
}
