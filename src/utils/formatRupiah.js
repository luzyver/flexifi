export const formatRupiah = (amount) => {
  // Handle non-numeric values
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rp 0';
  }
  
  // Convert to number if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle NaN after conversion
  if (isNaN(numAmount)) {
    return 'Rp 0';
  }

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Format and replace the weird space that sometimes appears in IDR format
  return formatter.format(numAmount).replace(/\s+/g, ' ');
};

// Function to parse Rupiah string back to number
export const parseRupiahToNumber = (rupiahString) => {
  if (!rupiahString) return 0;
  
  // Remove currency symbol, dots, and other non-digit characters
  const numericString = rupiahString.replace(/[^0-9]/g, '');
  
  // Convert to number
  return numericString ? parseInt(numericString, 10) : 0;
};