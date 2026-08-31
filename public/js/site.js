
const defaultImg="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=78";
const labels={praias:"Praias",restaurantes:"Restaurantes",hoteis:"Hotéis",pontos:"Pontos turísticos",noticias:"Notícias",eventos:"Eventos"};
async function getData(type){const r=await fetch("/api/"+type);return r.json()}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function arrText(a){return Array.isArray(a)?a.join(", "):String(a||"")}
function detailHref(type,id){return `item.html?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`}
function renderCard(x,type){
 const title=esc(x.nome||x.titulo), img=x.imagem||defaultImg;
 let meta="";
 if(type==="noticias") meta=`<p class="muted">${esc(x.secretaria||"")}${x.assunto?" • "+esc(x.assunto):""}</p>`;
 if(type==="eventos") meta=`<p class="muted">${esc(x.data_inicio||"")}${x.hora_inicio?" às "+esc(x.hora_inicio):""}${x.local?" • "+esc(x.local):""}</p>`;
 if(type==="restaurantes") meta=`<p class="muted">${esc(x.cozinha||"")}${x.faixa_preco?" • "+esc(x.faixa_preco):""}</p>`;
 if(type==="hoteis") meta=`<p class="muted">${esc(x.faixa_diaria||"")}${x.acomodacoes?" • "+esc(x.acomodacoes):""}</p>`;
 if(type==="praias") meta=`<p class="muted">${esc(x.acesso||"")}${x.banho?" • "+esc(x.banho):""}</p>`;
 return `<a class="card" href="${detailHref(type,x.id)}"><div class="card-img"><img src="${img}" alt="${title}"></div><div class="card-body"><span class="tag">${esc(x.categoria||labels[type])}</span><h3>${title}</h3>${meta}${x.descricao?`<p class="muted">${esc(x.descricao)}</p>`:""}<span class="readmore">Ver detalhes →</span></div></a>`;
}
async function render(type,id="grid",q=""){
 const el=document.getElementById(id);if(!el)return;
 const a=(await getData(type)).filter(x=>(x.nome||x.titulo||"").toLowerCase().includes(q.toLowerCase()));
 el.innerHTML=a.map(x=>renderCard(x,type)).join("")||"<p>Nenhum resultado.</p>";
}
function doSearch(e,type){e.preventDefault();render(type,"grid",document.getElementById("q").value)}

async function renderDetail(){
 const p=new URLSearchParams(location.search),type=p.get('type'),id=p.get('id');
 const el=document.getElementById('detail');
 if(!type||!id||!labels[type]){el.innerHTML='<h1>Conteúdo não encontrado</h1>';return}
 const arr=await getData(type),x=arr.find(v=>String(v.id)===String(id));
 if(!x){el.innerHTML='<h1>Conteúdo não encontrado</h1>';return}
 const title=esc(x.nome||x.titulo), img=x.imagem||defaultImg;
 let facts=[];
 const fields={praias:['endereco','acesso','horario','estrutura','estacionamento','acessibilidade','banho','esportes','pet','permitido','proibido','observacoes'],restaurantes:['endereco','telefone','whatsapp','instagram','site','horario','faixa_preco','cozinha','servicos','acessibilidade','delivery','reservas','observacoes'],hoteis:['endereco','telefone','whatsapp','instagram','site','checkin','checkout','faixa_diaria','acomodacoes','comodidades','acessibilidade','pet','estacionamento','cafe_manha','piscina','observacoes'],pontos:['endereco','horario','telefone','site','acessibilidade','entrada','observacoes'],noticias:['secretaria','assunto','autor','data_publicacao','tags'],eventos:['categoria','data_inicio','hora_inicio','data_fim','hora_fim','local','endereco','ingresso','link','organizacao','contato','tags']};
 const names={endereco:'Endereço',acesso:'Acesso',horario:'Horário',estrutura:'Estrutura',estacionamento:'Estacionamento',acessibilidade:'Acessibilidade',banho:'Condições para banho',esportes:'Esportes',pet:'Pets',permitido:'O que pode',proibido:'O que não pode',observacoes:'Observações',telefone:'Telefone',whatsapp:'WhatsApp',instagram:'Instagram',site:'Site',faixa_preco:'Faixa de preço',cozinha:'Tipo de cozinha',servicos:'Serviços',delivery:'Delivery',reservas:'Reservas',checkin:'Check-in',checkout:'Check-out',faixa_diaria:'Faixa de diária',acomodacoes:'Acomodações',comodidades:'Comodidades',cafe_manha:'Café da manhã',piscina:'Piscina',entrada:'Entrada/ingresso',secretaria:'Secretaria',assunto:'Assunto',autor:'Autor',data_publicacao:'Data de publicação',tags:'Tags',categoria:'Categoria',data_inicio:'Data de início',hora_inicio:'Hora de início',data_fim:'Data de término',hora_fim:'Hora de término',local:'Local',ingresso:'Ingresso',link:'Link oficial',organizacao:'Organização',contato:'Contato'};
 for(const k of (fields[type]||[])){let v=x[k];if(Array.isArray(v))v=v.join(', ');if(v)facts.push(`<div class="fact"><b>${names[k]||k}</b><span>${esc(v)}</span></div>`)}
 el.innerHTML=`<div class="detail-hero"><img src="${img}" alt="${title}"><div class="detail-overlay"><span class="eyebrow">${esc(x.categoria||labels[type])}</span><h1>${title}</h1></div></div><div class="detail-content">${x.descricao?`<div class="detail-description">${esc(x.descricao).replace(/\n/g,'<br>')}</div>`:''}${facts.length?`<div class="facts">${facts.join('')}</div>`:''}</div>`;
 document.title=title+' | Portal Guarujá';
}
async function renderFeatured(){
 const el=document.getElementById('featured');if(!el)return;
 const types=['noticias','eventos','praias','restaurantes','hoteis','pontos'];let all=[];
 for(const type of types){const arr=await getData(type);all.push(...arr.filter(x=>x.destaque===true||x.destaque==='true').map(x=>({...x,__type:type})))}
 all=all.slice(0,8);
 el.innerHTML=all.length?all.map(x=>renderCard(x,x.__type)).join(''):'<div class="empty-featured"><b>Nenhum destaque publicado ainda.</b><p class="muted">Quando um conteúdo for marcado como “Destacar”, ele aparecerá automaticamente aqui.</p></div>';
}

// Navegação mobile do portal
(function(){
  function initMobileNav(){
    const nav=document.querySelector('.nav');
    const btn=document.querySelector('.mobile-nav-toggle');
    if(!nav||!btn)return;
    btn.addEventListener('click',()=>{
      const open=nav.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded',String(open));
      btn.innerHTML=open?'✕ <span>Fechar</span>':'☰ <span>Menu</span>';
    });
    document.querySelectorAll('#mainNav a').forEach(a=>a.addEventListener('click',()=>{
      nav.classList.remove('nav-open');btn.setAttribute('aria-expanded','false');btn.innerHTML='☰ <span>Menu</span>';
    }));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initMobileNav);else initMobileNav();
})();
