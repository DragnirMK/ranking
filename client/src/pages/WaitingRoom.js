import React, { useEffect, useState, useContext } from 'react';
import '../styles/WaitingRoom.css';
import { useLocation } from 'react-router-dom';
import socket from '../setupSocket';
import { AuthContext, AuthContextProvider } from '../components/AuthContext'

const WaitingRoom = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [players, setPlayers] = useState([]);
  const [numPlayers, setNumPlayers] = useState(0);

  const pinCode  = location?.state?.pinCode || null;

  // Handle joinRoom event (when joining / refreshing the page)
  useEffect(() => {
    if (!pinCode || !user) {
      return;
    }
  
    console.log(user);
    console.log(pinCode);
  
    socket.emit('joinRoom', pinCode, user.id);
  }, [pinCode, user]);

  // Handle socket events
  useEffect(() => {
    socket.on('playerJoined', (data) => {
      console.log('playerJoined event received:', data);
      setPlayers(data.players);
      setNumPlayers(data.numPlayers);
    });
  
    socket.on('playerLeft', (data) => {
      console.log('playerLeft event received:', data);
      setPlayers(data.players);
      setNumPlayers(data.numPlayers);
    });

     // Clean up the event listeners when the component is unmounted
    return () => {
      socket.off('playerJoined');
      socket.off('playerLeft');
    };
  });

  const handleStart = () => {
    socket.emit('startGame');
  };

  return (
    <div className="waiting-room-background">
      <div className="waiting-room-container">
        <h2>Waiting Room</h2>
        <div className="waiting-room-header">
          <div className="players-count-container">
            <div className="players-count">{`Players ${numPlayers}/12`}</div>
          </div>
        </div>
        <div className="waiting-room-content">
          <div className="players-list-container">
            <h3>Players</h3>
            <ul className="players-list">
              {players && players.map((player) => (
                <li key={player.user.id}>
                  <img src={player.user.profilePicture} alt={`${player.user.username}'s profile`} />
                  <span>{player.user.username}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="start-button-container">
            {numPlayers >= 2 && <button className="start-button" onClick={handleStart}>Start</button>}
          </div>
        </div>
      </div>
    </div>
  )
};

export default WaitingRoom;
