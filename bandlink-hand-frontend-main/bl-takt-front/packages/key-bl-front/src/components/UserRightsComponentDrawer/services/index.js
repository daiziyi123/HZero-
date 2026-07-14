/**
 * @Description: 用户检验权限维护- 接口
 * @Author: <yang.ni01@hand-china.com>
 * @Date: 2023-02-28 10:33:05
 * @LastEditTime: 2023-06-14 14:19:33
 * @LastEditors: <yang.ni01@hand-china.com>
 */

import { getCurrentOrganizationId } from 'utils/utils';
import { BASIC } from '@utils/config';

const tenantId = getCurrentOrganizationId();



// 详情数据保存
export function saveUserInspectPermissionConfig() {
  return {
    url: `${BASIC.TARZAN_SAMPLING}/v1/${tenantId}/mt-user-inspect-permission/save/ui`,
    method: 'POST',
  };
}
// 详情数据保存
export function deleteUserInspectPermissionConfig() {
  return {
    url: `${BASIC.TARZAN_SAMPLING}/v1/${tenantId}/mt-user-inspect-permission/delete/ui`,
    method: 'POST',
  };
}

// 查询组织树
export function GetOrgTree() {
  return {
    url: `${BASIC.TARZAN_MODEL}/v1/${tenantId}/mt-user-organization/tree/ui`,
    method: 'GET',
  };
}

// 查询库位树
export function GetLocatorTree() {
  return {
    url: `${BASIC.TARZAN_MODEL}/v1/${tenantId}/mt-user-organization/all/locator/tree/ui`,
    method: 'GET',
  };
}

// 查询用户已分配的组织信息
export function GetUserOrgList() {
  return {
    url: `${BASIC.TARZAN_MODEL}/v1/${tenantId}/mt-user-organization/limit-user/ui`,
    method: 'GET',
  };
}

// 用户权限分配
export function UserOrganizationSave() {
  return {
    url: `${BASIC.TARZAN_MODEL}/v1/${tenantId}/mt-user-organization/batch/save/ui`,
    method: 'POST',
  };
}

// 设定用户默认组织
export function SetUserDefaultOrganization() {
  return {
    url: `${BASIC.TARZAN_MODEL}/v1/${tenantId}/mt-user-organization/default-flag/update/ui`,
    method: 'POST',
  };
}
