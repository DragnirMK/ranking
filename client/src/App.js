import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './styles/App.css';
import Home from './pages/Home';
import WaitingRoom from "./pages/WaitingRoom";
import Ranking from './pages/Ranking'
import Results from './pages/Results';
import SignUp from './pages/SignUp';
import Header from './layout/Header';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<><Header showProfile /><Home /></>} />
          <Route path="/waitingroom" element={<><Header /><WaitingRoom /></>} />
          <Route path="/ranking" element={<><Header /><Ranking /></>} />
          <Route path="/results" element={<><Header /><Results /></>} />
          <Route path="/signup" element={<><SignUp /></>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
