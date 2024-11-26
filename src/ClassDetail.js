import React, { useState } from 'react';
import YouTube from 'react-youtube';
import './ClassDetail.css';
import { ReactComponent as Pin } from '../src/assets/pin.svg';
import { ReactComponent as Clock } from '../src/assets/clock.svg';
import { ReactComponent as Money } from '../src/assets/money.svg';
import { ReactComponent as Share } from '../src/assets/share.svg';
import { ReactComponent as Calendar } from '../src/assets/calendar.svg';

const ClassDetail = ({ imageUrl, title, description, type, date, wallet_address, price, teacherName, teacherDescription, teacherImageUrl }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [progressFilled, setProgressFilled] = useState(false); // State to track progress fill

  // Function to handle task click and make API call
  const handleTaskClick = async () => {
    try {
      // Trigger the video display
      setShowVideo(true);
      setProgressFilled(true);

      // API call to log the event
      const response = await fetch('https://d5daginsfb4svds4mjjs.apigw.yandexcloud.net/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: wallet_address,
          event_name: 'Breathing Practice',
          event_id: 'task_1',
          status: 'run',
          user_wallet: '123',
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

    } catch (error) {
      console.error('API call error:', error);
    }
  };

  // Function to handle Participate button click
  const handleParticipateClick = () => {
    alert('Master will contact you soon');
  };

  return (
    <div className="class-detail">
      <div className="class-image-container">

        <img src={imageUrl} alt="ClassImage" className="class-image-details" />
      </div>
      <p className="class-title-details">{title}</p>

      <p className="class-description-details">{description}</p>
      {/* MASTER DETAILS */}
      <div className="class-card-teacher-details" >
        <img src={teacherImageUrl} className="class-image-teacher-details" />

        <div className="class-details-teacher-details">
          <div className='class-date-price-container'>
            <p className="class-date-teacher-details">{teacherDescription.split(' ').slice(0, 2).join(' ')}</p>

          </div>
          <h3 className="class-title-teacher-details">{teacherName}</h3>
          <p className="class-description-teacher-details">{teacherDescription.split(' ').slice(2).join(' ')}</p>
        </div>
      </div>
      <div className='class-information'>
        <div className='class-line'><Pin/><p>Online</p></div>
        <div className='class-line'><Clock/><p>{date}</p></div>
        <div className='class-line'><Money/><p>{price}</p></div>
      </div>
      <div className='class-information-btn'>
        <div className='class-details-btn'><Share/><p className='class-btn-txt'>Share Class</p></div>
        <div className='class-details-btn'><Calendar/><p className='class-btn-txt'>Add to Calendar</p></div>
      </div>
      <div className='participate-btn' onClick={handleParticipateClick}>
        <p className='participate-btn-txt'>Participate</p>
      </div>
    </div>
  );
};

export default ClassDetail;
