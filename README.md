# Snake Game with Online Scores

A web-based Snake Game with real-time score tracking and leaderboard functionality.

## Features
- Classic snake gameplay with multiple difficulty levels
- Real-time score tracking
- Global leaderboard with top 100 scores
- Automatic score updates every 30 seconds
- Multiple difficulty levels with score multipliers

## Setup

### Local Development
1. Install Node.js and npm
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser

### Production Deployment
1. Upload all files to your web server
2. Install Node.js dependencies:
   ```bash
   npm install --production
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Configure your web server (Apache/Nginx) to proxy requests to Node.js

### Server Configuration Example (Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/snake-game;
        index index.html;
        try_files $uri $uri/ =404;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## File Structure
- `index.html` - Main game interface
- `gameData.js` - Score management and game data handling
- `server.js` - Node.js server for score handling
- `scores.json` - Score storage file
- `package.json` - Project dependencies and scripts

## Score System
- Scores are automatically saved when games end
- Leaderboard updates every 30 seconds
- Top 100 scores are maintained
- Difficulty multipliers: Easy (x1), Medium (x1.5), Hard (x2)

## Security Notes
- The scores.json file should be writable by the Node.js process
- Consider implementing rate limiting for production use
- Add authentication if needed for score submission
