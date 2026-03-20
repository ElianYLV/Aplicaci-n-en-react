const express = require('express');
const pokemonController = require('../controllers/pokemonController');
const auth = require('../middleware/auth');

const router = express.Router();

// Rutas públicas (lectura)
router.get('/', pokemonController.getAllPokemon);
router.get('/:id', pokemonController.getPokemonById);

// Rutas protegidas (escritura)
router.post('/', auth, pokemonController.createPokemon);
router.put('/:id', auth, pokemonController.updatePokemon);
router.patch('/:id', auth, pokemonController.partialUpdatePokemon);
router.delete('/:id', auth, pokemonController.deletePokemon);

module.exports = router;
