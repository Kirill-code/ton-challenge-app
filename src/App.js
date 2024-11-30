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
import UserProfile from './UserProfile';
import CalendarView from './CalendarView';
import CardsContainer from './CardsContainer';
import ClassDetail from './ClassDetail';
import TeacherView from './TeacherView';
import TeacherDetail from './TeacherDetail';



const teachersList = [
  { sportType: 'Йога мастер', teacherName: "Владимир Митюков", type: "Айенгара йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg", teacherTgUrl: 'https://www.instagram.com/dipika.yoga/', tag: "@dipika.yoga", description: 'Преподаю йогу в традиции Б.К.С. Айенгара. "Этот метод идеально приспособлен для предотвращения физических и душевных болезней, для общего укрепления тела, что неизбежно развивает чувство уверенности в себе и своих силах." © скрипач Иегуди Менухин (1916-1999гг.)' },
  { sportType: 'Йога мастер', teacherName: "Ирина Богданова", type: "Ваджра йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/Irina.png", teacherTgUrl: 'https://t.me/healyoga', tag: "@healyoga", description: 'Преподаватель йоги Хиал. При абстрактном мышлении, которое использует практикующий адепт йоги ХиАл, развивается способность выхода за рамки привычной системы координат.  Регулярная практика приводит к способности различать и самому выбирать информацию к применению как на уровне ума, так и применяя к физической своей составляющей.' },
  { sportType: 'Йога мастер', teacherName: "Кирилл Корректный", type: "Ваджра йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/Kirill.jpg", teacherTgUrl: 'https://www.instagram.com/kirill_yoga/', tag: "@kirill_yoga", description: 'Ищете эффективный и безопасный способ избавиться от болей в спине? Тогда наши совместные занятия — то, что вам нужно! Присоединяйтесь к нам, и всего за 30 минут в день вы забудете о болях в спине и получите удовольствие от занятий!' },
  { sportType: 'Йога мастер', teacherName: "Карина Кодак", type: "Ваджра йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/karina.jpg", teacherTgUrl: 'https://www.instagram.com/n.o.karma/', tag: "@n.o.karma", description: 'Преподаю Ваджра йогу. Учу работать с телом по методике корректного подхода к позвоночнику и работать с умом через медитацию и пранаяму (технику дыхания).В практике отсутствуют скрутки, повороты, боковые наклоны и глубокие прогибы.' },


];

const shortClasses = [
  { date: "Nov 16", title: "Групповое занятие", classDescription: "Онлайн-группы соматической терапии", price: "free", imageUrl: "https://storage.yandexcloud.net/start-image/sbts/stab.png", sportType: 'Йога мастер', teacherName: "Владимир Митюков", type: "Айенгара йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg", teacherTgUrl: 'https://www.instagram.com/dipika.yoga/', tag: "@dipika.yoga", description: 'Преподаю йогу в традиции Б.К.С. Айенгара. "Этот метод идеально приспособлен для предотвращения физических и душевных болезней, для общего укрепления тела, что неизбежно развивает чувство уверенности в себе и своих силах." © скрипач Иегуди Менухин (1916-1999гг.)' },
  { date: "Nov 16", title: "Здоровая спина", classDescription: "Улучшите свое самочувствие всего за одну неделю", price: "10 USDT", imageUrl: "https://storage.yandexcloud.net/start-image/spine.jpg", sportType: 'Йога мастер', teacherName: "Владимир Митюков", type: "Айенгара йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg", teacherTgUrl: 'https://www.instagram.com/dipika.yoga/', tag: "@dipika.yoga", description: 'Преподаю йогу в традиции Б.К.С. Айенгара. "Этот метод идеально приспособлен для предотвращения физических и душевных болезней, для общего укрепления тела, что неизбежно развивает чувство уверенности в себе и своих силах." © скрипач Иегуди Менухин (1916-1999гг.)' },
  { date: "Nov 16", title: "Групповое занятие", classDescription: "Онлайн-группы соматической терапии", price: "free", imageUrl: "https://storage.yandexcloud.net/start-image/sbts/stab.png", sportType: 'Йога мастер', teacherName: "Владимир Митюков", type: "Айенгара йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg", teacherTgUrl: 'https://www.instagram.com/dipika.yoga/', tag: "@dipika.yoga", description: 'Преподаю йогу в традиции Б.К.С. Айенгара. "Этот метод идеально приспособлен для предотвращения физических и душевных болезней, для общего укрепления тела, что неизбежно развивает чувство уверенности в себе и своих силах." © скрипач Иегуди Менухин (1916-1999гг.)' }
];

