<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$conn = pg_connect("host=localhost dbname=Pokedex user=postgres password=1234");

$data = json_decode(file_get_contents("php://input"), true);

$nombre = $data["nombre"] ?? "";
$especie = $data["especie"] ?? "";
$altura = $data["altura"] ?? "";
$peso = $data["peso"] ?? "";
$descripcion = $data["descripcion"] ?? "";

$query = "INSERT INTO pokemongen1
(nombre, especie, altura, peso, descripcion)
VALUES
('$nombre','$especie','$altura','$peso','$descripcion')";

pg_query($conn, $query);

echo json_encode(["status" => "ok"]);

?>