import React, { useLayoutEffect, useRef } from 'react';
import { Icon } from 'choerodon-ui';
import * as echarts from 'echarts';
import { DurationPoint, ThresholdLine } from '../../data/detailMock';

interface DurationTrendChartProps {
  title: string;
  titleColor: string;
  yAxisName: string;
  yMin?: number;
  yMax: number;
  dates: string[];
  data: DurationPoint[];
  thresholds: ThresholdLine[];
  height?: number;
}

const DurationTrendChart: React.FC<DurationTrendChartProps> = ({
  title,
  titleColor,
  yAxisName,
  yMin = 0.4,
  yMax,
  dates,
  data,
  thresholds,
  height = 280,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!chartRef.current) return undefined;
    let cleanup: (() => void) | undefined;

    const timer = setTimeout(() => {
      const chart = echarts.init(chartRef.current);
      chart.setOption({
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          textStyle: { color: '#1e293b', fontSize: 12 },
          formatter: (params: unknown) => {
            const items = params as Array<{ seriesName: string; value: number; color: string; axisValue: string }>;
            let html = `<div style="font-weight:600;margin-bottom:8px;color:#64748b">${items[0]?.axisValue || ''}</div>`;
            items.forEach((item) => {
              html += `<div style="display:flex;align-items:center;gap:8px;margin:4px 0">
                <span style="width:8px;height:8px;border-radius:50%;background:${item.color}"></span>
                <span style="flex:1">${item.seriesName}</span>
                <span style="font-weight:600">${item.value}</span>
              </div>`;
            });
            return html;
          },
        },
        legend: {
          top: 4,
          left: 'center',
          itemWidth: 24,
          itemHeight: 10,
          itemGap: 16,
          textStyle: { fontSize: 11, color: '#64748b' },
          data: ['最大时长', '平均时长', '最小时长'],
        },
        grid: { left: 48, right: 72, top: 44, bottom: 28 },
        xAxis: {
          type: 'category',
          data: dates,
          axisLine: { lineStyle: { color: '#cbd5e1' } },
          axisTick: { show: false },
          axisLabel: { color: '#94a3b8', fontSize: 10, interval: 4 },
        },
        yAxis: {
          type: 'value',
          name: yAxisName,
          min: yMin,
          max: yMax,
          nameTextStyle: { color: '#64748b', fontSize: 11 },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#e2e8f0' } },
          axisLabel: { color: '#94a3b8', fontSize: 10 },
        },
        series: [
          {
            name: '最大时长',
            type: 'line',
            data: data.map((d) => d.max),
            symbol: 'circle',
            symbolSize: 5,
            lineStyle: { color: '#2563eb', width: 2 },
            itemStyle: { color: '#2563eb' },
            markLine: {
              symbol: 'none',
              silent: true,
              data: thresholds.map((t) => ({
                yAxis: t.value,
                lineStyle: { color: t.color, type: t.dashed ? 'dashed' : 'solid', width: 1.5 },
                label: {
                  show: true,
                  formatter: t.label,
                  position: 'end',
                  color: t.color,
                  fontSize: 11,
                  fontWeight: 600,
                },
              })),
            },
          },
          {
            name: '平均时长',
            type: 'line',
            data: data.map((d) => d.avg),
            symbol: 'none',
            lineStyle: { color: '#18a058', width: 2, type: 'dashed' },
            itemStyle: { color: '#18a058' },
          },
          {
            name: '最小时长',
            type: 'line',
            data: data.map((d) => d.min),
            symbol: 'none',
            lineStyle: { color: '#eab308', width: 2, type: 'dashed' },
            itemStyle: { color: '#eab308' },
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
  }, [data, dates, thresholds, yAxisName, yMax, yMin]);

  return (
    <div className="cd-duration-chart-card">
      <div className="cd-duration-chart-head">
        <span className="cd-duration-chart-title">
          <Icon type="fiber_manual_record" style={{ color: titleColor, fontSize: 12 }} />
          {title}
        </span>
        <button type="button" className="cd-threshold-link">阈值设置</button>
      </div>
      <div ref={chartRef} style={{ width: '100%', height }} />
    </div>
  );
};

export default DurationTrendChart;
