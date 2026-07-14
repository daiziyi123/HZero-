/**
 * 获取当前用户信息
 */
import { getSession } from 'utils/utils';

export {
  getCurrentOrganizationId,
  getUserOrganizationId,
  getCurrentUserId,
  getCurrentUser,
  getCurrentRole,
  getCurrentTenant,
  isTenantRoleLevel,
} from 'utils/utils';

/**
 * 当前用户所属员工
 */
export function getCurrentUserEmployee() {
  return getSession('currentUserEmployee') || {};
}
/**
 * 当前用户主岗
 */
export function getCurrentUserEmployeePrimaryAssigns() {
  return getSession('currentUserEmployeeAssigns') || [];
}
/**
 * 当前用户主岗对应部门信息
 */
export function getCurrentUserEmployeeDept() {
  return getSession('currentUserEmployeeDept') || {};
}
