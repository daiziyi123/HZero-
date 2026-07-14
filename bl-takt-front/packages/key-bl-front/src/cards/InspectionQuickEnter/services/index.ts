import { BASIC } from '@utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

const endUrl = ``;

// 获取业务类型
export function FetchWorkbenchType() {
  return {
    url: `${BASIC.TARZAN_SAMPLING}${endUrl}/v1/${tenantId}/mt-inspect-workbench/permission/type/ui`,
    method: 'GET',
  };
}

// 获取待检验数量
export function FetchWorkbenchCount() {
  return {
    url: `${BASIC.TARZAN_SAMPLING}${endUrl}/v1/${tenantId}/mt-inspect-workbench/permission/task/count/ui`,
    method: 'POST',
  };
}
