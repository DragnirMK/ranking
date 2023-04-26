import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Ranking.css';
import '../styles/Results.css';
import PlayerRating from '../components/PlayerRating';
import Button from '../components/Button';
import VideoPlayer from '../components/VideoPlayer';
import Error from '../components/Error'
import { AuthContext } from '../components/AuthContext';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [players, setPlayers] = useState([]);

  const [rates, setRates] = useState([])
  const [results, setResults] = useState([])

  const [videoIndex, setVideoIndex] = useState(0);
  const [rankingIndex, setRankingIndex] = useState(0);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [numVideos, setNumVideos] = useState(0)

  const [error, setError] = useState(false);

  const pinCode  = location?.state?.pinCode || null;

  useEffect(() => {
    if (!pinCode || !user) {
      setError(true);
      return;
    }

    setError(false)
  
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(`/api/rooms/${pinCode}`);
        const room = await response.data;
        console.log('Room exist in database:', room);

        setPlayers(room.players);
        setRates(room.rates);
        setResults(room.results);
        setRankingIndex(0)
        setVideoIndex(room.results[0].videoIndex)
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

  const handleReturnHome = () => {
    navigate('/');
  };

  const isLastVideo = rankingIndex === numVideos - 1;

  const getMedalEmoji = () => {
    const rank = numVideos - rankingIndex;
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  if (error) {
    return <Error />
  } 

  return (
    <div className="ranking-container">
      <div className="video-info">
        <div className="video-title">{videoTitle} {getMedalEmoji()}</div>
        <div className="video-index">{numVideos - rankingIndex} / {numVideos}</div>
      </div>
      <div className="video-player-container">
        <VideoPlayer url={videoURL} />
      </div>
      <PlayerRating players={players} rates={rates} videoIndex={videoIndex} show={true} />
      <div className="results-button">
        <Button text="Previous" onClick={handlePrevVideo} disabled={rankingIndex === 0} />
        <Button text={isLastVideo ? "Return Home" : "Next"} onClick={isLastVideo ? handleReturnHome : handleNextVideo} />
      </div>
    </div>
  );

};

export default Results;
