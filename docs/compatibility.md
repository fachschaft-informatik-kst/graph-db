# Neo4j-Kompatibilitätsmatrix

Status: **noch nicht ausgeführt**. Diese Matrix beschreibt die Tests, nicht bereits bestätigte Engine-Unterstützung.

| Test | Erwartetes Verhalten |
|---|---|
| `CREATE (:Person {name:'Alexander', age:19})` | Knoten mit Properties anlegen |
| `CREATE (:City {name:'Luzern'}), (:Hobby {name:'Tennis'})` | Mehrere Knoten anlegen |
| `MATCH (n:Person) RETURN n` | Knoten als Graph und Tabelle ausgeben |
| `MATCH (p:Person) WHERE p.age > 17 AND p.name STARTS WITH 'A' RETURN p` | Filterausdruck |
| `MATCH (a:Person {name:'Alexander'}) MATCH (b:Person {name:'Anna'}) CREATE (a)-[:KNOWS]->(b)` | Gerichtete Beziehung |
| `MATCH (p:Person)-[:KNOWS]->(f:Person)-[:LIKES]->(h:Hobby) WHERE h.name = 'Coding' RETURN p.name, f.name` | Zweistufiges Muster |
| `MATCH (p:Person)-[:KNOWS*2]->(f:Person)-[:LIKES]->(h:Hobby) WHERE h.name = 'Coding' RETURN p.name, f.name` | Variable Pfadlänge |
| `MATCH p = (start:Person)-[:KNOWS*2]->(end:Person)-[:LIKES]->(:Hobby {name:'Coding'}) RETURN [x IN nodes(p) \| x.name]` | Pfadvariable, `nodes()` und List Comprehension |

Zusätzlich: Originalimport mit `MERGE`, `UNWIND`, `SET`, `CREATE CONSTRAINT`, `date()` und allen Beziehungstypen testen. Neo4j-Semantik bei Pfadwiederholungen und Duplikaten kontrollieren. Ergebnisse anhand der ursprünglichen Neo4j-Engine vergleichen.

## Abnahmekriterien

- Alle Arbeitsblatt-Abfragen laufen ohne Änderungen.
- Import erzeugt die erwartete Anzahl Knoten und Beziehungen.
- Properties und gerichtete Beziehungen werden korrekt visualisiert.
- Keine serverseitige Datenbank oder Benutzeranmeldung nötig.
- GitHub-Pages-Build läuft erfolgreich.
