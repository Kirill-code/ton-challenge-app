// ChallengeDetail.js
/*
 * Copyright © 2024, Kirill Code.
 * Business Source License 1.1
 * Change Date: November 23, 2026
 */

import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import './ChallengeDetail.css';
import API_CONFIG from './config'; // Import the config

const ChallengeDetail = ({ challengeDetailsItem, id, username, teachersList }) => {
  const [activeTaskIndex, setActiveTaskIndex] = useState(null);
  const [progressFilled, setProgressFilled] = useState(0); // Percentage
  const [tasksEnabled, setTasksEnabled] = useState([]); // Array of booleans
  const [tasksData, setTasksData] = useState([]); // Tasks array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  
  // Function to initialize task states based on finished_tasks
  const initializeTasks = (tasksNumber, finishedTasks) => {
    const enabled = tasksData.map((_, index) => {
      if (index < finishedTasks) return false; // Completed tasks are disabled
      if (index === finishedTasks) return true; // Next task is enabled
      return false; // Future tasks are disabled
    });
    setTasksEnabled(enabled);
    // Update progress
    const progress = (finishedTasks / tasksNumber) * 100;
    setProgressFilled(progress);
  };

  // Fetch event data from API
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        // Construct the URL with query parameters
        const url = new URL(`${API_CONFIG.BASE_URL}/get_event`);
        url.searchParams.append('user_id', id);

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authentication headers if required, e.g.,
            // 'Authorization': `Bearer ${token}`,
          },
        });

        console.log("REPONSE");
        console.log(response);

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const eventData = await response.json();
        // Assuming the API returns a single event object
        // If it returns an array, adjust accordingly
        if (eventData) {
          const { tasks_number, finished_tasks } = eventData;
          // Initialize task states based on finished_tasks
          initializeTasks(tasks_number, finished_tasks);
        } else {
          // If no event data found, initialize with default values
          initializeTasks(challengeDetailsItem.tasks.length, 0);
        }

        setLoading(false);
      } catch (err) {
        console.error('API call error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEventData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengeDetailsItem.event_id, id]);

  // Initialize tasksData from challengeDetailsItem.tasks
  useEffect(() => {
    if (challengeDetailsItem.tasks && challengeDetailsItem.tasks.length > 0) {
      setTasksData(challengeDetailsItem.tasks);
    }
  }, [challengeDetailsItem.tasks]);

  const handleTaskClick = async (index) => {
    if (!tasksEnabled[index]) return; // Prevent clicking disabled tasks

    try {
      setActiveTaskIndex(index);

      // API call to log the event
      const response = await fetch(`${API_CONFIG.BASE_URL}/post_event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if required, e.g.,
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: id,
          event_name: `${challengeDetailsItem.title} ${challengeDetailsItem.date}`,
          event_id: `task_${index + 1}`, // Updated to include task index
          status: 'run',
          user_wallet: '123', // Replace with dynamic wallet if available
          username: username,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Update the state to reflect the completed task
      const newFinishedTasks = Math.min(index + 1, tasksData.length);
      initializeTasks(tasksData.length, newFinishedTasks);
    } catch (error) {
      console.error('API call error:', error);
    }
  };

  if (loading) {
    return <div className="challenge-detail"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="challenge-detail"><p>Error: {error}</p></div>;
  }

  return (
    <div className="challenge-detail">
      <div className="image-container">
        <img src={challengeDetailsItem.imageUrl} alt="Challenge!" className="challenge-image" />
        <div className="card-tag-details">{challengeDetailsItem.type}</div>
      </div>
      <p className="challenge-title-details">{challengeDetailsItem.title}</p>

      <p className="challenge-description">{challengeDetailsItem.description}</p>

      <div className='challenge-progress'>
        <div 
          className='challenge-progress-filled' 
          style={{
            backgroundColor: '#007AFF',
            height: '16px',
            width: `${progressFilled}%`,
            transition: 'width 0.5s ease, background-color 0.5s ease',
          }}
        ></div>
      </div>
      <h3 className="section-title">Задания</h3>

      <div className="tasks">
        {tasksData && tasksData.length > 0 ? (
          tasksData.map((itemTask, index) => (
            <div key={index} className={`card-task ${tasksEnabled[index] ? 'enabled' : 'disabled'}`}>
              <div 
                className={`card-task-inner ${tasksEnabled[index] ? 'clickable' : 'not-clickable'}`} 
                onClick={() => handleTaskClick(index)}
                style={{ cursor: tasksEnabled[index] ? 'pointer' : 'not-allowed' }}
                role="button"
                tabIndex={tasksEnabled[index] ? 0 : -1}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && tasksEnabled[index]) {
                    handleTaskClick(index);
                  }
                }}
                aria-disabled={!tasksEnabled[index]}
              >
                <div className="card-icon-task">
                  <img src={itemTask.taskImgURL} alt="Task Icon" />
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
                )
              }
            </div>
          ))
        ) : (
          <p className="no-tasks-message">Скоро в приложении</p>
        )}
      </div>
    </div>
  );
};

export default ChallengeDetail;
