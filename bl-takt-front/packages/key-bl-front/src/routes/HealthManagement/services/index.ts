/**
 * @Description: 健康管理页面 - API 接口
 * @Author: Assistant
 * @Date: 2026-06-23
 */

import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';

const apiPrefix = '/bl-health';
const organizationId = getCurrentOrganizationId();

/**
 * 查询机器人类数据
 */
export function queryRobotData(params?: any) {
  return request(`${apiPrefix}/v1/${organizationId}/robot-indicators`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询伺服电机类数据
 */
export function queryServoMotorData(params?: any) {
  return request(`${apiPrefix}/v1/${organizationId}/servo-indicators`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询夹具气缸类数据
 */
export function queryCylinderData(params?: any) {
  return request(`${apiPrefix}/v1/${organizationId}/cylinder-indicators`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 保存指标数据
 */
export function saveIndicatorData(params: any) {
  return request(`${apiPrefix}/v1/${organizationId}/indicators`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 删除指标数据
 */
export function deleteIndicatorData(params: any) {
  return request(`${apiPrefix}/v1/${organizationId}/indicators`, {
    method: 'DELETE',
    body: params,
  });
}
