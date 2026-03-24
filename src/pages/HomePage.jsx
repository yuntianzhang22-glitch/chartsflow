import { ChartPie, ChartHistogram, ChartLine, Paint, Download, Add } from '@icon-park/react';
import { useChartStore } from '../store/chartStore';
import './HomePage.css';

function HomePage() {
  const setPage = useChartStore((state) => state.setPage);

  const features = [
    { icon: Paint, title: '高度可定制', desc: '颜色、尺寸、标签、样式，所见即所得' },
    { icon: ChartPie, title: '交互预览', desc: '实时预览效果，点击元素直接编辑' },
    { icon: Download, title: '多格式导出', desc: 'PNG 图片和可交互 HTML 代码' }
  ];

  return (
    <div className="page home-page active">
      <div className="hero">
        <div className="logo">
          <div className="logo-icon">
            <ChartHistogram size={28} />
          </div>
          <div className="logo-text">ChartFlow</div>
        </div>
        
        <h1>数据可视化，简单又好看</h1>
        <p>无需代码，快速创建专业的图表。<br />拖拽几步，秒级生成可交互的炫酷图表。</p>
        
        <div className="cta-buttons">
          <button className="btn btn-primary" onClick={() => setPage('dataInput')}>
            <Add size={16} /> 创建图表
          </button>
          <button className="btn btn-secondary">
            <Download size={16} /> 导入数据
          </button>
        </div>

        <div className="features">
          {features.map((feature, index) => (
            <div className="feature-card card" key={index}>
              <div className="feature-icon">
                <feature.icon size={22} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;