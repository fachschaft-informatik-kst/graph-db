// Experimental integration. Keep isolated until browser integration tests pass.
// Official package: https://www.npmjs.com/package/@ladybugdb/wasm-core
let conn;
const status=document.getElementById("wasm-status");
const output=document.getElementById("wasm-output");
document.getElementById("wasm-init").onclick=async()=>{
 status.textContent="LadybugDB WASM wird geladen…";
 try {
  // Version pinned for reproducibility; CDN is only for this experimental page.
  const module=await import("https://esm.sh/@ladybugdb/wasm-core@0.20.1");
  const lbug=module.default;
  if(typeof lbug.init==="function")await lbug.init();
  const db=new lbug.Database(":memory:");
  conn=new lbug.Connection(db);
  if(typeof conn.init==="function")await conn.init();
  document.getElementById("wasm-run").disabled=false;
  status.textContent="WASM initialisiert. Bereit für Cypher.";
 }catch(e){status.textContent="WASM konnte nicht initialisiert werden: "+e.message;console.error(e)}
};
document.getElementById("wasm-run").onclick=async()=>{
 if(!conn)return;
 const q=document.getElementById("wasm-query").value.trim();
 if(!q)return;
 try{
  const result=await conn.query(q);
  const results=Array.isArray(result)?result:[result];
  const all=[];
  for(const r of results){
   try{all.push(...(await r.getAll()))}finally{if(typeof r.close==="function")await r.close()}
  }
  output.textContent=JSON.stringify(all,(_,v)=>typeof v==="bigint"?v.toString():v,2);
  status.textContent="Cypher ausgeführt.";
 }catch(e){status.textContent="Cypher-Fehler: "+e.message;output.textContent=""}
};
