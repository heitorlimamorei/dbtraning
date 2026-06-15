export const ADVANCED_TUNING_CATEGORIES = [
  {
    id: "advanced-tuning",
    title: "Desafios de Sintonia",
    subtitle: "Consultas difíceis e avançadas para reescrita",
    color: "#D8438A",
    icon: "◆",
  },
];

export const ADVANCED_TUNING_QUESTIONS = [
  {
    id: "ta_q1",
    category: "advanced-tuning",
    text: "Exercício 1: Liste o identificador, o nome e o ano dos filmes lançados a partir de 1994 que pertencem ao gênero 'Action' ou ao gênero 'Crime'.",
    originalSql: `SELECT M.id, M.name, M.year
FROM movies M
WHERE M.year >= 1994
  AND (
    M.id IN (
      SELECT MG.movie_id
      FROM movies_genres MG
      WHERE MG.genre = 'Action'
    )
    OR M.id IN (
      SELECT MG.movie_id
      FROM movies_genres MG
      WHERE MG.genre = 'Crime'
    )
  );`,
    hint: "Elimine as duas subconsultas com IN e distribua a condição comum M.year >= 1994. Crie um SELECT com JOIN para cada gênero e combine os ramos com UNION.",
    sqlAnswer: `SELECT M.id, M.name, M.year
FROM movies M
JOIN movies_genres MG ON M.id = MG.movie_id
WHERE M.year >= 1994
  AND MG.genre = 'Action'
UNION
SELECT M.id, M.name, M.year
FROM movies M
JOIN movies_genres MG ON M.id = MG.movie_id
WHERE M.year >= 1994
  AND MG.genre = 'Crime';`,
    difficulty: 3,
    concepts: ["Múltiplos IN", "Distribuição de Predicado", "UNION"],
  },
  {
    id: "ta_q2",
    category: "advanced-tuning",
    text: "Exercício 2: Recupere os atores que participaram de um filme dirigido por Christopher Nolan ou de um filme classificado como 'Sci-Fi'.",
    originalSql: `SELECT A.id, A.first_name, A.last_name
FROM actors A
WHERE EXISTS (
  SELECT 1
  FROM roles R
  JOIN movies_directors MD ON R.movie_id = MD.movie_id
  JOIN directors D ON MD.director_id = D.id
  WHERE R.actor_id = A.id
    AND D.first_name = 'Christopher'
    AND D.last_name = 'Nolan'
)
OR EXISTS (
  SELECT 1
  FROM roles R
  JOIN movies_genres MG ON R.movie_id = MG.movie_id
  WHERE R.actor_id = A.id
    AND MG.genre = 'Sci-Fi'
);`,
    hint: "Transforme cada EXISTS em um ramo com JOINs explícitos. Um ramo percorre directors e o outro movies_genres. Use UNION para reunir os atores sem repeti-los.",
    sqlAnswer: `SELECT A.id, A.first_name, A.last_name
FROM actors A
JOIN roles R ON A.id = R.actor_id
JOIN movies_directors MD ON R.movie_id = MD.movie_id
JOIN directors D ON MD.director_id = D.id
WHERE D.first_name = 'Christopher'
  AND D.last_name = 'Nolan'
UNION
SELECT A.id, A.first_name, A.last_name
FROM actors A
JOIN roles R ON A.id = R.actor_id
JOIN movies_genres MG ON R.movie_id = MG.movie_id
WHERE MG.genre = 'Sci-Fi';`,
    difficulty: 3,
    concepts: ["Múltiplos EXISTS", "Caminhos de Junção", "UNION"],
  },
  {
    id: "ta_q3",
    category: "advanced-tuning",
    text: "Exercício 3: Liste os diretores cuja quantidade de filmes dirigidos é maior que a média de filmes por diretor.",
    originalSql: `SELECT D.id, D.first_name, D.last_name
FROM directors D
WHERE (
  SELECT COUNT(*)
  FROM movies_directors MD
  WHERE MD.director_id = D.id
) > (
  SELECT AVG(F.film_count)
  FROM (
    SELECT COUNT(*) AS film_count
    FROM movies_directors
    GROUP BY director_id
  ) F
);`,
    hint: "Materialize primeiro a quantidade de filmes por diretor em uma CTE. Em seguida calcule a média dessas quantidades e compare os dois resultados na consulta principal.",
    sqlAnswer: `WITH director_totals AS (
  SELECT director_id, COUNT(*) AS film_count
  FROM movies_directors
  GROUP BY director_id
),
average_total AS (
  SELECT AVG(film_count) AS average_count
  FROM director_totals
)
SELECT D.id, D.first_name, D.last_name
FROM directors D
JOIN director_totals DT ON D.id = DT.director_id
CROSS JOIN average_total AT
WHERE DT.film_count > AT.average_count;`,
    difficulty: 3,
    concepts: ["Agregação em Etapas", "CTE", "Média de Contagens"],
  },
  {
    id: "ta_q4",
    category: "advanced-tuning",
    text: "Exercício 4: Liste os filmes de ação ou drama cuja nota é superior à média dos filmes lançados no mesmo ano.",
    originalSql: `SELECT DISTINCT M.id, M.name, M.year, M.rank
FROM movies M
JOIN movies_genres MG ON M.id = MG.movie_id
WHERE M.rank > (
  SELECT AVG(M2.rank)
  FROM movies M2
  WHERE M2.year = M.year
)
AND (
  MG.genre = 'Action'
  OR MG.genre = 'Drama'
);`,
    hint: "Calcule a média por ano em uma CTE, relacione-a com movies e divida a condição de gênero em dois ramos. O UNION também elimina a repetição de filmes presentes nos dois gêneros.",
    sqlAnswer: `WITH yearly_average AS (
  SELECT year, AVG(rank) AS average_rank
  FROM movies
  GROUP BY year
)
SELECT M.id, M.name, M.year, M.rank
FROM movies M
JOIN yearly_average YA ON M.year = YA.year
JOIN movies_genres MG ON M.id = MG.movie_id
WHERE M.rank > YA.average_rank
  AND MG.genre = 'Action'
UNION
SELECT M.id, M.name, M.year, M.rank
FROM movies M
JOIN yearly_average YA ON M.year = YA.year
JOIN movies_genres MG ON M.id = MG.movie_id
WHERE M.rank > YA.average_rank
  AND MG.genre = 'Drama';`,
    difficulty: 4,
    concepts: ["CTE Agregada", "Subconsulta Correlacionada", "OR com UNION"],
  },
  {
    id: "ta_q5",
    category: "advanced-tuning",
    text: "Exercício 5: Recupere os atores que participaram de mais de um filme diferente e que possuem pelo menos uma participação em filme lançado depois de 2008.",
    originalSql: `SELECT A.id, A.first_name, A.last_name
FROM actors A
WHERE A.id IN (
  SELECT R.actor_id
  FROM roles R
  GROUP BY R.actor_id
  HAVING COUNT(DISTINCT R.movie_id) > 1
)
AND EXISTS (
  SELECT 1
  FROM roles R
  JOIN movies M ON R.movie_id = M.id
  WHERE R.actor_id = A.id
    AND M.year > 2008
);`,
    hint: "Resuma as participações por ator em uma única CTE. Calcule a quantidade de filmes distintos e uma marca que indique a existência de filme posterior a 2008.",
    sqlAnswer: `WITH actor_stats AS (
  SELECT
    R.actor_id,
    COUNT(DISTINCT R.movie_id) AS movie_count,
    MAX(CASE WHEN M.year > 2008 THEN 1 ELSE 0 END) AS has_recent_movie
  FROM roles R
  JOIN movies M ON R.movie_id = M.id
  GROUP BY R.actor_id
)
SELECT A.id, A.first_name, A.last_name
FROM actors A
JOIN actor_stats S ON A.id = S.actor_id
WHERE S.movie_count > 1
  AND S.has_recent_movie = 1;`,
    difficulty: 4,
    concepts: ["IN e EXISTS", "Agregação Condicional", "CTE"],
  },
  {
    id: "ta_q6",
    category: "advanced-tuning",
    text: "Exercício 6: Para cada diretor, liste os filmes cuja nota é superior à média das notas dos filmes dirigidos por esse mesmo diretor.",
    originalSql: `SELECT
  D.id AS director_id,
  D.first_name,
  D.last_name,
  M.id AS movie_id,
  M.name,
  M.rank
FROM directors D
JOIN movies_directors MD ON D.id = MD.director_id
JOIN movies M ON MD.movie_id = M.id
WHERE M.rank > (
  SELECT AVG(M2.rank)
  FROM movies_directors MD2
  JOIN movies M2 ON MD2.movie_id = M2.id
  WHERE MD2.director_id = D.id
);`,
    hint: "Calcule a média de notas por diretor em uma CTE. Depois faça JOIN dessa média com directors, movies_directors e movies para comparar cada filme com a média de seu diretor.",
    sqlAnswer: `WITH director_average AS (
  SELECT MD.director_id, AVG(M.rank) AS average_rank
  FROM movies_directors MD
  JOIN movies M ON MD.movie_id = M.id
  GROUP BY MD.director_id
)
SELECT
  D.id AS director_id,
  D.first_name,
  D.last_name,
  M.id AS movie_id,
  M.name,
  M.rank
FROM directors D
JOIN director_average DA ON D.id = DA.director_id
JOIN movies_directors MD ON D.id = MD.director_id
JOIN movies M ON MD.movie_id = M.id
WHERE M.rank > DA.average_rank;`,
    difficulty: 4,
    concepts: ["Média por Grupo", "Consulta Correlacionada", "CTE"],
  },
];
