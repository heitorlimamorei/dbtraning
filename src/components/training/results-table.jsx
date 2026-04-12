"use client";

export function ResultsTable({ columns, error, rows, time }) {
  if (error) {
    return (
      <div
        style={{
          background: "#2D1B1B",
          border: "1px solid #5C2B2B",
          borderRadius: 10,
          color: "#EF9A9A",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          lineHeight: 1.6,
          marginTop: 10,
          padding: "12px 16px",
        }}
      >
        <strong style={{ color: "#E57373" }}>Erro: </strong>
        {error}
      </div>
    );
  }

  if (!columns) {
    return null;
  }

  return (
    <div style={{ marginTop: 10 }}>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            color: "#43A047",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}
        >
          ✓ {rows.length} linha{rows.length !== 1 ? "s" : ""}
        </span>
        {time != null && (
          <span style={{ color: "#8B8FA3", fontSize: 10 }}>
            {time.toFixed(1)}ms
          </span>
        )}
      </div>
      <div
        style={{
          border: "1px solid #E2E4EA",
          borderRadius: 10,
          maxHeight: 320,
          overflowX: "auto",
          overflowY: "auto",
        }}
      >
        <table
          style={{
            borderCollapse: "collapse",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            width: "100%",
          }}
        >
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  style={{
                    background: "#F0F1F5",
                    borderBottom: "2px solid #D5D7E0",
                    color: "#3D5AFE",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "8px 12px",
                    position: "sticky",
                    textAlign: "left",
                    top: 0,
                    whiteSpace: "nowrap",
                    zIndex: 1,
                  }}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 200).map((row, rowIndex) => (
              <tr
                key={`${rowIndex}-${row.length}`}
                style={{ background: rowIndex % 2 === 0 ? "#FAFBFC" : "#fff" }}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${rowIndex}-${cellIndex}`}
                    style={{
                      borderBottom: "1px solid #F0F1F5",
                      color: cell === null ? "#B0B4C4" : "#1A1D29",
                      fontStyle: cell === null ? "italic" : "normal",
                      padding: "5px 12px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cell === null ? "NULL" : String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length > 200 && (
          <div
            style={{
              background: "#F8F9FC",
              color: "#8B8FA3",
              fontSize: 11,
              padding: 8,
              textAlign: "center",
            }}
          >
            Mostrando 200 de {rows.length}
          </div>
        )}
      </div>
    </div>
  );
}
