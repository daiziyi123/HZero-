import React, { useLayoutEffect, useRef, useState } from 'react';
import { Button, Icon } from 'choerodon-ui';
import { DateTimePicker } from 'choerodon-ui/pro';
import moment, { Moment } from 'moment';
import * as echarts from 'echarts';
import { CycleRecord, ThresholdConfig } from '../data/detailMock';

interface PeakAnalysisTabProps {
  cycles: CycleRecord[];
  thresholds: ThresholdConfig;
  active?: boolean;
}

const buildPeakOption = (
  x: string[],
  vals: number[],
  thresholdVal: number,
  yName: string,
  unit: string,
) => {
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const sigma =
    vals.length > 1
      ? Math.sqrt(vals.map((v) => (v - mean) ** 2).reduce((a, b) => a + b, 0) / vals.length)
      : 0;
  const ucl = mean + 3 * sigma;
  const lcl = mean - 3 * sigma;

  return {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: x, name: '循环序号' },
    yAxis: { type: 'value', name: yName },
    series: [{
      name: yName,
      type: 'line',
      data: vals,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { width: 2, color: '#dc2626' },
      itemStyle: {
        color: (params: { dataIndex: number }) =>
          vals[params.dataIndex] > thresholdVal ? '#ef4444' : '#3b82f6',
      },
      markLine: {
        silent: false,
        symbol: 'none',
        data: [
          {
            yAxis: ucl,
            name: 'UCL',
            lineStyle: { color: '#f97316', type: 'dashed' },
            label: { formatter: `UCL: ${ucl.toFixed(1)} ${unit}` },
          },
          {
            yAxis: mean,
            name: 'CL',
            lineStyle: { color: '#3b82f6', type: 'solid' },
            label: { formatter: `CL: ${mean.toFixed(1)} ${unit}` },
          },
          {
            yAxis: lcl,
            name: 'LCL',
            lineStyle: { color: '#f97316', type: 'dashed' },
            label: { formatter: `LCL: ${lcl.toFixed(1)} ${unit}` },
          },
        ],
      },
    }],
  };
};

const PeakAnalysisTab: React.FC<PeakAnalysisTabProps> = ({ cycles, thresholds, active = true }) => {
  const torqueRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef<HTMLDivElement>(null);
  const [torqueStart, setTorqueStart] = useState<Moment | null>(null);
  const [torqueEnd, setTorqueEnd] = useState<Moment | null>(null);
  const [speedStart, setSpeedStart] = useState<Moment | null>(null);
  const [speedEnd, setSpeedEnd] = useState<Moment | null>(null);

  const filterCycles = (start: Moment | null, end: Moment | null) =>
    cycles.filter((c) => {
      if (start && c.rawEnd < start.toDate()) return false;
      if (end && c.rawStart > end.toDate()) return false;
      return true;
    });

  const renderTorque = (start: Moment | null, end: Moment | null) => {
    if (!torqueRef.current) return;
    const filtered = filterCycles(start, end);
    const chart = echarts.getInstanceByDom(torqueRef.current) || echarts.init(torqueRef.current);
    if (!filtered.length) {
      chart.setOption({ title: { show: true, text: '无符合条件的循环数据' }, series: [] });
      chart.resize();
      return;
    }
    const x = filtered.map((c) => `#${c.index}`);
    const vals = filtered.map((c) => c.peakTorque);
    chart.setOption(
      buildPeakOption(x, vals, thresholds.torque.mild, '峰值转矩 / 推力 (Nm)', 'Nm'),
      true,
    );
    chart.resize();
  };

  const renderSpeed = (start: Moment | null, end: Moment | null) => {
    if (!speedRef.current) return;
    const filtered = filterCycles(start, end);
    const chart = echarts.getInstanceByDom(speedRef.current) || echarts.init(speedRef.current);
    if (!filtered.length) {
      chart.setOption({ title: { show: true, text: '无符合条件的循环数据' }, series: [] });
      chart.resize();
      return;
    }
    const x = filtered.map((c) => `#${c.index}`);
    const vals = filtered.map((c) => c.peakSpeed);
    chart.setOption(
      buildPeakOption(x, vals, thresholds.speed.mild, '峰值反馈速度 (rpm)', 'rpm'),
      true,
    );
    chart.resize();
  };

  useLayoutEffect(() => {
    if (!active) return undefined;
    const timer = setTimeout(() => {
      if (cycles.length) {
        const min = moment(Math.min(...cycles.map((c) => c.rawStart.getTime())));
        const max = moment(Math.max(...cycles.map((c) => c.rawEnd.getTime())));
        setTorqueStart(min);
        setTorqueEnd(max);
        setSpeedStart(min);
        setSpeedEnd(max);
      }
      renderTorque(null, null);
      renderSpeed(null, null);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycles, active, thresholds]);

  return (
    <>
      <div className="sd-card">
        <div className="sd-card-title">
          <Icon type="bar_chart" />
          循环峰值转矩/推力分析 (UCL/CL/LCL)
        </div>
        <div className="sd-filter-bar">
          <div className="sd-filter-group">
            <label>起始</label>
            <DateTimePicker value={torqueStart} onChange={(v) => setTorqueStart(v || null)} />
          </div>
          <div className="sd-filter-group">
            <label>结束</label>
            <DateTimePicker value={torqueEnd} onChange={(v) => setTorqueEnd(v || null)} />
          </div>
          <Button type="primary" className="sd-query-btn" onClick={() => renderTorque(torqueStart, torqueEnd)}>
            查询
          </Button>
          <div className="sd-subnote">
            红色点为超过转矩轻度阈值的点，辅助线: UCL(CL+3σ) / CL(均值) / LCL(CL-3σ)
          </div>
        </div>
        <div ref={torqueRef} className="sd-peak-chart" />
      </div>

      <div className="sd-card sd-card-mt">
        <div className="sd-card-title">
          <Icon type="bar_chart" />
          循环峰值反馈速度分析 (UCL/CL/LCL)
        </div>
        <div className="sd-filter-bar">
          <div className="sd-filter-group">
            <label>起始</label>
            <DateTimePicker value={speedStart} onChange={(v) => setSpeedStart(v || null)} />
          </div>
          <div className="sd-filter-group">
            <label>结束</label>
            <DateTimePicker value={speedEnd} onChange={(v) => setSpeedEnd(v || null)} />
          </div>
          <Button type="primary" className="sd-query-btn" onClick={() => renderSpeed(speedStart, speedEnd)}>
            查询
          </Button>
          <div className="sd-subnote">
            红色点为超过速度轻度阈值的点，辅助线: UCL(CL+3σ) / CL(均值) / LCL(CL-3σ)
          </div>
        </div>
        <div ref={speedRef} className="sd-peak-chart" />
      </div>
    </>
  );
};

export default PeakAnalysisTab;
