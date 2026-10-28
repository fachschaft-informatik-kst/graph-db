/* Interactive exploration of the imported graph and query results. */
(()=>{
 const $=id=>document.getElementById(id),stage=document.querySelector(".graph-stage"),table=$("table"),menu=$("graph-context");
 let scope=null,history=[],selection=null,queryMode=false,resultIds=new Set(),size=42;const expanded=new Set();
 const captions={};
 const all=()=>new Set(nodes.map(n=>n.id));
 const visible=()=>scope|| (queryMode?resultIds:all());
 const label=n=>String(n.data[captions[n.label]||(["name","title","id"].find(k=>n.data[k]!=null))||Object.keys(n.data)[0]]??n.label);
 function save(){history.push({scope:scope?new Set(scope):null,queryMode,resultIds:new Set(resultIds),pan:cy?.pan(),zoom:cy?.zoom()});if(history.length>30)history.shift();$("graph-back").disabled=false}
 function redraw(keep=false){
  if(!cy)return;const pan=cy.pan(),zoom=cy.zoom(),ids=visible();
  cy.elements().remove();
  cy.add(nodes.filter(n=>ids.has(n.id)).map(n=>({data:{id:n.id,name:label(n),label:n.label,properties:n.data}})).concat(edges.filter(e=>ids.has(e.source)&&ids.has(e.target)).map(e=>({data:{id:e.id,source:e.source,target:e.target,label:e.label,properties:e.data}}))));
  if(typeof applyLabelColors==="function")applyLabelColors();
  cy.nodes().style({width:size,height:size});
  if(selection&&cy.getElementById(selection).length)cy.getElementById(selection).select();
  if(keep){cy.zoom(zoom);cy.pan(pan)}else if(cy.elements().length)cy.layout({name:"cose",animate:false,randomize:false,fit:true,padding:40}).run();
  $("graph-empty").hidden=ids.size>0;highlight();
 }
 function reset(){save();scope=null;expanded.clear();queryMode=false;resultIds.clear();redraw()}
 function neighbors(id,type){
  save();const ids=scope?new Set(visible()):new Set([id]);ids.add(id);
  for(const e of edges)if((e.source===id||e.target===id)&&(!type||e.label===type)){ids.add(e.source);ids.add(e.target)}
  scope=ids;queryMode=false;expanded.add(id);redraw();
 }
 function remove(id){save();scope=new Set(visible());scope.delete(id);redraw()}
 function select(id){
  selection=id;if(cy){cy.elements().unselect();cy.getElementById(id).select()}
  const item=nodes.find(n=>n.id===id)||edges.find(e=>e.id===id);
  if(item){const box=$("properties");box.replaceChildren();const h=document.createElement("strong");h.textContent=item.label+" · Eigenschaften";const pre=document.createElement("pre");pre.textContent=JSON.stringify(item.data,null,2);box.append(h,pre)}
  table.querySelectorAll("tr[data-node-id]").forEach(tr=>tr.classList.toggle("row-selected",tr.dataset.nodeId===id));
 }
 function closeMenu(){menu.hidden=true;menu.replaceChildren()}
 function openMenu(event,id){
  menu.replaceChildren();const add=(text,fn)=>{const b=document.createElement("button");b.type="button";b.role="menuitem";b.textContent=text;b.onclick=()=>{closeMenu();fn()};menu.append(b)};
  add("Nachbarn anzeigen",()=>neighbors(id));
  for(const type of [...new Set(edges.filter(e=>e.source===id||e.target===id).map(e=>e.label))].sort())add("Nur "+type,()=>neighbors(id,type));
  add("Nur diesen Knoten",()=>{save();scope=new Set([id]);queryMode=false;redraw()});
  add("Knoten ausblenden",()=>remove(id));
  add("Knoten fixieren / lösen",()=>{const n=cy.getElementById(id);n.locked()?n.unlock():n.lock()});
  const r=stage.getBoundingClientRect();menu.style.left=Math.max(4,Math.min(event.clientX-r.left,r.width-200))+"px";menu.style.top=Math.max(4,Math.min(event.clientY-r.top,r.height-210))+"px";menu.hidden=false;
 }
 document.addEventListener("click",e=>{if(!menu.contains(e.target))closeMenu()});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu()});
 function bind(){
  if(!cy||cy.scratch("_explorerBound"))return;cy.scratch("_explorerBound",true);
  cy.on("dbltap","node",e=>{const id=e.target.id();if(expanded.has(id)){save();expanded.delete(id);scope=new Set([id]);for(const n of expanded)for(const edge of edges)if(edge.source===n||edge.target===n){scope.add(edge.source);scope.add(edge.target)}queryMode=false;redraw()}else neighbors(id)});
  cy.on("cxttap","node",e=>{const r=stage.getBoundingClientRect(),ev=e.originalEvent||{};openMenu({clientX:ev.clientX||r.left+70,clientY:ev.clientY||r.top+70},e.target.id())});
  cy.on("tap","node,edge",e=>select(e.target.id()));
 }
 function highlight(){
  if(!cy)return;const q=$("graph-search").value.toLocaleLowerCase("de");
  cy.nodes().forEach(n=>{const match=!q||[n.data("name"),n.data("label"),...Object.values(n.data("properties")||{})].some(v=>String(v).toLocaleLowerCase("de").includes(q));n.style({opacity:match?1:.2,"border-width":q&&match?4:2,"border-color":q&&match?"#f59e0b":"#fff"})});
 }
 $("graph-search").oninput=highlight;
 $("graph-back").disabled=true;
 $("graph-back").onclick=()=>{const p=history.pop();if(!p)return;scope=p.scope;queryMode=p.queryMode;resultIds=p.resultIds;redraw();if(p.zoom!=null){cy.zoom(p.zoom);cy.pan(p.pan)}$("graph-back").disabled=!history.length};
 $("graph-reset").onclick=reset;
 $("graph-node-size").oninput=e=>{size=Number(e.target.value);cy?.nodes().style({width:size,height:size})};
 function download(uri,name){const a=document.createElement("a");a.href=uri;a.download=name;document.body.append(a);a.click();a.remove()}
 $("graph-png").onclick=()=>{if(cy)download(cy.png({output:"base64uri",full:true,scale:2,bg:"#ffffff"}),"graph.png")};
 $("graph-svg").onclick=()=>{
  if(!cy)return;const b=cy.elements().boundingBox(),pad=35,doc=document.implementation.createDocument("http://www.w3.org/2000/svg","svg",null),root=doc.documentElement;
  root.setAttribute("viewBox",[b.x1-pad,b.y1-pad,Math.max(1,b.w+pad*2),Math.max(1,b.h+pad*2)].join(" "));
  root.setAttribute("xmlns","http://www.w3.org/2000/svg");
  const element=(name,attrs)=>{const x=doc.createElementNS(root.namespaceURI,name);Object.entries(attrs).forEach(([k,v])=>x.setAttribute(k,String(v)));root.append(x);return x};
  element("rect",{x:b.x1-pad,y:b.y1-pad,width:b.w+pad*2,height:b.h+pad*2,fill:"#fff"});
  cy.edges().forEach(e=>{const a=e.source().position(),z=e.target().position();element("line",{x1:a.x,y1:a.y,x2:z.x,y2:z.y,stroke:"#94a3b8","stroke-width":2})});
  cy.nodes().forEach(n=>{const p=n.position();element("circle",{cx:p.x,cy:p.y,r:size/2,fill:n.style("background-color")||"#2563eb"});const t=element("text",{x:p.x,y:p.y+size/2+15,"text-anchor":"middle","font-size":12,fill:"#172554"});t.textContent=n.data("name")});
  const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(doc)],{type:"image/svg+xml"}));download(url,"graph.svg");setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 function captionsUI(){
  const area=$("label-colors");for(const labelName of [...new Set(nodes.map(n=>n.label))]){
   const item=[...area.querySelectorAll(".color-item")].find(x=>x.querySelector("span")?.textContent===labelName);
   if(!item||item.querySelector("select"))continue;
   const fields=[...new Set(nodes.filter(n=>n.label===labelName).flatMap(n=>Object.keys(n.data)))];
   const select=document.createElement("select");select.setAttribute("aria-label","Beschriftung für "+labelName);
   for(const field of fields){const option=document.createElement("option");option.value=field;option.textContent=field;select.append(option)}
   select.value=captions[labelName]||(["name","title","id"].find(x=>fields.includes(x))||fields[0]);
   select.onchange=()=>{captions[labelName]=select.value;redraw(true)};item.append(select);
  }
 }
 function resolveNode(v){
  if(!v||typeof v!=="object"||Array.isArray(v))return null;
  const props=v.properties||v._properties||v;
  const labels=v.labels||v._labels||v.label||v._label;
  const ls=Array.isArray(labels)?labels:labels?[labels]:[];
  const key=props.id??props.name;
  if(key==null)return null;
  return nodes.find(n=>(!ls.length||ls.includes(n.label))&&(n.data.id===key||n.data.name===key))?.id||null;
 }
 function rowIds(rs){
  const ids=new Set();
  function walk(v){if(Array.isArray(v)){v.forEach(walk);return}if(!v||typeof v!=="object")return;const id=resolveNode(v);if(id)ids.add(id);for(const [k,x]of Object.entries(v))if(k!=="properties"&&k!=="_properties"&&typeof x==="object")walk(x)}
  rs.forEach(walk);return ids;
 }
 const oldDraw=draw;draw=function(){oldDraw();bind();redraw();captionsUI()};
 const oldTable=drawTable;drawTable=function(){
  oldTable();[...table.querySelectorAll("tr")].slice(1).forEach((tr,i)=>{const ids=rowIds([rows[i]]);if(ids.size!==1)return;const id=[...ids][0];tr.dataset.nodeId=id;tr.tabIndex=0;tr.title="Knoten im Graph markieren";tr.onclick=()=>select(id);tr.onkeydown=e=>{if(e.key==="Enter")select(id)}});
 };
 function view(v){
  stage.hidden=v==="table";table.hidden=v==="graph";
  for(const key of ["graph","table","both"])$("view-"+key).classList.toggle("selected",key===v);
  document.querySelector(".results").classList.toggle("both-views",v==="both");
  if(!stage.hidden)requestAnimationFrame(()=>cy?.resize());
  if(!table.hidden)drawTable();
 }
 $("view-graph").onclick=()=>view("graph");$("view-table").onclick=()=>view("table");$("view-both").onclick=()=>view("both");
 const oldWorkspace=workspace;workspace=function(){return {...oldWorkspace(),graphExplorer:{captions:{...captions},size}}};
 const oldLoad=load;load=function(w){Object.assign(captions,w?.graphExplorer?.captions||{});size=w?.graphExplorer?.size||42;$("graph-node-size").value=size;scope=null;queryMode=false;history=[];oldLoad(w)};
 window.graphExplorer={onQuery(){resultIds=rowIds(rows);queryMode=true;scope=null;redraw()},onImport(){queryMode=false;scope=null;redraw();captionsUI()},reset(){scope=null;queryMode=false;resultIds.clear();history=[];expanded.clear();redraw()},refresh(){redraw(true);captionsUI()}};
 draw();view("graph");
})();