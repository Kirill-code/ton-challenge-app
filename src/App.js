/*
 * Copyright © 2024, Kirill Code.
 * Business Source License 1.1
 * Change Date: November 23, 2026
 */
import API_CONFIG from './config'; // Import the config
import logo from './assets/logo.png';
import { ToastContainer } from 'react-toastify';

import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { TonConnectButton, useTonWallet, useTonAddress } from '@tonconnect/ui-react';
import { ArrowLeft } from 'lucide-react';
import { ReactComponent as Home } from '../src/assets/home.svg';
import { ReactComponent as Grid } from '../src/assets/grid.svg';
import { ReactComponent as Calendar } from '../src/assets/calendar-schedule.svg';
import { ReactComponent as User } from '../src/assets/user.svg';

import ChallengeDetail from './ChallengeDetail';
import CourseDetail from './CourseDetail';

import UserProfile from './UserProfile';
import CalendarView from './CalendarView';
import CardsContainer from './CardsContainer';
import ClassDetail from './ClassDetail';
import TeacherView from './TeacherView';
import TeacherDetail from './TeacherDetail';
import { TwaAnalyticsProvider } from '@tonsolutions/telemetree-react';

import WebApp from '@twa-dev/sdk';
import { duration } from "@mui/material";

////////////////////////////////////////////////////////////////////////////////
// Helper to parse a standard YouTube link into just the videoId for embedding
function parseYouTubeVideoId(link = '') {
  // Matches either youtu.be/VIDEOID or v=VIDEOID
  const match = link.match(/(?:youtu\.be\/|v=)([^?&]+)/);
  if (match && match[1]) return match[1];
  return '';
}

