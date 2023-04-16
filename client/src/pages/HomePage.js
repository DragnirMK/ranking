import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/HomePage.css';
import Button from '../components/Button';
import InputText from '../components/InputText';
import CreateRoomPopup from '../components/CreateRoomPopup';
import socket from '../setupSocket';
import { AuthContext } from '../components/AuthContext';

function HomePage() {
  const [pinCode, setPinCode] = useState('');
  const { loggedIn, user } = useContext(AuthContext);
  const [showCreateRoomPopup, setShowCreateRoomPopup] = useState(false);

  const navigate = useNavigate();

  // Handle socket events
  useEffect(() => {
    socket.on('playerJoined', (data) => {
      console.log("playerJoined event received, room is opened.")
      console.log(pinCode)
      if (!data.inGame) {
        console.log("Navigate to /waitingroom")
        navigate('/waitingroom', { state: { pinCode: pinCode } });
      } else {
        console.log("Navigate to /ranking")
        navigate('/ranking', { state: { pinCode: pinCode } });
      }
    });

    return () => {
      socket.off('playerJoined');
    };
  }, [navigate, pinCode]);

  const handleCreateRoom = () => {
    setShowCreateRoomPopup(true);
  };

  const handleCloseCreateRoomPopup = () => {
    setShowCreateRoomPopup(false);
  };

  const handlePinCodeChange = (event) => {
    setPinCode(event.target.value);
  };

  const handleJoinRoom = () => {
    socket.emit('joinRoom', parseInt(pinCode), user.id);
  };

  return (
    <div className="main-container">
      <h1 className="app-desc">Rank anime openings with your friends Have fun!</h1> {/* Rename class to "app-desc" */}
      <div className="buttons-container">
        <Button text="Create Room" onClick={handleCreateRoom} disabled={!loggedIn} />
        {showCreateRoomPopup && <CreateRoomPopup onClose={handleCloseCreateRoomPopup} />}
        <div className="or-text">OR</div> {/* Add the "OR" separator */}
        <InputText placeholder="Enter PIN" value={pinCode} onChange={handlePinCodeChange} />
        <Button text="Join Room" onClick={handleJoinRoom} disabled={!loggedIn} />
      </div>
    </div>
  );
}

export default HomePage;