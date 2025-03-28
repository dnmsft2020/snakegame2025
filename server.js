const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Get all scores
app.get('/api/scores', async (req, res) => {
    try {
        const data = await fs.readFile('scores.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading scores:', error);
        res.status(500).json({ error: 'Failed to read scores' });
    }
});

// Add new score
app.post('/api/scores', async (req, res) => {
    try {
        const { username, rawScore, finalScore, difficulty } = req.body;
        
        // Validate required fields
        if (!username || !rawScore || !finalScore || !difficulty) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Read current scores
        const data = await fs.readFile('scores.json', 'utf8');
        const scoresData = JSON.parse(data);
        
        // Add new score
        const newScore = {
            username,
            rawScore,
            finalScore,
            difficulty,
            timestamp: new Date().toISOString()
        };
        
        scoresData.scores.push(newScore);
        
        // Sort by final score and keep top 100
        scoresData.scores.sort((a, b) => b.finalScore - a.finalScore);
        scoresData.scores = scoresData.scores.slice(0, 100);
        
        // Write back to file
        await fs.writeFile('scores.json', JSON.stringify(scoresData, null, 4));
        
        res.json({ success: true, scores: scoresData.scores });
    } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).json({ error: 'Failed to save score' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
