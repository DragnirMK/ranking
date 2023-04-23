import React from 'react';
import '../styles/PlayerRating.css';

const PlayerRating = ({ players, rates, videoIndex }) => {
  const hasRated = (player) => {
    const playerRates = rates.find((rate) => rate.user === player.user._id);
    if (playerRates) {
      const videoRate = playerRates.videoRates.find((v) => v.videoIndex === videoIndex);
      if (videoRate) {
        return videoRate.rate !== -1;
      }
    }
    return false;
  };

  return (
    <div className='playerRating'>
      {players.map((player) => (
        <div key={player.user.id} className={`playerRating-circle${hasRated(player) ? '' : ' playerRating-grayedOut'}`}>
          <img
            src={player.user.profilePicture}
            alt={`Player ${player.user.username}`}
            className="playerRating-picture"
          />
        </div>
      ))}
    </div>
  )
};

export default PlayerRating;
