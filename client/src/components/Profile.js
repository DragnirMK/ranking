import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../styles/Profile.css";
import Button from './Button';
import InputText from './InputText';
import { AuthContext } from './AuthContext';
import defaultProfilePicture from "../assets/default_pp.png";

const Profile = () => {
  const { loggedIn, setLoggedIn, user, setUser } = useContext(AuthContext);

  const [showDropdown, setShowDropdown] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const navigate = useNavigate();

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

  const handleSignup = () => {
    navigate('/signup');
  }

  const handleLogout = () => {
    setLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  const username = user ? user.username : "Log In";
  const profilePicture = user ? user.profilePicture : defaultProfilePicture;

  return (
    <div className="profile-wrapper">
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
                <li className="signout" onClick={handleLogout}><a href="/">Log Out</a></li>
              </ul>
            </div>
          )
        )}
      </div>
      {!loggedIn && <Button className="profile-signup" text="Sign Up" onClick={handleSignup} />}
    </div>
  );
  
};

export default Profile;