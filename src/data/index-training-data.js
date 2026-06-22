import {
  calculateBplusIndex,
  calculateOrderedIndex,
  calculateStaticMultilevelIndex,
  calculateTable,
} from "@/lib/index-calculations";

const field = (name, size, pk = false, fk = false) => ({ name, size, pk, fk });

export const INDEX_TABLES = [
  {
    name: "Atores",
    amount: 10_000,
    fields: [field("Codigo", 16, true), field("Nome", 160)],
  },
  {
    name: "Clientes",
    amount: 100_000,
    fields: [
      field("CPF", 11, true),
      field("Nome", 160),
      field("Endereco", 200),
      field("Telefone", 16),
      field("DataNascimento", 12),
      field("Sexo", 1),
    ],
  },
  {
    name: "Filmes",
    amount: 2_000_000,
    fields: [field("Codigo", 16, true), field("Nome", 160), field("Genero", 80)],
  },
  {
    name: "Funcionarios",
    amount: 3_500,
    fields: [
      field("CPF", 11, true),
      field("Nome", 160),
      field("CPF_Supervisor", 11, false, true),
    ],
  },
  {
    name: "Midias",
    amount: 10_000_000,
    fields: [
      field("Identificador", 24, true),
      field("Tipo", 8),
      field("PrecoDiaria", 24),
      field("CodFilme", 16, false, true),
    ],
  },
  {
    name: "Aluguel",
    amount: 20_000_000,
    fields: [
      field("CPF_Cliente", 11, true, true),
      field("ID_Midia", 24, true, true),
      field("DataLocacao", 12, true),
      field("DataDevolucao", 10),
      field("ValorPagar", 24),
      field("CPF_Funcionario", 11, false, true),
    ],
  },
];

const metric = (key, label, unit, hint) => ({ key, label, unit, hint });

const TABLE_METRICS = [
  metric("recordSize", "Tamanho do registro", "bytes", "Some o tamanho de todos os campos."),
  metric("blockFactor", "Fator de bloco", "reg./bloco", "Use piso: ⌊B / R⌋."),
  metric("blocksAmount", "Quantidade de blocos", "blocos", "Use teto: ⌈r / f⌉."),
  metric("waste", "Desperdício por bloco", "bytes", "B − (f × R)."),
  metric("size", "Espaço total", "bytes", "Blocos × 2.048."),
];

const ORDERED_METRICS = [
  metric("recordSize", "Tamanho da entrada", "bytes", "Chave + ponteiro de 16 bytes."),
  metric("blockFactor", "Fator de bloco do índice", "entradas/bloco", "Use piso: ⌊B / Ri⌋."),
  metric("blocksAmount", "Blocos do índice", "blocos", "Use teto: ⌈entradas / fi⌉."),
  metric("size", "Espaço do índice", "bytes", "Blocos × 2.048."),
  metric("blocksToRetrieve", "Blocos para buscar", "acessos", "⌈log₂(blocos)⌉ + 1."),
];

const MULTILEVEL_METRICS = [
  metric("recordSize", "Tamanho da entrada", "bytes", "Chave primária + ponteiro."),
  metric("blockFactor", "Fator de bloco", "entradas/bloco", "⌊2.048 / Ri⌋."),
  metric("blocksAmount", "Blocos em todos os níveis", "blocos", "Some cada nível até a raiz."),
  metric("size", "Espaço do índice", "bytes", "Total de blocos × 2.048."),
  metric("blocksToRetrieve", "Custo de acesso", "acessos", "Altura do índice + acesso ao dado."),
];

const BPLUS_METRICS = [
  metric("leafRecordSize", "Tamanho da entrada-folha", "bytes", "Chave + ponteiro de 16 bytes."),
  metric("leafBlockFactor", "Fator de folha (69%)", "entradas/bloco", "Aplique ocupação depois do piso."),
  metric("leafAmount", "Quantidade de folhas", "folhas", "⌈registros / fator de folha⌉."),
  metric("treeOrder", "Ordem da árvore", "ponteiros", "⌊(B − 12)/(chave + 12)⌋ + 1."),
  metric("indexBlockFactor", "Fator de nó interno (69%)", "ponteiros/nó", "⌈(ordem − 1) × 0,69⌉."),
  metric("indexAmount", "Nós internos", "blocos", "Some os níveis internos até a raiz."),
  metric("blocksAmount", "Total de blocos do índice", "blocos", "Folhas + nós internos."),
  metric("blocksToRetrieve", "Custo de acesso", "acessos", "Altura + 1."),
];

function primaryFields(table) {
  return table.fields.filter((item) => item.pk);
}

function foreignFields(table) {
  return table.fields.filter((item) => item.fk);
}

export const INDEX_CATEGORIES = [
  {
    id: "files",
    icon: "▦",
    title: "Arquivos",
    subtitle: "Do registro ao arquivo físico",
    description: "Calcule registro, fator de bloco, blocos, desperdício e espaço ocupado.",
    color: "#2563EB",
    formulas: ["R = Σ campos", "f = ⌊B / R⌋", "b = ⌈r / f⌉", "espaço = b × B"],
  },
  {
    id: "ordered",
    icon: "⇅",
    title: "Primário e secundário",
    subtitle: "Índices ordenados de um nível",
    description: "Compare índice esparso primário e índice denso secundário.",
    color: "#7C3AED",
    formulas: ["Ri = chave + ponteiro", "fi = ⌊B / Ri⌋", "bi = ⌈entradas / fi⌉", "busca = ⌈log₂ bi⌉ + 1"],
  },
  {
    id: "trees",
    icon: "⌘",
    title: "Multinível e B+",
    subtitle: "Índice estático multinível e árvore B+",
    description: "Calcule níveis, folhas, ordem, ocupação e custo de acesso.",
    color: "#0F766E",
    formulas: ["primário: entradas = blocos do arquivo", "B+: ocupação = 69%", "blocos B+ = folhas + nós internos", "acessos = altura + 1"],
  },
];

