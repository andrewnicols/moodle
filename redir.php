<?php

use GuzzleHttp\Psr7\ServerRequest;

require_once('config.php');

$PAGE->set_context(\context_system::instance());
$PAGE->set_url('/redir.php');

$request = ServerRequest::fromGlobals();
$responsehandler = new \core\response_handler();

// xdebug_break();
$params = $request->getQueryParams();
if (array_key_exists('code', $params)) {
    switch ($params['code']) {
        case 303:
            $responsehandler->send(new \core\content\redirect_response(
                url: new moodle_url($params['target']),
                message: 'Redirecting you now',
                delay: -1,
            ));
            break;
        case 403:
            $responsehandler->send(new \core\content\access_denied_response());
            break;
        case 404:
            $responsehandler->send(new \core\content\not_found_response());
            break;
    }
}
