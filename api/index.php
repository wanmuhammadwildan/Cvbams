<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    putenv('VIEW_COMPILED_PATH=/tmp');
    // api/index.php
    require __DIR__ . '/../public/index.php';
} catch (\Throwable $e) {
    http_response_code(500);
    echo "<h1>Laravel Boot Error</h1>";
    echo "<pre>";
    echo "Message: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
    echo "</pre>";
    die();
}