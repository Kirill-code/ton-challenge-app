import React, { useState } from 'react';
import YouTube from 'react-youtube';
import './ChallengeDetail.css';
import API_CONFIG from './config'; // Import the config

const ChallengeDetail = ({ challengeDetailsItem, id, username }) => {
  const [activeTaskIndex, setActiveTaskIndex] = useState(null);
  const [progressFilled, setProgressFilled] = useState(false);

  const videoOptions = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
    },
  };

  const handleTaskClick = async (index) => {
    try {
      setActiveTaskIndex(index);
      setProgressFilled(true);

      // API call to log the event
      const response = await fetch(`${API_CONFIG.BASE_URL}/event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: id,
          event_name: challengeDetailsItem.title + " " + challengeDetailsItem.date,
          event_id: `task_${index + 1}`, // Updated to include task index
          status: 'run',
          user_wallet: '123',
          username: username,
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
        <img src={challengeDetailsItem.imageUrl} alt="Challenge!" className="challenge-image" />
        <div className="card-tag-details">{challengeDetailsItem.type}</div>
      </div>
      <p className="challenge-title-details">{challengeDetailsItem.title}</p>

      <p className="challenge-description">{challengeDetailsItem.description}</p>

      <div className='challenge-progress'>
        <div className='challenge-progress-filled' style={{
          backgroundColor: progressFilled ? '#007AFF' : '191919',
          height: '16px',
          width: progressFilled ? '50%' : '100%',
          transition: 'background-color 0.5s ease',
        }}></div>
      </div>
      <h3 className="section-title">Задания</h3>

      <div className="tasks">
        {challengeDetailsItem.tasks && challengeDetailsItem.tasks.length > 0 ? (
          challengeDetailsItem.tasks.map((itemTask, index) => (
            itemTask ? (
              <div key={index} className="card-task">
                <div className='card-task-inner' onClick={() => handleTaskClick(index)}>
                  <div className="card-icon-task">
                    <img src={itemTask.taskImgURL} alt="Challenge!" />
                  </div>
                  <div className="card-content-task">
                    <p className="card-title-task">{itemTask.taskName}</p>
                    <p className="card-subtitle-task">{itemTask.taskDescription}</p>
                  </div>
                </div>
                {
                activeTaskIndex === index && (
                  <div className="video-container">
                    <YouTube videoId={itemTask.videoId} opts={videoOptions} />
                  </div>
                )}
              </div>
            ) : null
          ))
        ) : (
          <p className="no-tasks-message">Скоро в приложении</p>
        )
        }
      </div>
    </div>
  );
};

export default ChallengeDetail;
