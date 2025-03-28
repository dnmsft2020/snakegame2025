class GameDataManager {
    constructor() {
        this.scores = [];
        this.colors = ['Red', 'Green', 'Blue', 'Purple', 'Orange', 'Yellow', 'Pink', 'Cyan', 'Lime', 'Teal'];
        this.objects = ['Box', 'Star', 'Leaf', 'Circle', 'Heart', 'Diamond', 'Cloud', 'Wave', 'Sun', 'Moon'];
        
        // Load initial scores
        this.loadScores();
        
        // Set up periodic refresh
        setInterval(() => this.loadScores(), 30000); // Refresh every 30 seconds
    }

    async loadScores() {
        try {
            console.log('Loading scores...');
            const response = await fetch('scores_handler.php');
            const data = await response.json();
            
            if (data.success) {
                this.scores = data.scores;
                this.updateUI();
                console.log('Scores loaded successfully');
            } else {
                console.error('Error loading scores:', data.error);
            }
        } catch (error) {
            console.error('Failed to load scores:', error);
        }
    }

    updateUI() {
        if (typeof updateHighScoresList === 'function') {
            updateHighScoresList();
        }
        if (typeof updatePlayerCount === 'function') {
            updatePlayerCount();
        }
    }

    generateRandomPlayerName() {
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const object = this.objects[Math.floor(Math.random() * this.objects.length)];
        return `${color}${object}`;
    }

    getTotalPlayers() {
        const uniquePlayers = new Set(this.scores.map(score => score.username));
        return uniquePlayers.size;
    }

    async addScore(username, score, difficulty) {
        const multipliers = {
            slow: 1,
            medium: 1.5,
            fast: 2
        };
        
        const finalScore = Math.round(score * multipliers[difficulty]);
        
        try {
            console.log('Saving score...');
            const response = await fetch('scores_handler.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    rawScore: score,
                    finalScore,
                    difficulty
                })
            });

            const data = await response.json();
            if (data.success) {
                this.scores = data.scores;
                this.updateUI();
                console.log('Score saved successfully');
            } else {
                console.error('Error saving score:', data.error);
            }
        } catch (error) {
            console.error('Failed to save score:', error);
        }
        
        return finalScore;
    }

    getTopScores(limit = 100) {
        return this.scores.slice(0, limit);
    }

    getScoresByDifficulty(difficulty, limit = 100) {
        return this.scores
            .filter(score => score.difficulty === difficulty)
            .slice(0, limit);
    }
}
