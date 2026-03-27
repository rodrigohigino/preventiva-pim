import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// -------------------
// Login
// -------------------
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;
  if (email === 'admin@teste.com' && senha === '123456') {
    res.json({ token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

// -------------------
// Dashboard
// -------------------
app.get('/api/dashboard', (req, res) => {
  res.json({ mensagem: 'Bem-vindo ao Dashboard!', data: new Date() });
});

// -------------------
// Equipamentos
// -------------------
let equipamentos = [
  { id: 1, nome: 'Compressor' },
  { id: 2, nome: 'Gerador' }
];

app.get('/api/equipamentos', (req, res) => res.json(equipamentos));

app.post('/api/equipamentos', (req, res) => {
  const novo = { id: Date.now(), ...req.body };
  equipamentos.push(novo);
  res.json(novo);
});

app.delete('/api/equipamentos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  equipamentos = equipamentos.filter(e => e.id !== id);
  res.json({ message: 'Equipamento removido' });
});

// -------------------
// Planos
// -------------------
let planos = [
  { id: 1, nome: 'Plano Preventiva Básico' },
  { id: 2, nome: 'Plano Premium' }
];

app.get('/api/planos', (req, res) => res.json(planos));

app.post('/api/planos', (req, res) => {
  const novo = { id: Date.now(), ...req.body };
  planos.push(novo);
  res.json(novo);
});

app.delete('/api/planos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  planos = planos.filter(p => p.id !== id);
  res.json({ message: 'Plano removido' });
});

// -------------------
// Start server
// -------------------
app.listen(3000, () => {
  console.log('Backend rodando em http://localhost:3000');
});
