// src/PaymentMethodCard.jsx

import React from 'react';
import { Copy } from 'lucide-react';
import { copyToClipboard } from './utils/copyToClipboard';
import './PaymentMethodCard.css'; // Create this CSS file for specific styles

const PaymentMethodCard = ({ method }) => {
  return (
    <div className="payment-method-card">
      <h4 className="payment-method-title">
        {method.country === "RU" ? "🇷🇺" : method.country === "GE" ? "🇬🇪" : "🏦"} Оплата через {method.bankName}
      </h4>
      <div className="payment-</h4>method-details">
        {method.cardNumber && (
          <p className="payment-detail">
            Номер карты:
            <span
              className="copyable-text"
              onClick={() => copyToClipboard(method.cardNumber)}
            >
              {method.cardNumber}
            </span>
            <button
              className="copy-button"
              onClick={() => copyToClipboard(method.cardNumber)}
              aria-label="Копировать номер карты"
            >
              <Copy size={16} />
            </button>
          </p>
        )}
        {method.iban && (
          <p className="payment-detail">
            IBAN:
            <span
              className="copyable-text"
              onClick={() => copyToClipboard(method.iban)}
            >
              {method.iban.length > 15 ? method.iban.substring(0, 9) + '...' : method.iban}
            </span>
            <button
              className="copy-button"
              onClick={() => copyToClipboard(method.iban)}
              aria-label="Копировать IBAN"
            >
              <Copy size={16} />
            </button>
          </p>
        )}
        <p className="payment-detail">Получатель: {method.receiver}</p>
        {method.phone && (
          <p className="payment-detail">
            Телефон:
            <span
              className="copyable-text"
              onClick={() => copyToClipboard(method.phone)}
            >
              {method.phone}
            </span>
            <button
              className="copy-button"
              onClick={() => copyToClipboard(method.phone)}
              aria-label="Копировать телефон"
            >
              <Copy size={16} />
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodCard;
