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

// Debug middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Get all scores
app.get('/api/scores', async (req, res) => {
    try {
        console.log('Reading scores file...');
        const data = await fs.readFile('scores.json', 'utf8');
        console.log('Scores data:', data);
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading scores:', error);
        res.status(500).json({ error: 'Failed to read scores' });
    }
});

// Add new score
app.post('/api/scores', async (req, res) => {
    try {
        console.log('Received new score:', req.body);
        const { username, rawScore, finalScore, difficulty } = req.body;
        
        // Validate required fields
        if (!username || rawScore == null || finalScore == null || !difficulty) {
            console.error('Missing fields:', { username, rawScore, finalScore, difficulty });
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Read current scores
        console.log('Reading current scores...');
        const data = await fs.readFile('scores.json', 'utf8');
        const scoresData = JSON.parse(data);
        
        // Add new score
        const newScore = {
            username,
            rawScore: Number(rawScore),
            finalScore: Number(finalScore),
            difficulty,
            timestamp: new Date().toISOString()
        };
        
        console.log('Adding new score:', newScore);
        scoresData.scores.push(newScore);
        
        // Sort by final score and keep top 100
        scoresData.scores.sort((a, b) => b.finalScore - a.finalScore);
        scoresData.scores = scoresData.scores.slice(0, 100);
        
        // Write back to file
        console.log('Writing updated scores to file...');
        await fs.writeFile('scores.json', JSON.stringify(scoresData, null, 4));
        
        console.log('Score saved successfully');
        res.json({ success: true, scores: scoresData.scores });
    } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).json({ error: 'Failed to save score' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
