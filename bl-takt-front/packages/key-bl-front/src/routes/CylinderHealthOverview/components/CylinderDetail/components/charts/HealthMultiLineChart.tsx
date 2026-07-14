import React, { useLayoutEffect, useRef } from 'react';
import { Icon } from 'choerodon-ui';
import * as echarts from 'echarts';
import { HealthTrendPoint } from '../../data/detailMock';

interface HealthMultiLineChartProps {
  data: HealthTrendPoint[];
  height?: number;
}

const HealthMultiLineChart: React.FC<HealthMultiLineChartProps> = ({ data, height = 320 }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!chartRef.current) return undefined;
    let cleanup: (() => void) | undefined;

    const timer = setTimeout(() => {
      const chart = echarts.init(chartRef.current);
      const dates = data.map((d) => d.date);

      chart.setOption({
        tooltip: { trigger: 'axis' },
        legend: {
          top: 4,
          left: 'center',
          itemWidth: 24,
          itemHeight: 10,
          itemGap: 16,
          textStyle: { fontSize: 11, color: '#64748b' },
          data: ['HI综合得分', '性能类', '状态类', '寿命类'],
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
          name: '得分',
          min: 0,
          max: 100,
          interval: 20,
          nameTextStyle: { color: '#64748b', fontSize: 11 },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#e2e8f0' } },
          axisLabel: { color: '#94a3b8', fontSize: 10 },
        },
        series: [
          {
            name: 'HI综合得分',
            type: 'line',
            data: data.map((d) => d.hiScore),
            symbol: 'circle',
            symbolSize: 5,
            lineStyle: { color: '#2563eb', width: 2.5 },
            itemStyle: { color: '#2563eb' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(37, 99, 235, 0.25)' },
                { offset: 1, color: 'rgba(37, 99, 235, 0.02)' },
              ]),
            },
          },
          {
            name: '性能类',
            type: 'line',
            data: data.map((d) => d.perfScore),
            symbol: 'diamond',
            symbolSize: 5,
            lineStyle: { color: '#18a058', width: 2 },
            itemStyle: { color: '#18a058' },
          },
          {
            name: '状态类',
            type: 'line',
            data: data.map((d) => d.stateScore),
            symbol: 'triangle',
            symbolSize: 5,
            lineStyle: { color: '#eab308', width: 2 },
            itemStyle: { color: '#eab308' },
          },
          {
            name: '寿命类',
            type: 'line',
            data: data.map((d) => d.lifeScore),
            symbol: 'rect',
            symbolSize: 5,
            lineStyle: { color: '#ef4444', width: 2 },
            itemStyle: { color: '#ef4444' },
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
    <div className="cd-health-chart-card">
      <div className="cd-health-chart-head">
        <Icon type="favorite" className="cd-health-chart-icon" />
        <span className="cd-health-chart-title">健康度 HI 趋势 (0-100)</span>
      </div>
      <div ref={chartRef} style={{ width: '100%', height }} />
    </div>
  );
};

export default HealthMultiLineChart;
