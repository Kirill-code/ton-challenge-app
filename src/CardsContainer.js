// CardsContainer.js
import React from 'react';

function CardsContainer({ cardsData, handleCardClick }) {
  return (
    <div className="cards-container">
      {cardsData.map((card, index) => (
        <div
          className="card"
          key={index}
          onClick={() => handleCardClick(card)}
        >
          <div
            className={`card-image`}
            style={{ backgroundImage: `url(${card.imageUrl})` }}
          ></div>
          <div className="card-tag">{card.type}</div>
          <div className="card-text">
            <h2 className="card-title">{card.title}</h2>
            <p className="card-description">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CardsContainer;
