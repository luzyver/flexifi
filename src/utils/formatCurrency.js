// client/src/utils/formatCurrency.js

/**
 * Memformat angka menjadi string mata uang Rupiah (IDR).
 * @param {number} amount - Jumlah uang.
 * @returns {string} - String Rupiah yang diformat.
 */
export const formatRupiah = (amount) => {
    // Pastikan amount adalah angka dan bukan NaN
    if (typeof amount !== 'number' || isNaN(amount)) {
      return 'Rp 0'; // Atau string error lain jika diinginkan
    }
  
    // Menggunakan Intl.NumberFormat untuk format mata uang
    // 'id-ID' untuk lokal Indonesia
    // 'currency' style untuk format mata uang
    // 'IDR' untuk kode mata uang Rupiah
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0, // Tidak menampilkan desimal untuk uang bulat
      maximumFractionDigits: 2, // Maksimal 2 desimal jika ada
    });
  
    return formatter.format(amount);
  };