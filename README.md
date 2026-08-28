# Portal Guarujá

Portal turístico e informativo com área pública e CMS administrativo em Node.js.

## Recursos

- Notícias com secretaria, assunto, tags, capa, status e destaque.
- Eventos em área separada, com agenda, local, datas, ingressos, contatos e tags.
- Cadastro completo de praias, incluindo o que pode e o que não pode fazer.
- Cadastro de restaurantes e hotéis/pousadas com informações padronizadas.
- Pontos turísticos.
- Login administrativo.
- Upload de imagens pelo painel.
- Dados iniciais em `data/db.json`.

## Estrutura

```text
portal-guaruja/
├── data/db.json
├── public/
│   ├── index.html
│   ├── noticias.html
│   ├── eventos.html
│   ├── praias.html
│   ├── restaurantes.html
│   ├── hoteis.html
│   ├── pontos.html
│   ├── css/
│   ├── js/
│   └── admin/
├── uploads/
│   └── .gitkeep
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

## Rodar localmente

Requer Node.js 20 ou superior.

```bash
npm install
```

Copie `.env.example` para `.env` e preencha as credenciais e a chave da sessão. Depois:

```bash
npm start
```

Acesse `http://localhost:3000` e o painel em `http://localhost:3000/admin/`.

### Variáveis de ambiente

- `PORT`: porta do servidor.
- `NODE_ENV`: `development` ou `production`.
- `SESSION_SECRET`: chave longa e aleatória usada pela sessão.
- `ADMIN_USERS_JSON`: objeto JSON com usuário e senha dos administradores.

**Nunca publique `.env` no GitHub.** O `.gitignore` já está configurado para ignorá-lo.

## GitHub

1. Crie um repositório no GitHub.
2. Extraia este projeto.
3. Abra o terminal na pasta.
4. Execute:

```bash
git init
git add .
git commit -m "Initial Portal Guarujá"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

Substitua o endereço do `origin` pelo seu repositório.

## Importante: GitHub não executa o Node.js

O GitHub pode armazenar o código, mas o `server.js` precisa de uma hospedagem de Node.js para ficar online. GitHub Pages não executa este backend.

Para publicar o sistema, use um serviço de hospedagem compatível com Node.js e configure as mesmas variáveis de ambiente do `.env` no painel do serviço.

## Imagens em produção

O diretório `uploads/` fica fora do Git para não transformar o repositório em armazenamento de fotos. Para produção, prefira armazenamento persistente ou um serviço de objetos/imagens. Se o servidor for efêmero, arquivos enviados localmente podem desaparecer após reinícios/deploys.

## Segurança

As credenciais não ficam mais gravadas no código do servidor. Elas devem ser configuradas por variável de ambiente.

Antes de uso público, recomenda-se também migrar o JSON para um banco de dados, usar armazenamento de imagens persistente, HTTPS e uma autenticação com senhas armazenadas com hash.
