<?php

define('CLI_SCRIPT', true);

require_once('config.php');

$client = \core\http_client::get_client([
    // 'debug' => true,
    'ignoresecurity' => true,
]);
$response = $client->get('http://mandarin.local/redirects');
echo (string) $response->getBody() . "\n";
