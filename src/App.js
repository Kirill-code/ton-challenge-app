/*
 * Copyright © 2024, Kirill Code.
 * Business Source License 1.1
 * Change Date: November 23, 2026
 */
import React, { useState, useEffect } from "react";
import "./App.css";
import { TonConnectButton, useTonWallet, useTonAddress } from '@tonconnect/ui-react';
import { Home, Grid, Calendar, User, ArrowLeft } from 'lucide-react';
import ChallengeDetail from './ChallengeDetail';
import UserProfile from './UserProfile'; // Import UserProfile component
import CalendarView from './CalendarView'; // Import the CalendarView component
import CardsContainer from './CardsContainer';



// Import data array for cards (if card data is large, you can move it to a separate file)
const cardDataArray = [
  { title: "Vladimir Mityukov", link: "https://t.me/yogalizaciya", description: "Yoga teacher of the Iyengar Yoga tradition", imageUrl: 'https://storage.yandexcloud.net/start-image/masters/volodya.jpg' },
  { title: "Karina Kodak", link: "https://t.me/yogalizaciya", description: "I teach Vajra Yoga...", imageUrl: 'https://storage.yandexcloud.net/start-image/masters/karina.jpg' },
  { title: "Kirill Ponomarev", link: "https://t.me/yogalizaciya", description: "Vajra Yoga teacher", imageUrl: 'https://storage.yandexcloud.net/start-image/masters/Kirill.jpg' },
  // ... add more card data as needed
];
const teachersList = [
  { date: "Yoga Teacher", title: "Vladimir Mityukov", description: "Iyengar Yoga", url: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg" },
  { date: "Yoga Teacher", title: "Karina Kodak", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/karina.jpg" },
  { date: "Yoga Teacher", title: "Kirill Korrektnyi", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/Kirill.jpg" },
  { date: "Yoga Teacher", title: "Vladimir Mityukov", description: "Iyengar Yoga", url: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg" },
  { date: "Yoga Teacher", title: "Karina Kodak", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/karina.jpg" },
  { date: "Yoga Teacher", title: "Kirill Korrektnyi", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/Kirill.jpg" },
  { date: "Yoga Teacher", title: "Vladimir Mityukov", description: "Iyengar Yoga", url: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg" },
  { date: "Yoga Teacher", title: "Karina Kodak", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/karina.jpg" },
  { date: "Yoga Teacher", title: "Kirill Korrektnyi", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/Kirill.jpg" },
  { date: "Yoga Teacher", title: "Vladimir Mityukov", description: "Iyengar Yoga", url: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg" },
  { date: "Yoga Teacher", title: "Karina Kodak", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/karina.jpg" },
  { date: "Yoga Teacher", title: "Kirill Korrektnyi", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/Kirill.jpg" },
  { date: "Yoga Teacher", title: "Vladimir Mityukov", description: "Iyengar Yoga", url: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg" },
  { date: "Yoga Teacher", title: "Karina Kodak", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/karina.jpg" },
  { date: "Yoga Teacher", title: "Kirill Korrektnyi", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/Kirill.jpg" },
  { date: "Yoga Teacher", title: "Vladimir Mityukov", description: "Iyengar Yoga", url: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg" },
  { date: "Yoga Teacher", title: "Karina Kodak", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/karina.jpg" },
  { date: "Yoga Teacher", title: "Kirill Korrektnyi", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/Kirill.jpg" },
  { date: "Yoga Teacher", title: "Vladimir Mityukov", description: "Iyengar Yoga", url: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg" },
  { date: "Yoga Teacher", title: "Karina Kodak", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/karina.jpg" },
  { date: "Yoga Teacher", title: "Kirill Korrektnyi", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/Kirill.jpg" },
  { date: "Yoga Teacher", title: "Vladimir Mityukov", description: "Iyengar Yoga", url: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg" },
  { date: "Yoga Teacher", title: "Karina Kodak", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/karina.jpg" },
  { date: "Yoga Teacher", title: "Kirill Korrektnyi", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/Kirill.jpg" },
  { date: "Yoga Teacher", title: "Vladimir Mityukov", description: "Iyengar Yoga", url: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg" },
  { date: "Yoga Teacher", title: "Karina Kodak", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/karina.jpg" },
  { date: "Yoga Teacher", title: "Kirill Korrektnyi", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/Kirill.jpg" },
  { date: "Yoga Teacher", title: "Vladimir Mityukov", description: "Iyengar Yoga", url: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg" },
  { date: "Yoga Teacher", title: "Karina Kodak", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/karina.jpg" },
  { date: "Yoga Teacher", title: "Kirill Korrektnyi", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/Kirill.jpg" },
  { date: "Yoga Teacher", title: "Vladimir Mityukov", description: "Iyengar Yoga", url: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg" },
  { date: "Yoga Teacher", title: "Karina Kodak", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/karina.jpg" },
  { date: "Yoga Teacher", title: "Kirill Korrektnyi", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/Kirill.jpg" },
  { date: "Yoga Teacher", title: "Vladimir Mityukov", description: "Iyengar Yoga", url: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg" },
  { date: "Yoga Teacher", title: "Karina Kodak", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/karina.jpg" },
  { date: "Yoga Teacher", title: "Kirill Korrektnyi", description: "Vajra Yoga", url: "https://storage.yandexcloud.net/start-image/masters/Kirill.jpg" }
];

const shortClasses = [
  { date: "Nov 16", title: "Ktutoe nazvanie", description: "Online somatic therapy groups", price: "free", url: "https://storage.yandexcloud.net/start-image/holder.png" },
  { date: "Nov 16", title: "Ktutoe nazvanie", description: "Online somatic therapy groups", price: "10 USDT", url: "https://storage.yandexcloud.net/start-image/holder.png" },
  { date: "Nov 16", title: "Ktutoe nazvanie", description: "Online somatic therapy groups", price: "free", url: "https://storage.yandexcloud.net/start-image/holder.png" }
];

const longClasses = [
  { date: "Nov 16", title: "Ktutoe nazvanie", description: "Online somatic therapy groups", price: "free", url: "https://storage.yandexcloud.net/start-image/holder.png" },
  { date: "Nov 16", title: "Ktutoe nazvanie", description: "Online somatic therapy groups", price: "10 USDT", url: "https://storage.yandexcloud.net/start-image/holder.png" },
  { date: "Nov 16", title: "Ktutoe nazvanie", description: "Online somatic therapy groups", price: "free", url: "https://storage.yandexcloud.net/start-image/holder.png" },
  { date: "Nov 16", title: "Ktutoe nazvanie", description: "Online somatic therapy groups", price: "free", url: "https://storage.yandexcloud.net/start-image/holder.png" },
  { date: "Nov 16", title: "Ktutoe nazvanie", description: "Online somatic therapy groups", price: "10 USDT", url: "https://storage.yandexcloud.net/start-image/holder.png" },
  { date: "Nov 16", title: "Ktutoe nazvanie", description: "Online somatic therapy groups", price: "free", url: "https://storage.yandexcloud.net/start-image/holder.png" },
  { date: "Nov 16", title: "Ktutoe nazvanie", description: "Online somatic therapy groups", price: "free", url: "https://storage.yandexcloud.net/start-image/holder.png" },
  { date: "Nov 16", title: "Ktutoe nazvanie", description: "Online somatic therapy groups", price: "10 USDT", url: "https://storage.yandexcloud.net/start-image/holder.png" },
  { date: "Nov 16", title: "Ktutoe nazvanie", description: "Online somatic therapy groups", price: "free", url: "https://storage.yandexcloud.net/start-image/holder.png" }
];

function App() {
  const [currentDate, setCurrentDate] = useState("");
  const [activeTab, setActiveTab] = useState('home');
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const wallet = useTonWallet();
  const rawAddress = useTonAddress();

  const mainCardsArray = [
    {
      title: "7 Days to Harmony",
      description: "Improve your well-being in one week",
      type: "Yoga",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/yoga.png",
      wallet_address: rawAddress,
    },
    {
      title: "Cycling Adventure",
      description: "Discover new horizons on two wheels",
      type: "Bike",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/bike.png",
      wallet_address: rawAddress,
    },
    {
      title: "Run to your goal",
      description: "Discover new horizons on two wheels",
      type: "Run",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/run.png",
      wallet_address: rawAddress,
    },
  ];

  const bikeCardsArray = [
    {
      title: "Cycling Adventure",
      description: "Discover new horizons on two wheels",
      type: "Bike",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/bike.png",
      wallet_address: rawAddress,
    },
    {
      title: "Cycling Adventure",
      description: "Discover new horizons on two wheels",
      type: "Bike",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/bike.png",
      wallet_address: rawAddress,
    },
    {
      title: "Cycling Adventure",
      description: "Discover new horizons on two wheels",
      type: "Bike",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/bike.png",
      wallet_address: rawAddress,
    },
  ];

  const runCardsArray = [
    {
      title: "Run to your goal",
      description: "Discover new horizons on two legs",
      type: "Run",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/run.png",
      wallet_address: rawAddress,
    },
    {
      title: "Run to your goal",
      description: "Discover new horizons on two legs",
      type: "Run",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/run.png",
      wallet_address: rawAddress,
    },
    {
      title: "Run to your goal",
      description: "Discover new horizons on two legs",
      type: "Run",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/run.png",
      wallet_address: rawAddress,
    },
  ];

  useEffect(() => {
    const today = new Date();
    const options = { day: '2-digit', month: 'long' };
    setCurrentDate(today.toLocaleDateString("en-GB", options));

    if (window.Telegram && window.Telegram.WebApp) {
      // Ensure the WebApp is ready before calling disableVerticalSwipes
      window.Telegram.WebApp.ready(() => {
        console.log('Telegram WebApp is ready');
        window.Telegram.WebApp.disableVerticalSwipes();
        console.log('Vertical swipes disabled');
      });
    } else {
      console.warn('Telegram WebApp is not available');
    }
  }, []);

  const handleCardClick = (card) => {
    setSelectedChallenge(card);
    setActiveTab('grid');
  };


  let isComeFromHome = true;
  const handleBack = () => {
    setSelectedChallenge(null);
    if (isComeFromHome) {
      setActiveTab('home');
    } else {
      setActiveTab('grid');
    }

  };


  const CalendarViewTeachers = () => (
    <div>
      <h2 className="header-title">Teachers</h2>
      {/* <VerticalCardList cardsData={teachers} /> */}
    </div>
  );

  const SliderToggle = () => {
    const [activeTab, setActiveTab] = useState('All');

    const handleToggle = (tab) => {
      setActiveTab(tab);
    };

    return (
      <div className="slider-container">
        <div className="slider-toggle">
          <button
            className={`toggle-button ${activeTab === 'All' ? 'active' : ''}`}
            onClick={() => handleToggle('All')}
          >
            All
          </button>
          <button
            className={`toggle-button ${activeTab === 'Quest Log' ? 'active' : ''}`}
            onClick={() => handleToggle('Quest Log')}
          >
            Quest Log
          </button>
        </div>
        <div className="slider-content">
          {activeTab === 'All' && <div>
            <h3 className="section-title">YOGA</h3>

            <CardsContainer
              cardsData={mainCardsArray}
              handleCardClick={handleCardClick}
            />
            <h3 className="section-title">BICYCLE</h3>

            <CardsContainer
              cardsData={bikeCardsArray}
              handleCardClick={handleCardClick}
            />
            <h3 className="section-title">BICYCLE</h3>

            <CardsContainer
              cardsData={runCardsArray}
              handleCardClick={handleCardClick}
            />
            <h3 className="section-title">BICYCLE</h3>

            <CardsContainer
              cardsData={mainCardsArray}
              handleCardClick={handleCardClick}
            /></div>}
          {activeTab === 'Quest Log' && <div>Showing quest log content...</div>}
        </div>
      </div>
    );
  };

  //TODO: fix duplicates

  const SliderToggleGrid = () => {
    const [activeTab, setActiveTab] = useState('Classes');

    const handleToggle = (tab) => {
      setActiveTab(tab);
    };

    return (
      <div className="slider-container">
        <div className="slider-toggle">
          <button
            className={`toggle-button ${activeTab === 'Classes' ? 'active' : ''}`}
            onClick={() => handleToggle('Classes')}
          >
            Classes
          </button>
          <button
            className={`toggle-button ${activeTab === 'Teachers' ? 'active' : ''}`}
            onClick={() => handleToggle('Teachers')}
          >
            Teachers
          </button>
        </div>
        <div className="content">
          {activeTab === 'Classes' &&
            <div>
              <CalendarView
                classesData={longClasses} />
            </div>}
          {activeTab === 'Teachers' &&
            <div><CalendarView
              classesData={teachersList} />
            </div>}
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      {/* Header Content */}
      {(() => {
        let headerContent;
        switch (activeTab) {
          case 'home':
            headerContent = (
              <header className="header">
                <h1>Challenge</h1>
                <p className="date">{currentDate}</p>
              </header>
            );
            break;
          case 'grid':
            if (selectedChallenge) {
              headerContent = (
                <header className="header-grid">
                  <div className="back-button" onClick={handleBack}><ArrowLeft /></div>
                  <h2 className="header-title">Challenge</h2>
                </header>
              );
            }
            break;
          default:
            headerContent = null;
        }
        return headerContent;
      })()}

      {/* Main Content */}
      {(() => {
        let mainContent;
        switch (activeTab) {
          case 'profile':
            mainContent = <UserProfile />;
            break;
          case 'calendar':
            mainContent = <SliderToggleGrid />;
            break;
          case 'grid':
            if (selectedChallenge) {
              mainContent = (
                <div>
                  <ChallengeDetail
                    imageUrl={selectedChallenge.imageUrl}
                    type={selectedChallenge.type}
                    title={selectedChallenge.title}
                    description={selectedChallenge.description}
                    onBack={handleBack}
                    wallet_address={selectedChallenge.wallet_address}
                  />
                  {/* <CalendarView classesData={shortClasses} /> */}
                </div>
              );
            } else {
              mainContent = (
                <div>
                  <SliderToggle />

                </div>
              );
            }
            break;
          case 'home':
            mainContent = (
              <div>
                {!wallet && (
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
                <CardsContainer
                  cardsData={mainCardsArray}
                  handleCardClick={handleCardClick}
                />
                <div className="classes-section">
                  <h3 className="section-title">CLASSES</h3>
                  <a className="see-all" onClick={() => setActiveTab('calendar')}>See all</a>
                </div>
                <CalendarView classesData={shortClasses} />
              </div>
            );

        }
        return mainContent;
      })()}

      {/* Footer */}
      <footer className="footer">
        <div
          className={`footer-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => { setActiveTab('home'); isComeFromHome = true; }}
        >
          <Home size={24} />
        </div>
        <div
          className={`footer-item ${activeTab === 'grid' ? 'active' : ''}`}
          onClick={() => { setActiveTab('grid'); isComeFromHome = false; }}
        >
          <Grid size={24} />
        </div>
        <div
          className={`footer-item ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => { setActiveTab('calendar'); isComeFromHome = false; }}
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