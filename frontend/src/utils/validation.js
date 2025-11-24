// Input validation utilities

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {object} - {isValid: boolean, message: string}
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const isValid = emailRegex.test(email);
  return {
    isValid,
    message: isValid ? '' : 'Please enter a valid email address'
  };
};

/**
 * Validate Indian phone number (10 digits)
 * @param {string} phone - Phone number to validate
 * @returns {object} - {isValid: boolean, message: string}
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: false, message: 'Phone number is required' };
  }
  const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile numbers start with 6-9
  const isValid = phoneRegex.test(phone);
  return {
    isValid,
    message: isValid ? '' : 'Please enter a valid 10-digit Indian mobile number'
  };
};

/**
 * Validate password strength
 * Requirements: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 * @param {string} password - Password to validate
 * @returns {object} - {isValid: boolean, message: string}
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  const errors = [];
  
  if (password.length < 8) {
    errors.push('at least 8 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('one special character');
  }
  
  return {
    isValid: errors.length === 0,
    message: errors.length === 0 ? '' : `Password must contain ${errors.join(', ')}`
  };
};

/**
 * Validate Indian pincode (6 digits)
 * @param {string} pincode - Pincode to validate
 * @returns {object} - {isValid: boolean, message: string}
 */
export const validatePincode = (pincode) => {
  if (!pincode) {
    return { isValid: false, message: 'Pincode is required' };
  }
  const pincodeRegex = /^[1-9]\d{5}$/; // 6 digits, not starting with 0
  const isValid = pincodeRegex.test(pincode);
  return {
    isValid,
    message: isValid ? '' : 'Please enter a valid 6-digit Indian pincode'
  };
};

/**
 * Validate latitude
 * @param {number} latitude - Latitude to validate
 * @returns {object} - {isValid: boolean, message: string}
 */
export const validateLatitude = (latitude) => {
  if (!latitude && latitude !== 0) {
    return { isValid: false, message: 'Latitude is required' };
  }
  const lat = parseFloat(latitude);
  const isValid = !isNaN(lat) && lat >= -90 && lat <= 90;
  return {
    isValid,
    message: isValid ? '' : 'Latitude must be between -90 and 90'
  };
};

/**
 * Validate longitude
 * @param {number} longitude - Longitude to validate
 * @returns {object} - {isValid: boolean, message: string}
 */
export const validateLongitude = (longitude) => {
  if (!longitude && longitude !== 0) {
    return { isValid: false, message: 'Longitude is required' };
  }
  const lon = parseFloat(longitude);
  const isValid = !isNaN(lon) && lon >= -180 && lon <= 180;
  return {
    isValid,
    message: isValid ? '' : 'Longitude must be between -180 and 180'
  };
};

/**
 * Sanitize HTML to prevent XSS
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeHTML = (input) => {
  if (!input) return '';
  
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Validate number within range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateNumberRange = (value, min, max) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get password strength label
 * @param {string} password - Password to check
 * @returns {object} - {strength: string, color: string, percentage: number}
 */
export const getPasswordStrength = (password) => {
  let strength = 0;
  
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;
  if (/[a-z]/.test(password)) strength += 20;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/\d/.test(password)) strength += 20;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 10;
  
  let label = 'Weak';
  let color = 'red';
  
  if (strength >= 80) {
    label = 'Strong';
    color = 'green';
  } else if (strength >= 60) {
    label = 'Medium';
    color = 'yellow';
  }
  
  return { strength, label, color, percentage: strength };
};

export default {
  validateEmail,
  validatePhone,
  validatePassword,
  validatePincode,
  validateLatitude,
  validateLongitude,
  sanitizeHTML,
  validateNumberRange,
  validateURL,
  getPasswordStrength
};
