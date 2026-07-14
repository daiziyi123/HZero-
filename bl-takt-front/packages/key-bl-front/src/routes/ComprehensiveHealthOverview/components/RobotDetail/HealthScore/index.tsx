

import React, { useState, useRef, useLayoutEffect, useMemo, useEffect, useCallback } from 'react';
import { Icon, DatePicker, Button, Select } from 'choerodon-ui';
import { Table, DataSet } from 'choerodon-ui/pro';
import moment, { Moment } from 'moment';
import { observer } from 'mobx-react-lite';
import * as echarts from 'echarts';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { getCurrentOrganizationId } from 'utils/utils';
import {
  healthScoreHistoryTableDS,
  mapHiRecords,
  getHealthLevelText,
  getHealthLevelStyle,
  HEALTH_LEVEL_OPTIONS,
  buildHealthTrend,
  HealthTrendPoint,
} from '../../../store/healthScoreDS';
import { queryHiRecordPage, queryLastHiRecord, HiRecord } from '../../../services';

/** 趋势图一次性拉取的最大记录数（用于聚合，覆盖较长日期范围） */
const TREND_FETCH_SIZE = 1000;

const { Option } = Select;

interface HealthScoreProps {
  device?: {
    score?: number;
    status?: string;
  };
  active?: boolean;
  equipmentId?: number;
}

const formatScoreDisplay = (value?: number | null) => (value == null ? '-' : `${Math.round(Number(value))}`);
const clampPercent = (value?: number | null) => Math.max(0, Math.min(100, Number(value) || 0));
const formatDateParam = (value?: Moment | null) => (value ? value.format('YYYY-MM-DD') : '');
const formatDiagnosisTime = (value?: string) => {
  if (!value) return '--';
  const parsed = moment(value);
  return parsed.isValid() ? parsed.format('YYYY/MM/DD HH:mm:ss') : value;
};

const getScoreBarColor = (type: string) => {
  const colors: Record<string, string> = {
    status: '#3b82f6',
    performance: '#18a058',
    quality: '#f59e0b',
    lifespan: '#8b5cf6',
  };
  return colors[type] || '#64748b';
};

