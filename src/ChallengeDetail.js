import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import './ChallengeDetail.css';
import API_CONFIG from './config';

const ChallengeDetail = ({ challengeDetailsItem, id, username, teachersList }) => {
  const [activeTaskIndex, setActiveTaskIndex] = useState(null);
  const [progressFilled, setProgressFilled] = useState(0);
  const [tasksEnabled, setTasksEnabled] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // console.log("SBT:" + challengeDetailsItem.sbt_id)
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
    const progress = (finishedTasks / tasksNumber) * 100;
    setProgressFilled(progress);
  };

  // API call to log the event
  const postEvent = async (finishedTasks) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/post_event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: id,
          event_name: `${challengeDetailsItem.title} ${challengeDetailsItem.date}`,
          sbt_id: challengeDetailsItem.sbt_id,
          status: 'run',
          user_wallet: '123',
          username: username,
          finished_tasks: finishedTasks,
          tasks_number: challengeDetailsItem.tasks.length
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      initializeTasks(tasksData.length, finishedTasks);
    } catch (error) {
      console.error('API call error:', error);
    }
  };

  // Fetch event data from API
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const url = new URL(`${API_CONFIG.BASE_URL}/get_event`);
        url.searchParams.append('user_id', id);
        url.searchParams.append('sbt_id', challengeDetailsItem.sbt_id);

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // Check if the error is related to the "Event not found" case
          const errorData = await response.json();
          if (errorData.message === "Event not found for the given user_id and event_id") {
            console.warn("Event not found, creating a new event record...");
            // If no rows found, initialize with 0 and create a record
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
        console.error('API call error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEventData();
  }, [challengeDetailsItem.sbt_id, id]);

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
    postEvent(newFinishedTasks);
  };

  if (loading) {
    return <div className="challenge-detail"><p>Загрузка...</p></div>;
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
