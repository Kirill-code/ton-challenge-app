// src/utils/copyToClipboard.js

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Copies the provided text to the clipboard.
 * Utilizes the Clipboard API if available, otherwise falls back to a manual method.
 * Displays success or error notifications accordingly.
 *
 * @param {string} text - The text to copy to the clipboard.
 */
export const copyToClipboard = async (text) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Скопировано успешно!');
    } catch (err) {
      console.error('Ошибка при копировании текста:', err);
      toast.error('Не удалось скопировать. Пожалуйста, попробуйте вручную.');
    }
  } else {
    // Fallback method for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    // Prevent scrolling to bottom
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        toast.success('Скопировано успешно!');
      } else {
        throw new Error('Команда копирования не удалась');
      }
    } catch (err) {
      console.error('Fallback: Ошибка при копировании текста:', err);
      toast.error('Не удалось скопировать. Пожалуйста, попробуйте вручную.');
    }

    document.body.removeChild(textarea);
  }
};
