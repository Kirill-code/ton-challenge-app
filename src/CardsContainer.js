// src/CardsContainer.jsx

import React from 'react';
import "./Card.css";

function CardsContainer({ cardsData = [], handleCardClick, renderCard }) { // Default to empty array
  return (
    <div className="cards-container">
      {cardsData.map((card, index) => (
        renderCard ? (
          <div key={index} onClick={() => handleCardClick(card)}>
            {renderCard(card, index)}
          </div>
        ) : (
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
              <p className="card-description">
                {card.description && card.description.length > 52 ? `${card.description.slice(0, 52)}...` : card.description}
              </p>
            </div>
          </div>
        )
      ))}
      {cardsData.length === 0 &&
        <div>
          <p>Нет доступных челленждей. Обновите страницу или обратитесь в поддержку</p>
          <div className="container-support">
            <a className="teacher-tg-txt" href="https://t.me/ArandjoBot">
              Поддержка
            </a>
          </div>
        </div>}
    </div>
  );
}

export default CardsContainer;

/*
 * Copyright © 2024, Kirill Code.
 * Business Source License 1.1
 * Change Date: November 23, 2026
 */
