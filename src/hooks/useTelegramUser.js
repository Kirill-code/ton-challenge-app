// src/hooks/useTelegramUser.js
import { useState, useEffect } from 'react';

export const useTelegramUser = () => {
  const [telegramUser, setTelegramUser] = useState(null);
  const [webApp, setWebApp] = useState(null);

  useEffect(() => {
    const initTelegram = () => {
      console.log('Checking for Telegram WebApp...');
      console.log('window.Telegram:', window.Telegram);
      
      if (window?.Telegram?.WebApp) {
        console.log('Telegram WebApp found!');
        const tg = window.Telegram.WebApp;
        console.log('InitData:', tg.initData);
        console.log('InitDataUnsafe:', tg.initDataUnsafe);
        
        setWebApp(tg);
        
        if (tg.initDataUnsafe?.user) {
          console.log('User data found:', tg.initDataUnsafe.user);
          setTelegramUser(tg.initDataUnsafe.user);
        } else {
          console.log('No user data found in initDataUnsafe');
        }
        
        // Initialize WebApp
        tg.ready();
        
        // Access MainButton if needed
        tg.MainButton.show();
      } else {
        console.log('Telegram WebApp not found. Are you running in Telegram?');
      }
    };

    initTelegram();
  }, []);

  return { telegramUser, webApp };
};

export default useTelegramUser;