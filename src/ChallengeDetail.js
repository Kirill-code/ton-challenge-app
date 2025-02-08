import React, { useState, useEffect } from 'react';
import logo from './assets/logo.png';
import { API_CONFIG } from './config';
// Components
import DayItem from './DayItem';
import DailyExerciseList from './DailyExerciseList';

import './ChallengeDetail.css';
function ChallengeDetail({
  challengeDetailsItem, // SBT with .tasks = [day1, day2, ...]
  id,                  // user ID (Telegram chat id)
  username,            // user’s name or username
  onOpenVideo          // callback to open a video in your parent
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [eventData, setEventData] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);

  // 1) Flatten all daily exercises so we know total # for progress
  const flattenExercises = (days) => {
    if (!Array.isArray(days)) return [];
    return days.flatMap((day) => day.dailyExercise || []);
  };

  const days = challengeDetailsItem.tasks || [];
  const allExercises = flattenExercises(days);
  const totalExercises = allExercises.length;

  // 2) On mount, fetch (or create) the event
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);

        // Attempt to get existing event
        const url = new URL(`${API_CONFIG.BASE_URL}/get_event`);
        url.searchParams.append('user_id', id);
        url.searchParams.append('sbt_id', challengeDetailsItem.id);

        let response = await fetch(url.toString(), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        let data = await response.json();

        if (response.ok && data?.eventData) {
          setEventData(data.eventData);
        } else if (data?.message === 'Event not found for the given user_id and event_id') {
          // If not found, create a new event with 0 finished tasks
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

    // CREATE new event
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
            tasks: JSON.stringify(challengeDetailsItem.tasks), // optional
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'post_event failed');
        }
        setEventData(data.event);
      } catch (error) {
        console.error('postEvent error:', error);
        setError(error.message);
      }
    };

    fetchEventData();
  }, [challengeDetailsItem.id, challengeDetailsItem.tasks, id, username, totalExercises]);

  // 3) Helper to update finished tasks
  const updateEventFinishedTasks = async (newFinishedCount) => {
    if (!eventData) return; // no event to update
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/update_event`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: id,
          sbt_id: challengeDetailsItem.id,
          status: newFinishedCount >= totalExercises ? 'completed' : 'run',
          username,
          finished_tasks: newFinishedCount,
          tasks_number: totalExercises,
          tasks: JSON.stringify(challengeDetailsItem.tasks), // optional
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'update_event failed');
      }
      setEventData(data.event);
    } catch (error) {
      console.error('updateEvent error:', error);
      setError(error.message);
    }
  };

  // 4) If user clicks a day -> setSelectedDayIndex
  const handleDayClick = (index) => {
    setSelectedDayIndex(index);
  };

  // 5) If user clicks an exercise -> increment finished tasks + open video
  const handleExerciseClick = (exercise) => {
    // increment finished tasks (if not done)
    const currentFinished = eventData?.finished_tasks || 0;
    if (currentFinished < totalExercises) {
      updateEventFinishedTasks(currentFinished + 1);
    }
    // open the video
    if (onOpenVideo) {
      onOpenVideo(exercise.videoLink);
    }
  };

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

  // Calc overall progress
  const finishedTasks = eventData?.finished_tasks || 0;
  const progressPercent = totalExercises
    ? Math.round((finishedTasks / totalExercises) * 100)
    : 0;

  // If a day is selected, show that day’s detail in a separate “page.”
  if (selectedDayIndex !== null) {
    const selectedDay = days[selectedDayIndex];
    return (
      <div className="day-detail-screen">
    

        <h2 style={{ color: '#fff', margin: '16px' }}>{selectedDay.title}</h2>
        <p style={{ color: '#707579', margin: '16px' }}>
          {selectedDay.description}
        </p>

        {/* Render the daily exercise list */}
        <DailyExerciseList
          exercises={selectedDay.dailyExercise || []}
          onExerciseClick={handleExerciseClick}
        />
      </div>
    );
  }

  // Otherwise, show the main “Challenge” screen with day cards
  return (
    <div className="challenge-detail">
      {/* Hero image */}
      <div className="image-container">
        <img
          src={challengeDetailsItem.image_url}
          alt="Challenge!"
          className="challenge-image"
        />
      </div>

      {/* Title/Description */}
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
      {/* <p style={{ marginLeft: '16px', color: '#707579' }}>
        Выполнено: {finishedTasks} из {totalExercises}
      </p> */}

      {/* List of day cards */}
      <div style={{ marginTop: '16px' }}>
        {days.map((day, index) => (
          <DayItem
            key={index}
            dayData={day}
            onClick={() => handleDayClick(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default ChallengeDetail;
