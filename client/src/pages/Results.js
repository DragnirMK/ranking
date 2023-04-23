import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Ranking.css';
import '../styles/Results.css';
import { AuthContext } from '../components/AuthContext';
import PlayerRating from '../components/PlayerRating';
import Button from '../components/Button';
import VideoPlayer from '../components/VideoPlayer';

const Results = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [players, setPlayers] = useState([]);

  const [rates, setRates] = useState([])
  const [results, setResults] = useState([])

  const [videoIndex, setVideoIndex] = useState(0);
  const [rankingIndex, setRankingIndex] = useState(0);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [numVideos, setNumVideos] = useState(0)

  const pinCode  = location?.state?.pinCode || null;

  useEffect(() => {
    if (!pinCode || !user) {
      return;
    }
  
    const fetchRoomData = async () => {
      try {
        const res = await fetch(`/api/rooms/${pinCode}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const room = await res.json();
        console.log('Room exist in database:', room);
        setPlayers(room.players);
        setRates(room.rates);
        setResults(room.results);
        setRankingIndex(0)
        setVideoTitle(room.results[0].title);
        setVideoURL(room.results[0].url);
        setNumVideos(room.results.length);
      } catch (error) {
        console.error('Error getting room:', error);
      }
    };
  
    fetchRoomData();
  }, [pinCode, user]);
  

  const handlePrevVideo = () => {
    if (rankingIndex > 0) {
      const prevRankingIndex = rankingIndex - 1;
      console.log(prevRankingIndex)
      setRankingIndex(prevRankingIndex);
      setVideoIndex(results[prevRankingIndex].videoIndex)
      setVideoTitle(results[prevRankingIndex].title);
      setVideoURL(results[prevRankingIndex].url);
    }
  }

  const handleNextVideo = () => {
    if (rankingIndex < numVideos - 1) {
      const nextRankingIndex = rankingIndex + 1;
      console.log(nextRankingIndex)
      setRankingIndex(nextRankingIndex);
      setVideoIndex(results[nextRankingIndex].videoIndex)
      setVideoTitle(results[nextRankingIndex].title);
      setVideoURL(results[nextRankingIndex].url);
    }
  };

  return (
    <div className="ranking-container">
      <div className="video-info">
        <div className="video-title">{videoTitle}</div>
        <div className="video-index">{numVideos - rankingIndex} / {numVideos}</div>
      </div>
      <div className="video-player-container">
        <VideoPlayer url={videoURL} />
      </div>
      <PlayerRating players={players} rates={rates} videoIndex={videoIndex} show={true} />
      <div className="results-button">
        <Button text="Previous" onClick={handlePrevVideo} />
        <Button text="Next" onClick={handleNextVideo} />
      </div>
    </div>
  );

};

export default Results;
