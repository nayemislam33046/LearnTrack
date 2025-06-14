<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'register'],
    
    'allowed_methods' => ['*'],
    
    // Replace '*' with your frontend URL(s)
    'allowed_origins' => ['http://localhost:5173'], // Your React/Vite frontend URL
    
    'allowed_origins_patterns' => [],
    
    'allowed_headers' => ['*'],
    
    'exposed_headers' => [],
    
    'max_age' => 0,
    
    'supports_credentials' => true, // This is crucial!
];