import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../styles/SignUp.css';
import Button from '../components/Button';
import InputText from '../components/InputText';

function SignUp() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [popup, setPopup] = useState(null);

  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleProfilePictureChange = (event) => {
    setProfilePicture(event.target.value);
  };

  const showPopup = () => {
    const color = popup && popup.toLowerCase().includes('error') ? 'red' : 'green';
    return <div className="warning-message" style={{ color }}>{popup}</div>;
  };
  

  const handleCreateUser = async () => {
    if (!username || !password || !profilePicture) {
        setPopup('Error : Please fill in all fields.');
        return;
    }
      
    const linkRegex = /^https?:\/\/\S+/i;
    if (!linkRegex.test(profilePicture)) {
        setPopup('Error : Please enter a valid profile picture link.');
        return;
    }

    try {
        const response = await axios.post(`/api/users/signup`, {
            username: username,
            password: password,
            profilePicture: profilePicture
        });
        console.log("Response")
        console.log(response)
        if (response.status === 201) {
            navigate('/');
        }
    } catch (error) {
        setPopup(`Error : Cannot create user ${username} : already exists or invalid data`);
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Create your account</h1>
      {showPopup()}
      <div className="signup-form">
        <InputText placeholder="Username" value={username} onChange={handleUsernameChange} />
        <InputText placeholder="Password" value={password} type="password" onChange={handlePasswordChange} />
        <InputText placeholder="Profile Picture Link" value={profilePicture} onChange={handleProfilePictureChange} />
        <Button text="Create" onClick={handleCreateUser} />
      </div>
    </div>
  );
}

export default SignUp;