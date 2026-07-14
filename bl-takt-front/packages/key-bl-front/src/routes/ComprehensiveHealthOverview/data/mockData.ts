export interface RobotStatus {
  key: string;
  label: string;
  count: number;
}

export interface HealthLevel {
  key: string;
  label: string;
  count: number;
  color: string;
}

export interface AlarmItem {
  id: string;
  level: 'critical' | 'warning' | 'info';
  msg: string;
  time: string;
}

export interface MaintenanceItem {
  id: string;
  item: string;
  dueDate: string;
  dueTime: string;
  urgency: 'high' | 'medium' | 'low';
}

export interface DeviceInfo {
  id: string;
  /** 设备编码，用于状态接口查询 */
  code?: string;
  name: string;
  type: string;
  score: number;
  status: '健康' | '良好' | '警告' | '严重';
  isRunning: boolean;
  riskInfo?: string;
  zoneId: string;
  robotStatus?: 'running' | 'standby' | 'abnormal' | 'alarm' | 'offline' | 'uncollected';
  /** 是否显示设备异常告警条（alarm 点位控制，与 robotStatus 独立） */
  isAlarm?: boolean;
  alertMsg?: string;
  /** 累计运行时间（小时） */
  totalRuntime?: number;
  /** 单班最佳运行时长 (HH:MM:SS) */
  shiftBest?: string;
  /** 实时报警列表 */
  alarmList?: AlarmItem[];
  /** 到期维护提醒 */
  maintenanceList?: MaintenanceItem[];
}

export interface ZoneInfo {
  id: string;
  name: string;
  totalCount: number;
  runningCount: number;
  warningCount: number;
  devices: DeviceInfo[];
}

// 机器人状态筛选选项
export const robotStatusOptions: RobotStatus[] = [
  { key: 'running', label: '运行', count: 17 },
  { key: 'standby', label: '待机', count: 3 },
  { key: 'abnormal', label: '急停', count: 1 },
  { key: 'alarm', label: '报警', count: 1 },
  { key: 'offline', label: '离线', count: 2 },
  { key: 'uncollected', label: '未采集', count: 0 },
];

// 健康等级筛选选项
export const healthLevelOptions: HealthLevel[] = [
  { key: 'health', label: '健康', count: 85, color: '#18a058' },
  { key: 'good', label: '良好', count: 60, color: '#f59e0b' },
  { key: 'warning', label: '警告', count: 3, color: '#ea580c' },
  { key: 'critical', label: '严重', count: 40, color: '#dc2626' },
];

// 区域数据 - A1.1体区
export const zoneA11Data: ZoneInfo = {
  id: 'A1.1',
  name: ' A1上件区',
  totalCount: 12,
  runningCount: 8,
  warningCount: 4,
  devices: [
    {
      id: 'weld-a1-01',
      name: '焊接-A1-01',
      type: '焊接机器人',
      score: 92,
      status: '健康',
      isRunning: true,
      robotStatus: 'running',
      zoneId: 'A1.1',
      deviceId: 1,
      equipmentId: 1,
      prodLineId: 1,
      workcellId: 1,
      equipmentCode: 'weld-a1-01',
      totalRuntime: 1048.2,
      shiftBest: '13:43:18',
      alarmList: [],
      maintenanceList: [
        { id: 'm1', item: '减速机润滑油更换', dueDate: '2026-07-15', dueTime: '14:30', urgency: 'medium' },
        { id: 'm2', item: '焊枪电极帽更换', dueDate: '2026-06-30', dueTime: '08:00', urgency: 'high' },
        { id: 'm3', item: '伺服电机编码器电池更换', dueDate: '2026-08-05', dueTime: '09:00', urgency: 'medium' },
      ],
    },
    {
      id: 'weld-a1-02',
      name: '焊接-A1-02',
      type: '焊装机器人',
      score: 88,
      status: '健康',
      isRunning: true,
      robotStatus: 'running',
      zoneId: 'A1.1',
    },
    {
      id: 'paint-a1-01',
      name: '涂胶-A1-01',
      type: '涂胶机器人',
      score: 91,
      status: '健康',
      isRunning: true,
      robotStatus: 'running',
      zoneId: 'A1.1',
    },
    {
      id: 'weld-a1-03',
      name: '焊接-A1-03',
      type: '焊接机器人',
      score: 89,
      status: '健康',
      isRunning: true,
      robotStatus: 'running',
      zoneId: 'A1.1',
    },
    {
      id: 'weld-a1-04',
      name: '焊接-A1-04',
      type: '焊接机器人',
      score: 85,
      status: '良好',
      isRunning: true,
      robotStatus: 'running',
      zoneId: 'A1.1',
    },
    {
      id: 'paint-a1-02',
      name: '涂胶-A1-02',
      type: '涂胶机器人',
      score: 94,
      status: '健康',
      isRunning: true,
      robotStatus: 'running',
      zoneId: 'A1.1',
    },
    {
      id: 'weld-a1-05',
      name: '焊接-A1-05',
      type: '焊接机器人',
      score: 65,
      status: '警告',
      isRunning: false,
      robotStatus: 'alarm',
      riskInfo: '报警',
      alertMsg: '焊接-A1-05 设备存在故障报警，请及时处理。',
      zoneId: 'A1.1',
      totalRuntime: 4521.8,
      shiftBest: '08:12:05',
      alarmList: [
        { id: 'a1', level: 'critical', msg: 'SVJ0-05 编码器电池电压低', time: '2026-06-25 09:32:15' },
        { id: 'a2', level: 'warning', msg: '焊接电流异常波动', time: '2026-06-25 08:47:03' },
      ],
      maintenanceList: [
        { id: 'm1', item: '减速机润滑油更换', dueDate: '2026-07-15', dueTime: '14:30', urgency: 'medium' },
        { id: 'm2', item: '焊枪电极帽更换', dueDate: '2026-06-30', dueTime: '08:00', urgency: 'high' },
      ],
    },
    {
      id: 'weld-a1-06',
      name: '焊接-A1-06',
      type: '焊接机器人',
      score: 55,
      status: '严重',
      isRunning: false,
      robotStatus: 'abnormal',
      riskInfo: '急停',
      alertMsg: '焊接-A1-06 设备已紧急停止，请检查设备状态。',
      zoneId: 'A1.1',
    },
    {
      id: 'weld-a1-07',
      name: '焊接-A1-07',
      type: '焊接机器人',
      score: 75,
      status: '良好',
      isRunning: false,
      robotStatus: 'standby',
      zoneId: 'A1.1',
    },
    {
      id: 'weld-a1-08',
      name: '焊接-A1-08',
      type: '焊接机器人',
      score: 72,
      status: '良好',
      isRunning: true,
      robotStatus: 'running',
      zoneId: 'A1.1',
    },
    {
      id: 'weld-a1-09',
      name: '焊接-A1-09',
      type: '焊接机器人',
      score: 35,
      status: '严重',
      isRunning: false,
      robotStatus: 'offline',
      riskInfo: '离线',
      alertMsg: '焊接-A1-09 设备已离线，请检查网络连接。',
      zoneId: 'A1.1',
      totalRuntime: 0,
      shiftBest: '--',
      alarmList: [
        { id: 'a1', level: 'critical', msg: '网络连接中断', time: '2026-06-25 06:00:00' },
      ],
      maintenanceList: [],
    },
    {
      id: 'weld-a1-10',
      name: '焊接-A1-10',
      type: '焊接机器人',
      score: 68,
      status: '警告',
      isRunning: false,
      robotStatus: 'standby',
      zoneId: 'A1.1',
    },
  ],
};

