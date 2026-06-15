export function buildTuningPrompt({
  question,
  sql,
  expectedSql,
  originalSql,
}) {
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

Consulta original que deve ser otimizada:
<original_sql>
${originalSql || "(não informada)"}
</original_sql>

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

<practical_guidance>
Ao encontrar uma infração, ensine COMO corrigi-la. Para cada problema realmente
presente no <student_sql>, informe:
- o trecho problemático;
- por que ele pode prejudicar pesquisa por índice, clareza ou cardinalidade;
- uma ou mais alternativas concretas;
- se a alternativa preserva a semântica ou altera o requisito;
- um pequeno exemplo SQL aplicável a este exercício.

Use as orientações abaixo:

1. IS NULL e IS NOT NULL
- Nunca sugira "= NULL" ou "<> NULL", pois essas comparações não funcionam como
  substitutas no SQL.
- Não afirme genericamente que índices não armazenam NULL ou que IS NULL sempre
  impede índice. Esse comportamento depende do SGBD, do tipo de índice e de
  índices parciais/filtrados. Descreva a condição como uma possível limitação a
  ser verificada com o plano de execução.
- Se NULL representa ausência de relacionamento, considere modelar a consulta
  com JOIN, NOT EXISTS ou LEFT JOIN ... IS NULL, explicando qual opção atende ao
  objetivo e às regras pedagógicas do exercício.
- Se a coluna não deveria aceitar ausência, recomende corrigir a modelagem com
  NOT NULL e, somente quando existir um valor padrão legítimo no domínio, usar
  um valor explícito. Não invente valores sentinela como string vazia, zero ou
  "N/A".
- Se o filtro IS NOT NULL não for necessário para responder ao enunciado, mostre
  que ele pode ser removido. Se for necessário, não finja que existe uma
  substituição universal: explique a limitação e preserve a correção semântica.

2. LIKE
- Para busca por prefixo, prefira LIKE 'texto%', que normalmente permite melhor
  aproveitamento de índice que LIKE '%texto' ou LIKE '%texto%'.
- Para igualdade, use "=" em vez de LIKE quando não houver curingas.
- Para busca por conteúdo em qualquer posição, não troque silenciosamente
  LIKE '%texto%' por LIKE 'texto%', pois isso altera o requisito. Explique que
  podem ser necessários índice de texto completo, índice trigram, coluna de
  busca normalizada ou recurso específico do SGBD.
- Evite funções como LOWER(coluna) no filtro. Quando busca sem diferenciar
  maiúsculas for requisito, sugira collation apropriada ou coluna normalizada
  indexada, deixando claro que a implementação depende do SGBD.

3. Funções sobre colunas filtradas
- Reescreva o predicado para manter a coluna isolada sempre que possível.
  Exemplos: SUBSTRING(nome, 1, 1) = 'A' para nome LIKE 'A%'; YEAR(data) = 2024
  para data >= '2024-01-01' AND data < '2025-01-01'.
- Diga que funções sobre a coluna podem impedir o uso de um índice convencional;
  não afirme que sempre causam varredura completa. Índices funcionais ou sobre
  expressões podem existir dependendo do SGBD.
- Não aplique transformações que mudem o conjunto de resultados sem destacar
  essa mudança.

4. Desigualdade
- Troque != ou <> por igualdade apenas quando o domínio e o enunciado permitirem
  enumerar exatamente o valor desejado, como gender != 'F' para gender = 'M'
  em um domínio garantido como {M, F}.
- Se existirem outros valores ou NULL, explique que a troca não é equivalente.

5. OR
- Ao substituir OR por UNION, repita em cada ramo todos os JOINs e predicados
  comuns necessários.
- Explique a diferença entre UNION, que remove duplicidades, e UNION ALL, que
  preserva duplicidades. Use a operação exigida pelo gabarito do exercício.
- Não diga que uma mesma linha que satisfaz os dois lados do OR é retornada duas
  vezes apenas por causa do OR. Explique duplicidades considerando as linhas
  produzidas pelos JOINs e a deduplicação feita por UNION após a projeção.

6. IN, EXISTS, ANY, ALL e subconsultas
- Mostre as chaves usadas para transformar a subconsulta em JOIN explícito.
- Avise quando um JOIN puder multiplicar linhas e quando a deduplicação tiver
  sido transferida para a aplicação pelas regras deste treinamento.
- Para NOT IN, explique também o risco de NULL antes de propor a reescrita.

7. DISTINCT
- Identifique primeiro por que surgem duplicidades. Não recomende simplesmente
  remover DISTINCT sem explicar joins, cardinalidade e o tratamento posterior
  exigido pela aplicação neste treinamento.

8. Índices
- Relacione cada índice a um predicado WHERE ou condição JOIN realmente presente.
- Não recomende índice redundante para uma PRIMARY KEY já indexada.
- Para índice composto, explique brevemente a ordem das colunas com base nos
  filtros de igualdade, faixa e junção usados na consulta.
- Não prometa ganho de desempenho nem declare scan completo sem EXPLAIN,
  estatísticas e cardinalidades. Apresente os índices como candidatos a validar.
</practical_guidance>

IMPORTANTE: A sua avaliação (Problemas Encontrados, Regras Aplicadas) deve ser feita ESTRITAMENTE sobre o código em <student_sql>. Use <original_sql> apenas para entender o que deveria ser otimizado. Se o <student_sql> JÁ RESOLVEU os problemas (e.g., já usou JOIN, eliminou DISTINCT, trocou OR por UNION), NÃO diga que o aluno cometeu infrações! Aponte as infrações apenas se elas AINDA estiverem presentes no <student_sql>. Se o aluno otimizou tudo perfeitamente, elogie a resposta na primeira seção e pule as recomendações de regras.

Responda em português do Brasil usando EXATAMENTE as seguintes seções:

## 1. Problemas Encontrados (no SQL do aluno)
Liste pontualmente quais infrações das 11 regras AINDA foram cometidas no <student_sql>. Se não houver problemas e o SQL estiver tunado, diga "Excelente! Nenhuma infração encontrada na sua solução."

## 2. Regras de Tuning Aplicadas
Para cada infração encontrada, apresente:
**Trecho atual**, **Como corrigir**, **Exemplo** e **Impacto semântico**.
Não apenas cite o número da regra. Dê instruções que o aluno consiga aplicar no
editor. Se não existir substituição semanticamente equivalente, diga isso
explicitamente e apresente as opções de modelagem ou de índice adequadas.

## 3. Consulta Reescrita (Sugerida)
Apresente a versão ideal da consulta em um bloco SQL. Use o código em <reference_sql> como o gabarito absoluto para a reescrita. NÃO INVENTE uma consulta nova.

## 4. Índices Recomendados
Sugira quais colunas deveriam receber índices (usadas em JOIN ou WHERE) e explique brevemente o motivo.

## 5. Observações de Semântica
Explique se a remoção ou substituição de DISTINCT, OR, IN, EXISTS, IS NULL,
IS NOT NULL, LIKE ou funções sobre colunas pode alterar duplicidades, registros
com NULL ou o conjunto de textos encontrados. Quando as regras deste treinamento
transferirem deduplicação para o programa consumidor, diga isso explicitamente.
`.trim();
}
