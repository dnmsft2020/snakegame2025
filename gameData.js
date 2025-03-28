class GameDataManager {
    constructor() {
        this.scores = JSON.parse(localStorage.getItem('snakeGameScores')) || [];
        this.colors = ['Red', 'Green', 'Blue', 'Purple', 'Orange', 'Yellow', 'Pink', 'Cyan', 'Lime', 'Teal'];
        this.objects = ['Box', 'Star', 'Leaf', 'Circle', 'Heart', 'Diamond', 'Cloud', 'Wave', 'Sun', 'Moon'];
        this.playerCount = this.getHighestPlayerNumber();
    }

    getHighestPlayerNumber() {
        const playerNumbers = this.scores
            .map(score => {
                const match = score.username.match(/^Player (\d+)$/);
                return match ? parseInt(match[1]) : 0;
            })
            .filter(num => !isNaN(num));

        return playerNumbers.length > 0 ? Math.max(...playerNumbers) : 0;
    }

    getNextPlayerNumber() {
        return this.playerCount + 1;
    }

    clearScores() {
        this.scores = [];
        localStorage.setItem('snakeGameScores', JSON.stringify(this.scores));
    }

    generateRandomPlayerName() {
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const object = this.objects[Math.floor(Math.random() * this.objects.length)];
        return `Player ${color}${object}`;
    }

    getTotalPlayers() {
        const uniquePlayers = new Set(this.scores.map(score => score.username));
        return uniquePlayers.size;
    }

    addScore(username, score, difficulty) {
        // Update player count if it's a numbered player
        const playerMatch = username.match(/^Player (\d+)$/);
        if (playerMatch) {
            const playerNum = parseInt(playerMatch[1]);
            this.playerCount = Math.max(this.playerCount, playerNum);
        }

        // Apply difficulty multipliers
        const multipliers = {
            slow: 1,
            medium: 1.5,
            fast: 2
        };
        
        const finalScore = Math.round(score * multipliers[difficulty]);
        
        this.scores.push({
            username,
            rawScore: score,
            finalScore,
            difficulty,
            timestamp: new Date().toISOString()
        });
        
        // Sort by final score and keep top 100 scores
        this.scores.sort((a, b) => b.finalScore - a.finalScore);
        this.scores = this.scores.slice(0, 100);
        
        // Save to localStorage
        localStorage.setItem('snakeGameScores', JSON.stringify(this.scores));
        
        return finalScore;
    }

    getTopScores(limit = 5) {
        return this.scores.slice(0, limit);
    }

    getScoresByDifficulty(difficulty, limit = 5) {
        return this.scores
            .filter(score => score.difficulty === difficulty)
            .slice(0, limit);
    }
}
