<?php

$origins = array_filter(array_map('trim', explode(',', env(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost,http://localhost:3000,http://127.0.0.1,http://127.0.0.1:3000'
))));

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => $origins,
    'allowed_origins_patterns' => [
        '#^https?://localhost(:\d+)?$#',
        '#^https?://127\.0\.0\.1(:\d+)?$#',
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
