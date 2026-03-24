import { ChartHistogram, ChartLine, ChartPie, Undo, Download, Left } from '@icon-park/react';
import { useChartStore } from '../store/chartStore';
import ChartCanvas from '../components/ChartCanvas';
import ConfigPanel from '../components/ConfigPanel';
import ExportModal from '../components/ExportModal';
import './EditorPage.css';

function EditorPage() {
  const setPage = useChartStore((state) => state.setPage);
  const chartType = useChartStore((state) => state.chartType);
  const setChartType = useChartStore((state) => state.setChartType);
  const resetConfig = useChartStore((state) => state.resetConfig);

  const chartTypes = [
    { type: 'bar', icon: ChartHistogram, label: '柱状图' },
    { type: 'line', icon: ChartLine, label: '折线图' },
    { type: 'pie', icon: ChartPie, label: '饼图' }
  ];

  return (
    <div className="page editor-page active">
      <div className="editor-sidebar">
        <div className="sidebar-section">
          <h4>图表类型</h4>
          <div className="chart-types">
            {chartTypes.map((ct) => (
              <button
                key={ct.type}
                className={`chart-type-btn ${chartType === ct.type ? 'active' : ''}`}
                onClick={() => setChartType(ct.type)}
              >
                <ct.icon size={20} />
                <span>{ct.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="editor-main">
        <div className="editor-toolbar">
          <div className="toolbar-title">图表编辑器</div>
          <div className="toolbar-actions">
            <button className="btn btn-secondary" onClick={resetConfig}>
              <Undo size={14} /> 重置
            </button>
            <button className="btn btn-primary" onClick={() => window.showExportModal()}>
              <Download size={14} /> 导出
            </button>
            <button className="btn btn-secondary" onClick={() => setPage('dataInput')}>
              <Left size={14} /> 返回
            </button>
          </div>
        </div>
        <ChartCanvas />
      </div>

      <ConfigPanel />
      <ExportModal />
    </div>
  );
}

export default EditorPage;