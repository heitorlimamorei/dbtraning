export const IMDB_SCHEMA_DISPLAY = {
  tables: [
    { name: "movies", columns: ["id", "name", "year", "rank"] },
    { name: "actors", columns: ["id", "first_name", "last_name", "gender"] },
    { name: "roles", columns: ["actor_id", "movie_id", "role"] },
    { name: "directors", columns: ["id", "first_name", "last_name"] },
    { name: "directors_genres", columns: ["director_id", "genre", "prob"] },
    { name: "movies_directors", columns: ["director_id", "movie_id"] },
    { name: "movies_genres", columns: ["movie_id", "genre"] },
  ],
};

export const SCHEMA_RELATIONS = [
  { from: "roles.actor_id", to: "actors.id" },
  { from: "roles.movie_id", to: "movies.id" },
  { from: "movies_directors.director_id", to: "directors.id" },
  { from: "movies_directors.movie_id", to: "movies.id" },
  { from: "movies_genres.movie_id", to: "movies.id" },
  { from: "directors_genres.director_id", to: "directors.id" },
];

export const SEED_SQL = `
CREATE TABLE movies (id INTEGER PRIMARY KEY, name TEXT, year INTEGER, rank REAL);
CREATE TABLE actors (id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT, gender TEXT);
CREATE TABLE roles (actor_id INTEGER, movie_id INTEGER, role TEXT);
CREATE TABLE directors (id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT);
CREATE TABLE directors_genres (director_id INTEGER, genre TEXT, prob REAL);
CREATE TABLE movies_directors (director_id INTEGER, movie_id INTEGER);
CREATE TABLE movies_genres (movie_id INTEGER, genre TEXT);

INSERT INTO movies VALUES (1, 'Kill Bill: Vol. 1', 2003, 8.4);
INSERT INTO movies VALUES (2, 'Kill Bill: Vol. 2', 2004, 8.0);
INSERT INTO movies VALUES (3, 'Pulp Fiction', 1994, 8.9);
INSERT INTO movies VALUES (4, 'Inglourious Basterds', 2009, 8.3);
INSERT INTO movies VALUES (5, 'Django Unchained', 2012, 8.4);
INSERT INTO movies VALUES (6, 'The Matrix', 1999, 8.7);
INSERT INTO movies VALUES (7, 'Fight Club', 1999, 8.8);
INSERT INTO movies VALUES (8, 'Forrest Gump', 1994, 8.8);
INSERT INTO movies VALUES (9, 'The Godfather', 1972, 9.2);
INSERT INTO movies VALUES (10, 'The Shawshank Redemption', 1994, 9.3);
INSERT INTO movies VALUES (11, 'Cidade de Deus', 2002, 8.6);
INSERT INTO movies VALUES (12, 'Tropa de Elite', 2007, 8.0);
INSERT INTO movies VALUES (13, 'Alien', 1979, 5.2);
INSERT INTO movies VALUES (14, 'Avatar', 2009, 7.8);
INSERT INTO movies VALUES (15, 'Titanic', 1997, 7.8);
INSERT INTO movies VALUES (16, 'Inception', 2010, 8.8);
INSERT INTO movies VALUES (17, 'Interstellar', 2014, 8.6);
INSERT INTO movies VALUES (18, 'The Dark Knight', 2008, 9.0);
INSERT INTO movies VALUES (19, 'Parasite', 2019, 8.5);
INSERT INTO movies VALUES (20, 'Orphan Movie', 2001, NULL);

INSERT INTO actors VALUES (1, 'Uma', 'Thurman', 'F');
INSERT INTO actors VALUES (2, 'John', 'Travolta', 'M');
INSERT INTO actors VALUES (3, 'Samuel', 'Jackson', 'M');
INSERT INTO actors VALUES (4, 'Brad', 'Pitt', 'M');
INSERT INTO actors VALUES (5, 'Keanu', 'Reeves', 'M');
INSERT INTO actors VALUES (6, 'Tom', 'Hanks', 'M');
INSERT INTO actors VALUES (7, 'Marlon', 'Brando', 'M');
INSERT INTO actors VALUES (8, 'Morgan', 'Freeman', 'M');
INSERT INTO actors VALUES (9, 'Jamie', 'Foxx', 'M');
INSERT INTO actors VALUES (10, 'Christoph', 'Waltz', 'M');
INSERT INTO actors VALUES (11, 'Leonardo', 'DiCaprio', 'M');
INSERT INTO actors VALUES (12, 'Cate', 'Blanchett', 'F');
INSERT INTO actors VALUES (13, 'Scarlett', 'Johansson', 'F');
INSERT INTO actors VALUES (14, 'Anne', 'Hathaway', 'F');
INSERT INTO actors VALUES (15, 'Wagner', 'Moura', 'M');
INSERT INTO actors VALUES (16, 'Song', 'Kang-ho', 'M');
INSERT INTO actors VALUES (17, 'Quentin', 'Tarantino', 'M');
INSERT INTO actors VALUES (18, 'Christopher', 'Nolan', 'M');

INSERT INTO directors VALUES (1, 'Quentin', 'Tarantino');
INSERT INTO directors VALUES (2, 'Lana', 'Wachowski');
INSERT INTO directors VALUES (3, 'David', 'Fincher');
INSERT INTO directors VALUES (4, 'Robert', 'Zemeckis');
INSERT INTO directors VALUES (5, 'Francis', 'Coppola');
INSERT INTO directors VALUES (6, 'Frank', 'Darabont');
INSERT INTO directors VALUES (7, 'Fernando', 'Meirelles');
INSERT INTO directors VALUES (8, 'Jose', 'Padilha');
INSERT INTO directors VALUES (9, 'Ridley', 'Scott');
INSERT INTO directors VALUES (10, 'James', 'Cameron');
INSERT INTO directors VALUES (11, 'Christopher', 'Nolan');
INSERT INTO directors VALUES (12, 'Bong', 'Joon-ho');

INSERT INTO roles VALUES (1, 1, 'The Bride');
INSERT INTO roles VALUES (1, 2, 'The Bride');
INSERT INTO roles VALUES (2, 3, 'Vincent Vega');
INSERT INTO roles VALUES (3, 3, 'Jules Winnfield');
INSERT INTO roles VALUES (3, 1, 'Ordell Robbie');
INSERT INTO roles VALUES (4, 4, 'Lt. Aldo Raine');
INSERT INTO roles VALUES (4, 7, 'Tyler Durden');
INSERT INTO roles VALUES (5, 6, 'Neo');
INSERT INTO roles VALUES (6, 8, 'Forrest Gump');
INSERT INTO roles VALUES (7, 9, 'Don Vito Corleone');
INSERT INTO roles VALUES (8, 10, 'Ellis Boyd Redding');
INSERT INTO roles VALUES (9, 5, 'Django');
INSERT INTO roles VALUES (10, 4, 'Hans Landa');
INSERT INTO roles VALUES (10, 5, 'Dr. King Schultz');
INSERT INTO roles VALUES (11, 5, 'Calvin Candie');
INSERT INTO roles VALUES (11, 16, 'Dom Cobb');
INSERT INTO roles VALUES (11, 17, 'Cooper');
INSERT INTO roles VALUES (14, 17, 'Dr. Amelia Brand');
INSERT INTO roles VALUES (15, 12, 'Capitao Nascimento');
INSERT INTO roles VALUES (16, 19, 'Ki-taek');
INSERT INTO roles VALUES (11, 15, 'Jack Dawson');

INSERT INTO movies_directors VALUES (1, 1);
INSERT INTO movies_directors VALUES (1, 2);
INSERT INTO movies_directors VALUES (1, 3);
INSERT INTO movies_directors VALUES (1, 4);
INSERT INTO movies_directors VALUES (1, 5);
INSERT INTO movies_directors VALUES (2, 6);
INSERT INTO movies_directors VALUES (3, 7);
INSERT INTO movies_directors VALUES (4, 8);
INSERT INTO movies_directors VALUES (5, 9);
INSERT INTO movies_directors VALUES (6, 10);
INSERT INTO movies_directors VALUES (7, 11);
INSERT INTO movies_directors VALUES (8, 12);
INSERT INTO movies_directors VALUES (9, 13);
INSERT INTO movies_directors VALUES (10, 14);
INSERT INTO movies_directors VALUES (10, 15);
INSERT INTO movies_directors VALUES (11, 16);
INSERT INTO movies_directors VALUES (11, 17);
INSERT INTO movies_directors VALUES (11, 18);
INSERT INTO movies_directors VALUES (12, 19);

INSERT INTO movies_genres VALUES (1, 'Action');
INSERT INTO movies_genres VALUES (1, 'Thriller');
INSERT INTO movies_genres VALUES (2, 'Action');
INSERT INTO movies_genres VALUES (2, 'Thriller');
INSERT INTO movies_genres VALUES (3, 'Crime');
INSERT INTO movies_genres VALUES (3, 'Drama');
INSERT INTO movies_genres VALUES (4, 'War');
INSERT INTO movies_genres VALUES (4, 'Drama');
INSERT INTO movies_genres VALUES (5, 'Western');
INSERT INTO movies_genres VALUES (5, 'Drama');
INSERT INTO movies_genres VALUES (6, 'Sci-Fi');
INSERT INTO movies_genres VALUES (6, 'Action');
INSERT INTO movies_genres VALUES (7, 'Drama');
INSERT INTO movies_genres VALUES (8, 'Drama');
INSERT INTO movies_genres VALUES (8, 'Romance');
INSERT INTO movies_genres VALUES (9, 'Crime');
INSERT INTO movies_genres VALUES (9, 'Drama');
INSERT INTO movies_genres VALUES (10, 'Drama');
INSERT INTO movies_genres VALUES (11, 'Crime');
INSERT INTO movies_genres VALUES (11, 'Drama');
INSERT INTO movies_genres VALUES (12, 'Action');
INSERT INTO movies_genres VALUES (12, 'Crime');
INSERT INTO movies_genres VALUES (13, 'Sci-Fi');
INSERT INTO movies_genres VALUES (13, 'Horror');
INSERT INTO movies_genres VALUES (14, 'Sci-Fi');
INSERT INTO movies_genres VALUES (14, 'Action');
INSERT INTO movies_genres VALUES (15, 'Drama');
INSERT INTO movies_genres VALUES (15, 'Romance');
INSERT INTO movies_genres VALUES (16, 'Sci-Fi');
INSERT INTO movies_genres VALUES (16, 'Action');
INSERT INTO movies_genres VALUES (17, 'Sci-Fi');
INSERT INTO movies_genres VALUES (17, 'Drama');
INSERT INTO movies_genres VALUES (18, 'Action');
INSERT INTO movies_genres VALUES (18, 'Crime');
INSERT INTO movies_genres VALUES (19, 'Drama');
INSERT INTO movies_genres VALUES (19, 'Thriller');
INSERT INTO movies_genres VALUES (20, 'Drama');

INSERT INTO directors_genres VALUES (1, 'Crime', 0.8);
INSERT INTO directors_genres VALUES (1, 'Action', 0.6);
INSERT INTO directors_genres VALUES (2, 'Sci-Fi', 0.9);
INSERT INTO directors_genres VALUES (3, 'Drama', 0.7);
INSERT INTO directors_genres VALUES (3, 'Thriller', 0.5);
INSERT INTO directors_genres VALUES (4, 'Drama', 0.6);
INSERT INTO directors_genres VALUES (5, 'Crime', 0.9);
INSERT INTO directors_genres VALUES (6, 'Drama', 0.8);
INSERT INTO directors_genres VALUES (7, 'Crime', 0.7);
INSERT INTO directors_genres VALUES (7, 'Drama', 0.6);
INSERT INTO directors_genres VALUES (8, 'Action', 0.8);
INSERT INTO directors_genres VALUES (9, 'Sci-Fi', 0.7);
INSERT INTO directors_genres VALUES (10, 'Sci-Fi', 0.6);
INSERT INTO directors_genres VALUES (10, 'Action', 0.5);
INSERT INTO directors_genres VALUES (11, 'Sci-Fi', 0.8);
INSERT INTO directors_genres VALUES (11, 'Action', 0.7);
INSERT INTO directors_genres VALUES (12, 'Drama', 0.8);
INSERT INTO directors_genres VALUES (12, 'Thriller', 0.6);
`;

