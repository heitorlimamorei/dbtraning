"use client";

import { useState } from "react";
import { useActiveTextarea } from "@/contexts/active-textarea-context";

const SYMBOLS = [
  { label: "Projeção", value: "π" },
  { label: "Seleção", value: "σ" },
  { label: "Junção", value: "⋈" },
  { label: "União", value: "∪" },
  { label: "Interseção", value: "∩" },
  { label: "Diferença", value: "−" },
  { label: "Agregação", value: "γ" },
  { label: "Renomear", value: "ρ" },
  { label: "Prod.Cart.", value: "×" },
  { label: "Divisão", value: "÷" },
  { label: "Alias", value: "→" },
];

export function SymbolsBar() {
  const { insertSymbol } = useActiveTextarea();
  const [flashSymbol, setFlashSymbol] = useState(null);

  function handleInsert(symbol) {
    insertSymbol(symbol);
    setFlashSymbol(symbol);
    setTimeout(() => setFlashSymbol(null), 250);
  }

  return (
    <div
      style={{
        backdropFilter: "blur(12px)",
        background: "rgba(248,249,252,0.95)",
        border: "1px solid #E8EAF0",
        borderRadius: 12,
        display: "flex",
        flexWrap: "wrap",
        gap: 5,
        marginBottom: 16,
        padding: "10px 14px",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <span
        style={{
          alignItems: "center",
          color: "#8B8FA3",
          display: "flex",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1,
          marginRight: 2,
          textTransform: "uppercase",
        }}
      >
        RA:
      </span>
      {SYMBOLS.map((symbol) => (
        <button
          key={symbol.value}
          onClick={() => handleInsert(symbol.value)}
          title={symbol.label}
          style={{
            alignItems: "center",
            background: flashSymbol === symbol.value ? "#E8F5E9" : "#fff",
            border: `1px solid ${
              flashSymbol === symbol.value ? "#66BB6A" : "#E2E4EA"
            }`,
            borderRadius: 7,
            color: "#1A1D29",
            cursor: "pointer",
            display: "flex",
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            gap: 4,
            padding: "3px 9px",
            transform: flashSymbol === symbol.value ? "scale(1.12)" : "scale(1)",
            transition: "all 0.12s",
          }}
        >
          <span style={{ fontWeight: 700 }}>{symbol.value}</span>
          <span
            style={{
              color: "#8B8FA3",
              fontFamily: "var(--font-sans)",
              fontSize: 9,
            }}
          >
            {symbol.label}
          </span>
        </button>
      ))}
    </div>
  );
}
