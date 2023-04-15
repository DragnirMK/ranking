import React from 'react';
import '../styles/Player.css';

const Player = ({ player, isHost }) => {
  return (
    <div className="player-container">
      <img
        className="player-picture"
        src={player.user.profilePicture}
        alt={`${player.user.username}'s profile`}
      />
      <span className={`player-username${isHost ? ' host' : ''}`}>
        {player.user.username}
      </span>
    </div>
  );
};

export default Player;
