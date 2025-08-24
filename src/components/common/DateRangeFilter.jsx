import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];

const DateRangeFilter = ({ onFilterChange, transactions }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState('singleDate');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const handleApplyFilter = () => {
    if (filterType === 'singleDate' && selectedDate) {
      onFilterChange({ selectedDate, type: 'singleDate' });
      setIsOpen(false);
    } else if (filterType === 'byYear' && selectedYear) {
      onFilterChange({ selectedYear, type: 'byYear' });
      setIsOpen(false);
    } else if (filterType === 'byMonth' && selectedMonth && selectedYear) {
      onFilterChange({ selectedMonth, selectedYear, type: 'byMonth' });
      setIsOpen(false);
    }
  };

  const getDateRange = () => {
    if (!transactions || transactions.length === 0) return { min: '', max: '' };

    const dates = transactions.map(t => new Date(t.date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    return {
      min: minDate.toISOString().split('T')[0],
      max: maxDate.toISOString().split('T')[0]
    };
  };

  const { min, max } = getDateRange();

  // Mendapatkan tahun dan bulan unik dari transaksi
  const getYearsAndMonths = () => {
    if (!transactions || transactions.length === 0) return { years: [], months: [] };

    const dates = transactions.map(t => new Date(t.date));
    const years = [...new Set(dates.map(date => date.getFullYear()))];
    years.sort((a, b) => b - a); // Urutkan tahun dari terbaru

    const monthsSet = new Set(dates.map(date => date.getMonth()));
    const months = [...monthsSet]
      .sort((a, b) => a - b)
      .map(monthIndex => ({
        value: monthIndex.toString(),
        label: MONTH_NAMES[monthIndex]
      }));

    return { years, months };
  };

  const { years, months } = getYearsAndMonths();

  // Mendapatkan label untuk tombol filter
  const getFilterButtonLabel = () => {
    if (filterType === 'byYear' && selectedYear) {
      return `Tahun ${selectedYear}`;
    } else if (filterType === 'byMonth' && selectedMonth && selectedYear) {
      const monthName = months.find(m => m.value === selectedMonth)?.label;
      return `${monthName} ${selectedYear}`;
    } else if (filterType === 'singleDate' && selectedDate) {
      return selectedDate;
    } else {
      return 'Semua Transaksi';
    }
  };

  return (
    <div className="relative w-full min-w-48">
      <div className="flex">
        <div className="flex items-center px-3 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg">
          <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
        <button
          className="flex-1 px-3 py-2 text-left bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-r-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-900 dark:text-white truncate">{getFilterButtonLabel()}</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4 min-w-72">
          <div className="space-y-4">
            <button
              className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                !selectedYear && !selectedMonth
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => {
                setSelectedYear('');
                setSelectedMonth('');
                setFilterType('singleDate');
                onFilterChange(null);
                setIsOpen(false);
              }}
            >
              Semua Transaksi
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter Kustom</label>
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 space-y-3">
                <select
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="singleDate">Berdasarkan Tanggal</option>
                  <option value="byMonth">Berdasarkan Bulan</option>
                  <option value="byYear">Berdasarkan Tahun</option>
                </select>

                {filterType === 'singleDate' && (
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={min}
                    max={max}
                  />
                )}

                {(filterType === 'byMonth' || filterType === 'byYear') && (
                  <select
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="">Pilih Tahun</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                )}

                {filterType === 'byMonth' && (
                  <select
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option value="">Pilih Bulan</option>
                    {months.map(month => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <button
              className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              onClick={handleApplyFilter}
              disabled={
                (filterType === 'singleDate' && !selectedDate) ||
                (filterType === 'byYear' && !selectedYear) ||
                (filterType === 'byMonth' && (!selectedMonth || !selectedYear))
              }
            >
              Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
