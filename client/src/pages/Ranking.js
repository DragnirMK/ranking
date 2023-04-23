import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Ranking.css';
import socket from '../setupSocket';
import { AuthContext } from '../components/AuthContext';
import PlayerRanking from '../components/PlayerRating';
import InputText from '../components/InputText';
import VideoPlayer from '../components/VideoPlayer';

const Ranking = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [players, setPlayers] = useState([]);
  const [rates, setRates] = useState([])
  const [videoIndex, setVideoIndex] = useState(0);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [numVideos, setNumVideos] = useState(0)
  const [inputValue, setInputValue] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);

  const pinCode  = location?.state?.pinCode || null;

  // Fetch the ranking data and current video from the server when the component mounts
  useEffect(() => {
    if (!pinCode || !user) {
      return;
    }

    socket.emit('joinRoom', pinCode, user.id);
  }, [pinCode, user]);

  useEffect(() => {
    setInputValue('');
    setInputDisabled(false);
  }, [videoIndex]);

  // Listen for events from the server
  useEffect(() => {
    socket.on('playerJoined', (data) => {
      console.log('playerJoined event received:', data);
      console.log("Send fetchGameState event")
      socket.emit('fetchGameState', pinCode, user.id);
    });
  
    socket.on('gameState', (data) => {
      console.log("gameState event received")
      setPlayers(data.players);
      setRates(data.rates);
      setVideoIndex(data.videoIndex);
      setVideoTitle(data.videoTitle);
      setVideoURL(data.videoURL);
      setNumVideos(data.numVideos)
    });

    socket.on('playerRated', (data) => {
      console.log("playerRated event received")
      setRates(data.rates)
    });

    socket.on('nextVideo', (data) => {
      console.log("nextVideo event received")
      setVideoIndex(data.videoIndex);
      setVideoTitle(data.videoTitle);
      setVideoURL(data.videoURL);
    });

    socket.on('gameEnded', (data) => {
        console.log("gameEnded event received");
    });

    // Clean up the event listeners when the component is unmounted
    return () => {
      socket.off('playerJoined');
      socket.off('gameState');
      socket.off('playerRated');
      socket.off('nextVideo');
    };
  });

  const handleRateChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (inputValue >= 0 && inputValue <= 20) {
        console.log("Sending ratingSubmitted message");
        socket.emit('ratingSubmitted', pinCode, user.id, inputValue);
        console.log("Reset")
        setInputValue('');
        setInputDisabled(true);
      }
    }
  };

  return (
    <div className="ranking-container">
      <div className="video-info">
        <div className="video-title">{videoTitle}</div>
        <div className="video-index">{videoIndex + 1} / {numVideos}</div>
      </div>
      <div className="video-player-container">
        <VideoPlayer url={videoURL} />
      </div>
      <PlayerRanking players={players} rates={rates} videoIndex={videoIndex} />
      <InputText
        placeholder="/20"
        value={inputValue}
        disabled={inputDisabled}
        onChange={handleRateChange}
        onKeyDown={handleKeyDown}
        className="rating-input"
      />
    </div>
  );

};

export default Ranking;
