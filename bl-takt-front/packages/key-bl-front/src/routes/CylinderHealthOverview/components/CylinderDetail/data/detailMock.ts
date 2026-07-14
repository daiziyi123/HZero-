import moment from 'moment';

const round = (v: number, d = 3) => Math.round(v * 10 ** d) / 10 ** d;

/** 06-06 ~ 07-06 共 31 天 */
export const detailDates = Array.from({ length: 31 }, (_, i) =>
  moment('2026-06-06').add(i, 'days').format('MM-DD'),
);

export interface DurationPoint {
  max: number;
  avg: number;
  min: number;
}

export interface ThresholdLine {
  label: string;
  value: number;
  color: string;
  dashed?: boolean;
}

export const clampThresholds: ThresholdLine[] = [
  { label: '严重', value: 1.05, color: '#dc2626', dashed: true },
  { label: '中等', value: 0.95, color: '#ea580c', dashed: true },
  { label: '轻微', value: 0.7, color: '#eab308', dashed: true },
  { label: '正常', value: 0.55, color: '#3b82f6', dashed: false },
];

export const releaseThresholds: ThresholdLine[] = [
  { label: '严重', value: 1.02, color: '#dc2626', dashed: true },
  { label: '中等', value: 0.92, color: '#ea580c', dashed: true },
  { label: '轻微', value: 0.68, color: '#eab308', dashed: true },
  { label: '正常', value: 0.52, color: '#3b82f6', dashed: false },
];

const buildDurationSeries = (baseMax: number, baseAvg: number, baseMin: number): DurationPoint[] =>
  detailDates.map((_, i) => {
    const wave = Math.sin(i * 0.75) * 0.04 + Math.cos(i * 0.3) * 0.02;
    return {
      max: round(baseMax + wave + 0.05),
      avg: round(baseAvg + wave),
      min: round(baseMin + wave - 0.025),
    };
  });

export const clampDurationTrend = buildDurationSeries(1.08, 1.02, 0.97);
export const releaseDurationTrend = buildDurationSeries(1.02, 0.96, 0.91);

export interface BoxPlotItem {
  name: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

export const actionBoxPlotData: BoxPlotItem[] = [
  { name: '夹紧', min: 0.86, q1: 0.95, median: 1.02, q3: 1.08, max: 1.15 },
  { name: '松开', min: 0.82, q1: 0.9, median: 0.96, q3: 1.02, max: 1.1 },
];

export interface DailyActionRow {
  date: string;
  actionType: '夹紧' | '松开';
  avgDuration: number;
  maxDuration: number;
  minDuration: number;
  operation: string;
}

export const dailyActionStats: DailyActionRow[] = detailDates.flatMap((date, i) => {
  const clamp = clampDurationTrend[i];
  const release = releaseDurationTrend[i];
  return [
    {
      date,
      actionType: '夹紧',
      avgDuration: clamp.avg,
      maxDuration: clamp.max,
      minDuration: clamp.min,
      operation: '日趋势',
    },
    {
      date,
      actionType: '松开',
      avgDuration: release.avg,
      maxDuration: release.max,
      minDuration: release.min,
      operation: '日趋势',
    },
  ];
});

export interface DailyAlarmStat {
  date: string;
  clampTimeout: number;
  releaseTimeout: number;
  total: number;
}

export const dailyAlarmStats: DailyAlarmStat[] = detailDates.map((date, i) => {
  const clampTimeout = Math.round(12 + Math.sin(i * 0.9) * 6 + (i % 5));
  const releaseTimeout = Math.round(8 + Math.cos(i * 0.7) * 5 + (i % 3));
  return { date, clampTimeout, releaseTimeout, total: clampTimeout + releaseTimeout };
});

export const alarmSummary = {
  clampTimeout: dailyAlarmStats.reduce((s, d) => s + d.clampTimeout, 0),
  releaseTimeout: dailyAlarmStats.reduce((s, d) => s + d.releaseTimeout, 0),
  get total() {
    return this.clampTimeout + this.releaseTimeout;
  },
};

export interface AlarmListItem {
  id: number;
  alarmType: '夹紧超时' | '松开超时';
  alarmTime: string;
  description: string;
}

const alarmDescriptions = {
  夹紧超时: '夹紧到位信号超时',
  松开超时: '松开到位信号超时',
};

export const alarmListItems: AlarmListItem[] = Array.from({ length: 66 }, (_, i) => {
  const type: '夹紧超时' | '松开超时' = i % 3 === 0 ? '松开超时' : '夹紧超时';
  const day = moment('2026-07-06').subtract(Math.floor(i / 3), 'days');
  return {
    id: i + 1,
    alarmType: type,
    alarmTime: day.format('YYYY-MM-DD HH:mm:ss'),
    description: alarmDescriptions[type],
  };
});

export interface HealthMonitorRow {
  date: string;
  healthLevel: string;
  healthScore: number;
  perfScore: number;
  stateScore: number;
  lifeScore: number;
  mainRiskFactors: string;
}

export const healthMonitorDetails: HealthMonitorRow[] = detailDates.map((date, i) => {
  const wave = Math.sin(i * 0.6) * 4;
  const base = 30 - i * 0.15;
  return {
    date,
    healthLevel: '严重',
    healthScore: round(base + wave, 1),
    perfScore: Math.round(36 + Math.sin(i * 0.5) * 4),
    stateScore: 0,
    lifeScore: Math.round(26 - i * 0.12 + Math.cos(i) * 2),
    mainRiskFactors: '近满程报警频率高',
  };
});

export interface HealthTrendPoint {
  date: string;
  hiScore: number;
  perfScore: number;
  stateScore: number;
  lifeScore: number;
}

export const healthTrendPoints: HealthTrendPoint[] = healthMonitorDetails.map((row) => ({
  date: row.date,
  hiScore: row.healthScore,
  perfScore: row.perfScore,
  stateScore: row.stateScore,
  lifeScore: row.lifeScore,
}));
