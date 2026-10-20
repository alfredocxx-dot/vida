<?php
// Servidor de App VIDA para Hostinger
$distPath = __DIR__ . '/dist';
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Si se pide un asset específico dentro de dist
$targetFile = $distPath . $requestUri;
if (file_exists($targetFile) && !is_dir($targetFile)) {
    $ext = pathinfo($targetFile, PATHINFO_EXTENSION);
    $mimeTypes = [
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon'
    ];
    if (isset($mimeTypes[$ext])) {
        header('Content-Type: ' . $mimeTypes[$ext]);
    }
    readfile($targetFile);
    exit;
}

// Por defecto servir la SPA App VIDA
if (file_exists($distPath . '/index.html')) {
    header('Content-Type: text/html; charset=UTF-8');
    readfile($distPath . '/index.html');
    exit;
}

echo "App VIDA compilada en /dist";
