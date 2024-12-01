/*
 * Copyright © 2024, Kirill Code.
 * Business Source License 1.1
 * Change Date: November 23, 2026
 */
import React, { useState } from 'react';


const Card = ({ title, link, description, imageUrl }) => {
  const [message, setMessage] = useState('');

  return (
    <div className="card-teachers" onClick={() => handleTaskClick(setMessage)}>
      {imageUrl && <img src={imageUrl} alt={title} className="card-image" />}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <h3 className="card-title">{link}</h3>
        <p className="card-description">{description}</p>
        
      </div>
      {message && <p className="response-message">Thanks! Teacher will contact you</p>}

    </div>
  );
};

export default Card;
