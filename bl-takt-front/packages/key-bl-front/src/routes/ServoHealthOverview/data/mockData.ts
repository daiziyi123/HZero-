import { ServoDeviceInfo } from '../../shared/equipmentHealth/types';
import { hiToHealthKey } from '../../shared/equipmentHealth/utils';

export const warningLevelOptions = [
  { key: 'normal', label: '正常', count: 3, color: '#2563eb' },
  { key: 'mild', label: '轻度预警', count: 1, color: '#f59e0b' },
  { key: 'moderate', label: '中度预警', count: 1, color: '#ea580c' },
  { key: 'severe', label: '严重预警', count: 1, color: '#dc2626' },
];

export const lineOptions = ['全部产线', '焊装A线', '焊装B线'];
export const stationOptions = [
  '全部工位',
  '滑台工位1',
  '滑台工位2',
  '滑台工位3',
  '转台工位1',
  '转台工位2',
  '转台工位3',
];
export const fixtureOptions = ['全部夹具', '转台夹具', '输送夹具', '焊接夹具'];

/** 健康度等级下拉（设计稿筛选项） */
export const healthLevelSelectOptions = ['全部等级', '健康', '良好', '警告', '严重'];

const build = (
  id: string,
  name: string,
  line: string,
  station: string,
  status: ServoDeviceInfo['status'],
  healthIndex: number,
  iconType: string,
  extra: Partial<ServoDeviceInfo> = {},
): ServoDeviceInfo => {
  const riskMap: Record<string, { tag: string; factor: string }> = {
    健康: { tag: '', factor: '' },
    良好: { tag: '常(良好)', factor: '风险:电机振动 / 电机峰值扭矩距' },
    警告: { tag: '常(警告)', factor: '风险:电机振动 / 电机峰值扭矩距' },
    严重: { tag: '常(严重)', factor: '风险:电机振动 / 电机峰值扭矩距' },
  };
  const warnMap: Record<string, ServoDeviceInfo['warningLevel']> = {
    健康: '正常',
    良好: '轻度预警',
    警告: '中度预警',
    严重: '严重预警',
  };
  return {
    id,
    name,
    zoneId: line === '焊装A线' ? 'line-a' : 'line-b',
    line,
    station,
    fixture: '转台夹具',
    status,
    warningLevel: warnMap[status],
    runState: status === '严重' ? '故障' : status === '警告' ? '待机' : '运行中',
    speed: status === '严重' ? '0 rpm' : `${1000 + Math.round(healthIndex * 5)} rpm`,
    current: `${(2 + (100 - healthIndex) / 20).toFixed(1)} A`,
    totalRuntime: `${(8000 + Math.round((100 - healthIndex) * 90)).toLocaleString()} h`,
    alarmWarning: status === '健康' ? '0次 / 正常' : `${Math.round((100 - healthIndex) / 8)}次 / ${warnMap[status]}`,
    healthIndex,
    lifeRate: Math.round((100 - healthIndex) * 0.9 + 30),
    iconType,
    riskTag: riskMap[status].tag,
    riskFactor: riskMap[status].factor,
    ...extra,
  };
};

export const servoDevices: ServoDeviceInfo[] = [
  build('servo-el01', '120EL01升降机', '焊装A线', '滑台工位1', '严重', 0, 'memory', { fixture: '输送夹具' }),
  build('servo-01', '滑台伺服电机-01', '焊装A线', '滑台工位1', '健康', 92.4, 'memory'),
  build('servo-02', '滑台伺服电机-02', '焊装A线', '滑台工位1', '良好', 74.3, 'settings'),
  build('servo-03', '转台伺服电机-03', '焊装A线', '转台工位2', '警告', 52.8, 'cached'),
  build('servo-04', '转台伺服电机-04', '焊装A线', '转台工位2', '严重', 28.5, 'memory'),
  build('servo-05', '滑台高速电机-05', '焊装B线', '滑台工位1', '健康', 91.4, 'bolt'),
  build('servo-06', '滑台精密电机-06', '焊装B线', '滑台工位1', '良好', 79.2, 'settings'),
  build('servo-07', '转台定位电机-07', '焊装A线', '转台工位2', '警告', 48.6, 'cached'),
  build('servo-08', '转台重型电机-08', '焊装B线', '转台工位2', '严重', 31.2, 'work'),
  build('servo-09', '辅助滑台电机-09', '焊装B线', '滑台工位3', '警告', 44.8, 'hvac'),
  build('servo-10', '辅助转台电机-10', '焊装A线', '转台工位3', '良好', 68.5, 'cached'),
  build('servo-11', '滑台伺服电机-11', '焊装A线', '滑台工位2', '健康', 89.1, 'memory'),
  build('servo-12', '转台伺服电机-12', '焊装B线', '转台工位1', '健康', 87.3, 'cached'),
  build('servo-13', '滑台高速电机-13', '焊装A线', '滑台工位2', '良好', 72.6, 'bolt'),
  build('servo-14', '转台定位电机-14', '焊装B线', '转台工位1', '警告', 41.5, 'cached'),
  build('servo-15', '辅助转台电机-15', '焊装B线', '转台工位2', '严重', 26.8, 'work'),
];

