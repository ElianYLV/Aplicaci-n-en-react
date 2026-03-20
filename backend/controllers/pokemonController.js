const pool = require('../bd');

// Obtener todos los pokemones
exports.getAllPokemon = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pokemon ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener pokemon por ID
exports.getPokemonById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM pokemon WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pokemon no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear pokemon (POST)
exports.createPokemon = async (req, res) => {
  const { name, type, hp, attack, defense, speed } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: 'Nombre y tipo son requeridos' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO pokemon (name, type, hp, attack, defense, speed) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, type, hp || 0, attack || 0, defense || 0, speed || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar pokemon completo (PUT)
exports.updatePokemon = async (req, res) => {
  const { id } = req.params;
  const { name, type, hp, attack, defense, speed } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: 'Nombre y tipo son requeridos' });
  }

  try {
    const result = await pool.query(
      'UPDATE pokemon SET name = $1, type = $2, hp = $3, attack = $4, defense = $5, speed = $6 WHERE id = $7 RETURNING *',
      [name, type, hp || 0, attack || 0, defense || 0, speed || 0, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pokemon no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar parcialmente (PATCH)
exports.partialUpdatePokemon = async (req, res) => {
  const { id } = req.params;
  const allowedFields = ['name', 'type', 'hp', 'attack', 'defense', 'speed'];
  const updates = Object.keys(req.body).filter(key => allowedFields.includes(key));

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No hay campos válidos para actualizar' });
  }

  try {
    let query = 'UPDATE pokemon SET ';
    const values = [];

    updates.forEach((field, index) => {
      query += `${field} = $${index + 1}`;
      values.push(req.body[field]);
      if (index < updates.length - 1) query += ', ';
    });

    query += ` WHERE id = $${updates.length + 1} RETURNING *`;
    values.push(id);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pokemon no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar pokemon (DELETE)
exports.deletePokemon = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM pokemon WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pokemon no encontrado' });
    }

    res.json({ message: 'Pokemon eliminado', pokemon: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
