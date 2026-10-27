// Bundled locally by build.mjs; both module and worker are same-origin.
let conn;
const status=document.getElementById("wasm-status");
const output=document.getElementById("wasm-output");
document.getElementById("wasm-init").onclick=async()=>{
 status.textContent="LadybugDB WASM wird geladen…";
 const button=document.getElementById("wasm-init");button.disabled=true;
 try{
  const {default:lbug}=await import("./vendor/lbug.js");
  lbug.setWorkerPath(new URL("./vendor/lbug_wasm_worker.js",location.href).href);
  await lbug.init();
  const db=new lbug.Database(":memory:");
  conn=new lbug.Connection(db);
  await conn.init();
  document.getElementById("wasm-run").disabled=false;
  status.textContent="WASM initialisiert. Bereit für Cypher.";
 }catch(e){status.textContent="WASM konnte nicht initialisiert werden: "+e.message;console.error(e);button.disabled=false}
};
document.getElementById("wasm-run").onclick=async()=>{
 if(!conn)return;
 const q=document.getElementById("wasm-query").value.trim();
 if(!q)return;
 try{
  const result=await conn.query(q);
  const rows=typeof result.getAllObjects==="function"?await result.getAllObjects():await result.getAllRows();
  output.textContent=JSON.stringify(rows,(_,v)=>typeof v==="bigint"?v.toString():v,2);
  status.textContent="Cypher ausgeführt.";
  if(typeof result.close==="function")await result.close();
 }catch(e){status.textContent="Cypher-Fehler: "+e.message;output.textContent=""}
};
