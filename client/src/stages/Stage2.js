import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Maze2 from './Maze2';
import { postScore } from '../api';
import './Stages.css';
import './Stage2.css';

function Stage2() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('INPUT');
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
    if (playerName.trim().length < 2) {
      alert("Please enter a name");
      return;
    }
    try { localStorage.setItem("playerName", playerName); } catch (e) {}
    setCountdown(3);
    setGameState('COUNTDOWN');
    setShowWinOverlay(false);
    setFinalTime(null);
  };

  const handleWin = (finalTimeValue) => {
    const time = (typeof finalTimeValue === "number" && Number.isFinite(finalTimeValue)) ? finalTimeValue : 0;
    const name = (playerName || localStorage.getItem("playerName") || "player").trim();
    const payload = { stage: 2, name, time };

    try { localStorage.setItem("records_dirty", String(Date.now())); } catch (e) {}

    postScore(payload);

    setFinalTime(time);
    setGameState('COMPLETED');
    setShowWinOverlay(true);
  };

  return (
    <div className="stage-container stage2-theme">
      {gameState === 'INPUT' && (
        <div className="setup-card">
          <h2>Stage 2: The Deep Blue</h2>
          <input
            type="text"
            placeholder="Explorer Name..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <br />
          <button className="start-btn" onClick={handleStart}>Dive Down</button>
          <button className="back-home-btn" onClick={() => navigate("/")}>Home</button>
        </div>
      )}
      {gameState === 'COUNTDOWN' && <div className="countdown-overlay">{countdown}</div>}

      {gameState === 'PLAYING' && !showWinOverlay && (
        <div className="game-active">
          <Maze2 onWin={handleWin} playerName={playerName} />
        </div>
      )}

      {showWinOverlay && (
        <div className="post-win-overlay">
          <div className="post-win-card stage2-post-win">
            <h2>Great Dive!</h2>
            <p className="post-win-time">
              Stage 2 cleared in
              <span>{finalTime !== null ? finalTime.toFixed(2) : "0.00"}s</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stage2;
