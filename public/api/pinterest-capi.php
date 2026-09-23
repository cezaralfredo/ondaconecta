<?php
/**
 * Pinterest Conversions API (CAPI) Endpoint
 * Portal Onda Conecta (https://ondaconecta.com.br)
 * 
 * Envia eventos de conversão Server-Side para a API v5 do Pinterest
 * com suporte a desduplicação automática via event_id integrado com o Pinterest Tag.
 */

declare(strict_types=1);

// Apenas aceita requisições POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Method not allowed. Only POST is supported.']);
    exit;
}

// Configurações da API do Pinterest
$adAccountId = '549770820233';
$defaultTokenEncoded = 'cGluYV9BSUEyUkZBV0FDWTRVQUFBR0FBTEdCT1hWVVE0NUlBQkFBQUFBQ1hHVlVXNjdWM0FMVDdSTkJUSFVFS003SVNTRENJWFNZWVc2QlhJSUtRREw1QjM0SU9FNjZRWkpCSUE=';
$accessToken = getenv('PINTEREST_ACCESS_TOKEN') ?: base64_decode($defaultTokenEncoded);
$apiUrl = "https://api.pinterest.com/v5/ad_accounts/{$adAccountId}/events";

// Obter e decodificar corpo da requisição JSON
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

if (!is_array($input)) {
    $input = [];
}

// Mapeamento e sanitização do nome do evento
$eventNameRaw = strtolower(trim((string)($input['event_name'] ?? 'page_visit')));
$validEvents = [
    'page_visit'     => 'page_visit',
    'page'           => 'page_visit',
    'pagevisit'      => 'page_visit',
    'view_category'  => 'view_category',
    'search'         => 'search',
    'add_to_cart'    => 'add_to_cart',
    'checkout'       => 'checkout',
    'watch_video'    => 'watch_video',
    'signup'         => 'signup',
    'lead'           => 'lead',
    'custom'         => 'custom'
];
$eventName = $validEvents[$eventNameRaw] ?? 'custom';

// Identificador único para desduplicação (deve coincidir com o event_id do pintrk client-side)
$eventId = !empty($input['event_id']) 
    ? preg_replace('/[^a-zA-Z0-9_\-]/', '', (string)$input['event_id']) 
    : 'pin_' . time() . '_' . bin2hex(random_bytes(4));

// URL de origem do evento
$eventSourceUrl = !empty($input['event_source_url']) 
    ? filter_var((string)$input['event_source_url'], FILTER_SANITIZE_URL) 
    : ($_SERVER['HTTP_REFERER'] ?? 'https://ondaconecta.com.br/');

// Identificar IP real do cliente com tolerância a proxies/CDNs
$clientIp = '';
$ipHeaders = [
    'HTTP_CF_CONNECTING_IP',
    'HTTP_X_FORWARDED_FOR',
    'HTTP_X_REAL_IP',
    'REMOTE_ADDR'
];
foreach ($ipHeaders as $header) {
    if (!empty($_SERVER[$header])) {
        $ipList = explode(',', (string)$_SERVER[$header]);
        $firstIp = trim($ipList[0]);
        if (filter_var($firstIp, FILTER_VALIDATE_IP)) {
            $clientIp = $firstIp;
            break;
        }
    }
}
if (empty($clientIp)) {
    $clientIp = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
}

// User-Agent do cliente
$clientUserAgent = !empty($_SERVER['HTTP_USER_AGENT']) 
    ? substr((string)$_SERVER['HTTP_USER_AGENT'], 0, 500) 
    : 'Mozilla/5.0 (compatible; OndaConectaBot/1.0)';

// Gerenciamento de e-mails criptografados (SHA-256) para casamento de audiência
$emails = [
    '2bbc7d3c4aa09982f805eb0de75a0b9dee7dba10338297794dcde89767510358' // gerandoparceria@gmail.com
];

if (!empty($input['email']) && is_string($input['email'])) {
    $cleanEmail = strtolower(trim($input['email']));
    if (filter_var($cleanEmail, FILTER_VALIDATE_EMAIL)) {
        $userHash = hash('sha256', $cleanEmail);
        if (!in_array($userHash, $emails, true)) {
            array_unshift($emails, $userHash);
        }
    }
}

// Dados personalizados adicionais
$customData = !empty($input['custom_data']) && is_array($input['custom_data']) 
    ? $input['custom_data'] 
    : [];

// Montagem do payload oficial da API v5 do Pinterest
$eventData = [
    'event_name' => $eventName,
    'action_source' => 'web',
    'event_time' => time(),
    'event_id' => $eventId,
    'event_source_url' => $eventSourceUrl,
    'user_data' => [
        'em' => $emails,
        'client_ip_address' => $clientIp,
        'client_user_agent' => $clientUserAgent
    ]
];

if (!empty($customData)) {
    $eventData['custom_data'] = $customData;
}

$payload = [
    'data' => [$eventData]
];

// Envio via cURL para o endpoint de conversões do Pinterest
$ch = curl_init($apiUrl);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 4,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $accessToken,
        'Content-Type: application/json',
        'Accept: application/json'
    ],
    CURLOPT_SSL_VERIFYPEER => true
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Resposta JSON para o navegador
header('Content-Type: application/json; charset=utf-8');

if ($httpCode >= 200 && $httpCode < 300) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'event_id' => $eventId,
        'event_name' => $eventName,
        'pinterest_response' => json_decode((string)$response, true)
    ]);
} else {
    // Resposta de erro não fatal para não interromper a navegação do usuário
    http_response_code($httpCode > 0 ? $httpCode : 500);
    echo json_encode([
        'success' => false,
        'event_id' => $eventId,
        'error' => $curlError ?: 'Pinterest API error',
        'status_code' => $httpCode,
        'raw' => json_decode((string)$response, true)
    ]);
}
