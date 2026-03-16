<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = pg_connect("host=localhost dbname=Pokedex user=postgres password=1234");

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["num_pokedex"];
$nombre = $data["nombre"];
$especie = $data["especie"];
$altura = $data["altura"];
$peso = $data["peso"];
$descripcion = $data["descripcion"];

$query = "UPDATE pokemongen1 SET
nombre='$nombre',
especie='$especie',
altura='$altura',
peso='$peso',
descripcion='$descripcion'
WHERE num_pokedex=$id";

pg_query($conn,$query);

echo json_encode(["status"=>"ok"]);