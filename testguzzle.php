<?php

define('CLI_SCRIPT', true);

require_once('config.php');

$client = new \core\http_client([
    // 'debug' => true,
    'ignoresecurity' => true,
]);
$response = $client->get('http://mandarin.local/redirects');
echo (string) $response->getBody() . "\n";