const longClasses = [
  { date: "Nov 16", title: "Групповое занятие", classDescription: "Онлайн-группы соматической терапии", price: "free", imageUrl: "https://storage.yandexcloud.net/start-image/sbts/stab.png", sportType: 'Йога мастер', teacherName: "Владимир Митюков", type: "Айенгара йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg", teacherTgUrl: 'https://www.instagram.com/dipika.yoga/', tag: "@dipika.yoga", description: 'Преподаю йогу в традиции Б.К.С. Айенгара. "Этот метод идеально приспособлен для предотвращения физических и душевных болезней, для общего укрепления тела, что неизбежно развивает чувство уверенности в себе и своих силах." © скрипач Иегуди Менухин (1916-1999гг.)' },
  { date: "Nov 16", title: "Здоровая спина", classDescription: "Улучшите свое самочувствие всего за одну неделю", price: "10 USDT", imageUrl: "https://storage.yandexcloud.net/start-image/spine.jpg", sportType: 'Йога мастер', teacherName: "Владимир Митюков", type: "Айенгара йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg", teacherTgUrl: 'https://www.instagram.com/dipika.yoga/', tag: "@dipika.yoga", description: 'Преподаю йогу в традиции Б.К.С. Айенгара. "Этот метод идеально приспособлен для предотвращения физических и душевных болезней, для общего укрепления тела, что неизбежно развивает чувство уверенности в себе и своих силах." © скрипач Иегуди Менухин (1916-1999гг.)' },
  { date: "Nov 16", title: "Групповое занятие", classDescription: "Онлайн-группы соматической терапии", price: "free", imageUrl: "https://storage.yandexcloud.net/start-image/sbts/stab.png", sportType: 'Йога мастер', teacherName: "Владимир Митюков", type: "Айенгара йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg", teacherTgUrl: 'https://www.instagram.com/dipika.yoga/', tag: "@dipika.yoga", description: 'Преподаю йогу в традиции Б.К.С. Айенгара. "Этот метод идеально приспособлен для предотвращения физических и душевных болезней, для общего укрепления тела, что неизбежно развивает чувство уверенности в себе и своих силах." © скрипач Иегуди Менухин (1916-1999гг.)' },
  { date: "Nov 16", title: "Групповое занятие", classDescription: "Онлайн-группы соматической терапии", price: "free", imageUrl: "https://storage.yandexcloud.net/start-image/sbts/stab.png", sportType: 'Йога мастер', teacherName: "Владимир Митюков", type: "Айенгара йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg", teacherTgUrl: 'https://www.instagram.com/dipika.yoga/', tag: "@dipika.yoga", description: 'Преподаю йогу в традиции Б.К.С. Айенгара. "Этот метод идеально приспособлен для предотвращения физических и душевных болезней, для общего укрепления тела, что неизбежно развивает чувство уверенности в себе и своих силах." © скрипач Иегуди Менухин (1916-1999гг.)' },
  { date: "Nov 16", title: "Здоровая спина", classDescription: "Улучшите свое самочувствие всего за одну неделю", price: "10 USDT", imageUrl: "https://storage.yandexcloud.net/start-image/spine.jpg", sportType: 'Йога мастер', teacherName: "Владимир Митюков", type: "Айенгара йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg", teacherTgUrl: 'https://www.instagram.com/dipika.yoga/', tag: "@dipika.yoga", description: 'Преподаю йогу в традиции Б.К.С. Айенгара. "Этот метод идеально приспособлен для предотвращения физических и душевных болезней, для общего укрепления тела, что неизбежно развивает чувство уверенности в себе и своих силах." © скрипач Иегуди Менухин (1916-1999гг.)' },
  { date: "Nov 16", title: "Групповое занятие", classDescription: "Онлайн-группы соматической терапии", price: "free", imageUrl: "https://storage.yandexcloud.net/start-image/sbts/stab.png", sportType: 'Йога мастер', teacherName: "Владимир Митюков", type: "Айенгара йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg", teacherTgUrl: 'https://www.instagram.com/dipika.yoga/', tag: "@dipika.yoga", description: 'Преподаю йогу в традиции Б.К.С. Айенгара. "Этот метод идеально приспособлен для предотвращения физических и душевных болезней, для общего укрепления тела, что неизбежно развивает чувство уверенности в себе и своих силах." © скрипач Иегуди Менухин (1916-1999гг.)' },
  { date: "Nov 16", title: "Групповое занятие", classDescription: "Онлайн-группы соматической терапии", price: "free", imageUrl: "https://storage.yandexcloud.net/start-image/sbts/stab.png", sportType: 'Йога мастер', teacherName: "Владимир Митюков", type: "Айенгара йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg", teacherTgUrl: 'https://www.instagram.com/dipika.yoga/', tag: "@dipika.yoga", description: 'Преподаю йогу в традиции Б.К.С. Айенгара. "Этот метод идеально приспособлен для предотвращения физических и душевных болезней, для общего укрепления тела, что неизбежно развивает чувство уверенности в себе и своих силах." © скрипач Иегуди Менухин (1916-1999гг.)' },
  { date: "Nov 16", title: "Здоровая спина", classDescription: "Улучшите свое самочувствие всего за одну неделю", price: "10 USDT", imageUrl: "https://storage.yandexcloud.net/start-image/spine.jpg", sportType: 'Йога мастер', teacherName: "Владимир Митюков", type: "Айенгара йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg", teacherTgUrl: 'https://www.instagram.com/dipika.yoga/', tag: "@dipika.yoga", description: 'Преподаю йогу в традиции Б.К.С. Айенгара. "Этот метод идеально приспособлен для предотвращения физических и душевных болезней, для общего укрепления тела, что неизбежно развивает чувство уверенности в себе и своих силах." © скрипач Иегуди Менухин (1916-1999гг.)' },
  { date: "Nov 16", title: "Групповое занятие", classDescription: "Онлайн-группы соматической терапии", price: "free", imageUrl: "https://storage.yandexcloud.net/start-image/sbts/stab.png", sportType: 'Йога мастер', teacherName: "Владимир Митюков", type: "Айенгара йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg", teacherTgUrl: 'https://www.instagram.com/dipika.yoga/', tag: "@dipika.yoga", description: 'Преподаю йогу в традиции Б.К.С. Айенгара. "Этот метод идеально приспособлен для предотвращения физических и душевных болезней, для общего укрепления тела, что неизбежно развивает чувство уверенности в себе и своих силах." © скрипач Иегуди Менухин (1916-1999гг.)' }
];

