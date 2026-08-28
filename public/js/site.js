
const defaultImg="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=78";
const labels={praias:"Praias",restaurantes:"Restaurantes",hoteis:"Hotéis",pontos:"Pontos turísticos",noticias:"Notícias",eventos:"Eventos"};
async function getData(type){const r=await fetch("/api/"+type);return r.json()}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function arrText(a){return Array.isArray(a)?a.join(", "):String(a||"")}
function renderCard(x,type){
 const title=esc(x.nome||x.titulo), img=x.imagem||defaultImg;
 let meta="";
 if(type==="noticias") meta=`<p class="muted">${esc(x.secretaria||"")}${x.assunto?" • "+esc(x.assunto):""}</p>`;
 if(type==="eventos") meta=`<p class="muted">${esc(x.data_inicio||"")}${x.hora_inicio?" às "+esc(x.hora_inicio):""}${x.local?" • "+esc(x.local):""}</p>`;
 if(type==="restaurantes") meta=`<p class="muted">${esc(x.cozinha||"")}${x.faixa_preco?" • "+esc(x.faixa_preco):""}</p>`;
 if(type==="hoteis") meta=`<p class="muted">${esc(x.faixa_diaria||"")}${x.acomodacoes?" • "+esc(x.acomodacoes):""}</p>`;
 if(type==="praias") meta=`<p class="muted">${esc(x.acesso||"")}${x.banho?" • "+esc(x.banho):""}</p>`;
 return `<article class="card"><div class="card-img"><img src="${img}" alt="${title}"></div><div class="card-body"><span class="tag">${esc(x.categoria||labels[type])}</span><h3>${title}</h3>${meta}${x.descricao?`<p class="muted">${esc(x.descricao)}</p>`:""}</div></article>`;
}
async function render(type,id="grid",q=""){
 const el=document.getElementById(id);if(!el)return;
 const a=(await getData(type)).filter(x=>(x.nome||x.titulo||"").toLowerCase().includes(q.toLowerCase()));
 el.innerHTML=a.map(x=>renderCard(x,type)).join("")||"<p>Nenhum resultado.</p>";
}
function doSearch(e,type){e.preventDefault();render(type,"grid",document.getElementById("q").value)}
