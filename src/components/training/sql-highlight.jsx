"use client";

import { useMemo } from "react";
import { tokenizeSQL } from "@/lib/sql-highlight";

export function HighlightedSQL({ code }) {
  const tokens = useMemo(() => tokenizeSQL(code), [code]);

  return (
    <pre
      style={{
        fontFamily: "inherit",
        fontSize: "inherit",
        lineHeight: "inherit",
        margin: 0,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {tokens.map((token, index) =>
        token.color ? (
          <span key={`${token.value}-${index}`} style={{ color: token.color }}>
            {token.value}
          </span>
        ) : (
          token.value
        ),
      )}
      {"\u200B"}
    </pre>
  );
}
