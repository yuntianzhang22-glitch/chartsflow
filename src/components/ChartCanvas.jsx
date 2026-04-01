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
    const colors = (isDark ? colorThemes.dark[theme] : colorThemes.light[theme])
      ?? colorThemes.light.blue;
    return { isGradient: false, gradient: null, colors };
  };

  const getOption = () => {
    const { isGradient, gradient, colors } = getColors();
    const textColor = isDark ? '#9CA3AF' : '#6B7280';
    const lineColor = isDark ? '#27272A' : '#E5E7EB';
    const isHBar = chartType === 'horizontalBar';

    // 条形图排序
    const getSortedData = () => {
      const sort = config.barSort ?? 'none';
      if (sort === 'none' || !isHBar) return { categories: chartData.categories, values: chartData.values };
      const pairs = chartData.categories.map((c, i) => ({ c, v: chartData.values[i] }));
      pairs.sort((a, b) => sort === 'asc' ? a.v - b.v : b.v - a.v);
      return { categories: pairs.map(p => p.c), values: pairs.map(p => p.v) };
    };

    // 多系列数据（堆叠柱/组合图/百分比堆叠）
    const series = chartData.series || [
      { name: '系列 A', values: chartData.values },
      { name: '系列 B', values: chartData.values.map(v => Math.round(v * 0.65)) },
    ];

    const noAxes = ['pie', 'donut', 'radar', 'treemap'].includes(chartType);
    const useItemTrigger = noAxes || ['scatter', 'bubble', 'boxplot'].includes(chartType);

    const option = {
      backgroundColor: 'transparent',
      animationDuration: config.animationDuration,
      title: {
        text: config.title,
        left: 'center',
        top: 16,
        textStyle: { color: config.titleColor, fontSize: 18, fontWeight: 600, fontFamily: 'Outfit' },
      },
      tooltip: {
        trigger: useItemTrigger ? 'item' : 'axis',
        backgroundColor: isDark ? '#1C1C1F' : '#FFFFFF',
        borderColor: isDark ? '#27272A' : '#E5E7EB',
        textStyle: { color: isDark ? '#F9FAFB' : '#111827' },
      },
      legend: {
        show: config.showLegend ?? true,
        bottom: 12,
        textStyle: { color: textColor },
      },
      grid: noAxes ? undefined
        : isHBar
          ? { left: '20%', right: '14%', top: '12%', bottom: '20%' }
          : { left: '12%', right: '5%',  top: '15%', bottom: '20%' },
      xAxis: noAxes ? undefined
        : isHBar
          ? { type: 'value', axisLine: { show: false }, splitLine: { show: config.showGrid ?? true, lineStyle: { color: lineColor, type: 'dashed' } }, axisLabel: { color: textColor } }
          : { type: 'category', data: chartData.categories, axisLine: { lineStyle: { color: lineColor } }, axisLabel: { color: textColor } },
      yAxis: noAxes ? undefined
        : isHBar
          ? { type: 'category', data: getSortedData().categories, axisLine: { lineStyle: { color: lineColor } }, axisLabel: { color: textColor } }
          : { type: 'value', axisLine: { show: false }, splitLine: { show: config.showGrid ?? true, lineStyle: { color: lineColor, type: 'dashed' } }, axisLabel: { color: textColor } },
      series: [],
    };

    // ── 柱状图 ──
    if (chartType === 'bar') {
      const barColor = isGradient ? gradient : { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [{ offset: 0, color: colors[0] }, { offset: 1, color: colors[1] }] };
      option.series.push({
        type: 'bar', data: chartData.values, barWidth: '50%',
        itemStyle: { color: barColor, borderRadius: [config.barRadius ?? 4, config.barRadius ?? 4, 0, 0] },
      });

    // ── 条形图 ──
    } else if (chartType === 'horizontalBar') {
      const r = config.barRadius ?? 4;
      const barColor = isGradient ? gradient : { type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
        colorStops: [{ offset: 0, color: colors[1] }, { offset: 1, color: colors[0] }] };
      option.series.push({
        type: 'bar', data: getSortedData().values, barWidth: '50%',
        itemStyle: { color: barColor, borderRadius: [0, r, r, 0] },
        label: { show: config.barLabel ?? false, position: 'right', color: textColor, fontSize: 12 },
      });

    // ── 堆叠柱状图 ──
    } else if (chartType === 'stackedBar') {
      series.forEach((s, i) => {
        const isTop = i === series.length - 1;
        option.series.push({
          name: s.name,
          type: 'bar',
          stack: 'total',
          data: s.values,
          barWidth: '50%',
          itemStyle: {
            color: colors[i % colors.length],
            borderRadius: isTop ? [config.barRadius ?? 4, config.barRadius ?? 4, 0, 0] : [0, 0, 0, 0],
          },
          label: { show: config.stackLabel ?? false, position: 'inside', color: '#fff', fontSize: 11 },
        });
      });

    // ── 折线图 ──
    } else if (chartType === 'line') {
      option.series.push({
        type: 'line', data: chartData.values,
        smooth: config.smoothLine ?? true, symbol: 'circle', symbolSize: 6,
        lineStyle: { color: colors[0], width: config.lineWidth ?? 2 },
        itemStyle: { color: colors[0] },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: colors[0] + '30' }, { offset: 1, color: colors[0] + '00' }] } },
      });

    // ── 面积图 ──
    } else if (chartType === 'area') {
      const alpha = Math.round((config.areaOpacity ?? 50) * 2.55).toString(16).padStart(2, '0');
      option.series.push({
        type: 'line', data: chartData.values,
        smooth: config.smoothLine ?? true, symbol: 'circle', symbolSize: 6,
        lineStyle: { color: colors[0], width: config.lineWidth ?? 2 },
        itemStyle: { color: colors[0] },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: colors[0] + alpha }, { offset: 1, color: colors[0] + '00' }] } },
      });

    // ── 组合图（柱 + 折线）──
    } else if (chartType === 'combo') {
      const barColor = isGradient ? gradient : { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [{ offset: 0, color: colors[0] }, { offset: 1, color: colors[1] }] };
      option.series.push({
        name: series[0]?.name || '柱状',
        type: 'bar', data: series[0]?.values ?? chartData.values, barWidth: '40%',
        itemStyle: { color: barColor, borderRadius: [config.barRadius ?? 4, config.barRadius ?? 4, 0, 0] },
      });
      option.series.push({
        name: series[1]?.name || '折线',
        type: 'line', data: series[1]?.values ?? chartData.values,
        smooth: config.smoothLine ?? true, symbol: 'circle', symbolSize: 6,
        lineStyle: { color: colors[2] ?? colors[0], width: config.lineWidth ?? 2 },
        itemStyle: { color: colors[2] ?? colors[0] },
      });

    // ── 饼图 ──
    } else if (chartType === 'pie') {
      option.xAxis = undefined; option.yAxis = undefined; option.grid = undefined;
      option.series.push({
        type: 'pie',
        radius: [`${config.pieInnerRadius ?? 0}%`, '65%'],
        center: ['50%', '50%'],
        data: chartData.categories.map((name, i) => ({
          name, value: chartData.values[i],
          itemStyle: { color: isGradient ? undefined : colors[i % colors.length] },
        })),
        label: { color: textColor, fontSize: 12 },
      });
      if (isGradient) {
        option.series[0].itemStyle = { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 1,
          colorStops: colors.map((c, i) => ({ offset: i / (colors.length - 1), color: c })) } };
      }

    // ── 雷达图 ──
    } else if (chartType === 'radar') {
      option.xAxis = undefined; option.yAxis = undefined; option.grid = undefined;
      option.radar = {
        indicator: chartData.categories.map(name => ({
          name,
          max: config.radarMax || Math.max(...chartData.values) * 1.2,
        })),
        center: ['50%', '48%'], radius: '58%',
        axisName: { color: textColor, fontSize: 12 },
        splitLine: { lineStyle: { color: lineColor } },
        splitArea: { show: false },
        axisLine: { lineStyle: { color: lineColor } },
      };
      option.series.push({
        type: 'radar',
        data: [{
          value: chartData.values,
          name: config.title || '数据',
          itemStyle: { color: colors[0] },
          lineStyle: { color: colors[0], width: config.lineWidth ?? 2 },
          areaStyle: config.radarFilled ? { color: colors[0] + '40' } : undefined,
        }],
      });

    // ── 环形图 ──
    } else if (chartType === 'donut') {
      option.xAxis = undefined; option.yAxis = undefined; option.grid = undefined;
      option.series.push({
        type: 'pie',
        radius: [`${config.pieInnerRadius ?? 40}%`, '65%'],
        center: ['50%', '50%'],
        data: chartData.categories.map((name, i) => ({
          name, value: chartData.values[i],
          itemStyle: { color: colors[i % colors.length] },
        })),
        label: { color: textColor, fontSize: 12 },
        itemStyle: { borderRadius: 4, borderColor: isDark ? '#111' : '#fff', borderWidth: 2 },
      });

    // ── 百分比堆叠图 ──
    } else if (chartType === 'percentBar') {
      const totals = chartData.categories.map((_, ci) =>
        series.reduce((sum, s) => sum + (s.values[ci] || 0), 0)
      );
      series.forEach((s, i) => {
        const isTop = i === series.length - 1;
        option.series.push({
          name: s.name,
          type: 'bar',
          stack: 'total',
          data: s.values.map((v, ci) =>
            totals[ci] > 0 ? parseFloat(((v / totals[ci]) * 100).toFixed(1)) : 0
          ),
          barWidth: '50%',
          itemStyle: {
            color: colors[i % colors.length],
            borderRadius: isTop ? [config.barRadius ?? 4, config.barRadius ?? 4, 0, 0] : [0, 0, 0, 0],
          },
          label: {
            show: config.stackLabel ?? false,
            position: 'inside',
            color: '#fff',
            fontSize: 11,
            formatter: (p) => p.value > 5 ? `${p.value}%` : '',
          },
        });
      });
      if (option.yAxis) {
        option.yAxis.max = 100;
        option.yAxis.axisLabel = { color: textColor, formatter: '{value}%' };
      }

    // ── 树状图 ──
    } else if (chartType === 'treemap') {
      option.xAxis = undefined; option.yAxis = undefined; option.grid = undefined;
      option.legend = { show: false };
      option.series.push({
        type: 'treemap',
        data: chartData.categories.map((name, i) => ({
          name, value: chartData.values[i],
          itemStyle: { color: colors[i % colors.length] },
        })),
        label: {
          show: config.treemapLabel ?? true,
          color: '#fff',
          fontSize: 12,
          formatter: (p) => `${p.name}\n${p.value}`,
        },
        top: '10%', bottom: '14%', left: '5%', right: '5%',
        breadcrumb: { show: false },
        roam: false,
      });

    // ── 直方图 ──
    } else if (chartType === 'histogram') {
      const barColor = isGradient ? gradient : { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [{ offset: 0, color: colors[0] }, { offset: 1, color: colors[1] }] };
      option.series.push({
        type: 'bar',
        data: chartData.values,
        barWidth: '99.3%',
        itemStyle: { color: barColor, borderRadius: [config.barRadius ?? 0, config.barRadius ?? 0, 0, 0] },
      });

    // ── 箱线图 ──
    } else if (chartType === 'boxplot') {
      const boxData = chartData.boxValues || [];
      option.tooltip = {
        trigger: 'item',
        backgroundColor: isDark ? '#1C1C1F' : '#FFFFFF',
        borderColor: isDark ? '#27272A' : '#E5E7EB',
        textStyle: { color: isDark ? '#F9FAFB' : '#111827' },
        formatter: (p) => {
          const [min, q1, med, q3, max] = p.data;
          return `${p.name}<br/>最大值: ${max}<br/>Q3: ${q3}<br/>中位数: ${med}<br/>Q1: ${q1}<br/>最小值: ${min}`;
        },
      };
      option.series.push({
        type: 'boxplot',
        data: boxData,
        itemStyle: { color: colors[0] + '30', borderColor: colors[0], borderWidth: 2 },
        boxWidth: ['30%', '50%'],
      });

    // ── 散点图 ──
    } else if (chartType === 'scatter') {
      const pts = chartData.scatterPoints || [];
      option.xAxis = {
        type: 'value',
        axisLine: { lineStyle: { color: lineColor } },
        splitLine: { show: config.showGrid ?? true, lineStyle: { color: lineColor, type: 'dashed' } },
        axisLabel: { color: textColor },
      };
      option.yAxis = {
        type: 'value',
        axisLine: { show: false },
        splitLine: { show: config.showGrid ?? true, lineStyle: { color: lineColor, type: 'dashed' } },
        axisLabel: { color: textColor },
      };
      option.grid = { left: '12%', right: '8%', top: '15%', bottom: '20%' };
      option.tooltip = {
        trigger: 'item',
        backgroundColor: isDark ? '#1C1C1F' : '#FFFFFF',
        borderColor: isDark ? '#27272A' : '#E5E7EB',
        textStyle: { color: isDark ? '#F9FAFB' : '#111827' },
        formatter: (p) => `${pts[p.dataIndex]?.name || ''}<br/>X: ${p.data[0]}<br/>Y: ${p.data[1]}`,
      };
      option.series.push({
        type: 'scatter',
        data: pts.map(p => [p.x, p.y]),
        symbolSize: config.scatterSize ?? 8,
        itemStyle: { color: colors[0], opacity: 0.8 },
      });

    // ── 漏斗图 ──
    } else if (chartType === 'funnel') {
      option.xAxis = undefined; option.yAxis = undefined; option.grid = undefined;
      option.series.push({
        type: 'funnel',
        left: '15%', right: '15%', top: '15%', bottom: '16%',
        sort: 'descending',
        data: chartData.categories.map((name, i) => ({
          name, value: chartData.values[i],
          itemStyle: { color: colors[i % colors.length] },
        })),
        label: { color: textColor, fontSize: 12 },
        itemStyle: { borderColor: isDark ? '#111' : '#fff', borderWidth: 2 },
      });

    // ── 热力图 ──
    } else if (chartType === 'heatmap') {
      const rows = chartData.heatmapRows || [];
      const cols = chartData.heatmapCols || [];
      const hvals = chartData.heatmapValues || [];
      const flat = [];
      rows.forEach((_, ri) => cols.forEach((_, ci) => flat.push([ci, ri, hvals[ri]?.[ci] ?? 0])));
      const allNums = flat.map(d => d[2]);
      const minVal = Math.min(...allNums);
      const maxVal = Math.max(...allNums, minVal + 1);
      option.xAxis = {
        type: 'category', data: cols,
        axisLine: { lineStyle: { color: lineColor } },
        axisLabel: { color: textColor },
        splitArea: { show: true, areaStyle: { color: isDark ? ['#18181b','#1c1c1f'] : ['#f9fafb','#ffffff'] } },
      };
      option.yAxis = {
        type: 'category', data: rows,
        axisLine: { lineStyle: { color: lineColor } },
        axisLabel: { color: textColor },
        splitArea: { show: true, areaStyle: { color: isDark ? ['#18181b','#1c1c1f'] : ['#f9fafb','#ffffff'] } },
      };
      option.grid = { left: '15%', right: '12%', top: '15%', bottom: '26%' };
      option.visualMap = {
        min: minVal, max: maxVal,
        calculable: true,
        orient: 'horizontal',
        left: 'center', bottom: 8,
        itemHeight: 100,
        inRange: { color: [colors[4], colors[2], colors[0]] },
        textStyle: { color: textColor, fontSize: 11 },
      };
      option.tooltip = {
        trigger: 'item',
        backgroundColor: isDark ? '#1C1C1F' : '#FFFFFF',
        borderColor: isDark ? '#27272A' : '#E5E7EB',
        textStyle: { color: isDark ? '#F9FAFB' : '#111827' },
        formatter: (p) => `${rows[p.data[1]]} · ${cols[p.data[0]]}<br/>值: <b>${p.data[2]}</b>`,
      };
      option.series.push({
        type: 'heatmap',
        data: flat,
        label: { show: config.heatmapLabel ?? false, fontSize: 11 },
      });

    // ── 旭日图 ──
    } else if (chartType === 'sunburst') {
      option.xAxis = undefined; option.yAxis = undefined; option.grid = undefined;
      const sunData = chartData.sunburstData || [];
      option.tooltip = {
        trigger: 'item',
        backgroundColor: isDark ? '#1C1C1F' : '#FFFFFF',
        borderColor: isDark ? '#27272A' : '#E5E7EB',
        textStyle: { color: isDark ? '#F9FAFB' : '#111827' },
        formatter: (p) => `${p.name}<br/>值: ${p.value}`,
      };
      option.series.push({
        type: 'sunburst',
        center: ['50%', '50%'],
        radius: [`${config.sunburstInnerRadius ?? 0}%`, '70%'],
        data: sunData.map((root, ri) => ({
          name: root.name,
          value: root.value,
          itemStyle: { color: colors[ri % colors.length] },
          children: (root.children || []).map((child) => ({
            name: child.name,
            value: child.value,
            itemStyle: { color: colors[ri % colors.length] + 'aa' },
          })),
        })),
        label: { color: textColor, fontSize: 11, rotate: 'radial' },
        itemStyle: { borderColor: isDark ? '#111' : '#fff', borderWidth: 2 },
        emphasis: { focus: 'ancestor' },
      });

    // ── 气泡图 ──
    } else if (chartType === 'bubble') {
      const bpts = chartData.bubblePoints || [];
      const maxRaw = Math.max(...bpts.map(p => p.size), 1);
      const maxDisplay = config.bubbleMaxSize ?? 50;
      option.xAxis = {
        type: 'value',
        axisLine: { lineStyle: { color: lineColor } },
        splitLine: { show: config.showGrid ?? true, lineStyle: { color: lineColor, type: 'dashed' } },
        axisLabel: { color: textColor },
      };
      option.yAxis = {
        type: 'value',
        axisLine: { show: false },
        splitLine: { show: config.showGrid ?? true, lineStyle: { color: lineColor, type: 'dashed' } },
        axisLabel: { color: textColor },
      };
      option.grid = { left: '12%', right: '8%', top: '15%', bottom: '20%' };
      option.tooltip = {
        trigger: 'item',
        backgroundColor: isDark ? '#1C1C1F' : '#FFFFFF',
        borderColor: isDark ? '#27272A' : '#E5E7EB',
        textStyle: { color: isDark ? '#F9FAFB' : '#111827' },
        formatter: (p) => `${bpts[p.dataIndex]?.name || ''}<br/>X: ${p.data[0]}<br/>Y: ${p.data[1]}<br/>大小: ${p.data[2]}`,
      };
      option.series.push({
        type: 'scatter',
        data: bpts.map(p => [p.x, p.y, p.size]),
        symbolSize: (val) => Math.max(4, (val[2] / maxRaw) * maxDisplay),
        itemStyle: { color: colors[0], opacity: 0.7 },
      });
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
