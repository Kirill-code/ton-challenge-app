import React, { useState, useEffect } from "react";
import "./App.css";
import { TonConnectButton, useTonWallet, useTonAddress } from '@tonconnect/ui-react';
import yogaImage from './assets/yoga.png';
import bikeImage from './assets/bike.png';
import runImage from './assets/run.png';
import volodya from './assets/volodya.jpg';
import karina from './assets/karina.jpg';
import Kirill from './assets/Kirill.jpg';
import Irina from './assets/Irina.png';
import Nastya from './assets/Nastya.jpg';
import Sasha from './assets/Саша.jpg';
import Classes_hard from './assets/classes.png';

import { Home, Grid, Calendar, User } from 'lucide-react';
import ChallengeDetail from './ChallengeDetail';
import VerticalCardList from './VerticalCardList';

const cardDataArray = [
  { title: "Vladimir Mityukov",link:"https://t.me/yogalizaciya", description: "Yoga teacher of the Iyengar Yoga tradition", imageUrl: volodya },
  { title: "Karina Kodak",link:"https://t.me/yogalizaciya", description: "I teach Vajra Yoga. I guide students in working with the body using the Correct Approach to the Spine method .", imageUrl: karina },
  { title: "Kirill Ponomarev", link:"https://t.me/yogalizaciya",description: "Vajra Yoga teacher", imageUrl: Kirill },
  { title: "Irina Bogdanova",link:"https://t.me/yogalizaciya", description: "Yoga teacher Hyal. With abstract thinking, which is used by a practicing adept of yoga Hyal, the ability to go beyond the usual coordinate system develops.", imageUrl: Irina },
  { title: "Anastasya Ryabova  ", link:"https://t.me/yogalizaciya", description: "I teach yoga in the Iyengar tradition. I help learn how to combine yoga and sports. Yoga for sports is the perfect combo.", imageUrl: Nastya },
  { title: "Alexandr Gordeeva",link:"https://t.me/yogalizaciya", description: "I teach Vajra Yoga. Yoga is what takes away your haste and bustle and gives you peace", imageUrl: Sasha },

  // Add more cards as needed
];

function App() {
  const [currentDate, setCurrentDate] = useState("");
  const [activeTab, setActiveTab] = useState('home');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const wallet = useTonWallet();
  const isConnected = !!wallet;

  let rawAddress = useTonAddress();

  useEffect(() => {
    const today = new Date();
    const options = { day: '2-digit', month: 'long' };
    const formattedDate = today.toLocaleDateString("en-GB", options);
    setCurrentDate(formattedDate);
  }, []);

  const handleCardClick = (challenge) => {
    setSelectedChallenge(challenge);
    setActiveTab('grid');
  };

  const handleBack = () => {
    setSelectedChallenge(null);
    setActiveTab('home');
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const UserProfile = () => (
    <div className="profile-container">
      {isConnected ? (
        <>
          <div className="profile-header">
            <div className="wallet-icon">
              <User size={48} />
            </div>
            <p className="profile-wallet">Connected Wallet</p>
          </div>
          <div className="profile-details">
            <div className="detail-item">
              <p className="detail-label">Network</p>
              <p className="detail-value">{wallet.chain}</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">Wallet Name</p>
              <p className="detail-value">{wallet.device.appName}</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">Platform</p>
              <p className="detail-value">{wallet.device.platform}</p>
            </div>
            <div className="wallet-connect-profile">
              <TonConnectButton />
            </div>
          </div>
        </>
      ) : (
        <div className="profile-not-connected">
          <h2>Connect Wallet</h2>
          <p>Please connect your wallet to view profile</p>
          <div className="wallet-connect-profile">
            <TonConnectButton />
          </div>
        </div>
      )}
    </div>
  );

  const CalendarView = () => (
    <div >
      <h2 className="header-title">Teachers</h2>

      <VerticalCardList cardsData={cardDataArray} />

    </div>
  );

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

      {!isConnected && activeTab === 'home' && (
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
        <UserProfile />
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
          {/* Your existing cards code */}
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
              <img src={Classes_hard} className="card-hardcoded" />

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
