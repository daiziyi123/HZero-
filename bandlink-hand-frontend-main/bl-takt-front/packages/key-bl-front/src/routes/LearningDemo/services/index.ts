/**
 * @Description: 学习示例页面 - API 接口
 * @Author: Assistant
 * @Date: 2026-06-10
 * 
 * 本文件定义：
 * 1. 查询接口
 * 2. 新增接口
 * 3. 编辑接口
 * 4. 删除接口
 */

import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';

const apiPrefix = '/bl-base';
const organizationId = getCurrentOrganizationId();

/**
 * 查询接口（供 useRequest 使用）
 * 返回配置对象，不是直接执行请求
 */
export function fetchDemoData() {
  return {
    url: `${apiPrefix}/v1/${organizationId}/demo-data/query`,
    method: 'POST',
  };
}

/**
 * 新增接口（供 useRequest 使用）
 */
export function saveDemoData() {
  return {
    url: `${apiPrefix}/v1/${organizationId}/demo-data`,
    method: 'POST',
  };
}

/**
 * 编辑接口（直接执行请求）
 * @param {Object} params - 请求参数
 */
export const updateDemoData = (params) =>
  request(`${apiPrefix}/v1/${organizationId}/demo-data`, {
    method: 'PUT',
    body: params,
  });

/**
 * 删除接口（支持批量删除）
 * @param {Array} params - 包含 demoId 的数组
 */
export const deleteDemoData = (params) =>
  request(`${apiPrefix}/v1/${organizationId}/demo-data`, {
    method: 'DELETE',
    body: params,
  });
