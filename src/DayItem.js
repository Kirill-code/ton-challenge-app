// DayItem.jsx
import React from 'react';
import './DayItem.css';
import leftArrow from './assets/Left.png';
import { Lock } from 'lucide-react';
const DayItem = ({ dayData, locked, onClick }) => {
  // You can add a lock icon, dim the text, etc.
  return (
    <div
      className={`day-item ${locked ? 'locked' : ''}`}
      onClick={onClick}
    >
      <div className="day-content">
        <h3 className="day-title">{dayData.title}</h3>
        <p className="day-subtitle">{dayData.description}</p>
      </div>
      {locked
        ? <div className="day-arrow"> <Lock size={18} /></div>
        : <div className="day-arrow"><img src={leftArrow} alt=">" /></div>
      }
    </div>
  );
};

export default DayItem;
