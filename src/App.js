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
import { TwaAnalyticsProvider } from '@tonsolutions/telemetree-react';

import WebApp from '@twa-dev/sdk'


const teachersList = [
  { sportType: 'Йога мастер', teacherName: "Владимир Митюков", type: "Айенгара йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg", teacherTgUrl: 'https://www.instagram.com/dipika.yoga/', tag: "@dipika.yoga", description: 'Преподаю йогу в традиции Б.К.С. Айенгара. "Этот метод идеально приспособлен для предотвращения физических и душевных болезней, для общего укрепления тела, что неизбежно развивает чувство уверенности в себе и своих силах." © скрипач Иегуди Менухин (1916-1999гг.)' },
  { sportType: 'Йога мастер', teacherName: "Ирина Богданова", type: "Ваджра йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/Irina.png", teacherTgUrl: 'https://t.me/healyoga', tag: "@healyoga", description: 'Преподаватель йоги Хиал. При абстрактном мышлении, которое использует практикующий адепт йоги ХиАл, развивается способность выхода за рамки привычной системы координат.  Регулярная практика приводит к способности различать и самому выбирать информацию к применению как на уровне ума, так и применяя к физической своей составляющей.' },
  { sportType: 'Йога мастер', teacherName: "Кирилл Корректный", type: "Ваджра йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/Kirill.jpg", teacherTgUrl: 'https://www.instagram.com/kirill_yoga/', tag: "@kirill_yoga", description: 'Ищете эффективный и безопасный способ избавиться от болей в спине? Тогда наши совместные занятия — то, что вам нужно! Присоединяйтесь к нам, и всего за 30 минут в день вы забудете о болях в спине и получите удовольствие от занятий!' },
  { sportType: 'Йога мастер', teacherName: "Карина Кодак", type: "Ваджра йога", teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/Karina%20Kodak%202.jpg", teacherTgUrl: 'https://www.instagram.com/n.o.karma/', tag: "@n.o.karma", description: 'Преподаю Ваджра йогу. Учу работать с телом по методике корректного подхода к позвоночнику и работать с умом через медитацию и пранаяму (технику дыхания).В практике отсутствуют скрутки, повороты, боковые наклоны и глубокие прогибы.' },

];

const shortClasses = [
  {
    date: "02.12(пн) 6:00-7:15 GMT+3",
    title: "Бодрое утро",
    shortDescription: "Занятие в группе по Zoom.",
    classDescription: "Групповая практика в Zoom для зарядки энергией на весь день.",
    price: "5 USDT",
    imageUrl: "https://storage.yandexcloud.net/start-image/masters/vladimir_mitiukov_2.jpg",
    sportType: 'Йога мастер',
    teacherName: "Владимир Митюков",
    type: "Йога Айенгара",
    teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg",
    teacherTgUrl: 'https://www.instagram.com/p/CipXcttK3ho/',
    tag: "Обо мне",
    description: 'Преподаю йогу в традиции Б.К.С. Айенгара. "Этот метод идеально приспособлен для предотвращения физических и душевных болезней, для общего укрепления тела, что неизбежно развивает чувство уверенности в себе и своих силах." © скрипач Иегуди Менухин (1916-1999гг.)'
  },
  {
    date: "02.12(пн) 20:30-21:30 GMT+3",
    title: "Групповая практика",
    shortDescription: "Занятие в группе по Zoom.",
    classDescription: "Занятие в группе по Zoom.",
    price: "20 USDT",
    imageUrl: "https://storage.yandexcloud.net/start-image/masters/irina_bogdanova.jpg",
    sportType: 'Йога мастер',
    teacherName: "Ирина Богданова",
    type: "ХиAл Йога",
    teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/irina_bogdanova_2.jpg",
    teacherTgUrl: 'https://www.instagram.com/p/CxNb4TXLcl0/',
    tag: "Обо мне",
    description: 'Преподаватель йоги Хиал. При абстрактном мышлении, которое использует практикующий адепт йоги ХиАл, развивается способность выхода за рамки привычной системы координат.  Регулярная практика приводит к способности различать и самому выбирать информацию к применению как на уровне ума, так и применяя к физической своей составляющей.'
  },

];

const longClasses = [
  {
    date: "02.12(пн) 6:00-7:15 GMT+3",
    title: "Бодрое утро",
    shortDescription: "Занятие в группе по Zoom.",
    classDescription: "Групповая практика в Zoom для зарядки энергией на весь день.",
    price: "5 USDT",
    imageUrl: "https://storage.yandexcloud.net/start-image/masters/vladimir_mitiukov_2.jpg",
    sportType: 'Йога мастер',
    teacherName: "Владимир Митюков",
    type: "Йога Айенгара",
    teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg",
    teacherTgUrl: 'https://www.instagram.com/p/CipXcttK3ho/',
    tag: "Подробнее",
    description: 'Преподаю йогу в традиции Б.К.С. Айенгара. "Этот метод идеально приспособлен для предотвращения физических и душевных болезней, для общего укрепления тела, что неизбежно развивает чувство уверенности в себе и своих силах." © скрипач Иегуди Менухин (1916-1999гг.)'
  },
  {
    date: "02.12(пн) 20:30-21:30 GMT+3",
    title: "Групповая практика",
    shortDescription: "Занятие в группе по Zoom.",
    classDescription: "Занятие в группе по Zoom.",
    price: "20 USDT",
    imageUrl: "https://storage.yandexcloud.net/start-image/masters/irina_bogdanova.jpg",
    sportType: 'Йога мастер',
    teacherName: "Ирина Богданова",
    type: "ХиAл Йога",
    teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/irina_bogdanova_2.jpg",
    teacherTgUrl: 'https://www.instagram.com/p/CxNb4TXLcl0/',
    tag: "Подробнее",
    description: 'Преподаватель йоги Хиал. При абстрактном мышлении, которое использует практикующий адепт йоги ХиАл, развивается способность выхода за рамки привычной системы координат.  Регулярная практика приводит к способности различать и самому выбирать информацию к применению как на уровне ума, так и применяя к физической своей составляющей.'
  },
  {
    date: "Лично",
    title: "Индивидуальный класс",
    shortDescription: "Персональное занятие в Zoom.",
    classDescription: "Время занятий назначается индивидуально. Занятия в Zoom",
    price: "30 USDT",
    imageUrl: "https://storage.yandexcloud.net/start-image/masters/karina_kodak.jpg",
    sportType: 'Йога мастер',
    teacherName: "Карина Кодак",
    type: "Ваджра Йога",
    teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/Karina%20Kodak%202.jpg",
    teacherTgUrl: 'https://www.instagram.com/p/CxqHC3AIMo2/',
    tag: "Подробнее",
    description: 'Преподаю Ваджра йогу. Учу работать с телом по методике корректного подхода к позвоночнику и работать с умом через медитацию и пранаяму (технику дыхания). В практике отсутствуют скрутки, повороты, боковые наклоны и глубокие прогибы.'
  },
  {
    date: "04.12(ср) 6:00-7:15 GMT+3",
    title: "Бодрое утро",
    shortDescription: "Занятие в группе по Zoom.",
    classDescription: "Групповая практика в Zoom для зарядки энергией на весь день.",
    price: "5 USDT",
    imageUrl: "https://storage.yandexcloud.net/start-image/masters/vladimir_mitiukov_2.jpg",
    sportType: 'Йога мастер',
    teacherName: "Владимир Митюков",
    type: "Йога Айенгара",
    teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg",
    teacherTgUrl: 'https://www.instagram.com/p/CipXcttK3ho/',
    tag: "Подробнее",
    description: 'Преподаю йогу в традиции Б.К.С. Айенгара. "Этот метод идеально приспособлен для предотвращения физических и душевных болезней, для общего укрепления тела, что неизбежно развивает чувство уверенности в себе и своих силах." © скрипач Иегуди Менухин (1916-1999гг.)'
  },
  {
    date: "05.12(чт) 8:00-9:30 GMT+3",
    title: "Групповая практика",
    shortDescription: "Занятие в группе по Zoom.",
    classDescription: "Занятие в группе по Zoom.",
    price: "5 USDT",
    imageUrl: "https://storage.yandexcloud.net/start-image/masters/ansatasia_ryabova_2.jpg",
    sportType: 'Йога мастер',
    teacherName: "Анастасия Рябова",
    type: "Йога Айенгара",
    teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/anastasia_ryabova.jpg",
    teacherTgUrl: 'https://www.instagram.com/p/DAyqqXryct5/',
    tag: "Подробнее",
    description: 'Преподаю йогу в традиции Айенгара. Помогаю научиться совмещать йогу и спорт. Йога для спорта - идеальное комбо. Для эффективности движения нужна хорошая координация, нужны функциональные мышцы и хорошо подготовленные к нагрузкам нервная, дыхательная и сердечно-сосудистая системы. Йога может помочь по всем пунктам.'
  },
  {
    date: "05.12(чт) 20:30-21:30 GMT+3",
    title: "Групповая практика",
    shortDescription: "Занятие в группе по Zoom.",
    classDescription: "Занятие в группе по Zoom.",
    price: "20 USDT",
    imageUrl: "https://storage.yandexcloud.net/start-image/masters/irina_bogdanova.jpg",
    sportType: 'Йога мастер',
    teacherName: "Ирина Богданова",
    type: "ХиAл Йога",
    teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/irina_bogdanova_2.jpg",
    teacherTgUrl: 'https://www.instagram.com/p/CxNb4TXLcl0/',
    tag: "Подробнее",
    description: 'Преподаватель йоги Хиал. При абстрактном мышлении, которое использует практикующий адепт йоги ХиАл, развивается способность выхода за рамки привычной системы координат.  Регулярная практика приводит к способности различать и самому выбирать информацию к применению как на уровне ума, так и применяя к физической своей составляющей.'
  },
  {
    date: "06.12(пт) 6:00-7:15 GMT+3",
    title: "Бодрое утро",
    shortDescription: "Занятие в группе по Zoom.",
    classDescription: "Групповая практика в Zoom для зарядки энергией на весь день.",
    price: "5 USDT",
    imageUrl: "https://storage.yandexcloud.net/start-image/masters/vladimir_mitiukov_2.jpg",
    sportType: 'Йога мастер',
    teacherName: "Владимир Митюков",
    type: "Йога Айенгара",
    teacherImageUrl: "https://storage.yandexcloud.net/start-image/masters/volodya.jpg",
    teacherTgUrl: 'https://www.instagram.com/p/CipXcttK3ho/',
    tag: "Подробнее",
    description: 'Преподаю йогу в традиции Б.К.С. Айенгара. "Этот метод идеально приспособлен для предотвращения физических и душевных болезней, для общего укрепления тела, что неизбежно развивает чувство уверенности в себе и своих силах." © скрипач Иегуди Менухин (1916-1999гг.)'
  },
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
  const displayName = username || `${first_name || ''} ${last_name || ''}`.trim() || 'User';

  const mainCardsArray = [
    {
      title: "5 минут внимания спине",
      description: "Уделите 5 минут внимания стержню вашего тела ",
      type: "Йога",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/yoga_org.png",
      wallet_address: rawAddress,
      tasks: [
        {
          taskName: 'Дыхательная практика',
          taskDescription: '1 минута медитации',
          taskImgURL:'https://storage.yandexcloud.net/start-image/tasks/heart.svg',
          videoId:'Zvs7mkcfo4k'
        },
        {
          taskName: 'Онлайн-занятие',
          taskDescription: 'Обучение базовой асаны',
          taskImgURL:'https://storage.yandexcloud.net/start-image/tasks/video.svg',
          videoId:'IljzpVEE5KU'
        }
      ]
    },
    {
      title: "7 дней питания",
      description: "Ведите дневник и узнайте, что вы на самом деле едите",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/food_org.png",
      wallet_address: rawAddress,
      tasks: [
        
      ]
    },
    {
      title: "Беги к своей цели",
      description: "Покажи всем на сколько ты хорош в беге",
      type: "Скоро",
      imageUrl: "https://storage.yandexcloud.net/start-image/sbts/run_org.png",
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
      tasks: [
        {
          taskName: 'Дыхательная практика',
          taskDescription: '5 минут медитации',
          taskImgURL:'https://storage.yandexcloud.net/start-image/tasks/heart.svg'
        },
        {
          taskName: 'Онлайн-занятие',
          taskDescription: 'Обучение базовой асаны',
          taskImgURL:'https://storage.yandexcloud.net/start-image/tasks/video.svg'
        }
      ]
    },
    {
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
                    onTeacherClick={handleTeacherClick} 
                    id={id}
                    username={displayName}// Pass the handleTeacherClick function
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
                    <ChallengeDetail
                      challengeDetailsItem={selectedChallenge}
                      id={id}
                      username={displayName} />

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
    </TwaAnalyticsProvider>

  );

}

export default App;