const fileExercises = INDEX_TABLES.slice(0, 3).map((table, index) => ({
  id: `file-${table.name}`,
  category: "files",
  difficulty: index + 1,
  title: `Arquivo ${table.name}`,
  context: `${table.amount.toLocaleString("pt-BR")} registros em blocos de 2 KB, sem espalhamento de registros.`,
  table,
  metrics: TABLE_METRICS,
  answers: calculateTable(table.fields, table.amount),
  steps: [
    "Some os bytes de todos os campos para obter R.",
    "Divida 2.048 por R e descarte a parte decimal.",
    "Divida os registros pelo fator e arredonde para cima.",
    "Multiplique os blocos por 2.048 para obter o espaço alocado.",
  ],
}));

const orderedTables = [INDEX_TABLES[0], INDEX_TABLES[3], INDEX_TABLES[5]];
const orderedExercises = orderedTables.flatMap((table, index) => {
  const tableStats = calculateTable(table.fields, table.amount);
  const pk = primaryFields(table);
  const fk = foreignFields(table)[0];
  const exercises = [
    {
      id: `ordered-primary-${table.name}`,
      category: "ordered",
      difficulty: Math.min(index + 1, 3),
      title: `Índice primário de ${table.name}`,
      context: `Índice esparso sobre ${pk.map((item) => item.name).join(" + ")}: uma entrada para cada um dos ${tableStats.blocksAmount.toLocaleString("pt-BR")} blocos do arquivo.`,
      table,
      indexFields: pk,
      metrics: ORDERED_METRICS,
      answers: calculateOrderedIndex(pk, tableStats.blocksAmount),
      steps: [
        "No índice primário esparso, a quantidade de entradas é igual aos blocos do arquivo.",
        "Some a chave e o ponteiro de 16 bytes.",
        "Calcule fator, blocos e espaço do índice.",
        "A busca binária lê ⌈log₂(blocos do índice)⌉ + 1 blocos.",
      ],
    },
  ];

  if (fk) {
    exercises.push({
      id: `ordered-secondary-${table.name}`,
      category: "ordered",
      difficulty: Math.min(index + 2, 4),
      title: `Índice secundário de ${table.name}`,
      context: `Índice denso sobre ${fk.name}: uma entrada para cada um dos ${table.amount.toLocaleString("pt-BR")} registros.`,
      table,
      indexFields: [fk],
      metrics: ORDERED_METRICS,
      answers: calculateOrderedIndex([fk], table.amount),
      steps: [
        "No índice secundário denso, há uma entrada por registro do arquivo.",
        "Some o campo indexado e o ponteiro de 16 bytes.",
        "Aplique teto somente ao calcular a quantidade de blocos.",
        "Calcule o custo da busca binária sobre os blocos do índice.",
      ],
    });
  }

  return exercises;
});

const treeTables = [INDEX_TABLES[3], INDEX_TABLES[4], INDEX_TABLES[5]];
const treeExercises = treeTables.flatMap((table, index) => {
  const tableStats = calculateTable(table.fields, table.amount);
  const pk = primaryFields(table);
  const fk = foreignFields(table)[0];
  const exercises = [
    {
      id: `multilevel-${table.name}`,
      category: "trees",
      difficulty: index + 2,
      title: `Primário multinível de ${table.name}`,
      context: `Índice estático esparso sobre ${pk.map((item) => item.name).join(" + ")}, partindo de ${tableStats.blocksAmount.toLocaleString("pt-BR")} blocos de dados.`,
      table,
      indexFields: pk,
      metrics: MULTILEVEL_METRICS,
      answers: calculateStaticMultilevelIndex(pk, tableStats.blocksAmount),
      steps: [
        "Comece com uma entrada para cada bloco do arquivo.",
        "A cada nível, divida as entradas pelo fator e arredonde para cima.",
        "Repita até chegar a um único bloco-raiz e some todos os níveis.",
        "O acesso inclui a travessia do índice e mais um bloco de dados.",
      ],
    },
  ];

  if (fk) {
    exercises.push({
      id: `bplus-${table.name}`,
      category: "trees",
      difficulty: index + 2,
      title: `Árvore B+ de ${table.name}.${fk.name}`,
      context: `${table.amount.toLocaleString("pt-BR")} entradas densas, blocos de 2 KB, ponteiro de nó de 12 B e ocupação média de 69%.`,
      table,
      indexFields: [fk],
      metrics: BPLUS_METRICS,
      answers: calculateBplusIndex(fk, table.amount),
      steps: [
        "Reserve 12 bytes do bloco e calcule a capacidade das folhas.",
        "Aplique 69% de ocupação e arredonde conforme a fórmula.",
        "Calcule a ordem e o fator efetivo dos nós internos.",
        "Suba os níveis até a raiz; some folhas e nós internos.",
      ],
    });
  }

  return exercises;
});

export const INDEX_EXERCISES = [...fileExercises, ...orderedExercises, ...treeExercises];
