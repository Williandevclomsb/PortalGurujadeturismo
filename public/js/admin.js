
let state={data:null,type:window.ADMIN_TYPE||null,selected:null};
const labels={praias:"Praias",restaurantes:"Restaurantes",hoteis:"Hotéis e pousadas",pontos:"Pontos turísticos",noticias:"Notícias",eventos:"Eventos"};
const singular={praias:"praia",restaurantes:"restaurante",hoteis:"hotel/pousada",pontos:"ponto turístico",noticias:"notícia",eventos:"evento"};
const schema={
 praias:[
  ["nome","Nome da praia","text"],["descricao","Descrição","textarea"],["imagem","Foto principal","image"],
  ["endereco","Localização/endereço","text"],["acesso","Como chegar / acesso","text"],["horario","Horário/regras de acesso","text"],
  ["estrutura","Estrutura disponível","textarea"],["estacionamento","Estacionamento","text"],["acessibilidade","Acessibilidade","textarea"],
  ["banho","Condições para banho","text"],["esportes","Esportes permitidos/indicados","text"],["pet","Regras para pets","text"],
  ["permitido","O que pode fazer","tags"],["proibido","O que não pode fazer","tags"],["observacoes","Observações importantes","textarea"]
 ],
 restaurantes:[
  ["nome","Nome do restaurante","text"],["categoria","Categoria","text"],["descricao","Descrição","textarea"],["imagem","Foto principal","image"],
  ["endereco","Endereço","text"],["telefone","Telefone","text"],["whatsapp","WhatsApp","text"],["instagram","Instagram","text"],["site","Site","text"],
  ["horario","Horário de funcionamento","text"],["faixa_preco","Faixa de preço","text"],["cozinha","Tipo de cozinha","text"],
  ["servicos","Serviços/recursos","tags"],["acessibilidade","Acessibilidade","textarea"],["delivery","Delivery","text"],["reservas","Reservas","text"],["observacoes","Observações","textarea"]
 ],
 hoteis:[
  ["nome","Nome do hotel/pousada","text"],["categoria","Categoria","text"],["descricao","Descrição","textarea"],["imagem","Foto principal","image"],
  ["endereco","Endereço","text"],["telefone","Telefone","text"],["whatsapp","WhatsApp","text"],["instagram","Instagram","text"],["site","Site","text"],
  ["checkin","Check-in","text"],["checkout","Check-out","text"],["faixa_diaria","Faixa de diária","text"],["acomodacoes","Tipos de acomodação","text"],
  ["comodidades","Comodidades","tags"],["acessibilidade","Acessibilidade","textarea"],["pet","Aceita pets","text"],["estacionamento","Estacionamento","text"],
  ["cafe_manha","Café da manhã","text"],["piscina","Piscina","text"],["observacoes","Observações","textarea"]
 ],
 pontos:[
  ["nome","Nome do ponto turístico","text"],["categoria","Categoria","text"],["descricao","Descrição","textarea"],["imagem","Foto principal","image"],
  ["endereco","Endereço/localização","text"],["horario","Horário","text"],["telefone","Telefone","text"],["site","Site","text"],
  ["acessibilidade","Acessibilidade","textarea"],["entrada","Entrada/ingresso","text"],["observacoes","Observações","textarea"]
 ],
 noticias:[
  ["titulo","Título da notícia","text"],["subtitulo","Subtítulo/linha fina","text"],["descricao","Texto/resumo da notícia","textarea"],["imagem","Imagem de capa","image"],
  ["secretaria","Secretaria responsável","text"],["assunto","Sobre o que é a notícia?","text"],["tags","Tags (separe por vírgulas)","tags"],
  ["autor","Autor","text"],["data_publicacao","Data de publicação","date"],["status","Status","select","publicado|rascunho|arquivado"],
  ["destaque","Destacar na página inicial?","checkbox"]
 ],
 eventos:[
  ["titulo","Nome do evento","text"],["descricao","Descrição completa","textarea"],["imagem","Imagem do evento","image"],
  ["categoria","Categoria do evento","text"],["data_inicio","Data de início","date"],["hora_inicio","Hora de início","time"],
  ["data_fim","Data de término","date"],["hora_fim","Hora de término","time"],["local","Local","text"],["endereco","Endereço","text"],
  ["ingresso","Entrada/ingresso","text"],["link","Link oficial/inscrições","text"],["organizacao","Organização/secretaria","text"],
  ["contato","Contato","text"],["tags","Tags (separe por vírgulas)","tags"],["status","Status","select","publicado|rascunho|arquivado"],
  ["destaque","Destacar na agenda?","checkbox"]
]};
async function api(url,opt={}){const r=await fetch(url,opt);let d={};try{d=await r.json()}catch{}if(!r.ok)throw new Error(d.error||"Erro");return d}
const areaDescriptions={
 praias:"Fotos, regras, estrutura e tudo que pode ou não pode fazer.",
 restaurantes:"Dados, contatos, horários, cozinha, serviços e fotos.",
 hoteis:"Acomodações, comodidades, contatos, horários, fotos e informações.",
 pontos:"Informações turísticas, acesso, horários, ingresso e fotos.",
 noticias:"Publicação, secretaria, assunto, tags, capa e status.",
 eventos:"Agenda exclusiva: datas, horários, local, ingresso, organização e tags."
};
function renderAreas(){
 const icons={praias:'🏖️',restaurantes:'🍽️',hoteis:'🏨',pontos:'📍',noticias:'📰',eventos:'🎭'};
 areaGrid.innerHTML=Object.keys(labels).map(k=>`<button class="area-card ${state.type===k?'active':''}" onclick="chooseArea('${k}')"><div class="area-icon">${icons[k]}</div><div><b>${labels[k]}</b><strong>${state.data?.[k]?.length||0}</strong><p>${areaDescriptions[k]}</p></div></button>`).join('');
}
function chooseArea(type){state.type=type;state.selected=null;currentTitle.textContent=labels[type];renderAreas();tabs.innerHTML=Object.keys(labels).map(k=>`<button class="tab ${k===type?'active':''}" onclick="chooseArea('${k}')">${labels[k]} <span>(${state.data[k]?.length||0})</span></button>`).join('');clearEditor();renderList()}
async function initEventPage(){state.data=await api('/api/data');state.type="eventos";currentTitle&&(currentTitle.textContent="Eventos");renderList();}
async function initAreaPage(type){state.type=type||window.ADMIN_TYPE||"praias";state.selected=null;state.data=await api("/api/data");syncAreaUI();renderList();}
function syncAreaUI(){
 const t=state.type||"praias";
 const label=labels[t]||"Conteúdo";
 const title=document.getElementById("areaPageTitle"); if(title) title.textContent=label;
 const editor=document.getElementById("editorAreaLabel"); if(editor) editor.textContent=label;
 const add=document.getElementById("addButton"); if(add) add.textContent="+ Adicionar "+singular[t];
 const search=document.getElementById("search"); if(search) search.placeholder="Pesquisar em "+label.toLowerCase()+"...";
 const desc=document.getElementById("areaPageDescription"); if(desc) desc.textContent=areaDescriptions[t]||"Gerencie os cadastros desta área.";
}
async function protect(){const m=await api("/api/me");if(!m.logged){location.href="login.html";return}document.querySelectorAll("#who").forEach(x=>x.textContent=m.user);return m}
async function logout(){await api("/api/logout",{method:"POST"});location.href="login.html"}
document.getElementById("loginForm")?.addEventListener("submit",async e=>{e.preventDefault();error.textContent="";try{await api("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user:user.value,pass:pass.value})});location.href="index.html"}catch(x){error.textContent=x.message}});

async function loadDashboard(){
 state.data=await api("/api/data");
 const keys=Object.keys(labels);
 stats.innerHTML=keys.map(k=>`<div class="stat-card"><small>${labels[k]}</small><strong>${state.data[k]?.length||0}</strong></div>`).join("");
 quick.innerHTML=`<div class="quick-grid">${keys.map(k=>`<a class="quick-card link-card" href="${k}.html"><b>${state.data[k]?.length||0}</b><span>${labels[k]} — editar tudo</span></a>`).join("")}</div>`;
 if(document.getElementById("allCatalog")){ document.getElementById("allCatalog").innerHTML=keys.map(k=>`<div class="catalog-block"><h3>${labels[k]} (${state.data[k]?.length||0})</h3><div class="catalog-lines">${(state.data[k]||[]).map(x=>`<div class="catalog-line"><img src="${x.imagem||"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=160&q=70"}"><span>${esc(x.nome||x.titulo||"Sem nome")}</span><a href="${k}.html" class="catalog-edit">Editar</a></div>`).join("")||"<span class=\"muted\">Nenhum cadastro.</span>"}</div></div>`).join(""); }
}
async function initContent(){
 state.data=await api("/api/data");
 renderAreas();
 tabs.innerHTML=Object.keys(labels).map(k=>`<button class="tab ${k===state.type?'active':''}" onclick="chooseArea('${k}')">${labels[k]} <span>(${state.data[k]?.length||0})</span></button>`).join("");
 currentTitle.textContent=labels[state.type];
 renderList();
}
function selectType(type,el){chooseArea(type)}
function renderList(){
 const q=(document.getElementById("search")?.value||"").toLowerCase();
 const arr=(state.data[state.type]||[]).filter(x=>Object.values(x).flatMap(v=>Array.isArray(v)?v:[v]).some(v=>String(v??"").toLowerCase().includes(q)));
 count.textContent=`${arr.length} itens`;
 list.innerHTML=arr.map(x=>`<article class="item-row ${String(state.selected)===String(x.id)?"selected":""}" onclick="editItem('${x.id}')"><div class="item-photo"><img src="${x.imagem||"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=78"}"></div><div class="item-info"><span>${labels[state.type]}</span><b>${esc(x.nome||x.titulo)}</b></div></article>`).join("")||`<p class="muted">Nenhum cadastro encontrado.</p>`;
}
function editItem(id){
 const x=(state.data[state.type]||[]).find(v=>String(v.id)===String(id));if(!x)return;
 state.selected=id;editorTitle.textContent="Editar: "+(x.nome||x.titulo);fieldsEl(x);renderList();
}
function newItem(){if(!state.type){alert("Escolha uma área primeiro.");return}state.selected=null;syncAreaUI();editorTitle.textContent="Novo "+singular[state.type];fieldsEl({});document.getElementById("id").value="";window.scrollTo({top:0,behavior:"smooth"})}
function clearEditor(){state.selected=null;editorTitle.textContent="Selecione um cadastro";document.getElementById("fields").innerHTML="";document.getElementById("msg").textContent=""}
function fieldsEl(x){
 const currentSchema=schema[state.type]||schema.praias;
 document.getElementById("fields").innerHTML=currentSchema.map(([key,label,type,opts])=>{
  const v=x[key];
  if(type==="image")return `<div class="field"><label>${label}</label><div class="upload-box"><img id="imagePreview" src="${v||"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=78"}"><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onchange="uploadImage(this)"><input id="f_${key}" value="${esc(v||"")}" placeholder="ou cole a URL da imagem" style="margin-top:7px"></div></div>`;
  if(type==="textarea")return `<div class="field"><label>${label}</label><textarea id="f_${key}">${esc(v||"")}</textarea></div>`;
  if(type==="tags")return `<div class="field"><label>${label}</label><input id="f_${key}" value="${esc(Array.isArray(v)?v.join(", "):(v||""))}" placeholder="Ex.: turismo, saúde, praias"></div>`;
  if(type==="select")return `<div class="field"><label>${label}</label><select id="f_${key}">${opts.split("|").map(o=>`<option ${v===o?"selected":""}>${o}</option>`).join("")}</select></div>`;
  if(type==="checkbox")return `<div class="check-field"><input id="f_${key}" type="checkbox" ${v?"checked":""}><label for="f_${key}">${label}</label></div>`;
  return `<div class="field"><label>${label}</label><input id="f_${key}" type="${type}" value="${esc(v||"")}"></div>`;
 }).join("");
}
async function uploadImage(input){
 if(!input.files[0])return;
 const fd=new FormData();fd.append("imagem",input.files[0]);
 try{const r=await api("/api/upload",{method:"POST",body:fd});document.getElementById("f_imagem").value=r.url;imagePreview.src=r.url;msg.className="success";msg.textContent="Imagem enviada. Clique em Salvar."}catch(e){msg.className="error";msg.textContent=e.message}
}
function readVal(key,type){
 const el=document.getElementById("f_"+key);
 if(type==="checkbox")return !!el.checked;
 if(type==="tags")return el.value.split(",").map(s=>s.trim()).filter(Boolean);
 return el.value;
}
async function saveItem(e){
 e.preventDefault();const obj={};
 (schema[state.type]||schema.praias).forEach(([key,,type])=>obj[key]=readVal(key,type));
 if(!obj.nome&&!obj.titulo){msg.className="error";msg.textContent="Informe o nome ou título.";return}
 try{
  if(state.selected)await api(`/api/${state.type}/${state.selected}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(obj)});
  else await api(`/api/${state.type}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(obj)});
  state.data=await api("/api/data");msg.className="success";msg.textContent="Salvo com sucesso.";renderList();
 }catch(x){msg.className="error";msg.textContent=x.message}
}
async function deleteSelected(){
 if(!state.selected||!confirm("Excluir este cadastro?"))return;
 try{await api(`/api/${state.type}/${state.selected}`,{method:"DELETE"});state.data=await api("/api/data");clearEditor();renderList()}catch(e){msg.className="error";msg.textContent=e.message}
}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
