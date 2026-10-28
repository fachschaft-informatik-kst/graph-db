/* Structured Cypher result grid with sorting, filtering, nested properties and CSV. */
(()=>{
 const container=document.getElementById("table");
 if(!container)return;
 let sortColumn=null,sortDirection=1,filter="";
 const text=v=>v==null?"":typeof v==="object"?JSON.stringify(v):String(v);
 const type=v=>v==null?"null":Array.isArray(v)?"array":typeof v;
 const colsOf=data=>[...new Set(data.flatMap(row=>Object.keys(row||{})))];
 const label=v=>{
  if(Array.isArray(v))return v.length+" Einträge";
  const p=v.properties||v._properties||v;
  const l=v.labels||v._labels||v.label||v._label;
  return String(p.name??p.title??p.id??(Array.isArray(l)?l.join(", "):l)??"Eigenschaften");
 };
 function value(v){
  const kind=type(v),span=document.createElement("span");span.className="result-value result-"+kind;
  if(kind==="null"){span.textContent="–";span.title="NULL";return span}
  if(kind==="boolean"){span.textContent=v?"Wahr":"Falsch";return span}
  if(kind!=="object"&&kind!=="array"){span.textContent=String(v);return span}
  const details=document.createElement("details");details.className="result-object";
  const summary=document.createElement("summary"),tag=document.createElement("span"),name=document.createElement("span");
  tag.className="result-type";tag.textContent=kind==="array"?"Liste":"Objekt";
  name.className="result-object-name";name.textContent=label(v);
  summary.append(tag,name);details.append(summary);
  const entries=kind==="array"?v.map((x,i)=>[String(i+1),x]):Object.entries(v);
  const dl=document.createElement("dl");dl.className="result-properties";
  for(const [key,item]of entries){const dt=document.createElement("dt"),dd=document.createElement("dd");dt.textContent=key;dd.append(value(item));dl.append(dt,dd)}
  details.append(dl);span.append(details);return span;
 }
 function nodeId(row){
  const ids=new Set();
  function inspect(v){
   if(!v||typeof v!=="object")return;
   if(Array.isArray(v)){v.forEach(inspect);return}
   const p=v.properties||v._properties||v;
   const l=v.labels||v._labels||v.label||v._label;
   const labels=Array.isArray(l)?l:l?[l]:[];
   const key=p.id??p.name;
   if(key!=null){const found=nodes.filter(n=>(!labels.length||labels.includes(n.label))&&(n.data.id===key||n.data.name===key));if(found.length===1)ids.add(found[0].id)}
   for(const [k,x]of Object.entries(v))if(k!=="properties"&&k!=="_properties")inspect(x);
  }
  inspect(row);return ids.size===1?[...ids][0]:null;
 }
 function downloadCsv(data,cols){
  const quote=v=>'"'+text(v).replace(/"/g,'""')+'"';
  const csv="\uFEFF"+[cols.map(quote).join(";"),...data.map(r=>cols.map(c=>quote(r[c])).join(";"))].join("\r\n");
  const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"})),a=document.createElement("a");
  a.href=url;a.download="graphdb-ergebnis.csv";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 function render(){
  container.replaceChildren();
  const data=Array.isArray(rows)?rows:[],cols=colsOf(data);
  const filtered=()=>{
   const matches=data.filter(r=>!filter||Object.values(r).some(v=>text(v).toLocaleLowerCase("de").includes(filter.toLocaleLowerCase("de"))));
   if(!sortColumn)return matches;
   return matches.map((row,index)=>({row,index})).sort((a,b)=>{
    const x=a.row[sortColumn],y=b.row[sortColumn];
    const cmp=x==null?(y==null?0:1):y==null?-1:typeof x==="number"&&typeof y==="number"?x-y:text(x).localeCompare(text(y),"de",{numeric:true,sensitivity:"base"});
    return cmp*sortDirection||a.index-b.index;
   }).map(x=>x.row);
  };
  const toolbar=document.createElement("div");toolbar.className="result-grid-toolbar";
  const heading=document.createElement("div");heading.className="result-grid-heading";
  const title=document.createElement("strong");title.textContent="Abfrageergebnis";
  const count=document.createElement("span");count.className="result-count";count.textContent=data.length+" "+(data.length===1?"Zeile":"Zeilen");
  heading.append(title,count);toolbar.append(heading);
  const controls=document.createElement("div");controls.className="result-grid-actions";
  const search=document.createElement("input");search.type="search";search.placeholder="Ergebnisse filtern…";search.setAttribute("aria-label","Tabellenergebnisse filtern");search.value=filter;
  search.oninput=()=>{filter=search.value;render();const field=container.querySelector(".result-grid-actions input");field.focus();field.setSelectionRange(filter.length,filter.length)};
  const csv=document.createElement("button");csv.type="button";csv.textContent="CSV exportieren";csv.disabled=!data.length;csv.onclick=()=>downloadCsv(filtered(),cols);
  controls.append(search,csv);toolbar.append(controls);container.append(toolbar);
  if(!data.length){const empty=document.createElement("div");empty.className="result-grid-empty";empty.textContent="Keine Tabellenzeilen vorhanden. Führe eine Cypher-Abfrage mit RETURN aus.";container.append(empty);return}
  const visible=filtered(),wrap=document.createElement("div");wrap.className="result-grid-scroll";
  const grid=document.createElement("table");grid.className="result-grid";grid.setAttribute("aria-label","Cypher-Abfrageergebnis");
  const thead=document.createElement("thead"),head=document.createElement("tr");
  const numberHead=document.createElement("th");numberHead.textContent="#";numberHead.scope="col";head.append(numberHead);
  for(const col of cols){
   const th=document.createElement("th");th.scope="col";
   const button=document.createElement("button");button.type="button";button.className="result-sort";
   const name=document.createElement("span");name.textContent=col;
   const arrow=document.createElement("span");arrow.className="result-sort-arrow";arrow.textContent=sortColumn===col?(sortDirection===1?"↑":"↓"):"↕";
   button.append(name,arrow);button.title="Nach "+col+" sortieren";button.onclick=()=>{if(sortColumn===col)sortDirection*=-1;else{sortColumn=col;sortDirection=1}render()};
   th.setAttribute("aria-sort",sortColumn===col?(sortDirection===1?"ascending":"descending"):"none");th.append(button);head.append(th);
  }
  thead.append(head);grid.append(thead);
  const tbody=document.createElement("tbody");
  visible.forEach((row,i)=>{
   const tr=document.createElement("tr"),number=document.createElement("td");number.className="result-row-number";number.textContent=String(i+1);tr.append(number);
   for(const col of cols){const td=document.createElement("td");td.append(value(row[col]));tr.append(td)}
   const id=nodeId(row);
   if(id){tr.dataset.nodeId=id;tr.tabIndex=0;tr.title="Knoten im Graph markieren";tr.onclick=e=>{if(!e.target.closest("details,summary,button"))window.graphExplorer?.selectItem(id)};tr.onkeydown=e=>{if(e.key==="Enter"&&!e.target.closest("details,button"))window.graphExplorer?.selectItem(id)}}
   tbody.append(tr);
  });
  grid.append(tbody);wrap.append(grid);container.append(wrap);
  const foot=document.createElement("div");foot.className="result-grid-footer";foot.textContent=visible.length===data.length?data.length+" Ergebnisse":visible.length+" von "+data.length+" Ergebnissen";container.append(foot);
 }
 drawTable=render;
 render();
})();