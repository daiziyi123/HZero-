/**
 * @Description: 机器人基础数据维护-接口
 */

import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';

const apiPrefix = '/dev-health-manager-yh';
const organizationId = getCurrentOrganizationId();

// ==================== 机器人基础数据接口 ====================

/**
 * 保存机器人基础数据
 */
export function saveRobotBasicData() {
  return {
    url: `${apiPrefix}/v1/${organizationId}/robot-basic-data`,
    method: 'POST',
  };
}

/**
 * 更新机器人基础数据
 * @param params - 更新参数
 */
export function updateRobotBasicData(params) {
  return request(`${apiPrefix}/v1/${organizationId}/robot-basic-data`, {
    method: 'PUT',
    body: params,
  });
}

/**
 * 删除机器人基础数据
 * @param params - 删除参数
 */
export function deleteRobotBasicData(params) {
  return request(`${apiPrefix}/v1/${organizationId}/robot-basic-data`, {
    method: 'DELETE',
    body: params,
  });
}

/**
 * 导出机器人基础数据
 */
export function exportRobotBasicData() {
  return `${apiPrefix}/v1/${organizationId}/robot-basic-data/export`;
}

// ==================== 夹具气缸接口 ====================

/**
 * 保存夹具气缸数据
 * @param params - 气缸数据
 */
export function saveFixtureCylinder(params: any) {
  return request(`${apiPrefix}/v1/${organizationId}/ehm-fixture-cylinder-exts`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 删除夹具气缸数据
 * @param params - 删除参数
 */
export function deleteFixtureCylinder(params: any) {
  return request(`${apiPrefix}/v1/${organizationId}/ehm-fixture-cylinder-exts`, {
    method: 'DELETE',
    body: params,
  });
}

// ==================== 伺服电机接口 ====================

/**
 * 保存伺服电机数据
 * @param params - 电机数据
 */
export function saveServoMotor(params: any) {
  return request(`${apiPrefix}/v1/${organizationId}/ehm-servo-equipment-exts`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 更新伺服电机数据
 * @param params - 更新参数
 */
export function updateServoMotor(params: any) {
  return request(`${apiPrefix}/v1/${organizationId}/ehm-servo-equipment-exts`, {
    method: 'PUT',
    body: params,
  });
}

/**
 * 删除伺服电机数据
 * @param params - 删除参数
 */
export function deleteServoMotor(params: any) {
  return request(`${apiPrefix}/v1/${organizationId}/ehm-servo-equipment-exts`, {
    method: 'DELETE',
    body: params,
  });
}

// ==================== 机器人设备接口 ====================

/**
 * 保存机器人设备数据
 * @param params - 设备数据
 */
export function saveRobotEquipment(params: any) {
  return request(`${apiPrefix}/v1/${organizationId}/ehm-robot-equipment-exts`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 更新机器人设备数据
 * @param params - 更新参数
 */
export function updateRobotEquipment(params: any) {
  return request(`${apiPrefix}/v1/${organizationId}/ehm-robot-equipment-exts`, {
    method: 'PUT',
    body: params,
  });
}

/**
 * 删除机器人设备数据
 * @param params - 删除参数
 */
export function deleteRobotEquipment(params: any) {
  return request(`${apiPrefix}/v1/${organizationId}/ehm-robot-equipment-exts`, {
    method: 'DELETE',
    body: params,
  });
}

// ==================== LOV 下拉数据接口 ====================

/**
 * 获取产线下拉数据
 * lovCode: IIOT.HDB.LINE_DATA
 */
export function fetchLineLov() {
  return request(`${apiPrefix}/v1/${organizationId}/lovs/sql/data`, {
    method: 'GET',
    query: {
      lovCode: 'IIOT.HDB.LINE_DATA',
    },
  });
}

/**
 * 获取工位下拉数据（产线联动）
 * lovCode: IIOT.HDB.STATION_DATA
 * @param lineId - 产线ID
 */
export function fetchWorkcellLov(lineId: string) {
  return request(`${apiPrefix}/v1/${organizationId}/lovs/sql/data`, {
    method: 'GET',
    query: {
      lovCode: 'IIOT.HDB.STATION_DATA',
      lineId,
    },
  });
}

/**
 * 获取夹具设备下拉数据（工位联动）
 * lovCode: IIOT.HDB.STATION_DEVICE_DATA
 * @param workcellId - 工位ID
 * @param equipmentType - 设备类型：EHM_ROBOT(机器人) / EHM_SERVO_MOTOR(伺服电机) / EHM_FIXTURE_CYLINDER(夹具气缸)
 */
export function fetchFixtureDeviceLov(workcellId: string, equipmentType: string = 'EHM_ROBOT') {
  return request(`${apiPrefix}/v1/${organizationId}/lovs/sql/data`, {
    method: 'GET',
    query: {
      lovCode: 'IIOT.HDB.STATION_DEVICE_DATA',
      stationId: workcellId,
      equipmentType,
    },
  });
}

/**
 * 获取夹具下拉数据（产线+工位联动）
 * lovCode: IIOT.HDB.FIXTURE
 * @param prodLineId - 产线ID
 * @param workcellId - 工位ID
 */
export function fetchFixtureLov(prodLineId: string, workcellId: string) {
  return request(`${apiPrefix}/v1/${organizationId}/lovs/sql/data`, {
    method: 'GET',
    query: {
      lovCode: 'IIOT.HDB.FIXTURE',
      prodLineId,
      workcellId,
    },
  });
}