import { create } from 'zustand';

export const useChartStore = create((set) => ({
  // 页面状态
  currentPage: 'home',
  
  // 数据
  chartData: {
    categories: ['第一季度', '第二季度', '第三季度', '第四季度'],
    values: [120, 180, 150, 220]
  },
  
  // 图表类型
  chartType: 'bar',
  
  // 主题
  isDark: false,
  
  // 配置
  config: {
    title: '季度销售数据',
    titleColor: '#111827',
    barRadius: 4,
    lineWidth: 2,
    showGrid: true,
    showLegend: true,
    animationDuration: 600,
    colorTheme: 'blue'
  },
  
  // 配色方案
  colorThemes: {
    light: {
      blue: ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'],
      green: ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
      purple: ['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'],
      red: ['#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FECACA'],
      amber: ['#D97706', '#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A']
    },
    dark: {
      blue: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'],
      green: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'],
      purple: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'],
      red: ['#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2'],
      amber: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7']
    }
  },
  
  // Actions
  setPage: (page) => set({ currentPage: page }),
  
  setChartData: (data) => set({ chartData: data }),
  
  updateDataPoint: (index, field, value) => set((state) => {
    const newCategories = [...state.chartData.categories];
    const newValues = [...state.chartData.values];
    
    if (field === 'name') {
      newCategories[index] = value;
    } else if (field === 'value') {
      newValues[index] = parseFloat(value) || 0;
    }
    
    return {
      chartData: {
        categories: newCategories,
        values: newValues
      }
    };
  }),
  
  addDataPoint: () => set((state) => ({
    chartData: {
      categories: [...state.chartData.categories, `数据${state.chartData.categories.length + 1}`],
      values: [...state.chartData.values, 0]
    }
  })),
  
  removeDataPoint: (index) => set((state) => {
    if (state.chartData.categories.length <= 1) return state;
    const newCategories = state.chartData.categories.filter((_, i) => i !== index);
    const newValues = state.chartData.values.filter((_, i) => i !== index);
    return {
      chartData: {
        categories: newCategories,
        values: newValues
      }
    };
  }),
  
  setChartType: (type) => set({ chartType: type }),
  
  toggleTheme: () => set((state) => {
    const newIsDark = !state.isDark;
    return {
      isDark: newIsDark,
      config: {
        ...state.config,
        titleColor: newIsDark ? '#F9FAFB' : '#111827'
      }
    };
  }),
  
  setConfig: (config) => set((state) => ({
    config: { ...state.config, ...config }
  })),
  
  setColorTheme: (colorTheme) => set((state) => {
    // 如果是预设主题 ID，获取对应的渐变
    const themeGradients = {
      blue: 'linear-gradient(135deg, #2563EB, #3B82F6)',
      green: 'linear-gradient(135deg, #059669, #10B981)',
      purple: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
      red: 'linear-gradient(135deg, #DC2626, #EF4444)',
      amber: 'linear-gradient(135deg, #D97706, #F59E0B)'
    };
    
    const gradient = themeGradients[colorTheme] || colorTheme;
    
    return {
      config: { ...state.config, colorTheme: gradient }
    };
  }),
  
  resetConfig: () => set((state) => ({
    chartType: 'bar',
    config: {
      title: '季度销售数据',
      titleColor: state.isDark ? '#F9FAFB' : '#111827',
      barRadius: 4,
      lineWidth: 2,
      showGrid: true,
      showLegend: true,
      animationDuration: 600,
      colorTheme: 'blue'
    }
  }))
}));