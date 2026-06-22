import { MultiDirectedGraph } from "graphology";

export function parseOperation(raw) {
  const value = raw.trim();
  const dataMatch = value.match(/^([rw])(\d+)\(([^)]+)\)$/i);

  if (dataMatch) {
    return {
      item: dataMatch[3].trim(),
      raw: value,
      tx: `T${dataMatch[2]}`,
      type: dataMatch[1].toLowerCase(),
    };
  }

  const txMatch = value.match(/^([cba])(\d+)$/i);

  if (txMatch) {
    return {
      item: null,
      raw: value,
      tx: `T${txMatch[2]}`,
      type: txMatch[1].toLowerCase(),
    };
  }

  const templateMatch = value.match(/^([rw])\(([^)]+)\)$/i);

  if (templateMatch) {
    return {
      item: templateMatch[2].trim(),
      raw: value,
      tx: null,
      type: templateMatch[1].toLowerCase(),
    };
  }

  return {
    item: null,
    raw: value,
    tx: null,
    type: "unknown",
  };
}

export function txNumber(tx) {
  return Number(String(tx).replace(/\D/g, ""));
}

export function transactionIdsFrom(transactions, schedule = []) {
  const ids = new Set();

  Object.keys(transactions || {}).forEach((id) => ids.add(id));
  schedule.map(parseOperation).forEach((operation) => {
    if (operation.tx) {
      ids.add(operation.tx);
    }
  });

  return [...ids].sort((a, b) => txNumber(a) - txNumber(b));
}

function opSignature(operation) {
  return `${operation.type}(${operation.item})`;
}

export function analyzeCompleteness(transactions, schedule) {
  const parsedSchedule = schedule.map(parseOperation);
  const details = transactionIdsFrom(transactions, schedule).map((tx) => {
    const expected = (transactions[tx] || []).map(parseOperation).map(opSignature);
    const found = parsedSchedule
      .filter((operation) => operation.tx === tx && ["r", "w"].includes(operation.type))
      .map(opSignature);

    const missing = expected.filter((signature, index) => found[index] !== signature);
    const extra = found.length > expected.length ? found.slice(expected.length) : [];

    return {
      complete:
        expected.length === found.length &&
        expected.every((signature, index) => signature === found[index]),
      expected,
      extra,
      found,
      missing,
      tx,
    };
  });

  return {
    complete: details.every((detail) => detail.complete),
    details,
  };
}

export function analyzeDirtyReads(schedule, commitOrder = []) {
  const parsedSchedule = schedule.map(parseOperation);
  const augmented = [...parsedSchedule, ...commitOrder.map(parseOperation)];
  const commitIndex = new Map();
  const dirtyReads = [];

  augmented.forEach((operation, index) => {
    if (operation.type === "c") {
      commitIndex.set(operation.tx, index);
    }
  });

  parsedSchedule.forEach((operation, index) => {
    if (operation.type !== "r") {
      return;
    }

    const previousWrite = parsedSchedule
      .slice(0, index)
      .reverse()
      .find(
        (candidate) =>
          candidate.type === "w" &&
          candidate.item === operation.item &&
          candidate.tx !== operation.tx,
      );

    if (!previousWrite) {
      return;
    }

    const writerCommit = commitIndex.get(previousWrite.tx);
    const readerCommit = commitIndex.get(operation.tx);
    const readIsDirty = writerCommit === undefined || writerCommit > index;

    if (readIsDirty) {
      dirtyReads.push({
        item: operation.item,
        read: operation.raw,
        reader: operation.tx,
        readerCommit,
        recoverabilityRisk:
          readerCommit !== undefined &&
          (writerCommit === undefined || readerCommit < writerCommit),
        write: previousWrite.raw,
        writer: previousWrite.tx,
        writerCommit,
      });
    }
  });

  return {
    dirtyReads,
    recoverable: dirtyReads.every((read) => !read.recoverabilityRisk),
  };
}

export function conflictEdges(schedule) {
  const operations = schedule.map(parseOperation);
  const edgeMap = new Map();

  for (let i = 0; i < operations.length; i += 1) {
    for (let j = i + 1; j < operations.length; j += 1) {
      const first = operations[i];
      const second = operations[j];

      if (
        !first.tx ||
        !second.tx ||
        first.tx === second.tx ||
        first.item !== second.item ||
        !first.item ||
        !["r", "w"].includes(first.type) ||
        !["r", "w"].includes(second.type) ||
        (first.type !== "w" && second.type !== "w")
      ) {
        continue;
      }

      const key = `${first.tx}->${second.tx}`;
      const conflict = `${first.raw} antes de ${second.raw}`;

      if (!edgeMap.has(key)) {
        edgeMap.set(key, {
          conflicts: [],
          from: first.tx,
          item: first.item,
          label: first.item,
          to: second.tx,
        });
      }

      edgeMap.get(key).conflicts.push(conflict);
    }
  }

  return [...edgeMap.values()].map((edge) => ({
    ...edge,
    label: [...new Set(edge.conflicts.map((conflict) => conflict.match(/\(([^)]+)\)/)?.[1]))]
      .filter(Boolean)
      .join(", "),
  }));
}

