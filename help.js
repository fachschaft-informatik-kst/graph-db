/* Contextual, expandable Cypher tutorial for teaching. */
const examples=[
 {
  "group": "Grundlagen",
  "title": "Alle Knoten",
  "description": "Mit MATCH suchen Sie nach einem Muster im Graphen. (n) steht für einen beliebigen Knoten; n ist eine frei wählbare Variable. RETURN bestimmt, was als Ergebnis erscheint.",
  "query": "MATCH (n) RETURN n;",
  "explanation": [
   "MATCH – sucht passende Knoten und Beziehungen.",
   "(n) – speichert jeden gefundenen Knoten in der Variablen n.",
   "RETURN n – gibt die gefundenen Knoten zurück."
  ]
 },
 {
  "group": "Grundlagen",
  "title": "Knoten nach Label",
  "description": "Ein Label beschreibt den Typ eines Knotens, beispielsweise Person oder Hobby. Der Doppelpunkt vor dem Label schränkt die Suche auf diesen Typ ein.",
  "query": "MATCH (p:Person) RETURN p;",
  "explanation": [
   "p – Name der Variablen; er kann frei gewählt werden.",
   ":Person – nur Knoten mit dem Label Person werden berücksichtigt.",
   "RETURN p – zeigt die gefundenen Person-Knoten."
  ]
 },
 {
  "group": "Grundlagen",
  "title": "Nach Eigenschaften filtern",
  "description": "Mit WHERE legen Sie Bedingungen fest. Eigenschaften werden über einen Punkt angesprochen; Zeichenketten stehen in Anführungszeichen.",
  "query": "MATCH (p:Person)\nWHERE p.name = 'Anna'\nRETURN p;",
  "explanation": [
   "p.name – liest die Eigenschaft name des Knotens p.",
   "= 'Anna' – prüft auf den exakten Text Anna.",
   "WHERE – lässt nur passende Knoten durch."
  ]
 },
 {
  "group": "Grundlagen",
  "title": "Vergleiche und Textsuche",
  "description": "Neben = sind unter anderem >, <, >= und <= möglich. STARTS WITH prüft, ob ein Text mit einer bestimmten Zeichenfolge beginnt.",
  "query": "MATCH (p:Person)\nWHERE p.age > 17 AND p.name STARTS WITH 'A'\nRETURN p.name, p.age;",
  "explanation": [
   "p.age > 17 – Alter grösser als 17.",
   "AND – beide Bedingungen müssen zutreffen.",
   "STARTS WITH 'A' – der Name beginnt mit A.",
   "RETURN p.name, p.age – gibt nur diese zwei Eigenschaften aus."
  ]
 },
 {
  "group": "Grundlagen",
  "title": "Eigenschaften anzeigen",
  "description": "RETURN kann statt vollständiger Knoten auch einzelne Eigenschaften ausgeben. Mit AS geben Sie einer Ergebnisspalte einen verständlichen Namen.",
  "query": "MATCH (p:Person)\nRETURN p.name AS Name, p.age AS Alter;",
  "explanation": [
   "p.name und p.age – wählen zwei Eigenschaften aus.",
   "AS Name – benennt die Ausgabespalte um.",
   "Das Resultat ist eine Tabelle mit den ausgewählten Werten."
  ]
 },
 {
  "group": "Grundlagen",
  "title": "Sortieren und begrenzen",
  "description": "ORDER BY sortiert Ergebnisse, DESC absteigend und ASC aufsteigend. LIMIT beschränkt die Zahl der angezeigten Zeilen.",
  "query": "MATCH (p:Person)\nRETURN p.name, p.age\nORDER BY p.age DESC\nLIMIT 5;",
  "explanation": [
   "ORDER BY p.age – sortiert nach dem Alter.",
   "DESC – absteigend, die ältesten Personen zuerst.",
   "LIMIT 5 – höchstens fünf Ergebniszeilen."
  ]
 },
 {
  "group": "Beziehungen",
  "title": "Gerichtete Freundschaft",
  "description": "Ein Pfeil -> gibt die Richtung einer Beziehung an. Der Beziehungstyp steht zwischen eckigen Klammern hinter einem Doppelpunkt.",
  "query": "MATCH (a:Person)-[:KNOWS]->(b:Person)\nRETURN a.name, b.name;",
  "explanation": [
   "(a:Person) und (b:Person) – zwei Person-Knoten.",
   "-[:KNOWS]-> – gerichtete Beziehung vom Typ KNOWS.",
   "RETURN – gibt die Namen beider Personen aus."
  ]
 },
 {
  "group": "Beziehungen",
  "title": "Beziehung als Variable",
  "description": "Mit [r] können Sie eine Beziehung selbst in einer Variablen speichern und zurückgeben. Ohne Typangabe werden verschiedene Beziehungstypen berücksichtigt.",
  "query": "MATCH (a)-[r]->(b)\nRETURN a, r, b;",
  "explanation": [
   "a und b – Start- und Zielknoten.",
   "[r] – Variable für die Beziehung, unabhängig vom Typ.",
   "RETURN a, r, b – zeigt die beiden Knoten und ihre Verbindung."
  ]
 },
 {
  "group": "Beziehungen",
  "title": "Zwei Schritte im Graphen",
  "description": "Durch Aneinanderhängen zweier Beziehungsmuster finden Sie Wege über einen Zwischenknoten. Das ist etwa für Freunde von Freunden nützlich.",
  "query": "MATCH (a:Person)-[:KNOWS]->(b:Person)-[:KNOWS]->(c:Person)\nRETURN a.name, b.name, c.name;",
  "explanation": [
   "a – Ausgangsperson.",
   "b – direkt bekannte Person.",
   "c – Person, die b kennt; es sind zwei gerichtete Schritte.",
   "Die Richtung der Pfeile ist wichtig."
  ]
 },
 {
  "group": "Beziehungen",
  "title": "Freunde mit einem Hobby",
  "description": "Mehrere Beziehungsmuster lassen sich kombinieren. So können Sie Personen finden, deren Bekannte ein bestimmtes Hobby mögen.",
  "query": "MATCH (p:Person)-[:KNOWS]->(f:Person)-[:LIKES]->(h:Hobby)\nWHERE h.name = 'Coding'\nRETURN p.name, f.name, h.name;",
  "explanation": [
   "KNOWS – führt von p zu einer bekannten Person f.",
   "LIKES – führt von f zu einem Hobby h.",
   "WHERE h.name = 'Coding' – filtert das gesuchte Hobby.",
   "RETURN – zeigt Ausgangsperson, bekannte Person und Hobby."
  ]
 },
 {
  "group": "Auswertung",
  "title": "Knoten zählen",
  "description": "COUNT ist eine Aggregationsfunktion: Sie zählt die Treffer, statt jeden einzelnen Knoten zurückzugeben.",
  "query": "MATCH (p:Person)\nRETURN count(p) AS Anzahl;",
  "explanation": [
   "MATCH – findet Person-Knoten.",
   "count(p) – zählt die gefundenen Knoten.",
   "AS Anzahl – beschriftet die Ergebniszahl."
  ]
 },
 {
  "group": "Auswertung",
  "title": "Gruppieren",
  "description": "GROUP BY wird in Cypher meist nicht geschrieben: Nicht aggregierte Ausdrücke in RETURN bilden automatisch Gruppen. Die folgende Abfrage zählt pro Wohnort.",
  "query": "MATCH (p:Person)-[:LIVES_IN]->(c:City)\nRETURN c.name AS Stadt, count(p) AS Personen;",
  "explanation": [
   "c.name – Gruppierung nach Stadtname.",
   "count(p) – Anzahl Personen pro Stadt.",
   "RETURN – liefert eine Zeile je Stadt."
  ]
 },
 {
  "group": "Daten verändern",
  "title": "Knoten erstellen",
  "description": "CREATE legt neue Daten an. Ein Knoten steht in runden Klammern, das Label folgt nach dem Doppelpunkt und Eigenschaften stehen in geschweiften Klammern.",
  "query": "CREATE (:Person {name:'Lia', age:18});",
  "explanation": [
   "CREATE – erzeugt einen neuen Knoten.",
   ":Person – Label des neuen Knotens.",
   "{name:'Lia', age:18} – zwei Eigenschaften: Text und Zahl.",
   "In diesem Playground wird name oder id als Schlüssel für den Import benötigt."
  ]
 },
 {
  "group": "Daten verändern",
  "title": "Beziehung erstellen",
  "description": "Eine Beziehung verbindet bereits vorhandene Knoten. MATCH sucht zunächst beide Endpunkte, CREATE legt danach die Verbindung an.",
  "query": "MATCH (a:Person {name:'Anna'}), (b:Person {name:'Nina'})\nCREATE (a)-[:KNOWS]->(b);",
  "explanation": [
   "MATCH – findet Anna und Nina über ihre Namen.",
   "a und b – Variablen für die gefundenen Knoten.",
   "CREATE (a)-[:KNOWS]->(b) – erzeugt eine gerichtete KNOWS-Beziehung."
  ]
 }
];
const helpPanel=document.getElementById("help-panel"),helpBackdrop=document.getElementById("help-backdrop"),helpButton=document.getElementById("help-open");
function toggleHelp(open){helpPanel.classList.toggle("open",open);helpPanel.inert=!open;helpPanel.setAttribute("aria-hidden",String(!open));helpButton.setAttribute("aria-expanded",String(open));helpBackdrop.hidden=!open;if(open)document.getElementById("help-close").focus();else helpButton.focus()}
helpButton.onclick=()=>toggleHelp(true);
document.getElementById("help-close").onclick=()=>toggleHelp(false);
helpBackdrop.onclick=()=>toggleHelp(false);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&helpPanel.classList.contains("open"))toggleHelp(false)});
const helpContent=document.getElementById("help-content");
let lastGroup="";
for(const ex of examples){
 if(ex.group!==lastGroup){const h=document.createElement("h3");h.textContent=ex.group;helpContent.append(h);lastGroup=ex.group}
 const details=document.createElement("details");details.className="help-example";
 const summary=document.createElement("summary");summary.textContent=ex.title;
 const description=document.createElement("p");description.textContent=ex.description;
 const pre=document.createElement("pre");pre.className="help-code";const code=document.createElement("code");window.highlightCypherInto(code,ex.query);pre.append(code);
 const explanation=document.createElement("ul");explanation.className="help-explanation";for(const point of ex.explanation){const li=document.createElement("li");li.textContent=point;explanation.append(li)}
 const action=document.createElement("button");action.type="button";action.textContent="In Editor übernehmen";
 action.onclick=()=>{const editor=document.getElementById("query");editor.value=ex.query;editor.dispatchEvent(new Event("input",{bubbles:true}));toggleHelp(false);editor.focus()};
 details.append(summary,description,pre,explanation,action);helpContent.append(details);
}
const foot=document.createElement("p");foot.className="help-disclaimer";foot.textContent="Die Beispiele verwenden Personen, Hobbys und Orte. Laden Sie bei Bedarf zuerst die Beispieldaten und passen Sie Namen und Labels an. LadybugDB unterstützt nicht alle Neo4j-Funktionen; manche Beispiele dienen als Cypher-Referenz und können je nach Datenmodell oder Implementierung Anpassungen erfordern. Für CREATE-Importe ist eine eindeutige Eigenschaft id oder name erforderlich.";helpContent.append(foot);
