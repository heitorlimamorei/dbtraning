"use client";

import { useMemo } from "react";
import { buildDirectedGraph } from "@/lib/transactions";

function polarPoint(index, total, width, height) {
  const radius = Math.min(width, height) * 0.34;
  const angle = -Math.PI / 2 + (2 * Math.PI * index) / Math.max(total, 1);

  return {
    x: width / 2 + radius * Math.cos(angle),
    y: height / 2 + radius * Math.sin(angle),
  };
}

function shortenLine(from, to, offset = 26) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const unitX = dx / length;
  const unitY = dy / length;

  return {
    x1: from.x + unitX * offset,
    x2: to.x - unitX * offset,
    y1: from.y + unitY * offset,
    y2: to.y - unitY * offset,
  };
}

export function GraphView({ color = "#4E79A7", edges = [], nodes = [], title }) {
  const graphData = useMemo(() => {
    const graph = buildDirectedGraph(nodes, edges);
    const graphNodes = graph.nodes();
    const positions = new Map(
      graphNodes.map((node, index) => [node, polarPoint(index, graphNodes.length, 420, 240)]),
    );

    const graphEdges = graph.edges().map((edgeKey) => {
      const source = graph.source(edgeKey);
      const target = graph.target(edgeKey);
      const attrs = graph.getEdgeAttributes(edgeKey);

      return {
        ...attrs,
        key: edgeKey,
        source,
        target,
      };
    });

    return { graphEdges, graphNodes, positions };
  }, [edges, nodes]);

  return (
    <div
      style={{
        background: "#F8F9FC",
        border: "1px solid #E2E4EA",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {title && (
        <div
          style={{
            borderBottom: "1px solid #E2E4EA",
            color: "#5C6370",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 0.8,
            padding: "8px 12px",
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>
      )}
      <svg
        role="img"
        viewBox="0 0 420 240"
        style={{
          display: "block",
          height: 240,
          width: "100%",
        }}
      >
        <defs>
          <marker
            id={`arrow-${color.replace("#", "")}`}
            markerHeight="8"
            markerWidth="8"
            orient="auto"
            refX="7"
            refY="4"
            viewBox="0 0 8 8"
          >
            <path d="M 0 0 L 8 4 L 0 8 z" fill={color} />
          </marker>
        </defs>

        {graphData.graphEdges.map((edge, index) => {
          const from = graphData.positions.get(edge.source);
          const to = graphData.positions.get(edge.target);
          const line = shortenLine(from, to);
          const labelX = (line.x1 + line.x2) / 2;
          const labelY = (line.y1 + line.y2) / 2 - (index % 2 === 0 ? 8 : -12);

          return (
            <g key={edge.key}>
              <line
                markerEnd={`url(#arrow-${color.replace("#", "")})`}
                stroke={color}
                strokeOpacity="0.72"
                strokeWidth="2"
                x1={line.x1}
                x2={line.x2}
                y1={line.y1}
                y2={line.y2}
              />
              {edge.label && (
                <g>
                  <rect
                    fill="#fff"
                    height="20"
                    rx="5"
                    stroke="#E2E4EA"
                    width={Math.max(34, String(edge.label).length * 7 + 14)}
                    x={labelX - Math.max(34, String(edge.label).length * 7 + 14) / 2}
                    y={labelY - 10}
                  />
                  <text
                    fill="#5C6370"
                    fontFamily="var(--font-mono)"
                    fontSize="10"
                    fontWeight="700"
                    textAnchor="middle"
                    x={labelX}
                    y={labelY + 4}
                  >
                    {edge.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {graphData.graphNodes.map((node) => {
          const position = graphData.positions.get(node);

          return (
            <g key={node}>
              <circle
                cx={position.x}
                cy={position.y}
                fill="#fff"
                r="25"
                stroke={color}
                strokeWidth="3"
              />
              <text
                fill="#1A1D29"
                fontFamily="var(--font-mono)"
                fontSize="14"
                fontWeight="900"
                textAnchor="middle"
                x={position.x}
                y={position.y + 5}
              >
                {node}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
