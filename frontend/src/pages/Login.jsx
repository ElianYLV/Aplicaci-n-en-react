import { useState } from "react";

export default function Login({ onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");

  const login = async () => {

    try {

      const res = await fetch("http://localhost:8000/api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await res.json();

      if (data.status === "ok") {
        onLogin(true);
      } else {
        setAlert("Usuario o contraseña incorrectos");
      }

    } catch (error) {
      setAlert("Error conectando con el servidor");
    }

  };

  return (

    <div className="p-10 max-w-md mx-auto">

      <h1 className="text-2xl font-bold mb-4">
        Login
      </h1>

      {alert && (
        <div className="bg-rose-600 text-white p-2 mb-4 rounded shadow-sm">
          {alert}
        </div>
      )}

      <input
        className="border p-2 w-full mb-3"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="border p-2 w-full mb-3"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={login}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Iniciar sesión
      </button>

    </div>

  );
}