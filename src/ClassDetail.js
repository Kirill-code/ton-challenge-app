import React, { useState } from 'react';
// import YouTube from 'react-youtube';
import './ClassDetail.css';
import { ReactComponent as Pin } from '../src/assets/pin.svg';
import { ReactComponent as Clock } from '../src/assets/clock.svg';
import { ReactComponent as Money } from '../src/assets/money.svg';
import API_CONFIG from './config'; // Import the config

// import { ReactComponent as Share } from '../src/assets/share.svg';
// import { ReactComponent as Calendar } from '../src/assets/calendar.svg';

const ClassDetail = ({ classDetailsItem, onTeacherClick, id, username, teachersList }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [progressFilled, setProgressFilled] = useState(false); // State to track progress fill
  const teacher = teachersList.find(
    (teacher) => teacher.master_chat_id === classDetailsItem.master_chat_id
  );
  // Function to handle Participate button click
  const handleParticipateClick = async () => {
    try {
      // Trigger the video display
      setShowVideo(true);
      setProgressFilled(true);

      // API call to log the event

      const response = await fetch(`${API_CONFIG.BASE_URL}/visit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_chat_id: id,
          service_details: classDetailsItem.date+" "+classDetailsItem.title,
          event_id: classDetailsItem.title,
          status: 'scheduled',
          user_nickname: username,
          master_chat_id:classDetailsItem.master_chat_id
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

    alert('Преподаватель скоро свяжется с Вами. Пишите в бот @ArandjoBot в случае каких-либо проблем.');
  };

  // Function to handle Share button click
  const handleShareClick = async () => {
    const shareData = {
      title: `Join ${classDetailsItem.title}`,
      text: `Check out this class: ${classDetailsItem.title} by ${classDetailsItem.teacherName}. ${classDetailsItem.description}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('Class shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(`${classDetailsItem.title} - ${classDetailsItem.description} \n${window.location.href}`);
      alert('Link copied to clipboard');
    }
  };

  const handleTeacherDetailsClick = () => {
    onTeacherClick({
      sportType: teacher.sportType,
      teacherName: teacher.teacherName,
      type: teacher.type,
      teacherImageUrl: teacher.teacherImageUrl,
      teacherTgUrl: teacher.teacherTgUrl,
      tag: teacher.tag,
      description: teacher.description
    });
  };

  // Function to handle Add to Calendar button click
  const handleAddToCalendarClick = () => {
    // Define the event details for the .ics file
    const eventStartDate = new Date(classDetailsItem.date).toISOString().replace(/-|:|\.\d+/g, ""); // Convert the date to UTC format (YYYYMMDDTHHMMSSZ)
    const eventEndDate = new Date(new Date(classDetailsItem.date).getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, ""); // 1 hour after start date

    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Company//Class Detail//EN
BEGIN:VEVENT
UID:${Date.now()}arangjo@post.com
DTSTAMP:${eventStartDate}Z
DTSTART:${eventStartDate}Z
DTEND:${eventEndDate}Z
SUMMARY:${classDetailsItem.title}
DESCRIPTION:${classDetailsItem.description}
LOCATION:Online
END:VEVENT
END:VCALENDAR
    `;

    // Create a Blob from the ics content
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${classDetailsItem.title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="class-detail">
      <div className="class-image-container">
        <img src={classDetailsItem.imageUrl} alt="ClassImage" className="class-image-details" />
      </div>
      <p className="class-title-details">{classDetailsItem.title}</p>

      <p className="class-description-details">{classDetailsItem.classDescription}</p>
      {/* MASTER DETAILS */}
      <div className="class-card-teacher-details" onClick={handleTeacherDetailsClick} >
        <img src={teacher.teacherImageUrl} className="class-image-teacher-details" />

        <div className="class-details-teacher-details" >
          <div className='class-date-price-container'>
            <p className="class-date-teacher-details">{teacher.sportType}</p>

          </div>
          <h3 className="class-title-teacher-details">{teacher.teacherName}</h3>
          <p className="class-description-teacher-details">{teacher.type}</p>
        </div>
      </div>
      <div className='class-information'>
        <div className='class-line'><Pin /><p>Online</p></div>
        <div className='class-line'><Clock /><p>{classDetailsItem.date}</p></div>
        <div className='class-line'><Money /><p>{classDetailsItem.price}</p></div>
      </div>
      {/* <div className='class-information-btn'>
        <div className='class-details-btn' onClick={handleShareClick}><Share/><p className='class-btn-txt'>Share Class</p></div>
        <div className='class-details-btn' onClick={handleAddToCalendarClick}><Calendar/><p className='class-btn-txt'>Add to Calendar</p></div>
      </div> */}
      <div className='participate-btn' onClick={handleParticipateClick}>
        <p className='participate-btn-txt'>Участвую</p>
      </div>
    </div>
  );
};

export default ClassDetail;
