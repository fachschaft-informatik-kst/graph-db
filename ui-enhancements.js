/* User-selectable label colors; color assignments travel with JSON/Gist workspaces. */
const palette=["#2563eb","#0d9488","#9333ea","#ea580c","#db2777","#65a30d","#0891b2","#b45309"];
let labelColors={};
function labelsInGraph(){return [...new Set(nodes.map(n=>n.label))].sort((a,b)=>a.localeCompare(b))}
function labelColor(label){const labels=labelsInGraph();return labelColors[label]||palette[Math.max(0,labels.indexOf(label))%palette.length]}
function refreshLabelColors(){
 const area=document.getElementById("label-colors");if(!area||!cy)return;
 area.replaceChildren();
 for(const label of labelsInGraph()){
  const wrap=document.createElement("label");wrap.className="color-item";
  const input=document.createElement("input");input.type="color";input.value=labelColor(label);input.setAttribute("aria-label","Farbe für "+label);
  input.addEventListener("input",()=>{labelColors[label]=input.value;applyLabelColors()});
  const name=document.createElement("span");name.textContent=label;
  wrap.append(input,name);area.append(wrap);
 }
 applyLabelColors();
}
function applyLabelColors(){
 if(!cy)return;
 cy.nodes().forEach(node=>node.style("background-color",labelColor(node.data("label"))));
}
const originalDraw=draw;
draw=function(){originalDraw();refreshLabelColors()};
const originalWorkspace=workspace;
workspace=function(){return {...originalWorkspace(),labelColors:{...labelColors}}};
const originalLoad=load;
load=function(w){labelColors=w?.labelColors&&typeof w.labelColors==="object"?{...w.labelColors}:{};originalLoad(w)};
document.getElementById("fit-graph").onclick=()=>cy?.fit(undefined,36);
