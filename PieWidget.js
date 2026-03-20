import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTransactions } from '../../context/TransactionContext';

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#a855f7','#06b6d4','#f97316','#ec4899'];

const PieWidget = ({ config }) => {
  const { transactions } = useTransactions();

  const buildData = () => {
    const grouped = {};
    transactions.forEach((t) => {
      const key = t[config.chartData || 'category'] || 'Unknown';
      grouped[key] = (grouped[key] || 0) + 1;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  };

  const data = buildData();

  return (
    <div className="chart-widget">
      <div className="widget-title-bar">
        <div>
          <div className="widget-title">{config.title || 'Pie Chart'}</div>
          {config.description && <div className="widget-desc">{config.description}</div>}
        </div>
      </div>
      <div className="chart-area">
        {data.length === 0
          ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: 13 }}>No data to display</div>
          : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius="30%" outerRadius="60%" paddingAngle={3} dataKey="value">
                  {data.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                {config.showLegend && <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: 'var(--text-secondary)' }} />}
              </PieChart>
            </ResponsiveContainer>
          )
        }
      </div>
    </div>
  );
};

export default PieWidget;