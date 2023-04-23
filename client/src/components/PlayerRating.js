import React from 'react';
import '../styles/PlayerRating.css';

const PlayerRating = ({ players, rates, videoIndex, show }) => {
  console.log(players)
  const hasRated = (player) => {
    const playerRates = rates.find((rate) => rate.user === player.user.id);
    if (playerRates) {
      const videoRate = playerRates.videoRates.find((v) => v.videoIndex === videoIndex);
      if (videoRate) {
        return videoRate.rate !== -1;
      }
    }
    return false;
  };

  const getRating = (player) => {
    const playerRates = rates.find((rate) => rate.user === player.user.id);
    if (playerRates) {
      const videoRate = playerRates.videoRates.find((v) => v.videoIndex === videoIndex);
      if (videoRate) {
        return videoRate.rate;
      }
    }
    return -1;
  };

  const ratings = players.map(getRating);
  const highestRating = Math.max(...ratings);
  const lowestRating = Math.min(...ratings.filter(r => r !== -1));

  const getRatingColor = (rating) => {
    if (rating === -1) return 'gray';
    if (rating === highestRating) return 'green';
    if (rating === lowestRating) return 'red';
  };

  return (
    <div className='playerRating'>
      {players.map((player) => (
        <div key={player.user.id} className="player-wrapper">
          <div className={`playerRating-circle${hasRated(player) ? '' : ' playerRating-grayedOut'}`}>
            <img
              src={player.user.profilePicture}
              alt={`Player ${player.user.username}`}
              className="playerRating-picture"
            />
          </div>
          {show && (
            <div className="playerRating-rate" style={{ color: getRatingColor(getRating(player)) }}>
              {getRating(player)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
  
};

export default PlayerRating;
