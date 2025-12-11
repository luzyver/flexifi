// Cached formatter for better performance
const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Format number to Indonesian Rupiah currency
 * @param {number|string} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatRupiah = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rp 0';
  }

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return 'Rp 0';
  }

  return rupiahFormatter.format(numAmount).replace(/\s+/g, ' ');
};

/**
 * Parse Rupiah string back to number
 * @param {string} rupiahString - Rupiah formatted string
 * @returns {number} Parsed number
 */
export const parseRupiahToNumber = (rupiahString) => {
  if (!rupiahString) return 0;

  const numericString = rupiahString.trim().replace(/(?!^-)[^0-9]/g, '');
  return numericString ? parseInt(numericString, 10) : 0;
};

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('id-ID').format(num);
};
