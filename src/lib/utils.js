import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function to merge Tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format currency values
export function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format percentage values
export function formatPercentage(value, decimals = 1) {
  return `${(value * 100).toFixed(decimals)}%`;
}

// Format large numbers with abbreviations
export function formatNumber(num, decimals = 1) {
  if (num === 0) return '0';
  
  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['', 'K', 'M', 'B', 'T'];
  
  const i = Math.floor(Math.log(Math.abs(num)) / Math.log(k));
  
  if (i === 0) return num.toString();
  
  return parseFloat((num / Math.pow(k, i)).toFixed(dm)) + sizes[i];
}

// Calculate percentage change
export function calculatePercentageChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

// Get relative time string
export function getRelativeTime(date) {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now - targetDate) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}

// Debounce function
export function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Throttle function
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Generate random ID
export function generateId(length = 8) {
  return Math.random().toString(36).substr(2, length);
}

// Validate email
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const score = [
    password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar
  ].filter(Boolean).length;
  
  return {
    isValid: score >= 3,
    score,
    requirements: {
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    }
  };
}

// Deep clone object
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

// Group array by key
export function groupBy(array, key) {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
}

// Sort array by multiple criteria
export function sortBy(array, ...criteria) {
  return array.sort((a, b) => {
    for (const criterion of criteria) {
      let aVal, bVal, reverse = false;
      
      if (typeof criterion === 'string') {
        aVal = a[criterion];
        bVal = b[criterion];
      } else if (typeof criterion === 'function') {
        aVal = criterion(a);
        bVal = criterion(b);
      } else if (criterion.key) {
        aVal = a[criterion.key];
        bVal = b[criterion.key];
        reverse = criterion.reverse || false;
      }
      
      if (aVal < bVal) return reverse ? 1 : -1;
      if (aVal > bVal) return reverse ? -1 : 1;
    }
    return 0;
  });
}

// Calculate date ranges
export function getDateRange(period) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (period) {
    case 'today':
      return {
        start: startOfToday,
        end: new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000 - 1)
      };
    case 'week': {
      const startOfWeek = new Date(startOfToday);
      startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
      return {
        start: startOfWeek,
        end: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1)
      };
    }
    case 'month':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
      };
    case 'quarter': {
      const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0, 23, 59, 59, 999);
      return { start: quarterStart, end: quarterEnd };
    }
    case 'year':
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999)
      };
    default:
      return { start: startOfToday, end: now };
  }
}

// Color utilities
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function getContrastColor(hexColor) {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#000000';
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
}

// Local storage utilities
export function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage:`, error);
    return defaultValue;
  }
}

export function setToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage:`, error);
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage:`, error);
  }
}

// Error handling utilities
export function handleApiError(error) {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'Server error occurred',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'Network error - please check your connection',
      status: 0,
      data: null
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1,
      data: null
    };
  }
}

// URL utilities
export function buildUrl(base, params = {}) {
  const url = new URL(base);
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
}

export function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}
