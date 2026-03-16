import { useState } from "react";
import Pokemons from "./pages/Pokemons";
import PokemonGen1 from "./pages/PokemonGen1";
import Login from "./pages/Login";

export default function App() {

  const [page, setPage] = useState("pokemons");
  const [logged, setLogged] = useState(false);

  if (!logged) {
    return <Login onLogin={setLogged} />;
  }

return (

  <div
    className="min-h-screen bg-cover bg-center"
    style={{
      backgroundImage: "url('/fondo4.jpg')"
    }}
  >

    <div className="backdrop-blur-sm min-h-screen">

      <div className="p-4 bg-gray-900 text-white flex gap-4 shadow-lg">

        <button
          onClick={() => setPage("pokemons")}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Pokemons
        </button>

        <button
          onClick={() => setPage("gen1")}
          className="bg-purple-500 px-4 py-2 rounded hover:bg-purple-600"
        >
          Gen 1
        </button>

      </div>

      <div className="p-6">

        {page === "pokemons" && <Pokemons />}
        {page === "gen1" && <PokemonGen1 />}

      </div>

    </div>

  </div>

);
}