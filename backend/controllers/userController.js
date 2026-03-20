const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../bd');

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, created_at FROM users ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener usuario por ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT id, email, created_at FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Registrar usuario (POST)
exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ error: 'El email ya existe' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar usuario (PUT - todos los campos)
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'UPDATE users SET email = $1, password = $2 WHERE id = $3 RETURNING id, email, created_at',
      [email, hash, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ error: 'El email ya existe' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Actualizar parcialmente (PATCH - una columna)
exports.partialUpdateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  if (!email && !password) {
    return res.status(400).json({ error: 'Proporcione al menos un campo a actualizar' });
  }

  try {
    let query = 'UPDATE users SET ';
    const values = [];
    let paramCount = 1;

    if (email) {
      query += `email = $${paramCount} `;
      values.push(email);
      paramCount++;
    }

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      if (email) {
        query += ', ';
      }
      query += `password = $${paramCount} `;
      values.push(hash);
      paramCount++;
    }

    query += `WHERE id = $${paramCount} RETURNING id, email, created_at`;
    values.push(id);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ error: 'El email ya existe' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Eliminar usuario (DELETE)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, email', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
