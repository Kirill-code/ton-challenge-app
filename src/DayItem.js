// src/DayItem.jsx
import React from 'react';
import './DayItem.css'; // optional CSS
import leftArrow from './assets/Left.png';

const DayItem = ({ dayData, onClick }) => {
    return (
        <div className="day-item" onClick={onClick}>
            <div className="day-content">
                <h3 className="day-title">{dayData.title}</h3>
                <p className="day-subtitle">{dayData.description}</p>
            </div>
            <img src={leftArrow} alt=">" />
        </div>
    );
};

export default DayItem;
