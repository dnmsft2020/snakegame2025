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

class ScoreDB {
    private $db;
    
    public function __construct() {
        try {
            $this->db = new SQLite3('scores.db');
            $this->initializeDB();
        } catch (Exception $e) {
            $this->handleError('Database connection failed: ' . $e->getMessage());
        }
    }
    
    private function initializeDB() {
        $query = "CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            rawScore INTEGER NOT NULL,
            finalScore INTEGER NOT NULL,
            difficulty TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )";
        
        try {
            $this->db->exec($query);
        } catch (Exception $e) {
            $this->handleError('Table creation failed: ' . $e->getMessage());
        }
    }
    
    public function getScores() {
        try {
            $query = "SELECT * FROM scores ORDER BY finalScore DESC LIMIT 100";
            $result = $this->db->query($query);
            
            $scores = [];
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $scores[] = [
                    'username' => $row['username'],
                    'rawScore' => (int)$row['rawScore'],
                    'finalScore' => (int)$row['finalScore'],
                    'difficulty' => $row['difficulty'],
                    'timestamp' => $row['timestamp']
                ];
            }
            
            return ['success' => true, 'scores' => $scores];
        } catch (Exception $e) {
            return $this->handleError('Failed to get scores: ' . $e->getMessage());
        }
    }
    
    public function addScore($data) {
        if (!isset($data['username']) || !isset($data['rawScore']) || 
            !isset($data['finalScore']) || !isset($data['difficulty'])) {
            return $this->handleError('Missing required fields');
        }
        
        try {
            $stmt = $this->db->prepare('INSERT INTO scores (username, rawScore, finalScore, difficulty) 
                                      VALUES (:username, :rawScore, :finalScore, :difficulty)');
            
            $stmt->bindValue(':username', $data['username'], SQLITE3_TEXT);
            $stmt->bindValue(':rawScore', $data['rawScore'], SQLITE3_INTEGER);
            $stmt->bindValue(':finalScore', $data['finalScore'], SQLITE3_INTEGER);
            $stmt->bindValue(':difficulty', $data['difficulty'], SQLITE3_TEXT);
            
            $stmt->execute();
            
            return $this->getScores(); // Return updated scores list
        } catch (Exception $e) {
            return $this->handleError('Failed to add score: ' . $e->getMessage());
        }
    }
    
    private function handleError($message) {
        return ['success' => false, 'error' => $message];
    }
}

// Handle requests
$db = new ScoreDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode($db->getScores());
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    echo json_encode($db->addScore($data));
}
