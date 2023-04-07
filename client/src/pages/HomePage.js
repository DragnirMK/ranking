import React, { useState, useContext } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import '../styles/HomePage.css';
import Button from '../components/Button';
import InputText from '../components/InputText';
import CreateRoomPopup from '../components/CreateRoomPopup';
import socket from '../setupSocket';
import { AuthContext, AuthContextProvider } from '../components/AuthContext';

function HomePage() {
  const [pinCode, setPinCode] = useState('');
  const { loggedIn, setLoggedIn, user, setUser } = useContext(AuthContext);
  const [showCreateRoomPopup, setShowCreateRoomPopup] = useState(false);

  const navigate = useNavigate();

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
    // socket.emit('joinRoom', pinCode, user.id);
    navigate('/waitingroom', { state: { pinCode: pinCode } });
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