/** 健康度统计（4 张大卡） */
const healthLevelMeta = [
  { key: 'health', label: '健康', range: 'HI>85', desc: '运行稳定', color: '#18a058', bg: '#ecfdf5', border: '#a7f3d0', icon: 'check_circle' },
  { key: 'good', label: '良好', range: '60≤HI≤85', desc: '需关注监测', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', icon: 'warning' },
  { key: 'warning', label: '警告', range: '40≤HI<60', desc: '建议检修', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', icon: 'notifications_active' },
  { key: 'critical', label: '严重', range: 'HI<40', desc: '立即停机', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: 'dangerous' },
];

export const buildServoSummaryCards = (devices: ServoDeviceInfo[]) =>
  healthLevelMeta.map((item) => ({
    ...item,
    count: devices.filter((d) => hiToHealthKey(d.healthIndex) === item.key).length,
  }));

export const servoSummaryCards = buildServoSummaryCards(servoDevices);

export const findServoDevice = (deviceId: string) => servoDevices.find((d) => d.id === deviceId);

export const statusToHealthKey = (status: ServoDeviceInfo['status']): string => {
  const map: Record<string, string> = {
    健康: 'health', 良好: 'good', 警告: 'warning', 严重: 'critical',
  };
  return map[status] || 'good';
};

export const warningLevelToKey = (level: ServoDeviceInfo['warningLevel']): string => {
  const map: Record<string, string> = {
    正常: 'normal', 轻度预警: 'mild', 中度预警: 'moderate', 严重预警: 'severe',
  };
  return map[level] || 'normal';
};

/* ================= 分析区图表数据 ================= */

/** 风险电机数量趋势（警告+严重） */
export const riskCountTrendDates = [
  '6/6', '6/8', '6/10', '6/12', '6/14', '6/16', '6/18', '6/20',
  '6/22', '6/24', '6/26', '6/28', '6/30', '7/2', '7/4', '7/6',
];
export const riskCountTrendValues = [4, 5, 6, 5, 4, 5, 6, 7, 6, 5, 3, 2, 4, 6, 7, 5];

/** 风险类型趋势分析（堆叠柱：警告 / 严重） */
export const riskTypeTrendDates = [
  '6/6', '6/8', '6/10', '6/12', '6/14', '6/16', '6/18', '6/20',
  '6/22', '6/24', '6/26', '6/28', '6/30', '7/2', '7/4', '7/6',
];
export const riskTypeWarningValues = [3, 4, 4, 3, 3, 4, 4, 5, 4, 3, 2, 1, 3, 5, 5, 4];
export const riskTypeSevereValues = [1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 1, 2, 3, 2];

/** 最新诊断风险电机分布（警告+严重）按产线-工位 */
export const riskDistribution = [
  { name: '焊装A线-转台工位2', value: 2, color: '#3b82f6' },
  { name: '焊装B线-转台工位2', value: 1, color: '#18a058' },
  { name: '焊装A线-滑台工位2', value: 1, color: '#f59e0b' },
  { name: '焊装A线-滑台工位1', value: 1, color: '#ef4444' },
  { name: '焊装B线-滑台工位2', value: 1, color: '#f97316' },
  { name: '焊装B线-转台工位1', value: 1, color: '#38bdf8' },
];
