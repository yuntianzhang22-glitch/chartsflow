const COLORS = {
  blue:   ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'],
  green:  ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
  purple: ['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'],
  red:    ['#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FECACA'],
  amber:  ['#D97706', '#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A'],
};

const W = 260, H = 150;
const AXIS_LINE = { stroke: '#9CA3AF', strokeOpacity: 0.2, strokeWidth: 1 };

function normalize(values, maxH) {
  const maxV = Math.max(...values, 1);
  return values.map((v) => (v / maxV) * maxH);
}

function pieSlices(values, cx, cy, r, innerR, colors) {
  const total = values.reduce((s, v) => s + v, 0) || 1;
  let angle = -Math.PI / 2;
  return values.slice(0, 6).map((v, i) => {
    const sweep = (v / total) * Math.PI * 2;
    const a1 = angle, a2 = angle + sweep;
    angle = a2;
    const large = sweep > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
    const d = innerR > 0
      ? `M${cx + innerR * Math.cos(a1)},${cy + innerR * Math.sin(a1)} L${x1},${y1} A${r},${r},0,${large},1,${x2},${y2} L${cx + innerR * Math.cos(a2)},${cy + innerR * Math.sin(a2)} A${innerR},${innerR},0,${large},0,${cx + innerR * Math.cos(a1)},${cy + innerR * Math.sin(a1)} Z`
      : `M${cx},${cy} L${x1},${y1} A${r},${r},0,${large},1,${x2},${y2} Z`;
    return <path key={i} d={d} fill={colors[i % colors.length]} stroke="white" strokeWidth={1.5} />;
  });
}

