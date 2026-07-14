/*
 * service - 实验任务管理
 * @date: 2022-08-04
 * @author: eyhuang <enyi.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2022, Hand
 */
import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
const prefix = `/key-lims/v1`;
// const prefix = `/lims-197601/v1`;

/**
 * doQueryTaskRecordGroups - 查询实验环境（第二层）
 * @export
 * @param {Object} params
 * @returns
 */
export async function doQueryTaskRecordGroups(params) {
  const { taskItemId } = params;
  return request(`${prefix}/${organizationId}/lims-task-record-groups/list/${taskItemId}`, {
    method: 'GET',
  });
}

/**
 * doQueryTaskRecordItems - 查询实验记录项（第三层）
 * @export
 * @param {Object} params
 * @returns
 */
export async function doQueryTaskRecordItems(params) {
  const { groupId } = params;
  return request(`${prefix}/${organizationId}/lims-task-record-items/list/${groupId}`, {
    method: 'GET',
  });
}

/**
 * doChangeTemplate - 更新检查项目（更换模板）
 * @export
 * @param {Object} params
 * @returns
 */
export async function doChangeTemplate(params) {
  const { changeTmpFlag, data } = params;
  return request(`${prefix}/${organizationId}/lims-experiment-task-items/changeTemplate`, {
    method: 'POST',
    body: data,
    query: {
      changeTmpFlag,
    },
  });
}

/**
 * doQuerySampleList - 查询样品编码
 * @export
 * @param {Object} params
 * @returns
 */
export async function doQuerySampleList(params) {
  const { applicationId } = params;
  return request(`${prefix}/${organizationId}/lims-experiment-applications/dtl`, {
    method: 'GET',
    query: {
      applicationId,
    },
  });
}

/**
 * doSaveGroup - 保存实验环境
 * @export
 * @param {Object} params
 * @returns
 */
export async function doSaveGroup(params) {
  const { templeteId, data } = params;
  return request(`${prefix}/${organizationId}/lims-task-record-groups/save`, {
    method: 'POST',
    body: data,
    query: {
      templeteId,
    },
  });
}

/**
 * doQueryCheckOrigin - 查询实验记录项目-检测原始记录数据
 * @export
 * @param {Object} params
 * @returns
 */
export async function doQueryCheckOrigin(params) {
  const { groupId } = params;
  return request(`${prefix}/${organizationId}/lims-task-record-items/data/${groupId}`, {
    method: 'GET',
  });
}

/**
 * doSaveCheckOrigin - 保存实验记录项目-检测原始记录数据
 * @export
 * @param {Object} params
 * @returns
 */
export async function doSaveCheckOrigin(params) {
  const { data, groupId } = params;
  return request(`${prefix}/${organizationId}/lims-task-record-items/data/save`, {
    method: 'POST',
    body: data,
    query: { groupId },
  });
}

/**
 * doManualAdd - 手动新增实验记录项
 * @export
 * @param {Object} params
 * @returns
 */
export async function doManualAdd(params) {
  const { data, groupId } = params;
  return request(`${prefix}/${organizationId}/lims-task-record-items/save`, {
    method: 'POST',
    body: data,
    query: { groupId },
  });
}

/**
 * doUpdateExperimentStatus - 更新实验任务状态
 * @export
 * @param {Object} params
 * @returns
 */
export async function doUpdateExperimentStatus(params) {
  const { taskId, taskStatus, terminationReason } = params;
  return request(`${prefix}/${organizationId}/lims-experiment-tasks/update-status/${taskId}`, {
    method: 'POST',
    query: { taskStatus, terminationReason },
  });
}

/**
 * doSubmit - 提交审批
 * @export
 * @param {Object} params
 * @returns
 */
export async function doSubmit(params) {
  return request(`${prefix}/${organizationId}/lims-experiment-tasks/submit`, {
    method: 'GET',
    query: params,
  });
}
/**
 * doSendBack - 申请退回
 * @export
 * @param {Object} params
 * @returns
 */
export async function doSendBack(params) {
  return request(`${prefix}/${organizationId}/lims-experiment-tasks/return/submit`, {
    method: 'GET',
    query: params,
  });
}

/**
 * doReportVerification - 生成报告校验
 * @export
 * @param {Object} params
 * @returns
 */
export async function doReportVerification(params) {
  return request(`${prefix}/${organizationId}/lims-experiment-tasks/verify`, {
    method: 'POST',
    body: params,
  });
}

/**
 * doQueryDefaultTemplate - 获取默认模板
 * @export
 * @param {Object} params
 * @returns
 */
export async function doQueryDefaultTemplate(params) {
  return request(`${prefix}/${organizationId}/lims-experiment-tasks/query/experiment/file`, {
    method: 'GET',
    query: params,
  });
}

/**
 * doCreateReport - 生成报告
 * @export
 * @param {Object} params
 * @returns
 */
export async function doCreateReport(params) {
  return request(`${prefix}/${organizationId}/lims-experiment-tasks/task-report-create`, {
    method: 'POST',
    body: params,
  });
}

/**
 * doUpdateExperimentTask - 更新实验任务
 * @export
 * @param {Object} params
 * @returns
 */
export async function doUpdateExperimentTask(params) {
  return request(`${prefix}/${organizationId}/lims-experiment-tasks/update`, {
    method: 'POST',
    body: params,
  });
}

/**
 * doBatchUpdateExperimentTask - 批量更新实验任务
 * @export
 * @param {Object} params
 * @returns
 */
export async function doBatchUpdateExperimentTask(params) {
  return request(`${prefix}/${organizationId}/lims-experiment-tasks/batch-update`, {
    method: 'POST',
    body: params,
  });
}

/**
 * doUploadCompress - 上传文件（缩略图）
 * @export
 * @param {Object} params
 * @returns
 */
export async function doUploadCompress(params) {
  return request(`${prefix}/${organizationId}/lims-picture-compress-rels/file-compress`, {
    method: 'GET',
    query: params,
  });
}

/**
 * doDeleteCompress - 删除文件（缩略图）
 * @export
 * @param {Object} params
 * @returns
 */
export async function doDeleteCompress(params) {
  return request(`${prefix}/${organizationId}/lims-picture-compress-rels/file-compress-delete`, {
    method: 'GET',
    query: params,
  });
}
