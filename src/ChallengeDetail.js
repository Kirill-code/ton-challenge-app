/*
 * Copyright © 2024, Kirill Code.
 * Business Source License 1.1
 * Change Date: November 23, 2026
 */
import React, { useState } from 'react';
import YouTube from 'react-youtube';
import './ChallengeDetail.css';
import { ReactComponent as HeartIcon } from '../src/assets/heart.svg';
import { ReactComponent as VideoIcon } from '../src/assets/video.svg';


const ChallengeDetail = ({ imageUrl, title, description, type, onBack, wallet_address }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [progressFilled, setProgressFilled] = useState(false); // State to track progress fill


  // Function to handle task click and make API call
  const handleTaskClick = async () => {
    try {
      // Trigger the video display
      setShowVideo(true);
      setProgressFilled(true);

      // API call to log the event
      const response = await fetch('https://d5daginsfb4svds4mjjs.apigw.yandexcloud.net/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: wallet_address,
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

    } catch (error) {
      console.error('API call error:', error);
    }
  };

  return (
    <div className="challenge-detail">
      <div className="image-container">

        <img src={imageUrl} alt="Challenge!" className="challenge-image" />
        <div className="card-tag-details">{type}</div>
      </div>
      <p className="challenge-title-details">{title}</p>

      <p className="challenge-description">{description}</p>

      <div className='challenge-progress'>
        <div className='challenge-progress-filled'style={{
          backgroundColor: progressFilled ? '#007AFF' : '191919',
          height: '16px',  // Example height for visualization
          width: progressFilled ? '50%' : '100%', // Fill half width on click

          transition: 'background-color 0.5s ease', // Add a smooth transition effect
        }}></div>
      </div>
      <h3 className="section-title">TASKS</h3>

      <div className="tasks">

        <div className="card-task" onClick={handleTaskClick}>
          <div className='card-task-inner'>
            <div className="card-icon-task">
              <HeartIcon />
            </div>
            <div className="card-content-task">
              <p className="card-title-task">Дыхательная практика</p>
              <p className="card-subtitle-task">5 минут медитации</p>
            </div>
          </div>
        </div>


        <div className="card-task" onClick={handleTaskClick}>
          <div className='card-task-inner'>
            <div className="card-icon-task">
              <VideoIcon />
            </div>
            <div className="card-content-task">
              <p className="card-title-task">Онлайн-занятие</p>
              <p className="card-subtitle-task">Обучение базовой асаны</p>
            </div>
          </div>
        </div>

        {/* Conditionally render the YouTube video */}
      {showVideo && (
        <div className="video-container">
          <YouTube videoId="5HlDIxNy5gs" opts={{ width: '100%', height: '390' }} />
        </div>
      )}
      </div>

      
    </div>
  );
};

export default ChallengeDetail;