function ChartMiniPreview({ chartType, chartData, config }) {
  const colors = COLORS[config?.colorTheme] || COLORS.blue;
  const [c0, c1, c2] = colors;
  const values = chartData?.values?.length ? chartData.values : [60, 90, 70, 110, 85];
  const maxH = H - 28;
  const pad = 18;

  // ── Bar / Histogram ──
  if (chartType === 'bar' || chartType === 'histogram') {
    const n = Math.min(values.length, 8);
    const gap = (W - pad * 2) / n;
    const barW = gap * 0.55;
    const hs = normalize(values.slice(0, n), maxH);
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <line x1={pad} y1={H - 14} x2={W - pad} y2={H - 14} {...AXIS_LINE} />
        {hs.map((bh, i) => (
          <rect key={i}
            x={pad + i * gap + (gap - barW) / 2} y={H - 14 - bh}
            width={barW} height={bh}
            rx={chartType === 'histogram' ? 0 : 3}
            fill={c0} opacity={0.75 + (i / n) * 0.25}
          />
        ))}
      </svg>
    );
  }

  // ── Horizontal bar ──
  if (chartType === 'horizontalBar') {
    const n = Math.min(values.length, 5);
    const maxV = Math.max(...values.slice(0, n), 1);
    const rowH = (H - 20) / n;
    const barH = rowH * 0.5;
    const maxBW = W - 60;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {values.slice(0, n).map((v, i) => (
          <rect key={i}
            x={50} y={10 + i * rowH + (rowH - barH) / 2}
            width={(v / maxV) * maxBW} height={barH}
            rx={3} fill={c0} opacity={0.7 + (i / n) * 0.3}
          />
        ))}
      </svg>
    );
  }

  // ── Stacked / Percent bar ──
  if (chartType === 'stackedBar' || chartType === 'percentBar') {
    const series = chartData?.series || [
      { values: [50, 70, 55, 90] },
      { values: [40, 50, 60, 40] },
    ];
    const n = Math.min((series[0]?.values || []).length, 7);
    const gap = (W - pad * 2) / n;
    const barW = gap * 0.55;
    const totals = Array.from({ length: n }, (_, ci) =>
      series.reduce((s, sr) => s + (sr.values[ci] || 0), 0)
    );
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <line x1={pad} y1={H - 14} x2={W - pad} y2={H - 14} {...AXIS_LINE} />
        {Array.from({ length: n }, (_, i) => {
          const x = pad + i * gap + (gap - barW) / 2;
          const denom = chartType === 'percentBar' ? totals[i] : Math.max(...totals, 1);
          let y = H - 14;
          return series.map((sr, si) => {
            const bh = ((sr.values[i] || 0) / denom) * maxH;
            y -= bh;
            return (
              <rect key={`${i}-${si}`}
                x={x} y={y} width={barW} height={bh}
                rx={si === series.length - 1 ? 2 : 0}
                fill={colors[si % colors.length]}
              />
            );
          });
        })}
      </svg>
    );
  }

  // ── Combo ──
  if (chartType === 'combo') {
    const series = chartData?.series || [
      { values: [50, 80, 60, 95, 70] },
      { values: [35, 55, 75, 45, 80] },
    ];
    const barVals = series[0]?.values || values;
    const lineVals = series[1]?.values || values;
    const n = Math.min(barVals.length, 7);
    const gap = (W - pad * 2) / n;
    const barW = gap * 0.4;
    const maxAll = Math.max(...barVals.slice(0, n), ...lineVals.slice(0, n), 1);
    const linePts = lineVals.slice(0, n).map((v, i) => [
      pad + i * gap + gap / 2,
      H - 14 - (v / maxAll) * maxH,
    ]);
    const lineD = linePts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <line x1={pad} y1={H - 14} x2={W - pad} y2={H - 14} {...AXIS_LINE} />
        {barVals.slice(0, n).map((v, i) => (
          <rect key={i}
            x={pad + i * gap + (gap - barW) / 2}
            y={H - 14 - (v / maxAll) * maxH}
            width={barW} height={(v / maxAll) * maxH}
            rx={2} fill={c0} opacity={0.75}
          />
        ))}
        <path d={lineD} fill="none" stroke={c2 || c1} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {linePts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={3} fill={c2 || c1} />)}
      </svg>
    );
  }

  // ── Line ──
  if (chartType === 'line') {
    const n = Math.min(values.length, 9);
    const xStep = (W - pad * 2) / (n - 1 || 1);
    const hs = normalize(values.slice(0, n), maxH);
    const pts = hs.map((h, i) => [pad + i * xStep, H - 14 - h]);
    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <line x1={pad} y1={H - 14} x2={W - pad} y2={H - 14} {...AXIS_LINE} />
        <path d={d} fill="none" stroke={c0} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={3} fill={c0} />)}
      </svg>
    );
  }

  // ── Area ──
  if (chartType === 'area') {
    const n = Math.min(values.length, 9);
    const xStep = (W - pad * 2) / (n - 1 || 1);
    const hs = normalize(values.slice(0, n), maxH);
    const pts = hs.map((h, i) => [pad + i * xStep, H - 14 - h]);
    const lineD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    const areaD = `${lineD} L${pts[pts.length - 1][0]},${H - 14} L${pts[0][0]},${H - 14} Z`;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <line x1={pad} y1={H - 14} x2={W - pad} y2={H - 14} {...AXIS_LINE} />
        <path d={areaD} fill={c0} opacity={0.2} />
        <path d={lineD} fill="none" stroke={c0} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={3} fill={c0} />)}
      </svg>
    );
  }

  // ── Pie ──
  if (chartType === 'pie') {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {pieSlices(values, W / 2, H / 2, Math.min(W, H) * 0.38, 0, colors)}
      </svg>
    );
  }

  // ── Donut ──
  if (chartType === 'donut') {
    const r = Math.min(W, H) * 0.38;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {pieSlices(values, W / 2, H / 2, r, r * 0.5, colors)}
      </svg>
    );
  }

  // ── Radar ──
  if (chartType === 'radar') {
    const cx = W / 2, cy = H / 2 + 4;
    const r = Math.min(W, H) * 0.36;
    const n = Math.min(values.length, 6);
    const maxV = Math.max(...values.slice(0, n), 1);
    const angle = (i) => (i / n) * Math.PI * 2 - Math.PI / 2;
    const bgPts = Array.from({ length: n }, (_, i) => `${cx + r * Math.cos(angle(i))},${cy + r * Math.sin(angle(i))}`).join(' ');
    const dataPts = values.slice(0, n).map((v, i) => {
      const rr = (v / maxV) * r;
      return `${cx + rr * Math.cos(angle(i))},${cy + rr * Math.sin(angle(i))}`;
    }).join(' ');
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <polygon points={bgPts} fill="none" stroke={c0} strokeOpacity={0.15} strokeWidth={1} />
        <polygon points={dataPts} fill={c0} fillOpacity={0.25} stroke={c0} strokeWidth={2} />
      </svg>
    );
  }

  // ── Scatter ──
  if (chartType === 'scatter') {
    const pts = (chartData?.scatterPoints || [{ x: 10, y: 20 }, { x: 30, y: 45 }, { x: 55, y: 15 }, { x: 70, y: 60 }, { x: 85, y: 35 }]);
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <line x1={pad} y1={pad} x2={pad} y2={H - pad} {...AXIS_LINE} />
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} {...AXIS_LINE} />
        {pts.map((p, i) => (
          <circle key={i}
            cx={pad + (p.x / 100) * (W - pad * 2)}
            cy={H - pad - (p.y / 100) * (H - pad * 2)}
            r={5} fill={c0} opacity={0.85}
          />
        ))}
      </svg>
    );
  }

  // ── Bubble ──
  if (chartType === 'bubble') {
    const pts = (chartData?.bubblePoints || [{ x: 10, y: 20, size: 30 }, { x: 30, y: 45, size: 50 }, { x: 55, y: 15, size: 20 }, { x: 70, y: 60, size: 40 }, { x: 85, y: 35, size: 25 }]);
    const maxSz = Math.max(...pts.map((p) => p.size), 1);
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <line x1={pad} y1={pad} x2={pad} y2={H - pad} {...AXIS_LINE} />
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} {...AXIS_LINE} />
        {pts.map((p, i) => (
          <circle key={i}
            cx={pad + (p.x / 100) * (W - pad * 2)}
            cy={H - pad - (p.y / 100) * (H - pad * 2)}
            r={4 + (p.size / maxSz) * 16} fill={c0} opacity={0.6}
          />
        ))}
      </svg>
    );
  }

  // ── Heatmap ──
  if (chartType === 'heatmap') {
    const rows = (chartData?.heatmapRows || ['A', 'B', 'C', 'D']).slice(0, 5);
    const cols = (chartData?.heatmapCols || ['1', '2', '3', '4', '5']).slice(0, 6);
    const vals = chartData?.heatmapValues || rows.map(() => cols.map((_, ci) => (ci + 1) * 15));
    const flat = vals.flat();
    const minV = Math.min(...flat), maxV = Math.max(...flat, minV + 1);
    const cellW = (W - 20) / cols.length, cellH = (H - 16) / rows.length;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {rows.map((_, ri) => cols.map((_, ci) => {
          const v = vals[ri]?.[ci] ?? 0;
          const t = (v - minV) / (maxV - minV);
          return (
            <rect key={`${ri}-${ci}`}
              x={10 + ci * cellW + 1} y={8 + ri * cellH + 1}
              width={cellW - 2} height={cellH - 2}
              rx={2} fill={c0} opacity={0.15 + t * 0.85}
            />
          );
        }))}
      </svg>
    );
  }

  // ── Treemap ──
  if (chartType === 'treemap') {
    const n = Math.min(values.length, 6);
    const total = values.slice(0, n).reduce((s, v) => s + v, 0) || 1;
    let x = 8;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {values.slice(0, n).map((v, i) => {
          const w = (v / total) * (W - 16) - 2;
          const el = <rect key={i} x={x} y={8} width={w} height={H - 16} rx={3} fill={colors[i % colors.length]} opacity={0.85} />;
          x += w + 2;
          return el;
        })}
      </svg>
    );
  }

  // ── Funnel ──
  if (chartType === 'funnel') {
    const n = Math.min(values.length, 5);
    const sorted = [...values.slice(0, n)].sort((a, b) => b - a);
    const maxV = sorted[0] || 1;
    const segH = (H - 16) / n;
    const maxW = W - 32;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {sorted.map((v, i) => {
          const w = (v / maxV) * maxW;
          return (
            <rect key={i}
              x={(W - w) / 2} y={8 + i * segH}
              width={w} height={segH - 3}
              rx={2} fill={colors[i % colors.length]} opacity={0.85}
            />
          );
        })}
      </svg>
    );
  }

  // ── Boxplot ──
  if (chartType === 'boxplot') {
    const bv = chartData?.boxValues || [[5, 25, 45, 65, 90], [10, 30, 50, 70, 95], [15, 25, 40, 60, 85], [8, 20, 38, 58, 80]];
    const n = Math.min(bv.length, 6);
    const gap = (W - pad * 2) / n;
    const bw = gap * 0.45;
    const sy = (v) => H - 14 - (v / 100) * maxH;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <line x1={pad} y1={H - 14} x2={W - pad} y2={H - 14} {...AXIS_LINE} />
        {bv.slice(0, n).map((box, i) => {
          const [mn, q1, med, q3, mx] = box;
          const cx = pad + i * gap + gap / 2;
          return (
            <g key={i}>
              <line x1={cx} y1={sy(mx)} x2={cx} y2={sy(mn)} stroke={c0} strokeWidth={1.5} />
              <line x1={cx - bw / 2} y1={sy(mx)} x2={cx + bw / 2} y2={sy(mx)} stroke={c0} strokeWidth={1.5} />
              <line x1={cx - bw / 2} y1={sy(mn)} x2={cx + bw / 2} y2={sy(mn)} stroke={c0} strokeWidth={1.5} />
              <rect x={cx - bw / 2} y={sy(q3)} width={bw} height={sy(q1) - sy(q3)} fill={c0} opacity={0.25} stroke={c0} strokeWidth={1.5} />
              <line x1={cx - bw / 2} y1={sy(med)} x2={cx + bw / 2} y2={sy(med)} stroke={c0} strokeWidth={2.5} />
            </g>
          );
        })}
      </svg>
    );
  }

  // ── Sunburst ──
  if (chartType === 'sunburst') {
    const sd = chartData?.sunburstData || [
      { value: 40, children: [{ value: 20 }, { value: 20 }] },
      { value: 35, children: [{ value: 15 }, { value: 20 }] },
      { value: 25, children: [{ value: 10 }, { value: 15 }] },
    ];
    const cx = W / 2, cy = H / 2;
    const r1 = 28, r2 = 46, r3 = 62;
    const total = sd.reduce((s, d) => s + d.value, 0) || 1;
    const slices = [];
    let a = -Math.PI / 2;
    sd.forEach((root, ri) => {
      const sweep = (root.value / total) * Math.PI * 2;
      const a2 = a + sweep;
      const lg = sweep > Math.PI ? 1 : 0;
      const mk = (r, a1, a2) => `M${cx + r1 * Math.cos(a1)},${cy + r1 * Math.sin(a1)} L${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)} A${r},${r},0,${lg},1,${cx + r * Math.cos(a2)},${cy + r * Math.sin(a2)} L${cx + r1 * Math.cos(a2)},${cy + r1 * Math.sin(a2)} A${r1},${r1},0,${lg},0,${cx + r1 * Math.cos(a1)},${cy + r1 * Math.sin(a1)} Z`;
      slices.push(<path key={`o${ri}`} d={mk(r3, a, a2)} fill={colors[ri % colors.length]} opacity={0.85} stroke="white" strokeWidth={1} />);
      // inner ring per child
      const children = root.children || [];
      const childTotal = children.reduce((s, c) => s + c.value, 0) || 1;
      let ca = a;
      children.forEach((child, ci) => {
        const cs = (child.value / childTotal) * sweep;
        const ca2 = ca + cs;
        const clg = cs > Math.PI ? 1 : 0;
        const cd = `M${cx + r1 * Math.cos(ca)},${cy + r1 * Math.sin(ca)} L${cx + r2 * Math.cos(ca)},${cy + r2 * Math.sin(ca)} A${r2},${r2},0,${clg},1,${cx + r2 * Math.cos(ca2)},${cy + r2 * Math.sin(ca2)} L${cx + r1 * Math.cos(ca2)},${cy + r1 * Math.sin(ca2)} A${r1},${r1},0,${clg},0,${cx + r1 * Math.cos(ca)},${cy + r1 * Math.sin(ca)} Z`;
        slices.push(<path key={`i${ri}-${ci}`} d={cd} fill={colors[ri % colors.length]} opacity={0.45} stroke="white" strokeWidth={0.5} />);
        ca = ca2;
      });
      a = a2;
    });
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <circle cx={cx} cy={cy} r={r1} fill={c0} opacity={0.08} />
        {slices}
      </svg>
    );
  }

  // ── Fallback ──
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <circle cx={W / 2} cy={H / 2} r={38} fill={c0} opacity={0.15} />
      <circle cx={W / 2} cy={H / 2} r={22} fill={c0} opacity={0.3} />
    </svg>
  );
}

export default ChartMiniPreview;
