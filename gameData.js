class GameDataManager {
    constructor() {
        this.scores = [];
        this.colors = ['Red', 'Green', 'Blue', 'Purple', 'Orange', 'Yellow', 'Pink', 'Cyan', 'Lime', 'Teal'];
        this.objects = ['Box', 'Star', 'Leaf', 'Circle', 'Heart', 'Diamond', 'Cloud', 'Wave', 'Sun', 'Moon'];
        this.apiBaseUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/api'
            : '/api'; // Will use relative path in production
        
        // Load initial scores
        this.loadScores();
        
        // Set up periodic refresh
        setInterval(() => this.loadScores(), 30000); // Refresh every 30 seconds
    }

    async loadScores() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/scores`);
            if (!response.ok) throw new Error('Failed to fetch scores');
            
            const data = await response.json();
            this.scores = data.scores || [];
            this.scores.sort((a, b) => b.finalScore - a.finalScore);
            
            // Update UI if the updateHighScoresList function exists
            if (typeof updateHighScoresList === 'function') {
                updateHighScoresList();
            }
        } catch (error) {
            console.error('Error loading scores:', error);
        }
    }

    async saveScore(username, rawScore, finalScore, difficulty) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/scores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    rawScore,
                    finalScore,
                    difficulty
                })
            });

            if (!response.ok) throw new Error('Failed to save score');
            
            const result = await response.json();
            if (result.success) {
                this.scores = result.scores;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error saving score:', error);
            return false;
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
        
        // Save to server
        await this.saveScore(username, score, finalScore, difficulty);
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
