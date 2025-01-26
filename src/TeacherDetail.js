import React, { useState } from 'react';
import './TeacherDetail.css';
import CalendarView from './CalendarView';
import ReactMarkdown from 'react-markdown';


const TeacherDetail = ({ teacherDetail, classes, onClassClick }) => {
  const classesCurrentTeacher = classes.filter(
    (classItem) =>
      classItem.master_chat_id === teacherDetail.master_chat_id
    // console.log(classItem.master_chat_id)

  );

  console.log(classesCurrentTeacher)


  return (
    <div className="class-detail-teacher">
      <div className="class-image-container-teacher">
        <img src={teacherDetail.teacherImageUrl} alt="ClassImage" className="class-image-details-teacher" />
      </div>
      <div className='teacher-details-container'>
        <p className="class-description-details-teacher">{teacherDetail.type}</p>

        <p className="class-title-details-teacher">{teacherDetail.teachername}</p>
        <div className='teacher-tg-container'>
          <a className='teacher-tg-txt' href={teacherDetail.teachertgurl}>{teacherDetail.tag}</a>
        </div>
      </div>
      <div className="classes-section">
        <h3 className="section-title">обо мне </h3>
      </div>
      <div className='teacher-description-full-container'>
      <ReactMarkdown className='teacher-description-full'>{teacherDetail.description}</ReactMarkdown>
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
      {classesCurrentTeacher.length > 0 ? (
        <CalendarView
          classesData={classesCurrentTeacher}
          onClassClick={onClassClick} // Pass the handler down
        />
      ) : (

        <p className="comming-soon">Нет занятий</p>
      )}




    </div>
  );
};

export default TeacherDetail;
