import React, { useState, useRef, useLayoutEffect, useMemo, useCallback, useEffect } from 'react';
import { Icon, DatePicker, Select, Button } from 'choerodon-ui';
import { TextField } from 'choerodon-ui/pro';
import { Table, DataSet } from 'choerodon-ui/pro';
import moment, { Moment } from 'moment';
import { observer } from 'mobx-react-lite';
import * as echarts from 'echarts';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { getCurrentOrganizationId } from 'utils/utils';
import { alarmTableDS, mapAlarmRecords } from '../../../store/alarmAnalysisDS';
import { queryAlarmCollections, queryRobotAlarmCount, RobotAlarmCountItem } from '../../../services';

interface AlarmAnalysisProps {
  active?: boolean;
  deviceId?: number;
  prodLineId?: number;
  workcellId?: number;
}

const getSeverityLevelStyle = (level: string) => {
  const styles: Record<string, { backgroundColor: string; color: string }> = {
    '紧急': { backgroundColor: '#fee2e2', color: '#dc2626' },
    '警告': { backgroundColor: '#fef3c7', color: '#f59e0b' },
    '注意': { backgroundColor: '#dcfce7', color: '#18a058' },
  };
  return styles[level] || styles['注意'];
};

const formatDateParam = (value?: Moment | null) => (value ? value.format('YYYY-MM-DD') : '');
const formatDateTimeStart = (value?: Moment | null) => (value ? value.format('YYYY-MM-DD 00:00:00') : '');
const formatDateTimeEnd = (value?: Moment | null) => (value ? value.format('YYYY-MM-DD 23:59:59') : '');

const formatChartDateLabel = (dateStr: string) => {
  const parsed = moment(dateStr);
  if (parsed.isValid()) {
    return parsed.format('YYYY/M/D');
  }
  return dateStr;
};

const AlarmAnalysis: React.FC<AlarmAnalysisProps> = ({
  active = true,
  deviceId,
  prodLineId,
  workcellId,
}) => {
  const canQuery = Boolean(deviceId && prodLineId && workcellId);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  const [startDate, setStartDate] = useState<Moment>(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState<Moment>(moment());
  const [alarmCode, setAlarmCode] = useState('');
  const [alarmLevel, setAlarmLevel] = useState<string | undefined>(undefined);
  const [chartData, setChartData] = useState<RobotAlarmCountItem[]>([]);
  const [chartLoading, setChartLoading] = useState(false);

  const tableDs = useMemo(() => new DataSet(alarmTableDS()), []);

  const columns: ColumnProps[] = useMemo(() => [
    { name: 'alarmStartTime', label: '发生时间', align: ColumnAlign.center },
    { name: 'alarmCode', label: '报警代码', align: ColumnAlign.center },
    { name: 'alarmName', label: '报警内容', align: ColumnAlign.center },
    {
      name: 'alarmLevel',
      label: '严重等级',
      align: ColumnAlign.center,
      renderer: ({ value }) => (
        <span
          style={{
            ...getSeverityLevelStyle(value),
            fontSize: 12,
            fontWeight: 600,
            padding: '4px 12px',
            borderRadius: 12,
          }}
        >
          {value}
        </span>
      ),
    },
  ], []);

  const syncTableQueryParams = useCallback((
    nextStartDate = startDate,
    nextEndDate = endDate,
    nextAlarmCode = alarmCode,
    nextAlarmLevel = alarmLevel,
  ) => {
    tableDs.setQueryParameter('startDate', formatDateParam(nextStartDate));
    tableDs.setQueryParameter('endDate', formatDateParam(nextEndDate));
    tableDs.setQueryParameter('alarmCode', nextAlarmCode || undefined);
    tableDs.setQueryParameter('alarmLevel', nextAlarmLevel || undefined);
  }, [tableDs, startDate, endDate, alarmCode, alarmLevel]);

  const fetchTableData = useCallback(async (
    nextStartDate = startDate,
    nextEndDate = endDate,
    nextAlarmCode = alarmCode,
    nextAlarmLevel = alarmLevel,
    page = tableDs.currentPage,
    size = tableDs.pageSize,
  ) => {
    const start = formatDateTimeStart(nextStartDate);
    const end = formatDateTimeEnd(nextEndDate);
    if (!start || !end || !canQuery || !deviceId || !prodLineId || !workcellId) {
      tableDs.loadData([]);
      tableDs.totalCount = 0;
      return;
    }

    try {
      const result = await queryAlarmCollections({
        deviceId,
        prodLineId,
        workcellId,
        tenantId: getCurrentOrganizationId(),
        alarmStartTime: start,
        alarmEndTime: end,
        alarmCode: nextAlarmCode || '',
        alarmName: '',
        alarmPoint: '',
        dealFlag: '',
        alarmLevel: nextAlarmLevel || undefined,
        page: Math.max(page - 1, 0),
        size,
      });
      tableDs.loadData(mapAlarmRecords(result.content));
      tableDs.totalCount = result.totalElements;
    } catch {
      tableDs.loadData([]);
      tableDs.totalCount = 0;
    }
  }, [tableDs, startDate, endDate, alarmCode, alarmLevel, canQuery, deviceId, prodLineId, workcellId]);

  const fetchChartData = useCallback(async (
    nextStartDate = startDate,
    nextEndDate = endDate,
  ) => {
    const start = formatDateParam(nextStartDate);
    const end = formatDateParam(nextEndDate);
    if (!start || !end || !canQuery || !deviceId) {
      setChartData([]);
      return;
    }

    setChartLoading(true);
    try {
      const data = await queryRobotAlarmCount({
        deviceId,
        startDate: start,
        endDate: end,
      });
      setChartData(data);
    } catch {
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  }, [startDate, endDate, canQuery, deviceId]);

  const loadData = useCallback(async (
    nextStartDate = startDate,
    nextEndDate = endDate,
    nextAlarmCode = alarmCode,
    nextAlarmLevel = alarmLevel,
    resetPage = true,
  ) => {
    syncTableQueryParams(nextStartDate, nextEndDate, nextAlarmCode, nextAlarmLevel);
    if (resetPage) {
      tableDs.currentPage = 1;
    }
    await Promise.all([
      fetchTableData(nextStartDate, nextEndDate, nextAlarmCode, nextAlarmLevel, tableDs.currentPage, tableDs.pageSize),
      fetchChartData(nextStartDate, nextEndDate),
    ]);
  }, [syncTableQueryParams, fetchTableData, fetchChartData, startDate, endDate, alarmCode, alarmLevel, tableDs]);

  useEffect(() => {
    if (!active) return;
    loadData();
  }, [active, deviceId, prodLineId, workcellId]);

  useEffect(() => {
    const handlePageChange = () => {
      if (!active || !canQuery) return;
      fetchTableData(startDate, endDate, alarmCode, alarmLevel, tableDs.currentPage, tableDs.pageSize);
    };

    tableDs.addEventListener('query', handlePageChange);
    return () => {
      tableDs.removeEventListener('query', handlePageChange);
    };
  }, [active, canQuery, tableDs, fetchTableData, startDate, endDate, alarmCode, alarmLevel]);

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }
    const chart = chartInstanceRef.current;

    const dates = chartData.map((item) => formatChartDateLabel(item.date));
    const alarmCountData = chartData.map((item) => item.count);
    const maxCount = Math.max(...alarmCountData, 0);
    const yMax = maxCount <= 0 ? 5 : Math.ceil(maxCount * 1.2);

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
          const item = params[0];
          return `<div style="font-weight:600;margin-bottom:10px;color:#64748b;font-size:14px;">${item.axisValue}</div>
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${item.color};"></span>
                <span style="flex:1;font-size:13px;">报警次数</span>
                <span style="font-weight:600;font-size:13px;color:${item.color};">${item.value}</span>
              </div>`;
        },
      },
      grid: {
        left: 40,
        right: 10,
        top: 40,
        bottom: 55,
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: { lineStyle: { color: '#cbd5e1' } },
        axisTick: { show: false },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        name: '报警次数',
        nameTextStyle: { color: '#64748b', fontSize: 12, padding: [0, 40, 0, 0] },
        min: 0,
        max: yMax,
        splitNumber: 5,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#e2e8f0', type: 'solid' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
      },
      series: [{
        name: '报警次数',
        type: 'line',
        smooth: false,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          color: '#ef4444',
          width: 2.5,
          type: 'solid',
        },
        itemStyle: {
          color: '#ef4444',
          borderColor: '#fff',
          borderWidth: 2,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(239, 68, 68, 0.5)' },
            { offset: 1, color: 'rgba(239, 68, 68, 0)' },
          ]),
        },
        markPoint: maxCount > 0 ? {
          data: [{ type: 'max', name: '最高' }],
          label: {
            color: '#fff',
            fontSize: 11,
            formatter: '{c}',
          },
        } : undefined,
        data: alarmCountData,
      }],
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
  }, [chartData]);

  useEffect(() => {
    return () => {
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  const handleSearch = () => {
    loadData(startDate, endDate, alarmCode, alarmLevel);
  };

  const handleReset = () => {
    const defaultStartDate = moment().subtract(7, 'days');
    const defaultEndDate = moment();
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    setAlarmCode('');
    setAlarmLevel(undefined);
    loadData(defaultStartDate, defaultEndDate, '', undefined);
  };

  return (
    <div className="alarm-analysis-panel">
      <div className="chart-card">
        {chartLoading && <div className="chart-loading">加载中...</div>}
        <div ref={chartRef} className="chart-echarts"></div>
      </div>

      <div className="alarm-table-card">
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
              <span className="filter-label">报警代码</span>
              <TextField
                className="filter-input"
                placeholder="例如 SRVO-065"
                value={alarmCode}
                onChange={(value) => setAlarmCode(value)}
              />
            </div>
            <div className="filter-item">
              <span className="filter-label">报警等级</span>
              <Select
                className="filter-select"
                placeholder="全部"
                value={alarmLevel}
                allowClear
                onChange={(value) => setAlarmLevel(value)}
                data={{ options: [{ value: '紧急', label: '紧急' }, { value: '警告', label: '警告' }, { value: '注意', label: '注意' }] }}
              />
            </div>
            <div className="filter-actions">
              <Button type="primary" className="filter-btn-search" onClick={handleSearch}>查询</Button>
              <Button className="filter-btn-reset" onClick={handleReset}>重置</Button>
            </div>
          </div>
        </div>

        <div className="table-header">
          <Icon type="bell" className="table-icon" />
          <span className="table-title">报警记录列表</span>
        </div>

        <Table
          dataSet={tableDs}
          columns={columns}
          pagination={true}
          checkable={false}
        />
      </div>

      <style>{`
        .alarm-analysis-panel {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          min-width: 100%;
          box-sizing: border-box;
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
          position: relative;
        }

        .chart-loading {
          position: absolute;
          top: 16px;
          right: 24px;
          font-size: 12px;
          color: #94a3b8;
          z-index: 1;
        }

        .chart-echarts {
          width: 100%;
          min-width: 100%;
          height: 320px;
          display: block;
          box-sizing: border-box;
        }

        .alarm-table-card {
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
          color: #ef4444 !important;
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
          width: 140px;
        }

        .filter-input .c7n-input,
        .filter-input .c7n-calendar-picker-input {
          height: 30px !important;
          min-height: 30px !important;
          font-size: 12px !important;
          padding: 0 8px !important;
        }

        .filter-select {
          width: 120px;
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

        .alarm-table-card .c7n-pro-table {
          border: none !important;
        }

        .alarm-table-card .c7n-pro-table table {
          border: none !important;
        }

        .alarm-table-card .c7n-pro-table th,
        .alarm-table-card .c7n-pro-table td {
          border: none !important;
          border-bottom: 1px solid #e1e4e7ff !important;
        }

        .alarm-table-card .c7n-pro-table thead th {
          background: #eff3f7ff !important;
          font-weight: 600 !important;
          color: #475569 !important;
        }
      `}</style>
    </div>
  );
};

export default observer(AlarmAnalysis);
