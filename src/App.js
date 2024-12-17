/*
 * Copyright © 2024, Kirill Code.
 * Business Source License 1.1
 * Change Date: November 23, 2026
 */
import React, { useState, useEffect, useRef } from "react";
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
import { TwaAnalyticsProvider } from '@tonsolutions/telemetree-react';

import WebApp from '@twa-dev/sdk'
import { duration } from "@mui/material";


const teachersList = [
  { master_chat_id: '334547237', sportType: 'Йога мастер', teacherName: "Владимир Митюков", type: "Айенгара йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg", teacherTgUrl: 'https://www.instagram.com/dipika.yoga/', tag: "Подробнее", description: 'Преподаю йогу в традиции Б.К.С. Айенгара. "Этот метод идеально приспособлен для предотвращения физических и душевных болезней, для общего укрепления тела, что неизбежно развивает чувство уверенности в себе и своих силах." © скрипач Иегуди Менухин (1916-1999гг.)' },
  { master_chat_id: '371907941', sportType: 'Йога мастер', teacherName: "Ирина Богданова", type: "Ваджра йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/Irina.png", teacherTgUrl: 'https://t.me/healyoga', tag: "Подробнее", description: 'Преподаватель йоги Хиал. При абстрактном мышлении, которое использует практикующий адепт йоги ХиАл, развивается способность выхода за рамки привычной системы координат.  Регулярная практика приводит к способности различать и самому выбирать информацию к применению как на уровне ума, так и применяя к физической своей составляющей.' },
  { master_chat_id: '211166438', sportType: 'Йога мастер', teacherName: "Кирилл Корректный", type: "Ваджра йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/Kirill.jpg", teacherTgUrl: 'https://www.instagram.com/kirill_yoga/', tag: "Подробнее", description: 'Ищете эффективный и безопасный способ избавиться от болей в спине? Тогда наши совместные занятия — то, что вам нужно! Присоединяйтесь к нам, и всего за 30 минут в день вы забудете о болях в спине и получите удовольствие от занятий!' },
  { master_chat_id: '22222222222', sportType: 'Йога мастер', teacherName: "Карина Кодак", type: "Ваджра йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/Karina%20Kodak%202.jpg", teacherTgUrl: 'https://www.instagram.com/n.o.karma/', tag: "@n.o.karma", description: 'Преподаю Ваджра йогу. Учу работать с телом по методике корректного подхода к позвоночнику и работать с умом через медитацию и пранаяму (технику дыхания).В практике отсутствуют скрутки, повороты, боковые наклоны и глубокие прогибы.' },
  { master_chat_id: '209618178', sportType: 'Йога мастер', teacherName: "Анастасия Рябова", type: "Айенгара йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/anastasia_ryabova.jpg", teacherTgUrl: 'https://www.instagram.com/p/DAyqqXryct5/', tag: "Подробнее", description: 'Преподаю йогу в традиции Айенгара. Помогаю научиться совмещать йогу и спорт. Йога для спорта - идеальное комбо. Для эффективности движения нужна хорошая координация, нужны функциональные мышцы и хорошо подготовленные к нагрузкам нервная, дыхательная и сердечно-сосудистая системы. Йога может помочь по всем пунктам.' },
  {
    master_chat_id: '5111099345',
    sportType: 'Сноуборд инструктор',
    teacherName: "Антон Саминский",
    type: "Базовые навыки, основы карвинга",
    teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/anton_saminskiy_snowboard.jpeg",
    teacherTgUrl: 'https://snowandskill.notion.site/150e356eb4a880d988aefbbd52a4b833',
    tag: "Подробнее",
    description: 'Научу кататься на сноуборде красиво и безопасно с 0 или помогу исправить технику'
  },

];


