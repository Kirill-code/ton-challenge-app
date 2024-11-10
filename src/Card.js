import React, { useState } from 'react';

const handleTaskClick = async (setMessage) => {
  try {
    // API call to log the event
    const response = await fetch('https://d5daginsfb4svds4mjjs.apigw.yandexcloud.net/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: 'wallet_address',
        event_name: 'Breathing Practice',
        event_id: 'task_1',
        status: 'run',
        user_wallet: '123',
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    // Update message to success
    setMessage('Event logged successfully!');
  } catch (error) {
    console.error('API call error:', error);
    setMessage('Failed to log the event. Please try again.');
  }
};

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
