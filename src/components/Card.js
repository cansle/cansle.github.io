import React from 'react';

const Card = ({ index, text }) => {
  const imageSrc = `${process.env.PUBLIC_URL}/card${index + 1}.png`;

  return (
    <div className="card">
      <div className="card-content">
        <img src={imageSrc} alt={`Card ${index + 1}`} />
        <p className="card-text">{text}</p>
      </div>
    </div>
  );
};

export default Card;
