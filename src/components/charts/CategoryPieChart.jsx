import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = ({ transactions = [] }) => {
  const categoryTotals = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#0d6efd',
          '#dc3545',
          '#ffc107',
          '#198754',
          '#6f42c1',
          '#20c997'
        ]
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default CategoryPieChart;
