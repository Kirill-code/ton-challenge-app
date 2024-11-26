/*
 * Copyright © 2024, Kirill Code.
 * Business Source License 1.1
 * Change Date: November 23, 2026
 */
import React from 'react';
import './CalendarView.css'; // Add a CSS file to style the component

const CalendarView = ({ classesData, onClassClick }) => {
  return (
    <div className="calendar-view">
      {classesData.map((classItem, index) => (
        <div key={index} className="class-card" onClick={() => onClassClick(classItem)}>
          <img src={classItem.url} alt="Class" className="class-image" />
          <div className="class-details">
            <div className='class-date-price-container'>
              <p className="class-date">{classItem.date} · Online</p>
              <div className="class-price">
                {classItem.price === "free" ? (
                  <span className="price-free">{classItem.price}</span>
                ) : (
                  <span className="price-paid">{classItem.price}</span>
                )}
              </div>
            </div>
            <h3 className="class-title">{classItem.title}</h3>
            <p className="class-description">{classItem.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarView;