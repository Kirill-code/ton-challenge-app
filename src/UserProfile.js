/*
 * Copyright © 2024, Kirill Code.
 * Business Source License 1.1
 * Change Date: November 23, 2026
 */
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { User } from 'lucide-react';
import CalendarView from './CalendarView';
import React, { useState, useEffect } from "react";
import API_CONFIG from './config'; // Import the config
import './UserProfile.css';

const UserProfile = ({ displayNameUser, userId, classes }) => {
  const wallet = useTonWallet();
  const isConnected = !!wallet;
  const [visitsData, setVisitsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for the popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    const fetchVisits = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/get_visits?user_id=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        let visits = Array.isArray(data) ? data : (data ? [data] : []);

        const transformedData = visits.map((visit) => {
          const classItem = classes.find((classItem) => classItem.id === visit.visit_id);
          return {
            date: visit.visit_date,
            title: visit.service_details,
            imageUrl: classItem ? classItem.imageUrl : null,
            price: visit.status === "scheduled" ? 'Запланировано' : visit.status,
            master_chat_id: visit.master_chat_id,
            visit_id: visit.visit_id,
            id: visit.id
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

  const handleClassClick = (classItem) => {
    console.log('pressed')
    setPopupMessage("Встреча запланирована");
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage('Скоро в приложении');
  };

  return (
    <div className="profile-container">
      {isConnected ? (
        <>
          <div className="class-detail-teacher">
            <div className="class-image-container-teacher">
              <div className="wallet-icon">
                <User size={48} />
              </div>
              
            </div>
            
            <div className='teacher-details-container'>
              <p className="class-title-details-teacher">{displayNameUser}</p>
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
            <p className='comming-soon'>Не запланировано.</p>
          )}

          <div className="classes-section">
            <h3 className="section-title">Достижения</h3>
            <a className="see-all">ВСЕ</a>
          </div>
          <p className='comming-soon'>Скоро в приложении</p>

          <div className='container-support'>
            <a className='teacher-tg-txt' href="https://t.me/ArandjoBot">Поддержка</a>
          </div>
        </>
      ) : (
        <div>
          <div className="notification">
            <p className="notification-title">Подключите TON кошелек</p>
            <p className="notification-subtitle">Будет доступно больше функций</p>
            <div className="wallet-connect">
              <TonConnectButton />
            </div>
          </div>

          {loading && <div>Загрузка</div>}
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
                <p className='comming-soon'>Не запланировано.</p>
              )}
            </>
          )}

          <div className="classes-section">
            <h3 className="section-title">Достижения</h3>
            <a className="see-all">ВСЕ</a>
          </div>
          <p className='comming-soon'>Скоро в приложении</p>
          <div className='container-support'>
            <a className='teacher-tg-txt' href="https://t.me/ArandjoBot">Поддержка</a>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <p>{popupMessage}</p>
            <button onClick={closePopup}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
