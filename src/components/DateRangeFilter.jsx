import { useState } from 'react';

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

  // Mendapatkan tahun dan bulan dari transaksi
  const getYearsAndMonths = () => {
    if (!transactions || transactions.length === 0) return { years: [], months: [] };
    
    const dates = transactions.map(t => new Date(t.date));
    const years = [...new Set(dates.map(date => date.getFullYear()))];
    years.sort((a, b) => b - a); // Urutkan tahun dari terbaru
    
    return { years };
  };

  const { years } = getYearsAndMonths();
  const months = [
    { value: '0', label: 'Januari' },
    { value: '1', label: 'Februari' },
    { value: '2', label: 'Maret' },
    { value: '3', label: 'April' },
    { value: '4', label: 'Mei' },
    { value: '5', label: 'Juni' },
    { value: '6', label: 'Juli' },
    { value: '7', label: 'Agustus' },
    { value: '8', label: 'September' },
    { value: '9', label: 'Oktober' },
    { value: '10', label: 'November' },
    { value: '11', label: 'Desember' }
  ];

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
    <div className="dropdown position-relative w-100">
      <div className="input-group" style={{ minWidth: '200px' }}>
        <span className="input-group-text bg-light border-0">
          <i className="bi bi-calendar3"></i>
        </span>
        <button
          className="form-select text-start"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          style={{ textAlign: 'left' }}
        >
          {getFilterButtonLabel()}
        </button>
      </div>
      
      {isOpen && (
        <div className="dropdown-menu show p-3" style={{ minWidth: '280px', width: '100%' }}>
          <div className="mb-3">
            <button 
              className={`btn btn-outline-secondary btn-sm w-100 mb-3 ${!selectedYear && !selectedMonth ? 'active' : ''}`}
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
            
            <label className="form-label small fw-semibold">Filter Kustom</label>
            <div className="mb-2 border rounded p-2">
              <select 
                className="form-select form-select-sm mb-2"
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
                  className="form-control form-control-sm"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={min}
                  max={max}
                />
              )}
              
              {(filterType === 'byMonth' || filterType === 'byYear') && (
                <select
                  className="form-select form-select-sm mb-2"
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
                  className="form-select form-select-sm"
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
          
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary btn-sm flex-fill"
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