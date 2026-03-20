import React, { useState } from 'react';

const AXIS_OPTIONS = ['category', 'type', 'title', 'amount', 'date'];
const METRIC_OPTIONS = [
  { value: 'totalAmount', label: 'Total Amount' },
  { value: 'amount', label: 'Amount' },
];
const COLUMN_OPTIONS = [
  { value: 'title', label: 'Title' },
  { value: 'amount', label: 'Amount' },
  { value: 'type', label: 'Type' },
  { value: 'category', label: 'Category' },
  { value: 'date', label: 'Date' },
  { value: 'note', label: 'Note' },
];

const WidgetConfigPanel = ({ widget, onClose, onSave }) => {
  const [config, setConfig] = useState({ ...widget.config });
  const set = (key, val) => setConfig((prev) => ({ ...prev, [key]: val }));

  const toggleColumn = (col) => {
    const cols = config.columns || [];
    set('columns', cols.includes(col) ? cols.filter((c) => c !== col) : [...cols, col]);
  };

  const renderKPIFields = () => (
    <>
      <p className="panel-section-title">Data Settings</p>
      <div className="form-group">
        <label className="form-label">Select Metric</label>
        <select className="form-control" value={config.metric} onChange={(e) => set('metric', e.target.value)}>
          {METRIC_OPTIONS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Aggregation</label>
        <select className="form-control" value={config.aggregation} onChange={(e) => set('aggregation', e.target.value)}>
          <option>Sum</option><option>Average</option><option>Count</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Data Format</label>
        <select className="form-control" value={config.dataFormat} onChange={(e) => set('dataFormat', e.target.value)}>
          <option>Number</option><option>Currency</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Decimal Precision</label>
        <input type="number" className="form-control" min="0" max="4" value={config.decimalPrecision}
          onChange={(e) => set('decimalPrecision', Math.max(0, parseInt(e.target.value) || 0))} />
      </div>
    </>
  );

  const renderChartFields = () => (
    <>
      <p className="panel-section-title">Data Settings</p>
      <div className="form-group">
        <label className="form-label">X-Axis</label>
        <select className="form-control" value={config.xAxis} onChange={(e) => set('xAxis', e.target.value)}>
          {AXIS_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Y-Axis</label>
        <select className="form-control" value={config.yAxis} onChange={(e) => set('yAxis', e.target.value)}>
          {AXIS_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
      <p className="panel-section-title" style={{ marginTop: 8 }}>Styling</p>
      <div className="form-group">
        <label className="form-label">Chart Color</label>
        <div className="color-input-group">
          <input type="color" className="color-swatch" value={config.chartColor} onChange={(e) => set('chartColor', e.target.value)} />
          <input type="text" className="form-control" value={config.chartColor} onChange={(e) => set('chartColor', e.target.value)} maxLength={7} />
        </div>
      </div>
      <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" id="showLabel" checked={config.showDataLabel} onChange={(e) => set('showDataLabel', e.target.checked)} style={{ accentColor: 'var(--accent)', width: 14, height: 14 }} />
        <label htmlFor="showLabel" className="form-label" style={{ margin: 0 }}>Show data labels</label>
      </div>
    </>
  );

  const renderPieFields = () => (
    <>
      <p className="panel-section-title">Data Settings</p>
      <div className="form-group">
        <label className="form-label">Chart Data</label>
        <select className="form-control" value={config.chartData} onChange={(e) => set('chartData', e.target.value)}>
          <option value="category">Category</option>
          <option value="type">Type</option>
        </select>
      </div>
      <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" id="showLegend" checked={config.showLegend} onChange={(e) => set('showLegend', e.target.checked)} style={{ accentColor: 'var(--accent)', width: 14, height: 14 }} />
        <label htmlFor="showLegend" className="form-label" style={{ margin: 0 }}>Show legend</label>
      </div>
    </>
  );

  const renderTableFields = () => (
    <>
      <p className="panel-section-title">Data Settings</p>
      <div className="form-group">
        <label className="form-label">Choose Columns</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
          {COLUMN_OPTIONS.map((col) => (
            <label key={col.value} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
              <input type="checkbox" checked={(config.columns || []).includes(col.value)} onChange={() => toggleColumn(col.value)} style={{ accentColor: 'var(--accent)', width: 13, height: 13 }} />
              {col.label}
            </label>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Sort By</label>
        <select className="form-control" value={config.sortBy} onChange={(e) => set('sortBy', e.target.value)}>
          <option value="date">Order Date</option>
          <option value="asc">Amount Ascending</option>
          <option value="desc">Amount Descending</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Rows Per Page</label>
        <select className="form-control" value={config.pagination} onChange={(e) => set('pagination', parseInt(e.target.value))}>
          <option value="5">5</option><option value="10">10</option><option value="15">15</option>
        </select>
      </div>
      <p className="panel-section-title" style={{ marginTop: 8 }}>Styling</p>
      <div className="form-group">
        <label className="form-label">Font Size (12–18)</label>
        <input type="number" className="form-control" min="12" max="18" value={config.fontSize}
          onChange={(e) => set('fontSize', Math.min(18, Math.max(12, parseInt(e.target.value) || 14)))} />
      </div>
      <div className="form-group">
        <label className="form-label">Header Background</label>
        <div className="color-input-group">
          <input type="color" className="color-swatch" value={config.headerBg} onChange={(e) => set('headerBg', e.target.value)} />
          <input type="text" className="form-control" value={config.headerBg} onChange={(e) => set('headerBg', e.target.value)} maxLength={7} />
        </div>
      </div>
    </>
  );

  const renderTypeFields = () => {
    if (widget.type === 'kpi') return renderKPIFields();
    if (widget.type === 'pie') return renderPieFields();
    if (widget.type === 'table') return renderTableFields();
    return renderChartFields();
  };

  return (
    <>
      <div className="config-panel-overlay" onClick={onClose} />
      <div className="config-panel">
        <div className="panel-header">
          <span className="panel-title">Widget Settings</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="panel-body">
          <div className="form-group">
            <label className="form-label">Widget Title</label>
            <input type="text" className="form-control" value={config.title} onChange={(e) => set('title', e.target.value)} placeholder="Untitled" />
          </div>
          <div className="form-group">
            <label className="form-label">Widget Type</label>
            <input type="text" className="form-control" value={widget.type.toUpperCase()} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={2} value={config.description || ''} onChange={(e) => set('description', e.target.value)} placeholder="Optional description..." />
          </div>
          {renderTypeFields()}
        </div>
        <div className="panel-footer">
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onSave(config)}>Apply</button>
        </div>
      </div>
    </>
  );
};

export default WidgetConfigPanel;