import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Button, Icon } from 'choerodon-ui';
import { DateTimePicker, Table, DataSet } from 'choerodon-ui/pro';
import moment, { Moment } from 'moment';
import * as echarts from 'echarts';
import { ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import {
  CycleRecord,
  filterCyclesByDate,
  ThresholdConfig,
} from '../data/detailMock';

interface CycleTrendTabProps {
  cycles: CycleRecord[];
  thresholds: ThresholdConfig;
  active?: boolean;
}

const CycleTrendTab: React.FC<CycleTrendTabProps> = ({ cycles, thresholds, active = true }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState<Moment>(() => moment().startOf('day'));
  const [endDate, setEndDate] = useState<Moment>(() => moment());
  const [filtered, setFiltered] = useState<CycleRecord[]>(() => cycles);
  const [activeCycleId, setActiveCycleId] = useState<number | null>(
    cycles.length ? cycles[0].id : null,
  );

  const activeCycle = useMemo(
    () => filtered.find((c) => c.id === activeCycleId) || filtered[0],
    [filtered, activeCycleId],
  );

  const tableDs = useMemo(
    () =>
      new DataSet({
        autoQuery: false,
        selection: false,
        paging: true,
        pageSize: 5,
        fields: [
          { name: 'index', type: FieldType.number, label: '序号' },
          { name: 'startTime', type: FieldType.string, label: '开始时间' },
          { name: 'endTime', type: FieldType.string, label: '结束时间' },
          { name: 'peakTorque', type: FieldType.number, label: '峰值转矩(Nm)' },
          { name: 'overThreshold', type: FieldType.string, label: '超阈值' },
        ],
        data: filtered.map((c) => ({
          id: c.id,
          index: c.index,
          startTime: c.startTime,
          endTime: c.endTime,
          peakTorque: c.peakTorque,
          overThreshold: c.peakTorque > thresholds.torque.mild ? '超阈值' : '正常',
        })),
      }),
    [filtered, thresholds.torque.mild],
  );

  useLayoutEffect(() => {
    if (!active || !chartRef.current || !activeCycle) return undefined;

    let cleanup: (() => void) | undefined;
    const timer = setTimeout(() => {
      if (!chartRef.current) return;
      const chart = echarts.init(chartRef.current);
      const t = activeCycle.trend;
      chart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['反馈速度 (rpm)', '反馈位置 (mm)', '转矩/推力 (%)'] },
        grid: { containLabel: true, left: 50, right: 50, top: 40, bottom: 40 },
        xAxis: { type: 'category', data: t.timestamps, axisLabel: { rotate: 30 } },
        yAxis: [
          { type: 'value', name: '速度/转矩' },
          { type: 'value', name: '位置' },
        ],
        series: [
          { name: '反馈速度 (rpm)', type: 'line', data: t.speeds, smooth: true, color: '#3b82f6' },
          { name: '转矩/推力 (%)', type: 'line', data: t.torques, smooth: true, color: '#f97316' },
          { name: '反馈位置 (mm)', type: 'line', data: t.positions, smooth: true, color: '#10b981', yAxisIndex: 1 },
        ],
      });
      const handleResize = () => chart.resize();
      window.addEventListener('resize', handleResize);
      cleanup = () => {
        window.removeEventListener('resize', handleResize);
        chart.dispose();
      };
    }, 300);

    return () => {
      clearTimeout(timer);
      cleanup?.();
    };
  }, [activeCycle, active]);

  const handleQuery = () => {
    const start = startDate ? startDate.toDate() : null;
    const end = endDate ? endDate.toDate() : null;
    if (end) end.setHours(23, 59, 59);
    const next = filterCyclesByDate(cycles, start, end);
    setFiltered(next);
    setActiveCycleId(next.length ? next[0].id : null);
  };

  const handleReset = () => {
    setStartDate(moment().startOf('day'));
    setEndDate(moment());
    setFiltered(cycles);
    setActiveCycleId(cycles.length ? cycles[0].id : null);
  };

  return (
    <div className="sd-card">
      <div className="sd-card-title">
        <Icon type="show_chart" />
        循环趋势与生产记录
      </div>
      <div className="sd-split-layout">
        <div className="sd-trend-area">
          <div className="sd-sub-title">
            <Icon type="scatter_plot" />
            周期内连续趋势
          </div>
          <div ref={chartRef} className="sd-chart-container" />
          <div className="sd-subnote">点击右侧记录行，查看该循环的连续变化曲线</div>
        </div>
        <div className="sd-records-area">
          <div className="sd-sub-title">
            <Icon type="format_list_numbered" />
            生产循环记录
          </div>
          <div className="sd-filter-bar">
            <div className="sd-filter-group">
              <label>起始</label>
              <DateTimePicker value={startDate} onChange={(v) => v && setStartDate(v)} />
            </div>
            <div className="sd-filter-group">
              <label>结束</label>
              <DateTimePicker value={endDate} onChange={(v) => v && setEndDate(v)} />
            </div>
            <Button type="primary" className="sd-query-btn" onClick={handleQuery}>
              查询
            </Button>
            <Button className="sd-reset-btn" onClick={handleReset}>
              重置
            </Button>
          </div>
          <Table
            dataSet={tableDs}
            onRow={({ record }) => ({
              onClick: () => {
                const id = record.get('id') as number;
                setActiveCycleId(id);
              },
              className: record.get('id') === activeCycleId ? 'sd-row-active' : '',
            })}
            columns={[
              { name: 'index', width: 60, align: ColumnAlign.center },
              { name: 'startTime', width: 140 },
              { name: 'endTime', width: 140 },
              {
                name: 'peakTorque',
                width: 100,
                align: ColumnAlign.center,
                renderer: ({ value }) => <strong>{Number(value).toFixed(1)} Nm</strong>,
              },
              {
                name: 'overThreshold',
                width: 80,
                align: ColumnAlign.center,
                renderer: ({ value }) =>
                  value === '超阈值' ? (
                    <span className="sd-over-threshold">⚠️超阈值</span>
                  ) : (
                    '正常'
                  ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default CycleTrendTab;
