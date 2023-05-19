<?php

$callbacks = [
    [
        'hook' => core\hook\example_hook::class,
        'callback' => core\local\hook_callbacks::class . '::example_hook',
        'priority' => 500,
    ],
    [
        'hook' => core\hook\example_hook::class,
        'callback' => core\local\hook_callbackss::class . '::another_example',
        'priority' => 500,
    ],
    [
        'hook' => core\hook\example_hook::class,
        'callback' => core\local\hook_callbacks::class . '::yet_another_example',
        'priority' => 500,
    ],
    [
        'hook' => core\hook\example_hook::class,
        'callback' => core\local\hook_callbacks::class . '::a_private_another_example',
        'priority' => 500,
    ],
    [
        'hook' => core\hook\example_hook::class,
        'callback' => core\local\hook_callbacks::class . '::a_protected_another_example',
        'priority' => 500,
    ],
    [
        'hook' => core\hook\missing_hook_listener::class,
        'callback' => core\local\hook_callbacks::class . '::example_hook',
        'priority' => 500,
    ],
];
