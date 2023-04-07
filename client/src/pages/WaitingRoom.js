import React, { useEffect, useState, useContext } from 'react';
import '../styles/WaitingRoom.css';
import { useLocation } from 'react-router-dom';
import socket from '../setupSocket';
import { AuthContext, AuthContextProvider } from '../components/AuthContext'

const WaitingRoom = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [numPlayers, setNumPlayers] = useState(0);

  const pinCode  = location?.state?.pinCode || null;

  useEffect(() => {
    if (!pinCode || !user) {
      return;
    }

    console.log(players)

    const handlePlayerJoined = (data) => {
      console.log('Player joined:', data);
      setPlayers(data.players);
      setNumPlayers(data.numPlayers);
    };

    const handlePlayerLeft = (data) => {
      console.log('Player left:', data);
      setPlayers(data.players);
      setNumPlayers(data.numPlayers);
    };

    socket.on('connect', () => {
      console.log('Connected to socket');
      socket.emit('joinRoom', pinCode, user.id);
    });

    socket.on('playerJoined', handlePlayerJoined);

    socket.on('playerLeft', handlePlayerLeft);

    socket.on('disconnect', () => {
      console.log('Disconnected from socket');
    });

    setLoading(false);

    return () => {
      socket.off('playerJoined', handlePlayerJoined);
      socket.off('playerLeft', handlePlayerLeft);
    };
  }, [pinCode, user, players]);

  const handleStart = () => {
    socket.emit('startGame');
  };

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  if (!pinCode) {
    return <div>Error</div>;
  }

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
