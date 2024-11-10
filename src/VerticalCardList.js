import React from 'react';
import Card from './Card';

const VerticalCardList = ({ cardsData }) => {
  return (
    <div className="vertical-card-list">
      {cardsData.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          description={card.description}
          imageUrl={card.imageUrl}
        />
      ))}
    </div>
  );
};

export default VerticalCardList;
