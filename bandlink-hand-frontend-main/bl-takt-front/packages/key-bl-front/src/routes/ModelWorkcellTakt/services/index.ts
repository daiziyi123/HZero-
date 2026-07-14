/**
 * @Author: Auto Generated
 * @Date: 2025-06-04
 * @Description: 产线车型工位节拍关系维护-接口
 */

import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';

const apiPrefix = '/bl-base';
const organizationId = getCurrentOrganizationId();

// 保存
export function saveTakt() {
  return {
    url: `${apiPrefix}/v1/${organizationId}/model-workcell-takt`,
    method: 'POST',
  };
}

// 编辑保存
export function updateModel(params) {
  return request(`${apiPrefix}/v1/${organizationId}/model-workcell-takt`, {
    method: 'PUT',
    body: params,
  })
}

// 删除
export function deleteModel(params) {
  return request(`${apiPrefix}/v1/${organizationId}/model-workcell-takt`,{
    method: 'DELETE',
    body: params,
  });
}

// 导出
export function exportTakt() {
  return `${apiPrefix}/v1/${organizationId}/model-workcell-takt/export`;
}
