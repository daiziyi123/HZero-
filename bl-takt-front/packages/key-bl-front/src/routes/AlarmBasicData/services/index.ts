/**
 * @Author: Auto Generated
 * @Date: 2026-06-09
 * @Description: 报警基础数据-接口
 */

import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';

const apiPrefix = '/bl-base';
const organizationId = getCurrentOrganizationId();

// 保存
export function saveAlarmType() {
  return {
    url: `${apiPrefix}/v1/${organizationId}/alarm-type`,
    method: 'POST',
  };
}

// 编辑保存
export const updateAlarmType = params =>
  request(`${apiPrefix}/v1/${organizationId}/alarm-type`, {
    method: 'PUT',
    body: params,
  });

// 删除
export const deleteAlarmType = params =>
  request(`${apiPrefix}/v1/${organizationId}/alarm-type`, {
    method: 'DELETE',
    body: params,
  });

// 导出
export const exportAlarmBasicData = () => `${apiPrefix}/v1/${organizationId}/alarm-type/export`;
