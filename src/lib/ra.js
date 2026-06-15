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

export const RA_SCHEMA = {
  movies: ["id", "name", "year", "rank"],
  actors: ["id", "first_name", "last_name", "gender"],
  roles: ["actor_id", "movie_id", "role"],
  directors: ["id", "first_name", "last_name"],
  directors_genres: ["director_id", "genre", "prob"],
  movies_directors: ["director_id", "movie_id"],
  movies_genres: ["movie_id", "genre"],
};

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

const BINARY_PRECEDENCE = {
  "∪": 1,
  "∩": 1,
  "−": 1,
  "⋈": 2,
  "×": 2,
};

class RAParser {
  constructor(source) {
    this.source = source;
    this.position = 0;
  }

  parse() {
    const expression = this.parseExpression();
    this.skipWhitespace();

    if (this.position !== this.source.length) {
      this.fail(`símbolo inesperado "${this.source[this.position]}"`);
    }

    return expression;
  }

  parseExpression(minPrecedence = 0) {
    let left = this.parsePrimary();

    while (true) {
      this.skipWhitespace();
      const operator = this.source[this.position];
      const precedence = BINARY_PRECEDENCE[operator];

      if (precedence == null || precedence < minPrecedence) {
        break;
      }

      this.position += 1;
      let parameter = null;
      this.skipWhitespace();

      if (operator === "⋈" && this.source[this.position] === "(") {
        parameter = this.readParenthesized();
      }

      const right = this.parseExpression(precedence + 1);
      left = { type: "binary", operator, parameter, left, right };
    }

    return left;
  }

  parsePrimary() {
    this.skipWhitespace();
    const symbol = this.source[this.position];

    if (["π", "σ", "γ", "ρ"].includes(symbol)) {
      this.position += 1;
      this.skipWhitespace();

      if (this.source[this.position] !== "(") {
        this.fail(`esperado "(" após ${symbol}`);
      }

      const parameter = this.readParenthesized();
      this.skipWhitespace();

      if (this.source[this.position] !== "(") {
        this.fail(`esperada a relação de entrada de ${symbol}`);
      }

      const inputSource = this.readParenthesized();
      const input = new RAParser(inputSource).parse();

      return { type: "unary", operator: symbol, parameter, input };
    }

    if (symbol === "(") {
      return new RAParser(this.readParenthesized()).parse();
    }

    const relation = this.readIdentifier();

    if (!relation) {
      this.fail("esperada uma relação ou operação");
    }

    return { type: "relation", name: relation };
  }

  readIdentifier() {
    this.skipWhitespace();
    const match = this.source.slice(this.position).match(/^[A-Za-z_][A-Za-z0-9_]*/);

    if (!match) {
      return null;
    }

    this.position += match[0].length;
    return match[0];
  }

  readParenthesized() {
    if (this.source[this.position] !== "(") {
      this.fail('esperado "("');
    }

    const start = ++this.position;
    let depth = 1;
    let quote = null;

    while (this.position < this.source.length) {
      const character = this.source[this.position];

      if (quote) {
        if (character === quote && this.source[this.position - 1] !== "\\") {
          quote = null;
        }
      } else if (character === "'" || character === '"') {
        quote = character;
      } else if (character === "(") {
        depth += 1;
      } else if (character === ")") {
        depth -= 1;

        if (depth === 0) {
          const content = this.source.slice(start, this.position);
          this.position += 1;
          return content;
        }
      }

      this.position += 1;
    }

    this.fail('parêntese ")" não encontrado');
  }

  skipWhitespace() {
    while (/\s/.test(this.source[this.position] || "")) {
      this.position += 1;
    }
  }

  fail(message) {
    throw new Error(`Erro de sintaxe RA na posição ${this.position + 1}: ${message}.`);
  }
}

function splitTopLevel(value, separator) {
  const parts = [];
  let start = 0;
  let depth = 0;
  let quote = null;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];

    if (quote) {
      if (character === quote && value[index - 1] !== "\\") {
        quote = null;
      }
    } else if (character === "'" || character === '"') {
      quote = character;
    } else if (character === "(") {
      depth += 1;
    } else if (character === ")") {
      depth -= 1;
    } else if (depth === 0 && value.startsWith(separator, index)) {
      parts.push(value.slice(start, index).trim());
      start = index + separator.length;
      index += separator.length - 1;
    }
  }

  parts.push(value.slice(start).trim());
  return parts.filter(Boolean);
}

function quoteIdentifier(value) {
  return `"${value.replaceAll('"', '""')}"`;
}

