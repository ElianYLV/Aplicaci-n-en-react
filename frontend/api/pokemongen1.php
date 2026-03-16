<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = pg_connect("
host=localhost
port=5432
dbname=Pokedex
user=postgres
password=1234
");

$query = "SELECT * FROM pokemongen1 ORDER BY num_pokedex";

$result = pg_query($conn, $query);

$pokemons = [];

while ($row = pg_fetch_assoc($result)) {
    $pokemons[] = $row;
}

echo json_encode($pokemons);

?>