import { Close } from '@icon-park/react';
import { useChartStore } from '../store/chartStore';
import ColorPicker from './ColorPicker';
import './ConfigPanel.css';

const MULTI_SERIES_TYPES = ['stackedBar', 'percentBar', 'combo'];
const SPECIAL_DATA_TYPES = ['scatter', 'bubble', 'boxplot', 'heatmap', 'sunburst'];

// ── 多系列编辑器 ──
function MultiSeriesEditor({ comboMode }) {
  const chartData = useChartStore((s) => s.chartData);
  const updateSeriesName  = useChartStore((s) => s.updateSeriesName);
  const updateSeriesValue = useChartStore((s) => s.updateSeriesValue);
  const addSeries         = useChartStore((s) => s.addSeries);
  const removeSeries      = useChartStore((s) => s.removeSeries);
  const series = chartData.series || [];

  return (
    <div className="multi-series-editor">
      {series.map((s, si) => (
        <div className="series-block" key={si}>
          <div className="series-block-header">
            <input
              className="series-name-input"
              value={s.name}
              onChange={(e) => updateSeriesName(si, e.target.value)}
              placeholder={`系列 ${si + 1}`}
            />
            {!comboMode && series.length > 2 && (
              <button className="data-delete-btn" onClick={() => removeSeries(si)} title="删除系列">
                <Close size={12} />
              </button>
            )}
          </div>
          <div className="series-values">
            {chartData.categories.map((cat, vi) => (
              <div className="series-value-row" key={vi}>
                <span className="series-cat-label">{cat}</span>
                <input
                  type="number"
                  value={s.values[vi] ?? 0}
                  onChange={(e) => updateSeriesValue(si, vi, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      {!comboMode && (
        <button className="data-add-btn" onClick={addSeries}>+ 添加系列</button>
      )}
    </div>
  );
}

// ── 类别编辑器（多系列模式）──
function CategoriesEditor() {
  const chartData       = useChartStore((s) => s.chartData);
  const updateDataPoint = useChartStore((s) => s.updateDataPoint);
  const addDataPoint    = useChartStore((s) => s.addDataPoint);
  const removeDataPoint = useChartStore((s) => s.removeDataPoint);

  return (
    <div className="data-list">
      {chartData.categories.map((name, index) => (
        <div className="data-list-row data-list-row-single" key={index}>
          <input
            type="text"
            value={name}
            onChange={(e) => updateDataPoint(index, 'name', e.target.value)}
            placeholder="类别名称"
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
      <button className="data-add-btn" onClick={addDataPoint}>+ 新增类别</button>
    </div>
  );
}

// ── 散点图数据编辑器 ──
function ScatterDataEditor() {
  const chartData        = useChartStore((s) => s.chartData);
  const updateScatterPoint = useChartStore((s) => s.updateScatterPoint);
  const addScatterPoint    = useChartStore((s) => s.addScatterPoint);
  const removeScatterPoint = useChartStore((s) => s.removeScatterPoint);
  const pts = chartData.scatterPoints || [];

  return (
    <div className="data-list">
      <div className="data-list-header">
        <span>名称</span><span>X</span><span>Y</span><span />
      </div>
      {pts.map((p, i) => (
        <div className="data-list-row data-list-row-4" key={i}>
          <input type="text" value={p.name}
            onChange={(e) => updateScatterPoint(i, 'name', e.target.value)} />
          <input type="number" value={p.x}
            onChange={(e) => updateScatterPoint(i, 'x', e.target.value)} />
          <input type="number" value={p.y}
            onChange={(e) => updateScatterPoint(i, 'y', e.target.value)} />
          <button className="data-delete-btn" onClick={() => removeScatterPoint(i)}
            disabled={pts.length <= 1} title="删除">
            <Close size={12} />
          </button>
        </div>
      ))}
      <button className="data-add-btn" onClick={addScatterPoint}>+ 新增数据点</button>
    </div>
  );
}

// ── 气泡图数据编辑器 ──
function BubbleDataEditor() {
  const chartData        = useChartStore((s) => s.chartData);
  const updateBubblePoint = useChartStore((s) => s.updateBubblePoint);
  const addBubblePoint    = useChartStore((s) => s.addBubblePoint);
  const removeBubblePoint = useChartStore((s) => s.removeBubblePoint);
  const pts = chartData.bubblePoints || [];

  return (
    <div className="data-list">
      <div className="data-list-header">
        <span>名称</span><span>X</span><span>Y</span><span>大小</span><span />
      </div>
      {pts.map((p, i) => (
        <div className="data-list-row data-list-row-5" key={i}>
          <input type="text" value={p.name}
            onChange={(e) => updateBubblePoint(i, 'name', e.target.value)} />
          <input type="number" value={p.x}
            onChange={(e) => updateBubblePoint(i, 'x', e.target.value)} />
          <input type="number" value={p.y}
            onChange={(e) => updateBubblePoint(i, 'y', e.target.value)} />
          <input type="number" value={p.size}
            onChange={(e) => updateBubblePoint(i, 'size', e.target.value)} />
          <button className="data-delete-btn" onClick={() => removeBubblePoint(i)}
            disabled={pts.length <= 1} title="删除">
            <Close size={12} />
          </button>
        </div>
      ))}
      <button className="data-add-btn" onClick={addBubblePoint}>+ 新增数据点</button>
    </div>
  );
}

// ── 箱线图数据编辑器 ──
function BoxplotDataEditor() {
  const chartData           = useChartStore((s) => s.chartData);
  const updateBoxValue      = useChartStore((s) => s.updateBoxValue);
  const updateBoxCategoryName = useChartStore((s) => s.updateBoxCategoryName);
  const addBoxCategory      = useChartStore((s) => s.addBoxCategory);
  const removeBoxCategory   = useChartStore((s) => s.removeBoxCategory);
  const cats = chartData.categories || [];
  const bv   = chartData.boxValues || [];
  const fields = ['最小', 'Q1', '中位', 'Q3', '最大'];

  return (
    <div className="data-list">
      {cats.map((cat, ci) => (
        <div className="boxplot-row" key={ci}>
          <div className="boxplot-row-header">
            <input type="text" value={cat}
              className="boxplot-cat-input"
              onChange={(e) => updateBoxCategoryName(ci, e.target.value)}
              placeholder="组名" />
            <button className="data-delete-btn" onClick={() => removeBoxCategory(ci)}
              disabled={cats.length <= 1} title="删除">
              <Close size={12} />
            </button>
          </div>
          <div className="boxplot-values">
            {fields.map((label, fi) => (
              <div className="boxplot-value-row" key={fi}>
                <span className="series-cat-label">{label}</span>
                <input type="number" value={bv[ci]?.[fi] ?? 0}
                  onChange={(e) => updateBoxValue(ci, fi, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button className="data-add-btn" onClick={addBoxCategory}>+ 新增组</button>
    </div>
  );
}

// ── 热力图数据编辑器 ──
function HeatmapDataEditor() {
  const chartData          = useChartStore((s) => s.chartData);
  const updateHeatmapValue = useChartStore((s) => s.updateHeatmapValue);
  const updateHeatmapRowLabel = useChartStore((s) => s.updateHeatmapRowLabel);
  const updateHeatmapColLabel = useChartStore((s) => s.updateHeatmapColLabel);
  const addHeatmapRow      = useChartStore((s) => s.addHeatmapRow);
  const removeHeatmapRow   = useChartStore((s) => s.removeHeatmapRow);
  const addHeatmapCol      = useChartStore((s) => s.addHeatmapCol);
  const removeHeatmapCol   = useChartStore((s) => s.removeHeatmapCol);
  const rows = chartData.heatmapRows || [];
  const cols = chartData.heatmapCols || [];
  const vals = chartData.heatmapValues || [];

  return (
    <div className="heatmap-editor">
      {/* 列标签行 */}
      <div className="heatmap-col-header">
        <span className="heatmap-corner" />
        {cols.map((col, ci) => (
          <div key={ci} className="heatmap-col-label-wrap">
            <input
              className="heatmap-label-input"
              value={col}
              onChange={(e) => updateHeatmapColLabel(ci, e.target.value)}
            />
            <button className="data-delete-btn heatmap-col-del"
              onClick={() => removeHeatmapCol(ci)} disabled={cols.length <= 1} title="删除列">
              <Close size={10} />
            </button>
          </div>
        ))}
      </div>
      {/* 数据行 */}
      {rows.map((row, ri) => (
        <div key={ri} className="heatmap-row">
          <div className="heatmap-row-label-wrap">
            <input
              className="heatmap-label-input heatmap-row-label"
              value={row}
              onChange={(e) => updateHeatmapRowLabel(ri, e.target.value)}
            />
            <button className="data-delete-btn"
              onClick={() => removeHeatmapRow(ri)} disabled={rows.length <= 1} title="删除行">
              <Close size={10} />
            </button>
          </div>
          {cols.map((_, ci) => (
            <input
              key={ci}
              type="number"
              className="heatmap-cell"
              value={vals[ri]?.[ci] ?? 0}
              onChange={(e) => updateHeatmapValue(ri, ci, e.target.value)}
            />
          ))}
        </div>
      ))}
      <div className="heatmap-actions">
        <button className="data-add-btn" style={{ flex: 1 }} onClick={addHeatmapRow}>+ 添加行</button>
        <button className="data-add-btn" style={{ flex: 1 }} onClick={addHeatmapCol}>+ 添加列</button>
      </div>
    </div>
  );
}

// ── 旭日图数据编辑器 ──
function SunburstDataEditor() {
  const chartData          = useChartStore((s) => s.chartData);
  const updateSunburstRoot  = useChartStore((s) => s.updateSunburstRoot);
  const updateSunburstChild = useChartStore((s) => s.updateSunburstChild);
  const addSunburstRoot    = useChartStore((s) => s.addSunburstRoot);
  const removeSunburstRoot = useChartStore((s) => s.removeSunburstRoot);
  const addSunburstChild   = useChartStore((s) => s.addSunburstChild);
  const removeSunburstChild = useChartStore((s) => s.removeSunburstChild);
  const data = chartData.sunburstData || [];

  return (
    <div className="multi-series-editor">
      {data.map((root, ri) => (
        <div className="series-block" key={ri}>
          <div className="series-block-header">
            <input className="series-name-input" value={root.name}
              onChange={(e) => updateSunburstRoot(ri, 'name', e.target.value)} />
            <input type="number" className="series-name-value"
              value={root.value}
              onChange={(e) => updateSunburstRoot(ri, 'value', e.target.value)} />
            {data.length > 1 && (
              <button className="data-delete-btn" onClick={() => removeSunburstRoot(ri)} title="删除">
                <Close size={12} />
              </button>
            )}
          </div>
          <div className="series-values">
            {(root.children || []).map((child, ci) => (
              <div className="series-value-row" key={ci}>
                <input type="text"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '4px 6px', borderRadius: 4, fontSize: 12, fontFamily: 'inherit', flex: 1 }}
                  value={child.name}
                  onChange={(e) => updateSunburstChild(ri, ci, 'name', e.target.value)} />
                <input type="number" value={child.value}
                  onChange={(e) => updateSunburstChild(ri, ci, 'value', e.target.value)} />
                <button className="data-delete-btn"
                  onClick={() => removeSunburstChild(ri, ci)}
                  disabled={(root.children || []).length <= 1} title="删除">
                  <Close size={12} />
                </button>
              </div>
            ))}
            <button className="data-add-btn" style={{ margin: '4px 8px' }}
              onClick={() => addSunburstChild(ri)}>
              + 添加子项
            </button>
          </div>
        </div>
      ))}
      <button className="data-add-btn" onClick={addSunburstRoot}>+ 添加类别</button>
    </div>
  );
}

function ConfigPanel() {
  const config        = useChartStore((s) => s.config);
  const setConfig     = useChartStore((s) => s.setConfig);
  const setColorTheme = useChartStore((s) => s.setColorTheme);
  const chartData     = useChartStore((s) => s.chartData);
  const chartType     = useChartStore((s) => s.chartType);
  const updateDataPoint = useChartStore((s) => s.updateDataPoint);
  const addDataPoint    = useChartStore((s) => s.addDataPoint);
  const removeDataPoint = useChartStore((s) => s.removeDataPoint);

  const isMultiSeries = MULTI_SERIES_TYPES.includes(chartType);
  const isSpecialData = SPECIAL_DATA_TYPES.includes(chartType);

  const colorThemes = [
    { id: 'blue',   gradient: 'linear-gradient(135deg, #2563EB, #3B82F6)' },
    { id: 'green',  gradient: 'linear-gradient(135deg, #059669, #10B981)' },
    { id: 'purple', gradient: 'linear-gradient(135deg, #7C3AED, #8B5CF6)' },
    { id: 'red',    gradient: 'linear-gradient(135deg, #DC2626, #EF4444)' },
    { id: 'amber',  gradient: 'linear-gradient(135deg, #D97706, #F59E0B)' },
  ];

  return (
    <div className="editor-panel">

      {/* ── 标题 ── */}
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

      {/* ── 数据（热力图）── */}
      {chartType === 'heatmap' && (
        <div className="panel-section">
          <h4>热力矩阵</h4>
          <HeatmapDataEditor />
        </div>
      )}

      {/* ── 数据（旭日图）── */}
      {chartType === 'sunburst' && (
        <div className="panel-section">
          <h4>层级数据</h4>
          <SunburstDataEditor />
        </div>
      )}

      {/* ── 数据（散点图）── */}
      {chartType === 'scatter' && (
        <div className="panel-section">
          <h4>数据点</h4>
          <ScatterDataEditor />
        </div>
      )}

      {/* ── 数据（气泡图）── */}
      {chartType === 'bubble' && (
        <div className="panel-section">
          <h4>数据点</h4>
          <BubbleDataEditor />
        </div>
      )}

      {/* ── 数据（箱线图）── */}
      {chartType === 'boxplot' && (
        <div className="panel-section">
          <h4>箱线数据</h4>
          <BoxplotDataEditor />
        </div>
      )}

      {/* ── 数据（单系列）── */}
      {!isMultiSeries && !isSpecialData && (
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
            <button className="data-add-btn" onClick={addDataPoint}>+ 新增数据</button>
          </div>
        </div>
      )}

      {/* ── 数据（多系列：类别 + 系列编辑器）── */}
      {isMultiSeries && (
        <>
          <div className="panel-section">
            <h4>类别</h4>
            <CategoriesEditor />
          </div>
          <div className="panel-section">
            <h4>系列数据</h4>
            <MultiSeriesEditor comboMode={chartType === 'combo'} />
          </div>
        </>
      )}

      {/* ── 颜色主题 ── */}
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

      {/* ── 柱状图 ── */}
      {chartType === 'bar' && (
        <div className="panel-section">
          <h4>柱状图样式</h4>
          <div className="config-row">
            <label className="config-label">柱状圆角</label>
            <div className="slider-row">
              <input type="range" min="0" max="16" value={config.barRadius}
                onChange={(e) => setConfig({ barRadius: parseInt(e.target.value) })} />
              <span className="slider-value">{config.barRadius}</span>
            </div>
          </div>
          <div className="config-row toggle-row">
            <input type="checkbox" id="show-grid-bar" checked={config.showGrid}
              onChange={(e) => setConfig({ showGrid: e.target.checked })} />
            <label htmlFor="show-grid-bar">显示网格</label>
          </div>
        </div>
      )}

      {/* ── 条形图 ── */}
      {chartType === 'horizontalBar' && (
        <div className="panel-section">
          <h4>条形图样式</h4>
          <div className="config-row">
            <label className="config-label">条形圆角</label>
            <div className="slider-row">
              <input type="range" min="0" max="16" value={config.barRadius ?? 4}
                onChange={(e) => setConfig({ barRadius: parseInt(e.target.value) })} />
              <span className="slider-value">{config.barRadius ?? 4}</span>
            </div>
          </div>
          <div className="config-row">
            <label className="config-label">排序方式</label>
            <div className="sort-options">
              {[['none', '默认'], ['desc', '降序 ↓'], ['asc', '升序 ↑']].map(([val, label]) => (
                <button key={val}
                  className={`sort-btn ${(config.barSort ?? 'none') === val ? 'active' : ''}`}
                  onClick={() => setConfig({ barSort: val })}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="config-row toggle-row">
            <input type="checkbox" id="bar-label" checked={config.barLabel ?? false}
              onChange={(e) => setConfig({ barLabel: e.target.checked })} />
            <label htmlFor="bar-label">显示数值标签</label>
          </div>
          <div className="config-row toggle-row">
            <input type="checkbox" id="show-grid-hbar" checked={config.showGrid ?? true}
              onChange={(e) => setConfig({ showGrid: e.target.checked })} />
            <label htmlFor="show-grid-hbar">显示网格</label>
          </div>
        </div>
      )}

      {/* ── 堆叠柱状图 ── */}
      {chartType === 'stackedBar' && (
        <div className="panel-section">
          <h4>堆叠柱状图样式</h4>
          <div className="config-row">
            <label className="config-label">顶部圆角</label>
            <div className="slider-row">
              <input type="range" min="0" max="16" value={config.barRadius ?? 4}
                onChange={(e) => setConfig({ barRadius: parseInt(e.target.value) })} />
              <span className="slider-value">{config.barRadius ?? 4}</span>
            </div>
          </div>
          <div className="config-row toggle-row">
            <input type="checkbox" id="stack-label" checked={config.stackLabel ?? false}
              onChange={(e) => setConfig({ stackLabel: e.target.checked })} />
            <label htmlFor="stack-label">显示分段数值</label>
          </div>
          <div className="config-row toggle-row">
            <input type="checkbox" id="show-grid-stack" checked={config.showGrid ?? true}
              onChange={(e) => setConfig({ showGrid: e.target.checked })} />
            <label htmlFor="show-grid-stack">显示网格</label>
          </div>
          <div className="config-row toggle-row">
            <input type="checkbox" id="show-legend-stack" checked={config.showLegend ?? true}
              onChange={(e) => setConfig({ showLegend: e.target.checked })} />
            <label htmlFor="show-legend-stack">显示图例</label>
          </div>
        </div>
      )}

      {/* ── 折线图 ── */}
      {chartType === 'line' && (
        <div className="panel-section">
          <h4>折线图样式</h4>
          <div className="config-row">
            <label className="config-label">线条粗细</label>
            <div className="slider-row">
              <input type="range" min="1" max="5" value={config.lineWidth}
                onChange={(e) => setConfig({ lineWidth: parseInt(e.target.value) })} />
              <span className="slider-value">{config.lineWidth}</span>
            </div>
          </div>
          <div className="config-row toggle-row">
            <input type="checkbox" id="show-grid-line" checked={config.showGrid}
              onChange={(e) => setConfig({ showGrid: e.target.checked })} />
            <label htmlFor="show-grid-line">显示网格</label>
          </div>
          <div className="config-row toggle-row">
            <input type="checkbox" id="smooth-line" checked={config.smoothLine ?? true}
              onChange={(e) => setConfig({ smoothLine: e.target.checked })} />
            <label htmlFor="smooth-line">平滑曲线</label>
          </div>
        </div>
      )}

      {/* ── 面积图 ── */}
      {chartType === 'area' && (
        <div className="panel-section">
          <h4>面积图样式</h4>
          <div className="config-row">
            <label className="config-label">线条粗细</label>
            <div className="slider-row">
              <input type="range" min="1" max="5" value={config.lineWidth ?? 2}
                onChange={(e) => setConfig({ lineWidth: parseInt(e.target.value) })} />
              <span className="slider-value">{config.lineWidth ?? 2}</span>
            </div>
          </div>
          <div className="config-row">
            <label className="config-label">填充透明度</label>
            <div className="slider-row">
              <input type="range" min="0" max="100" value={config.areaOpacity ?? 50}
                onChange={(e) => setConfig({ areaOpacity: parseInt(e.target.value) })} />
              <span className="slider-value">{config.areaOpacity ?? 50}%</span>
            </div>
          </div>
          <div className="config-row toggle-row">
            <input type="checkbox" id="smooth-area" checked={config.smoothLine ?? true}
              onChange={(e) => setConfig({ smoothLine: e.target.checked })} />
            <label htmlFor="smooth-area">平滑曲线</label>
          </div>
          <div className="config-row toggle-row">
            <input type="checkbox" id="show-grid-area" checked={config.showGrid ?? true}
              onChange={(e) => setConfig({ showGrid: e.target.checked })} />
            <label htmlFor="show-grid-area">显示网格</label>
          </div>
        </div>
      )}

      {/* ── 组合图 ── */}
      {chartType === 'combo' && (
        <div className="panel-section">
          <h4>组合图样式</h4>
          <div className="config-row">
            <label className="config-label">柱状圆角</label>
            <div className="slider-row">
              <input type="range" min="0" max="16" value={config.barRadius ?? 4}
                onChange={(e) => setConfig({ barRadius: parseInt(e.target.value) })} />
              <span className="slider-value">{config.barRadius ?? 4}</span>
            </div>
          </div>
          <div className="config-row">
            <label className="config-label">折线粗细</label>
            <div className="slider-row">
              <input type="range" min="1" max="5" value={config.lineWidth ?? 2}
                onChange={(e) => setConfig({ lineWidth: parseInt(e.target.value) })} />
              <span className="slider-value">{config.lineWidth ?? 2}</span>
            </div>
          </div>
          <div className="config-row toggle-row">
            <input type="checkbox" id="smooth-combo" checked={config.smoothLine ?? true}
              onChange={(e) => setConfig({ smoothLine: e.target.checked })} />
            <label htmlFor="smooth-combo">折线平滑</label>
          </div>
          <div className="config-row toggle-row">
            <input type="checkbox" id="show-grid-combo" checked={config.showGrid ?? true}
              onChange={(e) => setConfig({ showGrid: e.target.checked })} />
            <label htmlFor="show-grid-combo">显示网格</label>
          </div>
          <div className="config-row toggle-row">
            <input type="checkbox" id="show-legend-combo" checked={config.showLegend ?? true}
              onChange={(e) => setConfig({ showLegend: e.target.checked })} />
            <label htmlFor="show-legend-combo">显示图例</label>
          </div>
        </div>
      )}

      {/* ── 饼图 ── */}
      {chartType === 'pie' && (
        <div className="panel-section">
          <h4>饼图样式</h4>
          <div className="config-row">
            <label className="config-label">内径半径</label>
            <div className="slider-row">
              <input type="range" min="0" max="70" value={config.pieInnerRadius ?? 0}
                onChange={(e) => setConfig({ pieInnerRadius: parseInt(e.target.value) })} />
              <span className="slider-value">{config.pieInnerRadius ?? 0}%</span>
            </div>
          </div>
        </div>
      )}

      {/* ── 雷达图 ── */}
      {chartType === 'radar' && (
        <div className="panel-section">
          <h4>雷达图样式</h4>
          <div className="config-row toggle-row">
            <input type="checkbox" id="radar-filled" checked={config.radarFilled ?? true}
              onChange={(e) => setConfig({ radarFilled: e.target.checked })} />
            <label htmlFor="radar-filled">填充区域</label>
          </div>
          <div className="config-row">
            <label className="config-label">线条粗细</label>
            <div className="slider-row">
              <input type="range" min="1" max="5" value={config.lineWidth ?? 2}
                onChange={(e) => setConfig({ lineWidth: parseInt(e.target.value) })} />
              <span className="slider-value">{config.lineWidth ?? 2}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── 环形图 ── */}
      {chartType === 'donut' && (
        <div className="panel-section">
          <h4>环形图样式</h4>
          <div className="config-row">
            <label className="config-label">环宽（内径）</label>
            <div className="slider-row">
              <input type="range" min="10" max="70" value={config.pieInnerRadius ?? 40}
                onChange={(e) => setConfig({ pieInnerRadius: parseInt(e.target.value) })} />
              <span className="slider-value">{config.pieInnerRadius ?? 40}%</span>
            </div>
          </div>
        </div>
      )}

      {/* ── 百分比堆叠图 ── */}
      {chartType === 'percentBar' && (
        <div className="panel-section">
          <h4>百分比堆叠样式</h4>
          <div className="config-row">
            <label className="config-label">顶部圆角</label>
            <div className="slider-row">
              <input type="range" min="0" max="16" value={config.barRadius ?? 4}
                onChange={(e) => setConfig({ barRadius: parseInt(e.target.value) })} />
              <span className="slider-value">{config.barRadius ?? 4}</span>
            </div>
          </div>
          <div className="config-row toggle-row">
            <input type="checkbox" id="pct-label" checked={config.stackLabel ?? false}
              onChange={(e) => setConfig({ stackLabel: e.target.checked })} />
            <label htmlFor="pct-label">显示百分比标签</label>
          </div>
          <div className="config-row toggle-row">
            <input type="checkbox" id="show-grid-pct" checked={config.showGrid ?? true}
              onChange={(e) => setConfig({ showGrid: e.target.checked })} />
            <label htmlFor="show-grid-pct">显示网格</label>
          </div>
          <div className="config-row toggle-row">
            <input type="checkbox" id="show-legend-pct" checked={config.showLegend ?? true}
              onChange={(e) => setConfig({ showLegend: e.target.checked })} />
            <label htmlFor="show-legend-pct">显示图例</label>
          </div>
        </div>
      )}

      {/* ── 树状图 ── */}
      {chartType === 'treemap' && (
        <div className="panel-section">
          <h4>树状图样式</h4>
          <div className="config-row toggle-row">
            <input type="checkbox" id="treemap-label" checked={config.treemapLabel ?? true}
              onChange={(e) => setConfig({ treemapLabel: e.target.checked })} />
            <label htmlFor="treemap-label">显示标签</label>
          </div>
        </div>
      )}

      {/* ── 直方图 ── */}
      {chartType === 'histogram' && (
        <div className="panel-section">
          <h4>直方图样式</h4>
          <div className="config-row">
            <label className="config-label">顶部圆角</label>
            <div className="slider-row">
              <input type="range" min="0" max="12" value={config.barRadius ?? 0}
                onChange={(e) => setConfig({ barRadius: parseInt(e.target.value) })} />
              <span className="slider-value">{config.barRadius ?? 0}</span>
            </div>
          </div>
          <div className="config-row toggle-row">
            <input type="checkbox" id="show-grid-hist" checked={config.showGrid ?? true}
              onChange={(e) => setConfig({ showGrid: e.target.checked })} />
            <label htmlFor="show-grid-hist">显示网格</label>
          </div>
        </div>
      )}

      {/* ── 箱线图 ── */}
      {chartType === 'boxplot' && (
        <div className="panel-section">
          <h4>箱线图样式</h4>
          <div className="config-row toggle-row">
            <input type="checkbox" id="show-grid-box" checked={config.showGrid ?? true}
              onChange={(e) => setConfig({ showGrid: e.target.checked })} />
            <label htmlFor="show-grid-box">显示网格</label>
          </div>
        </div>
      )}

      {/* ── 散点图 ── */}
      {chartType === 'scatter' && (
        <div className="panel-section">
          <h4>散点图样式</h4>
          <div className="config-row">
            <label className="config-label">点大小</label>
            <div className="slider-row">
              <input type="range" min="2" max="24" value={config.scatterSize ?? 8}
                onChange={(e) => setConfig({ scatterSize: parseInt(e.target.value) })} />
              <span className="slider-value">{config.scatterSize ?? 8}</span>
            </div>
          </div>
          <div className="config-row toggle-row">
            <input type="checkbox" id="show-grid-scatter" checked={config.showGrid ?? true}
              onChange={(e) => setConfig({ showGrid: e.target.checked })} />
            <label htmlFor="show-grid-scatter">显示网格</label>
          </div>
        </div>
      )}

      {/* ── 气泡图 ── */}
      {chartType === 'bubble' && (
        <div className="panel-section">
          <h4>气泡图样式</h4>
          <div className="config-row">
            <label className="config-label">最大气泡大小</label>
            <div className="slider-row">
              <input type="range" min="10" max="100" value={config.bubbleMaxSize ?? 50}
                onChange={(e) => setConfig({ bubbleMaxSize: parseInt(e.target.value) })} />
              <span className="slider-value">{config.bubbleMaxSize ?? 50}</span>
            </div>
          </div>
          <div className="config-row toggle-row">
            <input type="checkbox" id="show-grid-bubble" checked={config.showGrid ?? true}
              onChange={(e) => setConfig({ showGrid: e.target.checked })} />
            <label htmlFor="show-grid-bubble">显示网格</label>
          </div>
        </div>
      )}

      {/* ── 漏斗图 ── */}
      {chartType === 'funnel' && (
        <div className="panel-section">
          <h4>漏斗图样式</h4>
          <div className="config-row toggle-row">
            <input type="checkbox" id="show-legend-funnel" checked={config.showLegend ?? true}
              onChange={(e) => setConfig({ showLegend: e.target.checked })} />
            <label htmlFor="show-legend-funnel">显示图例</label>
          </div>
        </div>
      )}

      {/* ── 热力图 ── */}
      {chartType === 'heatmap' && (
        <div className="panel-section">
          <h4>热力图样式</h4>
          <div className="config-row toggle-row">
            <input type="checkbox" id="heatmap-label" checked={config.heatmapLabel ?? false}
              onChange={(e) => setConfig({ heatmapLabel: e.target.checked })} />
            <label htmlFor="heatmap-label">显示数值</label>
          </div>
        </div>
      )}

      {/* ── 旭日图 ── */}
      {chartType === 'sunburst' && (
        <div className="panel-section">
          <h4>旭日图样式</h4>
          <div className="config-row">
            <label className="config-label">中心空白（内径）</label>
            <div className="slider-row">
              <input type="range" min="0" max="40" value={config.sunburstInnerRadius ?? 0}
                onChange={(e) => setConfig({ sunburstInnerRadius: parseInt(e.target.value) })} />
              <span className="slider-value">{config.sunburstInnerRadius ?? 0}%</span>
            </div>
          </div>
        </div>
      )}

      {/* ── 动画 ── */}
      <div className="panel-section">
        <h4>动画</h4>
        <div className="config-row">
          <label className="config-label">动画时长</label>
          <div className="slider-row">
            <input type="range" min="0" max="2000" value={config.animationDuration}
              onChange={(e) => setConfig({ animationDuration: parseInt(e.target.value) })} />
            <span className="slider-value">{config.animationDuration}ms</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ConfigPanel;
