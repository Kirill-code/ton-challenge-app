// CardsContainer.js
import React from 'react';
import "./Card.css"

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
            className="card-image"
            style={{
              backgroundImage: `url(${card.image_url})`,
              backgroundSize: '80%', // or 'auto' if you want the original size
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          ></div>
          {/* <img  className="card-image" src={card.imageUrl} alt={card.type}></img > */}
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
