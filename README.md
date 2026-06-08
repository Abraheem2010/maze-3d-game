# Maze 3D - Full-Stack Web App (React + Express + SQLite)

A full-stack 3D first-person maze game with 3 stages and a Hall of Fame leaderboard.
Each stage measures the player's completion time, sends the result to the backend,
and the server stores only the best (fastest) record per stage.

---

## Project Structure
- `client/` — React frontend
- `server/` — Express API + SQLite DB

---

## Local Setup
Prerequisites: Node.js 18+ and npm

### Server
```bash
cd server
npm install
npm start
```
Server runs on http://localhost:5000

### Client
```bash
cd client
npm install
npm start
```

If port 3000 is already taken by the server, React will start on http://localhost:3001 (recommended).
The client proxies `/api/*` calls to the server via the `proxy` setting in `client/package.json`.

### Production-like (single service locally)
```bash
cd client && npm run build
cd ..\server && npm start
```
Then open http://localhost:3000

---

## Environment Variables
Set this only if the client is deployed separately:
```
REACT_APP_API_URL=https://your-server.example.com
```
If not set, the client uses the same origin and `/api/*` routes.

---

## Controls (3D FPS)
- Click the game to start (Pointer Lock)
- Move: WASD or Arrow keys
- Look around: Mouse (horizontal + vertical, full 360°)
- Switch view (FPS ↔ Third-Person): V

---

## Visual Style — Urban City
All stages are rendered as city streets:
- Walls: concrete building facades with windows and weathering streaks
- Floor: dark asphalt with dashed center lines and edge markings
- Sky: overcast urban haze
- Stage 3 uses a darker underground-city palette

---

## Robot Face (Avatar)
On the **stage setup screen** (before starting), click **"Upload Robot Face Photo"** to choose an image from your computer.
- The image is resized and saved in your browser's localStorage
- It appears on the robot's face inside the 3D maze
- It is also shared with other players in the same room (visible on their robot model)

---

## Multiplayer
Up to 3 players can share a room and play simultaneously.

### Invite a Friend
1. Open any stage setup screen
2. Your room code is shown (e.g. `M-A7X2`)
3. Click **"Copy Invite Link"** — the full URL with `?room=M-A7X2` is copied to your clipboard
4. Send the link to a friend — they will join the same room automatically

### In-Game Panel (Party Chat)
- **🎤 Live / 🔇 Muted** — toggle your microphone for voice chat (WebRTC, peer-to-peer)
- Room code + **Invite** button are also available in the panel during the game
- Text chat is always available regardless of microphone state

---

## API Endpoints
Base URL (local): http://localhost:5000

### `GET /api/ping`
Health check.
```json
{ "ok": true, "ts": 1700000000000 }
```

### `GET /healthc`
Lightweight health check.
```json
{ "ok": true }
```

### `GET /api/records`
Returns the leaderboard (one row per stage), sorted by stage.
```json
[
  { "stage": 1, "name": "Ibrahim", "time": 12.34 },
  { "stage": 2, "name": "Someone", "time": 18.21 }
]
```

### `POST /api/score`
Updates the best record for a stage (only if the new time is faster).
```json
{ "stage": 1, "name": "Ibrahim", "time": 12.34 }
```
Validation: `stage` 1–3, `name` 2–32 chars, `time` positive number.

---

## Database
SQLite file: `server/maze_records.db`
Table: `records (stage INTEGER PRIMARY KEY, name TEXT NOT NULL, time REAL NOT NULL)`

---

## QA (Optional)
```powershell
cd server
powershell -ExecutionPolicy Bypass -File .\qa.ps1
```

---

## Deployment
Single-service deployment:
1. `cd client && npm run build`
2. Start the server from `server/` with `npm start`
