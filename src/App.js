/*
 * Copyright © 2024, Kirill Code.
 * Business Source License 1.1
 * Change Date: November 23, 2026
 */
import API_CONFIG from './config'; // Import the config
import logo from './assets/logo.png';

import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { TonConnectButton, useTonWallet, useTonAddress } from '@tonconnect/ui-react';
import { ArrowLeft } from 'lucide-react';
import { ReactComponent as Home } from '../src/assets/home.svg';
import { ReactComponent as Grid } from '../src/assets/grid.svg';
import { ReactComponent as Calendar } from '../src/assets/calendar-schedule.svg';
import { ReactComponent as User } from '../src/assets/user.svg';


import ChallengeDetail from './ChallengeDetail';
import UserProfile from './UserProfile';
import CalendarView from './CalendarView';
import CardsContainer from './CardsContainer';
import ClassDetail from './ClassDetail';
import TeacherView from './TeacherView';
import TeacherDetail from './TeacherDetail';
import { TwaAnalyticsProvider } from '@tonsolutions/telemetree-react';

import WebApp from '@twa-dev/sdk'
import { duration } from "@mui/material";



function App({ telegramData }) {
  const mockTelegramData = {
    user: {
      id: "211166438",
      first_name: "Mock",
      last_name: "User",
      username: "mockuser"
    }
  };

  // Assign telegramData to mock data if not provided
  telegramData = telegramData && telegramData.user ? telegramData : mockTelegramData;

  // --------------------------------------
  // Get user fields IMMEDIATELY:
  const { id, first_name, last_name, username } = telegramData.user;
  const displayName = username || `${first_name || ''} ${last_name || ''}`.trim() || 'User';
  // --------------------------------------

  const [currentDate, setCurrentDate] = useState("");
  const [activeTab, setActiveTab] = useState('home');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // Initialize the arrays with [] so they’re never null
  const [teachersList, setteachersList] = useState([]);
  const [longClasses, setLongClasses] = useState([]);
  const [mainCardsArray, setMainCardsArray] = useState([]);


  const [loading, setLoading] = useState(true);

  const wallet = useTonWallet();
  const rawAddress = useTonAddress();
  const activeTabHistory = useRef([]);

  useEffect(() => {
    const today = new Date();
    const options = { day: '2-digit', month: 'long' };
    setCurrentDate(today.toLocaleDateString("en-GB", options));
    window.scrollTo(0, 0);
  
    const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
    let startParam = null;
  
    if (tg && tg.initDataUnsafe) {
      startParam = tg.initDataUnsafe.start_param;
      console.log('Start Param from Telegram:', startParam);
    } else {
      // For local testing, get startParam from URL
      const urlParams = new URLSearchParams(window.location.search);
      startParam = urlParams.get('startapp'); // Adjust if your query parameter is different
      console.log('Start Param from URL:', startParam);
    }
  
    let invite = "mock"; // Default invite
    let classIdFromParam = null;
  
    if (startParam) {
      try {
        // Decode the parameter in case it's URL-encoded
        const decodedStartParam = decodeURIComponent(startParam);
        console.log('Decoded Start Param:', decodedStartParam);
  
        // Parse the startParam assuming it's a query string like "invite=snow_and_skill" or "invite=snow_and_skill&id=some-guid"
        const params = new URLSearchParams(decodedStartParam);
        const inviteParam = params.get('invite');
        const idParam = params.get('id');
  
        if (inviteParam) {
          invite = inviteParam;
        }
  
        if (idParam) {
          classIdFromParam = idParam;
        }
  
        console.log('Parsed Invite:', invite);
        console.log('Parsed ID:', classIdFromParam);
      } catch (error) {
        console.error('Error parsing startParam:', error);
      }
    } else {
      console.warn('No startParam found.');
    }
  
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/get_user_info?user_chat_id=${id}&invite=${invite}&username=${username}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
  
        const data = await response.json();
        setteachersList(data.teachersList || []);
        setLongClasses(data.teacherSchedules || []);
        setMainCardsArray(data.sbts || []);
  
        return data.teacherSchedules;
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        return [];
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserInfo().then((teacherSchedules) => {
      if (classIdFromParam && teacherSchedules?.length > 0) {
        // Find the class by GUID
        const foundClass = teacherSchedules.find(c => c.id === classIdFromParam);
        if (foundClass) {
          setSelectedClass(foundClass);
          setActiveTab('classDetail');
        } else {
          console.warn('No class found with the provided ID:', classIdFromParam);
        }
      }
    });
  }, [activeTab, id, username]);
  
  


  //  ^ add id, username to dependencies just to be safe
  // or just leave [activeTab], if you want

  // If no Telegram data:
  if (!telegramData || !telegramData.user) {
    return <div>Ошибка загрузки. Пожалуйста перезагрузите приложение.</div>;
  }

  // Show spinner if still loading:
  if (loading) {
    return (
      <div className="spinner-container">
        <img src={logo} className="spinner-logo" alt="Загрузка..." />
      </div>
    );
  }


  const navigateTo = (newTab) => {
    if (newTab !== activeTab) {
      // Push current tab onto history before navigating
      activeTabHistory.current.push(activeTab);
    }
    setActiveTab(newTab);
  };




  const handleCardClick = (card) => {
    setSelectedChallenge(card);
    navigateTo('grid');
  };

  const handleClassClick = (classItem) => {
    setSelectedClass(classItem);
    navigateTo('classDetail');
  };
  const handleTeacherClick = (teacherItem) => {
    setSelectedTeacher(teacherItem);
    navigateTo('teacherDetail');
  };

  let isComeFromHome = true;
  const handleBack = () => {
    console.log(activeTabHistory);
    if (activeTabHistory.current.length > 0) {
      const previousTab = activeTabHistory.current.pop();
      navigateTo(previousTab);
    } else {
      // If no history, default to home
      navigateTo('home');
    }

  };



  const SliderToggle = () => {
    const [activeTab, setSliderTab] = useState('All');

    const handleToggle = (tab) => {
      setSliderTab(tab);
    };

    return (
      <div className="slider-container">
        <div className="slider-toggle">
          <button
            className={`toggle-button ${activeTab === 'All' ? 'active' : ''}`}
            onClick={() => handleToggle('All')}
          >
            Все
          </button>
          <button
            className={`toggle-button ${activeTab === 'Quest Log' ? 'active' : ''}`}
            onClick={() => handleToggle('Quest Log')}
          >
            Участвую
          </button>
        </div>
        <div className="slider-content">
          {activeTab === 'All' && <div>
            <h3 className="section-title">Ваши активности</h3>

            <CardsContainer
              cardsData={mainCardsArray}
              handleCardClick={handleCardClick}
            />

          </div>
          }
          {activeTab === 'Quest Log' && <div>Тут будут ваши челенджи...</div>}
        </div>
      </div>
    );
  };

  //TODO: fix duplicates

  const SliderToggleGrid = () => {
    const [activeTab, setGrideTab] = useState('Classes');

    const handleToggle = (tab) => {
      setGrideTab(tab);
    };

    return (
      <div className="slider-container">
        <div className="slider-toggle">
          <button
            className={`toggle-button ${activeTab === 'Classes' ? 'active' : ''}`}
            onClick={() => handleToggle('Classes')}
          >
            Мероприятия
          </button>
          <button
            className={`toggle-button ${activeTab === 'Teachers' ? 'active' : ''}`}
            onClick={() => handleToggle('Teachers')}
          >
            Преподаватели
          </button>
        </div>
        <div className="content">
          {activeTab === 'Classes' &&
            <div>
              <CalendarView
                classesData={longClasses} onClassClick={handleClassClick} />
            </div>}
          {activeTab === 'Teachers' &&
            <div><TeacherView
              classesData={teachersList} onClassClick={handleTeacherClick} />
            </div>}
        </div>
      </div>
    );
  };

  return (
    <TwaAnalyticsProvider
      projectId='e3f0bb33-59bc-433b-a98e-5ce5d74151c6'
      apiKey='0be915b7-2d9b-4dee-8b49-0baf15277f0e'
      appName='Aranĝo'
    >
      <div className="app">
        {/* Header Content */}
        {(() => {
          let headerContent;
          switch (activeTab) {
            case 'home':
              headerContent = (
                <header className="header">
                  <h1>Челленджи</h1>
                  <p className="date">{currentDate}</p>
                </header>
              );
              break;
            case 'grid':
              if (selectedChallenge) {
                headerContent = (
                  <header className="header-grid">
                    <div className="back-button" onClick={handleBack}><ArrowLeft /></div>
                    <h2 className="header-title-challenge">Челлендж</h2>
                  </header>
                );
              }
              break;
            case 'classDetail':
              headerContent = (
                <header className="header-grid">
                  <div className="back-button" onClick={handleBack}><ArrowLeft /></div>
                  <h2 className="header-title">{activeTab === 'classDetail' ? 'Детали класса' : 'Челленджи'}</h2>
                </header>
              );
              break;
            case 'teacherDetail':
              headerContent = (
                <header className="header-grid">
                  <div className="back-button" onClick={handleBack}><ArrowLeft /></div>
                  <h2 className="header-title">{activeTab === 'teacherDetail' ? '' : 'Челленджи'}</h2>
                </header>
              );
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
              mainContent = <UserProfile
                displayNameUser={displayName}
                userId={id}
                onClassClick={handleClassClick}
                classes={longClasses} />;
              break;
            case 'calendar':
              mainContent = <SliderToggleGrid />;
              break;
            case 'classDetail':
              if (selectedClass) {
                mainContent = (
                  <ClassDetail
                    classDetailsItem={selectedClass}
                    onTeacherClick={handleTeacherClick}
                    id={id}
                    username={displayName}
                    teachersList={teachersList}
                  />
                );
              }
              break;
            case 'teacherDetail':
              if (selectedTeacher) {
                mainContent = (
                  <TeacherDetail
                    teacherDetail={selectedTeacher}
                    classes={longClasses}
                    onClassClick={handleClassClick} // Pass the handler here

                  />
                );
              }
              break;
            case 'grid':
              if (selectedChallenge) {
                mainContent = (
                  <div>
                    <ChallengeDetail
                      challengeDetailsItem={selectedChallenge}
                      id={id}
                      username={displayName}
                      teachersList={teachersList}
                    />

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
                      <p className="notification-title">Подключите TON кошелек</p>
                      <p className="notification-subtitle">Будет доступно больше функций</p>
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
                    <h3 className="section-title">КЛАССЫ</h3>
                    <a className="see-all" onClick={() => navigateTo('calendar')}>ВСЕ</a>
                  </div>
                  <CalendarView classesData={longClasses.slice(0, 3)} onClassClick={handleClassClick} />
                </div>
              );

          }
          return mainContent;
        })()}

        {/* Footer */}
        <footer className="footer">
          <div
            className={`footer-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => { navigateTo('home'); isComeFromHome = true; }}
          >
            <Home size={24} />
          </div>
          <div
            className={`footer-item ${activeTab === 'grid' ? 'active' : ''}`}
            onClick={() => { navigateTo('grid'); isComeFromHome = false; }}
          >
            <Grid size={24} />
          </div>
          <div
            className={`footer-item ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => { navigateTo('calendar'); isComeFromHome = false; }}
          >
            <Calendar size={24} />
          </div>
          <div
            className={`footer-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => navigateTo('profile')}
          >
            <User size={24} />
          </div>
        </footer>
      </div>
    </TwaAnalyticsProvider>

  );

}

export default App;
