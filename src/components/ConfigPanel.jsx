import { Close } from '@icon-park/react';
import { useChartStore } from '../store/chartStore';
import ColorPicker from './ColorPicker';
import './ConfigPanel.css';

function ConfigPanel() {
  const config = useChartStore((state) => state.config);
  const setConfig = useChartStore((state) => state.setConfig);
  const setColorTheme = useChartStore((state) => state.setColorTheme);
  const chartData = useChartStore((state) => state.chartData);
  const chartType = useChartStore((state) => state.chartType);
  const updateDataPoint = useChartStore((state) => state.updateDataPoint);
  const addDataPoint = useChartStore((state) => state.addDataPoint);
  const removeDataPoint = useChartStore((state) => state.removeDataPoint);

  const colorThemes = [
    { id: 'blue', gradient: 'linear-gradient(135deg, #2563EB, #3B82F6)' },
    { id: 'green', gradient: 'linear-gradient(135deg, #059669, #10B981)' },
    { id: 'purple', gradient: 'linear-gradient(135deg, #7C3AED, #8B5CF6)' },
    { id: 'red', gradient: 'linear-gradient(135deg, #DC2626, #EF4444)' },
    { id: 'amber', gradient: 'linear-gradient(135deg, #D97706, #F59E0B)' }
  ];

  return (
    <div className="editor-panel">
      {/* 共用：标题 */}
      <div className="panel-section">
        <h4>标题</h4>
        <div className="config-row">
          <label className="config-label">标题文字</label>
          <input 
            type="text" 
            value={config.title}
            onChange={(e) => setConfig({ title: e.target.value })}
            className="config-input"
          />
        </div>
        <div className="config-row">
          <ColorPicker 
            label="标题颜色"
            color={config.titleColor} 
            onChange={(color) => setConfig({ titleColor: color })} 
          />
        </div>
      </div>

      {/* 共用：数据列表 */}
      <div className="panel-section">
        <h4>数据列表</h4>
        <div className="data-list">
          {chartData.categories.map((name, index) => (
            <div className="data-list-row" key={index}>
              <input 
                type="text"
                value={name}
                onChange={(e) => updateDataPoint(index, 'name', e.target.value)}
                placeholder="名称"
              />
              <input 
                type="number"
                value={chartData.values[index]}
                onChange={(e) => updateDataPoint(index, 'value', e.target.value)}
                placeholder="数值"
              />
              <button 
                className="data-delete-btn"
                onClick={() => removeDataPoint(index)}
                disabled={chartData.categories.length <= 1}
                title="删除"
              >
                <Close size={12} />
              </button>
            </div>
          ))}
          <button className="data-add-btn" onClick={addDataPoint}>
            + 新增数据
          </button>
        </div>
      </div>

      {/* 共用：颜色主题 */}
      <div className="panel-section">
        <h4>颜色主题</h4>
        <div className="color-picker-row">
          {colorThemes.map((theme) => (
            <button
              key={theme.id}
              className={`color-swatch ${config.colorTheme === theme.id ? 'active' : ''}`}
              style={{ background: theme.gradient }}
              onClick={() => setColorTheme(theme.id)}
            />
          ))}
        </div>
      </div>

      {/* 柱状图：样式设置 */}
      {chartType === 'bar' && (
        <div className="panel-section">
          <h4>柱状图样式</h4>
          <div className="config-row">
            <label className="config-label">柱状圆角</label>
            <div className="slider-row">
              <input 
                type="range" 
                min="0" 
                max="16" 
                value={config.barRadius}
                onChange={(e) => setConfig({ barRadius: parseInt(e.target.value) })}
              />
              <span className="slider-value">{config.barRadius}</span>
            </div>
          </div>
          <div className="config-row toggle-row">
            <input 
              type="checkbox" 
              id="show-grid-bar"
              checked={config.showGrid}
              onChange={(e) => setConfig({ showGrid: e.target.checked })}
            />
            <label htmlFor="show-grid-bar">显示网格</label>
          </div>
        </div>
      )}

      {/* 折线图：样式设置 */}
      {chartType === 'line' && (
        <div className="panel-section">
          <h4>折线图样式</h4>
          <div className="config-row">
            <label className="config-label">线条粗细</label>
            <div className="slider-row">
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={config.lineWidth}
                onChange={(e) => setConfig({ lineWidth: parseInt(e.target.value) })}
              />
              <span className="slider-value">{config.lineWidth}</span>
            </div>
          </div>
          <div className="config-row toggle-row">
            <input 
              type="checkbox" 
              id="show-grid-line"
              checked={config.showGrid}
              onChange={(e) => setConfig({ showGrid: e.target.checked })}
            />
            <label htmlFor="show-grid-line">显示网格</label>
          </div>
          <div className="config-row toggle-row">
            <input 
              type="checkbox" 
              id="smooth-line"
              checked={config.smoothLine ?? true}
              onChange={(e) => setConfig({ smoothLine: e.target.checked })}
            />
            <label htmlFor="smooth-line">平滑曲线</label>
          </div>
        </div>
      )}

      {/* 饼图：样式设置 */}
      {chartType === 'pie' && (
        <div className="panel-section">
          <h4>饼图样式</h4>
          <div className="config-row">
            <label className="config-label">内径半径</label>
            <div className="slider-row">
              <input 
                type="range" 
                min="0" 
                max="70" 
                value={config.pieInnerRadius ?? 0}
                onChange={(e) => setConfig({ pieInnerRadius: parseInt(e.target.value) })}
              />
              <span className="slider-value">{config.pieInnerRadius ?? 0}%</span>
            </div>
          </div>
        </div>
      )}

      {/* 共用：动画设置 */}
      <div className="panel-section">
        <h4>动画</h4>
        <div className="config-row">
          <label className="config-label">动画时长</label>
          <div className="slider-row">
            <input 
              type="range" 
              min="0" 
              max="2000" 
              value={config.animationDuration}
              onChange={(e) => setConfig({ animationDuration: parseInt(e.target.value) })}
            />
            <span className="slider-value">{config.animationDuration}ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfigPanel;