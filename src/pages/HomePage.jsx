import {
  ChartPie, ChartHistogram, ChartLine, Ranking,
  Paint, Download, Add, Check, Lightning,
  Code, Picture, HtmlFive, DataFile,
  Upload, Setting, FolderOpen, User,
} from '@icon-park/react';
import { useChartStore } from '../store/chartStore';
import './HomePage.css';

const FEATURES = [
  { icon: Lightning, color: 'blue',   title: '秒级上手',     desc: '上传 Excel / CSV，或直接手动输入数据，三步完成一张专业图表。' },
  { icon: Paint,     color: 'purple', title: '深度自定义',   desc: '颜色、渐变、圆角、网格、标题……每一个细节都可以实时调整。' },
  { icon: ChartPie,  color: 'cyan',   title: '多种图表类型', desc: '柱状图、折线图、饼图，覆盖绝大多数数据展示场景。' },
  { icon: Download,  color: 'blue',   title: '四种导出格式', desc: '导出为高清 PNG、可交互 HTML、ECharts 代码或 JSON 配置文件。' },
  { icon: User,      color: 'purple', title: '账号云端保存', desc: '注册账号后，所有图表自动保存，随时回来继续编辑。' },
  { icon: Setting,   color: 'cyan',   title: '深浅主题',     desc: '内置亮色与暗色两套主题，适配不同场景的汇报与展示需求。' },
];

const STEPS = [
  { num: '01', color: 'blue',   icon: Upload,   title: '导入数据',   desc: '上传 Excel / CSV 文件，或在表格中直接手动输入数据。' },
  { num: '02', color: 'purple', icon: Paint,    title: '选择并定制', desc: '挑选图表类型，调整颜色、样式、标题，实时预览效果。' },
  { num: '03', color: 'cyan',   icon: Download, title: '导出分享',   desc: '一键导出为图片或可交互网页，直接嵌入报告或发送给他人。' },
];

const CHART_TYPES = [
  { icon: ChartHistogram, color: 'blue',   name: '柱状图', desc: '对比多组数据的大小关系' },
  { icon: Ranking,        color: 'purple', name: '条形图', desc: '横向排列，适合展示排名与长名称类别' },
  { icon: ChartLine,      color: 'cyan',   name: '折线图', desc: '展示数据随时间的变化趋势' },
  { icon: ChartPie,       color: 'blue',   name: '饼图',   desc: '呈现各部分占整体的比例' },
];

const EXPORT_TYPES = [
  { icon: Picture,  color: 'blue',   name: 'PNG 图片',     desc: '高清静态图，适合插入 PPT / 报告' },
  { icon: HtmlFive, color: 'purple', name: '交互 HTML',    desc: '可悬停、可缩放的完整网页' },
  { icon: Code,     color: 'cyan',   name: 'ECharts 代码', desc: '复制到项目里直接用' },
  { icon: DataFile, color: 'blue',   name: 'JSON 配置',    desc: '保存图表结构，随时复原' },
];

const STATS = [
  { value: '3+',   label: '图表类型' },
  { value: '4+',   label: '导出格式' },
  { value: '5+',   label: '颜色主题' },
  { value: '100%', label: '免费使用' },
];

function HomePage() {
  const setPage = useChartStore((state) => state.setPage);

  return (
    <div className="home-page">

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-badge">
          <Check size={12} /> 免费使用 · 无需安装
        </div>

        <h1 className="hero-title">
          让数据说话，<br />
          <span className="gradient-text">让图表出彩</span>
        </h1>

        <p className="hero-desc">
          无需代码，无需设计背景。上传数据、选择样式、一键导出——<br />
          专业级数据可视化，人人都能做到。
        </p>

        <div className="hero-cta">
          <button className="btn btn-gradient btn-lg" onClick={() => setPage('projects')}>
            <Add size={18} /> 免费创建图表
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => setPage('projects')}>
            <FolderOpen size={18} /> 导入数据文件
          </button>
        </div>

        <div className="stats-row">
          {STATS.map((s, i) => (
            <div className="stat-item" key={s.label}>
              <div className={`stat-value accent-${['blue','purple','cyan','blue'][i]}`}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag tag-purple">使用流程</div>
            <h2>三步完成一张专业图表</h2>
            <p>从原始数据到精美图表，整个过程不超过两分钟。</p>
          </div>

          <div className="steps-grid">
            {STEPS.map((step, i) => (
              <div className="step-card" key={i}>
                <div className="step-num">{step.num}</div>
                <div className={`step-icon-wrap accent-bg-${step.color}`}>
                  <step.icon size={24} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                {i < STEPS.length - 1 && <div className="step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section section-alt">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag tag-cyan">核心功能</div>
            <h2>你需要的，都在这里</h2>
            <p>从数据输入到图表导出，每个环节都经过精心打磨。</p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className={`feature-icon accent-icon-${f.color}`}>
                  <f.icon size={20} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Chart types ── */}
      <section className="section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag tag-blue">图表类型</div>
            <h2>满足主流可视化需求</h2>
            <p>持续扩展中，更多图表类型即将上线。</p>
          </div>

          <div className="chart-types-grid">
            {CHART_TYPES.map((ct, i) => (
              <div className={`chart-type-card chart-type-${ct.color}`} key={i} onClick={() => setPage('projects')}>
                <div className={`chart-type-icon accent-icon-${ct.color}`}>
                  <ct.icon size={36} />
                </div>
                <h3>{ct.name}</h3>
                <p>{ct.desc}</p>
                <span className="chart-type-cta">立即创建 →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Export formats ── */}
      <section className="section section-alt">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag tag-purple">导出格式</div>
            <h2>四种格式，覆盖所有使用场景</h2>
            <p>无论是报告插图、网页嵌入还是代码复用，都能一键搞定。</p>
          </div>

          <div className="export-grid">
            {EXPORT_TYPES.map((et, i) => (
              <div className="export-card" key={i}>
                <div className={`export-icon accent-icon-${et.color}`}>
                  <et.icon size={22} />
                </div>
                <div>
                  <h4>{et.name}</h4>
                  <p>{et.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2>现在就开始，完全免费</h2>
          <p>无需注册，打开即用。注册账号后可保存所有图表，随时回来编辑。</p>
          <button className="btn btn-gradient btn-lg" onClick={() => setPage('projects')}>
            <Add size={18} /> 创建我的第一张图表
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="footer-logo">
          <ChartHistogram size={16} />
          ChartFlow
        </div>
        <p>简单、快速、专业的数据可视化工具</p>
      </footer>

    </div>
  );
}

export default HomePage;
