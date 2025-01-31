import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import logo from './assets/logo.png';

import './ChallengeDetail.css';
import { API_CONFIG } from './config';

const ChallengeDetail = ({ challengeDetailsItem, id, username, teachersList }) => {

  console.log("TOP-LEVEL in CHALLENGE!!: If you never see me, this file never mounts.");

  const [activeTaskIndex, setActiveTaskIndex] = useState(null);
  const [progressFilled, setProgressFilled] = useState(0);
  const [tasksEnabled, setTasksEnabled] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("Username " + username);
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
    const enabled = Array.from({ length: tasksNumber }, (_, index) => {
      if (index < finishedTasks) return false;
      if (index === finishedTasks) return true;
      return false;
    });
    setTasksEnabled(enabled);
    const progress = tasksNumber !== 0 ? (finishedTasks / tasksNumber) * 100 : 0;
    console.log("progress:" + progress)
    setProgressFilled(progress);
  };

  // API call to create a new event
  const postEvent = async (finishedTasks) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/post_event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if required
          // 'Authorization': `Bearer YOUR_AUTH_TOKEN`,
        },
        body: JSON.stringify({
          user_id: id,
          event_name: `${challengeDetailsItem.title} ${challengeDetailsItem.date}`,
          sbt_id: challengeDetailsItem.id,
          status: 'run',
          username: username,
          finished_tasks: finishedTasks,
          tasks_number: challengeDetailsItem.tasks.length,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Post Event API Response:', data);
      initializeTasks(data.event.tasks_number, data.event.finished_tasks);
    } catch (error) {
      console.error('Post Event API call error:', error);
      setError(error.message);
    }
  };

  // API call to update an existing event
  const updateEvent = async (finishedTasks) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/update_event`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if required
          // 'Authorization': `Bearer YOUR_AUTH_TOKEN`,
        },
        body: JSON.stringify({
          user_id: id,
          sbt_id: challengeDetailsItem.id,
          status: finishedTasks === challengeDetailsItem.tasks.length ? 'completed' : 'run', // Adjust based on your status logic
          username: username, // If needed
          finished_tasks: finishedTasks,
          tasks_number: challengeDetailsItem.tasks.length,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Update Event API Response:', data);
      initializeTasks(data.event.tasks_number, data.event.finished_tasks);
    } catch (error) {
      console.error('Update Event API call error:', error);
      setError(error.message);
    }
  };

  // Fetch event data from API
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const url = new URL(`${API_CONFIG.BASE_URL}/get_event`);
        url.searchParams.append('user_id', id);
        url.searchParams.append('sbt_id', challengeDetailsItem.id);

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // TODO: Add Authorization header
            // 'Authorization': `Bearer YOUR_AUTH_TOKEN`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message === "Event not found for the given user_id and event_id") { // Adjust based on your actual error message
            console.warn("Event not found, creating a new event record...");
            // Create a new event with 0 finished tasks
            await postEvent(0);
          } else {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
        } else {
          const eventData = await response.json();
          if (eventData && eventData.finished_tasks !== undefined) {
            const { tasks_number, finished_tasks } = eventData;
            initializeTasks(tasks_number, finished_tasks);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Fetch Event API call error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEventData();
  }, [challengeDetailsItem.id, id]);

  // Initialize tasksData from challengeDetailsItem.tasks
  useEffect(() => {
    if (challengeDetailsItem.tasks && challengeDetailsItem.tasks.length > 0) {
      setTasksData(challengeDetailsItem.tasks);
    }
  }, [challengeDetailsItem.tasks]);

  const handleTaskClick = async (index) => {
    if (!tasksEnabled[index]) return;

    setActiveTaskIndex(index);
    const newFinishedTasks = Math.min(index + 1, tasksData.length);
    await updateEvent(newFinishedTasks);
  };

  if (loading) {
    return <div className="spinner-container">
      <img src={logo} className="spinner-logo" alt="Загрузка..." />
    </div>;
  }

  if (error) {
    console.log(error)
    return <div className="challenge-detail"><p>Ошибка:  </p><p>Обновите страницу.</p></div>;
  }

  return (
    <div className="challenge-detail">
      <div className="image-container">
        <img src={challengeDetailsItem.image_url} alt="Challenge!" className="challenge-image" />
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
