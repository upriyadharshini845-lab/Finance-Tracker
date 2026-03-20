import React, { createContext, useContext, useState, useEffect } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within DashboardProvider');
  return context;
};

const STORAGE_KEY = 'finance_dashboard_config';

export const DashboardProvider = ({ children }) => {
  const [widgets, setWidgets] = useState([]);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setWidgets(JSON.parse(saved)); }
      catch (e) { console.error('Failed to load dashboard config'); }
    }
  }, []);

  const saveConfig = (newWidgets) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newWidgets));
    setWidgets(newWidgets);
  };

  const addWidget = (type) => {
    const defaults = getWidgetDefaults(type);
    const id = `widget_${Date.now()}`;
    const newWidget = {
      id, type,
      config: defaults.config,
      layout: { i: id, x: 0, y: Infinity, w: defaults.w, h: defaults.h, minW: 1, minH: 1 },
    };
    setWidgets((prev) => [...prev, newWidget]);
    return newWidget;
  };

  const removeWidget = (id) => setWidgets((prev) => prev.filter((w) => w.id !== id));

  const updateWidgetConfig = (id, config) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, config: { ...w.config, ...config } } : w))
    );
  };

  const updateLayout = (layout) => {
    setWidgets((prev) =>
      prev.map((w) => {
        const l = layout.find((item) => item.i === w.id);
        return l ? { ...w, layout: l } : w;
      })
    );
  };

  const openSettings = (widget) => {
    setSelectedWidget(widget);
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setSelectedWidget(null);
  };

  return (
    <DashboardContext.Provider value={{
      widgets, isConfiguring, setIsConfiguring,
      selectedWidget, isPanelOpen,
      addWidget, removeWidget, updateWidgetConfig,
      updateLayout, saveConfig, openSettings, closePanel,
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

const getWidgetDefaults = (type) => {
  const map = {
    kpi: { w: 3, h: 2, config: { title: 'KPI Card', description: '', metric: 'totalAmount', aggregation: 'Sum', dataFormat: 'Currency', decimalPrecision: 2 }},
    bar: { w: 6, h: 4, config: { title: 'Bar Chart', description: '', xAxis: 'category', yAxis: 'amount', chartColor: '#6366f1', showDataLabel: false }},
    line: { w: 6, h: 4, config: { title: 'Line Chart', description: '', xAxis: 'date', yAxis: 'amount', chartColor: '#10b981', showDataLabel: false }},
    area: { w: 6, h: 4, config: { title: 'Area Chart', description: '', xAxis: 'date', yAxis: 'amount', chartColor: '#f59e0b', showDataLabel: false }},
    pie: { w: 5, h: 4, config: { title: 'Pie Chart', description: '', chartData: 'category', showLegend: true }},
    table: { w: 8, h: 5, config: { title: 'Transactions Table', description: '', columns: ['title','amount','type','category','date'], sortBy: 'date', pagination: 10, fontSize: 14, headerBg: '#6366f1', filters: [] }},
  };
  return map[type] || map.kpi;
};