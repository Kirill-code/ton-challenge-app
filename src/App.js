import React, { useState, useEffect } from "react";
import "./App.css";
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import yogaImage from './assets/yoga.png';
import bikeImage from './assets/bike.png';
import runImage from './assets/run.png';

import { Home, Grid, Calendar, User } from 'lucide-react';
import ChallengeDetail from './ChallengeDetail';

function App() {
  const [currentDate, setCurrentDate] = useState("");
  const [activeTab, setActiveTab] = useState('home');
  const [selectedChallenge, setSelectedChallenge] = useState(null); // New state for selected challenge
  const wallet = useTonWallet();
  const isConnected = !!wallet;

  useEffect(() => {
    const today = new Date();
    const options = { day: '2-digit', month: 'long' };
    const formattedDate = today.toLocaleDateString("en-GB", options);
    setCurrentDate(formattedDate);
  }, []);

  const handleCardClick = (challenge) => {
    setSelectedChallenge(challenge);
    setActiveTab('grid'); // Set to 'grid' to match the condition
  };

  const handleBack = () => {
    setSelectedChallenge(null);
    setActiveTab('home'); // Go back to main screen
  };

  return (
    <div className="app">
      {/* Conditionally render the header or the ChallengeDetail title */}
      {activeTab === 'home' ? (
        <header className="header">
          <h1>Challenge</h1>
          <p className="date">{currentDate}</p>
        </header>
      ) : activeTab === 'grid' && selectedChallenge ? (
        <header className="header-grid">
          <button className="back-button" onClick={handleBack}>←</button>
          <h2 className="header-title">Challenge</h2>
        </header>
      ) : null}

      {!isConnected && (
        <div className="notification">
          <p className="notification-title">Introducing TON Space</p>
          <p className="notification-subtitle">
            To use the app, connect your wallet
          </p>
          <div className="wallet-connect">
            <TonConnectButton />
          </div>
        </div>
      )}

      {activeTab === 'grid' && selectedChallenge ? (
        <ChallengeDetail
          img={selectedChallenge.img}
          type={selectedChallenge.type}
          title={selectedChallenge.title}
          description={selectedChallenge.description}
          onBack={handleBack}
        />
      ) : (
        <div className="cards-container">
          <div
            className="card"
            onClick={() => handleCardClick({
              img: yogaImage,
              title: "7 Days to Harmony",
              description: "Improve your well-being in just one week",
              type:"Yoga"
            })}
          >
            <div className="card-image-yoga"></div>
            <div className="card-tag">Yoga</div>
            <div className="card-text">
              <h2 className="card-title">7 Days to Harmony</h2>
              <p className="card-description">
                Improve your well-being in just one week
              </p>
            </div>
          </div>

          <div
            className="card"
            onClick={() => handleCardClick({
              img: bikeImage,
              title: "Cycling Adventure",
              description: "Discover new horizons on two wheels",
              type:"Bike"
            })}
          >
            <div className="card-image-bike"></div>
            <div className="card-tag">Bike</div>
            <div className="card-text">
              <h2 className="card-title">Cycling Adventure</h2>
              <p className="card-description">
                Discover new horizons on two wheels
              </p>
            </div>
          </div>

          <div
            className="card"
            onClick={() => handleCardClick({
              img: runImage,
              title: "Run to your goal",
              description: "Start your day actively",
              type:"Run"
            })}
          >
            <div className="card-image-run"></div>
            <div className="card-tag">Run</div>
            <div className="card-text">
              <h2 className="card-title">Run to your goal</h2>
              <p className="card-description">
                Start your day actively
              </p>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <div
          className={`footer-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home size={24} />
        </div>
        <div
          className={`footer-item ${activeTab === 'grid' ? 'active' : ''}`}
          onClick={() => setActiveTab('grid')}
        >
          <Grid size={24} />
        </div>
        <div
          className={`footer-item ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <Calendar size={24} />
        </div>
        <div
          className={`footer-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={24} />
        </div>
      </footer>
    </div>
  );
}

export default App;
