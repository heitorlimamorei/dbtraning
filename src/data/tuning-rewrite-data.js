export const REWRITE_TUNING_CATEGORIES = [
  {
    id: "rewrite-tuning",
    title: "Reescritas de Operadores",
    subtitle:
      "Remoção de DISTINCT, EXCEPT, desigualdade, OR e padrões LIKE ineficientes",
    color: "#00897B",
    icon: "⇄",
  },
];

export const REWRITE_TUNING_QUESTIONS = [
  {
    id: "tr_q1",
    category: "rewrite-tuning",
    text: "Exercício 1: Liste o identificador, o nome e o ano dos filmes lançados a partir de 2008, removendo o DISTINCT desnecessário.",
    originalSql: `SELECT DISTINCT M.id, M.name, M.year
FROM movies M
WHERE M.year >= 2008;`,
    hint: "A projeção inclui M.id, que é chave primária de movies. Cada filme já aparece uma única vez sem junções que multipliquem linhas, portanto o DISTINCT é redundante.",
    sqlAnswer: `SELECT M.id, M.name, M.year
FROM movies M
WHERE M.year >= 2008;`,
    difficulty: 2,
    concepts: ["Remoção de DISTINCT", "Chave Primária", "Cardinalidade"],
  },
  {
    id: "tr_q2",
    category: "rewrite-tuning",
    text: "Exercício 2: Considerando que o domínio de gender contém somente 'M' e 'F' e não aceita NULL, recupere os atores que não são do gênero 'F' sem usar operador de diferença.",
    originalSql: `SELECT A.id, A.first_name, A.last_name
FROM actors A
WHERE A.gender <> 'F';`,
    hint: "Como o enunciado restringe o domínio aos valores M e F, o complemento exato de gender = 'F' pode ser escrito como uma igualdade.",
    sqlAnswer: `SELECT A.id, A.first_name, A.last_name
FROM actors A
WHERE A.gender = 'M';`,
    difficulty: 2,
    concepts: ["Remoção de Desigualdade", "Domínio Fechado", "Igualdade"],
  },
  {
    id: "tr_q3",
    category: "rewrite-tuning",
    text: "Exercício 3: Liste os atores do gênero feminino ou cujo primeiro nome começa com 'C', eliminando o operador OR.",
    originalSql: `SELECT A.id, A.first_name, A.last_name
FROM actors A
WHERE A.gender = 'F'
   OR A.first_name LIKE 'C%';`,
    hint: "Crie um SELECT para cada condição e combine os resultados com UNION. O operador de conjunto evita repetir um ator que satisfaça os dois filtros.",
    sqlAnswer: `SELECT A.id, A.first_name, A.last_name
FROM actors A
WHERE A.gender = 'F'
UNION
SELECT A.id, A.first_name, A.last_name
FROM actors A
WHERE A.first_name LIKE 'C%';`,
    difficulty: 2,
    concepts: ["Eliminação de OR", "UNION", "Busca por Prefixo"],
  },
  {
    id: "tr_q4",
    category: "rewrite-tuning",
    text: "Exercício 4: Liste os filmes que não possuem atores cadastrados, removendo o operador EXCEPT.",
    originalSql: `SELECT M.id, M.name, M.year
FROM movies M
EXCEPT
SELECT M.id, M.name, M.year
FROM movies M
JOIN roles R ON M.id = R.movie_id;`,
    hint: "Use LEFT JOIN para manter todos os filmes, agrupe pela chave e pelos atributos projetados e filtre os grupos cuja contagem de atores seja zero.",
    sqlAnswer: `SELECT M.id, M.name, M.year
FROM movies M
LEFT JOIN roles R ON M.id = R.movie_id
GROUP BY M.id, M.name, M.year
HAVING COUNT(R.actor_id) = 0;`,
    difficulty: 2,
    concepts: ["Remoção de EXCEPT", "Anti-Junção", "HAVING"],
  },
  {
    id: "tr_q5",
    category: "rewrite-tuning",
    text: "Exercício 5: Recupere os atores que participaram de filmes lançados depois de 2008, eliminando o DISTINCT gerado pela multiplicidade de participações.",
    originalSql: `SELECT DISTINCT A.id, A.first_name, A.last_name
FROM actors A
JOIN roles R ON A.id = R.actor_id
JOIN movies M ON R.movie_id = M.id
WHERE M.year > 2008;`,
    hint: "Primeiro produza uma relação com um único actor_id por meio de GROUP BY. Depois relacione esse conjunto já consolidado com actors.",
    sqlAnswer: `WITH recent_actors AS (
  SELECT R.actor_id
  FROM roles R
  JOIN movies M ON R.movie_id = M.id
  WHERE M.year > 2008
  GROUP BY R.actor_id
)
SELECT A.id, A.first_name, A.last_name
FROM actors A
JOIN recent_actors RA ON A.id = RA.actor_id;`,
    difficulty: 3,
    concepts: ["Remoção de DISTINCT", "CTE", "Pré-Agregação"],
  },
  {
    id: "tr_q6",
    category: "rewrite-tuning",
    text: "Exercício 6: Liste os diretores que não dirigiram filmes de ficção científica, substituindo EXCEPT por uma anti-junção sem IS NULL.",
    originalSql: `SELECT D.id, D.first_name, D.last_name
FROM directors D
EXCEPT
SELECT D.id, D.first_name, D.last_name
FROM directors D
JOIN movies_directors MD ON D.id = MD.director_id
JOIN movies_genres MG ON MD.movie_id = MG.movie_id
WHERE MG.genre = 'Sci-Fi';`,
    hint: "Mantenha todos os diretores com LEFT JOIN e coloque o filtro de gênero no ON. Após agrupar cada diretor, preserve somente os grupos com zero filmes Sci-Fi.",
    sqlAnswer: `SELECT D.id, D.first_name, D.last_name
FROM directors D
LEFT JOIN movies_directors MD ON D.id = MD.director_id
LEFT JOIN movies_genres MG
  ON MD.movie_id = MG.movie_id
 AND MG.genre = 'Sci-Fi'
GROUP BY D.id, D.first_name, D.last_name
HAVING COUNT(MG.movie_id) = 0;`,
    difficulty: 3,
    concepts: ["Remoção de EXCEPT", "Anti-Junção", "Filtro no ON"],
  },
  {
    id: "tr_q7",
    category: "rewrite-tuning",
    text: "Exercício 7: Liste os filmes de ação com nota diferente de 8 que foram lançados antes de 2000 ou a partir de 2008, eliminando simultaneamente <> e OR.",
    originalSql: `SELECT M.id, M.name, M.year, M.rank
FROM movies M
JOIN movies_genres MG ON M.id = MG.movie_id
WHERE MG.genre = 'Action'
  AND M.rank <> 8
  AND (
    M.year < 2000
    OR M.year >= 2008
  );`,
    hint: "Expanda rank <> 8 em duas faixas, rank < 8 e rank > 8. Combine cada faixa com cada intervalo de ano, repetindo a junção e o gênero nos quatro ramos do UNION.",
    sqlAnswer: `SELECT M.id, M.name, M.year, M.rank
FROM movies M
JOIN movies_genres MG ON M.id = MG.movie_id
WHERE MG.genre = 'Action'
  AND M.rank < 8
  AND M.year < 2000
UNION
SELECT M.id, M.name, M.year, M.rank
FROM movies M
JOIN movies_genres MG ON M.id = MG.movie_id
WHERE MG.genre = 'Action'
  AND M.rank < 8
  AND M.year >= 2008
UNION
SELECT M.id, M.name, M.year, M.rank
FROM movies M
JOIN movies_genres MG ON M.id = MG.movie_id
WHERE MG.genre = 'Action'
  AND M.rank > 8
  AND M.year < 2000
UNION
SELECT M.id, M.name, M.year, M.rank
FROM movies M
JOIN movies_genres MG ON M.id = MG.movie_id
WHERE MG.genre = 'Action'
  AND M.rank > 8
  AND M.year >= 2008;`,
    difficulty: 3,
    concepts: ["Remoção de Desigualdade", "Eliminação de OR", "UNION"],
  },
  {
    id: "tr_q8",
    category: "rewrite-tuning",
    text: "Exercício 8: Recupere, sem DISTINCT nem EXCEPT, os atores que participaram de filmes de ação ou ficção científica, mas nunca atuaram em filme anterior a 2000.",
    originalSql: `SELECT DISTINCT A.id, A.first_name, A.last_name
FROM actors A
JOIN roles R ON A.id = R.actor_id
JOIN movies_genres MG ON R.movie_id = MG.movie_id
WHERE MG.genre = 'Action'
   OR MG.genre = 'Sci-Fi'
EXCEPT
SELECT DISTINCT A.id, A.first_name, A.last_name
FROM actors A
JOIN roles R ON A.id = R.actor_id
JOIN movies M ON R.movie_id = M.id
WHERE M.year < 2000;`,
    hint: "Monte os candidatos de cada gênero em dois ramos unidos por UNION. Consolide também os atores com filmes antigos e aplique uma anti-junção agrupada com contagem igual a zero.",
    sqlAnswer: `WITH genre_actors AS (
  SELECT A.id, A.first_name, A.last_name
  FROM actors A
  JOIN roles R ON A.id = R.actor_id
  JOIN movies_genres MG ON R.movie_id = MG.movie_id
  WHERE MG.genre = 'Action'
  UNION
  SELECT A.id, A.first_name, A.last_name
  FROM actors A
  JOIN roles R ON A.id = R.actor_id
  JOIN movies_genres MG ON R.movie_id = MG.movie_id
  WHERE MG.genre = 'Sci-Fi'
),
old_movie_actors AS (
  SELECT R.actor_id
  FROM roles R
  JOIN movies M ON R.movie_id = M.id
  WHERE M.year < 2000
  GROUP BY R.actor_id
)
SELECT GA.id, GA.first_name, GA.last_name
FROM genre_actors GA
LEFT JOIN old_movie_actors OA ON GA.id = OA.actor_id
GROUP BY GA.id, GA.first_name, GA.last_name
HAVING COUNT(OA.actor_id) = 0;`,
    difficulty: 3,
    concepts: ["DISTINCT e EXCEPT", "UNION", "Anti-Junção com CTE"],
  },
  {
    id: "tr_q9",
    category: "rewrite-tuning",
    text: "Exercício 9: Liste os filmes classificados exatamente como 'Action', substituindo o LIKE sem curingas por uma comparação de igualdade.",
    originalSql: `SELECT M.id, M.name, M.year
FROM movies M
JOIN movies_genres MG ON M.id = MG.movie_id
WHERE MG.genre LIKE 'Action';`,
    hint: "O padrão não contém % nem _. Nesse caso, LIKE não oferece busca parcial e pode ser substituído diretamente por MG.genre = 'Action'.",
    sqlAnswer: `SELECT M.id, M.name, M.year
FROM movies M
JOIN movies_genres MG ON M.id = MG.movie_id
WHERE MG.genre = 'Action';`,
    difficulty: 2,
    concepts: ["LIKE por Igualdade", "Busca Exata", "Índice"],
  },
  {
    id: "tr_q10",
    category: "rewrite-tuning",
    text: "Exercício 10: Recupere o filme cujo título é exatamente 'The Matrix', removendo os curingas usados em uma pesquisa que deveria ser exata.",
    originalSql: `SELECT M.id, M.name, M.year, M.rank
FROM movies M
WHERE M.name LIKE '%The Matrix%';`,
    hint: "O requisito pede o título completo, não uma ocorrência em qualquer posição. Use igualdade para expressar a busca exata e evitar o curinga inicial.",
    sqlAnswer: `SELECT M.id, M.name, M.year, M.rank
FROM movies M
WHERE M.name = 'The Matrix';`,
    difficulty: 2,
    concepts: ["Remoção de %Texto%", "Igualdade", "Busca Exata"],
  },
  {
    id: "tr_q11",
    category: "rewrite-tuning",
    text: "Exercício 11: Liste os filmes cujo título começa com 'Kill Bill', substituindo a busca por conteúdo por uma busca de prefixo.",
    originalSql: `SELECT M.id, M.name, M.year, M.rank
FROM movies M
WHERE M.name LIKE '%Kill Bill%';`,
    hint: "Como o requisito afirma que o título começa com o texto, remova o curinga inicial e mantenha apenas o curinga final: LIKE 'Kill Bill%'.",
    sqlAnswer: `SELECT M.id, M.name, M.year, M.rank
FROM movies M
WHERE M.name LIKE 'Kill Bill%';`,
    difficulty: 3,
    concepts: ["LIKE por Prefixo", "Remoção de Curinga Inicial", "Índice"],
  },
  {
    id: "tr_q12",
    category: "rewrite-tuning",
    text: "Exercício 12: Liste os filmes cujo título começa com 'The' ou que pertencem exatamente ao gênero 'Sci-Fi', eliminando DISTINCT, OR e os padrões LIKE inadequados.",
    originalSql: `SELECT DISTINCT M.id, M.name, M.year
FROM movies M
JOIN movies_genres MG ON M.id = MG.movie_id
WHERE M.name LIKE '%The%'
   OR MG.genre LIKE 'Sci-Fi';`,
    hint: "No primeiro ramo, transforme a busca por conteúdo em prefixo com LIKE 'The%'. No segundo, substitua LIKE 'Sci-Fi' por igualdade. O UNION elimina o OR e substitui a deduplicação antes feita pelo DISTINCT.",
    sqlAnswer: `SELECT M.id, M.name, M.year
FROM movies M
JOIN movies_genres MG ON M.id = MG.movie_id
WHERE M.name LIKE 'The%'
UNION
SELECT M.id, M.name, M.year
FROM movies M
JOIN movies_genres MG ON M.id = MG.movie_id
WHERE MG.genre = 'Sci-Fi';`,
    difficulty: 3,
    concepts: ["Remoção de DISTINCT", "LIKE Otimizado", "UNION"],
  },
];
