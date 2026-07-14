/*
 * @Author: Auto Generated
 * @Date: 2026-07-02
 * @Description: SPR工作台服务
 */

import { getCurrentOrganizationId } from 'utils/utils';
import request from '@utils/request';

const apiPrefix = `/tarzan/v1/${getCurrentOrganizationId()}`;

/**
 * 获取SPR工作台指标数据
 */
export async function getSPRMetrics() {
  return request(`${apiPrefix}/spr/metrics`, {
    method: 'GET',
  });
}

/**
 * 获取SPR工作台图表数据
 */
export async function getSPRChartData(params?: any) {
  return request(`${apiPrefix}/spr/chart-data`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 获取SPR工作台表格数据
 */
export async function getSPRTableData(params?: any) {
  return request(`${apiPrefix}/spr/table-data`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 导出SPR数据
 */
export async function exportSPRData(params?: any) {
  return request(`${apiPrefix}/spr/export`, {
    method: 'POST',
    body: params,
  });
}
