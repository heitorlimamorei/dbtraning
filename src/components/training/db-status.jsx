"use client";

const STATUS_COLORS = {
  error: "#E57373",
  loading: "#FFA726",
  ready: "#66BB6A",
};

const STATUS_LABELS = {
  error: "Erro SQL",
  loading: "Carregando SQLite…",
  ready: "SQLite pronto",
};

export function DbStatus({ status }) {
  return (
    <div
      style={{
        alignItems: "center",
        background: `${STATUS_COLORS[status]}15`,
        border: `1px solid ${STATUS_COLORS[status]}30`,
        borderRadius: 8,
        color: STATUS_COLORS[status],
        display: "inline-flex",
        fontSize: 11,
        fontWeight: 600,
        gap: 6,
        padding: "4px 12px",
      }}
    >
      <span
        style={{
          animation: status === "loading" ? "pulse 1s infinite" : "none",
          background: STATUS_COLORS[status],
          borderRadius: "50%",
          display: "inline-block",
          height: 7,
          width: 7,
        }}
      />
      {STATUS_LABELS[status]}
    </div>
  );
}
