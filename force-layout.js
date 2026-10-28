/* Deterministic, settled D3 force layout with node/node and node/edge clearance. */
(()=>{
 const clearance=26;
 function edgeAvoidance(links,radius){
  let items=[];
  function force(alpha){
   const strength=0.95*Math.max(0.22,alpha);
   for(const edge of links){
    const a=edge.source,b=edge.target;
    const dx=b.x-a.x,dy=b.y-a.y,denom=dx*dx+dy*dy;
    if(denom<1)continue;
    for(const n of items){
     if(n===a||n===b)continue;
     const t=Math.max(0.12,Math.min(0.88,((n.x-a.x)*dx+(n.y-a.y)*dy)/denom));
     const px=a.x+t*dx,py=a.y+t*dy;
     let vx=n.x-px,vy=n.y-py,dist=Math.hypot(vx,vy);
     const minDist=radius+clearance;
     if(dist>=minDist)continue;
     if(dist<0.01){vx=-dy/Math.sqrt(denom);vy=dx/Math.sqrt(denom);dist=1}
     const push=(minDist-dist)*strength;
     const ux=vx/dist,uy=vy/dist;
     if(n.fx==null){n.vx+=ux*push;n.vy+=uy*push}
     if(a.fx==null){a.vx-=ux*push*(1-t)*0.30;a.vy-=uy*push*(1-t)*0.30}
     if(b.fx==null){b.vx-=ux*push*t*0.30;b.vy-=uy*push*t*0.30}
    }
   }
  }
  force.initialize=nodes=>{items=nodes};
  return force;
 }
 function apply(cy){
  if(!cy||cy.nodes().empty())return;
  if(!window.d3?.forceSimulation){console.warn("D3 unavailable; using Cytoscape fallback");cy.layout({name:"cose",animate:false,randomize:true,nodeRepulsion:17000,idealEdgeLength:140,fit:true,padding:55}).run();return}
  const elements=cy.nodes().toArray(),radius=Math.max(24,...elements.map(n=>Math.max(n.width(),n.height())/2));
  const count=elements.length;
  const width=Math.max(600,Math.sqrt(count)*210);
  const points=elements.map((node,i)=>{
   const angle=i*2.399963229728653;
   const distance=90*Math.sqrt(i+1);
   const current=node.position();
   const pinned=node.locked();
   return {id:node.id(),x:pinned?current.x:Math.cos(angle)*distance,y:pinned?current.y:Math.sin(angle)*distance,
    fx:pinned?current.x:null,fy:pinned?current.y:null};
  });
  const map=new Map(points.map(n=>[n.id,n]));
  const links=cy.edges().toArray().map(e=>({source:map.get(e.source().id()),target:map.get(e.target().id())})).filter(e=>e.source&&e.target&&e.source!==e.target);
  const simulation=d3.forceSimulation(points)
   .force("links",d3.forceLink(links).id(n=>n.id).distance(Math.max(150,radius*4.3)).strength(0.28))
   .force("charge",d3.forceManyBody().strength(-Math.max(1050,radius*30)).distanceMax(width*1.5))
   .force("collision",d3.forceCollide().radius(radius+20).strength(1).iterations(4))
   .force("center",d3.forceCenter(0,0).strength(0.045))
   .force("edgeClearance",edgeAvoidance(links,radius))
   .velocityDecay(0.52)
   .alphaDecay(0.014)
   .stop();
  // Settle off-screen so the initial graph is already readable.
  const steps=Math.min(560,Math.max(300,count*9));
  for(let i=0;i<steps;i++)simulation.tick();
  simulation.stop();
  cy.batch(()=>{
   for(const node of elements){const p=map.get(node.id());if(!node.locked())node.position({x:p.x,y:p.y})}
  });
  cy.fit(cy.elements(),60);
 }
 window.d3GraphForce={apply};
})();