export const CATEGORIES = [
  {
    id: "ho04",
    title: "HO04 — Álg. Rel. I",
    subtitle: "Seleção, Projeção, Junção e Agregação",
    color: "#E8A87C",
    icon: "π",
  },
  {
    id: "ho05",
    title: "HO05 — Álg. Rel. II",
    subtitle: "Operações de Conjunto e Consultas Avançadas",
    color: "#85CDCA",
    icon: "∪",
  },
  {
    id: "ho07",
    title: "HO07 — SQL I",
    subtitle: "SELECT, JOIN, GROUP BY",
    color: "#D4A5A5",
    icon: "⌘",
  },
  {
    id: "ho08",
    title: "HO08 — SQL II",
    subtitle: "Subqueries, EXCEPT, UNION",
    color: "#9CAFB7",
    icon: "⊳",
  },
];

export const QUESTIONS = [
  {
    id: "ho04_q1",
    category: "ho04",
    text: "Projetar o primeiro nome e o último nome dos atores de sexo feminino.",
    hint: "Use seleção (σ) para filtrar por gender='F' e projeção (π).",
    answer: "π(first_name, last_name)(σ(gender = 'F')(actors))",
    sqlAnswer: "SELECT first_name, last_name FROM actors WHERE gender = 'F';",
    difficulty: 1,
    concepts: ["Seleção (σ)", "Projeção (π)"],
  },
  {
    id: "ho04_q2",
    category: "ho04",
    text: "Projetar o nome dos filmes com ano superior a 1999.",
    hint: "Use σ year > 1999 e π name.",
    answer: "π(name)(σ(year > 1999)(movies))",
    sqlAnswer: "SELECT name FROM movies WHERE year > 1999;",
    difficulty: 1,
    concepts: ["Seleção (σ)", "Projeção (π)"],
  },
  {
    id: "ho04_q3",
    category: "ho04",
    text: "Projetar o nome do filme e o nome do diretor de cada filme.",
    hint: "Junção (⋈) de movies, movies_directors e directors. Use ρ para renomear atributos homônimos.",
    answer:
      "π(name, d_first_name, d_last_name)(\n  (movies ⋈(id = movie_id) movies_directors)\n  ⋈(director_id = d_id) ρ(d_id / id, d_first_name / first_name, d_last_name / last_name)(directors)\n)",
    sqlAnswer:
      "SELECT m.name, d.first_name, d.last_name\nFROM movies m\nJOIN movies_directors md ON m.id = md.movie_id\nJOIN directors d ON md.director_id = d.id;",
    difficulty: 2,
    concepts: ["Junção (⋈)", "Projeção (π)", "Renomear (ρ)"],
  },
  {
    id: "ho04_q4",
    category: "ho04",
    text: "Projetar o nome do filme, nome do ator e o papel para filmes com ranking acima de 6.",
    hint: "σ rank > 6, junção movies ⋈ roles ⋈ actors. Use ρ para renomear id de actors e evitar ambiguidade.",
    answer:
      "π(name, a_first_name, a_last_name, role)(\n  (σ(rank > 6)(movies) ⋈(id = movie_id) roles)\n  ⋈(actor_id = a_id) ρ(a_id / id, a_first_name / first_name, a_last_name / last_name)(actors)\n)",
    sqlAnswer:
      "SELECT m.name, a.first_name, a.last_name, r.role\nFROM movies m\nJOIN roles r ON m.id = r.movie_id\nJOIN actors a ON r.actor_id = a.id\nWHERE m.rank > 6;",
    difficulty: 2,
    concepts: ["Seleção (σ)", "Junção (⋈)", "Projeção (π)", "Renomear (ρ)"],
  },
  {
    id: "ho04_q5",
    category: "ho04",
    text: "Projetar o nome do diretor e o número de filmes que dirigiu.",
    hint: "Junção directors ⋈ movies_directors, depois γ com COUNT. Os atributos id e director_id são distintos, sem ambiguidade.",
    answer:
      "γ(first_name, last_name ; COUNT(movie_id) → num_filmes)(\n  directors ⋈(id = director_id) movies_directors\n)",
    sqlAnswer:
      "SELECT d.first_name, d.last_name, COUNT(md.movie_id) AS num_filmes\nFROM directors d\nJOIN movies_directors md ON d.id = md.director_id\nGROUP BY d.first_name, d.last_name;",
    difficulty: 2,
    concepts: ["Junção (⋈)", "Agregação (γ)", "COUNT"],
  },
  {
    id: "ho04_q6",
    category: "ho04",
    text: "Projetar o gênero e o número de filmes de cada gênero.",
    hint: "γ com COUNT agrupando por genre em movies_genres.",
    answer: "γ(genre ; COUNT(movie_id) → num_filmes)(movies_genres)",
    sqlAnswer:
      "SELECT genre, COUNT(movie_id) AS num_filmes\nFROM movies_genres\nGROUP BY genre;",
    difficulty: 2,
    concepts: ["Agregação (γ)", "COUNT"],
  },
  {
    id: "ho04_q7",
    category: "ho04",
    text: "Projetar o gênero, ranking médio, mínimo e máximo por gênero.",
    hint: "Junção movies_genres ⋈ movies, γ com AVG, MIN, MAX. movie_id e id são distintos, sem ambiguidade.",
    answer:
      "γ(genre ; AVG(rank) → avg_rank, MIN(rank) → min_rank, MAX(rank) → max_rank)(\n  movies_genres ⋈(movie_id = id) movies\n)",
    sqlAnswer:
      "SELECT mg.genre,\n  AVG(m.rank) AS avg_rank,\n  MIN(m.rank) AS min_rank,\n  MAX(m.rank) AS max_rank\nFROM movies_genres mg\nJOIN movies m ON mg.movie_id = m.id\nGROUP BY mg.genre;",
    difficulty: 3,
    concepts: ["Junção (⋈)", "Agregação (γ)", "AVG", "MIN", "MAX"],
  },
  {
    id: "ho05_q1",
    category: "ho05",
    text: "Projetar primeiro nome e último nome dos atores que são diretores.",
    hint: "Interseção (∩) entre projeções de actors e directors.",
    answer:
      "π(first_name, last_name)(actors) ∩ π(first_name, last_name)(directors)",
    sqlAnswer:
      "SELECT first_name, last_name FROM actors\nINTERSECT\nSELECT first_name, last_name FROM directors;",
    difficulty: 2,
    concepts: ["Interseção (∩)", "Projeção (π)"],
  },
  {
    id: "ho05_q2",
    category: "ho05",
    text: "Projetar primeiro nome e último nome dos atores que NÃO são diretores.",
    hint: "Diferença (−) actors − directors.",
    answer:
      "π(first_name, last_name)(actors) − π(first_name, last_name)(directors)",
    sqlAnswer:
      "SELECT first_name, last_name FROM actors\nEXCEPT\nSELECT first_name, last_name FROM directors;",
    difficulty: 2,
    concepts: ["Diferença (−)", "Projeção (π)"],
  },
  {
    id: "ho05_q3",
    category: "ho05",
    text: "Projetar primeiro nome e último nome dos atores e diretores (todos).",
    hint: "União (∪) entre actors e directors.",
    answer:
      "π(first_name, last_name)(actors) ∪ π(first_name, last_name)(directors)",
    sqlAnswer:
      "SELECT first_name, last_name FROM actors\nUNION\nSELECT first_name, last_name FROM directors;",
    difficulty: 1,
    concepts: ["União (∪)", "Projeção (π)"],
  },
  {
    id: "ho05_q4",
    category: "ho05",
    text: "Projetar o nome dos filmes que não são dirigidos por nenhum diretor.",
    hint: "Diferença: todos os filmes − filmes com diretor. id e movie_id são distintos, sem ambiguidade.",
    answer:
      "π(name)(movies) − π(name)(movies ⋈(id = movie_id) movies_directors)",
    sqlAnswer:
      "SELECT name FROM movies\nWHERE id NOT IN (SELECT movie_id FROM movies_directors);",
    difficulty: 3,
    concepts: ["Diferença (−)", "Junção (⋈)", "Projeção (π)"],
  },
  {
    id: "ho05_q5",
    category: "ho05",
    text: "Projetar primeiro nome e último nome dos atores que atuaram em pelo menos dois filmes.",
    hint: "γ com COUNT ≥ 2 após junção actors ⋈ roles. id e actor_id são distintos, sem ambiguidade.",
    answer:
      "π(first_name, last_name)(\n  σ(num_filmes >= 2)(\n    γ(id, first_name, last_name ; COUNT(movie_id) → num_filmes)(\n      actors ⋈(id = actor_id) roles\n    )\n  )\n)",
    sqlAnswer:
      "SELECT a.first_name, a.last_name\nFROM actors a\nJOIN roles r ON a.id = r.actor_id\nGROUP BY a.id, a.first_name, a.last_name\nHAVING COUNT(r.movie_id) >= 2;",
    difficulty: 3,
    concepts: ["Agregação (γ)", "Seleção (σ)", "COUNT", "HAVING"],
  },
  {
    id: "ho05_q6",
    category: "ho05",
    text: "Projetar, por gênero e ano, o número médio de filmes com menos de dois atores.",
    hint: "Subconsulta para filmes com < 2 atores, depois GROUP BY gênero e ano. movies.id e movies_genres.movie_id colidem com roles.movie_id — renomear movies antes.",
    answer:
      "γ(genre, year ; AVG(cnt) → avg_filmes)(\n  σ(cnt < 2)(\n    γ(genre, year, m_id ; COUNT(actor_id) → cnt)(\n      (movies_genres ⋈(movie_id = m_id) ρ(m_id / id)(movies))\n      ⋈(m_id = movie_id) roles\n    )\n  )\n)",
    sqlAnswer:
      "SELECT mg.genre, m.year, AVG(sub.cnt) AS avg_filmes\nFROM (\n  SELECT r.movie_id, COUNT(r.actor_id) AS cnt\n  FROM roles r\n  GROUP BY r.movie_id\n  HAVING COUNT(r.actor_id) < 2\n) sub\nJOIN movies m ON sub.movie_id = m.id\nJOIN movies_genres mg ON m.id = mg.movie_id\nGROUP BY mg.genre, m.year;",
    difficulty: 4,
    concepts: ["Agregação aninhada", "Subconsulta", "Renomear (ρ)"],
  },
  {
    id: "ho07_q1",
    category: "ho07",
    text: "Projetar primeiro nome e último nome dos atores de sexo feminino.",
    hint: "SELECT + WHERE gender = 'F'.",
    answer: "π(first_name, last_name)(σ(gender = 'F')(actors))",
    sqlAnswer: "SELECT first_name, last_name FROM actors WHERE gender = 'F';",
    difficulty: 1,
    concepts: ["SELECT", "WHERE"],
  },
  {
    id: "ho07_q2",
    category: "ho07",
    text: "Projetar o nome dos filmes com ano superior a 1999.",
    hint: "SELECT name FROM movies WHERE year > 1999.",
    answer: "π(name)(σ(year > 1999)(movies))",
    sqlAnswer: "SELECT name FROM movies WHERE year > 1999;",
    difficulty: 1,
    concepts: ["SELECT", "WHERE"],
  },
  {
    id: "ho07_q3",
    category: "ho07",
    text: "Projetar o nome do filme e o nome do diretor de cada filme.",
    hint: "JOIN entre movies, movies_directors e directors. Use ρ para renomear atributos homônimos de directors.",
    answer:
      "π(name, d_first_name, d_last_name)(\n  (movies ⋈(id = movie_id) movies_directors)\n  ⋈(director_id = d_id) ρ(d_id / id, d_first_name / first_name, d_last_name / last_name)(directors)\n)",
    sqlAnswer:
      "SELECT m.name, d.first_name, d.last_name\nFROM movies m\nJOIN movies_directors md ON m.id = md.movie_id\nJOIN directors d ON md.director_id = d.id;",
    difficulty: 2,
    concepts: ["JOIN", "SELECT", "Renomear (ρ)"],
  },
  {
    id: "ho07_q4",
    category: "ho07",
    text: "Projetar nome do filme, ator e papel para filmes com ranking > 6.",
    hint: "Múltiplos JOINs + WHERE m.rank > 6. Use ρ para renomear id e atributos de actors, evitando ambiguidade com movies.",
    answer:
      "π(name, a_first_name, a_last_name, role)(\n  (σ(rank > 6)(movies) ⋈(id = movie_id) roles)\n  ⋈(actor_id = a_id) ρ(a_id / id, a_first_name / first_name, a_last_name / last_name)(actors)\n)",
    sqlAnswer:
      "SELECT m.name, a.first_name, a.last_name, r.role\nFROM movies m\nJOIN roles r ON m.id = r.movie_id\nJOIN actors a ON r.actor_id = a.id\nWHERE m.rank > 6;",
    difficulty: 2,
    concepts: ["JOIN", "WHERE", "SELECT", "Renomear (ρ)"],
  },
  {
    id: "ho07_q5",
    category: "ho07",
    text: "Projetar nome do diretor e número de filmes que dirigiu.",
    hint: "JOIN + GROUP BY + COUNT. id e director_id são distintos, sem ambiguidade.",
    answer:
      "γ(first_name, last_name ; COUNT(movie_id) → num_filmes)(\n  directors ⋈(id = director_id) movies_directors\n)",
    sqlAnswer:
      "SELECT d.first_name, d.last_name, COUNT(md.movie_id) AS num_filmes\nFROM directors d\nJOIN movies_directors md ON d.id = md.director_id\nGROUP BY d.first_name, d.last_name;",
    difficulty: 2,
    concepts: ["JOIN", "GROUP BY", "COUNT"],
  },
  {
    id: "ho07_q6",
    category: "ho07",
    text: "Projetar gênero e número de filmes de cada gênero.",
    hint: "GROUP BY genre + COUNT.",
    answer: "γ(genre ; COUNT(movie_id) → num_filmes)(movies_genres)",
    sqlAnswer:
      "SELECT genre, COUNT(movie_id) AS num_filmes\nFROM movies_genres\nGROUP BY genre;",
    difficulty: 2,
    concepts: ["GROUP BY", "COUNT"],
  },
  {
    id: "ho07_q7",
    category: "ho07",
    text: "Projetar gênero, ranking médio, mínimo e máximo por gênero.",
    hint: "JOIN + GROUP BY + AVG, MIN, MAX. movie_id e id são distintos, sem ambiguidade.",
    answer:
      "γ(genre ; AVG(rank) → avg_rank, MIN(rank) → min_rank, MAX(rank) → max_rank)(\n  movies_genres ⋈(movie_id = id) movies\n)",
    sqlAnswer:
      "SELECT mg.genre,\n  AVG(m.rank) AS avg_rank,\n  MIN(m.rank) AS min_rank,\n  MAX(m.rank) AS max_rank\nFROM movies_genres mg\nJOIN movies m ON mg.movie_id = m.id\nGROUP BY mg.genre;",
    difficulty: 3,
    concepts: ["JOIN", "GROUP BY", "AVG", "MIN", "MAX"],
  },
  {
    id: "ho08_q1",
    category: "ho08",
    text: "Projetar primeiro nome e último nome dos atores que são diretores.",
    hint: "INTERSECT entre actors e directors.",
    answer:
      "π(first_name, last_name)(actors) ∩ π(first_name, last_name)(directors)",
    sqlAnswer:
      "SELECT first_name, last_name FROM actors\nINTERSECT\nSELECT first_name, last_name FROM directors;",
    difficulty: 2,
    concepts: ["INTERSECT"],
  },
  {
    id: "ho08_q2",
    category: "ho08",
    text: "Projetar primeiro nome e último nome dos atores que NÃO são diretores.",
    hint: "EXCEPT entre actors e directors.",
    answer:
      "π(first_name, last_name)(actors) − π(first_name, last_name)(directors)",
    sqlAnswer:
      "SELECT first_name, last_name FROM actors\nEXCEPT\nSELECT first_name, last_name FROM directors;",
    difficulty: 2,
    concepts: ["EXCEPT"],
  },
  {
    id: "ho08_q3",
    category: "ho08",
    text: "Projetar primeiro nome e último nome de todos atores e diretores.",
    hint: "UNION.",
    answer:
      "π(first_name, last_name)(actors) ∪ π(first_name, last_name)(directors)",
    sqlAnswer:
      "SELECT first_name, last_name FROM actors\nUNION\nSELECT first_name, last_name FROM directors;",
    difficulty: 1,
    concepts: ["UNION"],
  },
  {
    id: "ho08_q4",
    category: "ho08",
    text: "Projetar nome dos filmes sem nenhum diretor.",
    hint: "NOT IN com subconsulta. id e movie_id são distintos, sem ambiguidade.",
    answer:
      "π(name)(movies) − π(name)(movies ⋈(id = movie_id) movies_directors)",
    sqlAnswer:
      "SELECT name FROM movies\nWHERE id NOT IN (SELECT movie_id FROM movies_directors);",
    difficulty: 3,
    concepts: ["NOT IN", "Subconsulta"],
  },
  {
    id: "ho08_q5",
    category: "ho08",
    text: "Projetar atores que atuaram em pelo menos dois filmes.",
    hint: "JOIN + GROUP BY + HAVING COUNT >= 2. id e actor_id são distintos, sem ambiguidade.",
    answer:
      "π(first_name, last_name)(\n  σ(cnt >= 2)(\n    γ(id, first_name, last_name ; COUNT(movie_id) → cnt)(\n      actors ⋈(id = actor_id) roles\n    )\n  )\n)",
    sqlAnswer:
      "SELECT a.first_name, a.last_name\nFROM actors a\nJOIN roles r ON a.id = r.actor_id\nGROUP BY a.id, a.first_name, a.last_name\nHAVING COUNT(r.movie_id) >= 2;",
    difficulty: 3,
    concepts: ["JOIN", "GROUP BY", "HAVING"],
  },
  {
    id: "ho08_q6",
    category: "ho08",
    text: "Por gênero e ano, número médio de filmes com menos de dois atores.",
    hint: "Subconsulta com HAVING COUNT < 2, depois GROUP BY gênero e ano. Renomear id de movies para evitar colisão com movie_id de roles/movies_genres.",
    answer:
      "γ(genre, year ; AVG(cnt) → avg_filmes)(\n  σ(cnt < 2)(\n    γ(genre, year, m_id ; COUNT(actor_id) → cnt)(\n      (movies_genres ⋈(movie_id = m_id) ρ(m_id / id)(movies))\n      ⋈(m_id = movie_id) roles\n    )\n  )\n)",
    sqlAnswer:
      "SELECT mg.genre, m.year, AVG(sub.cnt) AS avg_filmes\nFROM (\n  SELECT r.movie_id, COUNT(r.actor_id) AS cnt\n  FROM roles r\n  GROUP BY r.movie_id\n  HAVING COUNT(r.actor_id) < 2\n) sub\nJOIN movies m ON sub.movie_id = m.id\nJOIN movies_genres mg ON m.id = mg.movie_id\nGROUP BY mg.genre, m.year;",
    difficulty: 4,
    concepts: ["Subconsulta", "GROUP BY", "HAVING", "AVG", "Renomear (ρ)"],
  },
];
