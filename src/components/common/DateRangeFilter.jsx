import { useState, useMemo, memo } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const DateRangeFilter = memo(function DateRangeFilter({ onFilterChange, transactions }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const { years, dateRange } = useMemo(() => {
    if (!transactions?.length) return { years: [], dateRange: { min: '', max: '' } };

    const dates = transactions.map((t) => new Date(t.date));
    const yearsSet = new Set(dates.map((d) => d.getFullYear()));

    return {
      years: [...yearsSet].sort((a, b) => b - a),
      dateRange: {
        min: new Date(Math.min(...dates)).toISOString().split('T')[0],
        max: new Date(Math.max(...dates)).toISOString().split('T')[0],
      },
    };
  }, [transactions]);

  const getLabel = () => {
    if (filterType === 'all') return 'Semua Transaksi';
    if (filterType === 'date' && selectedDate) return selectedDate;
    if (filterType === 'month' && selectedMonth && selectedYear) {
      return `${MONTHS[parseInt(selectedMonth)]} ${selectedYear}`;
    }
    if (filterType === 'year' && selectedYear) return `Tahun ${selectedYear}`;
    return 'Pilih Filter';
  };

  const handleApply = () => {
    if (filterType === 'all') {
      onFilterChange(null);
    } else if (filterType === 'date' && selectedDate) {
      onFilterChange({ type: 'singleDate', selectedDate });
    } else if (filterType === 'month' && selectedMonth && selectedYear) {
      onFilterChange({ type: 'byMonth', selectedMonth, selectedYear });
    } else if (filterType === 'year' && selectedYear) {
      onFilterChange({ type: 'byYear', selectedYear });
    }
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilterType('all');
    setSelectedDate('');
    setSelectedMonth('');
    setSelectedYear('');
    onFilterChange(null);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors"
      >
        <Calendar className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{getLabel()}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-50 animate-fade-in">
            <div className="space-y-4">
              {/* Filter Type */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'all', label: 'Semua' },
                  { value: 'date', label: 'Tanggal' },
                  { value: 'month', label: 'Bulan' },
                  { value: 'year', label: 'Tahun' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setFilterType(value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      filterType === value
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Date Input */}
              {filterType === 'date' && (
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={dateRange.min}
                  max={dateRange.max}
                  className="input-modern"
                />
              )}

              {/* Year Select */}
              {(filterType === 'month' || filterType === 'year') && (
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="input-modern"
                >
                  <option value="">Pilih Tahun</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              )}

              {/* Month Select */}
              {filterType === 'month' && (
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="input-modern"
                >
                  <option value="">Pilih Bulan</option>
                  {MONTHS.map((m, i) => (
                    <option key={i} value={i}>{m}</option>
                  ))}
                </select>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button onClick={handleReset} className="btn-secondary flex-1 py-2 text-sm">
                  <X className="w-4 h-4 mr-1 inline" />
                  Reset
                </button>
                <button onClick={handleApply} className="btn-primary flex-1 py-2 text-sm">
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default DateRangeFilter;