const HealthScore = ({ device, active = true, equipmentId }: HealthScoreProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  const [startDate, setStartDate] = useState<Moment>(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState<Moment>(moment());
  const [healthLevel, setHealthLevel] = useState<number | undefined>(undefined);
  const [summary, setSummary] = useState<HiRecord | null>(null);
  const [trendData, setTrendData] = useState<HealthTrendPoint[]>([]);

  const tableDs = useMemo(() => new DataSet(healthScoreHistoryTableDS()), []);

  const columns: ColumnProps[] = useMemo(() => [
    { name: 'scoreDate', label: '评分日期', align: ColumnAlign.center, width: 120 },
    {
      name: 'healthScore',
      label: 'HI评分',
      align: ColumnAlign.center,
      width: 120,
      renderer: ({ value }) => <span style={{ fontWeight: 600, color: '#1e293b' }}>{value ?? '-'}</span>,
    },
    {
      name: 'healthLevel',
      label: 'HI等级',
      align: ColumnAlign.center,
      width: 90,
      renderer: ({ value }) => (
        <span
          style={{
            ...getHealthLevelStyle(value),
            fontSize: 12,
            fontWeight: 600,
            padding: '4px 12px',
            borderRadius: 12,
          }}
        >
          {getHealthLevelText(value) || '-'}
        </span>
      ),
    },
    { name: 'statusScore', label: '状态类', align: ColumnAlign.center, width: 120, renderer: ({ value }) => (value ?? '-') },
    { name: 'performanceScore', label: '性能类', align: ColumnAlign.center, width: 120, renderer: ({ value }) => (value ?? '-') },
    { name: 'qualityScore', label: '质量类', align: ColumnAlign.center, width: 120, renderer: ({ value }) => (value ?? '-') },
    { name: 'lifeScore', label: '寿命类', align: ColumnAlign.center, width: 120, renderer: ({ value }) => (value ?? '-') },
    {
      name: 'mainRiskFactor',
      label: '主要风险因子',
      align: ColumnAlign.center,
      renderer: ({ value }) => <span style={{ color: '#64748b', fontSize: 13 }}>{value}</span>,
    },
  ], []);

  const fetchSummary = useCallback(async () => {
    if (!equipmentId) {
      setSummary(null);
      return;
    }
    try {
      const data = await queryLastHiRecord(equipmentId);
      setSummary(data);
    } catch {
      setSummary(null);
    }
  }, [equipmentId]);

  const fetchTableData = useCallback(async (
    nextStartDate = startDate,
    nextEndDate = endDate,
    nextHealthLevel = healthLevel,
    page = tableDs.currentPage,
    size = tableDs.pageSize,
  ) => {
    if (!equipmentId) {
      tableDs.loadData([]);
      tableDs.totalCount = 0;
      return;
    }
    try {
      const result = await queryHiRecordPage({
        equipmentId,
        tenantId: getCurrentOrganizationId(),
        scoreDate: formatDateParam(nextStartDate) || undefined,
        startDate: formatDateParam(nextStartDate) || undefined,
        endDate: formatDateParam(nextEndDate) || undefined,
        healthLevel: nextHealthLevel,
        page: Math.max(page - 1, 0),
        size,
      });
      tableDs.loadData(mapHiRecords(result.content));
      tableDs.totalCount = result.totalElements;
    } catch {
      tableDs.loadData([]);
      tableDs.totalCount = 0;
    }
  }, [tableDs, startDate, endDate, healthLevel, equipmentId]);

  const fetchTrendData = useCallback(async (
    nextStartDate = startDate,
    nextEndDate = endDate,
  ) => {
    if (!equipmentId) {
      setTrendData([]);
      return;
    }
    try {
      const result = await queryHiRecordPage({
        equipmentId,
        tenantId: getCurrentOrganizationId(),
        scoreDate: formatDateParam(nextStartDate) || undefined,
        startDate: formatDateParam(nextStartDate) || undefined,
        endDate: formatDateParam(nextEndDate) || undefined,
        page: 0,
        size: TREND_FETCH_SIZE,
      });
      setTrendData(buildHealthTrend(result.content, nextStartDate, nextEndDate));
    } catch {
      setTrendData([]);
    }
  }, [startDate, endDate, equipmentId]);

  const loadData = useCallback(async (
    nextStartDate = startDate,
    nextEndDate = endDate,
    nextHealthLevel = healthLevel,
    resetPage = true,
  ) => {
    if (resetPage) {
      tableDs.currentPage = 1;
    }
    await Promise.all([
      fetchSummary(),
      fetchTableData(nextStartDate, nextEndDate, nextHealthLevel, tableDs.currentPage, tableDs.pageSize),
      fetchTrendData(nextStartDate, nextEndDate),
    ]);
  }, [fetchSummary, fetchTableData, fetchTrendData, startDate, endDate, healthLevel, tableDs]);

  useEffect(() => {
    if (!active) return;
    loadData();
  }, [active, equipmentId]);

  useEffect(() => {
    const handlePageChange = () => {
      if (!active || !equipmentId) return;
      fetchTableData(startDate, endDate, healthLevel, tableDs.currentPage, tableDs.pageSize);
    };

    tableDs.addEventListener('query', handlePageChange);
    return () => {
      tableDs.removeEventListener('query', handlePageChange);
    };
  }, [active, equipmentId, tableDs, fetchTableData, startDate, endDate, healthLevel]);

  const subScores = useMemo(() => ([
    { key: 'status', label: '状态类', value: summary?.statusScore, color: getScoreBarColor('status') },
    { key: 'performance', label: '性能类', value: summary?.performanceScore, color: getScoreBarColor('performance') },
    { key: 'quality', label: '质量类', value: undefined as number | undefined, color: getScoreBarColor('quality') },
    { key: 'lifespan', label: '寿命类', value: summary?.lifeScore, color: getScoreBarColor('lifespan') },
  ]), [summary]);

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }
    const chart = chartInstanceRef.current;

    const labels = trendData.map((p) => p.label);
    const seriesData = [
      { name: 'HI综合评分', key: 'healthScore' as const, color: '#f59e0b', symbol: 'circle', area: true, mark: false, icon: 'path://M128,512 A128,128 0 1,1 384,512 A128,128 0 1,1 128,512 M512,512 L896,512' },
      { name: '状态类', key: 'statusScore' as const, color: '#3b82f6', symbol: 'diamond', area: false, mark: true, icon: 'path://M256,256 L384,512 L256,768 L128,512 Z M512,512 L896,512' },
      { name: '性能类', key: 'performanceScore' as const, color: '#18a058', symbol: 'triangle', area: false, mark: false, icon: 'path://M256,401 L384,623 L128,623 Z M512,512 L896,512' },
      { name: '寿命类', key: 'lifeScore' as const, color: '#8b5cf6', symbol: 'roundRect', area: false, mark: false, icon: 'path://M168,384 L344,384 A40,40 0 0 1 384,424 L384,600 A40,40 0 0 1 344,640 L168,640 A40,40 0 0 1 128,600 L128,424 A40,40 0 0 1 168,384 Z M512,512 L896,512' },
    ];

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        borderRadius: 6,
        textStyle: { color: '#1e293b', fontSize: 12 },
        extraCssText: 'box-shadow: 0 2px 8px rgba(0,0,0,0.08);',
        formatter: (params: any) => {
          let result = `<div style="font-weight:600;margin-bottom:10px;color:#64748b;font-size:14px;">${params[0].axisValue}</div>`;
          params.forEach((item: any) => {
            const val = item.value == null ? '-' : item.value;
            result += `<div style="display:flex;align-items:center;gap:10px;margin:6px 0;">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${item.color};"></span>
              <span style="flex:1;font-size:13px;">${item.seriesName}</span>
              <span style="font-weight:600;font-size:13px;color:${item.color};">${val}</span>
            </div>`;
          });
          return result;
        },
      },
      legend: {
        show: true,
        top: 0,
        left: 'center',
        itemWidth: 40,
        itemHeight: 20,
        itemGap: 20,
        textStyle: {
          color: '#64748b',
          fontSize: 13,
        },
        data: seriesData.map((s) => ({ name: s.name, icon: s.icon })),
      },
      grid: {
        left: 40,
        right: 10,
        top: 55,
        bottom: 55,
      },
      xAxis: {
        type: 'category',
        data: labels,
        axisLine: { lineStyle: { color: '#cbd5e1' } },
        axisTick: { show: false },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        name: '评分',
        nameTextStyle: { color: '#64748b', fontSize: 12, padding: [0, 40, 0, 0] },
        min: 0,
        max: 100,
        interval: 20,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#e2e8f0', type: 'solid' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
      },
      series: seriesData.map((s) => ({
        name: s.name,
        type: 'line',
        smooth: false,
        symbol: s.symbol,
        symbolSize: 10,
        connectNulls: true,
        lineStyle: {
          color: s.color,
          width: 2.5,
          type: 'solid',
        },
        itemStyle: {
          color: s.color,
        },
        areaStyle: s.area ? {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(245, 158, 11, 0.5)' },
            { offset: 1, color: 'rgba(245, 158, 11, 0)' },
          ]),
        } : undefined,
        markPoint: s.mark ? {
          data: [
            { type: 'max', name: '最高' },
            { type: 'min', name: '最低' },
          ],
          label: {
            color: '#fff',
            fontSize: 11,
            formatter: '{c}',
          },
        } : undefined,
        data: trendData.map((p) => p[s.key]),
      })),
    };

    chart.setOption(option, true);
    chart.resize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => chart.resize(), 100);
    };
    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [trendData]);

  useEffect(() => {
    return () => {
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  const handleSearch = () => {
    loadData(startDate, endDate, healthLevel);
  };

  const handleReset = () => {
    const defaultStartDate = moment().subtract(7, 'days');
    const defaultEndDate = moment();
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    setHealthLevel(undefined);
    loadData(defaultStartDate, defaultEndDate, undefined);
  };

  const badgeStyle = getHealthLevelStyle(summary?.healthLevel);

  return (
    <div className="health-score-panel">
      <div className="score-card">
        <div className="main-score-section">
          <div className="left-section">
            <div className="score-circle-container">
              <div className="score-circle">
                <span className="score-value">{formatScoreDisplay(summary?.healthScore)}</span>
                <span className="score-total">/100</span>
              </div>
            </div>
            <span
              className="health-level-badge"
              style={{ backgroundColor: badgeStyle.backgroundColor, color: badgeStyle.color }}
            >
              综合评级 · {getHealthLevelText(summary?.healthLevel) || '未知'}
            </span>
          </div>
          <div className="score-time">
            <Icon type="access_time_filled" className="time-icon" />
            <span>诊断时间: {formatDiagnosisTime(summary?.scoreDate)}</span>
          </div>
        </div>

        <div className="sub-scores">
          {subScores.map((item) => (
            <div key={item.key} className="sub-score-item">
              <div className="sub-score-header">
                <span className="sub-score-label">{item.label}</span>
                <span className="sub-score-value">
                  <span style={{ color: item.color }}>{item.value == null ? '-' : Math.round(item.value)}</span>
                  <span className="sub-score-total">/100</span>
                </span>
              </div>
              <div className="sub-score-bar">
                <div
                  className="sub-score-fill"
                  style={{ width: `${clampPercent(item.value)}%`, backgroundColor: item.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-card">
        <div ref={chartRef} className="chart-echarts"></div>
      </div>

      <div className="history-table-card">
        <div className="filter-bar">
          <div className="filter-row">
            <div className="filter-item">
              <span className="filter-label">起始日期</span>
              <DatePicker
                className="filter-input"
                value={startDate}
                onChange={(value) => setStartDate(value)}
              />
            </div>
            <div className="filter-item">
              <span className="filter-label">结束日期</span>
              <DatePicker
                className="filter-input"
                value={endDate}
                onChange={(value) => setEndDate(value)}
              />
            </div>
            <div className="filter-item">
              <span className="filter-label">HI等级</span>
              <Select
                className="filter-select"
                placeholder="全部"
                value={healthLevel}
                allowClear
                onChange={(value: any) => setHealthLevel(value)}
              >
                {HEALTH_LEVEL_OPTIONS.map((opt) => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
            </div>
            <div className="filter-actions">
              <Button type="primary" className="filter-btn-search" onClick={handleSearch}>查询</Button>
              <Button className="filter-btn-reset" onClick={handleReset}>重置</Button>
            </div>
          </div>
        </div>

        <div className="table-header">
          <Icon type="history" className="table-icon" />
          <span className="table-title">健康评分历史记录</span>
        </div>

        <Table
          dataSet={tableDs}
          columns={columns}
        />
      </div>

      <style>{`
        .health-score-panel {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          min-width: 100%;
          box-sizing: border-box;
        }

        .score-card {
          background: #f8fafc;
          border-radius: 16px;
          padding: 24px;
          border:1px solid #e8e9ebff;
        }

        .main-score-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 20px;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 20px;
        }

        .left-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .score-circle-container {
          width: 80px;
          height: 80px;
          background: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #e2e8f0;
        }

        .score-circle {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .score-value {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1;
        }

        .score-total {
          font-size: 12px;
          color: #94a3b8;
        }

        .health-level-badge {
          font-size: 14px;
          font-weight: 600;
          padding: 6px 16px;
          border-radius: 20px;
          background: #dcfce7;
          color: #18a058;
        }

        .score-time {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f1f5f9;
          padding: 6px 12px;
          border-radius: 20px;
        }

        .time-icon {
          font-size: 14px !important;
          color: #64748b !important;
        }

        .score-time span {
          font-size: 13px;
          color: #64748b;
        }

        .sub-scores {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .sub-score-item {
          background: #ffffff;
          border-radius: 10px;
          padding: 12px;
          border: 1px solid #e2e8f0;
        }

        .sub-score-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .sub-score-label {
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
        }

        .sub-score-value {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
        }

        .sub-score-total {
          font-size: 12px;
          color: #94a3b8;
          margin-left: 2px;
        }

        .sub-score-bar {
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .sub-score-fill {
          height: 100%;
          border-radius: 3px;
        }

        .chart-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          width: 100%;
          min-width: 100%;
          box-sizing: border-box;
          overflow: visible;
        }

        .chart-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .chart-echarts {
          width: 100%;
          min-width: 100%;
          height: 320px;
          display: block;
          box-sizing: border-box;
        }

        .history-table-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .table-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .table-icon {
          font-size: 18px !important;
          color: #1e293b !important;
        }

        .table-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .filter-bar {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          padding: 16px 20px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .filter-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .filter-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-label {
          font-size: 13px;
          color: #64748b;
          white-space: nowrap;
        }

        .filter-input {
          width: 130px;
        }

        .filter-input .c7n-input,
        .filter-input .c7n-calendar-picker-input {
          height: 30px !important;
          min-height: 30px !important;
          font-size: 12px !important;
          padding: 0 8px !important;
        }

        .filter-select {
          width: 180px;
        }

        .filter-select .c7n-select-selection {
          height: 30px !important;
          min-height: 30px !important;
          font-size: 12px !important;
          display: flex !important;
          align-items: center !important;
          padding: 0 30px 0 8px !important;
        }

        .filter-select .c7n-select-arrow {
          right: 10px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          font-size: 10px !important;
        }

        .filter-select .c7n-select-selection__rendered {
          line-height: 1 !important;
          margin: 0 !important;
          display: flex !important;
          align-items: center !important;
          height: 100% !important;
        }

        .filter-select .c7n-select-selection-selected-value {
          font-size: 12px !important;
        }

        .filter-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .filter-btn-search {
          border-radius: 4px !important;
          padding: 0 20px !important;
          height: 28px !important;
          font-size: 13px !important;
          border: 1px solid #3b82f6 !important;
          background: #3b82f6 !important;
          color: #eff6ff !important;
        }

        .filter-btn-reset {
          border-radius: 4px !important;
          padding: 0 20px !important;
          height: 28px !important;
          font-size: 13px !important;
          color: #64748b !important;
          background: #ffffff !important;
          border: 1px solid #d1d5db !important;
          box-shadow: none !important;
        }

        .filter-btn-reset:hover {
          color: #3b82f6 !important;
          border-color: #3b82f6 !important;
        }

        .history-table-card .c7n-pro-table {
          border: none !important;
        }

        .history-table-card .c7n-pro-table table {
          border: none !important;
        }

        .history-table-card .c7n-pro-table th,
        .history-table-card .c7n-pro-table td {
          border: none !important;
          border-bottom: 1px solid #e1e4e7ff !important;
        }

        .history-table-card .c7n-pro-table thead th {
          background: #eff3f7ff !important;
          font-weight: 600 !important;
          color: #475569 !important;
        }
      `}</style>
    </div>
  );
};

export default observer(HealthScore);
