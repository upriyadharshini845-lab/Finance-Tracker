import React from 'react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { useTransactions } from '../../context/TransactionContext';

const buildChartData = (transactions, xAxis, yAxis) => {
  const grouped = {};
  transactions.forEach((t) => {
    let xVal = t[xAxis];
    if (xAxis === 'date') xVal = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!xVal) return;
    let yVal = yAxis === 'amount' ? t.amount || 0 : t[yAxis];
    if (!grouped[xVal]) grouped[xVal] = 0;
    if (typeof yVal === 'number') grouped[xVal] += yVal;
    else grouped[xVal] += 1;
  });
  return Object.entries(grouped).map(([name, value]) => ({ name, value })).slice(0, 20);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
        <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{typeof payload[0].value === 'number' ? payload[0].value.toLocaleString() : payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const ChartWidget = ({ type, config }) => {
  const { transactions } = useTransactions();
  const data = buildChartData(transactions, config.xAxis || 'category', config.yAxis || 'amount');
  const color = config.chartColor || '#6366f1';
  const axisStyle = { fontSize: 10, fill: 'var(--text-muted)' };
  const commonProps = { data, margin: { top: 10, right: 10, left: -10, bottom: 0 } };

  const renderChart = () => {
    if (type === 'bar') return (
      <BarChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="name" tick={axisStyle} />
        <YAxis tick={axisStyle} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" fill={color} radius={[4,4,0,0]}>
          {config.showDataLabel && <LabelList dataKey="value" position="top" style={{ fontSize: 9, fill: 'var(--text-muted)' }} />}
        </Bar>
      </BarChart>
    );
    if (type === 'line') return (
      <LineChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="name" tick={axisStyle} />
        <YAxis tick={axisStyle} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ fill: color, r: 3 }}>
          {config.showDataLabel && <LabelList dataKey="value" position="top" style={{ fontSize: 9, fill: 'var(--text-muted)' }} />}
        </Line>
      </LineChart>
    );
    if (type === 'area') return (
      <AreaChart {...commonProps}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="name" tick={axisStyle} />
        <YAxis tick={axisStyle} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="value" stroke={color} fill="url(#areaGrad)" strokeWidth={2} />
      </AreaChart>
    );
    return null;
  };

  return (
    <div className="chart-widget">
      <div className="widget-title-bar">
        <div>
          <div className="widget-title">{config.title || 'Chart'}</div>
          {config.description && <div className="widget-desc">{config.description}</div>}
        </div>
      </div>
      <div className="chart-area">
        {data.length === 0
          ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: 13 }}>No data to display</div>
          : <ResponsiveContainer width="100%" height="100%">{renderChart()}</ResponsiveContainer>
        }
      </div>
    </div>
  );
};

export default ChartWidget;