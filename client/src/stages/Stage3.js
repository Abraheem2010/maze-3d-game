import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Maze3 from './Maze3';
import { postScore } from '../api';
import './Stages.css';
import './Stage3.css';

function Stage3() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('INPUT'); // INPUT | COUNTDOWN | PLAYING | COMPLETED
  const [playerName, setPlayerName] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [finalTime, setFinalTime] = useState(null);
  const [showWinOverlay, setShowWinOverlay] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("playerName");
    if (savedName) setPlayerName(savedName);
  }, []);

  useEffect(() => {
    if (gameState !== 'COUNTDOWN') return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
    setGameState('PLAYING');
  }, [gameState, countdown]);

  useEffect(() => {
    if (!showWinOverlay) return;
    const timer = setTimeout(() => {
      setShowWinOverlay(false);
      navigate("/");
    }, 2000);
    return () => clearTimeout(timer);
  }, [showWinOverlay, navigate]);

  const handleStart = () => {
    const trimmed = playerName.trim();
    if (trimmed.length < 2) {
      alert("Please enter a name");
      return;
    }
    try { localStorage.setItem("playerName", trimmed); } catch (e) {}

    setCountdown(3);
    setGameState('COUNTDOWN');
    setShowWinOverlay(false);
    setFinalTime(null);
  };

  const handleWin = (winTime) => {
    const time =
      (typeof winTime === "number" && Number.isFinite(winTime))
        ? winTime
        : 0;

    const name = (playerName || localStorage.getItem("playerName") || "player").trim();
    const payload = { stage: 3, name, time };

    try { localStorage.setItem("records_dirty", String(Date.now())); } catch (e) {}

    postScore(payload);

    setFinalTime(time);
    setGameState('COMPLETED');
    setShowWinOverlay(true);
  };

  return (
    <div className="stage-container stage3-theme" style={{ position: 'relative', overflow: 'hidden' }}>
      {gameState === 'INPUT' && (
        <div className="setup-card">
          <h2>Stage 3: The Lava Core</h2>

          <input
            type="text"
            placeholder="Adventurer Name..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleStart();
              }
            }}
          />

          <br />

          <button className="start-btn" onClick={handleStart}>
            Face the Heat
          </button>

          <button className="back-home-btn" type="button" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      )}

      {gameState === 'COUNTDOWN' && (
        <div className="countdown-overlay">{countdown > 0 ? countdown : "BURN!"}</div>
      )}

      {gameState === 'PLAYING' && !showWinOverlay && (
        <div className="game-active">
          <Maze3 onWin={handleWin} playerName={playerName} />
        </div>
      )}

      {showWinOverlay && (
        <div className="post-win-overlay">
          <div className="post-win-card stage3-post-win">
            <h2>Victory!</h2>
            <p className="post-win-time">
              Core cleared in
              <span>{finalTime !== null ? finalTime.toFixed(2) : "0.00"}s</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stage3;
