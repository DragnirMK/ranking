import React from 'react';
import './App.css';
import Main from './components/Main';
import Profile from './components/Profile'
import logo from './assets/small_logo.png'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="App Logo" className="header-logo" />
        <Profile />
      </header>
      <Main />
    </div>
  );
}

export default App;