function resolveColumn(columns, name) {
  const normalizedName = name.toLowerCase();
  const matches = columns.filter(
    (column) => column.name.toLowerCase() === normalizedName,
  );

  if (matches.length === 0) {
    throw new Error(`Atributo "${name}" não existe na relação de entrada.`);
  }

  if (matches.length > 1) {
    throw new Error(
      `Atributo "${name}" é ambíguo. Use ρ para renomear antes da operação.`,
    );
  }

  return matches[0];
}

function compileCondition(condition, columns) {
  const tokens =
    condition.match(
      /'(?:''|[^'])*'|"(?:\"\"|[^"])*"|>=|<=|<>|!=|=|>|<|\b\d+(?:\.\d+)?\b|[A-Za-z_][A-Za-z0-9_]*|[()+\-*/%,]/g,
    ) || [];
  const keywords = new Set([
    "and",
    "or",
    "not",
    "null",
    "is",
    "like",
    "in",
    "between",
    "true",
    "false",
  ]);

  if (!tokens.length) {
    throw new Error("Condição vazia.");
  }

  return tokens
    .map((token) => {
      if (
        token.startsWith("'") ||
        token.startsWith('"') ||
        /^\d/.test(token) ||
        !/^[A-Za-z_]/.test(token) ||
        keywords.has(token.toLowerCase())
      ) {
        return token;
      }

      return resolveColumn(columns, token).reference;
    })
    .join(" ");
}

function compileJoinCondition(condition, leftColumns, rightColumns) {
  const comparisons = splitTopLevel(condition, "AND");

  return comparisons
    .map((comparison) => {
      const match = comparison.match(
        /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*(=|!=|<>|>=|<=|>|<)\s*([A-Za-z_][A-Za-z0-9_]*)\s*$/i,
      );

      if (!match) {
        return compileCondition(comparison, [...leftColumns, ...rightColumns]);
      }

      let left;
      let right;

      try {
        left = resolveColumn(leftColumns, match[1]);
        right = resolveColumn(rightColumns, match[3]);
      } catch {
        left = resolveColumn(rightColumns, match[1]);
        right = resolveColumn(leftColumns, match[3]);
      }

      return `${left.reference} ${match[2]} ${right.reference}`;
    })
    .join(" AND ");
}

class RACompiler {
  constructor(schema) {
    this.schema = schema;
    this.columnId = 0;
    this.relationId = 0;
  }

  compile(node) {
    if (node.type === "relation") {
      return this.compileRelation(node);
    }

    if (node.type === "unary") {
      return this.compileUnary(node);
    }

    return this.compileBinary(node);
  }

  compileRelation(node) {
    const relationName = node.name.toLowerCase();
    const schemaColumns = this.schema[relationName];

    if (!schemaColumns) {
      throw new Error(`Relação "${node.name}" não existe no esquema.`);
    }

    const columns = schemaColumns.map((name) => this.newColumn(name));
    const selections = columns.map(
      (column) =>
        `${quoteIdentifier(nameFromReference(column, schemaColumns, columns))} AS ${quoteIdentifier(column.alias)}`,
    );

    return {
      sql: `SELECT DISTINCT ${selections.join(", ")} FROM ${quoteIdentifier(relationName)}`,
      columns,
    };
  }

  compileUnary(node) {
    const input = this.compile(node.input);

    if (node.operator === "π") {
      return this.compileProjection(input, node.parameter);
    }

    if (node.operator === "σ") {
      return this.compileSelection(input, node.parameter);
    }

    if (node.operator === "ρ") {
      return this.compileRename(input, node.parameter);
    }

    return this.compileAggregation(input, node.parameter);
  }

  compileProjection(input, parameter) {
    const relationAlias = this.newRelationAlias();
    const names = splitTopLevel(parameter, ",");

    if (!names.length) {
      throw new Error("A projeção precisa informar ao menos um atributo.");
    }

    const sourceColumns = this.referencesFor(input.columns, relationAlias);
    const columns = names.map((name) => {
      const source = resolveColumn(sourceColumns, name);
      return { ...this.newColumn(source.name), source };
    });
    const selections = columns.map(
      (column) =>
        `${column.source.reference} AS ${quoteIdentifier(column.alias)}`,
    );

    return {
      sql: `SELECT DISTINCT ${selections.join(", ")} FROM (${input.sql}) AS ${quoteIdentifier(relationAlias)}`,
      columns: columns.map(({ source, ...column }) => column),
    };
  }

