import React, { useLayoutEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface SimpleLineChartProps {
  title?: string;
  color: string;
  data: number[];
  dates?: string[];
  yMax?: number;
  height?: number;
  area?: boolean;
  /** y 轴单位名称（显示在左上角，如 "秒"、"HI"） */
  unit?: string;
}

const buildDefaultDates = (count: number) => {
  const today = new Date();
  const dates: string[] = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${m}-${day}`);
  }
  return dates;
};

const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
  title,
  color,
  data,
  dates,
  yMax,
  height = 220,
  area = false,
  unit,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const xDates = dates || buildDefaultDates(data.length);

  useLayoutEffect(() => {
    if (!chartRef.current) return undefined;

    let cleanup: (() => void) | undefined;
    const timer = setTimeout(() => {
      const chart = echarts.init(chartRef.current);
      const maxVal = yMax ?? Math.max(...data, 1) * 1.2;

      chart.setOption({
        title: title
          ? {
              text: title,
              left: 0,
              top: 0,
              textStyle: { fontSize: 13, fontWeight: 600, color: '#1e293b' },
            }
          : undefined,
        tooltip: { trigger: 'axis' },
        grid: { left: 44, right: 16, top: 32, bottom: 28 },
        xAxis: {
          type: 'category',
          data: xDates,
          axisLine: { lineStyle: { color: '#cbd5e1' } },
          axisTick: { show: false },
          axisLabel: { color: '#94a3b8', fontSize: 10 },
        },
        yAxis: {
          type: 'value',
          name: unit,
          nameTextStyle: { color: '#94a3b8', fontSize: 11, align: 'right', padding: [0, 4, 4, 0] },
          nameGap: 12,
          min: 0,
          max: maxVal,
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#e2e8f0' } },
          axisLabel: { color: '#94a3b8', fontSize: 10 },
        },
        series: [{
          type: 'line',
          data,
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          lineStyle: { color, width: 2 },
          itemStyle: { color },
          areaStyle: area ? {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(24, 160, 88, 0.35)' },
              { offset: 1, color: 'rgba(24, 160, 88, 0.02)' },
            ]),
          } : undefined,
        }],
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
  }, [title, color, data, xDates, yMax, area, unit]);

  return <div ref={chartRef} style={{ width: '100%', height }} />;
};

export default SimpleLineChart;
