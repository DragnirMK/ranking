import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/WaitingRoom.css';
import Player from '../components/Player';
import PinCode from '../components/PinCode'
import Button from '../components/Button';
import Error from '../components/Error'
import { AuthContext } from '../components/AuthContext';
import socket from '../setupSocket';


const WaitingRoom = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [players, setPlayers] = useState([]);
  const [numPlayers, setNumPlayers] = useState(0);
  const [createdBy, setCreatedBy] = useState("")

  const [blockStartButton, setBlockStartButton] = useState(false);

  const [error, setError] = useState(false);

  const pinCode  = location?.state?.pinCode || null;

  const navigate = useNavigate();

  // Handle joinRoom event (when joining / refreshing the page)
  useEffect(() => {
    if (!pinCode || !user) {
      setError(true);
      return;
    }

    setError(false)
  
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

    socket.on('gameStarted', (data) => {
      console.log('gameStarted event received:', data);
      console.log("Navigate to /ranking")
      navigate('/ranking', { state: { pinCode: pinCode } });
    })

     // Clean up the event listeners when the component is unmounted
    return () => {
      socket.off('playerJoined');
      socket.off('playerLeft');
      socket.off('gameStarted');
    };
  });

  const handleStart = (user) => {
    if (isHost(user) && !blockStartButton) {
      socket.emit('startGame', pinCode, user.id);
      setBlockStartButton(true)
    }
  };

  const isHost = (user) => {
    return user.id === createdBy;
  };

  if (error) {
    return <Error />
  } 

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
                disabled={numPlayers < 2 || !isHost(user)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
