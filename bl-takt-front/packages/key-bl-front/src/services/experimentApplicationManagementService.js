/**
 * @Description: 实验申请管理
 * @Author: <liyuan01.liu@hand-china.com>
 * @Date: 2022-08-02
 * @LastEditTime: 2022-08-08
 * @LastEditors: <liyuan01.liu@hand-china.com>
 */

import request from 'utils/request';
import { LIMS_HOST } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const LIMS_HOST = '/lims-197601';
const tenantId = getCurrentOrganizationId();

/**
 * main-提交审批
 * @async
 * @function submitForApprovalApi
 * @param params - 请求参数
 * @returns {object} fetch Promise
 */
export async function submitForApprovalApi(params) {
  return request(`${LIMS_HOST}/v1/${tenantId}/lims-experiment-applications/submit`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 类似创建
 * @async
 * @function similarToCreateApi
 * @param params - 查询条件
 * @returns {object} fetch Promise
 */
export async function similarToCreateApi(params) {
  return request(
    `${LIMS_HOST}/v1/${tenantId}/lims-experiment-applications/copy/${params.applicationId}`,
    {
      method: 'GET',
    },
  );
}

/**
 * main-下载检测报告
 * @async
 * @function downloadTestReportApi
 * @param params - 请求参数
 * @returns {object} fetch Promise
 */
export async function downloadTestReportApi(params) {
  return request(`${LIMS_HOST}/v1/${tenantId}/lims-experiment-applications/download`, {
    method: 'POST',
    body: params,
  });
}

/**
 * main-撤回审批
 * @async
 * @function withdrawApprovalApi
 * @param params - 请求参数
 * @returns {object} fetch Promise
 */
export async function withdrawApprovalApi(params) {
  return request(`${LIMS_HOST}/v1/${tenantId}/lims-experiment-applications/with-draw`, {
    method: 'POST',
    body: params,
  });
}

/**
 * main-删除申请单
 * @async
 * @function deleteApplicationFormApi
 * @param params - 请求参数
 * @returns {object} fetch Promise
 */
export async function deleteApplicationFormApi(params) {
  return request(`${LIMS_HOST}/v1/${tenantId}/lims-experiment-applications/delete`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 实验申请表明细
 * @async
 * @function goToDetailsByRequisitionApi
 * @param params - 查询条件
 * @returns {object} fetch Promise
 */
export async function goToDetailsByRequisitionApi(params) {
  return request(
    `${LIMS_HOST}/v1/${tenantId}/lims-experiment-applications/${params.applicationId}`,
    {
      method: 'GET',
    },
  );
}

/**
 * main-获取动态展示字段
 * @async
 * @function getDynamicDisplayFieldsApi
 * @param params - 请求参数
 * @returns {object} fetch Promise
 */
export async function getDynamicDisplayFieldsApi(params) {
  return request(`${LIMS_HOST}/v1/${tenantId}/lims-experiment-applications/config`, {
    method: 'POST',
    body: params,
  });
}

/**
 * Detail-保存申请单
 * @async
 * @function saveApplicationApi
 * @param params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveApplicationApi(params) {
  return request(`${LIMS_HOST}/v1/${tenantId}/lims-experiment-applications`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 实验申请表明细-approvalFlow
 * @async
 * @function approvalFlowDetailsApi
 * @param params - 查询条件
 * @returns {object} fetch Promise
 */
export async function approvalFlowDetailsApi(params) {
  // const approvalFlowTenantId = 2;
  return request(
    `${LIMS_HOST}/v1/${tenantId}/lims-experiment-applications/${params.applicationId}`,
    {
      method: 'GET',
    },
  );
}

/**
 * Detail-保存申请单-approvalFlow
 * @async
 * @function saveApplicationApi
 * @param params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveApprovalFlowApi(params) {
  // const approvalFlowTenantId = 2;
  return request(`${LIMS_HOST}/v1/${tenantId}/lims-experiment-applications/save`, {
    method: 'POST',
    body: params,
  });
}

/**
 * main-获取动态展示字段-approvalFlow
 * @async
 * @function getDynamicDisplayFieldsApi
 * @param params - 请求参数
 * @returns {object} fetch Promise
 */
export async function getDynamicApprovalFlowApi(params) {
  // const approvalFlowTenantId = 2;
  return request(`${LIMS_HOST}/v1/${tenantId}/lims-experiment-applications/config`, {
    method: 'POST',
    body: params,
  });
}

// 请求网址: http://10.112.20.123:30002/iam/hzero/v1/menus/tree?lang=zh_CN&roldId=20&unionLabel=false
export async function getMenuInfo() {
  return request('/iam/hzero/v1/menus/tree', {
    method: 'GET',
  });
}

/**
 * 查询实验报告模板值集-getReportLov
 * @async
 * @function getReportLov
 * @param params - 请求参数
 * @returns {object} fetch Promise
 */
export async function getReportLov(params) {
  const { unitId } = params;
  return request(`${LIMS_HOST}/v1/${tenantId}/lovs/sql/data`, {
    method: 'GET',
    query: {
      lovCode: 'MT.LIMS.EXPERIMENT_REPORT_TEMPLATE',
      page: 0,
      size: 100,
      tenantId,
      unitId,
    },
  });
}

/**
 * 查询样品管理员值集-getReviewerLov
 * @async
 * @function getReviewerLov
 * @param params - 请求参数
 * @returns {object} fetch Promise
 */
export async function getReviewerLov(params) {
  const { unitId, userId } = params;
  return request(`${LIMS_HOST}/v1/${tenantId}/lovs/sql/data`, {
    method: 'GET',
    query: {
      lovCode: 'MT.EXPERIMENT_APPROVER',
      name: '穆鹏云',
      page: 0,
      size: 10,
      tenantId,
      unitId,
      userId,
    },
  });
}

export async function getMangers(params) {
  const { userId } = params;
  return request(`${LIMS_HOST}/v1/${tenantId}/lims-experiment-applications/managers`, {
    method: 'GET',
    query: {
      // lovCode: 'MT.EXPERIMENT_APPROVER',
      // name: '穆鹏云',
      // page: 0,
      // size: 10,
      tenantId,
      // unitId,
      userId,
    },
  });
}

/**
 * 根据用户编码获取用户信息
 * @param employeeNums - 用户编码 eg: num1,num2,num3....
 * @returns {Promise}
 */
export async function getUsersMsg(employeeNums) {
  return request(`/hpfm/v1/${tenantId}/employee-users/employee-num`, {
    method: 'GET',
    query: {
      employeeNums,
    },
  });
}

/**
 * 根据实验申请单id获取附言详情
 * @param applicationId
 * @returns {Promise<*>}
 */
export async function getPostscriptList(applicationId) {
  return request(`${LIMS_HOST}/v1/${tenantId}/lims-experiment-postscripts`, {
    method: 'GET',
    query: {
      applicationId,
    },
  });
}

/**
 * 根据实验申请单id获取附言详情
 * @param applicationId
 * @returns {Promise<*>}
 */
export async function savePostscript(params) {
  return request(`${LIMS_HOST}/v1/${tenantId}/lims-experiment-postscripts`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 终止实验申请任务
 * @param businessKey
 * @param applicationId
 * @returns {Promise<*>}
 */
export async function discontinueTask(params) {
  return request(`${LIMS_HOST}/v1/${tenantId}/lims-experiment-applications/workflow-end`, {
    method: 'GET',
    query: params,
  });
}
