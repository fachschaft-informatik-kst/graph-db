# GraphDB – Cypher-Lernumgebung

Statische Browser-Anwendung mit LadybugDB-WASM, Cypher-Editor mit Syntaxhervorhebung, Graphvisualisierung (Cytoscape.js), Tabellenansicht, mehreren Abfrage-Tabs und Gist-Freigabe.

## Bedienung

- **Datei öffnen:** `.cypher`, `.cql` und `.txt` werden als neuer Tab geladen und automatisch ausgeführt. `.json` lädt einen GraphDB-Arbeitsstand.
- **Ausführen:** Schaltfläche oder Tastenkürzel Ctrl/Cmd + Enter. Die Beschriftung der Schaltfläche bleibt kurz.
- **Datenbank leeren:** Löscht die Datenbanktabellen und den dargestellten Graphen; die Skripte bleiben erhalten.
- **Graph:** Labels erhalten unterschiedliche Farben, die in der Legende geändert werden können. Knoten und Beziehungen lassen sich auswählen.
- **Teilen:** JSON-Export, kompakter URL-Link oder GitHub Gist. Ein Benutzername genügt, um **öffentliche** GraphDB-Gists dieses Kontos zu suchen. Zum **Speichern** oder Aktualisieren eines Gists ist ein GitHub-Token mit Gist-Schreibberechtigung erforderlich; der Benutzername allein ist keine Authentifizierung.

## Cypher-Kompatibilität

LadybugDB verwendet eine Cypher-Variante und ist **kein vollständiger Neo4j-Ersatz**. Beim Import einfacher `CREATE (:Label {id: ..., ...})`- oder `CREATE (:Label {name: ..., ...})`-Knoten werden Tabellen aus Labels und Properties dynamisch angelegt. Bei den unterstützten `MATCH (a:Label {...}), (b:Label {...}) CREATE (a)-[:TYP]->(b)`-Beziehungen wird die Beziehungstabelle automatisch angelegt. Wiederholtes Ausführen dieser Importmuster erzeugt keine Duplikate.

Die Schlüssel `id` oder `name` müssen eindeutig sein. Das Importformat ist eingeschränkt; komplexe Neo4j-Skripte mit `UNWIND`, `MERGE`, Constraints oder komplexeren Schreibmustern müssen eventuell angepasst werden. Bei Fehlern nennt die Statuszeile die betroffene Anweisung. Die Graphansicht zeigt die unterstützten Importmuster; beliebige Cypher-Schreibabfragen aktualisieren die Cytoscape-Ansicht nicht automatisch.

## GitHub Pages

Die Bereitstellung erfolgt über den GitHub-Actions-Pages-Workflow und das Build-Verzeichnis `dist/`. Die Seite benötigt Internetzugriff für die Cytoscape-Bibliothek und GitHub-Gists.

## Datenschutz

Die Datenbank läuft lokal im Browser. URL-Links und Gists können den Arbeitsstand offenlegen. Auch geheime Gists sind für alle Personen mit dem direkten Link abrufbar. Ein GitHub-Token wird für die Sitzung in `sessionStorage` gespeichert; ein früher im SQLime-Playground hinterlegter Token kann am gleichen Origin übernommen werden.

## Interaktive Graph-Erkundung

- Eine Cypher-Abfrage mit `RETURN` zeigt im Graphen nur Knoten, die anhand ihrer zurückgegebenen Eigenschaften eindeutig dem unterstützten Importbestand zugeordnet werden können. Reine Tabellen- oder Aggregationsergebnisse zeigen keinen Graphen. Die Schaltfläche **Gesamten Graph anzeigen** wechselt zurück zum importierten Datenbestand.
- **Doppelklick** auf einen Knoten: direkte Nachbarn einblenden, beim erneuten Doppelklick wieder einklappen. **Rechtsklick**: Nachbarn nach Beziehungstyp filtern, Knoten isolieren, ausblenden oder fixieren.
- **Knoten suchen** hebt Treffer hervor; die Beschriftung lässt sich für jedes Label über das Auswahlfeld neben der Farbe bestimmen. Die Knotengrösse ist über einen Regler einstellbar.
- **Beides** zeigt Graph und Ergebnistabelle gleichzeitig. Für eindeutig erkannte Knoten markiert ein Klick auf die Tabellenzeile denselben Knoten im Graphen.
- **Zurück** stellt eine vorherige Explorationsansicht wieder her, **Zurücksetzen** zeigt den gesamten importierten Graphen. **PNG** und **SVG** exportieren die aktuelle Ansicht.
- Die Erweiterung verwendet die beim unterstützten Import erfassten Knoten und Beziehungen als Explorationsgrundlage. Beliebige Cypher-Schreibbefehle, zusätzliche Neo4j-Metadaten oder mehrdeutige Rückgabewerte werden noch nicht automatisch in diese Projektion übernommen. Für diese Fälle bleibt die tabellarische Darstellung massgeblich.
