/*
 * Copyright © 2024, Kirill Code.
 * Business Source License 1.1
 * Change Date: November 23, 2026
 */
import React from 'react';
import './TeacherView.css'; // Add a CSS file to style the component

const TeacherView = ({ classesData, onClassClick }) => {
  return (
    <div className="calendar-view-teacher">
      {classesData.map((classItem, index) => (
        <div key={index} className="class-card-teacher" onClick={() => onClassClick(classItem)}>
          <img src={classItem.teacherImageUrl} alt="Class" className="class-image-teacher" />
          <div className="class-details-teacher">
            <div className='class-date-price-container-teacher'>
              <p className="class-date-teacher">{classItem.sportType}</p>
             
            </div>
            <h3 className="class-title-teacher">{classItem.teachername}</h3>
            <p className="class-description-teacher">{classItem.type}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeacherView;