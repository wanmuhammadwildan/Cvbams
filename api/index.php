<?php

use Illuminate\Http\Request;

ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    require __DIR__ . '/../vendor/autoload.php';
    $app = require_once __DIR__ . '/../bootstrap/app.php';
    
    $app->handleRequest(Request::capture());
} catch (\Throwable $e) {
    http_response_code(500);
    echo "<h1>Laravel Runtime Error</h1>";
    echo "<p><strong>Message:</strong> " . $e->getMessage() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}