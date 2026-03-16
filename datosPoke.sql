CREATE TABLE pokemon (
    num_pokedex SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    especie VARCHAR(100),
    altura VARCHAR(10),
    peso VARCHAR(10),
    descripcion TEXT
);

	INSERT INTO pokemon (nombre, especie, altura, peso, descripcion) VALUES
('Sprigatito', 'Pokémon Gato Planta', '0.4 m', '4.1 kg', 'Su pelaje verde libera un aroma dulce que calma a quienes lo huelen. Le encanta ser el centro de atención.');


CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

INSERT INTO usuarios (email, password)
VALUES ('1234', '1234');

CREATE TABLE pokemongen1 (
    num_pokedex SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    especie VARCHAR(100),
    altura VARCHAR(10),
    peso VARCHAR(10),
    descripcion TEXT,
    generacion INT DEFAULT 1
);

INSERT INTO pokemongen1 (nombre, especie, altura, peso, descripcion) VALUES
('Bulbasaur', 'Pokémon Semilla', '0.7 m', '6.9 kg', 'Tiene una semilla en el lomo desde que nace.');
