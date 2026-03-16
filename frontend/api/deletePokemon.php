<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$conn = pg_connect("
host=localhost
port=5432
dbname=Pokedex
user=postgres
password=1234
");

$input = json_decode(file_get_contents("php://input"), true);

$id = $input["num_pokedex"];

$query = "DELETE FROM pokemon WHERE num_pokedex=$id";

pg_query($conn, $query);

echo json_encode(["status"=>"ok"]);