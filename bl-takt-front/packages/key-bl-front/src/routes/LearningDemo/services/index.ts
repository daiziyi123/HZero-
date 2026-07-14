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

const apiPrefix = '/bl-yh';
// const apiPrefix = '/bl-demo-wxs';
const organizationId = getCurrentOrganizationId();

/**
 * 保存新增
 */
export function saveDemoData() {
  return {
    url: `${apiPrefix}/v1/${organizationId}/bl-tests`,
    method: 'POST',
  };
}

/**
 * 编辑保存
 * @param {Object} params - 请求参数
 */
export function updateDemoData(params) {
  return request(`${apiPrefix}/v1/${organizationId}/bl-tests`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 删除接口
 * @param {Array} params - 包含 id 的数组
 */
export function deleteDemoData(params) {
  return request(`${apiPrefix}/v1/${organizationId}/bl-tests`, {
    method: 'DELETE',
    body: params,
  });
}
//导出 
export function exportDemoData() {
  return `${apiPrefix}/v1/${organizationId}/bl-tests/export`;
}