  compileSelection(input, parameter) {
    const relationAlias = this.newRelationAlias();
    const sourceColumns = this.referencesFor(input.columns, relationAlias);
    const columns = input.columns.map((column) => this.newColumn(column.name));
    const selections = columns.map(
      (column, index) =>
        `${sourceColumns[index].reference} AS ${quoteIdentifier(column.alias)}`,
    );
    const condition = compileCondition(parameter, sourceColumns);

    return {
      sql: `SELECT DISTINCT ${selections.join(", ")} FROM (${input.sql}) AS ${quoteIdentifier(relationAlias)} WHERE ${condition}`,
      columns,
    };
  }

  compileRename(input, parameter) {
    const mappings = splitTopLevel(parameter, ",").map((mapping) => {
      const slashParts = splitTopLevel(mapping, "/");
      const arrowParts = splitTopLevel(mapping, "→");
      const parts = slashParts.length === 2 ? slashParts : arrowParts;

      if (parts.length !== 2) {
        throw new Error(
          `Renomeação inválida "${mapping}". Use novo / antigo ou antigo → novo.`,
        );
      }

      return slashParts.length === 2
        ? { from: parts[1], to: parts[0] }
        : { from: parts[0], to: parts[1] };
    });
    const renamedIndexes = new Set();
    const columns = input.columns.map((column, index) => {
      const mapping = mappings.find(
        (item) => item.from.toLowerCase() === column.name.toLowerCase(),
      );

      if (mapping) {
        renamedIndexes.add(mappings.indexOf(mapping));
      }

      return { ...column, name: mapping ? mapping.to : column.name };
    });

    if (renamedIndexes.size !== mappings.length) {
      const missing = mappings.filter((_, index) => !renamedIndexes.has(index));
      throw new Error(
        `Não foi possível renomear: ${missing.map((item) => item.from).join(", ")}.`,
      );
    }

    return { ...input, columns };
  }

  compileAggregation(input, parameter) {
    const [groupSource = "", aggregateSource = ""] = splitTopLevel(parameter, ";");
    const groupNames = splitTopLevel(groupSource, ",");
    const aggregateDefinitions = splitTopLevel(aggregateSource, ",");

    if (!aggregateDefinitions.length) {
      throw new Error("A agregação precisa informar uma função após ';'.");
    }

    const relationAlias = this.newRelationAlias();
    const sourceColumns = this.referencesFor(input.columns, relationAlias);
    const groups = groupNames.map((name) => resolveColumn(sourceColumns, name));
    const aggregates = aggregateDefinitions.map((definition) => {
      const match = definition.match(
        /^(COUNT|AVG|MIN|MAX|SUM)\s*\(\s*([A-Za-z_][A-Za-z0-9_]*|\*)\s*\)\s*(?:→|->|AS)\s*([A-Za-z_][A-Za-z0-9_]*)$/i,
      );

      if (!match) {
        throw new Error(`Agregação inválida "${definition}".`);
      }

      const argument =
        match[2] === "*" ? "*" : resolveColumn(sourceColumns, match[2]).reference;

      return {
        expression: `${match[1].toUpperCase()}(${argument})`,
        name: match[3],
      };
    });
    const outputDefinitions = [
      ...groups.map((group) => ({ expression: group.reference, name: group.name })),
      ...aggregates,
    ];
    const columns = outputDefinitions.map((item) => this.newColumn(item.name));
    const selections = outputDefinitions.map(
      (item, index) =>
        `${item.expression} AS ${quoteIdentifier(columns[index].alias)}`,
    );
    const groupBy = groups.length
      ? ` GROUP BY ${groups.map((group) => group.reference).join(", ")}`
      : "";

    return {
      sql: `SELECT ${selections.join(", ")} FROM (${input.sql}) AS ${quoteIdentifier(relationAlias)}${groupBy}`,
      columns,
    };
  }

  compileBinary(node) {
    if (node.operator === "÷") {
      throw new Error("O operador de divisão ainda não é suportado.");
    }

    const left = this.compile(node.left);
    const right = this.compile(node.right);

    if (["∪", "∩", "−"].includes(node.operator)) {
      return this.compileSetOperation(left, right, node.operator);
    }

    return this.compileJoin(left, right, node.operator, node.parameter);
  }