// 区域数据 - A2安区
export const zoneA2Data: ZoneInfo = {
  id: 'A2',
  name: ' A2定位区',
  totalCount: 12,
  runningCount: 9,
  warningCount: 3,
  devices: [
    {
      id: 'weld-a2-01',
      name: '焊接-A2-01',
      type: '焊接机器人',
      score: 88,
      status: '健康',
      isRunning: true,
      robotStatus: 'running',
      zoneId: 'A2',
    },
    {
      id: 'weld-a2-02',
      name: '焊接-A2-02',
      type: '焊接机器人',
      score: 90,
      status: '健康',
      isRunning: true,
      robotStatus: 'running',
      zoneId: 'A2',
    },
    {
      id: 'paint-a2-01',
      name: '涂胶-A2-01',
      type: '涂胶机器人',
      score: 87,
      status: '健康',
      isRunning: true,
      robotStatus: 'running',
      zoneId: 'A2',
    },
    {
      id: 'weld-a2-03',
      name: '焊接-A2-03',
      type: '焊接机器人',
      score: 86,
      status: '健康',
      isRunning: true,
      robotStatus: 'running',
      zoneId: 'A2',
    },
    {
      id: 'weld-a2-04',
      name: '焊接-A2-04',
      type: '焊接机器人',
      score: 78,
      status: '警告',
      isRunning: false,
      robotStatus: 'alarm',
      riskInfo: '报警',
      alertMsg: '焊接-A2-04 设备存在故障报警，请及时处理。',
      zoneId: 'A2',
    },
    {
      id: 'paint-a2-02',
      name: '涂胶-A2-02',
      type: '涂胶机器人',
      score: 92,
      status: '健康',
      isRunning: true,
      robotStatus: 'running',
      zoneId: 'A2',
    },
    {
      id: 'weld-a2-05',
      name: '焊接-A2-05',
      type: '焊接机器人',
      score: 83,
      status: '良好',
      isRunning: true,
      robotStatus: 'running',
      zoneId: 'A2',
    },
    {
      id: 'weld-a2-06',
      name: '焊接-A2-06',
      type: '焊接机器人',
      score: 60,
      status: '警告',
      isRunning: false,
      robotStatus: 'standby',
      zoneId: 'A2',
    },
    {
      id: 'weld-a2-07',
      name: '焊接-A2-07',
      type: '焊接机器人',
      score: 48,
      status: '严重',
      isRunning: false,
      robotStatus: 'abnormal',
      riskInfo: '急停',
      alertMsg: '焊接-A2-07 设备已紧急停止，请检查设备状态。',
      zoneId: 'A2',
    },
    {
      id: 'weld-a2-08',
      name: '焊接-A2-08',
      type: '焊接机器人',
      score: 82,
      status: '良好',
      isRunning: true,
      robotStatus: 'running',
      zoneId: 'A2',
    },
    {
      id: 'weld-a2-09',
      name: '焊接-A2-09',
      type: '焊接机器人',
      score: 30,
      status: '严重',
      isRunning: false,
      robotStatus: 'offline',
      riskInfo: '离线',
      alertMsg: '焊接-A2-09 设备已离线，请检查网络连接。',
      zoneId: 'A2',
    },
    {
      id: 'weld-a2-10',
      name: '焊接-A2-10',
      type: '焊接机器人',
      score: 70,
      status: '良好',
      isRunning: false,
      robotStatus: 'standby',
      zoneId: 'A2',
    },
  ],
};

