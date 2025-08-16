import PropTypes from 'prop-types';

function MonthlyTrendChart({ transactions }) {
  const monthlyTotals = transactions.reduce((acc, t) => {
    const date = new Date(t.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    acc[key] = (acc[key] || 0) + t.amount;
    return acc;
  }, {});

  const months = Object.keys(monthlyTotals).sort();
  const max = Math.max(...months.map(m => Math.abs(monthlyTotals[m])), 1);

  return (
    <div className="space-y-2">
      {months.map(m => {
        const value = Math.abs(monthlyTotals[m]);
        const width = (value / max) * 100;
        return (
          <div key={m}>
            <div className="text-xs mb-1">{m}</div>
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-blue-500 rounded"
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

MonthlyTrendChart.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired
    })
  )
};

export default MonthlyTrendChart;
