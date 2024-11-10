import React from 'react';
// import './Card.css'; // Optional: for custom styling

const Card = ({ title, link,description, imageUrl }) => {
  return (
    <div className="card-teachers">
      {imageUrl && <img src={imageUrl} alt={title} className="card-image" />}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <h3 className="card-title">{link}</h3>

        <p className="card-description">{description}</p>
      </div>
    </div>
  );
};

export default Card;
