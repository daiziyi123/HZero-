import { CylinderDeviceInfo } from '../../shared/equipmentHealth/types';
import { hiToHealthKey } from '../../shared/equipmentHealth/utils';

const healthLevelMeta = [
  { key: 'health', label: '健康', color: '#18a058' },
  { key: 'good', label: '良好', color: '#84cc16' },
  { key: 'warning', label: '警告', color: '#ea580c' },
  { key: 'critical', label: '严重', color: '#dc2626' },
];

export const buildHealthLevelOptions = (devices: CylinderDeviceInfo[]) =>
  healthLevelMeta.map((item) => ({
    ...item,
    count: devices.filter((d) => hiToHealthKey(d.healthIndex) === item.key).length,
  }));

export const lineOptions = ['全部产线', '侧围线', '主线', '顶盖线'];
export const stationOptions = ['全部工位', '压紧区', '定位区', '装配区'];
export const fixtureOptions = ['全部夹具', '侧围夹具', '压紧夹具', '定位夹具'];

/** 设计稿 6 条 CLAMP-CYL 假数据 */
export const cylinderDevices: CylinderDeviceInfo[] = [
  {
    id: 'clamp-cyl-01',
    name: 'CLAMP-CYL-01',
    zoneId: 'side-line',
    line: '侧围线',
    station: '压紧区',
    fixture: '侧围夹具',
    status: '严重',
    cylinderState: '松开',
    clampTimeRange: '11:45:48—11:45:51',
    totalDuration: '729859s',
    actionCount: '890,118',
    healthIndex: 25.8,
    lifeRate: 90.8,
  },
  {
    id: 'clamp-cyl-02',
    name: 'CLAMP-CYL-02',
    zoneId: 'side-line',
    line: '侧围线',
    station: '压紧区',
    fixture: '侧围夹具',
    status: '严重',
    cylinderState: '夹紧',
    clampTimeRange: '11:38:12—11:38:15',
    totalDuration: '715620s',
    actionCount: '872,340',
    healthIndex: 28.4,
    lifeRate: 88.5,
  },
  {
    id: 'clamp-cyl-03',
    name: 'CLAMP-CYL-03',
    zoneId: 'side-line',
    line: '侧围线',
    station: '定位区',
    fixture: '定位夹具',
    status: '警告',
    cylinderState: '夹紧',
    clampTimeRange: '11:36:45—11:36:48',
    totalDuration: '698430s',
    actionCount: '845,210',
    healthIndex: 42.6,
    lifeRate: 76.2,
  },
  {
    id: 'clamp-cyl-04',
    name: 'CLAMP-CYL-04',
    zoneId: 'main-line',
    line: '主线',
    station: '压紧区',
    fixture: '压紧夹具',
    status: '严重',
    cylinderState: '松开',
    clampTimeRange: '11:35:20—11:35:23',
    totalDuration: '682150s',
    actionCount: '820,560',
    healthIndex: 31.2,
    lifeRate: 85.3,
  },
  {
    id: 'clamp-cyl-05',
    name: 'CLAMP-CYL-05',
    zoneId: 'main-line',
    line: '主线',
    station: '装配区',
    fixture: '压紧夹具',
    status: '警告',
    cylinderState: '夹紧',
    clampTimeRange: '11:33:08—11:33:11',
    totalDuration: '665890s',
    actionCount: '798,420',
    healthIndex: 51.8,
    lifeRate: 68.4,
  },
  {
    id: 'clamp-cyl-06',
    name: 'CLAMP-CYL-06',
    zoneId: 'main-line',
    line: '顶盖线',
    station: '压紧区',
    fixture: '压紧夹具',
    status: '严重',
    cylinderState: '松开',
    clampTimeRange: '11:31:55—11:31:58',
    totalDuration: '648720s',
    actionCount: '775,890',
    healthIndex: 29.6,
    lifeRate: 91.2,
  },
];

/** 健康度统计（与设计稿一致，不含预警等级栏） */
export const healthLevelOptions = buildHealthLevelOptions(cylinderDevices);

export const findCylinderDevice = (deviceId: string) =>
  cylinderDevices.find((d) => d.id === deviceId);

export const statusToHealthKey = (device: Pick<CylinderDeviceInfo, 'healthIndex' | 'status'>) =>
  hiToHealthKey(device.healthIndex);

