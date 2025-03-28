<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// File to store scores
$scoresFile = 'scores.json';

// Initialize scores file if it doesn't exist
if (!file_exists($scoresFile)) {
    file_put_contents($scoresFile, json_encode(['scores' => []]));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Read scores
    $scores = json_decode(file_get_contents($scoresFile), true);
    echo json_encode(['success' => true, 'scores' => $scores['scores']]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get POST data
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        if (!isset($data['username']) || !isset($data['rawScore']) || 
            !isset($data['finalScore']) || !isset($data['difficulty'])) {
            throw new Exception('Missing required fields');
        }
        
        // Read current scores
        $scores = json_decode(file_get_contents($scoresFile), true);
        
        // Add new score
        $newScore = [
            'username' => $data['username'],
            'rawScore' => (int)$data['rawScore'],
            'finalScore' => (int)$data['finalScore'],
            'difficulty' => $data['difficulty'],
            'timestamp' => date('c')
        ];
        
        $scores['scores'][] = $newScore;
        
        // Sort by final score
        usort($scores['scores'], function($a, $b) {
            return $b['finalScore'] - $a['finalScore'];
        });
        
        // Keep only top 100 scores
        $scores['scores'] = array_slice($scores['scores'], 0, 100);
        
        // Save back to file
        file_put_contents($scoresFile, json_encode($scores, JSON_PRETTY_PRINT));
        
        echo json_encode(['success' => true, 'scores' => $scores['scores']]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}
