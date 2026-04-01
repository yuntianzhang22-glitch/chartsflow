import { create } from 'zustand';

const MULTI_SERIES_TYPES = ['stackedBar', 'percentBar', 'combo'];

const DEFAULT_SCATTER = [
  { name: '点1', x: 10, y: 20 },
  { name: '点2', x: 30, y: 45 },
  { name: '点3', x: 55, y: 15 },
  { name: '点4', x: 70, y: 60 },
  { name: '点5', x: 85, y: 35 },
];

const DEFAULT_BUBBLE = [
  { name: '点1', x: 10, y: 20, size: 30 },
  { name: '点2', x: 30, y: 45, size: 50 },
  { name: '点3', x: 55, y: 15, size: 20 },
  { name: '点4', x: 70, y: 60, size: 40 },
  { name: '点5', x: 85, y: 35, size: 25 },
];

const DEFAULT_BOX_CATEGORIES = ['组 A', '组 B', '组 C', '组 D'];
const DEFAULT_BOX_VALUES = [
  [5, 25, 45, 65, 90],
  [10, 30, 50, 70, 95],
  [15, 25, 40, 60, 85],
  [8, 20, 38, 58, 80],
];

const DEFAULT_HEATMAP_ROWS = ['周一', '周二', '周三', '周四', '周五'];
const DEFAULT_HEATMAP_COLS = ['9:00', '12:00', '15:00', '18:00', '21:00'];
const DEFAULT_HEATMAP_VALUES = [
  [10, 60, 40, 80, 30],
  [55, 30, 75, 20, 90],
  [25, 70, 15, 85, 45],
  [80, 40, 60, 35, 70],
  [45, 85, 25, 65, 50],
];

const DEFAULT_SUNBURST_DATA = [
  { name: '类别 A', value: 40, children: [
    { name: 'A-1', value: 20 },
    { name: 'A-2', value: 20 },
  ]},
  { name: '类别 B', value: 35, children: [
    { name: 'B-1', value: 15 },
    { name: 'B-2', value: 20 },
  ]},
  { name: '类别 C', value: 25, children: [
    { name: 'C-1', value: 10 },
    { name: 'C-2', value: 15 },
  ]},
];

