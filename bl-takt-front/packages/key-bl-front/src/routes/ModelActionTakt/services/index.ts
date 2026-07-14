/**
 * @Author: Auto Generated
 * @Date: 2025-06-04
 * @Description: 产线工位车型动作节拍关系维护-接口
 */

import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';

const apiPrefix = '/bl-base';
const organizationId = getCurrentOrganizationId();

// 保存新增
export function saveActionTakt() {
  return {
    url: `${apiPrefix}/v1/${organizationId}/model-action-takt`,
    method: 'POST',
  };
}

// 编辑保存
export function updateModel(params) {
  return request(`${apiPrefix}/v1/${organizationId}/model-action-takt`, {
    method: 'PUT',
    body: params,
  })
}

// 删除
export function deleteModel(params) {
  return request(`${apiPrefix}/v1/${organizationId}/model-action-takt`,{
    method: 'DELETE',
    body: params,
  });
}

// 导出
export function exportActionTakt() {
  return `${apiPrefix}/v1/${organizationId}/model-action-takt/export`;
}
