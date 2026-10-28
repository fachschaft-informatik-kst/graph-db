/* Graph navigation controls. Icon-only buttons retain accessible labels and tooltips. */
(()=>{
 const bar=document.getElementById("graph-navigation");
 if(!bar)return;
 let layoutMode="force";
 const icons={
  plus:'<path d="M12 5v14M5 12h14"/>',
  minus:'<path d="M5 12h14"/>',
  up:'<path d="m6 15 6-6 6 6"/>',
  down:'<path d="m6 9 6 6 6-6"/>',
  left:'<path d="m15 6-6 6 6 6"/>',
  right:'<path d="m9 6 6 6-6 6"/>',
  fit:'<path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3"/>',
  force:'<circle cx="5" cy="6" r="2"/><circle cx="19" cy="7" r="2"/><circle cx="12" cy="19" r="2"/><path d="m7 7 10 0M6 8l5 9m7-8-5 8"/>',
  circle:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="3" r="1.8" fill="currentColor"/><circle cx="20.6" cy="15" r="1.8" fill="currentColor"/><circle cx="3.4" cy="15" r="1.8" fill="currentColor"/>',
  hierarchy:'<rect x="9" y="2" width="6" height="5" rx="1"/><rect x="2" y="17" width="6" height="5" rx="1"/><rect x="16" y="17" width="6" height="5" rx="1"/><path d="M12 7v5M5 17v-5h14v5"/>'
 };
 const buttons={};
 function add(name,label,action,group){
  const button=document.createElement("button");button.type="button";button.className="graph-icon-button";
  button.setAttribute("aria-label",label);button.title=label;button.dataset.action=name;
  button.innerHTML='<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[name]+'</svg>';
  button.onclick=action;group.append(button);buttons[name]=button;
 }
 function group(){const g=document.createElement("div");g.className="graph-nav-group";bar.append(g);return g}
 const zoom=group();
 add("plus","Vergrössern",()=>{if(!cy)return;cy.zoom({level:Math.min(cy.maxZoom(),cy.zoom()*1.3),renderedPosition:{x:cy.width()/2,y:cy.height()/2}})},zoom);
 add("minus","Verkleinern",()=>{if(!cy)return;cy.zoom({level:Math.max(cy.minZoom(),cy.zoom()/1.3),renderedPosition:{x:cy.width()/2,y:cy.height()/2}})},zoom);
 add("fit","Graph einpassen",()=>cy?.animate({fit:{eles:cy.elements(),padding:42},duration:240}),zoom);
 const pan=group();
 const move=(dx,dy)=>{if(cy)cy.panBy({x:dx,y:dy})};
 add("up","Nach oben bewegen",()=>move(0,70),pan);
 add("left","Nach links bewegen",()=>move(70,0),pan);
 add("right","Nach rechts bewegen",()=>move(-70,0),pan);
 add("down","Nach unten bewegen",()=>move(0,-70),pan);
 const layouts=group();
 function options(mode){
  if(mode==="hierarchy")return {name:"breadthfirst",directed:true,spacingFactor:1.35,avoidOverlap:true,animate:false,padding:55,fit:true};
  if(mode==="circle")return {name:"circle",startAngle:-Math.PI/2,clockwise:true,avoidOverlap:true,nodeDimensionsIncludeLabels:true,spacingFactor:1.25,animate:false,padding:55,fit:true};
  return null;
 }
 function arrange(mode){
  layoutMode=mode;
  for(const name of ["force","hierarchy","circle"])buttons[name].setAttribute("aria-pressed",String(name===mode));
  if(!cy||cy.nodes().empty())return;
  if(mode==="force")window.d3GraphForce.apply(cy);else {window.d3GraphForce.stop();cy.layout(options(mode)).run();}
 }
 add("force","Kraftbasiertes Layout",()=>arrange("force"),layouts);
 add("hierarchy","Hierarchisches Layout",()=>arrange("hierarchy"),layouts);
 add("circle","Kreisförmiges Layout",()=>arrange("circle"),layouts);
 for(const name of ["force","hierarchy","circle"])buttons[name].setAttribute("aria-pressed",String(name===layoutMode));
 window.graphLayout={apply:()=>{if(cy&&!cy.nodes().empty()){if(layoutMode==="force")window.d3GraphForce.apply(cy);else {window.d3GraphForce.stop();cy.layout(options(layoutMode)).run()}}},mode:()=>layoutMode};
 const previousDraw=draw;
 draw=function(){previousDraw();window.graphLayout.apply()};

})();
