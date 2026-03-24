import { useChartStore } from '../store/chartStore';
import ReactECharts from 'echarts-for-react';
import './ChartCanvas.css';

function ChartCanvas() {
  const chartData = useChartStore((state) => state.chartData);
  const chartType = useChartStore((state) => state.chartType);
  const isDark = useChartStore((state) => state.isDark);
  const config = useChartStore((state) => state.config);
  const colorThemes = useChartStore((state) => state.colorThemes);

  const getColors = () => {
    const theme = config.colorTheme;
    const themeColors = isDark ? colorThemes.dark[theme] : colorThemes.light[theme];
    
    // 检查是否是渐变色
    if (theme && theme.includes && theme.includes('gradient')) {
      return {
        isGradient: true,
        gradient: theme,
        colors: themeColors
      };
    }
    return {
      isGradient: false,
      gradient: null,
      colors: themeColors
    };
  };

  const getOption = () => {
    const { isGradient, gradient, colors } = getColors();
    const textColor = isDark ? '#9CA3AF' : '#6B7280';
    const lineColor = isDark ? '#27272A' : '#E5E7EB';

    const option = {
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
        show: config.showLegend ?? true,
        bottom: 16,
        textStyle: { color: textColor }
      },
      grid: {
        left: '12%',
        right: '12%',
        top: '15%',
        bottom: '15%'
      },
      xAxis: {
        type: 'category',
        data: chartData.categories,
        axisLine: { lineStyle: { color: lineColor } },
        axisLabel: { color: textColor }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { 
          show: config.showGrid ?? true,
          lineStyle: { color: lineColor, type: 'dashed' }
        },
        axisLabel: { color: textColor }
      },
      series: []
    };

    if (chartType === 'bar') {
      const barColor = isGradient 
        ? gradient 
        : { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [
            { offset: 0, color: colors[0] },
            { offset: 1, color: colors[1] }
          ]};
      
      option.series.push({
        type: 'bar',
        data: chartData.values,
        barWidth: '50%',
        itemStyle: {
          color: barColor,
          borderRadius: [config.barRadius ?? 4, config.barRadius ?? 4, 0, 0]
        }
      });
    } else if (chartType === 'line') {
      option.series.push({
        type: 'line',
        data: chartData.values,
        smooth: config.smoothLine ?? true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: colors[0], width: config.lineWidth ?? 2 },
        itemStyle: { color: colors[0] },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: colors[0] + '40' },
              { offset: 1, color: colors[0] + '00' }
            ]
          }
        }
      });
    } else if (chartType === 'pie') {
      option.xAxis = undefined;
      option.yAxis = undefined;
      option.grid = undefined;
      const innerRadius = config.pieInnerRadius ?? 0;
      option.series.push({
        type: 'pie',
        radius: [`${innerRadius}%`, '70%'],
        center: ['50%', '55%'],
        data: chartData.categories.map((name, i) => ({
          name,
          value: chartData.values[i],
          itemStyle: { color: isGradient ? undefined : colors[i % colors.length] }
        })),
        label: { color: textColor, fontSize: 12 }
      });
      
      // 如果是渐变色，需要特殊处理
      if (isGradient) {
        option.series[0].itemStyle = {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 1,
            colorStops: colors.map((c, i) => ({ offset: i / (colors.length - 1), color: c }))
          }
        };
      }
    }

    return option;
  };

  return (
    <div className="chart-canvas">
      <div className="chart-container">
        <ReactECharts 
          option={getOption()} 
          style={{ width: '100%', height: '100%' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    </div>
  );
}

export default ChartCanvas;