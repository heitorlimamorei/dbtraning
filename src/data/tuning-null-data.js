export const NULL_TUNING_CATEGORIES = [
  {
    id: "null-tuning",
    title: "Reescritas de Nulos",
    subtitle: "Substituição de IS NULL e IS NOT NULL em consultas de tuning",
    color: "#5E7CE2",
    icon: "∅",
  },
];

export const NULL_TUNING_QUESTIONS = [
  {
    id: "tn_q1",
    category: "null-tuning",
    text: "Exercício 1: Considerando que toda nota válida fica no intervalo de 0 a 10, liste os filmes com nota cadastrada sem usar IS NOT NULL.",
    originalSql: `SELECT M.id, M.name, M.year, M.rank
FROM movies M
WHERE M.rank IS NOT NULL;`,
    hint: "Use o domínio conhecido da coluna rank. Se uma nota válida está entre 0 e 10, o predicado de faixa elimina os valores NULL sem depender de IS NOT NULL.",
    sqlAnswer: `SELECT M.id, M.name, M.year, M.rank
FROM movies M
WHERE M.rank BETWEEN 0 AND 10;`,
    difficulty: 2,
    concepts: ["Remoção de IS NOT NULL", "Domínio Numérico", "Predicado de Faixa"],
  },
  {
    id: "tn_q2",
    category: "null-tuning",
    text: "Exercício 2: Liste os filmes sem nota cadastrada substituindo IS NULL por uma agregação sobre a própria coluna.",
    originalSql: `SELECT M.id, M.name, M.year
FROM movies M
WHERE M.rank IS NULL;`,
    hint: "Agrupe cada filme e use COUNT(M.rank). Como COUNT(coluna) ignora NULL, filmes sem nota ficam com contagem igual a zero.",
    sqlAnswer: `SELECT M.id, M.name, M.year
FROM movies M
GROUP BY M.id, M.name, M.year
HAVING COUNT(M.rank) = 0;`,
    difficulty: 2,
    concepts: ["Remoção de IS NULL", "COUNT em Coluna", "HAVING"],
  },
  {
    id: "tn_q3",
    category: "null-tuning",
    text: "Exercício 3: Liste os filmes que possuem ao menos um ator cadastrado, trocando LEFT JOIN com IS NOT NULL por uma junção interna.",
    originalSql: `SELECT M.id, M.name, M.year
FROM movies M
LEFT JOIN roles R ON M.id = R.movie_id
WHERE R.movie_id IS NOT NULL;`,
    hint: "O filtro sobre a tabela opcional transforma o LEFT JOIN em INNER JOIN. Escreva a intenção diretamente com JOIN.",
    sqlAnswer: `SELECT M.id, M.name, M.year
FROM movies M
JOIN roles R ON M.id = R.movie_id;`,
    difficulty: 2,
    concepts: ["Remoção de IS NOT NULL", "LEFT JOIN", "JOIN Interno"],
  },
  {
    id: "tn_q4",
    category: "null-tuning",
    text: "Exercício 4: Liste os filmes sem atores cadastrados, removendo o padrão de anti-junção com IS NULL.",
    originalSql: `SELECT M.id, M.name, M.year
FROM movies M
LEFT JOIN roles R ON M.id = R.movie_id
WHERE R.movie_id IS NULL;`,
    hint: "Mantenha o LEFT JOIN, agrupe o filme e filtre os grupos cuja contagem de papéis relacionados seja zero.",
    sqlAnswer: `SELECT M.id, M.name, M.year
FROM movies M
LEFT JOIN roles R ON M.id = R.movie_id
GROUP BY M.id, M.name, M.year
HAVING COUNT(R.actor_id) = 0;`,
    difficulty: 3,
    concepts: ["Remoção de IS NULL", "Anti-Junção", "HAVING"],
  },
  {
    id: "tn_q5",
    category: "null-tuning",
    text: "Exercício 5: Liste os filmes que possuem diretor cadastrado, substituindo o teste IS NOT NULL aplicado após LEFT JOIN.",
    originalSql: `SELECT M.id, M.name, M.year
FROM movies M
LEFT JOIN movies_directors MD ON M.id = MD.movie_id
WHERE MD.director_id IS NOT NULL;`,
    hint: "Como apenas filmes com correspondência em movies_directors devem permanecer, a reescrita natural é uma junção interna pela chave do filme.",
    sqlAnswer: `SELECT M.id, M.name, M.year
FROM movies M
JOIN movies_directors MD ON M.id = MD.movie_id;`,
    difficulty: 2,
    concepts: ["Remoção de IS NOT NULL", "Relacionamento Obrigatório", "JOIN Interno"],
  },
  {
    id: "tn_q6",
    category: "null-tuning",
    text: "Exercício 6: Liste os filmes sem diretor cadastrado, reescrevendo o filtro IS NULL em uma anti-junção agrupada.",
    originalSql: `SELECT M.id, M.name, M.year
FROM movies M
LEFT JOIN movies_directors MD ON M.id = MD.movie_id
WHERE MD.movie_id IS NULL;`,
    hint: "Agrupe por filme depois do LEFT JOIN e mantenha somente aqueles cuja contagem de diretores relacionados seja zero.",
    sqlAnswer: `SELECT M.id, M.name, M.year
FROM movies M
LEFT JOIN movies_directors MD ON M.id = MD.movie_id
GROUP BY M.id, M.name, M.year
HAVING COUNT(MD.director_id) = 0;`,
    difficulty: 3,
    concepts: ["Remoção de IS NULL", "Anti-Junção", "Contagem de Relacionamentos"],
  },
  {
    id: "tn_q7",
    category: "null-tuning",
    text: "Exercício 7: Considerando que probabilidade válida fica entre 0 e 1, liste os gêneros de diretores com probabilidade cadastrada sem usar IS NOT NULL.",
    originalSql: `SELECT DG.director_id, DG.genre, DG.prob
FROM directors_genres DG
WHERE DG.prob IS NOT NULL;`,
    hint: "Troque a verificação genérica de preenchimento por um predicado de domínio. A faixa entre 0 e 1 descreve valores válidos e descarta NULL.",
    sqlAnswer: `SELECT DG.director_id, DG.genre, DG.prob
FROM directors_genres DG
WHERE DG.prob BETWEEN 0 AND 1;`,
    difficulty: 2,
    concepts: ["Remoção de IS NOT NULL", "Domínio Numérico", "Índice por Faixa"],
  },
  {
    id: "tn_q8",
    category: "null-tuning",
    text: "Exercício 8: Liste as atrizes sem papéis cadastrados, eliminando IS NULL sem perder o filtro de gênero.",
    originalSql: `SELECT A.id, A.first_name, A.last_name
FROM actors A
LEFT JOIN roles R ON A.id = R.actor_id
WHERE A.gender = 'F'
  AND R.actor_id IS NULL;`,
    hint: "Deixe o filtro de gênero no WHERE, agrupe cada atriz e use HAVING COUNT(R.movie_id) = 0 para representar ausência de papéis.",
    sqlAnswer: `SELECT A.id, A.first_name, A.last_name
FROM actors A
LEFT JOIN roles R ON A.id = R.actor_id
WHERE A.gender = 'F'
GROUP BY A.id, A.first_name, A.last_name
HAVING COUNT(R.movie_id) = 0;`,
    difficulty: 3,
    concepts: ["Remoção de IS NULL", "Filtro Preservado", "Anti-Junção"],
  },
];