/** 气缸详情页设备信息（对齐设计稿 17 项） */
export interface CylinderDetailMeta {
  fixtureCode: string;
  fixtureName: string;
  groupNo: string;
  usage: string;
  brand: string;
  model: string;
  standardStroke: string;
  openAngle: string;
  clampTorque: string;
  bore: string;
  weight: string;
  valveCode: string;
  startDate: string;
  /** 标准日期（设计稿总览详情信息条使用） */
  standardDate: string;
  serviceYears: string;
  actionCount: string;
  designLife: string;
  alarmCount: string;
  detailTitle: string;
}

const defaultMeta: CylinderDetailMeta = {
  fixtureCode: 'H66-RF-005-KG01-000',
  fixtureName: '#10中型电控成型扩簧夹具',
  groupNo: 'Clamp_1',
  usage: '夹紧气缸',
  brand: 'SMC',
  model: 'MGPM25-100',
  standardStroke: '150mm，带磁性开关，使用气压：0.05~1.0MPa',
  openAngle: '5°~135°无级可调',
  clampTorque: '380Nm',
  bore: '63mm',
  weight: '7.9kg',
  valveCode: '#010KJ-1',
  startDate: '2023-05-12',
  standardDate: '2023-9-26',
  serviceYears: '2.8年',
  actionCount: '892,000',
  designLife: '980,000次',
  alarmCount: '176',
  detailTitle: 'H66-RF-005-KG01-000-Clamp_1-P17',
};

const cylinderDetailMeta: Record<string, CylinderDetailMeta> = {
  'clamp-cyl-01': { ...defaultMeta },
  'clamp-cyl-02': {
    ...defaultMeta,
    groupNo: 'Clamp_2',
    valveCode: '#010KJ-2',
    startDate: '2023-10-12',
    serviceYears: '2.7年',
    actionCount: '872,340',
    alarmCount: '142',
    detailTitle: 'H66-RF-005-KG01-000-Clamp_2-P18',
  },
  'clamp-cyl-03': {
    ...defaultMeta,
    brand: 'FESTO',
    model: 'DSBC-40-100',
    bore: '40mm',
    weight: '5.2kg',
    startDate: '2024-1-8',
    serviceYears: '2.5年',
    actionCount: '845,210',
    designLife: '900,000次',
    alarmCount: '98',
    detailTitle: 'H66-RF-006-KG02-000-Clamp_3-P21',
  },
  'clamp-cyl-04': {
    ...defaultMeta,
    model: 'CQ2B32-100',
    bore: '32mm',
    weight: '6.4kg',
    startDate: '2023-8-15',
    serviceYears: '2.9年',
    actionCount: '820,560',
    designLife: '950,000次',
    alarmCount: '155',
    detailTitle: 'H66-RF-007-KG01-000-Clamp_1-P25',
  },
  'clamp-cyl-05': {
    ...defaultMeta,
    brand: 'FESTO',
    model: 'DSNU-40-100',
    bore: '40mm',
    weight: '4.8kg',
    startDate: '2024-3-20',
    serviceYears: '2.3年',
    actionCount: '798,420',
    designLife: '880,000次',
    alarmCount: '76',
    detailTitle: 'H66-RF-008-KG03-000-Clamp_2-P28',
  },
  'clamp-cyl-06': {
    ...defaultMeta,
    groupNo: 'Clamp_3',
    valveCode: '#010KJ-3',
    startDate: '2023-11-5',
    serviceYears: '2.6年',
    actionCount: '775,890',
    alarmCount: '133',
    detailTitle: 'H66-RF-009-KG01-000-Clamp_3-P31',
  },
};

export const getCylinderDetailMeta = (deviceId: string): CylinderDetailMeta =>
  cylinderDetailMeta[deviceId] || defaultMeta;

/** 综合评分子项（性能/状态/寿命三类） */
export interface CylinderSubScore {
  label: string;
  value: number;
  color: string;
}

export const getCylinderSubScores = (device?: CylinderDeviceInfo): CylinderSubScore[] => [
  { label: '性能类', value: 86, color: '#3b82f6' },
  { label: '状态类', value: 100, color: '#18a058' },
  { label: '寿命类', value: Math.round(100 - (device?.lifeRate ?? 90.8) / 2.5), color: '#f59e0b' },
];

/** 健康度 HI 趋势多线（复用 HealthTrendChart） */
export const cylinderHealthTrendSeries = [
  { name: 'HI综合得分', color: '#3b82f6', base: 30, end: 16, showArea: true },
  { name: '性能类', color: '#f59e0b', base: 92, end: 86, symbol: 'diamond' },
  { name: '状态类', color: '#18a058', base: 100, end: 100, symbol: 'triangle' },
  { name: '寿命类', color: '#ef4444', base: 78, end: 60, symbol: 'rect' },
];

