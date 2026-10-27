/* LadybugDB WASM is the query engine. The Cytoscape model is a UI projection. */
const engineState={connection:null,ready:null,seenNodes:new Set(),seenEdges:new Set(),schema:false};
const schema=[
"CREATE NODE TABLE Person(name STRING, age INT64, PRIMARY KEY(name))",
"CREATE NODE TABLE Hobby(name STRING, PRIMARY KEY(name))",
"CREATE NODE TABLE City(name STRING, PRIMARY KEY(name))",
"CREATE NODE TABLE Company(name STRING, PRIMARY KEY(name))",
"CREATE NODE TABLE Event(id STRING, title STRING, date STRING, PRIMARY KEY(id))",
"CREATE REL TABLE KNOWS(FROM Person TO Person)",
"CREATE REL TABLE LIKES(FROM Person TO Hobby)",
"CREATE REL TABLE LIVES_IN(FROM Person TO City)",
"CREATE REL TABLE WORKS_AT(FROM Person TO Company)",
"CREATE REL TABLE ATTENDS(FROM Person TO Event)",
"CREATE REL TABLE IN_CITY(FROM Event TO City)"
];
async function initializeEngine(){
 if(engineState.ready)return engineState.ready;
 engineState.ready=(async()=>{
  $("status").textContent="LadybugDB-WASM wird initialisiert…";
  const {default:lbug}=await import("./vendor/lbug.js");
  lbug.setWorkerPath(new URL("./vendor/lbug_wasm_worker.js",location.href).href);
  await lbug.init();
  const db=new lbug.Database(":memory:");
  const conn=new lbug.Connection(db);await conn.init();
  engineState.connection=conn;
  for(const ddl of schema)await conn.query(ddl);
  engineState.schema=true;
  $("status").textContent="LadybugDB-WASM bereit";
  return conn;
 })().catch(e=>{engineState.ready=null;$("status").textContent="WASM-Startfehler: "+e.message;throw e});
 return engineState.ready;
}
function keyFor(label,data){return label+":"+(label==="Event"?data.id:data.name)}
function quote(v){return typeof v==="number"?String(v):typeof v==="boolean"?String(v):"'"+String(v).replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}
function statementParts(q){
 const stripped=q.replace(/^\s*\/\/.*$/gm,"").trim();
 const node=stripped.match(/^CREATE\s*\(\s*:\s*(\w+)\s*\{([^}]*)\}\s*\)\s*$/i);
 if(node)return {kind:"node",label:node[1],data:props(node[2])};
 const rel=stripped.match(/^MATCH\s*\(\s*a\s*:\s*(\w+)\s*\{([^}]*)\}\s*\)\s*,\s*\(\s*b\s*:\s*(\w+)\s*\{([^}]*)\}\s*\)\s*CREATE\s*\(a\)\s*-\s*\[:\s*(\w+)\s*\]\s*->\s*\(b\)\s*$/i);
 if(rel)return {kind:"rel",from:rel[1],a:props(rel[2]),to:rel[3],b:props(rel[4]),type:rel[5]};
 return {kind:"query",query:stripped};
}
function nodeKeyPattern(label,data){const field=label==="Event"?"id":"name";if(data[field]===undefined)throw Error("Schlüssel "+field+" für "+label+" fehlt");return "{"+field+": "+quote(data[field])+"}"}
function rowObjects(result){
 return typeof result.getAllObjects==="function"?result.getAllObjects():result.getAllRows();
}
function plain(value){return JSON.parse(JSON.stringify(value,(_,v)=>typeof v==="bigint"?Number(v):v))}
async function executeEngine(part,conn){
 if(part.kind==="node"){
  if(!["Person","Hobby","City","Company","Event"].includes(part.label))throw Error("Unbekanntes Knotenlabel "+part.label);
  const key=keyFor(part.label,part.data);
  if(engineState.seenNodes.has(key))return;
  const fields=Object.entries(part.data).map(([k,v])=>k+": "+quote(v)).join(", ");
  await conn.query("MERGE (n:"+part.label+" "+nodeKeyPattern(part.label,part.data)+") SET n += {"+fields+"}");
  engineState.seenNodes.add(key);
  nodes.push({id:"n"+(nodes.length+1),label:part.label,data:part.data});
  return;
 }
 if(part.kind==="rel"){
  const a=keyFor(part.from,part.a),b=keyFor(part.to,part.b),key=a+"|"+part.type+"|"+b;
  if(engineState.seenEdges.has(key))return;
  if(!engineState.seenNodes.has(a)||!engineState.seenNodes.has(b))throw Error("Beziehung verweist auf nicht vorhandenen Knoten: "+key);
  await conn.query("MATCH (a:"+part.from+" "+nodeKeyPattern(part.from,part.a)+"), (b:"+part.to+" "+nodeKeyPattern(part.to,part.b)+") MERGE (a)-[r:"+part.type+"]->(b)");
  engineState.seenEdges.add(key);
  const from=nodes.find(n=>keyFor(n.label,n.data)===a),to=nodes.find(n=>keyFor(n.label,n.data)===b);
  edges.push({id:"e"+(edges.length+1),source:from.id,target:to.id,label:part.type,data:{}});
  return;
 }
 if(!part.query)return;
 const result=await conn.query(part.query);
 rows=plain(await rowObjects(result));
 if(typeof result.close==="function")await result.close();
}
async function runWithEngine(){
 tabs[active].text=$("query").value;
 const statements=split(tabs[active].text).map(statementParts).filter(p=>p.kind!=="query"||p.query);
 const button=$("run");button.disabled=true;rows=[];
 let index=0;
 try{
  const conn=await initializeEngine();
  for(const part of statements){index++;await executeEngine(part,conn)}
  draw();
  $("status").textContent="LadybugDB · "+nodes.length+" Knoten · "+edges.length+" Beziehungen · "+statements.length+" Anweisungen";
 }catch(e){draw();$("status").textContent="Fehler bei Anweisung "+index+"/"+statements.length+": "+e.message;console.error(e)}
 finally{button.disabled=false}
}
async function resetEngine(){
 if(!confirm("Datenbank und Graph vollständig leeren? Die Skripte bleiben erhalten."))return;
 const conn=await initializeEngine();
 for(const ddl of [...schema].reverse()){const m=ddl.match(/^CREATE (NODE|REL) TABLE (\w+)/);if(m)await conn.query("DROP TABLE "+m[2])}
 for(const ddl of schema)await conn.query(ddl);
 engineState.seenNodes.clear();engineState.seenEdges.clear();nodes=[];edges=[];rows=[];draw();$("status").textContent="Datenbank geleert";
}
$("run").onclick=runWithEngine;
$("query").addEventListener("keydown",e=>{if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)){e.preventDefault();e.stopImmediatePropagation();runWithEngine()}},true);
$("reset-db").onclick=resetEngine;
$("demo").onclick=()=>{tabs=[{name:"Beispiel",text:demo},{name:"Alle Personen",text:"MATCH (n:Person) RETURN n"}];active=0;renderTabs();runWithEngine()};
initializeEngine().catch(console.error);
