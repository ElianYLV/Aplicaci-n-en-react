require('dotenv').config();

const cors = require('cors');
const express = require('express');

const app = express();

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const pokemonRoutes = require('./routes/pokemonRoutes');

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/pokemon', pokemonRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API Pokédex - Servidor funcionando' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});


