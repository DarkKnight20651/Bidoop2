// server.js
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config(); // por si necesitas PORT u otras vars de entorno

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
