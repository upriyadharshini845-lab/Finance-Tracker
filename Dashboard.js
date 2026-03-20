import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useDashboard } from '../../context/DashboardContext';
import { useTransactions } from '../../context/TransactionContext';
import WidgetRenderer from '../widgets/WidgetRenderer';
import WidgetConfigPanel from './WidgetConfigPanel';

const ResponsiveGrid = WidthProvider(Responsive);
const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const COLS = { lg: 12, md: 8, sm: 4, xs: 4, xxs: 4 };

const Dashboard = () => {
  const {
    widgets, isConfiguring, setIsConfiguring,
    addWidget, removeWidget, updateLayout,
    saveConfig, openSettings, isPanelOpen,
    selectedWidget, closePanel, updateWidgetConfig,
  } = useDashboard();

  const { dateRange, setDateRange } = useTransactions();

  const WIDGET_TYPES = [
    { type: 'kpi', label: 'KPI Card', icon: '📊' },
    { type: 'bar', label: 'Bar Chart', icon: '📈' },
    { type: 'line', label: 'Line Chart', icon: '📉' },
    { type: 'area', label: 'Area Chart', icon: '🗠' },
    { type: 'pie', label: 'Pie Chart', icon: '🥧' },
    { type: 'table', label: 'Table', icon: '📋' },
  ];

  const layouts = {
    lg: widgets.map((w) => ({ ...w.layout, i: w.id })),
    md: widgets.map((w) => ({ ...w.layout, i: w.id, w: Math.min(w.layout.w, 8) })),
    sm: widgets.map((w) => ({ ...w.layout, i: w.id, w: Math.min(w.layout.w, 4) })),
    xs: widgets.map((w) => ({ ...w.layout, i: w.id, w: 4 })),
    xxs: widgets.map((w) => ({ ...w.layout, i: w.id, w: 4 })),
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Your personalized finance overview</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {isConfiguring ? (
            <>
              <button className="btn btn-secondary" onClick={() => setIsConfiguring(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { saveConfig(widgets); setIsConfiguring(false); }}>
                💾 Save Configuration
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => setIsConfiguring(true)}>
              ⚙️ Configure Dashboard
            </button>
          )}
        </div>
      </div>

      <div className="date-filter-bar">
        <span className="date-filter-label">Show data for</span>
        <select className="form-control" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
          <option value="all">All time</option>
          <option value="today">Today</option>
          <option value="last7">Last 7 Days</option>
          <option value="last30">Last 30 Days</option>
          <option value="last90">Last 90 Days</option>
        </select>
        <div className="auto-refresh-badge">
          <div className="pulse-dot" />
          Auto-refresh: 30s
        </div>
      </div>

      {isConfiguring && (
        <div className="config-toolbar">
          <span className="config-toolbar-label">Add Widget:</span>
          {WIDGET_TYPES.map((w) => (
            <button key={w.type} className="widget-chip" onClick={() => addWidget(w.type)}>
              <span>{w.icon}</span>
              <span>{w.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="dashboard-content">
        {widgets.length === 0 ? (
          <div className="empty-dashboard">
            <div className="empty-icon">📊</div>
            <h2 className="empty-title">No widgets configured</h2>
            <p className="empty-desc">Click Configure Dashboard to add widgets and build your personalized finance view.</p>
            <button className="btn btn-primary" onClick={() => setIsConfiguring(true)}>⚙️ Configure Dashboard</button>
          </div>
        ) : (
          <ResponsiveGrid
            className="layout"
            layouts={layouts}
            breakpoints={BREAKPOINTS}
            cols={COLS}
            rowHeight={80}
            isDraggable={isConfiguring}
            isResizable={isConfiguring}
            onLayoutChange={(layout) => updateLayout(layout)}
            margin={[12, 12]}
          >
            {widgets.map((widget) => (
              <div key={widget.id}>
                <div className="widget-wrapper">
                  <div className="widget-actions">
                    <button className="widget-action-btn settings-btn" onClick={() => openSettings(widget)}>⚙️</button>
                    <button className="widget-action-btn delete-btn" onClick={() => removeWidget(widget.id)}>🗑️</button>
                  </div>
                  <WidgetRenderer widget={widget} />
                </div>
              </div>
            ))}
          </ResponsiveGrid>
        )}
      </div>

      {isPanelOpen && selectedWidget && (
        <WidgetConfigPanel
          widget={selectedWidget}
          onClose={closePanel}
          onSave={(config) => { updateWidgetConfig(selectedWidget.id, config); closePanel(); }}
        />
      )}
    </div>
  );
};

export default Dashboard;