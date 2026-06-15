const body = {
  question: "Exercício 1: O desenvolvedor quer uma lista do primeiro e último nome de atores que atuaram no filme 'The Matrix' ou que participaram de filmes lançados no ano 2000.",
  originalSql: "SELECT DISTINCT A.first_name, A.last_name FROM actors A WHERE A.id IN (SELECT R.actor_id FROM roles R, movies M WHERE R.movie_id = M.id AND M.name = 'The Matrix') OR A.id IN (SELECT R.actor_id FROM roles R, movies M WHERE R.movie_id = M.id AND M.year = 2000)",
  sql: "select a.first_name, a.last_name from actors a join roles r on a.id = r.actor_id join movies m on r.movie_id = m.id where m.name = 'The Matrix' union select a.first_name, a.last_name from actors a join roles r on a.id = r.actor_id join movies m on r.movie_id = m.id where m.year = '2000';",
  expectedSql: "SELECT A.first_name, A.last_name FROM actors A JOIN roles R ON A.id = R.actor_id JOIN movies M ON R.movie_id = M.id WHERE M.name = 'The Matrix' UNION SELECT A.first_name, A.last_name FROM actors A JOIN roles R ON A.id = R.actor_id JOIN movies M ON R.movie_id = M.id WHERE M.year = 2000;"
};

fetch("http://localhost:3000/api/tuning-insights", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body)
}).then(async r => {
  const text = await r.text();
  console.log(text);
}).catch(console.error);