/** 动作趋势（夹紧/松开时长） */
export const cylinderActionTrendSeries = [
  { name: '夹紧时长(s)', color: '#3b82f6', base: 0.72, end: 0.84, showArea: true },
  { name: '松开时长(s)', color: '#f59e0b', base: 0.58, end: 0.67, symbol: 'diamond' },
];

/** 健康评分历史记录 */
export const cylinderHealthHistory = [
  { scoreDate: '2026/06/11', healthScore: '42.5', healthLevel: '警告', perfScore: '82', stateScore: '95', lifeScore: '68', mainRiskFactors: '动作超时2.1次/日，夹紧力波动3.5%，剩余寿命82000次' },
  { scoreDate: '2026/06/12', healthScore: '38.2', healthLevel: '警告', perfScore: '78', stateScore: '92', lifeScore: '66', mainRiskFactors: '动作超时2.8次/日，到位延时偏高，剩余寿命79500次' },
  { scoreDate: '2026/06/13', healthScore: '29.6', healthLevel: '严重', perfScore: '70', stateScore: '88', lifeScore: '64', mainRiskFactors: '响应超时增多，传感器信号缺失，剩余寿命75200次' },
  { scoreDate: '2026/06/14', healthScore: '22.4', healthLevel: '严重', perfScore: '62', stateScore: '85', lifeScore: '62', mainRiskFactors: '夹紧力不足，密封圈磨损，剩余寿命71000次' },
  { scoreDate: '2026/06/15', healthScore: '16.0', healthLevel: '严重', perfScore: '86', stateScore: '100', lifeScore: '60', mainRiskFactors: '寿命消耗90.8%，建议更换密封圈，剩余寿命68000次' },
];

/**
 * 生成总览详情页趋势假数据（默认 31 天：06-06 ~ 07-06）。
 * 围绕 base 做小幅正弦波动，模拟设计稿中平稳的曲线。
 */
const buildTrend = (base: number, amp: number, count = 31, precision = 2): number[] => {
  const factor = 10 ** precision;
  return Array.from({ length: count }, (_, i) => {
    const wave = Math.sin(i * 0.9) * amp + Math.cos(i * 0.35) * amp * 0.5;
    return Math.round((base + wave) * factor) / factor;
  });
};

/** 夹紧时长趋势（秒），对齐设计稿蓝色曲线 */
export const cylinderClampDurationData = buildTrend(0.72, 0.05);

/** 松开时长趋势（秒），对齐设计稿橙色曲线 */
export const cylinderReleaseDurationData = buildTrend(0.56, 0.05);

/** 健康度 HI 指数趋势（0-100），对齐设计稿绿色曲线 */
export const cylinderHiIndexData = buildTrend(29, 4, 31, 1);

/** 报警记录（表格用） */
export const cylinderAlarmRecords = [
  { alarmTime: '2026-06-19 12:05:21', alarmType: '夹紧不到位', alarmReason: '响应超时 / 传感器信号缺失', alarmLevel: '严重' },
  { alarmTime: '2026-06-18 09:32:15', alarmType: '夹紧力不足', alarmReason: '压力低于阈值 / 密封圈磨损', alarmLevel: '严重' },
  { alarmTime: '2026-06-17 16:48:03', alarmType: '松开超时', alarmReason: '电磁阀响应慢 / 气路堵塞', alarmLevel: '中度' },
  { alarmTime: '2026-06-16 11:22:47', alarmType: '夹紧不到位', alarmReason: '响应超时 / 传感器信号缺失', alarmLevel: '严重' },
  { alarmTime: '2026-06-15 08:15:30', alarmType: '密封圈寿命预警', alarmReason: '寿命率达90% / 建议更换', alarmLevel: '轻度' },
  { alarmTime: '2026-06-14 14:36:18', alarmType: '夹紧力不足', alarmReason: '压力波动 / 调压阀异常', alarmLevel: '中度' },
  { alarmTime: '2026-06-13 10:08:55', alarmType: '夹紧不到位', alarmReason: '响应超时 / 传感器信号缺失', alarmLevel: '严重' },
  { alarmTime: '2026-06-12 17:41:22', alarmType: '松开超时', alarmReason: '电磁阀响应慢 / 气路堵塞', alarmLevel: '中度' },
];