////////////////////////////////////////////////////////////////////////////////

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

  // Store the video link from CourseDetail for the video screen
  const [selectedVideoLink, setSelectedVideoLink] = useState(null);

  // Initialize the arrays with [] so they’re never null
  const [teachersList, setteachersList] = useState([]);
  const [longClasses, setLongClasses] = useState([]);
  const [mainCardsArray, setMainCardsArray] = useState([]);
  const [userCardsArray, setUserCardsArray] = useState([]);

  const [loading, setLoading] = useState(true);

  const wallet = useTonWallet();
  const rawAddress = useTonAddress();
  const activeTabHistory = useRef([]);
  function isBase64(str) {
    // Quick test: only base64 characters + possible padding
    // If it matches the pattern, we try/catch an actual decode
    if (!/^[A-Za-z0-9+/=]+$/.test(str)) return false;
    try {
      // If atob(str) works without error, it’s probably valid base64
      atob(str);
      return true;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    const isTelegramWebApp = window.top !== window.self;

    const today = new Date();
    const options = { day: '2-digit', month: 'long' };
    setCurrentDate(today.toLocaleDateString("en-GB", options));
    window.scrollTo(0, 0);

    const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

    let startParam;
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) {
      // Telegram scenario
      startParam = tg.initDataUnsafe.start_param;
      console.log('Start Param from Telegram (raw):', startParam);
    } else {
      // URL scenario
      const urlParams = new URLSearchParams(window.location.search);
      startParam = urlParams.get('startapp');
      console.log('Start Param from URL (raw):', startParam);
    }
    // alert(startParam);
    if (startParam && isBase64(startParam)) {
      const decoded = atob(startParam);
      console.log('Decoded Start Param:', decoded);
      startParam = decoded; // Only now we store the decoded value
    } else {
      console.log('No valid Base64 to decode (using raw).');
    }


    let invite = "";
    let classIdFromParam = null;

    if (startParam) {
      try {
        // First check if it's base64 encoded
        let decodedStartParam;
        try {
          decodedStartParam = atob(startParam);
        } catch {
          // If not base64, use the raw value
          decodedStartParam = startParam;
        }

        decodedStartParam = decodeURIComponent(decodedStartParam);
        console.log('Decoded Start Param:', decodedStartParam);

        // EXAMPLE: "invite_snow_and_skill__id_8"
        if (decodedStartParam.includes('__id_')) {
          const [invitePart, idPart] = decodedStartParam.split('__id_');

          if (invitePart.startsWith('invite_')) {
            invite = invitePart.slice('invite_'.length);
          } else {
            invite = invitePart;
          }

          classIdFromParam = idPart;
        } else {
          if (decodedStartParam.startsWith('invite_')) {
            invite = decodedStartParam.slice('invite_'.length);
          } else {
            invite = decodedStartParam;
          }
        }

        console.log('Parsed Invite:', invite);
        console.log('Parsed ID:', classIdFromParam);
      } catch (error) {
        console.error('Error parsing startParam:', error);
      }
      finally {
        if (!isTelegramWebApp) {
          const newUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }
      }
    } else {
      console.warn('No startParam found.');
    }

    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/get_user_info?user_chat_id=${id}&username=${username}${invite ? `&invite=${invite}` : ''}`, {
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
        setUserCardsArray((data.userEvents || []).filter((event) => event.finished_tasks > 0));

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
        const foundClass = teacherSchedules.find(c => c.id === classIdFromParam);
        if (foundClass) {
          setSelectedClass(foundClass);
          setActiveTab('classDetail');
        } else {
          console.warn('No class found with the provided ID:', classIdFromParam);
        }
      }
    });
  }, [id, username]);

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
    console.log("handleCardClick -> selectedChallenge:", card);
    setSelectedChallenge(card);
    // Add this to track state update
    console.log("Navigation to grid with challenge:", card?.title);
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
    if (activeTabHistory.current.length > 0) {
      const previousTab = activeTabHistory.current.pop();
      navigateTo(previousTab);
    } else {
      // If no history, default to home
      navigateTo('home');
    }
  };

  // Toggle components
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
          {activeTab === 'All' && (
            <div>
              <h3 className="section-title">Ваши активности</h3>

              <CardsContainer
                cardsData={mainCardsArray}
                handleCardClick={handleCardClick}
              />
            </div>
          )}
          {activeTab === 'Quest Log' && (
            <CardsContainer
              cardsData={userCardsArray}
              handleCardClick={handleCardClick}
            />
          )}
        </div>
      </div>
    );
  };

  // Toggle grid 
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
          {activeTab === 'Classes' && (
            <div>
              <CalendarView
                classesData={longClasses} onClassClick={handleClassClick} />
            </div>
          )}
          {activeTab === 'Teachers' && (
            <div>
              <TeacherView
                classesData={teachersList} onClassClick={handleTeacherClick} />
            </div>
          )}
        </div>
      </div>
    );
  };

  //////////////////////////////////////////////////////////////////
  // A separate component to show the video in "videoScreen" mode
  function VideoView() {
    if (!selectedVideoLink) {
      return (
        <div style={{ color: '#fff', padding: '20px' }}>
          <h2>Нет видео</h2>
          <p>Не удалось открыть видео.</p>
        </div>
      );
    }

    // Parse the link into a videoId for an <iframe> or a YouTube React component
    const videoId = parseYouTubeVideoId(selectedVideoLink);
    if (!videoId) {
      return (
        <div style={{ color: '#fff', padding: '20px' }}>
          <h2>Некорректная ссылка</h2>
          <p>Ссылка на YouTube видео не найдена.</p>
        </div>
      );
    }

    // If you want to use the official YouTube iframe here:
    // TODO: autoplay=1& 
    return (
      <div style={{ color: '#fff', padding: '20px' }}>
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            title="Video Preview"
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?controls=1`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </div>
      </div>
    );
  }
  //////////////////////////////////////////////////////////////////

  return (
    <TwaAnalyticsProvider
      projectId='e3f0bb33-59bc-433b-a98e-5ce5d74151c6'
      apiKey='0be915b7-2d9b-4dee-8b49-0baf15277f0e'
      appName='Aranĝo'
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Optional: Choose a theme
      />
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
                    <h2 className="header-title">
                      {selectedChallenge.typesbt === 'course' ? 'Курс' : 'Челлендж'}
                    </h2>
                  </header>
                );
              }
              break;
            case 'classDetail':
              headerContent = (
                <header className="header-grid">
                  <div className="back-button" onClick={handleBack}><ArrowLeft /></div>
                  <h2 className="header-title">Детали класса</h2>
                </header>
              );
              break;
            case 'teacherDetail':
              headerContent = (
                <header className="header-grid">
                  <div className="back-button" onClick={handleBack}><ArrowLeft /></div>
                  <h2 className="header-title"></h2>
                </header>
              );
              break;
            case 'videoScreen':
              headerContent = (
                <header className="header-grid">
                  <div className="back-button" onClick={handleBack}><ArrowLeft /></div>
                  <h2 className="header-title">Смотреть видео</h2>
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
              mainContent = (
                <UserProfile
                  displayNameUser={displayName}
                  userId={id}
                  onClassClick={handleClassClick}
                  classes={longClasses}
                />
              );
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
                    onClassClick={handleClassClick}
                  />
                );
              }
              break;
            case 'grid':
              if (selectedChallenge) {
                console.log("Rendering CourseDetail with challenge:", selectedChallenge?.title);
                mainContent = (
                  <div className="challenge-detail-container">
                    {selectedChallenge.typesbt === 'course' ? <CourseDetail
                      challengeDetailsItem={selectedChallenge}
                      id={id}
                      username={displayName}
                      teachersList={teachersList}
                      onOpenVideo={(videoLink) => {
                        console.log("Video link selected:", videoLink); // Add this log
                        setSelectedVideoLink(videoLink);
                        navigateTo('videoScreen');
                      }}
                    /> : <ChallengeDetail
                      challengeDetailsItem={selectedChallenge}
                      id={id}
                      username={displayName}
                      teachersList={teachersList}
                      onOpenVideo={(videoLink) => {
                        // Save the link and navigate to videoScreen
                        setSelectedVideoLink(videoLink);
                        navigateTo('videoScreen');
                      }}
                    />}

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
                    <a className="see-all" onClick={() => navigateTo('calendar')}>
                      ВСЕ
                    </a>
                  </div>
                  <CalendarView
                    classesData={longClasses.slice(0, 3)}
                    onClassClick={handleClassClick}
                  />
                </div>
              );
              break;
            case 'videoScreen':
              mainContent = <VideoView />;
              break;
            default:
              mainContent = null;
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
