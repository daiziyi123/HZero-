/**
 * @Description: 设备健康概览页面 - API 接口
 * @Author: Assistant
 * @Date: 2026-07-06
 */

import { getCurrentOrganizationId } from 'utils/utils';
import request from 'utils/request';

const apiPrefix = '/dev-health-manager-xswang';
const organizationId = getCurrentOrganizationId();

/**
 * 健康等级统计项
 * number: 数量
 * proportion: 占比（0-1 之间的小数）
 * type: 健康等级类型（1-健康，2-良好，3-警告，4-严重）
 */
export interface HealthScoreQuantityItem {
    number: number;
    proportion: number;
    type: number;
}

/**
 * 设备健康等级数量统计（饼图/统计卡片）
 * @param deviceType 设备类型编码
 */
export function getQuantityStatisticsByDeviceType(deviceType: string | number) {
    return request(`${apiPrefix}/v1/${organizationId}/ehm-health-score-results/getQuantityStatisticsByDeviceType`, {
        method: 'GET',
        query: { type: deviceType },
    });
}

/**
 * 设备健康等级列表
 * @param deviceType 设备类型编码
 */
export function listQuantityStatisticsByDeviceType(deviceType: string | number) {
    return request(`${apiPrefix}/v1/${organizationId}/ehm-health-score-results/listQuantityStatisticsByDeviceType`, {
        method: 'GET',
        query: { type: deviceType },
    });
}

/**
 * 全部设备健康明细数据集
 */
export function listAllHealthScoreResults() {
    return request(`${apiPrefix}/v1/${organizationId}/ehm-health-score-results/listAll`, {
        method: 'GET',
    });
}
