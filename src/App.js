import React, { useState, useEffect } from "react";
import "./App.css";
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { ReactComponent as Yoga } from './assets/yoga.svg';
import { ReactComponent as Bike } from './assets/bike.svg';
import { ReactComponent as Run } from './assets/run.svg';
import { Home, Grid, Calendar, User } from 'lucide-react';

function App() {
  const [currentDate, setCurrentDate] = useState("");
  const [activeTab, setActiveTab] = useState('home');
  const wallet = useTonWallet();
  const isConnected = !!wallet; 

  useEffect(() => {
    const today = new Date();
    const options = { day: '2-digit', month: 'long' };
    const formattedDate = today.toLocaleDateString("en-GB", options);
    setCurrentDate(formattedDate);
  }, []);

  const handleCardClick = (title) => {
    console.log(`You clicked on ${title}`);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>Challenge</h1>
        <p className="date">{currentDate}</p>
       
      </header>

      {/* TON Space Notification */}
      {!isConnected && (
        <div className="notification">
          <p className="notification-title">Introducing TON Space</p>
          <p className="notification-subtitle">
            To use the app, connect your wallet
          </p>
          <div className="wallet-connect">
          <TonConnectButton />
        </div>        </div>
      )}

      {/* Challenge Cards */}
      <div className="cards-container">
        <div 
          className="card" 
          onClick={() => handleCardClick("7 Days to Harmony")}
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
          onClick={() => handleCardClick("Cycling Adventure")}
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
          onClick={() => handleCardClick("Run to your goal")}
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

      {/* Footer Navigation */}
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