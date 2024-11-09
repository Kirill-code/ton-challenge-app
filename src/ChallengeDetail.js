import React from 'react';
import "./ChallengeDetail.css";

const ChallengeDetail = ({ img, title, description, type, onBack }) => {
  return (
    <div className="challenge-detail">
      {/* Update back button section to include the title */}
      {/* <div className="header-with-back">
        <button className="back-button" onClick={onBack}>←</button>
        <h2 className="challenge-title">{title}</h2>
      </div> */}

      <div className="challenge-header">
        <div className="image-container">
          <img src={img} alt="Challenge" className="challenge-image" />
          <div className="card-tag">{type}</div>
        </div>
      </div>
      
      <p className="challenge-description">{description}</p>
      
      <div className="tasks">
        <div className="task">
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
