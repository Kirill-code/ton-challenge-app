// src/CourseDetail.jsx

import React, { useState, useEffect, useRef } from 'react';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import logo from './assets/logo.png';
import paid from './assets/paid.svg';
import leftArrow from './assets/Left.png';
import { Lock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';


import Tesseract from 'tesseract.js'; // Updated import
import { Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import { fileToBase64 } from './utils/fileToBase64';
import './CourseDetail.css';
import { API_CONFIG } from './config';

import CardsContainer from './CardsContainer';
import PaymentMethodCard from './PaymentMethodCard';

const CourseDetail = ({ challengeDetailsItem, id, username, teachersList, onOpenVideo }) => {
  // useEffect(() => {
  //   console.log("=== CourseDetail Mount ===", {
  //     challengeId: challengeDetailsItem?.id,
  //     userId: id,
  //     username,
  //     hasChallenge: !!challengeDetailsItem,
  //     title: challengeDetailsItem?.title
  //   });
  // }, [challengeDetailsItem?.id, id, username]);
  const [activeTaskIndex, setActiveTaskIndex] = useState(null);
  const [progressFilled, setProgressFilled] = useState(0);
  const [tasksEnabled, setTasksEnabled] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const wallet = useTonWallet();
  const isConnected = !!wallet;
  const [tonConnectUI] = useTonConnectUI();
  const currentDate = new Date().toISOString();

  // New states for image handling
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [recognizedText, setRecognizedText] = useState('');
  const [ocrProgress, setOcrProgress] = useState(0);

  // UPDATED: Keywords to search for (Russian + Georgian + English)
  const RECEIPT_KEYWORDS = {
    russian: ['сумма', 'оплата', 'банк', 'перевод', 'получатель', 'чек', 'квитанция'],
    georgian: ['გადახდა', 'ანგარიში', 'მიმღები', 'ბანკი', 'შეკვეთა', 'ჩექი'],
    english: ['amount', 'payment', 'bank', 'transfer', 'receiver', 'check', 'receipt']
  };

  // Image validation configuration
  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  // UPDATED: Function to check if recognized text contains any of the receipt keywords in any language
  const containsReceiptKeywords = (text) => {
    const lowerText = text.toLowerCase();
    return (
      RECEIPT_KEYWORDS.russian.some(keyword => lowerText.includes(keyword)) ||
      RECEIPT_KEYWORDS.georgian.some(keyword => lowerText.includes(keyword)) ||
      RECEIPT_KEYWORDS.english.some(keyword => lowerText.includes(keyword))
    );
  };

  // Payment methods array safeguard
  const paymentMethods = Array.isArray(challengeDetailsItem.paymentmethods)
    ? challengeDetailsItem.paymentmethods
    : [];

  // UPDATED: OCR Function using Tesseract.recognize with English + Russian + Georgian
  const performOCR = async (imageFile) => {
    try {
      console.log('Starting OCR process...');
      const { data: { text } } = await Tesseract.recognize(
        imageFile,
        'eng+rus+kat', // Now recognizes English, Russian, and Georgian
        {
          logger: (m) => {
            if (m.progress) {
              setOcrProgress(m.progress * 100);
            }
          },
        }
      );
      console.log('OCR Result:', text);
      setRecognizedText(text);
      return text;
    } catch (error) {
      console.error('Detailed OCR error:', {
        message: error.message,
        stack: error.stack,
        imageType: imageFile instanceof File ? 'File' : typeof imageFile,
      });
      toast.error('Ошибка при распознавании текста. Попробуйте другое изображение.');
      throw error;
    } finally {
      setOcrProgress(0); // Reset progress
    }
  };

  // Function to validate image
  const validateImage = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      throw new Error('Неподдерживаемый формат файла. Разрешены только JPG, PNG и HEIC');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Файл слишком большой. Максимальный размер: 10MB');
    }

    return true;
  };

  // File upload handler
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsVerifying(true);
      setValidationError('');
      setUploadStatus('');

      // Validate image
      validateImage(file);

      // Convert file to Base64
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });

      // Create preview
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      setUploadedFile(file);

      // Perform OCR
      const text = await performOCR(await fileToBase64(file));
      console.log('Recognized text:', text); // Debug log

      // Check if text contains receipt keywords
      if (containsReceiptKeywords(text) && !eventData?.paid_date) {
        console.log("IMAGE: " + base64Image.length);
        await updateEvent(eventData?.finished_tasks || 0, currentDate, base64Image);
        setUploadStatus('success');
        toast.success('Квитанция подтверждена! Доступ открыт.');
        setTimeout(() => setShowPaidModal(false), 2000);
      } else {
        setUploadStatus('error');
        setValidationError('Текст не похож на квитанцию об оплате. Проверьте изображение.');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setValidationError(error.message);
      setUploadStatus('error');
      toast.error(`Ошибка при обработке квитанции: ${error.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  // State for the popup
  const [showPopup, setShowPopup] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);
  // Store the entire event object, so we can check paid_date
  const [eventData, setEventData] = useState(null);

  // For dev Strict Mode double fetch
  const didFetchRef = useRef(false);

  // NEW: show/hide the payment pop-up
  const [showPaidModal, setShowPaidModal] = useState(false);

  // console.log("Username", username);

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Unlocks the correct lesson(s) based on isFree or payment status
  // Add logging to initializeTasks
  const initializeTasks = () => {
    console.log("initializeTasks called with:", {
      tasksDataLength: tasksData?.length,
      eventData: eventData,
      paidDate: eventData?.paid_date
    });

    if (!tasksData.length) {
      console.log("No tasks data available, returning early");
      return;
    }

    const enabled = tasksData.map(task => {
      const isEnabled = task.isFree || eventData?.paid_date != null;
      console.log(`Task "${task.title}": isFree=${task.isFree}, isEnabled=${isEnabled}`);
      return isEnabled;
    });

    console.log("Final enabled array:", enabled);
    setTasksEnabled(enabled);

    const finishedTasks = eventData?.finished_tasks || 0;
    const progress = tasksData.length > 0 ? (finishedTasks / tasksData.length) * 100 : 0;
    console.log(`Progress calculation: ${finishedTasks}/${tasksData.length} = ${progress}%`);
    setProgressFilled(progress);
  };

  const fetchEventData = async () => {
    console.log("Fetching event data for:", {
      userId: id,
      sbtId: challengeDetailsItem.id
    });

    try {
      setLoading(true);
      const url = new URL(`${API_CONFIG.BASE_URL}/get_event`);
      url.searchParams.append('user_id', id);
      url.searchParams.append('sbt_id', challengeDetailsItem.id);

      console.log("Fetching from URL:", url.toString());

      // const response = await fetch(url.toString(), {
      //   method: 'GET',
      //   headers: { 'Content-Type': 'application/json' },
      // });

      // console.log("API Response status:", response.status);

      const maxRetries = 3;
      let attempts = 0;
      let response;
      let responseData;
      while (attempts < maxRetries) {
        try {
          response = await fetch(url.toString(), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          console.log("Response message:", response); // See the exact message

          responseData = await response.json();
          if (responseData.message === "Event not found for the given user_id and event_id") {
            console.log("Creating new event...");
            await postEvent(0);
            setLoading(false);
            return;
          }
          if (![500, 502, 504].includes(response.status)) {
            break;
          }
          //  else {
          //     throw new Error(`Error: ${response.status} ${response.statusText}`);
          //   }
        } catch (error) {
          console.error('Fetch error:', error);
        }
        attempts++;
      }


      // const data = await response.json();
      console.log("Event data received:", responseData);

      const eventObj = responseData.event || responseData.eventData;
      if (eventObj?.finished_tasks !== undefined) {
        console.log("Setting event data:", eventObj);
        setEventData(eventObj);
      }


      setLoading(false);
    } catch (err) {
      console.error("Error in fetchEventData:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Enhance useEffect logging
  useEffect(() => {
    console.log("Initial useEffect triggered");
    fetchEventData();
  }, [challengeDetailsItem.id, id]);

  useEffect(() => {
    console.log("Tasks useEffect triggered:", {
      tasksLength: challengeDetailsItem.tasks?.length
    });

    if (challengeDetailsItem.tasks?.length > 0) {
      setTasksData(challengeDetailsItem.tasks);
    }
  }, [challengeDetailsItem.tasks]);

  useEffect(() => {
    console.log("Tasks/Event useEffect triggered:", {
      tasksDataLength: tasksData?.length,
      hasEventData: !!eventData
    });

    initializeTasks();
  }, [tasksData, eventData]);


  // keep your CoinMarketCap function:
  async function fetchTonPriceFromCMC() {
    try {
      const response = await fetch(
        API_CONFIG.BASE_URL + '/get_coin_price?symbol=TON'
      );
      if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      // data structure mirrors what CoinMarketCap returns
      // For example: data.data.TON.quote.USD.price
      return data.data?.TON?.quote?.USD?.price || 0;
    } catch (error) {
      console.error('Error fetching price:', error);
      throw error;
    }
  }


  const sendTON = async () => {
    setShowPaidModal(false);

    // 1) If no wallet, open TonConnect
    if (!wallet) {
      tonConnectUI.openModal();
      return;
    }

    try {
      // 2) Get live TON price in USD from CoinMarketCap
      const tonPriceUSD = await fetchTonPriceFromCMC();
      if (!tonPriceUSD) {
        throw new Error("Could not fetch TON price from CMC");
      }

      // 3) Convert your USDT price (which is basically 1:1 with USD) into TON
      const userUsdt = parseFloat(challengeDetailsItem.price) || 0; // e.g. 10 USDT
      // TON = USDT price / TON price in USD
      const tonAmount = userUsdt / tonPriceUSD;
      // 4) Convert TON → nanotons (multiply by 1e9)
      const amountNanotons = Math.round(tonAmount * 1_000_000_000);

      // 5) Prepare and send the transaction
      const recipientAddress = challengeDetailsItem.wallet_address;
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour from now
        messages: [
          {
            address: recipientAddress,
            amount: amountNanotons.toString(), // must be a string in nanotons
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      console.log("Transaction result:", result);
      setTransactionStatus("success");
      toast.success("TON успешно отправлен!");

      // 6) If successful, update your event with paid_date
      await updateEvent(eventData?.finished_tasks || 0, currentDate);
    } catch (error) {
      console.error("Ошибка при отправке TON:", error);
      setTransactionStatus("error");
      const errorName = error?.name || '';
      const errorMessage = error?.message || '';
      // Check error name or message
      if (
        errorName === 'UserRejectsError' ||
        errorMessage.includes('UserRejectsError') ||
        errorMessage.includes('User rejects the action') ||
        errorMessage.includes('Wallet declined the request')
      ) {
        // User manually canceled the transaction
        toast.error('Вы отменили транзакцию в кошельке');
      }
      // Check for "transaction was not sent"
      else if (
        errorName === 'TonConnectUIError' ||
        errorMessage.includes('TonConnectUIError') ||
        errorMessage.includes('Transaction was not sent')
      ) {
        // Transaction didn't go through at all
        toast.error('Транзакция не была отправлена. Попробуйте ещё раз или свяжитесь со службой поддержки.');
      }
      // Fallback for other/unexpected errors
      else {
        toast.error(`Произошла ошибка: ${errorMessage}`);
      }
    }
  };


  // CREATE the event
  const postEvent = async (finishedTasks) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/post_event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: id,
          event_name: `${challengeDetailsItem.title} ${challengeDetailsItem.date}`,
          sbt_id: challengeDetailsItem.id,
          status: 'run',
          username,
          finished_tasks: finishedTasks,
          tasks_number: challengeDetailsItem.tasks.length,
          tasks: JSON.stringify(challengeDetailsItem.tasks),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('postEvent response:', data);

      const eventObj = data.event || data.eventData;
      if (eventObj) {
        setEventData(eventObj);
        initializeTasks();
      }
      return data;
    } catch (err) {
      console.error('Post Event API error:', err);
      setError(err.message);
      return null;
    }
  };

  // UPDATE the event
  const updateEvent = async (finishedTasks, paidDate = null, paymentImage = null) => {
    try {
      // Base request body
      const requestBody = {
        user_id: id,
        sbt_id: challengeDetailsItem.id,
        status: finishedTasks === challengeDetailsItem.tasks.length ? 'completed' : 'run',
        username,
        finished_tasks: finishedTasks,
        tasks_number: challengeDetailsItem.tasks.length,
      };

      // Add paid_date if it exists
      if (paidDate) {
        requestBody.paid_date = paidDate;
      }

      // Add payment_image if it exists
      if (paymentImage) {
        requestBody.payment_image = paymentImage;
        requestBody.status = "paid";
      }

      console.log('Sending update request with body:', {
        ...requestBody,
        payment_image: paymentImage ? 'image_data_exists' : null
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}/update_event`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Update event error:', errorData);
        throw new Error(errorData.message || 'Failed to update event');
      }

      const data = await response.json();
      console.log('updateEvent response:', data);

      const eventObj = data.event || data.eventData;
      if (eventObj) {
        setEventData(eventObj);
        initializeTasks();
      }
    } catch (err) {
      console.error('Update Event API call error:', err);
      setError(err.message);
      toast.error('Ошибка при обновлении события.');
    }
  };

  // // Fetch or create event on mount
  // useEffect(() => {
  //   // if (didFetchRef.current) return;
  //   // didFetchRef.current = true;

  //   const fetchEventData = async () => {
  //     try {
  //       setLoading(true);
  //       const url = new URL(`${API_CONFIG.BASE_URL}/get_event`);
  //       url.searchParams.append('user_id', id);
  //       url.searchParams.append('sbt_id', challengeDetailsItem.id);

  //       const response = await fetch(url.toString(), {
  //         method: 'GET',
  //         headers: { 'Content-Type': 'application/json' },
  //       });

  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         if (errorData.message === "Event not found for the given user_id and event_id") {
  //           console.warn("Event not found => Creating new event with 0 tasks finished...");
  //           await postEvent(0);
  //           setLoading(false);
  //           return;
  //         } else {
  //           throw new Error(`Error: ${response.status} ${response.statusText}`);
  //         }
  //       } else {
  //         const data = await response.json();
  //         console.log('Get Event API response:', data);

  //         const eventObj = data.event || data.eventData;
  //         if (eventObj?.finished_tasks !== undefined) {
  //           setEventData(eventObj);
  //         }
  //       }
  //       setLoading(false);
  //     } catch (err) {
  //       console.error('Fetch Event error:', err);
  //       setError(err.message);
  //       setLoading(false);
  //     }
  //   };

  //   fetchEventData();
  // }, [challengeDetailsItem.id, id]);

  // // Copy tasks
  // useEffect(() => {
  //   if (challengeDetailsItem.tasks?.length > 0) {
  //     setTasksData(challengeDetailsItem.tasks);
  //   }
  // }, [challengeDetailsItem.tasks]);

  // // Re-initialize tasks when tasksData or eventData changes
  // useEffect(() => {
  //   console.log("useEffect [tasksData, eventData] fired");

  //   initializeTasks();
  // }, [tasksData, eventData]);

  // Clicking a lesson
  const handleTaskClick = async (index) => {
    const lesson = tasksData[index];

    if (lesson.isFree) {
      // Free lesson, proceed to open video
      setActiveTaskIndex(index);
      const newFinishedTasks = Math.min(index + 1, tasksData.length);
      await updateEvent(newFinishedTasks);

      if (onOpenVideo) {
        onOpenVideo(lesson.videoLink);
      }
    } else {
      if (eventData?.paid_date != null) {
        // User has paid, proceed to open video
        setActiveTaskIndex(index);
        const newFinishedTasks = Math.min(index + 1, tasksData.length);
        await updateEvent(newFinishedTasks);

        if (onOpenVideo) {
          onOpenVideo(lesson.videoLink);
        }
      } else {
        // User hasn't paid, show payment modal
        setShowPaidModal(true);
      }
    }
  };

  // Slider navigation handlers
  const nextSlide = () => {
    const totalSlides = paymentMethods.length;
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const totalSlides = paymentMethods.length;
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  // Keyboard navigation for slider
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showPaidModal) {
        if (e.key === 'ArrowLeft') {
          prevSlide();
        } else if (e.key === 'ArrowRight') {
          nextSlide();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPaidModal, paymentMethods.length]);

  if (loading) {
    return (
      <div className="spinner-container">
        <img src={logo} className="spinner-logo" alt="Загрузка..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="spinner-container">
        <p>Ошибка: {error}</p>
        <p>Обновите страницу.</p>
      </div>
    );
  }

  const getLessonCountText = (count) => {
    if (count === 1) return '1 урок';
    if (count > 1 && count < 5) return `${count} урока`;
    return `${count} уроков`;
  };

  return (
    <div className="challenge-detail">
      {showPaidModal && (
        <div className="modal-overlay" onClick={() => setShowPaidModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} tabIndex="-1">
            <h3>Урок платный</h3>
            <span>Внесите оплату одним из способов:</span>

            {/* If no file uploaded yet, show the payment methods */}
            {!uploadedFile && (
              <CardsContainer
                cardsData={paymentMethods}
                handleCardClick={(method) => {
                  // e.g., setSelectedMethod(method)
                }}
                renderCard={(method, index) => <PaymentMethodCard key={index} method={method} />}
              />
            )}

            <div className="upload-section">
              <p>Загрузите скриншот или фото квитанции об оплате:</p>
              <br />
              <label className="upload-button" htmlFor="receipt-upload">
                <Upload size={24} />
                <span>Загрузить квитанцию</span>
                <input
                  id="receipt-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png,.heic,.heif"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  disabled={isVerifying}
                />
              </label>

              {validationError && (
                <p className="error-message">{validationError}</p>
              )}

              {previewUrl && (
                <div className="image-preview">
                  <img src={previewUrl} alt="Preview" loading="lazy" />
                </div>
              )}

              {uploadedFile && !validationError && (
                <div className="upload-status">
                  <p>Файл: {uploadedFile.name}</p>
                  {isVerifying && <img src={logo} className="spinner-logo" alt="Загрузка..." />}
                  {uploadStatus === 'success' && (
                    <p className="success">Квитанция подтверждена! Доступ открыт.</p>
                  )}
                  {uploadStatus === 'error' && !validationError && (
                    <p className="error">Не удалось подтвердить квитанцию. Попробуйте другой файл или свяжитесь с нами.</p>
                  )}
                </div>
              )}

              {isVerifying && (
                <div className="uploading-message">
                  <p>Загрузка и проверка изображения...</p>
                </div>
              )}

              {/* Display OCR progress */}
              {isVerifying && ocrProgress > 0 && (
                <div className="ocr-progress">
                  <p>Распознавание текста: {Math.round(ocrProgress)}%</p>
                  <progress value={ocrProgress} max="100" />
                </div>
              )}
            </div>

            <div className="modal-buttons">
              <button className="buttonTon" onClick={sendTON}>Отправить TON</button>
              <button className="button" onClick={() => setShowPaidModal(false)}>Закрыть</button>
            </div>
          </div>
        </div>
      )}

      <div className="image-container">
        <img
          src={challengeDetailsItem.image_url}
          alt="Challenge!"
          className="challenge-image"
          onError={(e) => { e.target.src = '/assets/default-challenge.png'; }}
        />
      </div>

      <p className="lessons-count">{getLessonCountText(tasksData.length)}</p>
      {challengeDetailsItem.price ? <p className="lessons-count">{challengeDetailsItem.price+" "+ challengeDetailsItem.currency}</p> : null}
      {console.log("Event data:", eventData)}
      <p className="challenge-title-details">{challengeDetailsItem.title}</p>
      <ReactMarkdown className="course-subtitle">{challengeDetailsItem.description}</ReactMarkdown>

      <div className="challenge-progress">
        <div
          className="challenge-progress-filled"
          style={{
            backgroundColor: '#007AFF',
            height: '16px',
            width: `${progressFilled}%`,
            transition: 'width 0.5s ease',
          }}
        />
      </div>

      <div className="lessons-container">
        {tasksData.map((lesson, idx) => (
          <div
            key={idx}
            className={`lesson-card ${tasksEnabled[idx] ? 'enabled' : 'disabled'} ${!lesson.isFree ? 'paid-lesson' : 'free-lesson'}`}
            onClick={() => handleTaskClick(idx)}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={tasksEnabled[idx] ? 0 : -1}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && tasksEnabled[idx]) {
                handleTaskClick(idx);
              }
            }}
            aria-disabled={!tasksEnabled[idx]}
          >
            <div className="lesson-card-inner">
              <div className="lesson-content">
                <p className="lesson-title">
                  Урок {idx + 1}: {lesson.title}
                  {/* {!lesson.isFree && (
                    <span className="paid-label">
                      {eventData?.paid_date != null ? <img src={paid} alt="Paid" /> : ' (Платный)'}
                    </span>
                  )} */}
                </p>
                <p className="lesson-subtitle">
                  {lesson.description}
                </p>
              </div>
              {tasksEnabled[idx]
                ? <img src={leftArrow} alt=">" />
                : <Lock size={18} />
              }


            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetail;

/*
* Copyright © 2024, Kirill Code.
* Business Source License 1.1
* Change Date: November 23, 2026
*/
