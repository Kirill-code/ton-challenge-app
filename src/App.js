import React, { useState, useEffect } from "react";
import "./App.css";
import { TonConnectButton, useTonWallet, useTonAddress } from '@tonconnect/ui-react';
import { Home, Grid, Calendar, User } from 'lucide-react';
import ChallengeDetail from './ChallengeDetail';
import VerticalCardList from './VerticalCardList';
import UserProfile from './UserProfile'; // Import UserProfile component
import CalendarView from './CalendarView'; // Import the CalendarView component

// Import images and assets
import yogaImage from './assets/yoga.png';
import bikeImage from './assets/bike.png';
import runImage from './assets/run.png';
import Classes_hard from './assets/classes.png';

// Import data array for cards (if card data is large, you can move it to a separate file)
const cardDataArray = [
  { title: "Vladimir Mityukov", link: "https://t.me/yogalizaciya", description: "Yoga teacher of the Iyengar Yoga tradition", imageUrl: 'https://storage.yandexcloud.net/start-image/masters/volodya.jpg' },
  { title: "Karina Kodak", link: "https://t.me/yogalizaciya", description: "I teach Vajra Yoga...", imageUrl: 'https://storage.yandexcloud.net/start-image/masters/karina.jpg' },
  { title: "Kirill Ponomarev", link: "https://t.me/yogalizaciya", description: "Vajra Yoga teacher", imageUrl: 'https://storage.yandexcloud.net/start-image/masters/Kirill.jpg' },
  // ... add more card data as needed
];

function App() {
  const [currentDate, setCurrentDate] = useState("");
  const [activeTab, setActiveTab] = useState('home');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const wallet = useTonWallet();
  const rawAddress = useTonAddress();

  useEffect(() => {
    const today = new Date();
    const options = { day: '2-digit', month: 'long' };
    setCurrentDate(today.toLocaleDateString("en-GB", options));
  }, []);

  const handleCardClick = (challenge) => {
    setSelectedChallenge(challenge);
    setActiveTab('grid');
  };

  const handleBack = () => {
    setSelectedChallenge(null);
    setActiveTab('home');
  };

  // const CalendarView = () => (
  //   <div>
  //     <h2 className="header-title">Teachers</h2>
  //     <VerticalCardList cardsData={cardDataArray} />
  //   </div>
  // );

  return (
    <div className="app">
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

      {!wallet && activeTab === 'home' && (
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

      {activeTab === 'profile' ? (
        <UserProfile /> // Render UserProfile component on the 'profile' tab
      ) : activeTab === 'calendar' ? (
        <CalendarView />
      ) : activeTab === 'grid' && selectedChallenge ? (
        <ChallengeDetail
          img={selectedChallenge.img}
          type={selectedChallenge.type}
          title={selectedChallenge.title}
          description={selectedChallenge.description}
          onBack={handleBack}
          wallet_address={selectedChallenge.wallet_address}
        />
      ) : (
        <div className="cards-container">
          {/* Card Components */}
          <div
            className="card"
            onClick={() => handleCardClick({
              img: yogaImage,
              title: "7 Days to Harmony",
              description: "Improve your well-being in one week",
              type: "Yoga",
              wallet_address: rawAddress
            })}
          >
            <div className="card-image-yoga"></div>
            <div className="card-tag">Yoga</div>
            <div className="card-text">
              <h2 className="card-title">7 Days to Harmony</h2>
              <p className="card-description">
                Improve your well-being in one week
              </p>
            </div>
          </div>

          <div
            className="card"
            onClick={() => handleCardClick({
              img: bikeImage,
              title: "Cycling Adventure",
              description: "Discover new horizons on two wheels",
              type: "Bike",
              wallet_address: rawAddress
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
              type: "Run",
              wallet_address: rawAddress
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
        <CalendarView />

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
