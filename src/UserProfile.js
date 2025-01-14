import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { useTonConnectUI } from '@tonconnect/ui-react';

import { User } from 'lucide-react';
import CalendarView from './CalendarView';
import React, { useState, useEffect } from "react";
import API_CONFIG from './config'; // Import the config
import './UserProfile.css';
import logo from './assets/logo.png';

const UserProfile = ({ displayNameUser, userId, classes }) => {
  const wallet = useTonWallet();
  const isConnected = !!wallet;
  const [visitsData, setVisitsData] = useState([]);
  const [loading, setLoading] = useState(true);  // tracks API loading status
  const [tonConnectUI] = useTonConnectUI();

  // State for the popup
  const [showPopup, setShowPopup] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);

  useEffect(() => {
    const fetchVisits = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/get_visits?user_id=${userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        let visits = Array.isArray(data) ? data : data ? [data] : [];

        const transformedData = visits.map((visit) => {
          const classItem = classes.find(
            (classItem) => classItem.id === visit.visit_id
          );
          return {
            date: visit.visit_date,
            title: visit.service_details,
            image_url: classItem ? classItem.image_url : null,
            status: visit.status,
            master_chat_id: visit.master_chat_id,
            visit_id: visit.visit_id,
            id: visit.id,
            wallet: visit.wallet, // Recipient's wallet address
            price: visit.price,   // Price in USDt
          };
        });

        setVisitsData(transformedData);
      } catch (error) {
        console.error('Failed to fetch visits:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchVisits();
    }
  }, [userId, classes]);

  const handleClassClick = (visit) => {
    console.log('Class clicked:', visit);
    setSelectedVisit(visit);
    setTransactionStatus(null); // Reset previous status
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedVisit(null);
    setTransactionStatus(null);
  };

  // Function to convert USDt to nanotons
  const convertUSDtToNanotons = (usdAmount) => {
    // Example conversion rate
    const conversionRate = 0.195; // TON per USDt
    const tonAmount = parseFloat(usdAmount) * conversionRate;
    const nanotons = tonAmount * 1_000_000_000;
    return Math.round(nanotons);
  };

  const sendTON = async () => {
    if (!wallet) {
      tonConnectUI.openModal();
      return;
    }

    if (!selectedVisit) {
      alert('No visit selected.');
      return;
    }

    const recipientAddress = selectedVisit.wallet;
    const usdPrice = selectedVisit.price.split(' ')[0];
    const amountNanotons = convertUSDtToNanotons(usdPrice);

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour from now
      messages: [
        {
          address: recipientAddress,
          amount: amountNanotons.toString(), // string in nanotons
        },
      ],
    };

    try {
      const result = await tonConnectUI.sendTransaction(transaction);
      console.log('Transaction result:', result);
      setTransactionStatus('success');
      alert('TON успешно отправлен!');
    } catch (error) {
      console.error('Ошибка при отправке TON:', error);
      setTransactionStatus('error');
      alert('Произошла ошибка при отправке TON.');
    }
  };

  return (
    <div className="profile-container">
      {isConnected ? (
        /* 
          When the user IS CONNECTED:
          - If loading => Show Spinner
          - Else => Show user info and visits.
        */
        loading ? (
          <div className="spinner-container">
            <img src={logo} className="spinner-logo" alt="Загрузка..." />
          </div>
        ) : (
          <>
            {/* Connected UI */}
            <div className="class-detail-teacher">
              <div className="class-image-container-teacher">
                <div className="wallet-icon">
                  <User size={48} />
                </div>
              </div>

              <div className="teacher-details-container">
                <p className="class-title-details-teacher">
                  {displayNameUser}
                </p>
                <div className="wallet-connect">
                  <TonConnectButton />
                </div>
              </div>

              <div className="classes-section">
                <h3 className="section-title">КЛАССЫ</h3>
              </div>
            </div>

            {visitsData.length > 0 ? (
              <CalendarView
                classesData={visitsData}
                onClassClick={handleClassClick}
              />
            ) : (
              <p className="comming-soon">Не запланировано.</p>
            )}

            <div className="classes-section">
              <h3 className="section-title">Достижения</h3>
              <a className="see-all">ВСЕ</a>
            </div>
            <p className="comming-soon">Скоро в приложении</p>

            <div className="container-support">
              <a className="teacher-tg-txt" href="https://t.me/ArandjoBot">
                Поддержка
              </a>
            </div>
          </>
        )
      ) : (
        /*
          When the user is NOT CONNECTED:
          - We still check loading.
        */
        <div>
          <div className="notification">
            <p className="notification-title">Подключите TON кошелек</p>
            <p className="notification-subtitle">
              Будет доступно больше функций
            </p>
            <div className="wallet-connect">
              <TonConnectButton />
            </div>
          </div>

          {loading && (
            <div className="spinner-container">
              <img src={logo} className="spinner-logo" alt="Загрузка..." />
            </div>
          )}

          {!loading && (
            <>
              <div className="classes-section">
                <h3 className="section-title">КЛАССЫ</h3>
              </div>
              {visitsData.length > 0 ? (
                <CalendarView
                  classesData={visitsData}
                  onClassClick={handleClassClick}
                />
              ) : (
                <p className="comming-soon">Не запланировано.</p>
              )}
            </>
          )}

          <div className="classes-section">
            <h3 className="section-title">Достижения</h3>
            <a className="see-all">ВСЕ</a>
          </div>
          <p className="comming-soon">Скоро в приложении</p>
          <div className="container-support">
            <a className="teacher-tg-txt" href="https://t.me/ArandjoBot">
              Поддержка
            </a>
          </div>
        </div>
      )}

      {showPopup && selectedVisit && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>Оплата занятия</h2>
            <p>
              <strong>Дата:</strong>{' '}
              {new Date(selectedVisit.date).toLocaleString()}
            </p>
            <p>
              <strong>Услуга:</strong> {selectedVisit.title}
            </p>
            <p>
              <strong>Цена:</strong> {selectedVisit.price}
            </p>

            <button className="button" onClick={sendTON}>
              Отправить TON
            </button>

            {transactionStatus === 'success' && (
              <p className="success-message">Платеж успешно отправлен!</p>
            )}
            {transactionStatus === 'error' && (
              <p className="error-message">Ошибка при отправке платежа.</p>
            )}

            <button onClick={closePopup} style={{ marginTop: '10px' }}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
