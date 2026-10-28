/* LadybugDB WASM is the query engine. The Cytoscape model is a UI projection. */
const engineState={connection:null,ready:null,seenNodes:new Set(),seenEdges:new Set(),schema:false,nodeTables:new Map(),relTables:new Set()};
const schema=[]; // Tables are created from imported labels and relationship types.
function identifier(value){if(!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value))throw Error("Ungültiger Bezeichner: "+value);return value}
function propertyType(v){return typeof v==="number"?(Number.isInteger(v)?"INT64":"DOUBLE"):typeof v==="boolean"?"BOOL":"STRING"}
async function ensureNodeTable(conn,label,data){
 identifier(label);
 const keyField=data.id!==undefined?"id":data.name!==undefined?"name":null;
 if(!keyField)throw Error("Knoten "+label+" benötigt eine eindeutige Eigenschaft «id» oder «name».");
 const existing=engineState.nodeTables.get(label);
 if(existing){
  if(existing.key!==keyField)throw Error("Label "+label+" verwendet unterschiedliche Primärschlüssel.");
  for(const [k,v] of Object.entries(data)){
   identifier(k);
   if(!existing.columns.has(k)){
    await conn.query("ALTER TABLE "+label+" ADD "+k+" "+propertyType(v));
    existing.columns.add(k);
   }
  }
  return keyField;
 }
 const columns=Object.entries(data).map(([k,v])=>identifier(k)+" "+propertyType(v));
 await conn.query("CREATE NODE TABLE "+label+"("+columns.join(", ")+", PRIMARY KEY("+keyField+"))");
 engineState.nodeTables.set(label,{key:keyField,columns:new Set(Object.keys(data))});
 return keyField;
}
async function ensureRelTable(conn,type,from,to){
 identifier(type);identifier(from);identifier(to);
 const signature=type+"|"+from+"|"+to;
 if(engineState.relTables.has(signature))return;
 if([...engineState.relTables].some(x=>x.startsWith(type+"|")))throw Error("Beziehungstyp "+type+" hat bereits andere Start-/Ziel-Labels.");
 await conn.query("CREATE REL TABLE "+type+"(FROM "+from+" TO "+to+")");
 engineState.relTables.add(signature);
}
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

  engineState.schema=true;
  $("status").textContent="LadybugDB-WASM bereit · Schema wird beim Import erstellt";
  return conn;
 })().catch(e=>{engineState.ready=null;$("status").textContent="WASM-Startfehler: "+e.message;throw e});
 return engineState.ready;
}
function keyFor(label,data){const key=engineState.nodeTables.get(label)?.key||(data.id!==undefined?"id":"name");return label+":"+String(data[key])}
function quote(v){return typeof v==="number"?String(v):typeof v==="boolean"?String(v):"'"+String(v).replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}
function statementParts(q){
 const stripped=q.replace(/^\s*\/\/.*$/gm,"").trim();
 const node=stripped.match(/^CREATE\s*\(\s*:\s*(\w+)\s*\{([^}]*)\}\s*\)\s*$/i);
 if(node)return {kind:"node",label:node[1],data:props(node[2])};
 const rel=stripped.match(/^MATCH\s*\(\s*a\s*:\s*(\w+)\s*\{([^}]*)\}\s*\)\s*,\s*\(\s*b\s*:\s*(\w+)\s*\{([^}]*)\}\s*\)\s*CREATE\s*\(a\)\s*-\s*\[:\s*(\w+)\s*\]\s*->\s*\(b\)\s*$/i);
 if(rel)return {kind:"rel",from:rel[1],a:props(rel[2]),to:rel[3],b:props(rel[4]),type:rel[5]};
 return {kind:"query",query:stripped};
}
function nodeKeyPattern(label,data){const field=engineState.nodeTables.get(label)?.key||(data.id!==undefined?"id":"name");if(data[field]===undefined)throw Error("Schlüssel "+field+" für "+label+" fehlt");return "{"+field+": "+quote(data[field])+"}"}
function rowObjects(result){
 return typeof result.getAllObjects==="function"?result.getAllObjects():result.getAllRows();
}
function plain(value){return JSON.parse(JSON.stringify(value,(_,v)=>typeof v==="bigint"?Number(v):v))}
async function executeEngine(part,conn){
 if(part.kind==="node"){
  await ensureNodeTable(conn,part.label,part.data);
  const key=keyFor(part.label,part.data);
  if(engineState.seenNodes.has(key))return;
  const fields=Object.entries(part.data).map(([k,v])=>k+": "+quote(v)).join(", ");
  await conn.query("CREATE (n:"+part.label+" {"+fields+"})");
  engineState.seenNodes.add(key);
  nodes.push({id:"n"+(nodes.length+1),label:part.label,data:part.data});
  return;
 }
 if(part.kind==="rel"){
  const a=keyFor(part.from,part.a),b=keyFor(part.to,part.b),key=a+"|"+part.type+"|"+b;
  if(engineState.seenEdges.has(key))return;
  if(!engineState.seenNodes.has(a)||!engineState.seenNodes.has(b))throw Error("Beziehung verweist auf nicht vorhandenen Knoten: "+key);
  await ensureRelTable(conn,part.type,part.from,part.to);
  await conn.query("MATCH (a:"+part.from+" "+nodeKeyPattern(part.from,part.a)+"), (b:"+part.to+" "+nodeKeyPattern(part.to,part.b)+") CREATE (a)-[r:"+part.type+"]->(b)");
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
 const statements=split(tabs[active].text.replace(/^\s*\/\/.*$/gm,"")).map(statementParts).filter(p=>p.kind!=="query"||p.query);
 const button=$("run");button.disabled=true;rows=[];
 let lastKind="import";
 let index=0;
 try{
  const conn=await initializeEngine();
  for(const part of statements){index++;lastKind=part.kind==="query"&&/^\s*(MATCH|OPTIONAL MATCH|WITH|UNWIND|CALL)\b/i.test(part.query)?"query":"import";$("status").textContent="Importiere Anweisung "+index+"/"+statements.length+" · "+nodes.length+" Knoten · "+edges.length+" Beziehungen";await executeEngine(part,conn)}
  draw();
  if(window.graphExplorer){if(lastKind==="query")window.graphExplorer.onQuery();else window.graphExplorer.onImport()}
  $("status").textContent="LadybugDB · "+nodes.length+" Knoten · "+edges.length+" Beziehungen · "+statements.length+" Anweisungen";
 }catch(e){draw();$("status").textContent="Fehler bei Anweisung "+index+"/"+statements.length+": "+e.message;console.error(e)}
 finally{button.disabled=false}
}
async function resetEngine(){
 if(!confirm("Datenbank und Graph vollständig leeren? Die Skripte bleiben erhalten."))return;
 const conn=await initializeEngine();
 for(const type of [...engineState.relTables].reverse()){await conn.query("DROP TABLE "+type.split("|")[0])}
 for(const label of [...engineState.nodeTables.keys()].reverse()){await conn.query("DROP TABLE "+label)}
 engineState.nodeTables.clear();engineState.relTables.clear();
 engineState.seenNodes.clear();engineState.seenEdges.clear();nodes=[];edges=[];rows=[];draw();window.graphExplorer?.reset();$("status").textContent="Datenbank geleert";
}
$("run").onclick=runWithEngine;
$("query").addEventListener("keydown",e=>{if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)){e.preventDefault();e.stopImmediatePropagation();runWithEngine()}},true);
$("reset-db").onclick=resetEngine;
$("demo").onclick=()=>{tabs=[{name:"Beispiel",text:demo},{name:"Alle Personen",text:"MATCH (n:Person) RETURN n"}];active=0;renderTabs();runWithEngine()};
initializeEngine().catch(console.error);
