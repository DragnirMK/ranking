import React, { useState } from 'react';

const RatingButton = ({ onSubmit }) => {
  const [rating, setRating] = useState('');

  const handleChange = (e) => {
    setRating(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(parseFloat(rating));
    setRating('');
  };

  return (
    <div className="rating-input-container">
      <input
        type="number"
        min="0"
        max="5"
        step="0.1"
        value={rating}
        onChange={handleChange}
        placeholder="Rating (0-5)"
      />
      <button onClick={handleSubmit} disabled={!rating}>
        Submit Rating
      </button>
    </div>
  );
};

export default RatingButton;
