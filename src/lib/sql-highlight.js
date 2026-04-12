const SQL_KEYWORDS = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "JOIN",
  "INNER",
  "LEFT",
  "RIGHT",
  "OUTER",
  "FULL",
  "CROSS",
  "ON",
  "AND",
  "OR",
  "NOT",
  "IN",
  "EXISTS",
  "BETWEEN",
  "LIKE",
  "IS",
  "NULL",
  "AS",
  "DISTINCT",
  "GROUP",
  "BY",
  "HAVING",
  "ORDER",
  "ASC",
  "DESC",
  "LIMIT",
  "OFFSET",
  "UNION",
  "INTERSECT",
  "EXCEPT",
  "ALL",
  "INSERT",
  "INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE",
  "CREATE",
  "TABLE",
  "DROP",
  "ALTER",
  "ADD",
  "PRIMARY",
  "KEY",
  "FOREIGN",
  "REFERENCES",
  "COUNT",
  "SUM",
  "AVG",
  "MIN",
  "MAX",
  "CASE",
  "WHEN",
  "THEN",
  "ELSE",
  "END",
  "CAST",
  "WITH",
  "OVER",
  "PARTITION",
]);

export function tokenizeSQL(code) {
  if (!code) {
    return [];
  }

  const tokens = [];
  const tokenRegex =
    /('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|\b\d+(?:\.\d+)?\b|--[^\n]*|\b[A-Za-z_]\w*(?:\.\w+)*\b|[<>=!]+|[(),;.*+\-/]|\n|\s+)/g;

  let match;

  while ((match = tokenRegex.exec(code)) !== null) {
    const token = match[0];

    if (token === "\n" || /^\s+$/.test(token)) {
      tokens.push({ color: null, value: token });
    } else if (token.startsWith("--")) {
      tokens.push({ color: "#5C6370", value: token });
    } else if (token.startsWith("'") || token.startsWith('"')) {
      tokens.push({ color: "#98C379", value: token });
    } else if (/^\d/.test(token)) {
      tokens.push({ color: "#D19A66", value: token });
    } else if (SQL_KEYWORDS.has(token.toUpperCase())) {
      tokens.push({ color: "#C678DD", value: token });
    } else if (token.includes(".")) {
      tokens.push({ color: "#61AFEF", value: token });
    } else if (/^[a-z_]/i.test(token)) {
      tokens.push({ color: "#E06C75", value: token });
    } else {
      tokens.push({ color: "#ABB2BF", value: token });
    }
  }

  return tokens;
}
