/* Contextual, expandable Cypher documentation for teaching. */
const examples=[
 {group:"Grundlagen",title:"Alle Personen",description:"MATCH findet Knoten eines Labels, RETURN liefert sie zurück.",query:"MATCH (p:Person) RETURN p;"},
 {group:"Grundlagen",title:"Nach Namen filtern",description:"WHERE schränkt Ergebnisse ein. Eigenschaften werden mit Punktnotation gelesen.",query:"MATCH (p:Person) WHERE p.name = 'Anna' RETURN p;"},
 {group:"Grundlagen",title:"Eigenschaften ausgeben",description:"Einzelne Spalten statt kompletter Knoten zurückgeben.",query:"MATCH (p:Person) RETURN p.name, p.age;"},
 {group:"Grundlagen",title:"Sortieren und begrenzen",description:"ORDER BY sortiert, LIMIT beschränkt die Anzahl der Ergebnisse.",query:"MATCH (p:Person) RETURN p.name, p.age ORDER BY p.age DESC LIMIT 5;"},
 {group:"Beziehungen",title:"Freundschaften",description:"Der Pfeil legt die Richtung einer Beziehung fest.",query:"MATCH (a:Person)-[:KNOWS]->(b:Person) RETURN a.name, b.name;"},
 {group:"Beziehungen",title:"Freunde von Anna",description:"Ein bestimmter Startknoten wird über seine Eigenschaft gewählt.",query:"MATCH (a:Person {name:'Anna'})-[:KNOWS]->(b:Person) RETURN b.name;"},
 {group:"Beziehungen",title:"Freunde von Freunden",description:"Zwei aufeinanderfolgende KNOWS-Beziehungen durchsuchen.",query:"MATCH (a:Person {name:'Anna'})-[:KNOWS]->(b:Person)-[:KNOWS]->(c:Person) RETURN b.name, c.name;"},
 {group:"Beziehungen",title:"Personen mit Hobby Coding",description:"Über LIKES wird ein Personenknoten mit einem Hobby verbunden.",query:"MATCH (p:Person)-[:LIKES]->(h:Hobby {name:'Coding'}) RETURN p.name, h.name;"},
 {group:"Beziehungen",title:"Freundschaften und Hobbys",description:"Mehrere Beziehungsmuster lassen sich in einer Abfrage kombinieren.",query:"MATCH (a:Person)-[:KNOWS]->(b:Person), (b)-[:LIKES]->(h:Hobby) RETURN a.name, b.name, h.name;"},
 {group:"Auswertung",title:"Personen zählen",description:"COUNT zählt die gefundenen Knoten.",query:"MATCH (p:Person) RETURN count(p);"},
 {group:"Auswertung",title:"Hobbys gruppieren",description:"COUNT und GROUP BY-artige Aggregation über gemeinsame Rückgabespalten.",query:"MATCH (p:Person)-[:LIKES]->(h:Hobby) RETURN h.name, count(p) ORDER BY count(p) DESC;"},
 {group:"Daten verändern",title:"Knoten anlegen",description:"Im bereitgestellten Importformat werden Knoten anhand des Labels und ihres Schlüssels beim wiederholten Ausführen übersprungen.",query:"CREATE (:Person {name:'Eva', age:18});"},
 {group:"Daten verändern",title:"Beziehung anlegen",description:"Für die Unterrichtsdatei unterstützt der Import zwei benannte Knoten und CREATE.",query:"MATCH (a:Person {name:'Anna'}), (b:Person {name:'Max'}) CREATE (a)-[:KNOWS]->(b);"}
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
 const pre=document.createElement("pre");const code=document.createElement("code");code.textContent=ex.query;pre.append(code);
 const action=document.createElement("button");action.type="button";action.textContent="In Editor übernehmen";
 action.onclick=()=>{const editor=document.getElementById("query");editor.value=ex.query;editor.dispatchEvent(new Event("input",{bubbles:true}));toggleHelp(false);editor.focus()};
 details.append(summary,description,pre,action);helpContent.append(details);
}
const foot=document.createElement("p");foot.className="help-disclaimer";foot.textContent="Hinweis: Die Beispiele beziehen sich auf die Freundschaftsdatenbank. LadybugDB verwendet Cypher, ist aber nicht vollständig Neo4j-kompatibel. Import-Sonderregeln gelten nur für das bereitgestellte Datenformat; andere Schreibabfragen können bei wiederholter Ausführung zusätzliche Daten erzeugen.";helpContent.append(foot);
