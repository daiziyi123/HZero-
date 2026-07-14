import request from 'utils/request';
import { LIMS_HOST } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 查询对象类型列表数据
 * @async
 * @function fetchEventList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchEventList(params) {
  const param = parseParameters({
    page: params.page,
  });
  return request(`${LIMS_HOST}/v1/${tenantId}/mt-event/property/list/ui`, {
    method: 'POST',
    query: param,
    body: params,
  });
}

/**
 * 查询对象详细信息数据
 * @async
 * @function fetchParentEventDetails
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchParentEventDetails(params) {
  return request(`${LIMS_HOST}/v1/${tenantId}/mt-event/limit-parent/list/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询对象详细信息数据
 * @async
 * @function fetchEventDetails
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchEventDetails(params) {
  return request(
    `${LIMS_HOST}/v1/${tenantId}/mt-event-object-type-rel/limit-type/property/list/ui`,
    {
      method: 'GET',
      query: params,
    }
  );
}

/**
 * 对象类型保存
 * @async
 * @function saveEvent
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveEvent(params) {
  return request(`${LIMS_HOST}/v1/mt-bom-reference-point/${tenantId}/save/ui}`, {
    method: 'POST',
    body: params,
  });
}
