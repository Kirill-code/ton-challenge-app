// Constants for image processing
const IMAGE_CONFIG = {
    DEFAULT_MAX_WIDTH: 800,
    DEFAULT_MAX_HEIGHT: 800,
    DEFAULT_QUALITY: 0.8,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ACCEPTED_TYPES: ['image/jpeg', 'image/png'], // Removed HEIC and HEIF
  };
  
  /**
   * Validates image file before processing
   * @param {File} file - The image file to validate
   * @throws {Error} If validation fails
   */
  const validateImage = (file) => {
    if (!file) {
      throw new Error('No file provided');
    }
  
    if (!IMAGE_CONFIG.ACCEPTED_TYPES.includes(file.type)) {
      throw new Error(`Unsupported file type. Accepted types: ${IMAGE_CONFIG.ACCEPTED_TYPES.join(', ')}`);
    }
  
    if (file.size > IMAGE_CONFIG.MAX_FILE_SIZE) {
      throw new Error(`File too large. Maximum size: ${IMAGE_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }
  };
  
  /**
   * Compresses an image while maintaining aspect ratio
   * @param {File} file - The image file to compress
   * @param {Object} options - Compression options
   * @returns {Promise<string>} Base64 string of compressed image
   */
  const compressImage = async (file, options = {}) => {
    const {
      maxWidth = IMAGE_CONFIG.DEFAULT_MAX_WIDTH,
      maxHeight = IMAGE_CONFIG.DEFAULT_MAX_HEIGHT,
      quality = IMAGE_CONFIG.DEFAULT_QUALITY,
      timeout = 10000, // 10 seconds
    } = options;
  
    return new Promise((resolve, reject) => {
      try {
        validateImage(file);
  
        const reader = new FileReader();
        let timer;
  
        reader.onload = (event) => {
          const img = new Image();
  
          img.onload = () => {
            try {
              clearTimeout(timer);
              // Calculate dimensions while maintaining aspect ratio
              let { width, height } = calculateDimensions(img, maxWidth, maxHeight);
  
              // Create canvas and compress
              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
  
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                throw new Error('Failed to get canvas context');
              }
  
              // Draw and compress
              ctx.drawImage(img, 0, 0, width, height);
              const base64String = canvas.toDataURL(file.type, quality);
  
              // Log compression results
              logCompressionStats(file.size, base64String.length);
  
              resolve(base64String);
            } catch (error) {
              reject(new Error(`Image processing failed: ${error.message}`));
            }
          };
  
          img.onerror = () => {
            clearTimeout(timer);
            reject(new Error('Failed to load image. Please ensure the file is a valid image.'));
          };
  
          img.src = event.target.result;
        };
  
        reader.onerror = () => {
          clearTimeout(timer);
          reject(new Error('Failed to read file.'));
        };
  
        reader.readAsDataURL(file);
  
        // Set up the timeout
        timer = setTimeout(() => {
          reject(new Error('Image processing timed out. Please try a different image.'));
        }, timeout);
      } catch (error) {
        reject(error);
      }
    });
  };
  
  /**
   * Calculates new dimensions maintaining aspect ratio
   */
  const calculateDimensions = (img, maxWidth, maxHeight) => {
    let width = img.width;
    let height = img.height;
    
    const aspectRatio = width / height;
  
    if (width > maxWidth) {
      width = maxWidth;
      height = Math.round(width / aspectRatio);
    }
  
    if (height > maxHeight) {
      height = maxHeight;
      width = Math.round(height * aspectRatio);
    }
  
    return { width, height };
  };
  
  /**
   * Logs compression statistics
   */
  const logCompressionStats = (originalSize, compressedLength) => {
    const originalKB = Math.round(originalSize / 1024);
    const compressedKB = Math.round((compressedLength * 0.75) / 1024);
    console.log(`Original size: ${originalKB}KB`);
    console.log(`Compressed size: ${compressedKB}KB`);
    console.log(`Compression ratio: ${Math.round((compressedKB / originalKB) * 100)}%`);
  };
  
  /**
   * Main function to convert file to base64 with compression
   */
  export const fileToBase64 = async (file) => {
    try {
      validateImage(file);
      return await compressImage(file);
    } catch (error) {
      console.error('Error in fileToBase64:', error);
      throw error;
    }
  };
  
  /**
   * Version with customizable options
   */
  export const fileToBase64WithOptions = async (file, options = {}) => {
    try {
      validateImage(file);
      return await compressImage(file, options);
    } catch (error) {
      console.error('Error in fileToBase64WithOptions:', error);
      throw error;
    }
  };
  
  export default {
    fileToBase64,
    fileToBase64WithOptions,
    IMAGE_CONFIG,
  };
  