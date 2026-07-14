import React, { useLayoutEffect, useRef } from 'react';
import { Icon } from 'choerodon-ui';
import * as echarts from 'echarts';
import { DailyAlarmStat } from '../../data/detailMock';

interface AlarmStackChartProps {
  data: DailyAlarmStat[];
  height?: number;
}

const AlarmStackChart: React.FC<AlarmStackChartProps> = ({ data, height = 300 }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!chartRef.current) return undefined;
    let cleanup: (() => void) | undefined;

    const timer = setTimeout(() => {
      const chart = echarts.init(chartRef.current);
      const dates = data.map((d) => d.date);

      chart.setOption({
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          textStyle: { fontSize: 12 },
        },
        legend: {
          top: 4,
          left: 'center',
          itemWidth: 14,
          itemHeight: 10,
          itemGap: 20,
          textStyle: { fontSize: 11, color: '#64748b' },
          data: ['夹紧超时', '松开超时', '报警总数'],
        },
        grid: { left: 48, right: 24, top: 44, bottom: 28 },
        xAxis: {
          type: 'category',
          data: dates,
          axisLine: { lineStyle: { color: '#cbd5e1' } },
          axisTick: { show: false },
          axisLabel: { color: '#94a3b8', fontSize: 10, interval: 4 },
        },
        yAxis: {
          type: 'value',
          name: '报警次数',
          min: 0,
          max: 50,
          interval: 10,
          nameTextStyle: { color: '#64748b', fontSize: 11 },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#e2e8f0' } },
          axisLabel: { color: '#94a3b8', fontSize: 10 },
        },
        series: [
          {
            name: '夹紧超时',
            type: 'bar',
            stack: 'alarm',
            barMaxWidth: 18,
            itemStyle: { color: '#dc2626' },
            data: data.map((d) => d.clampTimeout),
          },
          {
            name: '松开超时',
            type: 'bar',
            stack: 'alarm',
            barMaxWidth: 18,
            itemStyle: { color: '#f59e0b' },
            data: data.map((d) => d.releaseTimeout),
          },
          {
            name: '报警总数',
            type: 'line',
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { color: '#2563eb', width: 2.5 },
            itemStyle: { color: '#2563eb' },
            data: data.map((d) => d.total),
          },
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
  }, [data]);

  return (
    <div className="cd-alarm-chart-card">
      <div className="cd-alarm-chart-head">
        <Icon type="bar_chart" className="cd-alarm-chart-icon" />
        <span className="cd-alarm-chart-title">每日报警统计 (堆叠柱状图 + 总数折线)</span>
      </div>
      <div ref={chartRef} style={{ width: '100%', height }} />
    </div>
  );
};

export default AlarmStackChart;
