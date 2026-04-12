"use client";

import {
  IMDB_SCHEMA_DISPLAY,
  SCHEMA_RELATIONS,
} from "@/data/training-data";

export function SchemaSidebar({ collapsed, dbStatus, setCollapsed }) {
  return (
    <>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="schema-toggle"
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #1A1D29, #2D3148)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 12,
          bottom: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          color: "#fff",
          cursor: "pointer",
          display: "none",
          fontSize: 18,
          height: 44,
          justifyContent: "center",
          left: 16,
          position: "fixed",
          width: 44,
          zIndex: 200,
        }}
      >
        {collapsed ? "📦" : "✕"}
      </button>

      <aside
        className={`schema-sidebar ${collapsed ? "collapsed" : ""}`}
        style={{
          background: "#1A1D29",
          borderRight: "1px solid #2D3148",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          gap: 0,
          height: "100vh",
          overflowY: "auto",
          padding: "20px 14px",
          position: "sticky",
          scrollbarColor: "#3E4451 #1A1D29",
          scrollbarWidth: "thin",
          top: 0,
          width: 240,
        }}
      >
        <div
          style={{
            borderBottom: "1px solid #2D3148",
            marginBottom: 16,
            paddingBottom: 12,
          }}
        >
          <div
            style={{
              color: "#61AFEF",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 1.5,
              marginBottom: 4,
              textTransform: "uppercase",
            }}
          >
            Schema
          </div>
          <div
            style={{
              color: "#E5E7EB",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            IMDB-sample
          </div>
          <div style={{ marginTop: 8 }}>
            <div
              style={{
                alignItems: "center",
                background: dbStatus === "ready" ? "#66BB6A15" : "#FFA72615",
                border: `1px solid ${
                  dbStatus === "ready" ? "#66BB6A30" : "#FFA72630"
                }`,
                borderRadius: 6,
                color: dbStatus === "ready" ? "#66BB6A" : "#FFA726",
                display: "inline-flex",
                fontSize: 10,
                fontWeight: 600,
                gap: 5,
                padding: "3px 10px",
              }}
            >
              <span
                style={{
                  animation: dbStatus === "loading" ? "pulse 1s infinite" : "none",
                  background: dbStatus === "ready" ? "#66BB6A" : "#FFA726",
                  borderRadius: "50%",
                  height: 6,
                  width: 6,
                }}
              />
              {dbStatus === "ready"
                ? "SQLite ativo"
                : dbStatus === "error"
                  ? "Erro"
                  : "Carregando…"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 6 }}>
          {IMDB_SCHEMA_DISPLAY.tables.map((table) => (
            <div
              key={table.name}
              style={{
                background: "#22253A",
                border: "1px solid #2D3148",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  background: "#282C3E",
                  borderBottom: "1px solid #2D3148",
                  color: "#61AFEF",
                  display: "flex",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 700,
                  gap: 6,
                  padding: "7px 10px",
                }}
              >
                <span style={{ fontSize: 10, opacity: 0.5 }}>⊞</span>
                {table.name}
              </div>
              <div style={{ padding: "6px 10px" }}>
                {table.columns.map((column, columnIndex) => {
                  const isPrimaryKey =
                    columnIndex === 0 &&
                    (table.name === "movies" ||
                      table.name === "actors" ||
                      table.name === "directors");
                  const isForeignKey = SCHEMA_RELATIONS.some(
                    (relation) => relation.from === `${table.name}.${column}`,
                  );

                  return (
                    <div
                      key={column}
                      style={{
                        alignItems: "center",
                        color: isPrimaryKey
                          ? "#C678DD"
                          : isForeignKey
                            ? "#E06C75"
                            : "#ABB2BF",
                        display: "flex",
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        gap: 5,
                        lineHeight: 1.9,
                      }}
                    >
                      {isPrimaryKey && (
                        <span style={{ color: "#C678DD", fontSize: 8 }}>🔑</span>
                      )}
                      {isForeignKey && !isPrimaryKey && (
                        <span style={{ color: "#E06C75", fontSize: 8 }}>→</span>
                      )}
                      {!isPrimaryKey && !isForeignKey && (
                        <span style={{ fontSize: 8, opacity: 0.3 }}>·</span>
                      )}
                      {column}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: "1px solid #2D3148",
            marginTop: 12,
            paddingTop: 12,
          }}
        >
          <div
            style={{
              color: "#5C6370",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1,
              marginBottom: 6,
              textTransform: "uppercase",
            }}
          >
            Relacionamentos
          </div>
          {SCHEMA_RELATIONS.map((relation, index) => (
            <div
              key={`${relation.from}-${relation.to}-${index}`}
              style={{
                alignItems: "center",
                color: "#5C6370",
                display: "flex",
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                gap: 4,
                lineHeight: 1.8,
              }}
            >
              <span style={{ color: "#E06C75" }}>{relation.from.split(".")[0]}</span>
              <span style={{ color: "#3E4451" }}>→</span>
              <span style={{ color: "#61AFEF" }}>{relation.to.split(".")[0]}</span>
            </div>
          ))}
        </div>

        <a
          href="https://dbis-uibk.github.io/relax/calc/local/uibk/local/0"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#3D5AFE15",
            border: "1px solid #3D5AFE30",
            borderRadius: 8,
            color: "#61AFEF",
            display: "block",
            fontSize: 10,
            fontWeight: 600,
            marginTop: 12,
            padding: "8px 12px",
            textAlign: "center",
            textDecoration: "none",
          }}
        >
          ↗ Abrir RelaX Calculator
        </a>
      </aside>
    </>
  );
}
