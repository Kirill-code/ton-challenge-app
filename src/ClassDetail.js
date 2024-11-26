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

  // Function to handle Participate button click
  const handleParticipateClick = () => {
    alert('Master will contact you soon');
  };

  // Function to handle Share button click
  const handleShareClick = async () => {
    const shareData = {
      title: `Join ${title}`,
      text: `Check out this class: ${title} by ${teacherName}. ${description}`,
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
      navigator.clipboard.writeText(`${title} - ${description} \n${window.location.href}`);
      alert('Link copied to clipboard');
    }
  };

  // Function to handle Add to Calendar button click
  const handleAddToCalendarClick = () => {
    // Define the event details for the .ics file
    const eventStartDate = new Date(date).toISOString().replace(/-|:|\.\d+/g, ""); // Convert the date to UTC format (YYYYMMDDTHHMMSSZ)
    const eventEndDate = new Date(new Date(date).getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, ""); // 1 hour after start date

    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Company//Class Detail//EN
BEGIN:VEVENT
UID:${Date.now()}@yourcompany.com
DTSTAMP:${eventStartDate}Z
DTSTART:${eventStartDate}Z
DTEND:${eventEndDate}Z
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:Online
END:VEVENT
END:VCALENDAR
    `;

    // Create a Blob from the ics content
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className='class-details-btn' onClick={handleShareClick}><Share/><p className='class-btn-txt'>Share Class</p></div>
        <div className='class-details-btn' onClick={handleAddToCalendarClick}><Calendar/><p className='class-btn-txt'>Add to Calendar</p></div>
      </div>
      <div className='participate-btn' onClick={handleParticipateClick}>
        <p className='participate-btn-txt'>Participate</p>
      </div>
    </div>
  );
};

export default ClassDetail;
