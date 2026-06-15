export const TUNING_CATEGORIES = [
  {
    id: "tuning1",
    title: "Sintonia de Consulta",
    subtitle: "Reescrita de consultas e oportunidades de indexação",
    color: "#7C4DFF",
    icon: "⚡",
  },
];

export const TUNING_QUESTIONS = [
  {
    id: "t_q1",
    category: "tuning1",
    text: "Exercício 1: Liste o identificador e o nome dos filmes lançados a partir de 2008, acompanhados do primeiro e do último nome de seus diretores.",
    originalSql: `SELECT M.id, M.name, D.first_name, D.last_name
FROM movies M, movies_directors MD, directors D
WHERE M.id = MD.movie_id
  AND MD.director_id = D.id
  AND M.year >= 2008;`,
    hint: "Organize a consulta separando as condições de junção das condições de seleção. As relações entre as tabelas devem ficar em JOIN ... ON, enquanto o ano permanece no WHERE.",
    sqlAnswer: `SELECT M.id, M.name, D.first_name, D.last_name
FROM movies M
JOIN movies_directors MD ON M.id = MD.movie_id
JOIN directors D ON MD.director_id = D.id
WHERE M.year >= 2008;`,
    difficulty: 1,
    concepts: ["Parsing", "JOIN Explícito", "Separação ON/WHERE"],
  },
  {
    id: "t_q2",
    category: "tuning1",
    text: "Exercício 2: Recupere o identificador, o primeiro nome e o sobrenome dos atores cujo primeiro nome começa com a letra 'C'.",
    originalSql: `SELECT A.id, A.first_name, A.last_name
FROM actors A
WHERE SUBSTRING(A.first_name, 1, 1) = 'C';`,
    hint: "Evite aplicar uma função sobre a coluna pesquisada. Como o requisito é uma busca por prefixo, use LIKE com o curinga somente no final.",
    sqlAnswer: `SELECT A.id, A.first_name, A.last_name
FROM actors A
WHERE A.first_name LIKE 'C%';`,
    difficulty: 1,
    concepts: ["Comparação", "Função na Coluna", "LIKE por Prefixo"],
  },
  {
    id: "t_q3",
    category: "tuning1",
    text: "Exercício 3: Liste o identificador, o nome e o ano dos filmes classificados no gênero 'Action'.",
    originalSql: `SELECT M.id, M.name, M.year
FROM movies M
WHERE M.id IN (
  SELECT MG.movie_id
  FROM movies_genres MG
  WHERE MG.genre = 'Action'
);`,
    hint: "Substitua a consulta aninhada com IN por uma junção explícita entre movies e movies_genres. Mantenha o filtro de gênero no WHERE.",
    sqlAnswer: `SELECT M.id, M.name, M.year
FROM movies M
JOIN movies_genres MG ON M.id = MG.movie_id
WHERE MG.genre = 'Action';`,
    difficulty: 2,
    concepts: ["Consulta Aninhada", "Eliminação IN", "JOIN Explícito"],
  },
  {
    id: "t_q4",
    category: "tuning1",
    text: "Exercício 4: Recupere o identificador, o primeiro nome e o sobrenome dos diretores responsáveis pelo filme 'The Matrix'.",
    originalSql: `SELECT D.id, D.first_name, D.last_name
FROM directors D
WHERE EXISTS (
  SELECT 1
  FROM movies_directors MD
  JOIN movies M ON MD.movie_id = M.id
  WHERE MD.director_id = D.id
    AND M.name = 'The Matrix'
);`,
    hint: "A condição de existência pode ser expressa pelas próprias junções entre directors, movies_directors e movies. Depois filtre o nome do filme.",
    sqlAnswer: `SELECT D.id, D.first_name, D.last_name
FROM directors D
JOIN movies_directors MD ON D.id = MD.director_id
JOIN movies M ON MD.movie_id = M.id
WHERE M.name = 'The Matrix';`,
    difficulty: 2,
    concepts: ["Consulta Aninhada", "Eliminação EXISTS", "JOIN Explícito"],
  },
  {
    id: "t_q5",
    category: "tuning1",
    text: "Exercício 5: Liste o identificador, o nome, o ano e a nota dos filmes lançados antes de 1980 ou que possuem nota maior ou igual a 9.",
    originalSql: `SELECT M.id, M.name, M.year, M.rank
FROM movies M
WHERE M.year < 1980
   OR M.rank >= 9;`,
    hint: "Separe os dois predicados ligados por OR em duas consultas completas. Una os resultados com UNION.",
    sqlAnswer: `SELECT M.id, M.name, M.year, M.rank
FROM movies M
WHERE M.year < 1980
UNION
SELECT M.id, M.name, M.year, M.rank
FROM movies M
WHERE M.rank >= 9;`,
    difficulty: 2,
    concepts: ["Condição Disjuntiva", "Eliminação OR", "UNION"],
  },
  {
    id: "t_q6",
    category: "tuning1",
    text: "Exercício 6: Liste o identificador, o nome, o ano e a nota dos filmes de ação que foram lançados entre 1990 e 2005 ou que possuem nota maior ou igual a 9.",
    originalSql: `SELECT M.id, M.name, M.year, M.rank
FROM movies M
JOIN movies_genres MG ON M.id = MG.movie_id
WHERE MG.genre = 'Action'
  AND (
    M.year BETWEEN 1990 AND 2005
    OR M.rank >= 9
  );`,
    hint: "Distribua a condição comum do gênero nos dois ramos. Cada SELECT do UNION precisa repetir a junção e o filtro MG.genre = 'Action'.",
    sqlAnswer: `SELECT M.id, M.name, M.year, M.rank
FROM movies M
JOIN movies_genres MG ON M.id = MG.movie_id
WHERE MG.genre = 'Action'
  AND M.year BETWEEN 1990 AND 2005
UNION
SELECT M.id, M.name, M.year, M.rank
FROM movies M
JOIN movies_genres MG ON M.id = MG.movie_id
WHERE MG.genre = 'Action'
  AND M.rank >= 9;`,
    difficulty: 3,
    concepts: ["Condição Complexa", "Distribuição AND/OR", "UNION"],
  },
  {
    id: "t_q7",
    category: "tuning1",
    text: "Exercício 7: Liste o identificador, o nome, o ano e a nota dos filmes cuja nota é superior à média dos filmes lançados no mesmo ano.",
    originalSql: `SELECT M.id, M.name, M.year, M.rank
FROM movies M
WHERE M.rank > (
  SELECT AVG(M2.rank)
  FROM movies M2
  WHERE M2.year = M.year
);`,
    hint: "Calcule primeiro a média por ano em uma CTE e depois relacione esse resultado com movies. Assim, a agregação fica separada da consulta principal.",
    sqlAnswer: `WITH yearly_average AS (
  SELECT year, AVG(rank) AS average_rank
  FROM movies
  GROUP BY year
)
SELECT M.id, M.name, M.year, M.rank
FROM movies M
JOIN yearly_average YA ON M.year = YA.year
WHERE M.rank > YA.average_rank;`,
    difficulty: 3,
    concepts: ["Consulta Correlacionada", "Agregação Intermediária", "CTE"],
  },
];
