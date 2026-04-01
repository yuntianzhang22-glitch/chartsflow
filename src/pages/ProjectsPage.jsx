import { useEffect, useState, useRef } from 'react';
import { Add, Star, Delete, Loading, ChartHistogram, Edit } from '@icon-park/react';
import { supabase } from '../lib/supabase';
import { useChartStore } from '../store/chartStore';
import { useAuthStore } from '../store/authStore';
import {
  getGuestCharts,
  updateGuestChart,
  deleteGuestChart,
} from '../lib/guestStorage';
import ChartMiniPreview from '../components/ChartMiniPreview';
import './ProjectsPage.css';

const TYPE_LABELS = {
  bar: '柱状图', horizontalBar: '条形图', stackedBar: '堆叠柱状',
  line: '折线图', area: '面积图', combo: '组合图',
  pie: '饼图', donut: '环形图', radar: '雷达图',
  percentBar: '百分比堆叠', treemap: '树状图', histogram: '直方图',
  boxplot: '箱线图', scatter: '散点图', bubble: '气泡图',
  funnel: '漏斗图', heatmap: '热力图', sunburst: '旭日图',
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return '刚刚';
  if (m < 60) return `${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时前`;
  const d = Math.floor(h / 24);
  return `${d} 天前`;
}

function GuestBanner({ charts }) {
  if (!charts.length) return null;
  const oldest = charts.reduce((a, b) =>
    new Date(a.created_at) < new Date(b.created_at) ? a : b
  );
  const expiresIn = Math.max(
    0,
    Math.ceil((new Date(oldest.created_at).getTime() + 24 * 3600 * 1000 - Date.now()) / 3600000)
  );
  return (
    <div className="guest-banner">
      <span>未登录模式：项目仅保存在本设备，最早的项目将在约 <b>{expiresIn} 小时</b>后自动删除。</span>
      <span className="guest-banner-tip">注册账号即可永久保存 →</span>
    </div>
  );
}

