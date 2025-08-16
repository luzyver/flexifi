import PropTypes from 'prop-types';

const colors = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#6366f1',
  '#ec4899',
  '#14b8a6',
  '#8b5cf6'
];

function CategoryPieChart({ transactions }) {
  const totals = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
    return acc;
  }, {});

  const total = Object.values(totals).reduce((sum, v) => sum + v, 0);
  let cumulative = 0;
  const gradient = Object.entries(totals)
    .map(([, val], index) => {
      const percentage = (val / total) * 100;
      const start = cumulative;
      cumulative += percentage;
      const color = colors[index % colors.length];
      return `${color} ${start}% ${cumulative}%`;
    })
    .join(', ');

  return (
    <div className="flex flex-col items-center">
      <div
        className="w-40 h-40 rounded-full"
        style={{ background: `conic-gradient(${gradient})` }}
      />
      <ul className="mt-4 space-y-1 text-sm">
        {Object.keys(totals).map((cat, index) => (
          <li key={cat} className="flex items-center">
            <span
              className="inline-block w-3 h-3 mr-2 rounded"
              style={{ background: colors[index % colors.length] }}
            />
            {cat}
          </li>
        ))}
      </ul>
    </div>
  );
}

CategoryPieChart.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired
    })
  )
};

export default CategoryPieChart;
