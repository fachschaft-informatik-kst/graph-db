# GraphDB – Cypher im Browser

Schlanke, browserbasierte Graphdatenbank-Lernumgebung für den Informatikunterricht an der Kantonsschule Stadelhofen.

## Ziel

- Statisches Hosting auf GitHub Pages ohne eigenen Datenbankserver
- Cypher-Dateien importieren und Abfragen ausführen
- Graph- und Tabellenansicht mit Knoten-, Kanten- und Property-Inspektion
- Kompatibilität mit den bestehenden Neo4j-Freundschaftsmaterialien prüfen

## Projektstatus

**Früher Prototyp.** Noch keine verifizierte Neo4j-Cypher-Kompatibilität. Die Wahl der WASM-Engine erfolgt nach Tests mit den bestehenden Unterrichtsdateien.

## Testfälle

1. Knoten und Beziehungen mit `CREATE` erzeugen.
2. `MATCH`, `WHERE`, `RETURN`, `STARTS WITH`.
3. Mehrstufige Beziehungen mit `[:KNOWS*2]`.
4. Pfadvariable und `[x IN nodes(p) | x.name]`.
5. Import von `NEO4J_Freundschaften.cypher`, inklusive `MERGE`, `UNWIND`, `SET`, Constraints und Datumswerten.

Die Unterrichtsdateien werden erst nach Validierung der Engine integriert.
