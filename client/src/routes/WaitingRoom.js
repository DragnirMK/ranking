import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../layout/Header";
import "./WaitingRoom.css";

const WaitingRoom = () => {
  const [players, setPlayers] = useState([]);
  const [pinCode, setPinCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch players and pin code from the backend (to be implemented)
  }, []);

  const copyPinCode = () => {
    navigator.clipboard.writeText(pinCode);
  };

  const startGame = async () => {
    if (players.length >= 2) {
      // Send a request to the backend to start the game (to be implemented)
      navigate("/game"); // Redirect to the game page (to be created)
    }
  };

  return (
    <div className="waiting-room">
      <Header/>
      <div className="players-container">
        <h2>Players {players.length}/12</h2>
        <div className="player-list">
          {players.map((player, index) => (
            <div key={index} className="player">
              <img src={player.profilePicture} alt={player.username} />
              <span>{player.username}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="pin-code-container">
        <h2>PIN Code: {pinCode}</h2>
        <button className="copy-button" onClick={copyPinCode}>Copy</button>
        <button className="start-button" onClick={startGame}>Start</button>
      </div>
    </div>
  );
};

export default WaitingRoom;
