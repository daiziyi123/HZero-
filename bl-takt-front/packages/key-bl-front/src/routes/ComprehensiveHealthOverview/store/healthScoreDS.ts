/**
 * @Description: 机器人健康评分 - DataSet 配置
 */

import moment, { Moment } from 'moment';
import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { HiRecord } from '../services';

/** 健康度等级：1优秀，2良好，3预警，4异常 */
export const HEALTH_LEVEL_TEXT: Record<number, string> = {
  1: '优秀',
  2: '良好',
  3: '预警',
  4: '异常',
};

export const HEALTH_LEVEL_OPTIONS = [
  { value: 1, label: '优秀' },
  { value: 2, label: '良好' },
  { value: 3, label: '预警' },
  { value: 4, label: '异常' },
];

export function getHealthLevelText(level?: number): string {
  if (level == null) {
    return '';
  }
  return HEALTH_LEVEL_TEXT[level] || '';
}

export function getHealthLevelStyle(level?: number): { backgroundColor: string; color: string } {
  const styles: Record<number, { backgroundColor: string; color: string }> = {
    1: { backgroundColor: '#dcfce7', color: '#18a058' },
    2: { backgroundColor: '#fef3c7', color: '#f59e0b' },
    3: { backgroundColor: '#fed7aa', color: '#ea580c' },
    4: { backgroundColor: '#fee2e2', color: '#dc2626' },
  };
  return styles[level ?? 0] || { backgroundColor: '#f1f5f9', color: '#64748b' };
}

export function healthScoreHistoryTableDS(): DataSetProps {
  return {
    autoQuery: false,
    autoCreate: false,
    selection: false,
    primaryKey: 'id',
    paging: 'server',
    pageSize: 5,
    fields: [
      { name: 'id', type: FieldType.string },
      { name: 'scoreDate', type: FieldType.string, label: '评分日期' },
      { name: 'healthScore', type: FieldType.number, label: 'HI评分' },
      { name: 'healthLevel', type: FieldType.number, label: 'HI等级' },
      { name: 'statusScore', type: FieldType.number, label: '状态类' },
      { name: 'performanceScore', type: FieldType.number, label: '性能类' },
      { name: 'qualityScore', type: FieldType.number, label: '质量类' },
      { name: 'lifeScore', type: FieldType.number, label: '寿命类' },
      { name: 'mainRiskFactor', type: FieldType.string, label: '主要风险因子' },
    ],
  };
}

const formatScoreDate = (value?: string) => {
  if (!value) {
    return '';
  }
  const parsed = moment(value);
  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : value;
};

export function mapHiRecords(list: HiRecord[]) {
  return list.map((item) => ({
    id: String(item.id ?? `${item.equipmentId}-${item.scoreDate}`),
    scoreDate: formatScoreDate(item.scoreDate),
    healthScore: item.healthScore,
    healthLevel: item.healthLevel,
    statusScore: item.statusScore,
    performanceScore: item.performanceScore,
    qualityScore: undefined,
    lifeScore: item.lifeScore,
    mainRiskFactor: item.mainRiskFactor,
  }));
}

/* ============ 趋势折线图：按日期范围动态聚合 ============ */

export type TrendGranularity = 'day' | 'week' | 'month';

export interface HealthTrendPoint {
  label: string;
  healthScore: number | null;
  statusScore: number | null;
  performanceScore: number | null;
  lifeScore: number | null;
}

/**
 * 根据日期跨度选择聚合粒度：
 * - ≤ 15 天：按天（每天一个节点）
 * - 16 ~ 92 天：按周（每周一个节点，取均值）
 * - > 92 天：按月（每月一个节点，取均值）
 */
export function pickTrendGranularity(spanDays: number): TrendGranularity {
  if (spanDays <= 15) return 'day';
  if (spanDays <= 92) return 'week';
  return 'month';
}

function bucketOf(date: Moment, granularity: TrendGranularity): { key: string; sort: number; label: string } {
  if (granularity === 'day') {
    const d = date.clone().startOf('day');
    return { key: d.format('YYYY-MM-DD'), sort: d.valueOf(), label: d.format('M/D') };
  }
  if (granularity === 'week') {
    const d = date.clone().startOf('isoWeek');
    return { key: d.format('YYYY-MM-DD'), sort: d.valueOf(), label: d.format('M/D') };
  }
  const d = date.clone().startOf('month');
  return { key: d.format('YYYY-MM'), sort: d.valueOf(), label: d.format('YYYY/M') };
}

function average(values: Array<number | null | undefined>): number | null {
  const nums = values.filter((v): v is number => typeof v === 'number' && !Number.isNaN(v));
  if (nums.length === 0) return null;
  const sum = nums.reduce((acc, v) => acc + v, 0);
  return Math.round((sum / nums.length) * 10) / 10;
}

/**
 * 将 HI 评分记录按日期范围聚合为趋势节点。
 * 日期跨度越大，聚合粒度越粗，避免节点过密。
 */
export function buildHealthTrend(
  records: HiRecord[],
  startDate?: Moment | null,
  endDate?: Moment | null,
): HealthTrendPoint[] {
  if (!records || records.length === 0) {
    return [];
  }

  const validDates = records
    .map((r) => moment(r.scoreDate))
    .filter((d) => d.isValid());

  if (validDates.length === 0) {
    return [];
  }

  let spanDays: number;
  if (startDate && endDate) {
    spanDays = Math.max(endDate.diff(startDate, 'days') + 1, 1);
  } else {
    spanDays = Math.max(moment.max(validDates).diff(moment.min(validDates), 'days') + 1, 1);
  }

  const granularity = pickTrendGranularity(spanDays);

  const groups = new Map<string, { sort: number; label: string; items: HiRecord[] }>();
  records.forEach((r) => {
    const d = moment(r.scoreDate);
    if (!d.isValid()) return;
    const { key, sort, label } = bucketOf(d, granularity);
    const group = groups.get(key);
    if (group) {
      group.items.push(r);
    } else {
      groups.set(key, { sort, label, items: [r] });
    }
  });

  return Array.from(groups.values())
    .sort((a, b) => a.sort - b.sort)
    .map((group) => ({
      label: group.label,
      healthScore: average(group.items.map((i) => i.healthScore)),
      statusScore: average(group.items.map((i) => i.statusScore)),
      performanceScore: average(group.items.map((i) => i.performanceScore)),
      lifeScore: average(group.items.map((i) => i.lifeScore)),
    }));
}
