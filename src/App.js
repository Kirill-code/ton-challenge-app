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
  const [selectedChallenge, setSelectedChallenge] = useState(null);
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
    setActiveTab('grid');
  };

  const handleBack = () => {
    setSelectedChallenge(null);
    setActiveTab('home');
  };

  // Format wallet address for display
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
            <h2>Connected Wallet</h2>
            <p className="wallet-address">{wallet.address}</p>
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

  return (
    <div className="app">
      {activeTab === 'home' ? (
        <header className="header">
          <h1>Challenge</h1>
          <p className="date">{currentDate}</p>
          {isConnected && (
            <div className="user-info">
              <p>Wallet: {formatAddress(wallet.address)}</p>
            </div>
          )}
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
      ) : activeTab === 'grid' && selectedChallenge ? (
        <ChallengeDetail
          img={selectedChallenge.img}
          type={selectedChallenge.type}
          title={selectedChallenge.title}
          description={selectedChallenge.description}
          onBack={handleBack}
        />
      ) : (
        <div className="cards-container">
          {/* Your existing cards code */}
          <div
            className="card"
            onClick={() => handleCardClick({
              img: yogaImage,
              title: "7 Days to Harmony",
              description: "Improve your well-being in just one week",
              type: "Yoga"
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
              type: "Bike"
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
              type: "Run"
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