const longClasses = [
  {
    id: "class-1",
    date: "16.12(пн) 6:00 GMT+3 (1ч.15м.)",
    title: "Бодрое утро",
    location: 'Онлайн',
    shortDescription: "Групповая практика в Zoom для зарядки энергией на весь день.",
    classDescription: "Групповая практика в Zoom для зарядки энергией на весь день.",
    price: "5 USDT",
    imageUrl: "https://storage.yandexcloud.net/start-image/masters/vladimir_mitiukov_2.jpg",
    master_chat_id: '334547237'
  },
  {
    id: "class-2",
    date: "16.12(пн) 20:30 GMT+3 (1ч.)",
    title: "Групповая практика",
    location: 'Онлайн',
    shortDescription: "Занятие в группе по Zoom.",
    classDescription: "Занятие в группе по Zoom.",
    price: "20 USDT",
    imageUrl: "https://storage.yandexcloud.net/start-image/masters/irina_bogdanova.jpg",
    master_chat_id: '371907941'
  },
  {
    id: "class-3",
    date: "Лично",
    title: "Индивидуальный класс",
    location: 'Онлайн',
    shortDescription: "Персональное занятие в Zoom.",
    classDescription: "Время занятий назначается индивидуально. Занятия в Zoom",
    price: "30 USDT",
    imageUrl: "https://storage.yandexcloud.net/start-image/masters/karina_kodak.jpg",
    master_chat_id: '22222222222'

  },
  {
    id: "class-4",
    date: "18.12(ср) 6:00 GMT+3 (1ч.15м.)",
    title: "Бодрое утро",
    location: 'Онлайн',
    shortDescription: "Групповая практика в Zoom для зарядки энергией на весь день.",
    classDescription: "Групповая практика в Zoom для зарядки энергией на весь день.",
    price: "5 USDT",
    imageUrl: "https://storage.yandexcloud.net/start-image/masters/vladimir_mitiukov_2.jpg",
    master_chat_id: '334547237'
  },
  {
    id: "class-5",
    date: "19.12(чт) 8:00 GMT+3 (1ч.30м.)",
    title: "Групповая практика",
    location: 'Онлайн',
    shortDescription: "Занятие в группе по Zoom.",
    classDescription: "Занятие в группе по Zoom.",
    price: "5 USDT",
    imageUrl: "https://storage.yandexcloud.net/start-image/masters/ansatasia_ryabova_2.jpg",
    master_chat_id: '209618178'
  },
  {
    id: "class-6",
    date: "19.12(чт) 20:30 GMT+3 (1ч.)",
    title: "Групповая практика",
    location: 'Онлайн',
    shortDescription: "Занятие в группе по Zoom.",
    classDescription: "Занятие в группе по Zoom.",
    price: "20 USDT",
    imageUrl: "https://storage.yandexcloud.net/start-image/masters/irina_bogdanova.jpg",
    master_chat_id: '371907941'

  },
  {
    id: "class-7",
    date: "20.12(пт) 6:00 GMT+3 (1ч.15м.)",
    title: "Бодрое утро",
    location: 'Онлайн',
    shortDescription: "Занятие в группе по Zoom.",
    classDescription: "Групповая практика в Zoom для зарядки энергией на весь день.",
    price: "5 USDT",
    imageUrl: "https://storage.yandexcloud.net/start-image/masters/vladimir_mitiukov_2.jpg",
    master_chat_id: '334547237'

  },
  {
    id: "class-8",
    date: "21.12(cб) 10:00-13:30 GMT+4",
    title: "Вельветовое утро",
    location: 'Цахкадзор',
    shortDescription: "Цахкадзор",
    classDescription: "Индивидуальное занятие или занятияе в группе 2 чел. до обеда. Продолжительность занятия определяется индивидуально",
    price: "Договорная",
    imageUrl: "https://storage.yandexcloud.net/start-image/masters/anton_saminskiy_snowboard_2.jpeg",
    master_chat_id: '5111099345'
  },
  {
    id: "class-9",
    date: "21.12(cб) 14:30-17:30 GMT+4",
    title: "Активный день",
    location: 'Цахкадзор',
    shortDescription: "Цахкадзор",
    classDescription: "Индивидуальное занятие или занятияе в группе 2 чел. после обеда. Продолжительность занятия определяется индивидуально",
    price: "Договорная",
    imageUrl: "https://storage.yandexcloud.net/start-image/masters/anton_saminskiy_snowboard_2.jpeg",
    master_chat_id: '5111099345'
  },
];

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


  // Move all hooks to the top level of the component
  const [currentDate, setCurrentDate] = useState("");
  const [activeTab, setActiveTab] = useState('home');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const wallet = useTonWallet();
  const rawAddress = useTonAddress();

  const activeTabHistory = useRef([]);

  useEffect(() => {
    const today = new Date();
    const options = { day: '2-digit', month: 'long' };
    setCurrentDate(today.toLocaleDateString("en-GB", options));
    // Notify Telegram that the web app is ready

    window.scrollTo(0, 0);
    const tg = window.Telegram.WebApp;
    const startParam = tg.initDataUnsafe?.start_param;

    if (startParam) {
      const foundClass = longClasses.find(c => c.id === startParam);
      if (foundClass) {
        setSelectedClass(foundClass);
        setActiveTab('classDetail');
      }
    }

  }, [activeTab]);


  // Early return if telegramData is not available
  if (!telegramData || !telegramData.user) {
    return <div>Failed to load Telegram data. Please reload the app.</div>;
  }

  const { id, first_name, last_name, username } = telegramData.user;
  const displayName = username || `${first_name || ''} ${last_name || ''}`.trim() || 'User';

  const navigateTo = (newTab) => {
    if (newTab !== activeTab) {
      // Push current tab onto history before navigating
      activeTabHistory.current.push(activeTab);
    }
    setActiveTab(newTab);
  };

  const mainCardsArray = [
    {
      sbt_id: "689",
      title: "5 минут внимания спине",
      description: "Уделите 5 минут внимания стержню вашего тела ",
      type: "Йога",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/yoga_org.png",
      wallet_address: rawAddress,
      tasks: [
        {
          taskName: 'Дыхательная практика',
          taskDescription: '1 минута медитации',
          taskImgURL: 'https://storage.yandexcloud.net/start-image/tasks/heart.svg',
          videoId: '',
          type: "breaf",
          duration: 5
        },
        {
          taskName: 'Онлайн-занятие',
          taskDescription: 'Обучение базовой асаны',
          taskImgURL: 'https://storage.yandexcloud.net/start-image/tasks/video.svg',
          videoId: 'IljzpVEE5KU'
        },
      ]
    },
    {
      sbt_id: "111",
      title: "7 дней питания",
      description: "Ведите дневник и узнайте, что вы на самом деле едите",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/food_org.png",
      wallet_address: rawAddress,
      tasks: [

      ]
    },
    {
      sbt_id: "222",
      title: "Беги к своей цели",
      description: "Покажи всем на сколько ты хорош в беге",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/run_org.png",
      wallet_address: rawAddress,
      tasks: [

      ]
    },
    {
      sbt_id: "333",

      title: "7 дней гармонии",
      description: "Улучшите свое самочувствие всего за одну неделю",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/yoga_org.png",
      wallet_address: rawAddress,
      tasks: [
        {
          taskName: 'Дыхательная практика',
          taskDescription: '5 минут медитации',
          taskImgURL: 'https://storage.yandexcloud.net/start-image/tasks/heart.svg'
        },
        {
          taskName: 'Онлайн-занятие',
          taskDescription: 'Обучение базовой асаны',
          taskImgURL: 'https://storage.yandexcloud.net/start-image/tasks/video.svg'
        }
      ]
    },
    {
      sbt_id: "444",

      title: "Вело приключение",
      description: "Откройте для себя новые горизонты на двух колесах",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/bike_org.png",
      wallet_address: rawAddress,
      tasks: [
      ]
    }
  ];

  const yogaCardsArray = [
    {
      sbt_id: "689",
      title: "5 минут внимания спине",
      description: "Уделите 5 минут внимания стержню вашего тела ",
      type: "Йога",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/yoga_org.png",
      wallet_address: rawAddress,
      tasks: [

      ]
    },
    {
      title: "7 дней гармонии",
      description: "Улучшите свое самочувствие всего за одну неделю",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/yoga_org.png",
      wallet_address: rawAddress,
    },
    {
      title: "7 дней гармонии",
      description: "Улучшите свое самочувствие всего за одну неделю",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/yoga_org.png",
      wallet_address: rawAddress,
    },
    {
      title: "7 дней гармонии",
      description: "Улучшите свое самочувствие всего за одну неделю",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/yoga_org.png",
      wallet_address: rawAddress,
    },
    {
      title: "7 дней гармонии",
      description: "Улучшите свое самочувствие всего за одну неделю",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/yoga_org.png",
      wallet_address: rawAddress,
    }
  ];

  const bikeCardsArray = [
    {
      title: "Вело приключение",
      description: "Откройте для себя новые горизонты на двух колесах",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/bike_org.png",
      wallet_address: rawAddress,
    },
    {
      title: "Вело приключение",
      description: "Откройте для себя новые горизонты на двух колесах",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/bike_org.png",
      wallet_address: rawAddress,
    },
    {
      title: "Вело приключение",
      description: "Откройте для себя новые горизонты на двух колесах",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/bike_org.png",
      wallet_address: rawAddress,
    },
    {
      title: "Вело приключение",
      description: "Откройте для себя новые горизонты на двух колесах",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/bike_org.png",
      wallet_address: rawAddress,
    },
    {
      title: "Вело приключение",
      description: "Откройте для себя новые горизонты на двух колесах",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/bike_org.png",
      wallet_address: rawAddress,
    }
  ];

  const runCardsArray = [
    {
      title: "Беги к своей цели",
      description: "Покажи всем на сколько ты хорош в беге",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/run_org.png",
      wallet_address: rawAddress,
    },
    {
      title: "Беги к своей цели",
      description: "Покажи всем на сколько ты хорош в беге",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/run_org.png",
      wallet_address: rawAddress,
    },
    {
      title: "Беги к своей цели",
      description: "Покажи всем на сколько ты хорош в беге",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/run_org.png",
      wallet_address: rawAddress,
    },
    {
      title: "Беги к своей цели",
      description: "Покажи всем на сколько ты хорош в беге",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/run_org.png",
      wallet_address: rawAddress,
    },
    {
      title: "Беги к своей цели",
      description: "Покажи всем на сколько ты хорош в беге",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/run_org.png",
      wallet_address: rawAddress,
    },
  ];

  const walkCardsArray = [
    {
      title: "Иди к своей цели",
      description: "Покажи всем как далеко ты готов зайти",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/walk.png",
      wallet_address: rawAddress,
    },
    {
      title: "Иди к своей цели",
      description: "Покажи всем как далеко ты готов зайти",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/walk.png",
      wallet_address: rawAddress,
    },
    {
      title: "Иди к своей цели",
      description: "Покажи всем как далеко ты готов зайти",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/walk.png",
      wallet_address: rawAddress,
    },
    {
      title: "Иди к своей цели",
      description: "Покажи всем как далеко ты готов зайти",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/walk.png",
      wallet_address: rawAddress,
    },
    {
      title: "Иди к своей цели",
      description: "Покажи всем как далеко ты готов зайти",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/walk.png",
      wallet_address: rawAddress,
    },
  ];

  const snowboardCardsArray = [
    {
      title: "Скользи!",
      description: "Покоряй самые крутые склоны",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/snowboard.png",
      wallet_address: rawAddress,
    },
    {
      title: "Скользи!",
      description: "Покоряй самые крутые склоны",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/snowboard.png",
      wallet_address: rawAddress,
    },
    {
      title: "Скользи!",
      description: "Покоряй самые крутые склоны",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/snowboard.png",
      wallet_address: rawAddress,
    },
    {
      title: "Скользи!",
      description: "Покоряй самые крутые склоны",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/snowboard.png",
      wallet_address: rawAddress,
    },
    {
      title: "Скользи!",
      description: "Покоряй самые крутые склоны",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/snowboard.png",
      wallet_address: rawAddress,
    }
  ];



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
            <h3 className="section-title">ЙОГА</h3>

            <CardsContainer
              cardsData={yogaCardsArray}
              handleCardClick={handleCardClick}
            />
            <h3 className="section-title">ВЕЛО</h3>

            <CardsContainer
              cardsData={bikeCardsArray}
              handleCardClick={handleCardClick}
            />
            <h3 className="section-title">Бег</h3>

            <CardsContainer
              cardsData={runCardsArray}
              handleCardClick={handleCardClick}
            />
            <h3 className="section-title">Ходьба</h3>

            <CardsContainer
              cardsData={walkCardsArray}
              handleCardClick={handleCardClick}
            />
            <h3 className="section-title">Сноуборд</h3>

            <CardsContainer
              cardsData={snowboardCardsArray}
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
  // console.log("selectedTeacher " + selectedTeacher)

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
                classes={longClasses}/>;
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
