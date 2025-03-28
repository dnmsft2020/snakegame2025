# Snake Game with Score Tracking

A web-based Snake Game with persistent score tracking using a simple file-based system.

## Features
- Classic snake gameplay with multiple difficulty levels
- Real-time score tracking
- Global leaderboard with top 100 scores
- Automatic score updates every 30 seconds
- Multiple difficulty levels with score multipliers

## Setup

### Requirements
- Any web server with PHP support (Apache, Nginx, etc.)
- No database required!

### Installation
1. Upload all files to your web server
2. Make sure the directory has write permissions for scores.json
3. Access the game through your web browser

## File Structure
- `index.html` - Main game interface
- `gameData.js` - Score management and game data handling
- `scores_handler.php` - Simple PHP score handler
- `scores.json` - Score storage file (created automatically)

## Score System
- Scores are automatically saved when games end
- Leaderboard updates every 30 seconds
- Top 100 scores are maintained
- Difficulty multipliers: Easy (x1), Medium (x1.5), Hard (x2)

## Security Notes
- Ensure your web server is properly configured
- The scores.json file should be writable by PHP
- Consider adding rate limiting for production use
