/** 伺服电机详情页 mock 数据与生成器（与设计稿 P05 2伺服综合健康详情.html 保持一致） */

export const RATED_TORQUE = 35.8;
export const CYCLES_COUNT = 30;
export const PAGE_SIZE = 5;
export const WARNING_PAGE_SIZE = 10;
export const HEALTH_PAGE_SIZE = 10;

/** 设计稿默认设备名称 */
export const DEFAULT_MOTOR_NAME = '120EL01升降机';

export interface ThresholdSet {
  mild: number;
  moderate: number;
  severe: number;
}

export interface ThresholdConfig {
  torque: ThresholdSet;
  speed: ThresholdSet;
  position: ThresholdSet;
}

/** 与设计稿 thresholds 变量一致 */
export const DEFAULT_THRESHOLDS: ThresholdConfig = {
  torque: { mild: 40, moderate: 55, severe: 70 },
  speed: { mild: 800, moderate: 1200, severe: 1600 },
  position: { mild: 600, moderate: 750, severe: 900 },
};

/** 与设计稿 mockRealTime 初始值一致 */
export const DESIGN_INITIAL_REALTIME: RealTimeState = {
  actualSpeed: 0,
  actualPosition: 245.6,
  actualTorque: 35.0,
  faultFlag: false,
  brakeOpen: true,
  runningReady: true,
  outputEnabled: true,
  motorRotating: false,
};

/** 设计稿 updateHealthScoreCard 固定子项得分 */
export const DESIGN_SUB_SCORES = {
  performanceScore: 86,
  statusScore: 100,
  lifeScore: 60,
};

export interface RealTimeState {
  actualSpeed: number;
  actualPosition: number;
  actualTorque: number;
  faultFlag: boolean;
  brakeOpen: boolean;
  runningReady: boolean;
  outputEnabled: boolean;
  motorRotating: boolean;
}

export interface NameplateInfo {
  controller: { label: string; value: string }[];
  motor: { label: string; value: string }[];
}

export interface CycleTrendDetail {
  timestamps: string[];
  speeds: number[];
  positions: number[];
  torques: number[];
  peakTorqueVal: number;
}

export interface CycleRecord {
  id: number;
  index: number;
  startTime: string;
  endTime: string;
  rawStart: Date;
  rawEnd: Date;
  peakTorque: number;
  peakSpeed: number;
  trend: CycleTrendDetail;
}

export interface GanttInterval {
  start: Date;
  end: Date;
  startStr: string;
  endStr: string;
}

export interface WarningRecord {
  param: string;
  value: string;
  level: string;
  timeStr: string;
  timestamp: number;
}

export interface DailyHealthRecord {
  date: string;
  maxPeak: number;
  score: number;
  level: string;
  performance: number;
  status: number;
  life: number;
  riskFactor: string;
}

export interface HealthScoreSummary {
  overallScore: number;
  overallGrade: string;
  diagnosisTime: string;
  performanceScore: number;
  statusScore: number;
  lifeScore: number;
}

export type WarningLevel = '正常' | '轻度' | '中度' | '严重';

export const getLevel = (value: number, th: ThresholdSet): WarningLevel => {
  if (value >= th.severe) return '严重';
  if (value >= th.moderate) return '中度';
  if (value >= th.mild) return '轻度';
  return '正常';
};

export const getGradeFromScore = (score: number): string => {
  if (score > 85) return '健康';
  if (score >= 60) return '良好';
  if (score >= 40) return '警告';
  return '严重';
};

/** 设计稿 renderNameplate() 硬编码铭牌（所有设备相同） */
export const DESIGN_NAMEPLATE: NameplateInfo = {
  controller: [
    { label: '型号', value: 'MDX61B0055-5A3-4-00' },
    { label: '供电电压 [V]', value: '三相 380-500 ± 10%' },
    { label: '输入频率 [Hz]', value: '50-60 ± 5%' },
    { label: '输出频率 [Hz]', value: '0-400' },
    { label: '额定输出电流', value: '2A' },
    { label: '推荐电机功率 [kW]', value: '5.5kW' },
  ],
  motor: [
    { label: '型号', value: 'R87DRV132S4BE5' },
    { label: '减速机', value: 'R87' },
    { label: '制动器', value: 'BE5' },
    { label: '额定功率', value: '5.5kW' },
    { label: '额定转矩', value: '36.2 Nm' },
    { label: '额定转速', value: '1450 rpm' },
    { label: '额定电压', value: '380V / 400V (三相)' },
    { label: '额定电流', value: '10.5 A' },
    { label: '额定频率', value: '50 Hz' },
  ],
};

export const getNameplateInfo = (): NameplateInfo => DESIGN_NAMEPLATE;

export const getInitialRealTimeState = (): RealTimeState => ({ ...DESIGN_INITIAL_REALTIME });

