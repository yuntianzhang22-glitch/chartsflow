import { useState } from 'react';
import { ChartHistogram, ChartLine, ChartPie, Ranking, Layers, RadarChart, AreaMap, ChartGraph, Ring, SortAmountDown, TreeDiagram, ChartHistogramTwo, Box, DataDisplay, BubbleChart, Filter, GridFour, SunOne, Undo, Download, Left, Save } from '@icon-park/react';
import { useChartStore } from '../store/chartStore';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { saveGuestChart, getDeviceId } from '../lib/guestStorage';
import ChartCanvas from '../components/ChartCanvas';
import ConfigPanel from '../components/ConfigPanel';
import ExportModal from '../components/ExportModal';
import './EditorPage.css';

function EditorPage() {
  const setPage = useChartStore((state) => state.setPage);
  const chartType = useChartStore((state) => state.chartType);
  const setChartType = useChartStore((state) => state.setChartType);
  const resetConfig = useChartStore((state) => state.resetConfig);
  const chartData = useChartStore((state) => state.chartData);
  const config = useChartStore((state) => state.config);
  const editingChartId = useChartStore((state) => state.editingChartId);
  const setEditingChartId = useChartStore((state) => state.setEditingChartId);

  const { user, setShowAuthModal } = useAuthStore();
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'

  const chartTypes = [
    { type: 'bar',           icon: ChartHistogram,    label: '柱状图'    },
    { type: 'horizontalBar', icon: Ranking,            label: '条形图'    },
    { type: 'stackedBar',    icon: Layers,             label: '堆叠柱状'  },
    { type: 'line',          icon: ChartLine,          label: '折线图'    },
    { type: 'area',          icon: AreaMap,            label: '面积图'    },
    { type: 'combo',         icon: ChartGraph,         label: '组合图'    },
    { type: 'pie',           icon: ChartPie,           label: '饼图'      },
    { type: 'donut',         icon: Ring,               label: '环形图'    },
    { type: 'radar',         icon: RadarChart,         label: '雷达图'    },
    { type: 'percentBar',    icon: SortAmountDown,     label: '百分比堆叠' },
    { type: 'treemap',       icon: TreeDiagram,        label: '树状图'    },
    { type: 'histogram',     icon: ChartHistogramTwo,  label: '直方图'    },
    { type: 'boxplot',       icon: Box,                label: '箱线图'    },
    { type: 'scatter',       icon: DataDisplay,        label: '散点图'    },
    { type: 'bubble',        icon: BubbleChart,        label: '气泡图'    },
    { type: 'funnel',        icon: Filter,             label: '漏斗图'    },
    { type: 'heatmap',       icon: GridFour,           label: '热力图'    },
    { type: 'sunburst',      icon: SunOne,             label: '旭日图'    },
  ];

  const handleSave = async () => {
    setSaveStatus('saving');

    const title = config.title || '未命名图表';

    if (user) {
      // ── Logged-in: Supabase ──
      const record = {
        user_id: user.id,
        title,
        chart_type: chartType,
        chart_data: chartData,
        config,
        updated_at: new Date().toISOString(),
      };
      if (editingChartId) {
        await supabase.from('charts').update(record).eq('id', editingChartId);
      } else {
        const { data } = await supabase.from('charts').insert(record).select().single();
        if (data) setEditingChartId(data.id);
      }
    } else {
      // ── Guest: localStorage ──
      const id = editingChartId || crypto.randomUUID();
      const record = saveGuestChart({
        id,
        device_id: getDeviceId(),
        title,
        chart_type: chartType,
        chart_data: chartData,
        config,
        starred: false,
      });
      if (!editingChartId) setEditingChartId(record.id);
    }

    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const saveLabel = saveStatus === 'saving' ? '保存中...' : saveStatus === 'saved' ? '已保存 ✓' : '保存';

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
            <button
              className={`btn ${saveStatus === 'saved' ? 'btn-success' : 'btn-secondary'}`}
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
            >
              <Save size={14} /> {saveLabel}
            </button>
            <button className="btn btn-primary" onClick={() => window.showExportModal()}>
              <Download size={14} /> 导出
            </button>
            <button className="btn btn-secondary" onClick={() => setPage('projects')}>
              <Left size={14} /> 返回项目
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
