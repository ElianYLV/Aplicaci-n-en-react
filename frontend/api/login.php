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

$email = $input["email"];
$password = $input["password"];

$query = "SELECT * FROM usuarios WHERE email='$email' AND password='$password'";

$result = pg_query($conn, $query);

if (pg_num_rows($result) > 0) {
    echo json_encode(["status" => "ok"]);
} else {
    echo json_encode(["status" => "error"]);
}