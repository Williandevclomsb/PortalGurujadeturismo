PORTAL GUARUJÁ 5.3 — NODE.JS

NOVO PAINEL
- Notícias têm campos separados para: secretaria responsável, assunto, tags, autor, data, status, destaque, título, subtítulo, resumo/texto e capa.
- Eventos têm área totalmente separada, com: categoria, datas, horários, local, endereço, ingresso, link, organização/secretaria, contato, tags, status, destaque e imagem.
- Hotéis/pousadas têm campos padrão: endereço, telefone, WhatsApp, Instagram, site, check-in/out, diária, acomodações, comodidades, acessibilidade, pets, estacionamento, café, piscina e observações.
- Restaurantes têm: endereço, telefone, WhatsApp, Instagram, site, horário, faixa de preço, cozinha, serviços, acessibilidade, delivery, reservas e observações.
- Praias têm: localização, acesso, horário/regras, estrutura, estacionamento, acessibilidade, banho, esportes, pets, o que pode, o que não pode e observações.
- O upload de imagens é feito pelo próprio painel e salva em /uploads.
- O conteúdo fica em /data/db.json.

LOGIN
Setur.Noticia / Setur.Turismo
ViniciusCosta / estagiariosetur

EXECUTAR
npm install
npm start
http://localhost:3000
http://localhost:3000/admin/

PRODUÇÃO
Antes de publicar, use SESSION_SECRET forte, HTTPS, banco de dados e senhas com hash.

CORREÇÃO V5.4
- O editor agora é contextual: cada área usa seu próprio schema e nunca deve exibir campos de outra área.
- Gerenciar tudo permite escolher Praia, Restaurante, Hotel, Ponto turístico, Notícia ou Evento antes de adicionar.
- Eventos têm editor e página pública separados.
- Cache busting do admin atualizado para v5.3.
