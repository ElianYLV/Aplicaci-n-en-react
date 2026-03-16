<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = pg_connect("host=localhost dbname=Pokedex user=postgres password=1234");

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["num_pokedex"];

$query = "DELETE FROM pokemongen1 WHERE num_pokedex = $id";

pg_query($conn, $query);

echo json_encode(["status" => "ok"]);

?>