function App({ telegramData }) {
  const mockTelegramData = {
    user: {
      id: "123456",
      first_name: "Mock",
      last_name: "User",
      username: "mockuser"
    }
  };

  // Assign telegramData to mock data if not provided
  telegramData = telegramData && telegramData.user ? telegramData : mockTelegramData;


  // Move all hooks to the top level of the component
  const [currentDate, setCurrentDate] = useState("");
  const [activeTab, setActiveTab] = useState('home');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const wallet = useTonWallet();
  const rawAddress = useTonAddress();

  useEffect(() => {
    const today = new Date();
    const options = { day: '2-digit', month: 'long' };
    setCurrentDate(today.toLocaleDateString("en-GB", options));
    // Notify Telegram that the web app is ready

    window.scrollTo(0, 0);

  }, [activeTab]);
  // Early return if telegramData is not available
  if (!telegramData || !telegramData.user) {
    return <div>Failed to load Telegram data. Please reload the app.</div>;
  }

  const { id, first_name, last_name, username } = telegramData.user;

  const mainCardsArray = [
    {
      title: "7 дней гармонии",
      description: "Улучшите свое самочувствие всего за одну неделю",
      type: "Yoga",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/yoga.png",
      wallet_address: rawAddress,
    },
    {
      title: "Вело приключение",
      description: "Откройте для себя новые горизонты на двух колесах",
      type: "Bike",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/bike.png",
      wallet_address: rawAddress,
    },
    {
      title: "Беги к своей цели",
      description: "Покажи всем на сколько ты хорош в беге",
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



  const handleCardClick = (card) => {
    setSelectedChallenge(card);
    setActiveTab('grid');
  };

  const handleClassClick = (classItem) => {
    setSelectedClass(classItem);
    setActiveTab('classDetail');
  };
  const handleTeacherClick = (teacherItem) => {
    setSelectedTeacher(teacherItem);
    setActiveTab('teacherDetail');
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
            <h3 className="section-title">ЙОГА</h3>

            <CardsContainer
              cardsData={mainCardsArray}
              handleCardClick={handleCardClick}
            />
            <h3 className="section-title">ВЕЛО</h3>

            <CardsContainer
              cardsData={bikeCardsArray}
              handleCardClick={handleCardClick}
            />
            <h3 className="section-title">ВЕЛО</h3>

            <CardsContainer
              cardsData={runCardsArray}
              handleCardClick={handleCardClick}
            />
            <h3 className="section-title">ВЕЛО</h3>

            <CardsContainer
              cardsData={mainCardsArray}
              handleCardClick={handleCardClick}
            /></div>}
          {activeTab === 'Quest Log' && <div>Тут будут ваши челенджи...</div>}
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
            mainContent = <UserProfile />;
            break;
          case 'calendar':
            mainContent = <SliderToggleGrid />;
            break;
          case 'classDetail':
            if (selectedClass) {
              mainContent = (
                <ClassDetail
                  classDetailsItem={selectedClass}
                  onTeacherClick={handleTeacherClick} // Pass the handleTeacherClick function
                />
              );
            }
            break;
          case 'teacherDetail':
            if (selectedTeacher) {
              mainContent = (

                <TeacherDetail
                  teacherDetail={selectedTeacher}
                />
              );
            }
            break;
          case 'grid':
            if (selectedChallenge) {
              mainContent = (
                <div>
                  <ChallengeDetail challengeDetailsItem={selectedChallenge} />

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
                    <p className="notification-subtitle">Приложение будет работать лучше</p>
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
                  <a className="see-all" onClick={() => setActiveTab('calendar')}>ВСЕ</a>
                </div>
                <CalendarView classesData={shortClasses} onClassClick={handleClassClick} />
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
