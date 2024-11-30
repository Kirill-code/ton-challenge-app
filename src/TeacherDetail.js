import React, { useState } from 'react';
import './TeacherDetail.css';


const TeacherDetail = ({ teacherDetail }) => {


  return (
    <div className="class-detail-teacher">
      <div className="class-image-container-teacher">
        <img src={teacherDetail.teacherImageUrl} alt="ClassImage" className="class-image-details-teacher" />
      </div>
      <div className='teacher-details-container'>
        <p className="class-description-details-teacher">{teacherDetail.type}</p>

        <p className="class-title-details-teacher">{teacherDetail.teacherName}</p>
        <div className='teacher-tg-container'>
          <a className='teacher-tg-txt' href={teacherDetail.teacherTgUrl}>{teacherDetail.tag}</a>
        </div>
      </div>
      <div className="classes-section">
        <h3 className="section-title">обо мне </h3>
      </div>
      <div className='teacher-description-full-container'>
        <p className='teacher-description-full'>{teacherDetail.description}</p>
      </div>
      <div className="classes-section">
        <h3 className="section-title">Достижения</h3>
        <a className="see-all" >ВСЕ</a>
      </div>
      <p className='comming-soon'>Скоро в приложении</p>

      <div className="classes-section">
        <h3 className="section-title">КЛАССЫ</h3>
        <a className="see-all" >ВСЕ</a>

      </div>
      <p className='comming-soon'>Скоро в приложении</p>

      



    </div>
  );
};

export default TeacherDetail;
