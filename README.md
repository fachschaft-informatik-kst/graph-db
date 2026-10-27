# GraphDB – Browser-Prototyp

GraphDB ist eine statische, an SQLime orientierte Lernoberfläche mit geteiltem Editor-/Ergebnisbereich, mehreren Query-Tabs, interaktivem Graph (Cytoscape.js), Tabellenansicht und Property-Inspektion.

## Aktueller Umfang

- Mehrere Abfrage-Tabs, Ausführen per Ctrl/Cmd + Enter
- Dateiimport: `.cypher`, `.cql`, `.txt` als Editor-Tab; `.json` als GraphDB-Arbeitsstand
- JSON-Export von Tabs, Knoten und Beziehungen
- Teilbare Links: kompakte Arbeitsstände direkt im URL-Fragment
- Grössere Arbeitsstände als **GitHub Gist**: benötigt einen selbst bereitgestellten Token mit Gist-Schreibberechtigung. Token wird nicht gespeichert; beim Öffnen eines `?gist=ID`-Links werden Tabs und Graph geladen.
- Interaktiver Graph: verschieben, zoomen, anklicken; Properties im Detailbereich
- Beispiel mit Anna, Nina, Max, Amir und Coding

**Wichtig: Der Abfragekern ist momentan nur ein eingeschränkter JavaScript-Prototyp, keine vollwertige Graphdatenbank.** Unterstützt werden einfache `CREATE (:Label {…})`, `MATCH … CREATE (a)-[:TYPE]->(b)` und einfache `MATCH … WHERE … RETURN …`-Abfragen. `UNWIND`, `MERGE`, Constraints, variable Pfadlängen, List Comprehensions, komplexe Muster und vollständiger Neo4j-Import **funktionieren noch nicht**. Diese Funktionen dürfen im Unterricht nicht als unterstützt dargestellt werden.

## GitHub Pages

Die Dateien liegen direkt im Repository-Root. Unter Settings → Pages → Deploy from a branch → main / (root) aktivieren, sobald der Prototyp übernommen wurde. Die Seite benötigt eine Internetverbindung für Cytoscape.js vom jsDelivr-CDN und für GitHub Gists.

## Nächste Entwicklungsstufe

Eine echte Cypher-fähige WASM-Engine integrieren und den Neo4j-Datenimport mit dem Originalskript verifizieren. LadybugDB bietet WASM und openCypher, unterscheidet sich aber bei Schema/DDL und Neo4j-Semantik; ein unveränderter Neo4j-Skriptimport ist nicht zugesichert. Erst danach als vollständigen Neo4j-Ersatz für Schülerinnen und Schüler freigeben.

## Datenschutz

URL-Fragmente können den gesamten Arbeitsstand enthalten; jeder mit dem Link kann ihn lesen. Gists sind selbst bei `public:false` über ihre URL abrufbar und nicht für geheime Daten geeignet. Das GitHub-Token wird nur für den Gist-API-Aufruf verwendet und nicht persistiert.

## GitHub-Konto und Gists (Entwicklungsbranch)

Im Teilen-Dialog kann ein GitHub-Token mit Gist-Berechtigung für die laufende Browsersitzung hinterlegt werden. Über **Mit GitHub-Token verbinden** wird `GET /user` aufgerufen und der GitHub-Benutzername angezeigt. Bei gleichem Origin (`fachschaft-informatik-kst.github.io`) kann die Anwendung nach ausdrücklichem Klick auch einen bereits in SQLime unter `github.token` hinterlegten Token übernehmen. Die neue Anwendung schreibt den Token **nur in sessionStorage**, nicht in localStorage. Achtung: Der bereits von SQLime gespeicherte Token kann weiterhin in dessen localStorage liegen.

Beim Speichern wird ein neuer Gist erzeugt oder ein bereits geöffneter Gist **nur dann aktualisiert**, wenn dessen GitHub-Owner dem verbundenen Konto entspricht. Ein Gist eines anderen Kontos wird als Kopie gespeichert. Gist-Links öffnen die gespeicherten Tabs, Knoten und Kanten; GraphDB JSON ist das Austauschformat. Dies ist **keine** Binärdatenbank-Sicherung einer echten LadybugDB-Engine.

## WASM-Labor

`wasm.html` ist ein **experimenteller, separater** Integrationsversuch mit dem offiziellen Paket `@ladybugdb/wasm-core@0.20.1`. Es bietet Initialisierung und direkte Cypher-Ausführung; eine erfolgreiche Initialisierung im echten Browser ist **noch nicht durch CI verifiziert**. Die reguläre Oberfläche nutzt weiterhin den eingeschränkten Prototyp. Vor dem Umschalten müssen Worker-/WASM-Asset-Auflösung, Datenbank-Schemaerstellung, Ergebnisformate, Import und die Visualisierung anhand der originalen Neo4j-Datei getestet werden.
