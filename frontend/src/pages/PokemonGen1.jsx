import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Alert from "../components/Alert";
import Table from "../components/Table";

export default function PokemonGen1() {

  const [editId, setEditId] = useState(null);
  const [pokemons, setPokemons] = useState([]);

  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState("");

  const columns = [
    "Nombre",
    "Especie",
    "Altura",
    "Peso",
    "Descripción"
  ];

  const cargarPokemons = () => {
    fetch("http://localhost:8000/api/pokemongen1.php")
      .then(res => res.json())
      .then(data => setPokemons(data));
  };

  useEffect(() => {
    cargarPokemons();
  }, []);

  const limpiarCampos = () => {
    setNombre("");
    setEspecie("");
    setAltura("");
    setPeso("");
    setDescripcion("");
  };

  const addPokemon = async () => {

    await fetch("http://localhost:8000/api/addPokemonGen1.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombre,
        especie,
        altura,
        peso,
        descripcion
      })
    });

    limpiarCampos();
    setOpen(false);
    setAlert("Pokemon agregado");

    cargarPokemons();
  };

  const updatePokemon = async () => {

    await fetch("http://localhost:8000/api/updatePokemonGen1.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        num_pokedex: editId,
        nombre,
        especie,
        altura,
        peso,
        descripcion
      })
    });

    setEditId(null);
    limpiarCampos();
    setOpen(false);
    setAlert("Pokemon actualizado");

    cargarPokemons();
  };

  const deletePokemon = async (id) => {

    await fetch("http://localhost:8000/api/deletePokemonGen1.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        num_pokedex: id
      })
    });

    setAlert("Pokemon eliminado");
    cargarPokemons();
  };

  const editPokemon = (pokemon) => {

    setEditId(pokemon.num_pokedex);

    setNombre(pokemon.nombre);
    setEspecie(pokemon.especie);
    setAltura(pokemon.altura);
    setPeso(pokemon.peso);
    setDescripcion(pokemon.descripcion);

    setOpen(true);
  };

  return (

    <div className="p-10 bg-white/90 rounded-xl shadow-xl max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">
        Pokémon Gen 1
      </h1>

      <Alert message={alert} type="success" />

      <button
        onClick={() => {
          setEditId(null);
          limpiarCampos();
          setOpen(true);
        }}
        className="mb-4 px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition"
      >
        Agregar Pokemon
      </button>

      <Table
        columns={columns}
        data={pokemons.map(p => [
          p.nombre,
          p.especie,
          p.altura,
          p.peso,
          p.descripcion
        ])}
        onDelete={(index) =>
          deletePokemon(pokemons[index].num_pokedex)
        }
        onEdit={(index) =>
          editPokemon(pokemons[index])
        }
      />

      <Modal isOpen={open} onClose={() => setOpen(false)}>

        <h2 className="text-xl font-bold mb-4">
          {editId ? "Editar Pokemon" : "Nuevo Pokemon"}
        </h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Especie"
          value={especie}
          onChange={(e) => setEspecie(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Altura"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Peso"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
        />

        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <button
          onClick={editId ? updatePokemon : addPokemon}
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
        >
          Guardar
        </button>

      </Modal>

    </div>
  );
}