  compileJoin(left, right, operator, parameter) {
    const leftAlias = this.newRelationAlias();
    const rightAlias = this.newRelationAlias();
    const leftSources = this.referencesFor(left.columns, leftAlias);
    const rightSources = this.referencesFor(right.columns, rightAlias);
    const sources = [...leftSources, ...rightSources];
    const columns = sources.map((column) => this.newColumn(column.name));
    const selections = columns.map(
      (column, index) =>
        `${sources[index].reference} AS ${quoteIdentifier(column.alias)}`,
    );

    let joinSql = "CROSS JOIN";
    let condition = "";

    if (operator === "⋈") {
      if (parameter) {
        joinSql = "JOIN";
        condition = ` ON ${compileJoinCondition(
          parameter,
          leftSources,
          rightSources,
        )}`;
      } else {
        const sharedNames = left.columns
          .map((column) => column.name)
          .filter((name) =>
            right.columns.some(
              (column) => column.name.toLowerCase() === name.toLowerCase(),
            ),
          );

        if (!sharedNames.length) {
          throw new Error("A junção natural não encontrou atributos com mesmo nome.");
        }

        joinSql = "JOIN";
        condition = ` ON ${sharedNames
          .map(
            (name) =>
              `${resolveColumn(leftSources, name).reference} = ${resolveColumn(rightSources, name).reference}`,
          )
          .join(" AND ")}`;
      }
    }

    return {
      sql: `SELECT DISTINCT ${selections.join(", ")} FROM (${left.sql}) AS ${quoteIdentifier(leftAlias)} ${joinSql} (${right.sql}) AS ${quoteIdentifier(rightAlias)}${condition}`,
      columns,
    };
  }

  compileSetOperation(left, right, operator) {
    if (left.columns.length !== right.columns.length) {
      throw new Error("Operações de conjunto exigem relações com a mesma aridade.");
    }

    const sqlOperator = { "∪": "UNION", "∩": "INTERSECT", "−": "EXCEPT" }[
      operator
    ];
    const leftAlias = this.newRelationAlias();
    const rightAlias = this.newRelationAlias();
    const leftSources = this.referencesFor(left.columns, leftAlias);
    const rightSources = this.referencesFor(right.columns, rightAlias);
    const columns = left.columns.map((column) => this.newColumn(column.name));
    const leftSelection = columns
      .map(
        (column, index) =>
          `${leftSources[index].reference} AS ${quoteIdentifier(column.alias)}`,
      )
      .join(", ");
    const rightSelection = columns
      .map(
        (column, index) =>
          `${rightSources[index].reference} AS ${quoteIdentifier(column.alias)}`,
      )
      .join(", ");

    return {
      sql: `SELECT ${leftSelection} FROM (${left.sql}) AS ${quoteIdentifier(leftAlias)} ${sqlOperator} SELECT ${rightSelection} FROM (${right.sql}) AS ${quoteIdentifier(rightAlias)}`,
      columns,
    };
  }

  referencesFor(columns, relationAlias) {
    return columns.map((column) => ({
      ...column,
      reference: `${quoteIdentifier(relationAlias)}.${quoteIdentifier(column.alias)}`,
    }));
  }

  newColumn(name) {
    return { name: name.trim(), alias: `__ra_${this.columnId++}` };
  }

  newRelationAlias() {
    return `ra_${this.relationId++}`;
  }
}

function nameFromReference(column, schemaColumns, columns) {
  return schemaColumns[columns.indexOf(column)];
}

export function parseRA(expression) {
  if (!expression || !expression.trim()) {
    throw new Error("Informe uma expressão de álgebra relacional.");
  }

  return new RAParser(expression.trim()).parse();
}

export function compileRA(expression, schema = RA_SCHEMA) {
  const compiled = new RACompiler(schema).compile(parseRA(expression));
  const resultAlias = "ra_result";
  const selections = compiled.columns.map(
    (column) =>
      `${quoteIdentifier(resultAlias)}.${quoteIdentifier(column.alias)} AS ${quoteIdentifier(column.name)}`,
  );

  return {
    columns: compiled.columns.map((column) => column.name),
    sql: `SELECT ${selections.join(", ")} FROM (${compiled.sql}) AS ${quoteIdentifier(resultAlias)}`,
  };
}

export function compareQueryResults(actualResponse, expectedResponse) {
  const actual = actualResponse[0] || { columns: [], values: [] };
  const expected = expectedResponse[0] || { columns: [], values: [] };
  const normalizeRow = (row) =>
    JSON.stringify(
      row.map((value) =>
        typeof value === "number" ? Number(value.toFixed(10)) : value,
      ),
    );
  const actualRows = actual.values.map(normalizeRow).sort();
  const expectedRows = expected.values.map(normalizeRow).sort();

  return (
    actual.columns.length === expected.columns.length &&
    actualRows.length === expectedRows.length &&
    actualRows.every((row, index) => row === expectedRows[index])
  );
}

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
