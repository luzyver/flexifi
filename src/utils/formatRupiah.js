export const formatRupiah = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'Rp 0';
  }

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(amount);
};
