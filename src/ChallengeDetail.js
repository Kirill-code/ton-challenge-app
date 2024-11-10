import React from 'react';
import "./ChallengeDetail.css";

const ChallengeDetail = ({ img, title, description, type, onBack }) => {
  
  // Function to handle task click and make API call
  const handleTaskClick = async () => {
    try {
      const response = await fetch("https://d5daginsfb4svds4mjjs.apigw.yandexcloud.net/event", {
        method: "POST", // or "GET" based on your API requirements
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: 123, // You may replace this with actual user data
          event_name: "Breathing Practice",
          event_id: "task_1",
          status: "run"
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      
    } catch (error) {
      console.error("API call error:", error);
    }
  };

  return (
    <div className="challenge-detail">
      <div className="challenge-header">
        <div className="image-container">
          <img src={img} alt="Challenge" className="challenge-image" />
          <div className="card-tag">{type}</div>
        </div>
      </div>
      
      <p className="challenge-description">{description}</p>
      
      <div className="tasks">
        {/* Attach the onClick handler to the task div */}
        <div className="task" onClick={handleTaskClick}>
          <span>🧘</span> <span>Дыхательная практика</span> <span>5 минут медитации</span>
        </div>
        
        <div className="task">
          <span>📅</span> <span>Онлайн-занятие</span> <span>Обучение базовой асаны</span>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;
