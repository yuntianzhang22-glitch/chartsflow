import { useEffect, useState } from 'react';
import { ChartHistogram, ChartLine, ChartPie, Delete, Add, Loading } from '@icon-park/react';
import { supabase } from '../lib/supabase';
import { useChartStore } from '../store/chartStore';
import './MyChartsPage.css';

const TYPE_ICONS = { bar: ChartHistogram, line: ChartLine, pie: ChartPie };
const TYPE_LABELS = { bar: '柱状图', line: '折线图', pie: '饼图' };

function MyChartsPage() {
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const setPage = useChartStore((state) => state.setPage);
  const loadChart = useChartStore((state) => state.loadChart);

  useEffect(() => {
    fetchCharts();
  }, []);

  const fetchCharts = async () => {
    const { data } = await supabase
      .from('charts')
      .select('*')
      .order('updated_at', { ascending: false });
    setCharts(data || []);
    setLoading(false);
  };

  const deleteChart = async (id, e) => {
    e.stopPropagation();
    if (!confirm('确定删除这个图表吗？')) return;
    await supabase.from('charts').delete().eq('id', id);
    setCharts((prev) => prev.filter((c) => c.id !== id));
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="my-charts-page">
      <div className="my-charts-header">
        <div>
          <h2>我的图表</h2>
          <p>{charts.length} 个图表</p>
        </div>
        <button className="btn btn-primary" onClick={() => setPage('dataInput')}>
          <Add size={14} /> 新建图表
        </button>
      </div>

      {loading ? (
        <div className="charts-state">
          <Loading size={36} />
          <p>加载中...</p>
        </div>
      ) : charts.length === 0 ? (
        <div className="charts-state">
          <ChartHistogram size={48} />
          <p>还没有保存的图表</p>
          <button className="btn btn-primary" onClick={() => setPage('dataInput')}>
            创建第一个图表
          </button>
        </div>
      ) : (
        <div className="charts-grid">
          {charts.map((chart) => {
            const Icon = TYPE_ICONS[chart.chart_type] || ChartHistogram;
            return (
              <div
                key={chart.id}
                className="chart-card card"
                onClick={() => loadChart(chart)}
              >
                <div className="chart-card-icon">
                  <Icon size={28} />
                </div>
                <div className="chart-card-body">
                  <h3>{chart.title}</h3>
                  <div className="chart-card-meta">
                    <span className="type-tag">{TYPE_LABELS[chart.chart_type] || chart.chart_type}</span>
                    <span className="chart-date">{formatDate(chart.updated_at)}</span>
                  </div>
                </div>
                <button
                  className="delete-btn"
                  onClick={(e) => deleteChart(chart.id, e)}
                  title="删除"
                >
                  <Delete size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyChartsPage;