/** 设计稿 updateRealTimeDisplay() */
export const tickRealTimeState = (prev: RealTimeState): RealTimeState => {
  const rotating = Math.sin(Date.now() / 1000 * 0.5) > 0.2;
  let torque = 25 + Math.random() * 45;
  if (rotating && prev.actualSpeed > 300) torque += Math.random() * 40;
  if (Math.random() < 0.1) torque += 50;
  return {
    ...prev,
    actualSpeed: rotating ? 350 + Math.floor(Math.random() * 180) : 0,
    actualPosition: (prev.actualPosition + (rotating ? Math.random() * 3 : 0.2)) % 1250,
    motorRotating: rotating,
    actualTorque: Math.min(145, Math.max(15, torque)),
  };
};

/** 设计稿 updateHealthScoreCard() */
export const getHealthScoreSummary = (cycles: CycleRecord[]): HealthScoreSummary => {
  const now = new Date();
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  if (!cycles.length) {
    return {
      overallScore: 100,
      overallGrade: '健康',
      diagnosisTime: timeStr,
      ...DESIGN_SUB_SCORES,
    };
  }

  const maxPeak = Math.max(...cycles.map((c) => c.peakTorque));
  const ratio = maxPeak / RATED_TORQUE;
  let score = 100;
  if (ratio <= 1) score = 100;
  else if (ratio <= 1.5) score = Math.max(0, 100 - (ratio - 1) * 100);
  else if (ratio <= 2) score = Math.max(0, 100 - (ratio - 1) * 100);
  else score = Math.max(0, 100 - (ratio - 1) * 100);
  score = Math.floor(score);

  return {
    overallScore: score,
    overallGrade: getGradeFromScore(score),
    diagnosisTime: timeStr,
    performanceScore: DESIGN_SUB_SCORES.performanceScore,
    statusScore: DESIGN_SUB_SCORES.statusScore,
    lifeScore: DESIGN_SUB_SCORES.lifeScore,
  };
};

/** 设计稿 generateCycleDetails() */
const generateCycleDetails = (
  start: Date,
  end: Date,
  base: number,
  speedFactor = 1,
): CycleTrendDetail => {
  const s = start.getTime();
  const e = end.getTime();
  const dur = e - s;
  const timestamps: string[] = [];
  const speeds: number[] = [];
  const positions: number[] = [];
  const torques: number[] = [];

  for (let i = 0; i <= 40; i += 1) {
    const r = i / 40;
    timestamps.push(new Date(s + dur * r).toLocaleTimeString());
    let spd = 0;
    if (r < 0.2) spd = 1200 * (r / 0.2) * speedFactor;
    else if (r < 0.8) spd = (1200 + 400 * Math.sin(((r - 0.2) / 0.6) * Math.PI)) * speedFactor;
    else spd = 1600 * (1 - (r - 0.8) / 0.2) * speedFactor;
    spd = Math.min(1850, Math.max(0, spd + Math.random() * 20 - 10));
    speeds.push(Math.round(spd));
    positions.push(Math.round((850 * r + (Math.random() * 5 - 2.5)) * 10) / 10);
    let torque = base + 12 * Math.sin(r * Math.PI * 3);
    if (r > 0.45 && r < 0.55) torque += 28;
    if (r > 0.85) torque -= 10;
    torque += Math.random() * 4 - 2;
    torques.push(Math.round(Math.min(145, Math.max(12, torque)) * 10) / 10);
  }
  return { timestamps, speeds, positions, torques, peakTorqueVal: Math.max(...torques) };
};

/** 设计稿 buildMockCycles() */
export const buildMockCycles = (): CycleRecord[] => {
  const cycles: CycleRecord[] = [];
  const now = new Date();

  for (let i = 1; i <= CYCLES_COUNT; i += 1) {
    const start = new Date(
      now.getTime() - (CYCLES_COUNT - i) * 2.5 * 3600 * 1000 - (i % 3) * 20 * 60000,
    );
    const end = new Date(start.getTime() + (8 + Math.floor(Math.random() * 18)) * 60 * 1000);
    const speedFactor = 0.8 + Math.random() * 0.4;
    const det = generateCycleDetails(start, end, 38 + (i % 5) * 6, speedFactor);
    cycles.push({
      id: i,
      index: i,
      startTime: start.toLocaleString('zh-CN'),
      endTime: end.toLocaleString('zh-CN'),
      rawStart: start,
      rawEnd: end,
      peakTorque: det.peakTorqueVal,
      peakSpeed: Math.max(...det.speeds),
      trend: det,
    });
  }
  cycles.sort((a, b) => a.rawStart.getTime() - b.rawStart.getTime());
  cycles.forEach((c, i) => {
    c.index = i + 1;
    c.id = i + 1;
  });
  return cycles;
};

/** 设计稿 genIntervals() */
export const genGanttIntervals = (): GanttInterval[] => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
  let cur = start.getTime();
  const arr: GanttInterval[] = [];

  for (let i = 0; i < 50 && cur + 120000 < end.getTime(); i += 1) {
    const idle = 1 + Math.random() * 24;
    cur += idle * 60000;
    if (cur + 120000 > end.getTime()) break;
    const run = 2 + Math.random() * 43;
    const s = new Date(cur);
    const e = new Date(cur + run * 60000);
    if (e > end) break;
    arr.push({
      start: s,
      end: e,
      startStr: s.toLocaleTimeString(),
      endStr: e.toLocaleTimeString(),
    });
    cur = e.getTime();
  }
  return arr;
};

