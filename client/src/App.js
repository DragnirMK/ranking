import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './styles/App.css';
import HomePage from './pages/HomePage';
import WaitingRoom from "./pages/WaitingRoom";
import Ranking from './pages/Ranking'
import Header from './layout/Header';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<><Header showProfile /><HomePage /></>} />
          <Route path="/waitingroom" element={<><Header /><WaitingRoom /></>} />
          <Route path="/ranking" element={<><Header /><Ranking /></>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
