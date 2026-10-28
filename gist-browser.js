/* Public Gist discovery requires only a GitHub username, no token. */
(()=>{
 const username=document.getElementById("gist-username"),results=document.getElementById("gist-results"),button=document.getElementById("gist-list");
 if(!button)return;
 const saved=localStorage.getItem("graphdb.gist.username");if(saved)username.value=saved;
 button.onclick=async()=>{
  const name=username.value.trim();
  if(!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(name)){results.textContent="Bitte einen gültigen GitHub-Benutzernamen eingeben.";return}
  localStorage.setItem("graphdb.gist.username",name);
  results.textContent="Öffentliche Gists werden geladen…";button.disabled=true;
  try{
   const response=await fetch("https://api.github.com/users/"+encodeURIComponent(name)+"/gists?per_page=100",{headers:{Accept:"application/vnd.github+json"}});
   if(!response.ok)throw Error(response.status===404?"Benutzer nicht gefunden.":"GitHub API: "+response.status);
   const gists=await response.json();results.replaceChildren();
   const available=gists.filter(g=>g.files&&g.files["graphdb.json"]);
   if(!available.length){results.textContent="Keine öffentlichen GraphDB-Gists gefunden. Geheime Gists sind über ihren direkten Link zugänglich.";return}
   for(const gist of available){
    const link=document.createElement("button");link.type="button";
    const title=gist.description||"GraphDB-Arbeitsstand";
    link.textContent=title+" · "+new Date(gist.updated_at).toLocaleDateString("de-CH");
    link.onclick=()=>{location.href=location.pathname+"?gist="+encodeURIComponent(gist.id)};
    results.append(link);
   }
  }catch(e){results.textContent=e.message}finally{button.disabled=false}
 };
})();
