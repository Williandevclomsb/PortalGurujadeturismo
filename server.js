const express = require("express");
const session = require("express-session");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const DB_FILE = path.join(ROOT, "data", "db.json");
const UPLOAD_DIR = path.join(ROOT, "uploads");
const IS_PROD = process.env.NODE_ENV === "production";

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(path.dirname(DB_FILE))) fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

function getUsers() {
  const raw = process.env.ADMIN_USERS_JSON;
  if (!raw) {
    if (IS_PROD) throw new Error("ADMIN_USERS_JSON não configurado em produção.");
    return {};
  }
  try {
    const users = JSON.parse(raw);
    if (!users || typeof users !== "object") throw new Error();
    return users;
  } catch {
    throw new Error("ADMIN_USERS_JSON inválido. Use um objeto JSON de usuário/senha.");
  }
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safe = Date.now() + "-" + Math.random().toString(36).slice(2, 8) + ext;
      cb(null, safe);
    }
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /image\/(jpeg|png|webp|gif)/i.test(file.mimetype);
    cb(ok ? null : new Error("Apenas imagens JPG, PNG, WEBP ou GIF."), ok);
  }
});

app.set("trust proxy", 1);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || "desenvolvimento-apenas-troque-esta-chave",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: IS_PROD,
    maxAge: 8 * 60 * 60 * 1000
  }
}));

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}
function auth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: "Não autorizado" });
  next();
}
const allowed = ["praias", "restaurantes", "hoteis", "pontos", "noticias", "eventos"];

app.use("/uploads", express.static(UPLOAD_DIR));
app.use(express.static(path.join(ROOT, "public")));

app.post("/api/login", (req, res) => {
  const { user, pass } = req.body || {};
  const users = getUsers();
  if (user && users[user] && users[user] === pass) {
    req.session.user = user;
    return res.json({ ok: true, user });
  }
  res.status(401).json({ error: "Usuário ou senha inválidos." });
});
app.post("/api/logout", (req, res) => req.session.destroy(() => res.json({ ok: true })));
app.get("/api/me", (req, res) => res.json({ logged: !!req.session.user, user: req.session.user || null }));

app.get("/api/data", (req, res) => res.json(readDB()));
app.get("/api/:type", (req, res) => {
  if (!allowed.includes(req.params.type)) return res.status(404).json({ error: "Categoria inválida" });
  const data = readDB();
  res.json(data[req.params.type] || []);
});

app.post("/api/upload", auth, upload.single("imagem"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Nenhuma imagem enviada." });
  res.json({ url: "/uploads/" + req.file.filename, filename: req.file.filename });
});

app.post("/api/:type", auth, (req, res) => {
  const type = req.params.type;
  if (!allowed.includes(type)) return res.status(404).json({ error: "Categoria inválida" });
  const data = readDB();
  const item = { ...req.body, id: Date.now() };
  if (!item.nome && item.titulo) item.nome = item.titulo;
  data[type] ||= [];
  data[type].unshift(item);
  writeDB(data);
  res.json(item);
});

app.put("/api/:type/:id", auth, (req, res) => {
  const type = req.params.type;
  if (!allowed.includes(type)) return res.status(404).json({ error: "Categoria inválida" });
  const data = readDB();
  const i = data[type].findIndex(x => String(x.id) === String(req.params.id));
  if (i < 0) return res.status(404).json({ error: "Cadastro não encontrado" });
  data[type][i] = { ...data[type][i], ...req.body, id: data[type][i].id };
  writeDB(data);
  res.json(data[type][i]);
});

app.delete("/api/:type/:id", auth, (req, res) => {
  const type = req.params.type;
  if (!allowed.includes(type)) return res.status(404).json({ error: "Categoria inválida" });
  const data = readDB();
  const before = data[type].length;
  data[type] = data[type].filter(x => String(x.id) !== String(req.params.id));
  if (data[type].length === before) return res.status(404).json({ error: "Cadastro não encontrado" });
  writeDB(data);
  res.json({ ok: true });
});

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError || err.message?.includes("imagens")) {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor." });
});

app.listen(PORT, () => console.log(`Portal Guarujá rodando em http://localhost:${PORT}`));