// 区域数据 - A3主焊区
export const zoneA3Data: ZoneInfo = {
  id: 'A3',
  name: 'A3 主焊区',
  totalCount: 8,
  runningCount: 5,
  warningCount: 3,
  devices: [
    {
      id: 'weld-a3-01',
      name: '焊接-A3-01',
      type: '焊装机器人',
      score: 72,
      status: '警告',
      isRunning: true,
      robotStatus: 'running',
      isAlarm: true,
      riskInfo: '报警',
      alertMsg: 'SVJ0-05 编码器电池电压低',
      zoneId: 'A3',
    },
    {
      id: 'weld-a3-02',
      name: '焊接-A3-02',
      type: '焊装机器人',
      score: 91,
      status: '健康',
      isRunning: true,
      robotStatus: 'running',
      zoneId: 'A3',
    },
    {
      id: 'paint-a3-01',
      name: '涂胶-A3-01',
      type: '涂胶机器人',
      score: 85,
      status: '良好',
      isRunning: true,
      robotStatus: 'running',
      zoneId: 'A3',
    },
    {
      id: 'weld-a3-03',
      name: '焊接-A3-03',
      type: '焊接机器人',
      score: 89,
      status: '健康',
      isRunning: true,
      robotStatus: 'running',
      zoneId: 'A3',
    },
    {
      id: 'weld-a3-04',
      name: '焊接-A3-04',
      type: '焊接机器人',
      score: 88,
      status: '健康',
      isRunning: true,
      robotStatus: 'running',
      zoneId: 'A3',
    },
    {
      id: 'paint-a3-02',
      name: '涂胶-A3-02',
      type: '涂胶机器人',
      score: 86,
      status: '健康',
      isRunning: false,
      robotStatus: 'standby',
      zoneId: 'A3',
    },
    {
      id: 'weld-a3-05',
      name: '焊接-A3-05',
      type: '焊接机器人',
      score: 81,
      status: '良好',
      isRunning: true,
      robotStatus: 'running',
      zoneId: 'A3',
    },
    {
      id: 'weld-a3-06',
      name: '焊接-A3-06',
      type: '焊接机器人',
      score: 55,
      status: '警告',
      isRunning: false,
      robotStatus: 'abnormal',
      riskInfo: '急停',
      alertMsg: 'SVJ3-05 CPU温度过高 + ATC轴过热',
      zoneId: 'A3',
    },
  ],
};

// 区域数据 - K04分装线
export const zoneK04Data: ZoneInfo = {
  id: 'K04',
  name: 'K04 分装线',
  totalCount: 5,
  runningCount: 3,
  warningCount: 2,
  devices: [
    {
      id: 'weld-k04-01',
      name: '焊接-K04-01',
      type: '焊接机器人',
      score: 45,
      status: '警告',
      isRunning: false,
      robotStatus: 'abnormal',
      riskInfo: '急停',
      alertMsg: '伺服驱动器过载保护',
      zoneId: 'K04',
    },
    {
      id: 'weld-k04-02',
      name: '焊接-K04-02',
      type: '焊接机器人',
      score: 81,
      status: '良好',
      isRunning: true,
      robotStatus: 'running',
      zoneId: 'K04',
    },
    {
      id: 'paint-k04-01',
      name: '涂胶-K04-01',
      type: '涂胶机器人',
      score: 76,
      status: '良好',
      isRunning: true,
      robotStatus: 'running',
      isAlarm: true,
      riskInfo: '报警',
      alertMsg: 'SVJ0-06 编码器电池电压低',
      zoneId: 'K04',
    },
    {
      id: 'weld-k04-03',
      name: '焊接-K04-03',
      type: '焊接机器人',
      score: 92,
      status: '健康',
      isRunning: true,
      robotStatus: 'running',
      zoneId: 'K04',
    },
    {
      id: 'weld-k04-04',
      name: '焊接-K04-04',
      type: '焊接机器人',
      score: 0,
      status: '严重',
      isRunning: false,
      robotStatus: 'offline',
      riskInfo: '离线',
      alertMsg: '网络连接中断',
      zoneId: 'K04',
    },
  ],
};

// 所有区域数据
export const allZonesData: ZoneInfo[] = [zoneA11Data, zoneA2Data, zoneA3Data, zoneK04Data];
