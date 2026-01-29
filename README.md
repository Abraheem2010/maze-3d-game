# Maze Game - Full-Stack Web App (React + Express + SQLite)

A full-stack maze game with 3 stages and a Hall of Fame leaderboard.
Each stage measures the player's completion time, sends the result to the backend,
and the server stores only the best (fastest) record per stage.

---

## Live Demo (Render)
- Client (React): https://maze-game-2-1m4y.onrender.com
- Server (Express API): https://maze-game-1-hmxj.onrender.com

---

## Project Structure
- client/ - React frontend
- server/ - Express API + SQLite DB

---

## Local Setup
Prerequisites: Node.js 18+ and npm

### Server
```bash
cd server
npm install
npm start
```

### Client
```bash
cd client
npm install
npm start
```

Server API runs on http://localhost:3000.  
The React dev server starts on http://localhost:3000 if it's free, otherwise it will prompt to use http://localhost:3001.

If you want to bind the client explicitly to port 3001 when running both services locally, set the environment variable before `npm start`:

```bash
# PowerShell
$env:PORT=3001
npm start

# cmd.exe
set PORT=3001
npm start
```

---

## Compliance Summary (Option 3)
- **Express + SQLite backend**: `server/server.js` exposes `/api/score`, `/api/records`, and `/healthc`, validates every payload, and the SQLite helper in `server/db.js` keeps only the fastest run per stage.
- **React frontend**: `client/` hosts the SPA (Home plus Stage1/Stage2/Stage3). Each stage sends the completion time to the backend, uses HTML canvas for the maze, and `client/src/Leaderboard.js` polls `/api/records` to keep the Hall of Fame up to date.
- **Clear separation**: All non-DOM logic (validation, data storage, record comparison) runs on the server. The client handles player interaction, rendering, and displaying the polished overlays (“Well Done”, “Great Dive”, “Victory”) that delay the return to the home screen for about two seconds.
- **Multi-screen experience**: There are at least four routes (`/`, `/stage1`, `/stage2`, `/stage3`), satisfying the requirement for multiple screens.
- **Look & Feel attention**: The overlay card uses gradient backgrounds, bold typography, and a subtle pop-up animation defined in `client/src/stages/Stages.css` to deliver the UX polish the instructor asked for.
## Environment Variables
Set this only if the client is deployed separately:
```
REACT_APP_API_URL=https://your-server.onrender.com
```
If not set, the client uses the same origin and `/api/*` routes.

---

## API Endpoints
Base URL (local API): http://localhost:3000  
Base URL (Render): https://maze-game-1-hmxj.onrender.com

### `GET /api/ping`
Health check.
Response:
```json
{ "ok": true, "ts": 1700000000000 }
```

### `GET /healthc`
Lightweight health check.
Response:
```json
{ "ok": true }
```

### `GET /api/records`
Returns the leaderboard (one row per stage), sorted by stage.
Response example:
```json
[
  { "stage": 1, "name": "Ibrahim", "time": 12.34 },
  { "stage": 2, "name": "Someone", "time": 18.21 }
]
```

### `POST /api/score`
Updates the best record for a stage (only if the new time is faster).
Request body:
```json
{ "stage": 1, "name": "Ibrahim", "time": 12.34 }
```
Validation rules:
- `stage` must be 1-3
- `name` must be 2-32 characters
- `time` must be a positive number

---

## Database
SQLite file: `server/maze_records.db`  
Table: `records (stage INTEGER PRIMARY KEY, name TEXT NOT NULL, time REAL NOT NULL)`
