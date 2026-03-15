

<?php
include 'bd.php';
?>

<link rel="stylesheet" href="public/css/bootstrap.min.css">

<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="public/css/estilo.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pokedex</title>
      <link rel="icon" type="image/png" href="pokeball.png">

        <style>
    body, html {
      height: 100%;
      margin: 0;
    }

    .bg-gif {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      object-fit: cover;
    }

    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
      text-shadow: 2px 2px 4px #000;
      text-align: center;
      padding: 20px;
    }

    .content h1 {
      font-size: 3rem;
      margin-bottom: 20px;
    }

    .btn-download {
      font-size: 1.5rem;
      padding: 0.8rem 2rem;
    }
  </style>
</head>
<body>

    <img src="fondo4.jpg" class="bg-gif" alt="Fondo Pokédex">

  <div class="container text-center mt-5">
    <h1 class="text-white fw-bold mb-3">Bienvenido a la Pokédex</h1>
    <div class="card bg-dark bg-opacity-75 text-white mx-auto" style="max-width: 600px;">
      <div class="card-body">
        <h2 class="card-title">Pokédex (Generación 9)</h2>
        <p class="card-text">Explora los Pokémon de Pokémon Escarlata y Púrpura, agrega nuevos registros o elimina los que ya no quieras.</p>
      </div>
    </div>
  </div>

  <div class="container text-center mt-5">

    <form action="insertar.php" method="POST" class="bg-dark bg-opacity-75 p-4 rounded text-white">
      <div class="mb-2">
        <input type="text" name="nombre" class="form-control" placeholder="Nombre" required>
      </div>
      <div class="mb-2">
        <input type="text" name="especie" class="form-control" placeholder="Especie" required>
      </div>
      <div class="mb-2">
        <input type="text" name="altura" class="form-control" placeholder="Altura" required>
      </div>
      <div class="mb-2">
        <input type="text" name="peso" class="form-control" placeholder="Peso" required>
      </div>
      <div class="mb-3">
        <input type="text" name="descripcion" class="form-control" placeholder="Descripción" required>
      </div>
      <button type="submit" class="btn btn-primary btn-lg">Agregar Pokémon</button>
    </form>
  </div>



  <div class="container mt-5">
    <h3 class="text-white text-center mb-4">Lista de la Pokédex</h3>

    <table class="table table-striped table-dark table-hover text-center">
      <thead>
        <tr>
          <th>N° Pokédex</th>
          <th>Nombre</th>
          <th>Especie</th>
          <th>Altura</th>
          <th>Peso</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody id="tablaPokemon">
        <?php
        $conexion = conectar();
        $query = "SELECT * FROM pokemon ORDER BY num_pokedex ASC";
        $result = pg_query($conexion, $query);
        if($result){
            while ($fila = pg_fetch_assoc($result)) {
                echo "<tr>";
                echo "<td>".$fila['num_pokedex']."</td>";
                echo "<td>".$fila['nombre']."</td>";
                echo "<td>".$fila['especie']."</td>";
                echo "<td>".$fila['altura']."</td>";
                echo "<td>".$fila['peso']."</td>";
                echo "<td>".$fila['descripcion']."</td>";
                echo "<td>
            <button class='btn btn-warning btn-sm editar-btn'
                data-id='".$fila['num_pokedex']."'
                data-nombre='".$fila['nombre']."'
                data-especie='".$fila['especie']."'
                data-altura='".$fila['altura']."'
                data-peso='".$fila['peso']."'
                data-descripcion='".$fila['descripcion']."'>
                Editar
            </button>
            <form action='eliminar.php' method='POST' style='display:inline-block; margin-left:5px;'>
                <input type='hidden' name='num_pokedex' value='".$fila['num_pokedex']."'>
                <button type='submit' class='btn btn-danger btn-sm'>Eliminar</button>
            </form>
            
        </td>";
        echo "</tr>";
            }
        }
        pg_close($conexion);
        ?>
      </tbody>
    </table>
  </div>

<div class="modal fade" id="editarModal" tabindex="-1" aria-hidden="true">
<div class="modal-dialog">
<form action="modificar.php" method="POST" class="modal-content bg-dark text-white">
<div class="modal-header">
<h5 class="modal-title">Editar Pokémon</h5>
<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
</div>
<div class="modal-body">
<input type="hidden" name="num_pokedex" id="editar-id">
<input type="text" name="nombre" id="editar-nombre" class="form-control mb-2" placeholder="Nombre" required>
<input type="text" name="especie" id="editar-especie" class="form-control mb-2" placeholder="Especie" required>
<input type="text" name="altura" id="editar-altura" class="form-control mb-2" placeholder="Altura" required>
<input type="text" name="peso" id="editar-peso" class="form-control mb-2" placeholder="Peso" required>
<input type="text" name="descripcion" id="editar-descripcion" class="form-control mb-3" placeholder="Descripción" required>
</div>
<div class="modal-footer">
<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
<button type="submit" class="btn btn-success">Guardar Cambios</button>
</div>
</form>
</div>
</div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<script>
document.querySelectorAll('.editar-btn').forEach(button=>{
button.addEventListener('click', ()=>{
document.getElementById('editar-id').value = button.dataset.id;
document.getElementById('editar-nombre').value = button.dataset.nombre;
document.getElementById('editar-especie').value = button.dataset.especie;
document.getElementById('editar-altura').value = button.dataset.altura;
document.getElementById('editar-peso').value = button.dataset.peso;
document.getElementById('editar-descripcion').value = button.dataset.descripcion;
new bootstrap.Modal(document.getElementById('editarModal')).show();
});
});
</script>
</body>
</html>

<!-- 
asfasfsdsafas
asfasfasf
dfhhjhj -->