import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Button, Icon, message } from 'choerodon-ui';
import { DateTimePicker, Modal, NumberField, Table, DataSet } from 'choerodon-ui/pro';
import moment, { Moment } from 'moment';
import * as echarts from 'echarts';
import { ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import {
  filterWarningsByDate,
  generateSampleWarnings,
  ThresholdConfig,
  WarningRecord,
} from '../data/detailMock';

interface ThresholdWarningTabProps {
  thresholds: ThresholdConfig;
  onThresholdsChange: (next: ThresholdConfig) => void;
  active?: boolean;
}

const ThresholdWarningTab: React.FC<ThresholdWarningTabProps> = ({
  thresholds,
  onThresholdsChange,
  active = true,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [warnings, setWarnings] = useState<WarningRecord[]>(() => generateSampleWarnings());
  const [filtered, setFiltered] = useState<WarningRecord[]>(() => generateSampleWarnings());
  const [startDate, setStartDate] = useState<Moment>(() => moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState<Moment>(() => moment());

  const stats = useMemo(() => {
    let torque = 0;
    let speed = 0;
    let pos = 0;
    let mild = 0;
    let moderate = 0;
    let severe = 0;
    filtered.forEach((r) => {
      if (r.param === '转矩/推力') torque += 1;
      else if (r.param === '反馈速度') speed += 1;
      else pos += 1;
      if (r.level === '轻度') mild += 1;
      else if (r.level === '中度') moderate += 1;
      else severe += 1;
    });
    return { torque, speed, pos, mild, moderate, severe };
  }, [filtered]);

  const tableDs = useMemo(
    () =>
      new DataSet({
        autoQuery: false,
        selection: false,
        paging: true,
        pageSize: 10,
        fields: [
          { name: 'param', type: FieldType.string, label: '参数' },
          { name: 'value', type: FieldType.string, label: '实际值' },
          { name: 'level', type: FieldType.string, label: '等级' },
          { name: 'timeStr', type: FieldType.string, label: '时间' },
        ],
        data: filtered,
      }),
    [filtered],
  );

  useLayoutEffect(() => {
    if (!active || !chartRef.current) return undefined;

    let cleanup: (() => void) | undefined;
    const timer = setTimeout(() => {
      if (!chartRef.current) return;
      const chart = echarts.init(chartRef.current);
      const daily = new Map<string, { mild: number; moderate: number; severe: number }>();
      filtered.forEach((r) => {
        const date = new Date(r.timestamp).toISOString().slice(0, 10);
        if (!daily.has(date)) daily.set(date, { mild: 0, moderate: 0, severe: 0 });
        const d = daily.get(date)!;
        if (r.level === '轻度') d.mild += 1;
        else if (r.level === '中度') d.moderate += 1;
        else d.severe += 1;
      });
      const dates = Array.from(daily.keys()).sort();
      const mildData = dates.map((d) => daily.get(d)!.mild);
      const moderateData = dates.map((d) => daily.get(d)!.moderate);
      const severeData = dates.map((d) => daily.get(d)!.severe);
      const totalData = dates.map((_, i) => mildData[i] + moderateData[i] + severeData[i]);

      chart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['总预警次数', '轻度', '中度', '严重'] },
        xAxis: { type: 'category', data: dates },
        yAxis: { type: 'value', name: '次数' },
        series: [
          { name: '总预警次数', type: 'line', data: totalData, smooth: true, color: '#3b82f6' },
          { name: '轻度', type: 'bar', data: mildData, stack: 'level', color: '#f59e0b' },
          { name: '中度', type: 'bar', data: moderateData, stack: 'level', color: '#f97316' },
          { name: '严重', type: 'bar', data: severeData, stack: 'level', color: '#ef4444' },
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
  }, [filtered, active]);

  const applyFilter = () => {
    const startTs = startDate ? startDate.valueOf() : null;
    const endTs = endDate ? endDate.valueOf() : null;
    setFiltered(filterWarningsByDate(warnings, startTs, endTs));
  };

  const resetFilter = () => {
    setStartDate(moment().subtract(7, 'days'));
    setEndDate(moment());
    setFiltered(warnings);
  };

  const openThresholdModal = () => {
    const draft = { ...thresholds, torque: { ...thresholds.torque }, speed: { ...thresholds.speed }, position: { ...thresholds.position } };
    Modal.open({
      title: '参数阈值预警设置',
      style: { width: 720 },
      children: (
        <div className="sd-threshold-config">
          {[
            { key: 'torque' as const, title: '转矩/推力 (Nm)', icon: 'speed' },
            { key: 'speed' as const, title: '反馈速度 (rpm)', icon: 'speed' },
            { key: 'position' as const, title: '反馈位置 (mm)', icon: 'open_with' },
          ].map((card) => (
            <div key={card.key} className="sd-threshold-card">
              <h4>
                <Icon type={card.icon} />
                {card.title}
              </h4>
              {(['mild', 'moderate', 'severe'] as const).map((level) => (
                <div key={level} className="sd-threshold-row">
                  <span>{level === 'mild' ? '轻度' : level === 'moderate' ? '中度' : '严重'}阈值:</span>
                  <NumberField
                    value={draft[card.key][level]}
                    onChange={(v) => {
                      draft[card.key][level] = Number(v) || 0;
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      ),
      onOk: () => {
        onThresholdsChange({
          torque: { ...draft.torque },
          speed: { ...draft.speed },
          position: { ...draft.position },
        });
        message.success('阈值设置已保存');
      },
    });
  };

  const statCards = [
    { type: 'torque', icon: 'speed', count: stats.torque, label: '转矩/推力预警总数' },
    { type: 'speed', icon: 'speed', count: stats.speed, label: '反馈速度预警总数' },
    { type: 'position', icon: 'open_with', count: stats.pos, label: '反馈位置预警总数' },
    { type: 'mild', icon: 'warning', count: stats.mild, label: '轻度预警总数' },
    { type: 'moderate', icon: 'warning', count: stats.moderate, label: '中度预警总数' },
    { type: 'severe', icon: 'error', count: stats.severe, label: '严重预警总数' },
  ];

  return (
    <div className="sd-card">
      <div className="sd-card-title sd-card-title-between">
        <span>
          <Icon type="warning" />
          预警记录与分析
        </span>
        <Button className="sd-threshold-btn" onClick={openThresholdModal}>
          <Icon type="tune" />
          参数阈值预警设置
        </Button>
      </div>

      <div className="sd-warning-header">
        <div className="sd-filter-bar">
          <div className="sd-filter-group">
            <label>起始</label>
            <DateTimePicker value={startDate} onChange={(v) => v && setStartDate(v)} />
          </div>
          <div className="sd-filter-group">
            <label>结束</label>
            <DateTimePicker value={endDate} onChange={(v) => v && setEndDate(v)} />
          </div>
          <Button type="primary" className="sd-query-btn" onClick={applyFilter}>
            筛选
          </Button>
          <Button className="sd-reset-btn" onClick={resetFilter}>
            重置
          </Button>
        </div>
        <Button
          className="sd-gen-sample-btn"
          onClick={() => {
            const samples = generateSampleWarnings();
            setWarnings(samples);
            setFiltered(samples);
          }}
        >
          <Icon type="storage" />
          生成示例预警数据
        </Button>
      </div>

      <div className="sd-stats-row">
        {statCards.map((s) => (
          <div key={s.type} className="sd-stat-card" data-type={s.type}>
            <Icon type={s.icon} className="sd-stat-icon" />
            <div className="sd-stat-number">{s.count}</div>
            <div className="sd-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="sd-sub-title">
        <Icon type="show_chart" />
        预警趋势分析 (按天)
      </div>
      <div ref={chartRef} className="sd-trend-chart-container" />

      <div className="sd-warning-list-section">
        <div className="sd-sub-title">
          <Icon type="format_list_bulleted" />
          预警明细列表
        </div>
        <Table
          dataSet={tableDs}
          columns={[
            { name: 'param', align: ColumnAlign.left },
            { name: 'value', align: ColumnAlign.center },
            {
              name: 'level',
              align: ColumnAlign.center,
              renderer: ({ value }) => (
                <span className="sd-level-pill">{value}</span>
              ),
            },
            { name: 'timeStr', align: ColumnAlign.left },
          ]}
        />
      </div>
    </div>
  );
};

export default ThresholdWarningTab;
