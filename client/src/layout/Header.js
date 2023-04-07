import React from 'react';
import Profile from '../components/Profile';
import logo from '../assets/small_logo.png';

const Header = ({ showProfile }) => {
  return (
    <header className="App-header">
      <img src={logo} alt="App Logo" className="header-logo" />
      {showProfile && <Profile />}
    </header>
  );
};

export default Header;
