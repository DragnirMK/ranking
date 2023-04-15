import React, { useEffect, useState, useContext } from 'react';
import '../styles/WaitingRoom.css';
import { useLocation } from 'react-router-dom';
import socket from '../setupSocket';
import { AuthContext } from '../components/AuthContext';
import Player from '../components/Player';
import PinCode from '../components/PinCode'
import Button from '../components/Button';

const WaitingRoom = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [players, setPlayers] = useState([]);
  const [numPlayers, setNumPlayers] = useState(0);
  const [createdBy, setCreatedBy] = useState("")

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
      setCreatedBy(data.createdBy)
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

  const handleStart = (user) => {
    if (isHost(user)) {
      socket.emit('startGame');
    }
  };

  const isHost = (user) => {
    console.log("isHost")
    console.log(user)
    console.log(createdBy)
    return user.id === createdBy;
  };

  return (
    <div className="waiting-room-background">
      <div className="waiting-room-container">
        <div className="players-count-container">
          <div className="players-count">{`Players ${numPlayers}/12`}</div>
        </div>
        <div className="player-list">
          {players &&
            players.map((player) => (
              <Player key={player.user.id} player={player} isHost={isHost(player.user)} />
            ))}
        </div>
        <div className="action-container">
          {players && user && (
            <>
              <PinCode pinCode={pinCode} />
              <Button
                className="start-button"
                text="Start"
                onClick={() => handleStart(user)}
                disabled={numPlayers < 2}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
