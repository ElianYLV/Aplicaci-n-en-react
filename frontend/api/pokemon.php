<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");


$conn = pg_connect("
host=localhost
port=5432
dbname=Pokedex
user=postgres
password=1234
");

$method = $_SERVER['REQUEST_METHOD'];

if ($method == "GET") {

    $result = pg_query($conn, "SELECT * FROM pokemon ORDER BY num_pokedex");

    $data = [];

    while ($row = pg_fetch_assoc($result)) {
        $data[] = $row;
    }

    echo json_encode($data);
}

if ($method == "POST") {

    $input = json_decode(file_get_contents("php://input"), true);

    $nombre = $input["nombre"];
    $especie = $input["especie"];
    $altura = $input["altura"];
    $peso = $input["peso"];
    $descripcion = $input["descripcion"];

    $query = "
    INSERT INTO pokemon (nombre, especie, altura, peso, descripcion)
    VALUES ('$nombre','$especie','$altura','$peso','$descripcion')
    ";

    pg_query($conn, $query);

    echo json_encode(["status"=>"ok"]);
}