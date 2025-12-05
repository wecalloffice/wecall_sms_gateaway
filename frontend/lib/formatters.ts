/**
 * Formatting utilities for common data transformations
 */

export const formatDate = (date: string | Date | undefined) => {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleString();
  } catch (e) {
    return 'Invalid date';
  }
};

export const formatDateShort = (date: string | Date | undefined) => {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString();
  } catch (e) {
    return 'Invalid date';
  }
};

export const formatTimeAgo = (date: string | Date | undefined) => {
  if (!date) return 'N/A';
  try {
    const now = new Date();
    const then = new Date(date);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  } catch (e) {
    return 'Invalid date';
  }
};

export const formatCurrency = (amount: number | undefined, currency = 'USD') => {
  if (amount === undefined || amount === null) return `${currency} 0.00`;
  return `${currency} ${amount.toFixed(2)}`;
};

export const formatPhoneNumber = (phone: string | undefined, prefix?: string) => {
  if (!phone) return 'N/A';
  return prefix ? `${prefix}${phone}` : phone;
};

export const formatStatusDisplay = (status: string | undefined) => {
  if (!status) return 'Unknown';
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatNumber = (num: number | undefined) => {
  if (num === undefined || num === null) return '0';
  return num.toLocaleString();
};

export const formatPercentage = (num: number | undefined, decimals = 1) => {
  if (num === undefined || num === null) return '0%';
  return `${(num * 100).toFixed(decimals)}%`;
};

export const truncateText = (text: string | undefined, length = 50) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

export const capitalize = (str: string | undefined) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