function ProjectCard({ chart, onOpen, onRename, onStar, onDelete, isGuest }) {
  const [renaming, setRenaming] = useState(false);
  const [nameVal, setNameVal] = useState(chart.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (renaming) inputRef.current?.select();
  }, [renaming]);

  const commitRename = () => {
    const trimmed = nameVal.trim();
    if (trimmed && trimmed !== chart.title) onRename(chart.id, trimmed);
    else setNameVal(chart.title);
    setRenaming(false);
  };

  return (
    <div className="project-card" onClick={() => !renaming && onOpen(chart)}>
      {/* Preview */}
      <div className="project-card-preview">
        <ChartMiniPreview
          chartType={chart.chart_type}
          chartData={chart.chart_data}
          config={chart.config}
        />
      </div>

      {/* Info */}
      <div className="project-card-info" onClick={(e) => e.stopPropagation()}>
        <div className="project-card-name-row">
          {renaming ? (
            <input
              ref={inputRef}
              className="project-card-rename-input"
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename();
                if (e.key === 'Escape') { setNameVal(chart.title); setRenaming(false); }
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className="project-card-name"
              onDoubleClick={() => setRenaming(true)}
              title="双击重命名"
            >
              {chart.title}
            </span>
          )}
          <button
            className={`project-action-btn rename-btn`}
            onClick={(e) => { e.stopPropagation(); setRenaming(true); }}
            title="重命名"
          >
            <Edit size={13} />
          </button>
        </div>

        <div className="project-card-meta">
          <span className="type-tag">{TYPE_LABELS[chart.chart_type] || chart.chart_type}</span>
          <span className="project-date">{timeAgo(chart.updated_at)}</span>
        </div>

        <div className="project-card-actions">
          {!isGuest && (
            <button
              className={`project-action-btn star-btn ${chart.starred ? 'starred' : ''}`}
              onClick={(e) => { e.stopPropagation(); onStar(chart.id, !chart.starred); }}
              title={chart.starred ? '取消收藏' : '收藏'}
            >
              <Star size={14} theme={chart.starred ? 'filled' : 'outline'} />
              {chart.starred ? '已收藏' : '收藏'}
            </button>
          )}
          <button
            className="project-action-btn delete-btn"
            onClick={(e) => { e.stopPropagation(); onDelete(chart.id); }}
            title="删除"
          >
            <Delete size={14} />
            删除
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectsPage() {
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starFilter, setStarFilter] = useState(false);

  const { user, setShowAuthModal } = useAuthStore();
  const loadChart = useChartStore((s) => s.loadChart);
  const resetConfig = useChartStore((s) => s.resetConfig);
  const setPage = useChartStore((s) => s.setPage);

  const isGuest = !user;

  // ── Load ──
  useEffect(() => {
    if (user) {
      fetchSupabase();
    } else {
      setCharts(getGuestCharts());
      setLoading(false);
    }
  }, [user]);

  const fetchSupabase = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('charts')
      .select('*')
      .order('updated_at', { ascending: false });
    setCharts(data || []);
    setLoading(false);
  };

  // ── Open ──
  const handleOpen = (chart) => loadChart(chart);

  // ── New chart ──
  const handleNew = () => {
    resetConfig();
    setPage('editor');
  };

  // ── Rename ──
  const handleRename = async (id, title) => {
    setCharts((prev) => prev.map((c) => c.id === id ? { ...c, title } : c));
    if (user) {
      await supabase.from('charts').update({ title }).eq('id', id);
    } else {
      updateGuestChart(id, { title });
    }
  };

  // ── Star ──
  const handleStar = async (id, starred) => {
    setCharts((prev) => prev.map((c) => c.id === id ? { ...c, starred } : c));
    if (user) {
      await supabase.from('charts').update({ starred }).eq('id', id);
    }
  };

  // ── Delete ──
  const handleDelete = async (id) => {
    if (!window.confirm('确定删除这个项目吗？此操作不可恢复。')) return;
    setCharts((prev) => prev.filter((c) => c.id !== id));
    if (user) {
      await supabase.from('charts').delete().eq('id', id);
    } else {
      deleteGuestChart(id);
    }
  };

  const displayed = starFilter ? charts.filter((c) => c.starred) : charts;

  return (
    <div className="projects-page">
      {/* Header */}
      <div className="projects-header">
        <div className="projects-header-left">
          <h2>我的项目</h2>
          <span className="projects-count">{charts.length} 个项目</span>
        </div>
        <div className="projects-header-right">
          {!isGuest && (
            <button
              className={`btn btn-secondary ${starFilter ? 'active' : ''}`}
              onClick={() => setStarFilter((v) => !v)}
            >
              <Star size={14} theme={starFilter ? 'filled' : 'outline'} />
              {starFilter ? '显示全部' : '已收藏'}
            </button>
          )}
          <button className="btn btn-primary" onClick={handleNew}>
            <Add size={14} /> 新建图表
          </button>
        </div>
      </div>

      {/* Guest warning */}
      {isGuest && <GuestBanner charts={charts} />}

      {/* Content */}
      {loading ? (
        <div className="projects-state">
          <Loading size={36} className="spin" />
          <p>加载中...</p>
        </div>
      ) : displayed.length === 0 ? (
        <div className="projects-state">
          <ChartHistogram size={48} />
          <p>{starFilter ? '没有收藏的项目' : '还没有项目，创建你的第一张图表吧'}</p>
          {!starFilter && (
            <button className="btn btn-primary" onClick={handleNew}>
              <Add size={14} /> 新建图表
            </button>
          )}
        </div>
      ) : (
        <div className="projects-grid">
          {displayed.map((chart) => (
            <ProjectCard
              key={chart.id}
              chart={chart}
              onOpen={handleOpen}
              onRename={handleRename}
              onStar={handleStar}
              onDelete={handleDelete}
              isGuest={isGuest}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
