import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import socket from '../setupSocket';
import { AuthContext } from '../components/AuthContext';
import Player from '../components/Player';
import RatingButton from '../components/RatingButton';
import VideoPlayer from '../components/VideoPlayer';

const Ranking = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [players, setPlayers] = useState([]);
  const [videoIndex, setVideoIndex] = useState(0);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [numVideos, setNumVideos] = useState(0)

  const pinCode  = location?.state?.pinCode || null;

  // Fetch the ranking data and current video from the server when the component mounts
  useEffect(() => {
    if (!pinCode || !user) {
      return;
    }

    socket.emit('joinRoom', pinCode, user.id);
  }, [pinCode, user]);

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
      setVideoIndex(data.videoIndex);
      setVideoTitle(data.videoTitle);
      setVideoURL(data.videoURL);
      setNumVideos(data.numVideos)
    });

    socket.on('playerRated', (data) => {
      console.log("playerRated event received")
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

  const handleRatingSubmit = (rating) => {
    socket.emit('ratingSubmitted', pinCode, user.id, rating);
  };

  return (
    <div className="ranking-container">
      <div className="video-info">
        <div className="video-index">Video {videoIndex + 1} / {numVideos}</div>
        <div className="video-title">{videoTitle}</div>
        <VideoPlayer url={videoURL} />
      </div>
      <div className="player-list">
        {players.map((player, index) => (
          <Player
            key={player.user.id}
            player={player}
            score={player.score}
            rank={index + 1}
          />
        ))}
      </div>
      <RatingButton onSubmit={handleRatingSubmit} />
    </div>
  );
};

export default Ranking;
