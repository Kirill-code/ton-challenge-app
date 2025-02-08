// src/DailyExerciseList.jsx
import React from 'react';
import './DailyExerciseList.css'; // optional CSS
import leftArrow from './assets/Left.png';


function DailyExerciseList({ exercises, onExerciseClick }) {
    if (!Array.isArray(exercises) || exercises.length === 0) {
        return <p style={{ padding: '16px' }}>Нет упражнений.</p>;
    }

    return (
        <div className="exercises-list">
            {exercises.map((ex, idx) => (
                <div
                    key={idx}
                    className="exercise-item"
                    onClick={() => onExerciseClick(ex)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') onExerciseClick(ex);
                    }}
                >
                    <div className="exercise-content">
                        <p className="exercise-title">{ex.title}</p>
                        <p className="exercise-subtitle">{ex.description}</p>
                    </div>
                    {/* optional arrow or icon */}
                    <img src={leftArrow} alt=">" />
                </div>
            ))}
        </div>
    );
}

export default DailyExerciseList;
