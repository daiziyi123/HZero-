/**
 * @Author: Auto Generated
 * @Date: 2025-01-20
 * @Description: 车型维护-接口
 */

import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';

const apiPrefix = '/bl-base';
const organizationId = getCurrentOrganizationId();

// 保存（新增）
export function saveModel() {
  return {
    url: `${apiPrefix}/v1/${organizationId}/mt-model`,
    method: 'POST',
  };
}

// 编辑保存
export function updateModel(params) {
  return request(`${apiPrefix}/v1/${organizationId}/mt-model`, {
    method: 'PUT',
    body: params,
  })
}

// 删除
export function deleteModel(params) {
  return request(`${apiPrefix}/v1/${organizationId}/mt-model`,{
    method: 'DELETE',
    body: params,
  });
}

// 导出
export function exportModel() {
  return `${apiPrefix}/v1/${organizationId}/mt-model/export`;
}
