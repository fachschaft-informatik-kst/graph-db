/* Dependency-free Cypher syntax highlighting, using the native textarea for editing. */
(()=>{
 const input=document.getElementById("query"),code=document.querySelector("#query-highlight code"),pre=document.getElementById("query-highlight");
 if(!input||!code)return;
 const keywords=/^(?:MATCH|OPTIONAL|WHERE|RETURN|WITH|CREATE|MERGE|SET|DELETE|DETACH|REMOVE|UNWIND|AS|ORDER|BY|LIMIT|SKIP|DISTINCT|AND|OR|NOT|IN|IS|NULL|TRUE|FALSE|COUNT|COLLECT|SUM|AVG|MIN|MAX|STARTS|ENDS|CONTAINS|CASE|WHEN|THEN|ELSE|END|CALL|YIELD|UNION|ALL|NODE|REL|TABLE|PRIMARY|KEY|FROM|TO|INT64|STRING|DOUBLE|BOOL)$/i;
 const token=/(\/\/[^\n]*|--[^\n]*|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\b[A-Za-z_][\w]*\b|\b\d+(?:\.\d+)?\b|[:.]\s*[A-Za-z_][\w]*)/g;
 function render(){
  const text=input.value;code.replaceChildren();let last=0,match;
  token.lastIndex=0;
  while((match=token.exec(text))){
   if(match.index>last)code.append(document.createTextNode(text.slice(last,match.index)));
   const value=match[0],span=document.createElement("span");
   span.className=value.startsWith("//")||value.startsWith("--")?"cy-comment":value.startsWith("'")||value.startsWith('"')?"cy-string":/^\d/.test(value)?"cy-number":/^[.:]/.test(value)?"cy-label":keywords.test(value)?"cy-keyword":"";
   span.textContent=value;code.append(span);last=token.lastIndex;
  }
  if(last<text.length)code.append(document.createTextNode(text.slice(last)));
  code.append(document.createTextNode("\n"));
  pre.scrollTop=input.scrollTop;pre.scrollLeft=input.scrollLeft;
 }
 input.addEventListener("input",render);input.addEventListener("scroll",()=>{pre.scrollTop=input.scrollTop;pre.scrollLeft=input.scrollLeft});
 const original=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value");
 if(original?.set&&original?.get){
  Object.defineProperty(input,"value",{configurable:true,get(){return original.get.call(this)},set(v){original.set.call(this,v);render()}});
 }
 render();
})();
