import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import logo from './assets/logo.png';
import { API_CONFIG } from './config';
import DayItem from './DayItem';
import DailyExerciseList from './DailyExerciseList';
import VideoScreen from './VideoScreen';
import './ChallengeDetail.css';

function ChallengeDetail({
  challengeDetailsItem,
  id,
  username,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [eventData, setEventData] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);

  // For confetti
  const [showConfetti, setShowConfetti] = useState(false);

  // For playing a video
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedVideoLink, setSelectedVideoLink] = useState(null);

  // Flatten all daily exercises
  const days = challengeDetailsItem.tasks || [];
  const allExercises = days.flatMap(d => d.dailyExercise || []);
  const totalExercises = allExercises.length;

  // “lockedDays” array we’ll compute once we have eventData
  const [lockedDays, setLockedDays] = useState([]);

  // --------------------- FETCH OR CREATE EVENT ---------------------
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const url = new URL(`${API_CONFIG.BASE_URL}/get_event`);
        url.searchParams.append('user_id', id);
        url.searchParams.append('sbt_id', challengeDetailsItem.id);

        let response = await fetch(url.toString(), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        let data = await response.json();

        // Check the result
        if (response.ok && data?.eventData) {
          setEventData(data.eventData);
          computeLocking(data.eventData);
        } else if (
          data?.message === 'Event not found for the given user_id and event_id'
        ) {
          // create a new event with 0 finished tasks
          await postEvent(0, totalExercises);
        } else {
          throw new Error(data?.message || 'Could not fetch event data');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching event data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    const postEvent = async (finishedTasks, tasksNumber) => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/post_event`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: id,
            event_name: `${challengeDetailsItem.title} ${challengeDetailsItem.date}`,
            sbt_id: challengeDetailsItem.id,
            status: 'run',
            username,
            finished_tasks: finishedTasks,
            tasks_number: tasksNumber,
            tasks: JSON.stringify(challengeDetailsItem.tasks),
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'post_event failed');
        }
        setEventData(data.event);
        computeLocking(data.event);
      } catch (error) {
        console.error('postEvent error:', error);
        setError(error.message);
      }
    };

    fetchEventData();
  }, [challengeDetailsItem.id, challengeDetailsItem.tasks, id, username, totalExercises]);

  // --------------------- DAY LOCKING LOGIC ---------------------
  function computeLocking(eventObj) {
    if (!eventObj?.created_at) return;

    const eventStart = new Date(eventObj.created_at).getTime();
    const now = Date.now();

    const nextLockedDays = days.map((day, i) => {
      if (i === 0) {
        // first day always unlocked
        return false; // false => not locked
      }
      const unlockTime = eventStart + (day.duration || 0) * 86400000;
      return now < unlockTime; // true => locked if now < unlockTime
    });

    setLockedDays(nextLockedDays);
  }

  // --------------------- UPDATE FINISHED TASKS ---------------------
  const updateEventFinishedTasks = async (newFinishedCount) => {
    if (!eventData) return;
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/update_event`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: id,
          sbt_id: challengeDetailsItem.id,
          status: (newFinishedCount >= totalExercises) ? 'completed' : 'run',
          username,
          finished_tasks: newFinishedCount,
          tasks_number: totalExercises,
          tasks: JSON.stringify(challengeDetailsItem.tasks),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'update_event failed');
      }

      // If user just finished the final task => show confetti
      if (newFinishedCount >= totalExercises) {
        setShowConfetti(true);
        // auto-hide after 5s
        setTimeout(() => setShowConfetti(false), 5000);
      }

      setEventData(data.event);
    } catch (error) {
      console.error('updateEvent error:', error);
      setError(error.message);
    }
  };

  // --------------------- CLICK HANDLERS ---------------------
  // 1) Clicking a day -> if locked, block; else show detail
  const handleDayClick = (index) => {
    if (lockedDays[index]) {
      alert('Этот день пока недоступен!');
      return;
    }
    setSelectedDayIndex(index);
  };

  // 2) Clicking an exercise => open the video. We do NOT increment tasks here
  const handleExerciseClick = (exercise) => {
    setSelectedVideoLink(exercise.videoLink);
    setVideoOpen(true);
  };

  // Called by VideoScreen once the user finishes the video
  // We keep the video screen open but show confetti for 5s
  const handleVideoFinished = () => {
    const currentFinished = eventData?.finished_tasks || 0;
    if (currentFinished < totalExercises) {
      updateEventFinishedTasks(currentFinished + 1);
    }
    // DO NOT close the video
    // Instead, user can close it manually
  };

  // 3) If user closes the video manually
  const handleCloseVideo = () => {
    setVideoOpen(false);
    setSelectedVideoLink(null);
  };

  // --------------------- RENDERING ---------------------
  if (loading) {
    return (
      <div className="spinner-container">
        <img src={logo} className="spinner-logo" alt="Загрузка..." />
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ padding: '16px', color: '#fff' }}>
        <p>Ошибка: {error}</p>
        <p>Обновите страницу.</p>
      </div>
    );
  }

  // Overall progress
  const finishedTasks   = eventData?.finished_tasks || 0;
  const progressPercent = totalExercises
    ? Math.round((finishedTasks / totalExercises) * 100)
    : 0;

  // If a day is selected, show day detail
  if (selectedDayIndex !== null) {
    const selectedDay = days[selectedDayIndex];
    return (
      <div className="day-detail-screen">
        {showConfetti && (
          <Confetti
            style={{ zIndex: 10000 }} 
          />
        )}

        <h2 style={{ color: '#fff', margin: '16px' }}>
          {selectedDay.title}
        </h2>
        <p style={{ color: '#707579', margin: '16px' }}>
          {selectedDay.description}
        </p>

        <DailyExerciseList
          exercises={selectedDay.dailyExercise || []}
          onExerciseClick={handleExerciseClick}
        />

        {/* If a video is open, show the VideoScreen (on top) */}
        {videoOpen && (
          <VideoScreen
            videoLink={selectedVideoLink}
            onClose={handleCloseVideo}
            onVideoEnd={handleVideoFinished}
          />
        )}
      </div>
    );
  }

  // Otherwise, show main challenge screen
  return (
    <div className="challenge-detail">
      {/* Confetti in main screen too, if needed */}
      {showConfetti && (
        <Confetti
          style={{ zIndex: 10000 }}
        />
      )}

      {videoOpen && (
        <VideoScreen
          videoLink={selectedVideoLink}
          onClose={handleCloseVideo}
          onVideoEnd={handleVideoFinished}
        />
      )}

      <div className="image-container">
        <img
          src={challengeDetailsItem.image_url}
          alt="Challenge!"
          className="challenge-image"
        />
      </div>

      <p className="challenge-title-details">
        {challengeDetailsItem.title}
      </p>
      <p className="challenge-description-details">
        {challengeDetailsItem.description}
      </p>

      {/* Progress bar */}
      <div className="challenge-progress" style={{ margin: '16px' }}>
        <div
          className="challenge-progress-filled"
          style={{
            backgroundColor: '#007AFF',
            height: '16px',
            width: `${progressPercent}%`,
            transition: 'width 0.5s ease',
            borderRadius: '16px',
          }}
        />
      </div>

      <div style={{ marginTop: '16px' }}>
        {days.map((day, index) => {
          const isLocked = lockedDays[index] || false;
          return (
            <DayItem
              key={index}
              dayData={day}
              locked={isLocked}
              onClick={() => handleDayClick(index)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ChallengeDetail;
