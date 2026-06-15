const question = "Exercício 1: O desenvolvedor quer uma lista do primeiro e último nome de atores que atuaram no filme 'The Matrix' ou que participaram de filmes lançados no ano 2000.";
const sql = "select a.first_name, a.last_name from actors a join roles r on a.id = r.actor_id join movies m on r.movie_id = m.id where m.name = 'The Matrix' union select a.first_name, a.last_name from actors a join roles r on a.id = r.actor_id join movies m on r.movie_id = m.id where m.year = '2000';";
const expectedSql = "SELECT A.first_name, A.last_name FROM actors A JOIN roles R ON A.id = R.actor_id JOIN movies M ON R.movie_id = M.id WHERE M.name = 'The Matrix' UNION SELECT A.first_name, A.last_name FROM actors A JOIN roles R ON A.id = R.actor_id JOIN movies M ON R.movie_id = M.id WHERE M.year = 2000;";
function buildPrompt({ question, sql, expectedSql }) {
  return `
Avalie EXCLUSIVAMENTE o SQL submetido pelo aluno (<student_sql>) segundo as 11 Regras Estritas de Projeto Físico e Sintonia (Tuning) do Prof. Dr. Wladmir C. Brandão.

Objetivo do exercício:
<exercise>
${question}
</exercise>

Esquema relacional:
<schema>
movies(id PRIMARY KEY, name, year, rank)
actors(id PRIMARY KEY, first_name, last_name, gender)
roles(actor_id, movie_id, role)
directors(id PRIMARY KEY, first_name, last_name)
directors_genres(director_id, genre, prob)
movies_directors(director_id, movie_id)
movies_genres(movie_id, genre)
</schema>

SQL informado pelo aluno:
<student_sql>
${sql || "(não informado)"}
</student_sql>

Solução esperada:
<reference_sql>
${expectedSql}
</reference_sql>

<evaluation_rules>
O objetivo desta avaliação é exclusivamente treinar o aluno no tuning de consultas. Exija o cumprimento estrito das regras abaixo, mesmo que a semântica da consulta reescrita retorne resultados multiplicados (o que seria tratado pela aplicação):

1. Elimine consultas aninhadas sempre que possível. Penalize IN, NOT IN, EXISTS, ANY, ALL, SOME. Exija JOIN explícito.
2. Elimine operadores OR. Exija o uso de UNION, distribuindo todas as condições comuns.
3. Elimine DISTINCT. Penalize seu uso. Informe que deduplicação deve ir para a aplicação.
4. Evite operadores de diferença (!= ou <>). Exija igualdade quando possível.
5. Evite condições envolvendo NULL (IS NULL, IS NOT NULL), apontando limitações para índices.
6. Evite SUBSTRING e funções sobre colunas filtradas.
7. Evite LIKE com curinga no início (%texto%).
8. Identifique comparações entre domínios incompatíveis.
9. Troque junções implícitas (FROM A, B WHERE) por JOIN explícito (FROM A JOIN B ON).
10. Separe condições de junção (ON) e de seleção (WHERE).
11. Analise oportunidades de indexação.
</evaluation_rules>

IMPORTANTE: A sua avaliação (Problemas Encontrados, Regras Aplicadas) deve ser feita ESTRITAMENTE sobre o código em <student_sql>. Se o <student_sql> JÁ RESOLVEU os problemas do <original_sql> (e.g., já usou JOIN, eliminou DISTINCT, trocou OR por UNION), NÃO diga que o aluno cometeu infrações! Aponte as infrações apenas se elas AINDA estiverem presentes no <student_sql>. Se o aluno otimizou tudo perfeitamente, elogie a resposta na primeira seção e pule as recomendações de regras.

Responda em português do Brasil usando EXATAMENTE as seguintes seções:

## 1. Problemas Encontrados (no SQL do aluno)
Liste pontualmente quais infrações das 11 regras AINDA foram cometidas no <student_sql>. Se não houver problemas e o SQL estiver tunado, diga "Excelente! Nenhuma infração encontrada na sua solução."

## 2. Regras de Tuning Aplicadas
Diga quais das 11 regras devem ser aplicadas para corrigir a consulta.

## 3. Consulta Reescrita (Sugerida)
Se a consulta do aluno já estiver correta e livre das infrações, COPIE EXATAMENTE o Gabarito Esperado que foi fornecido ou repita o SQL do aluno. NÃO INVENTE uma consulta nova. Se houveram problemas apontados, apresente a sua versão corrigida em um bloco SQL.

## 4. Índices Recomendados
Sugira quais colunas deveriam receber índices (usadas em JOIN ou WHERE) e explique brevemente o motivo.

## 5. Observações de Semântica
Explique se a remoção de um DISTINCT, OR, IN ou EXISTS pode gerar resultados duplicados ou excluir registros com NULL, explicitando que esse tratamento passa a ser dever do programa consumidor (Node, Python, etc.).
`.trim();
}
console.log(buildPrompt({ question, sql, expectedSql }));
