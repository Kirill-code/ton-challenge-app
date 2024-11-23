/*
 * Copyright © 2024, Kirill Code.
 * Business Source License 1.1
 * Change Date: November 23, 2024
 */
import React from 'react';
import Card from './card';

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
