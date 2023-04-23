import React, { useState } from 'react';
import '../styles/RatingButton.css';

const RatingButton = ({ onSubmit }) => {
  const [rating, setRating] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(rating);
    setRating('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        min="0"
        max="20"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className='ratingInput'
      />
      <button type="submit">Submit Rating</button>
    </form>
  );
};

export default RatingButton;
