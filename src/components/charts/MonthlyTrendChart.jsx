import { memo, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const MonthlyTrendChart = memo(function MonthlyTrendChart({ transactions = [] }) {
  const { labels, data } = useMemo(() => {
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
      return new Date(year, month - 1).toLocaleDateString('id-ID', {
        month: 'short',
        year: '2-digit',
      });
    });

    return {
      labels,
      data: {
        labels,
        datasets: [
          {
            label: 'Pemasukan',
            data: sortedKeys.map((k) => monthlyTotals[k].income),
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#22c55e',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          },
          {
            label: 'Pengeluaran',
            data: sortedKeys.map((k) => monthlyTotals[k].expense),
            borderColor: '#f43f5e',
            backgroundColor: 'rgba(244, 63, 94, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#f43f5e',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          },
        ],
      },
    };
  }, [transactions]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: {
          family: "'Plus Jakarta Sans', sans-serif",
          size: 14,
          weight: '600',
        },
        bodyFont: {
          family: "'Plus Jakarta Sans', sans-serif",
          size: 13,
        },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => ` ${context.dataset.label}: Rp ${context.raw.toLocaleString('id-ID')}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
          },
          callback: (value) => `Rp ${(value / 1000000).toFixed(0)}jt`,
        },
      },
    },
  };

  if (!transactions.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <TrendingUp className="w-12 h-12 mb-3 opacity-50" />
        <p>Tidak ada data untuk ditampilkan</p>
      </div>
    );
  }

  return (
    <div className="h-72">
      <Line data={data} options={options} />
    </div>
  );
});

export default MonthlyTrendChart;
