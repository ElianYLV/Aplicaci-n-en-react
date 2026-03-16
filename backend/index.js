require('dotenv').config({ path: './envidia.env' });

const cors = require('cors');
const express = require('express');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const favoritos = {} 
const app = express();
const pool = require('./bd');

app.use(express.json());
app.use(cors());


const auth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};


app.post('/auth/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1,$2) RETURNING id,email',
      [email, hash]
    );

    res.json(result.rows[0]);
  } catch {
    res.status(400).json({ error: 'Usuario ya existe' });
  }
});


app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    'SELECT * FROM users WHERE email=$1',
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const user = result.rows[0];
  const ok = await bcrypt.compare(password, user.password);

  if (!ok) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});


app.get('/pokemon', async (req, res) => {
  const { name, type } = req.query;

  let list = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
  let results = list.data.results;

  if (name) {
    results = results.filter(p =>
      p.name.includes(name.toLowerCase())
    );
  }

  if (type) {
    const typeRes = await axios.get(
      `https://pokeapi.co/api/v2/type/${type}`
    );
    const byType = typeRes.data.pokemon.map(p => p.pokemon.name);
    results = results.filter(p => byType.includes(p.name));
  }

  res.json(results);
});



app.get('/pokemon/:name', async (req, res) => {
  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${req.params.name}`
    );

    res.json({
      id: response.data.id,
      nombre: response.data.name,
      tipos: response.data.types.map(t => t.type.name),
      stats: response.data.stats.map(s => ({
        nombre: s.stat.name,
        valor: s.base_stat
      })),
      imagen: response.data.sprites.front_default
    });
  } catch {
    res.status(404).json({ error: 'No encontrado' });
  }
});



app.get('/pokemon/:id/evolution', async (req, res) => {
  const species = await axios.get(
    `https://pokeapi.co/api/v2/pokemon-species/${req.params.id}`
  );

  const evo = await axios.get(species.data.evolution_chain.url);
  res.json(evo.data.chain);
});



app.get('/regions', async (req, res) => {
  const regions = await axios.get(
    'https://pokeapi.co/api/v2/region'
  );
  res.json(regions.data.results);
});



app.post('/favorites', auth, async (req, res) => {
  const { pokemon_id, pokemon_name } = req.body;
  const user_id = req.user.id;

  try {
    await pool.query(
      'INSERT INTO favorites (user_id, pokemon_id, pokemon_name) VALUES ($1,$2,$3)',
      [user_id, pokemon_id, pokemon_name]
    );
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: 'Ya existe o error' });
  }
});

app.get('/favorites', auth, async (req, res) => {
  const user_id = req.user.id;

  const result = await pool.query(
    'SELECT pokemon_id, pokemon_name FROM favorites WHERE user_id=$1',
    [user_id]
  );

  res.json(result.rows);
});

app.delete('/favorites/:pokemonId', auth, async (req, res) => {
  const user_id = req.user.id;
  const { pokemonId } = req.params;

  await pool.query(
    'DELETE FROM favorites WHERE user_id=$1 AND pokemon_id=$2',
    [user_id, pokemonId]
  );

  res.json({ ok: true });
});


app.listen(process.env.PORT, () => {
  console.log(`Servidor activo en http://localhost:${process.env.PORT}`);
});