export const useChartStore = create((set) => ({
  currentPage: 'home',
  editingChartId: null,

  chartData: {
    categories: ['第一季度', '第二季度', '第三季度', '第四季度'],
    values: [120, 180, 150, 220],
    series: null,
    scatterPoints: null,
    bubblePoints: null,
    boxValues: null,
    heatmapRows: null,
    heatmapCols: null,
    heatmapValues: null,
    sunburstData: null,
  },

  chartType: 'bar',
  isDark: false,

  config: {
    title: '季度销售数据',
    titleColor: '#111827',
    barRadius: 4,
    lineWidth: 2,
    showGrid: true,
    showLegend: true,
    animationDuration: 600,
    colorTheme: 'blue',
    // 条形图
    barSort: 'none',
    barLabel: false,
    // 折线 / 面积 / 雷达
    smoothLine: true,
    areaOpacity: 50,
    radarFilled: true,
    // 饼图 / 环形图
    pieInnerRadius: 0,
    // 堆叠
    stackLabel: false,
    // 树状图
    treemapLabel: true,
    // 散点 / 气泡
    scatterSize: 8,
    bubbleMaxSize: 50,
    // 热力图
    heatmapLabel: false,
    // 旭日图
    sunburstInnerRadius: 0,
  },

  colorThemes: {
    light: {
      blue:   ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'],
      green:  ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
      purple: ['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'],
      red:    ['#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FECACA'],
      amber:  ['#D97706', '#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A'],
    },
    dark: {
      blue:   ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'],
      green:  ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'],
      purple: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'],
      red:    ['#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2'],
      amber:  ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7'],
    },
  },

  // ── 页面导航 ──
  setPage: (page) => set({ currentPage: page }),
  setEditingChartId: (id) => set({ editingChartId: id }),
  loadChart: (chart) => set({
    chartType: chart.chart_type,
    chartData: chart.chart_data,
    config: chart.config,
    editingChartId: chart.id,
    currentPage: 'editor',
  }),

  // ── 图表类型切换 ──
  setChartType: (type) => set((state) => {
    const d = state.chartData;

    if (MULTI_SERIES_TYPES.includes(type) && !d.series) {
      const vals = d.values;
      return {
        chartType: type,
        chartData: {
          ...d,
          series: [
            { name: '系列 A', values: [...vals] },
            { name: '系列 B', values: vals.map(v => Math.round(v * 0.65)) },
          ],
        },
      };
    }

    if (type === 'donut') {
      return {
        chartType: type,
        config: {
          ...state.config,
          pieInnerRadius: state.config.pieInnerRadius > 0 ? state.config.pieInnerRadius : 40,
        },
      };
    }

    if ((type === 'scatter' || type === 'bubble') && !d.scatterPoints) {
      return {
        chartType: type,
        chartData: { ...d, scatterPoints: DEFAULT_SCATTER, bubblePoints: DEFAULT_BUBBLE },
      };
    }

    if (type === 'boxplot' && !d.boxValues) {
      return {
        chartType: type,
        chartData: {
          ...d,
          categories: [...DEFAULT_BOX_CATEGORIES],
          boxValues: DEFAULT_BOX_VALUES.map(r => [...r]),
        },
      };
    }

    if (type === 'heatmap' && !d.heatmapValues) {
      return {
        chartType: type,
        chartData: {
          ...d,
          heatmapRows: [...DEFAULT_HEATMAP_ROWS],
          heatmapCols: [...DEFAULT_HEATMAP_COLS],
          heatmapValues: DEFAULT_HEATMAP_VALUES.map(r => [...r]),
        },
      };
    }

    if (type === 'sunburst' && !d.sunburstData) {
      return {
        chartType: type,
        chartData: {
          ...d,
          sunburstData: JSON.parse(JSON.stringify(DEFAULT_SUNBURST_DATA)),
        },
      };
    }

    return { chartType: type };
  }),

  // ── 单系列数据 ──
  setChartData: (data) => set({ chartData: data }),

  updateDataPoint: (index, field, value) => set((state) => {
    const cats = [...state.chartData.categories];
    const vals = [...state.chartData.values];
    if (field === 'name') cats[index] = value;
    else if (field === 'value') vals[index] = parseFloat(value) || 0;
    return { chartData: { ...state.chartData, categories: cats, values: vals } };
  }),

  addDataPoint: () => set((state) => {
    const newSeries = state.chartData.series
      ? state.chartData.series.map(s => ({ ...s, values: [...s.values, 0] }))
      : null;
    return {
      chartData: {
        ...state.chartData,
        categories: [...state.chartData.categories, `数据${state.chartData.categories.length + 1}`],
        values: [...state.chartData.values, 0],
        series: newSeries,
      },
    };
  }),

  removeDataPoint: (index) => set((state) => {
    if (state.chartData.categories.length <= 1) return state;
    const newSeries = state.chartData.series
      ? state.chartData.series.map(s => ({ ...s, values: s.values.filter((_, i) => i !== index) }))
      : null;
    return {
      chartData: {
        ...state.chartData,
        categories: state.chartData.categories.filter((_, i) => i !== index),
        values: state.chartData.values.filter((_, i) => i !== index),
        series: newSeries,
      },
    };
  }),

  // ── 多系列 ──
  updateSeriesName: (si, name) => set((state) => {
    const s = [...(state.chartData.series || [])];
    s[si] = { ...s[si], name };
    return { chartData: { ...state.chartData, series: s } };
  }),

  updateSeriesValue: (si, vi, value) => set((state) => {
    const s = [...(state.chartData.series || [])];
    const vals = [...s[si].values];
    vals[vi] = parseFloat(value) || 0;
    s[si] = { ...s[si], values: vals };
    return { chartData: { ...state.chartData, series: s } };
  }),

  addSeries: () => set((state) => {
    const existing = state.chartData.series || [];
    const letter = String.fromCharCode(65 + existing.length);
    return {
      chartData: {
        ...state.chartData,
        series: [...existing, { name: `系列 ${letter}`, values: Array(state.chartData.categories.length).fill(0) }],
      },
    };
  }),

  removeSeries: (index) => set((state) => {
    if ((state.chartData.series || []).length <= 2) return state;
    return { chartData: { ...state.chartData, series: state.chartData.series.filter((_, i) => i !== index) } };
  }),

  // ── 散点图数据 ──
  updateScatterPoint: (index, field, value) => set((state) => {
    const pts = [...(state.chartData.scatterPoints || [])];
    pts[index] = { ...pts[index], [field]: field === 'name' ? value : (parseFloat(value) || 0) };
    return { chartData: { ...state.chartData, scatterPoints: pts } };
  }),
  addScatterPoint: () => set((state) => {
    const pts = state.chartData.scatterPoints || [];
    return { chartData: { ...state.chartData, scatterPoints: [...pts, { name: `点${pts.length + 1}`, x: 0, y: 0 }] } };
  }),
  removeScatterPoint: (index) => set((state) => {
    if ((state.chartData.scatterPoints || []).length <= 1) return state;
    return { chartData: { ...state.chartData, scatterPoints: state.chartData.scatterPoints.filter((_, i) => i !== index) } };
  }),

  // ── 气泡图数据 ──
  updateBubblePoint: (index, field, value) => set((state) => {
    const pts = [...(state.chartData.bubblePoints || [])];
    pts[index] = { ...pts[index], [field]: field === 'name' ? value : (parseFloat(value) || 0) };
    return { chartData: { ...state.chartData, bubblePoints: pts } };
  }),
  addBubblePoint: () => set((state) => {
    const pts = state.chartData.bubblePoints || [];
    return { chartData: { ...state.chartData, bubblePoints: [...pts, { name: `点${pts.length + 1}`, x: 0, y: 0, size: 20 }] } };
  }),
  removeBubblePoint: (index) => set((state) => {
    if ((state.chartData.bubblePoints || []).length <= 1) return state;
    return { chartData: { ...state.chartData, bubblePoints: state.chartData.bubblePoints.filter((_, i) => i !== index) } };
  }),

  // ── 箱线图数据 ──
  updateBoxValue: (catIndex, fieldIndex, value) => set((state) => {
    const bv = state.chartData.boxValues.map(r => [...r]);
    bv[catIndex][fieldIndex] = parseFloat(value) || 0;
    return { chartData: { ...state.chartData, boxValues: bv } };
  }),
  updateBoxCategoryName: (index, name) => set((state) => {
    const cats = [...state.chartData.categories];
    cats[index] = name;
    return { chartData: { ...state.chartData, categories: cats } };
  }),
  addBoxCategory: () => set((state) => {
    return {
      chartData: {
        ...state.chartData,
        categories: [...state.chartData.categories, `组 ${String.fromCharCode(65 + state.chartData.categories.length)}`],
        boxValues: [...(state.chartData.boxValues || []), [0, 25, 50, 75, 100]],
      },
    };
  }),
  removeBoxCategory: (index) => set((state) => {
    if (state.chartData.categories.length <= 1) return state;
    return {
      chartData: {
        ...state.chartData,
        categories: state.chartData.categories.filter((_, i) => i !== index),
        boxValues: (state.chartData.boxValues || []).filter((_, i) => i !== index),
      },
    };
  }),

  // ── 热力图数据 ──
  updateHeatmapValue: (ri, ci, value) => set((state) => {
    const vals = state.chartData.heatmapValues.map(r => [...r]);
    vals[ri][ci] = parseFloat(value) || 0;
    return { chartData: { ...state.chartData, heatmapValues: vals } };
  }),
  updateHeatmapRowLabel: (index, name) => set((state) => {
    const rows = [...state.chartData.heatmapRows];
    rows[index] = name;
    return { chartData: { ...state.chartData, heatmapRows: rows } };
  }),
  updateHeatmapColLabel: (index, name) => set((state) => {
    const cols = [...state.chartData.heatmapCols];
    cols[index] = name;
    return { chartData: { ...state.chartData, heatmapCols: cols } };
  }),
  addHeatmapRow: () => set((state) => {
    const cols = state.chartData.heatmapCols || [];
    return {
      chartData: {
        ...state.chartData,
        heatmapRows: [...state.chartData.heatmapRows, `行${state.chartData.heatmapRows.length + 1}`],
        heatmapValues: [...state.chartData.heatmapValues, Array(cols.length).fill(0)],
      },
    };
  }),
  removeHeatmapRow: (index) => set((state) => {
    if (state.chartData.heatmapRows.length <= 1) return state;
    return {
      chartData: {
        ...state.chartData,
        heatmapRows: state.chartData.heatmapRows.filter((_, i) => i !== index),
        heatmapValues: state.chartData.heatmapValues.filter((_, i) => i !== index),
      },
    };
  }),
  addHeatmapCol: () => set((state) => {
    const rows = state.chartData.heatmapRows || [];
    return {
      chartData: {
        ...state.chartData,
        heatmapCols: [...state.chartData.heatmapCols, `列${state.chartData.heatmapCols.length + 1}`],
        heatmapValues: state.chartData.heatmapValues.map(r => [...r, 0]),
      },
    };
  }),
  removeHeatmapCol: (index) => set((state) => {
    if (state.chartData.heatmapCols.length <= 1) return state;
    return {
      chartData: {
        ...state.chartData,
        heatmapCols: state.chartData.heatmapCols.filter((_, i) => i !== index),
        heatmapValues: state.chartData.heatmapValues.map(r => r.filter((_, i) => i !== index)),
      },
    };
  }),

  // ── 旭日图数据 ──
  updateSunburstRoot: (ri, field, value) => set((state) => {
    const data = JSON.parse(JSON.stringify(state.chartData.sunburstData));
    data[ri][field] = field === 'name' ? value : (parseFloat(value) || 0);
    return { chartData: { ...state.chartData, sunburstData: data } };
  }),
  updateSunburstChild: (ri, ci, field, value) => set((state) => {
    const data = JSON.parse(JSON.stringify(state.chartData.sunburstData));
    data[ri].children[ci][field] = field === 'name' ? value : (parseFloat(value) || 0);
    return { chartData: { ...state.chartData, sunburstData: data } };
  }),
  addSunburstRoot: () => set((state) => {
    const data = JSON.parse(JSON.stringify(state.chartData.sunburstData));
    const letter = String.fromCharCode(65 + data.length);
    data.push({ name: `类别 ${letter}`, value: 20, children: [{ name: `${letter}-1`, value: 20 }] });
    return { chartData: { ...state.chartData, sunburstData: data } };
  }),
  removeSunburstRoot: (ri) => set((state) => {
    if (state.chartData.sunburstData.length <= 1) return state;
    const data = state.chartData.sunburstData.filter((_, i) => i !== ri);
    return { chartData: { ...state.chartData, sunburstData: data } };
  }),
  addSunburstChild: (ri) => set((state) => {
    const data = JSON.parse(JSON.stringify(state.chartData.sunburstData));
    const parent = data[ri];
    const idx = parent.children.length + 1;
    const prefix = parent.name.replace(/\s/g, '');
    parent.children.push({ name: `${prefix}-${idx}`, value: 10 });
    return { chartData: { ...state.chartData, sunburstData: data } };
  }),
  removeSunburstChild: (ri, ci) => set((state) => {
    if ((state.chartData.sunburstData[ri]?.children || []).length <= 1) return state;
    const data = JSON.parse(JSON.stringify(state.chartData.sunburstData));
    data[ri].children = data[ri].children.filter((_, i) => i !== ci);
    return { chartData: { ...state.chartData, sunburstData: data } };
  }),

  // ── 其他 ──
  toggleTheme: () => set((state) => ({
    isDark: !state.isDark,
    config: { ...state.config, titleColor: !state.isDark ? '#F9FAFB' : '#111827' },
  })),

  setConfig: (config) => set((state) => ({ config: { ...state.config, ...config } })),

  setColorTheme: (colorTheme) => set((state) => ({
    config: { ...state.config, colorTheme },
  })),

  resetConfig: () => set((state) => ({
    chartType: 'bar',
    editingChartId: null,
    chartData: {
      categories: ['第一季度', '第二季度', '第三季度', '第四季度'],
      values: [120, 180, 150, 220],
      series: null,
      scatterPoints: null,
      bubblePoints: null,
      boxValues: null,
      heatmapRows: null,
      heatmapCols: null,
      heatmapValues: null,
      sunburstData: null,
    },
    config: {
      title: '季度销售数据',
      titleColor: state.isDark ? '#F9FAFB' : '#111827',
      barRadius: 4, lineWidth: 2,
      showGrid: true, showLegend: true,
      animationDuration: 600, colorTheme: 'blue',
      barSort: 'none', barLabel: false,
      smoothLine: true, areaOpacity: 50,
      radarFilled: true, pieInnerRadius: 0,
      stackLabel: false, treemapLabel: true,
      scatterSize: 8, bubbleMaxSize: 50,
      heatmapLabel: false,
      sunburstInnerRadius: 0,
    },
  })),
}));
