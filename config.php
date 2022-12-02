<?php

$client = new http\Client;
$request = new http\Client\Request;

$request->setRequestUrl('https://restaurants-api.p.rapidapi.com/restaurants');
$request->setRequestMethod('GET');
$request->setQuery(new http\QueryString([
	'latitude' => '<REQUIRED>',
	'longitude' => '<REQUIRED>',
	'radius' => '<REQUIRED>'
]));

$request->setHeaders([
	'X-RapidAPI-Key' => '327782d2dbmshdf7303c7e63dcabp1512d4jsndbb535c3e75a',
	'X-RapidAPI-Host' => 'restaurants-api.p.rapidapi.com'
]);

$client->enqueue($request)->send();
$response = $client->getResponse();

echo $response->getBody();
?>