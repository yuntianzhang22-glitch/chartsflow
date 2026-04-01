const CHARTS_KEY = 'cf_guest_charts';
const DEVICE_KEY = 'cf_device_id';
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function getDeviceId() {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

export function getGuestCharts() {
  try {
    const raw = localStorage.getItem(CHARTS_KEY);
    if (!raw) return [];
    const charts = JSON.parse(raw);
    const now = Date.now();
    const valid = charts.filter(
      (c) => now - new Date(c.created_at).getTime() < TTL_MS
    );
    if (valid.length !== charts.length) {
      localStorage.setItem(CHARTS_KEY, JSON.stringify(valid));
    }
    return valid;
  } catch {
    return [];
  }
}

export function saveGuestChart(chart) {
  const charts = getGuestCharts();
  const idx = charts.findIndex((c) => c.id === chart.id);
  const now = new Date().toISOString();
  const record = { ...chart, updated_at: now };
  if (idx >= 0) {
    charts[idx] = record;
  } else {
    record.created_at = now;
    charts.unshift(record);
  }
  localStorage.setItem(CHARTS_KEY, JSON.stringify(charts));
  return record;
}

export function updateGuestChart(id, updates) {
  const charts = getGuestCharts();
  const idx = charts.findIndex((c) => c.id === id);
  if (idx >= 0) {
    charts[idx] = { ...charts[idx], ...updates, updated_at: new Date().toISOString() };
    localStorage.setItem(CHARTS_KEY, JSON.stringify(charts));
  }
}

export function deleteGuestChart(id) {
  const charts = getGuestCharts().filter((c) => c.id !== id);
  localStorage.setItem(CHARTS_KEY, JSON.stringify(charts));
}
