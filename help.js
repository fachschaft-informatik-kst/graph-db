/* Contextual, expandable Cypher documentation for teaching. */
const examples=[
 {group:"Grundlagen",title:"Alle Knoten",description:"MATCH (n) sucht alle Knoten, unabhängig von ihrem Label.",query:"MATCH (n) RETURN n;"},
 {group:"Grundlagen",title:"Knoten nach Label",description:"Ersetzen Sie Label durch einen Knotentyp aus Ihrer Datenbank.",query:"MATCH (n:Label) RETURN n;"},
 {group:"Grundlagen",title:"Nach Eigenschaft filtern",description:"WHERE schränkt Ergebnisse anhand einer Eigenschaft ein.",query:"MATCH (n:Label) WHERE n.name = 'Beispiel' RETURN n;"},
 {group:"Grundlagen",title:"Eigenschaften anzeigen",description:"Punktnotation greift auf Eigenschaften zu.",query:"MATCH (n:Label) RETURN n.name;"},
 {group:"Grundlagen",title:"Sortieren und begrenzen",description:"ORDER BY und LIMIT sortieren und begrenzen Ergebnisse.",query:"MATCH (n:Label) RETURN n.name ORDER BY n.name LIMIT 10;"},
 {group:"Beziehungen",title:"Gerichtete Beziehung",description:"Die Richtung der Pfeile gehört zum Muster. Ersetzen Sie die Platzhalter.",query:"MATCH (a:LabelA)-[:VERBUNDEN_MIT]->(b:LabelB) RETURN a, b;"},
 {group:"Beziehungen",title:"Beliebiger Beziehungstyp",description:"Ohne Beziehungstyp können verschiedene Kanten gefunden werden.",query:"MATCH (a)-[r]->(b) RETURN a, r, b;"},
 {group:"Beziehungen",title:"Zwei Schritte",description:"Zwei aufeinanderfolgende Kanten verbinden drei Knoten.",query:"MATCH (a)-[r1]->(b)-[r2]->(c) RETURN a, b, c;"},
 {group:"Auswertung",title:"Knoten zählen",description:"COUNT zählt Treffer.",query:"MATCH (n) RETURN count(n);"},
 {group:"Auswertung",title:"Nach Label gruppieren",description:"Aggregieren Sie Knoten nach ihrem Label.",query:"MATCH (n) RETURN label(n), count(n);"},
 {group:"Daten verändern",title:"Knoten erstellen",description:"Der Import erstellt die Tabelle für neue Labels automatisch. Jeder Knoten braucht id oder name als Schlüssel.",query:"CREATE (:Produkt {id:'P1', name:'Beispielprodukt'});"},
 {group:"Daten verändern",title:"Beziehung erstellen",description:"Beide Endknoten müssen existieren. Ersetzen Sie die Beispiel-Labels und Schlüssel.",query:"MATCH (a:Produkt {id:'P1'}), (b:Kategorie {name:'Beispiel'}) CREATE (a)-[:GEHOERT_ZU]->(b);"}
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
const foot=document.createElement("p");foot.className="help-disclaimer";foot.textContent="Die Beispiele verwenden Platzhalter wie Label und VERBUNDEN_MIT. Passen Sie diese an Ihren Datensatz an. LadybugDB unterstützt nicht alle Neo4j-Funktionen. Der automatische CREATE-Import benötigt pro Knoten eine eindeutige Eigenschaft id oder name; komplexe Neo4j-Skripte können zusätzliche Anpassungen benötigen.";helpContent.append(foot);
