import React, { useState } from 'react';

const DateRangeFilter = ({ onFilterChange, transactions }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      onFilterChange({ startDate, endDate, type: 'dateRange' });
      setIsOpen(false);
    }
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    onFilterChange(null);
    setIsOpen(false);
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

  return (
    <div className="dropdown">
      <button
        className="btn btn-outline-secondary btn-sm dropdown-toggle"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <i className="bi bi-calendar-range me-1"></i>
        Date Range
      </button>
      
      {isOpen && (
        <div className="dropdown-menu show p-3" style={{ minWidth: '280px' }}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Start Date</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={min}
              max={max}
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label small fw-semibold">End Date</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || min}
              max={max}
            />
          </div>
          
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary btn-sm flex-fill"
              onClick={handleApplyFilter}
              disabled={!startDate || !endDate}
            >
              Apply
            </button>
            <button
              className="btn btn-outline-secondary btn-sm flex-fill"
              onClick={handleClearFilter}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;