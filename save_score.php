<?php
header('Content-Type: application/json');

// Allow CORS for development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    exit();
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['scores']) || !is_array($data['scores'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid data format']);
    exit();
}

// Save scores to file
$result = file_put_contents('scores.json', json_encode(['scores' => $data['scores']], JSON_PRETTY_PRINT));

if ($result === false) {
    echo json_encode(['success' => false, 'error' => 'Failed to save scores']);
} else {
    echo json_encode(['success' => true]);
}