/** 设计稿 generateSampleWarnings() */
export const generateSampleWarnings = (): WarningRecord[] => {
  const now = Date.now();
  const oneDay = 86400000;
  const samples: WarningRecord[] = [];

  for (let day = 0; day < 7; day += 1) {
    for (const p of ['转矩/推力', '反馈速度', '反馈位置']) {
      for (const l of ['轻度', '中度', '严重']) {
        let val: number;
        let unit: string;
        if (p === '转矩/推力') {
          val = (l === '轻度' ? 45 : l === '中度' ? 65 : 85) + Math.random() * 10;
          unit = ' Nm';
        } else if (p === '反馈速度') {
          val = (l === '轻度' ? 850 : l === '中度' ? 1300 : 1700) + Math.random() * 100;
          unit = ' rpm';
        } else {
          val = (l === '轻度' ? 620 : l === '中度' ? 800 : 950) + Math.random() * 50;
          unit = ' mm';
        }
        const ts = now - day * oneDay - Math.random() * oneDay;
        samples.push({
          param: p,
          value: `${val.toFixed(1)}${unit}`,
          level: l,
          timeStr: new Date(ts).toLocaleString('zh-CN'),
          timestamp: ts,
        });
      }
    }
  }
  samples.sort((a, b) => b.timestamp - a.timestamp);
  return samples;
};

/** 设计稿 generateDailyHealthData() */
export const generateDailyHealthData = (days = 90): DailyHealthRecord[] => {
  const data: DailyHealthRecord[] = [];
  const today = new Date();

  for (let i = days; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);
    let maxPeak = 25 + Math.random() * 85;
    if (i < 7) maxPeak += Math.random() * 15 - 5;
    if (i > 20) maxPeak += Math.random() * 10;
    maxPeak = Math.min(110, Math.max(20, maxPeak));

    const ratio = maxPeak / RATED_TORQUE;
    let score = 100;
    let level = '健康';
    if (ratio <= 1) {
      score = 100;
      level = '健康';
    } else if (ratio <= 1.5) {
      score = Math.max(0, 100 - (ratio - 1) * 100);
      level = '良好';
    } else if (ratio <= 2) {
      score = Math.max(0, 100 - (ratio - 1) * 100);
      level = '警告';
    } else {
      score = Math.max(0, 100 - (ratio - 1) * 100);
      level = '严重';
    }
    score = Math.floor(score);

    const performanceScore = Math.max(
      0,
      Math.min(100, Math.round(100 - (ratio - 0.8) * 70 + Math.random() * 8 - 4)),
    );
    const statusScore = Math.max(0, Math.min(100, Math.round(100 - Math.random() * 12)));
    const usageRatio = (25 + i * 0.15) / 100;
    const lifeScore = Math.max(0, Math.min(100, Math.round((1 - usageRatio) * 100)));

    const riskScores = [
      { name: '转矩/推力峰值', score: Math.round(Math.min(100, ratio * 45)) },
      { name: '反馈速度峰值', score: Math.round(Math.min(100, 30 + Math.random() * 50)) },
      { name: '近期预警频率', score: Math.round(Math.min(100, Math.random() * 30)) },
      { name: '剩余寿命比例', score: Math.round(usageRatio * 100) },
    ];
    riskScores.sort((a, b) => b.score - a.score);

    data.push({
      date: dateStr,
      maxPeak,
      score,
      level,
      performance: performanceScore,
      status: statusScore,
      life: lifeScore,
      riskFactor: riskScores[0].name,
    });
  }
  return data.sort((a, b) => a.date.localeCompare(b.date));
};

export const filterCyclesByDate = (
  cycles: CycleRecord[],
  start: Date | null,
  end: Date | null,
): CycleRecord[] => {
  if (!start && !end) return cycles;
  return cycles.filter((c) => {
    if (start && c.rawStart < start) return false;
    if (end && c.rawStart > end) return false;
    return true;
  });
};

export const filterWarningsByDate = (
  records: WarningRecord[],
  startTs: number | null,
  endTs: number | null,
): WarningRecord[] => {
  let filtered = [...records];
  if (startTs) filtered = filtered.filter((w) => w.timestamp >= startTs);
  if (endTs) {
    const end = new Date(endTs);
    end.setHours(23, 59, 59, 999);
    filtered = filtered.filter((w) => w.timestamp <= end.getTime());
  }
  return filtered;
};

/** 设计稿阈值弹窗默认值 */
export const THRESHOLD_MODAL_DEFAULTS = {
  torqueMild: 40,
  torqueModerate: 55,
  torqueSevere: 70,
  speedMild: 800,
  speedModerate: 1200,
  speedSevere: 1600,
  posMild: 600,
  posModerate: 750,
  posSevere: 900,
};
