export type ParamTabType = 'robot' | 'servo' | 'cylinder';

export interface DeviceSelection {
  line: string;
  station: string;
  device: string;
}

export interface ParamVersion {
  id: number;
  line: string;
  station: string;
  deviceName: string;
  fileName: string;
  versionNumber: string;
  changeDesc: string;
  importTime: string;
  /** 机器人：含表头；伺服/气缸：不含表头 */
  data: string[][];
  headers?: string[];
}

export type DeviceMap = Record<string, Record<string, string[]>>;
