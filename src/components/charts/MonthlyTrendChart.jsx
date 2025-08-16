import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const MonthlyTrendChart = ({ transactions = [] }) => {
  const monthlyTotals = transactions.reduce((acc, t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[key]) acc[key] = { income: 0, expense: 0 };
    if (t.type === 'pemasukan') {
      acc[key].income += t.amount;
    } else {
      acc[key].expense += t.amount;
    }
    return acc;
  }, {});

  const sortedKeys = Object.keys(monthlyTotals).sort();
  const labels = sortedKeys.map((key) => {
    const [year, month] = key.split('-');
    return new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Pemasukan',
        data: sortedKeys.map((k) => monthlyTotals[k].income),
        borderColor: '#198754',
        backgroundColor: '#198754',
        tension: 0.4
      },
      {
        label: 'Pengeluaran',
        data: sortedKeys.map((k) => monthlyTotals[k].expense),
        borderColor: '#dc3545',
        backgroundColor: '#dc3545',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default MonthlyTrendChart;
