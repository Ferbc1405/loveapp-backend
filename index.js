import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

/**
 * Simulación de base de datos en memoria
 * (luego lo pasamos a Firebase o Mongo)
 */
const invitations = new Map(); 
// code -> userId

const couples = new Map(); 
// userId -> partnerId

// 🔐 Generar código
function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * 1️⃣ Crear invitación
 */
app.post('/create-invite', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId requerido' });
  }

  const code = generateCode();
  invitations.set(code, userId);

  res.json({
    success: true,
    code,
  });
});

/**
 * 2️⃣ Conectar pareja con código
 */
app.post('/connect-partner', (req, res) => {
  const { userId, code } = req.body;

  if (!userId || !code) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const ownerId = invitations.get(code);

  if (!ownerId) {
    return res.status(404).json({ error: 'Código inválido o expirado' });
  }

  if (ownerId === userId) {
    return res.status(400).json({ error: 'No puedes usar tu propio código' });
  }

  couples.set(ownerId, userId);
  couples.set(userId, ownerId);

  invitations.delete(code);

  res.json({
    success: true,
    message: 'Pareja conectada ❤️',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend + Socket listo en puerto ${PORT}`);
});
