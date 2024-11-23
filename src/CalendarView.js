/*
 * Copyright © 2024, Kirill Code.
 * Business Source License 1.1
 * Change Date: November 23, 2026
 */
import React from 'react';
import './CalendarView.css'; // Add a CSS file to style the component

const CalendarView = () => {
  // Mock data for classes
  const classesData = [
    { date: "Nov 16", title: "Ktutoe nazvanie", description: "Online somatic therapy groups", price: "free", url: "https://storage.yandexcloud.net/start-image/holder.png" },
    { date: "Nov 16", title: "Ktutoe nazvanie", description: "Online somatic therapy groups", price: "10 USDT", url: "https://storage.yandexcloud.net/start-image/holder.png" },
    { date: "Nov 16", title: "Ktutoe nazvanie", description: "Online somatic therapy groups", price: "free", url: "https://storage.yandexcloud.net/start-image/holder.png" },
    { date: "Nov 16", title: "Ktutoe nazvanie", description: "Online somatic therapy groups", price: "free", url: "https://storage.yandexcloud.net/start-image/holder.png" },
    { date: "Nov 16", title: "Ktutoe nazvanie", description: "Online somatic therapy groups", price: "10 USDT", url: "https://storage.yandexcloud.net/start-image/holder.png" },
    { date: "Nov 16", title: "Ktutoe nazvanie", description: "Online somatic therapy groups", price: "free", url: "https://storage.yandexcloud.net/start-image/holder.png" }
  ];

  return (
    <div className="calendar-view">
      {classesData.map((classItem, index) => (
        <div key={index} className="class-card">
          <img src={classItem.url} alt="Class" className="class-image" />
          <div className="class-price">
            {classItem.price === "free" ? (
              <span className="price-free">{classItem.price}</span>
            ) : (
              <span className="price-paid">{classItem.price}</span>
            )}
          </div>
          <div className="class-details">
            <p className="class-date">{classItem.date} · Online</p>
            <h3 className="class-title">{classItem.title}</h3>
            <p className="class-description">{classItem.description}</p>
          </div>

        </div>
      ))}
    </div>
  );
};

export default CalendarView;
