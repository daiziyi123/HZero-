import React, { useLayoutEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { Icon } from 'choerodon-ui';
import { DatePicker } from 'choerodon-ui/pro';
import moment, { Moment } from 'moment';
import {
  riskCountTrendDates,
  riskCountTrendValues,
  riskDistribution,
  riskTypeSevereValues,
  riskTypeTrendDates,
  riskTypeWarningValues,
} from '../data/mockData';

const useEChart = (build: (el: HTMLDivElement) => void, deps: unknown[]) => {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!ref.current) return undefined;
    let chart: echarts.ECharts | undefined;
    const timer = setTimeout(() => {
      if (!ref.current) return;
      chart = echarts.init(ref.current);
      build(ref.current);
    }, 300);
    const handleResize = () => chart?.resize();
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      chart?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
};

const RiskCountTrend: React.FC = () => {
  const ref = useEChart((el) => {
    const chart = echarts.getInstanceByDom(el)!;
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 16, top: 30, bottom: 30 },
      xAxis: {
        type: 'category',
        data: riskCountTrendDates,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#cbd5e1' } },
        axisTick: { show: false },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        name: '风险电机数',
        nameTextStyle: { color: '#64748b', fontSize: 12 },
        min: 0,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#e2e8f0' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
      },
      series: [{
        name: '风险电机数',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#f59e0b', width: 2.5 },
        itemStyle: { color: '#f59e0b' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(245, 158, 11, 0.4)' },
            { offset: 1, color: 'rgba(245, 158, 11, 0.02)' },
          ]),
        },
        data: riskCountTrendValues,
      }],
    });
  }, []);
  return <div ref={ref} style={{ width: '100%', height: 260 }} />;
};

const RiskTypeBar: React.FC = () => {
  const ref = useEChart((el) => {
    const chart = echarts.getInstanceByDom(el)!;
    chart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['警告数量', '严重数量'], top: 0, right: 0, itemWidth: 12, itemHeight: 12, textStyle: { color: '#64748b', fontSize: 12 } },
      grid: { left: 40, right: 16, top: 36, bottom: 30 },
      xAxis: {
        type: 'category',
        data: riskTypeTrendDates,
        axisLine: { lineStyle: { color: '#cbd5e1' } },
        axisTick: { show: false },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        name: '电机数量',
        nameTextStyle: { color: '#64748b', fontSize: 12 },
        min: 0,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#e2e8f0' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
      },
      series: [
        { name: '警告数量', type: 'bar', stack: 'total', itemStyle: { color: '#f59e0b' }, barWidth: '55%', data: riskTypeWarningValues },
        { name: '严重数量', type: 'bar', stack: 'total', itemStyle: { color: '#ef4444' }, data: riskTypeSevereValues },
      ],
    });
  }, []);
  return <div ref={ref} style={{ width: '100%', height: 260 }} />;
};

const RiskDonut: React.FC = () => {
  const ref = useEChart((el) => {
    const chart = echarts.getInstanceByDom(el)!;
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c}台 ({d}%)' },
      legend: {
        orient: 'vertical',
        left: 0,
        top: 'center',
        itemWidth: 12,
        itemHeight: 12,
        textStyle: { color: '#475569', fontSize: 12 },
      },
      series: [{
        name: '风险电机分布',
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['62%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}: {d}%', fontSize: 11, color: '#64748b' },
        labelLine: { length: 12, length2: 8 },
        data: riskDistribution.map((item) => ({ value: item.value, name: item.name, itemStyle: { color: item.color } })),
      }],
    });
  }, []);
  return <div ref={ref} style={{ width: '100%', height: 320 }} />;
};

const DateRange: React.FC = () => {
  const [start, setStart] = useState<Moment>(moment('2026-06-06'));
  const [end, setEnd] = useState<Moment>(moment('2026-07-06'));
  return (
    <div className="sa-date-range">
      <DatePicker value={start} onChange={(v) => v && setStart(v)} />
      <span className="sa-date-sep">~</span>
      <DatePicker value={end} onChange={(v) => v && setEnd(v)} />
    </div>
  );
};

const ServoAnalytics: React.FC = () => (
  <div className="sa-wrap">
    <div className="sa-row">
      <div className="sa-panel">
        <div className="sa-panel-head">
          <div className="sa-panel-title"><Icon type="show_chart" className="sa-title-icon" />风险电机数量趋势 (警告+严重)</div>
          <DateRange />
        </div>
        <RiskCountTrend />
      </div>
      <div className="sa-panel">
        <div className="sa-panel-head">
          <div className="sa-panel-title"><Icon type="bar_chart" className="sa-title-icon" />风险类型趋势分析 (警告&严重)</div>
          <DateRange />
        </div>
        <RiskTypeBar />
      </div>
    </div>

    <div className="sa-panel">
      <div className="sa-panel-head">
        <div className="sa-panel-title"><Icon type="donut_large" className="sa-title-icon" />最新诊断风险电机分布 (警告+严重) · 按产线-工位</div>
      </div>
      <RiskDonut />
    </div>

    <style>{`
      .sa-wrap { margin-top: 20px; display: flex; flex-direction: column; gap: 16px; }
      .sa-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
      .sa-panel {
        background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 18px;
      }
      .sa-panel-head { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
      .sa-panel-title { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 700; color: #0f172a; }
      .sa-title-icon { font-size: 18px !important; color: #2563eb !important; }
      .sa-date-range { display: flex; align-items: center; gap: 8px; }
      .sa-date-range .c7n-pro-calendar-picker { width: 130px; }
      .sa-date-sep { color: #94a3b8; }
    `}</style>
  </div>
);

export default ServoAnalytics;
