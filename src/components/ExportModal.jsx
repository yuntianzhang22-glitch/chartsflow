import { useState } from 'react';
import { useChartStore } from '../store/chartStore';
import * as echarts from 'echarts';
import './ExportModal.css';

function ExportModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  const chartData = useChartStore((state) => state.chartData);
  const chartType = useChartStore((state) => state.chartType);
  const isDark = useChartStore((state) => state.isDark);
  const config = useChartStore((state) => state.config);
  const colorThemes = useChartStore((state) => state.colorThemes);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const getChartOption = () => {
    const colors = isDark ? colorThemes.dark[config.colorTheme] : colorThemes.light[config.colorTheme];
    const textColor = isDark ? '#9CA3AF' : '#6B7280';
    const lineColor = isDark ? '#27272A' : '#E5E7EB';
    const bgColor = isDark ? '#141416' : '#FFFFFF';

    return {
      backgroundColor: 'transparent',
      animationDuration: config.animationDuration,
      title: {
        text: config.title,
        left: 'center',
        top: 16,
        textStyle: {
          color: config.titleColor,
          fontSize: 18,
          fontWeight: 600,
          fontFamily: 'Outfit'
        }
      },
      tooltip: {
        trigger: chartType === 'pie' ? 'item' : 'axis',
        backgroundColor: isDark ? '#1C1C1F' : '#FFFFFF',
        borderColor: isDark ? '#27272A' : '#E5E7EB',
        textStyle: { color: isDark ? '#F9FAFB' : '#111827' }
      },
      legend: {
        show: config.showLegend,
        bottom: 16,
        textStyle: { color: textColor }
      },
      grid: {
        left: '12%',
        right: '12%',
        top: '15%',
        bottom: '15%'
      },
      xAxis: chartType !== 'pie' ? {
        type: 'category',
        data: chartData.categories,
        axisLine: { lineStyle: { color: lineColor } },
        axisLabel: { color: textColor }
      } : undefined,
      yAxis: chartType !== 'pie' ? {
        type: 'value',
        axisLine: { show: false },
        splitLine: { 
          show: config.showGrid,
          lineStyle: { color: lineColor, type: 'dashed' }
        },
        axisLabel: { color: textColor }
      } : undefined,
      series: chartType === 'bar' ? [{
        type: 'bar',
        data: chartData.values,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: colors[0] },
              { offset: 1, color: colors[1] }
            ]
          },
          borderRadius: [config.barRadius, config.barRadius, 0, 0]
        },
        barWidth: '50%'
      }] : chartType === 'line' ? [{
        type: 'line',
        data: chartData.values,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: colors[0], width: config.lineWidth },
        itemStyle: { color: colors[0] },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: colors[0] + '30' },
              { offset: 1, color: colors[0] + '00' }
            ]
          }
        }
      }] : [{
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '55%'],
        data: chartData.categories.map((name, i) => ({
          name,
          value: chartData.values[i],
          itemStyle: { color: colors[i % colors.length] }
        })),
        label: { color: textColor, fontSize: 12 }
      }]
    };
  };

  const exportPNG = () => {
    // 创建一个隐藏的图表来导出
    const chartDiv = document.createElement('div');
    chartDiv.style.width = '800px';
    chartDiv.style.height = '600px';
    chartDiv.style.position = 'absolute';
    chartDiv.style.left = '-9999px';
    document.body.appendChild(chartDiv);
    
    const chart = echarts.init(chartDiv);
    chart.setOption(getChartOption());
    
    setTimeout(() => {
      const url = chart.getDataURL({ 
        type: 'png', 
        pixelRatio: 2, 
        backgroundColor: isDark ? '#141416' : '#FFFFFF' 
      });
      
      const a = document.createElement('a');
      a.download = `chart-${Date.now()}.png`;
      a.href = url;
      a.click();
      
      chart.dispose();
      document.body.removeChild(chartDiv);
      closeModal();
    }, 500);
  };

  const exportHTML = () => {
    const option = getChartOption();
    const bgColor = isDark ? '#141416' : '#FFFFFF';
    
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${config.title}</title>
  <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
  <style>
    body { margin: 0; padding: 40px; background: ${bgColor}; }
    #chart { width: 100%; height: 500px; }
  </style>
</head>
<body>
  <div id="chart"></div>
  <script>
    var chart = echarts.init(document.getElementById('chart'));
    var option = ${JSON.stringify(option, null, 2)};
    chart.setOption(option);
    window.addEventListener('resize', function() { chart.resize(); });
  </script>
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `chart-${Date.now()}.html`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
    closeModal();
  };

  const exportCode = () => {
    const option = getChartOption();
    const code = `// ECharts 配置代码
var option = ${JSON.stringify(option, null, 2)};

var chart = echarts.init(document.getElementById('main'));
chart.setOption(option);

// 响应式
window.addEventListener('resize', function() { chart.resize(); });`;
    
    navigator.clipboard.writeText(code).then(() => {
      alert('代码已复制到剪贴板！');
      closeModal();
    });
  };

  const exportJSON = () => {
    const option = getChartOption();
    const json = JSON.stringify(option, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `chart-${Date.now()}.json`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
    closeModal();
  };

  const exportOptions = [
    { id: 'png', icon: '🖼️', title: 'PNG 图片', desc: '高清静态图', action: exportPNG },
    { id: 'html', icon: '🌐', title: '交互 HTML', desc: '可嵌入网站', action: exportHTML },
    { id: 'code', icon: '💻', title: '代码', desc: 'ECharts 配置', action: exportCode },
    { id: 'json', icon: '📋', title: 'JSON', desc: '配置数据', action: exportJSON }
  ];

  // 暴露 openModal 给外部
  window.showExportModal = openModal;

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal">
        <h2>📦 导出图表</h2>
        <p>选择导出格式</p>
        
        <div className="export-options">
          {exportOptions.map((opt) => (
            <div className="export-option" key={opt.id} onClick={opt.action}>
              <div className="export-icon">{opt.icon}</div>
              <h4>{opt.title}</h4>
              <p>{opt.desc}</p>
            </div>
          ))}
        </div>
        
        <button className="btn btn-secondary" style={{ width: '100%', marginTop: 20 }} onClick={closeModal}>
          取消
        </button>
      </div>
    </div>
  );
}

export default ExportModal;