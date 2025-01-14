// src/CourseDetail.jsx

import React, { useState, useEffect, useRef } from 'react';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import logo from './assets/logo.png';
import paid from './assets/paid.svg';
import leftArrow from './assets/Left.png';
import Tesseract from 'tesseract.js'; // Updated import
import { Upload } from 'lucide-react'; // Removed Copy icon as it wasn't used
import { toast } from 'react-toastify';
import { fileToBase64 } from './utils/fileToBase64'; // Import the new function
import './CourseDetail.css'; // Ensure you have styles for enabled/disabled lessons
import API_CONFIG from './config';

import CardsContainer from './CardsContainer';
import PaymentMethodCard from './PaymentMethodCard'; // Import the new component

const CourseDetail = ({ challengeDetailsItem, id, username, teachersList, onOpenVideo }) => {
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
  const [ocrProgress, setOcrProgress] = useState(0); // New state for OCR progress

  // Keywords to search for
  const RECEIPT_KEYWORDS = {
    russian: ['чек', 'итого', 'сумма', 'оплата', 'кассовый чек', 'банк', 'перевод', 'получатель'],
    georgian: ['ჩეკი', 'ჯამი', 'გადახდა', 'ანგარიში', 'მიმღები', 'ბანკი']
  };

  // Image validation configuration
  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  // Function to check if text contains receipt keywords
  const containsReceiptKeywords = (text) => {
    const lowerText = text.toLowerCase();
    return RECEIPT_KEYWORDS.russian.some(keyword => lowerText.includes(keyword)) ||
      RECEIPT_KEYWORDS.georgian.some(keyword => lowerText.includes(keyword));
  };

  // Safeguard for payment methods
  const paymentMethods = Array.isArray(challengeDetailsItem.paymentmethods) ? challengeDetailsItem.paymentmethods : [];

  // OCR Function using Tesseract.recognize
  const performOCR = async (imageFile) => {
    try {
      console.log('Starting OCR process...');

      // Perform OCR using the high-level recognize function
      const { data: { text } } = await Tesseract.recognize(
        imageFile,
        'rus+kat', // Languages to recognize
        {
          logger: (m) => {
            console.log(m);
            if (m.progress) {
              setOcrProgress(m.progress * 100); // Update OCR progress
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
        console.log("IMAGE: " + base64Image);
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

  console.log("Username", username);

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Unlocks the correct lesson(s) based on isFree or payment status
  const initializeTasks = () => {
    if (!tasksData.length) return;

    const enabled = tasksData.map(task => task.isFree || (eventData?.paid_date != null));
    setTasksEnabled(enabled);

    // Calculate progress based on finished tasks
    const finishedTasks = eventData?.finished_tasks || 0;
    const progress = tasksData.length > 0 ? (finishedTasks / tasksData.length) * 100 : 0;
    setProgressFilled(progress);
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
    setShowPaidModal(false);
    if (!wallet) {
      tonConnectUI.openModal();
      return;
    }

    const recipientAddress = challengeDetailsItem.wallet_address;
    // const usdPrice = challengeDetailsItem.price.split(' ')[0];

    const amountNanotons = convertUSDtToNanotons(challengeDetailsItem.price);

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
      toast.success('TON успешно отправлен!'); // Changed from alert to toast

      // Update the event with the new paid_date
      await updateEvent(eventData?.finished_tasks || 0, currentDate);
    } catch (error) {
      console.error('Ошибка при отправке TON:', error);
      setTransactionStatus('error');
      toast.error('Произошла ошибка при отправке TON. Попробуйте еще раз.');
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
        // Ensure it's a valid string that fits within varchar(255)
        requestBody.payment_image = paymentImage.substring(0, 255);
      }

      // For debugging
      console.log('Sending update request with body:', {
        ...requestBody,
        payment_image: paymentImage ? 'image_data_exists' : null // Log safely without the full image data
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

  // Fetch or create event on mount
  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    const fetchEventData = async () => {
      try {
        setLoading(true);
        const url = new URL(`${API_CONFIG.BASE_URL}/get_event`);
        url.searchParams.append('user_id', id);
        url.searchParams.append('sbt_id', challengeDetailsItem.id);

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message === "Event not found for the given user_id and event_id") {
            console.warn("Event not found => Creating new event with 0 tasks finished...");
            await postEvent(0);
            setLoading(false);
            return;
          } else {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
        } else {
          const data = await response.json();
          console.log('Get Event API response:', data);

          const eventObj = data.event || data.eventData;
          if (eventObj?.finished_tasks !== undefined) {
            setEventData(eventObj);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Fetch Event error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEventData();
  }, [challengeDetailsItem.id, id]);

  // Copy tasks
  useEffect(() => {
    if (challengeDetailsItem.tasks?.length > 0) {
      setTasksData(challengeDetailsItem.tasks);
    }
  }, [challengeDetailsItem.tasks]);

  // Re-initialize tasks when tasksData or eventData changes
  useEffect(() => {
    initializeTasks();
  }, [tasksData, eventData]);

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
      {/* Payment modal: shown if showPaidModal=true */}
      {/* Payment modal: shown if showPaidModal=true */}
      {showPaidModal && (
        <div className="modal-overlay" onClick={() => setShowPaidModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} tabIndex="-1">
            <h3>Урок платный</h3>
            <p>Внесите оплату одним из способов:</p>

            {/* Conditionally render CardsContainer only if no image has been uploaded */}
            {!uploadedFile && (
              <CardsContainer
                cardsData={paymentMethods}
                handleCardClick={(method) => {
                  // Optionally handle card click, e.g., select payment method
                  // For now, maybe do nothing or set selected method
                }}
                renderCard={(method, index) => <PaymentMethodCard key={index} method={method} />}
              />
            )}

            {/* Slider indicators, if needed */}
            {/* Optional: Remove if CardsContainer already supports swipe */}

            <div className="upload-section">
              <p>Загрузите скриншот или фото квитанции об оплате:</p>

              <label className="upload-button" htmlFor="receipt-upload">
                <Upload size={24} />
                <span>Загрузить квитанцию</span>
                <input
                  id="receipt-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png,.heic,.heif"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  disabled={isVerifying} // Disable while verifying
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
            <button className="buttonTon" onClick={sendTON}>Отправить TON</button>
            <button className="button" onClick={() => setShowPaidModal(false)}>Закрыть</button>
          </div>
        </div>
      )}


      <div className="image-container">
        <img
          src={challengeDetailsItem.image_url}
          alt="Challenge!"
          className="challenge-image"
          onError={(e) => { e.target.src = '/assets/default-challenge.png'; }} // Fallback image
        />
      </div>

      <p className="lessons-count">{getLessonCountText(tasksData.length)}</p>
      <p className="challenge-title-details">{challengeDetailsItem.title}</p>
      <p className="course-subtitle">{challengeDetailsItem.description}</p>

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
            style={{ cursor: 'pointer' }} // Always pointer to allow clicking
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
                  {!lesson.isFree && (
                    <span className="paid-label">
                      {eventData?.paid_date != null ? <img src={paid} alt="Paid" /> : ' (Платный)'}
                    </span>
                  )}
                </p>
                <p className="lesson-subtitle">
                  {lesson.description || '[без описания]'}
                </p>
              </div>
              <img src={leftArrow} alt=">" />
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
