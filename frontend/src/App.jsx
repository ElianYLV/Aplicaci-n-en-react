import { useState } from 'react'
import './App.css'

function App() {

  // 🔐 LOGIN
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token'))
  const logout = () => {
  localStorage.removeItem('token')
  setToken(null)
}

  // 🔍 POKEMON
  const [name, setName] = useState('')
  const [pokemon, setPokemon] = useState(null)
  const [error, setError] = useState('')

  // ⭐ FAVORITOS
  const [favoritos, setFavoritos] = useState([])

  // ======================
  // LOGIN
  // ======================
  const login = async () => {
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!res.ok) throw new Error()

      const data = await res.json()
      localStorage.setItem('token', data.token)
      setToken(data.token)
    } catch {
      alert('Login incorrecto')
    }
  }

  // ======================
  // BUSCAR POKEMON
  // ======================
  const buscar = async () => {
    setError('')
    setPokemon(null)

    try {
      const res = await fetch(`http://localhost:3000/pokemon/${name}`)
      if (!res.ok) throw new Error()

      const data = await res.json()
      setPokemon(data)
    } catch {
      setError('No encontrado')
    }
  }

  // ======================
  // FAVORITOS
  // ======================
const cargarFavoritos = async () => {
  const res = await fetch('http://localhost:3000/favorites', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const data = await res.json()
  setFavoritos(data)
}

const agregarFavorito = async () => {
  await fetch('http://localhost:3000/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      pokemon_id: pokemon.id,
      pokemon_name: pokemon.nombre
    })
  })
  alert('Agregado a favoritos ⭐')
}

  // ======================
  // RENDER
  // ======================
  return (
    <div className="container">

      {/* LOGIN */}
      {!token && (
        <div className="login">
          <h2>Login</h2>

          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button onClick={login}>Entrar</button>
        </div>
      )}

      {/* POKEDEX */}
      {token && (
        <>
          <h1>Pokédex</h1>
          <button onClick={logout}>Salir</button>

          <button onClick={cargarFavoritos}>Ver favoritos</button>

          {favoritos.map(p => (
            <p key={p.pokemon_id}>⭐ {p.pokemon_name}</p>
          ))}

          <input
            placeholder="Nombre del Pokémon"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <button onClick={buscar}>Buscar</button>

          {error && <p>{error}</p>}

          {pokemon && (
            <div className="card">
              <h2>{pokemon.nombre}</h2>
              <img src={pokemon.imagen} alt={pokemon.nombre} />

              <p><strong>Tipos:</strong> {pokemon.tipos.join(', ')}</p>

              <button onClick={agregarFavorito}>
                ⭐ Favorito
              </button>

              <h3>Stats</h3>
              {pokemon.stats.map(s => (
                <div key={s.nombre} className="stat">
                  <span>{s.nombre}</span>
                  <div className="bar">
                    <div
                      className="fill"
                      style={{ width: `${s.valor}%` }}
                    />
                  </div>
                  <span>{s.valor}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default App
