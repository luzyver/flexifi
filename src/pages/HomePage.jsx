import { Link } from 'react-router-dom';
import TransactionList from '../components/transactions/TransactionList';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import { formatRupiah } from '../utils/formatRupiah';

const HomePage = ({
  income,
  expense,
  balance,
  transactions,
  onDeleteTransaction,
  username,
}) => {
  return (
    <div className="p-4 space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-blue-600">
          Selamat datang kembali, {username}! 👋
        </h1>
        <p className="text-gray-600">
          Berikut ikhtisar keuangan Anda hari ini
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-500">Total Pemasukan</p>
          <p className="mt-2 text-2xl font-semibold text-green-600">
            {formatRupiah(income)}
          </p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-500">Total Pengeluaran</p>
          <p className="mt-2 text-2xl font-semibold text-red-600">
            {formatRupiah(expense)}
          </p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-500">Saldo Saat Ini</p>
          <p className={`mt-2 text-2xl font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatRupiah(balance)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="mb-4 text-lg font-semibold">Distribusi Kategori</h2>
          <CategoryPieChart transactions={transactions} />
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="mb-4 text-lg font-semibold">Tren Bulanan</h2>
          <MonthlyTrendChart transactions={transactions} />
        </div>
      </div>

      <section className="bg-white rounded shadow">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Transaksi Terbaru</h2>
          {transactions.length > 5 && (
            <Link to="/history" className="text-sm text-blue-600 hover:underline">
              Lihat Semua
            </Link>
          )}
        </div>
        <div className="p-4">
          {transactions.length > 0 ? (
            <TransactionList
              transactions={transactions}
              onDeleteTransaction={onDeleteTransaction}
              limit={5}
            />
          ) : (
            <div className="py-10 text-center text-gray-500">
              <div className="mb-3">
                <i className="bi bi-wallet2 text-5xl" />
              </div>
              <p className="mb-4">Belum ada transaksi</p>
              <Link
                to="/add-transaction"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                <i className="bi bi-plus-circle mr-2"></i>
                Tambah Transaksi Pertama
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
