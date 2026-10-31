<?php
/**
 * Proxy Backend PHP para la Web API NavaSoft
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin");
header("Access-Control-Max-Age: 86400");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$backendBase = "http://143.0.250.120:86/WA_RRHHBolPago";
$endpoint = '';

if (isset($_GET['endpoint']) && !empty($_GET['endpoint'])) {
    $endpoint = '/' . ltrim($_GET['endpoint'], '/');
} else {
    $pathInfo = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '';
    if (!empty($pathInfo)) {
        $endpoint = $pathInfo;
    } else {
        $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $pos = strpos($requestUri, '/api/');
        if ($pos !== false) {
            $endpoint = substr($requestUri, $pos);
        } else {
            $endpoint = '/api';
        }
    }
}

if (substr($endpoint, 0, 4) !== '/api') {
    $endpoint = '/api' . $endpoint;
}

$targetUrl = $backendBase . $endpoint;
$rawInput = file_get_contents('php://input');

$headers = [
    'Content-Type: application/json; charset=UTF-8',
    'Accept: application/json'
];

$authHeader = null;
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
} elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
} elseif (function_exists('apache_request_headers')) {
    $reqHeaders = apache_request_headers();
    if (isset($reqHeaders['Authorization'])) {
        $authHeader = $reqHeaders['Authorization'];
    } elseif (isset($reqHeaders['authorization'])) {
        $authHeader = $reqHeaders['authorization'];
    }
}

if ($authHeader) {
    $headers[] = 'Authorization: ' . $authHeader;
}

$ch = curl_init($targetUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);

if (!empty($rawInput)) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, $rawInput);
}

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 35);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

header("Content-Type: application/json; charset=UTF-8");

if ($response === false) {
    http_response_code(502);
    echo json_encode([
        'success' => false,
        'message' => 'No se pudo conectar con el servidor central de NavaSoft: ' . $curlError
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($httpCode >= 200 && $httpCode < 600) {
    http_response_code($httpCode);
} else {
    http_response_code(200);
}

echo $response;

