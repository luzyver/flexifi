// client/src/pages/HomePage.jsx
import React from 'react';
import Balance from '../components/Balance';
import AddTransaction from '../components/AddTransaction';
// import { formatRupiah } from '../utils/formatCurrency'; // Tidak perlu di sini, sudah di Balance

const HomePage = ({ income, expense, balance, onAddTransaction }) => {
  return (
    <>
      <Balance income={income} expense={expense} balance={balance} />
      <AddTransaction onAddTransaction={onAddTransaction} />
    </>
  );
};

export default HomePage;