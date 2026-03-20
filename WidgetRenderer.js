import React from 'react';
import KPIWidget from './KPIWidget';
import ChartWidget from './ChartWidget';
import PieWidget from './PieWidget';
import TableWidget from './TableWidget';

const WidgetRenderer = ({ widget }) => {
  switch (widget.type) {
    case 'kpi': return <KPIWidget config={widget.config} />;
    case 'bar':
    case 'line':
    case 'area': return <ChartWidget type={widget.type} config={widget.config} />;
    case 'pie': return <PieWidget config={widget.config} />;
    case 'table': return <TableWidget config={widget.config} />;
    default: return <div style={{ padding: 20, color: 'var(--text-muted)' }}>Unknown widget</div>;
  }
};

export default WidgetRenderer;