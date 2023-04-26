import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../styles/Home.css';
import Button from '../components/Button';
import InputText from '../components/InputText';
import CreateRoomPopup from '../components/CreateRoomPopup';
import { AuthContext } from '../components/AuthContext';
import socket from '../setupSocket';

function Home() {
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

  const handleJoinRoom = async () => {
    const response = await axios.get(`/api/rooms/${pinCode}`);
    const room = response.data
    if (room.results.length > 0) {
      navigate('/results', { state: { pinCode: parseInt(pinCode) } });
    } else {
      socket.emit('joinRoom', parseInt(pinCode), user.id);
    }
  };

  return (
    <div className="main-container">
      <h1 className="app-desc">
        Rank YouTube videos with your friends
        <br/>
        Have fun !
      </h1>
      <div className="buttons-container">
        <Button text="Create Room" onClick={handleCreateRoom} disabled={!loggedIn} />
        {showCreateRoomPopup && <CreateRoomPopup onClose={handleCloseCreateRoomPopup} />}
        <div className="or-text">OR</div>
        <InputText placeholder="Enter PIN" value={pinCode} onChange={handlePinCodeChange} />
        <Button text="Join Room" onClick={handleJoinRoom} disabled={!loggedIn} />
      </div>
    </div>
  );
}

export default Home;