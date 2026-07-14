export type HealthStatus = '健康' | '良好' | '警告' | '严重';

export type WarningLevel = '正常' | '轻度预警' | '中度预警' | '严重预警';

export interface CylinderDeviceInfo {
  id: string;
  name: string;
  zoneId: string;
  line: string;
  station: string;
  fixture: string;
  status: HealthStatus;
  cylinderState: '夹紧' | '松开';
  clampTimeRange: string;
  totalDuration: string;
  actionCount: string;
  healthIndex: number;
  lifeRate: number;
}

export interface ServoDeviceInfo {
  id: string;
  name: string;
  zoneId: string;
  line: string;
  station: string;
  fixture: string;
  status: HealthStatus;
  warningLevel: WarningLevel;
  runState: string;
  speed: string;
  current: string;
  totalRuntime: string;
  alarmWarning: string;
  healthIndex: number;
  lifeRate: number;
  /** 卡片图标类型（choerodon Icon type） */
  iconType?: string;
  /** 风险因素文案，无风险时为空 */
  riskFactor?: string;
  /** 风险标签：无风险 / 常良好 / 常警告 / 常严重 */
  riskTag?: string;
}

export interface EquipmentZoneInfo<T> {
  id: string;
  name: string;
  devices: T[];
}

export interface WarningLevelOption {
  key: string;
  label: string;
  count: number;
  color: string;
}

export interface StatusFilterOption {
  key: string;
  label: string;
  count: number;
  color: string;
}