export function buildDirectedGraph(nodes, edges) {
  const graph = new MultiDirectedGraph();

  nodes.forEach((node) => {
    if (!graph.hasNode(node)) {
      graph.addNode(node);
    }
  });

  edges.forEach((edge, index) => {
    const key = `${edge.from}->${edge.to}:${index}`;

    if (!graph.hasNode(edge.from)) {
      graph.addNode(edge.from);
    }

    if (!graph.hasNode(edge.to)) {
      graph.addNode(edge.to);
    }

    graph.addDirectedEdgeWithKey(key, edge.from, edge.to, edge);
  });

  return graph;
}

export function findDirectedCycle(nodes, edges) {
  const adjacency = new Map(nodes.map((node) => [node, []]));

  edges.forEach((edge) => {
    if (!adjacency.has(edge.from)) {
      adjacency.set(edge.from, []);
    }

    adjacency.get(edge.from).push(edge.to);
  });

  const visiting = new Set();
  const visited = new Set();
  const path = [];

  function dfs(node) {
    visiting.add(node);
    path.push(node);

    for (const next of adjacency.get(node) || []) {
      if (visiting.has(next)) {
        const start = path.indexOf(next);
        return [...path.slice(start), next];
      }

      if (!visited.has(next)) {
        const cycle = dfs(next);

        if (cycle) {
          return cycle;
        }
      }
    }

    visiting.delete(node);
    visited.add(node);
    path.pop();
    return null;
  }

  for (const node of adjacency.keys()) {
    if (!visited.has(node)) {
      const cycle = dfs(node);

      if (cycle) {
        return cycle;
      }
    }
  }

  return null;
}

export function analyzeSerializability(transactions, schedule) {
  const nodes = transactionIdsFrom(transactions, schedule);
  const edges = conflictEdges(schedule);
  const cycle = findDirectedCycle(nodes, edges);

  return {
    cycle,
    edges,
    graph: buildDirectedGraph(nodes, edges),
    nodes,
    serializable: !cycle,
  };
}

export function normalizeEdgeInput(input) {
  return input
    .split(/[,;\n]+/)
    .map((part) => part.trim().toUpperCase().replace(/\s+/g, ""))
    .filter(Boolean)
    .map((part) => {
      const match = part.match(/^T?(\d+)->T?(\d+)$/);
      return match ? `T${match[1]}->T${match[2]}` : part;
    })
    .sort();
}

export function compareEdgeSets(input, expectedEdges) {
  const expected = [...new Set(expectedEdges.map((edge) => `${edge.from}->${edge.to}`))].sort();
  const received = [...new Set(normalizeEdgeInput(input))].sort();
  const missing = expected.filter((edge) => !received.includes(edge));
  const extra = received.filter((edge) => !expected.includes(edge));

  return {
    correct: missing.length === 0 && extra.length === 0,
    expected,
    extra,
    missing,
    received,
  };
}

export function analyzeTimestampOrdering(schedule) {
  const operations = schedule.map(parseOperation);
  const timestamps = new Map();
  const readTs = new Map();
  const writeTs = new Map();
  const accepted = [];
  const rejected = [];
  const aborted = new Set();
  let nextTimestamp = 1;

  operations.forEach((operation) => {
    if (!operation.tx || !["r", "w"].includes(operation.type) || aborted.has(operation.tx)) {
      return;
    }

    if (!timestamps.has(operation.tx)) {
      timestamps.set(operation.tx, nextTimestamp);
      nextTimestamp += 1;
    }

    const ts = timestamps.get(operation.tx);
    const itemReadTs = readTs.get(operation.item) || 0;
    const itemWriteTs = writeTs.get(operation.item) || 0;

    if (operation.type === "r") {
      if (itemWriteTs > ts) {
        rejected.push({
          operation: operation.raw,
          reason: `wTS(${operation.item})=${itemWriteTs} > TS(${operation.tx})=${ts}`,
          tx: operation.tx,
        });
        aborted.add(operation.tx);
        return;
      }

      readTs.set(operation.item, Math.max(itemReadTs, ts));
      accepted.push(operation.raw);
      return;
    }

    if (itemReadTs > ts || itemWriteTs > ts) {
      rejected.push({
        operation: operation.raw,
        reason: `rTS(${operation.item})=${itemReadTs}, wTS(${operation.item})=${itemWriteTs}, TS(${operation.tx})=${ts}`,
        tx: operation.tx,
      });
      aborted.add(operation.tx);
      return;
    }

    writeTs.set(operation.item, ts);
    accepted.push(operation.raw);
  });

  return {
    aborted: [...aborted],
    effectiveSchedule: accepted.filter((operation) => {
      const tx = parseOperation(operation).tx;
      return !aborted.has(tx);
    }),
    rejected,
    timestamps: Object.fromEntries(timestamps.entries()),
  };
}
