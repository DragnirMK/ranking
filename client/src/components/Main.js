import React, { useState, useContext } from 'react';
import './Main.css';
import Button from './Button';
import InputText from './InputText';
import { AuthContext, AuthContextProvider } from './AuthContext';

function Main() {
  const [pinCode, setPinCode] = useState('');
  const { loggedIn, setLoggedIn, user, setUser } = useContext(AuthContext);

  const handleCreateRoom = () => {
    // Implement room creation logic
  };

  const handleJoinRoom = () => {
    // Implement room joining logic
  };

  const createRoom = () => {
    console.log('Create room');
  };

  const joinRoom = () => {
    console.log('Join room');
  };

  return (
    <div className="main-container">
      <h1 className="app-desc">Rank anime openings with your friends Have fun!</h1> {/* Rename class to "app-desc" */}
      <div className="buttons-container">
      <Button text="Create Room" onClick={createRoom} disabled={!loggedIn} />
        <div className="or-text">OR</div> {/* Add the "OR" separator */}
        <InputText placeholder="Enter PIN" />
        <Button text="Join Room" onClick={joinRoom} disabled={!loggedIn} />
      </div>
    </div>
  );
}

export default Main;