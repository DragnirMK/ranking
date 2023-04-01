import React, { useState, useContext } from "react";
import axios from 'axios';
import "./Profile.css";
import defaultProfilePicture from "../assets/default_pp.png";
import { AuthContext, AuthContextProvider } from './AuthContext';
import Button from './Button';
import InputText from './InputText';

const Profile = () => {
  const { loggedIn, setLoggedIn, user, setUser } = useContext(AuthContext);

  const [showDropdown, setShowDropdown] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/users/login', {
        username: usernameInput,
        password: passwordInput,
      });
  
      setUser({
        id: response.data.id,
        username: response.data.username,
        profilePicture: response.data.profilePicture,
      });
      setLoggedIn(true);
      setShowDropdown(false);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  const username = user ? user.username : "Log In";
  const profilePicture = user ? user.profilePicture : defaultProfilePicture;

  return (
    <div className="profile-container" onClick={toggleDropdown}>
      <img className="profile-picture" src={profilePicture} alt="Profile" />
      <span className="username">{username}</span>
      {showDropdown && (
        !loggedIn ? (
          <div className="login-dropdown" onClick={stopPropagation}>
            <InputText placeholder="Username" value={usernameInput} onChange={e => setUsernameInput(e.target.value)} />
            <InputText placeholder="Password" type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} />
            <Button text="Log In" onClick={handleLogin} />
          </div>
        ) : (
          <div className="profile-dropdown" onClick={stopPropagation}>
            <ul>
              <li><a href="/settings">Profile Settings</a></li>
              <li className="signout" onClick={handleLogout}><a href="/">Log Out</a></li>
            </ul>
          </div>
        )
      )}
    </div>
  );
  
};

export default Profile;