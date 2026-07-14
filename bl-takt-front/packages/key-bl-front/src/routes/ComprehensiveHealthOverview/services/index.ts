/**
 * @Description: 综合健康概览页面 - API 接口
 * @Author: Assistant
 * @Date: 2026-07-07
 */

import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';

const apiPrefix = '/dev-health-manager-yh';
/** 健康评分接口专用前缀 */
const healthScoreApiPrefix = '/dev-health-manager-xswang';
const organizationId = getCurrentOrganizationId();

/** 机器人健康分值 */
export interface RobotHealthItem {
    childEquipmentType: string;
    childEquipmentTypeMeaning: string;
    equipmentCode: string;
    equipmentId: number;
    equipmentName: string;
    healthLevelCode: number;
    score: number;
    workcellCode: string;
    workcellId: number;
    workcellName: string;
}

/** 产线维度机器人健康分值 */
export interface ProdLineRobotHealth {
    prodLineCode: string;
    prodLineId: number;
    prodLineName: string;
    robots: RobotHealthItem[];
}

/**
 * 列表查询 - 产线维度机器人健康分值
 */
export function listRobotDashboardHealth() {
    return request(`${apiPrefix}/v1/${organizationId}/robot/dashboard/health`, {
        method: 'GET',
    });
}

/** 点位属性数据 */
export interface PropertyData {
    getDate: string;
    propertyCode: string;
    quality: number;
    thingCode: string;
    value: string;
}

/** 批量状态请求参数：{ 机器人code: [点位key数组] } */
export type BatchStatusParams = Record<string, string[]>;

/** 批量状态响应：{ 机器人code: { 点位key: PropertyData } } */
export type BatchStatusResponse = Record<string, Record<string, PropertyData>>;

/**
 * 批量查询机器人实时状态
 * @param params { 机器人code: [点位key, ...] }
 */
export async function queryRobotAlarmCount(params: RobotAlarmCountQueryParams): Promise<RobotAlarmCountItem[]> {
  if (!params.deviceId) {
    return [];
  }

  const res = await request(`${apiPrefix}/v1/${organizationId}/robot/dashboard/alarm/count`, {
    method: 'GET',
    query: params,
  });
  const data = getResponse(res, false);
  return normalizeList<RobotAlarmCountItem>(data);
}

export interface SparePartWarningItem {
  maintenanceItem: string;
  ratedLife: number;
  remainingLifePercentage: string;
  status: string;
  usedHours: number;
  warningThreshold: string;
}

export interface SparePartWarningResponse {
  list: SparePartWarningItem[];
  normalCount: number;
  remindCount: number;
  totalCount: number;
  warningCount: number;
}

const emptySparePartWarningResponse: SparePartWarningResponse = {
  list: [],
  normalCount: 0,
  remindCount: 0,
  totalCount: 0,
  warningCount: 0,
};

/* ============ 健康评分 ============ */

export interface HiRecord {
  equipmentCode: string;
  equipmentId: number;
  equipmentName: string;
  equipmentType: string;
  extJson: Record<string, unknown>;
  /** 健康度等级：1优秀，2良好，3预警，4异常 */
  healthLevel: number;
  healthScore: number;
  id: number;
  lifeScore: number;
  mainRiskFactor: string;
  performanceScore: number;
  prodLineId: number;
  prodLineName: string;
  scoreDate: string;
  statusScore: number;
  tenantId: number;
  workcellId: number;
  workcellName: string;
}

export interface HiRecordPageResult {
  content: HiRecord[];
  empty: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface HiRecordPageQueryParams {
  equipmentId: number;
  tenantId: number;
  /** 接口文档字段：评分日期（起始日期传此字段） */
  scoreDate?: string;
  startDate?: string;
  endDate?: string;
  healthLevel?: number;
  page?: number;
  size?: number;
}

const emptyHiRecordPageResult: HiRecordPageResult = {
  content: [],
  empty: true,
  number: 0,
  numberOfElements: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
};

function normalizeHiRecordPageResult(data: unknown): HiRecordPageResult {
  if (!data || typeof data !== 'object') {
    return emptyHiRecordPageResult;
  }

  const obj = data as Partial<HiRecordPageResult>;
  const content = Array.isArray(obj.content) ? obj.content : normalizeList<HiRecord>(data);

  return {
    content,
    empty: obj.empty ?? content.length === 0,
    number: obj.number ?? 0,
    numberOfElements: obj.numberOfElements ?? content.length,
    size: obj.size ?? content.length,
    totalElements: obj.totalElements ?? content.length,
    totalPages: obj.totalPages ?? 0,
  };
}

/**
 * 查询某个设备健康评分详情记录（分页，scoreDate 倒序）——健康评分历史记录
 */
export async function queryHiRecordPage(params: HiRecordPageQueryParams): Promise<HiRecordPageResult> {
  if (!params.equipmentId) {
    return emptyHiRecordPageResult;
  }

  const res = await request(`${healthScoreApiPrefix}/v1/${organizationId}/ehm-health-score-results/getHiRecordPage`, {
    method: 'GET',
    query: params,
  });
  const data = getResponse(res, false);
  return normalizeHiRecordPageResult(data);
}

/**
 * 查询某个设备最后一条健康评分详情记录——健康评分顶部概览
 */
export async function queryLastHiRecord(equipmentId?: number): Promise<HiRecord | null> {
  if (!equipmentId) {
    return null;
  }

  const res = await request(`${healthScoreApiPrefix}/v1/${organizationId}/ehm-health-score-results/getLastHiRecord`, {
    method: 'GET',
    query: { equipmentId },
  });
  const data = getResponse(res, false);
  const list = normalizeList<HiRecord>(data);
  return list.length > 0 ? list[0] : null;
}

/**
 * 查询机器人寿命件预警
 */
export async function querySparePartWarning(equipmentCode: string): Promise<SparePartWarningResponse> {
  if (!equipmentCode) {
    return emptySparePartWarningResponse;
  }

  const res = await request(`${apiPrefix}/v1/${organizationId}/robot/dashboard/spare-part/warning`, {
    method: 'GET',
    query: { equipmentCode },
  });
  const data = getResponse(res, false);
  if (!data || typeof data !== 'object') {
    return emptySparePartWarningResponse;
  }

  const obj = data as Partial<SparePartWarningResponse>;
  return {
    list: Array.isArray(obj.list) ? obj.list : [],
    normalCount: obj.normalCount ?? 0,
    remindCount: obj.remindCount ?? 0,
    totalCount: obj.totalCount ?? 0,
    warningCount: obj.warningCount ?? 0,
  };
}
