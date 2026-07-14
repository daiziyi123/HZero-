import React, { useLayoutEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface AlarmTrendChartProps {
  height?: number;
  /** 嵌入 Tab 时不显示外层卡片 */
  embedded?: boolean;
}

const AlarmTrendChart: React.FC<AlarmTrendChartProps> = ({ height = 280, embedded = false }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!chartRef.current) return undefined;

    let cleanup: (() => void) | undefined;

    const timer = setTimeout(() => {
      const chart = echarts.init(chartRef.current);
      const today = new Date();
      const dates: string[] = [];
      for (let i = 13; i >= 0; i -= 1) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        dates.push(`${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`);
      }

      const alarmCountData = [0.8, 1.2, 1.8, 2, 2.2, 2.5, 2.8, 2.5, 2.2, 2, 1.5, 1.2, 1, 0.9];

      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#ffffff',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          textStyle: { color: '#1e293b', fontSize: 12 },
        },
        grid: { left: 40, right: 10, top: 40, bottom: 55 },
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
          nameTextStyle: { color: '#64748b', fontSize: 12 },
          min: 0,
          max: 3,
          interval: 0.5,
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#e2e8f0' } },
          axisLabel: { color: '#94a3b8', fontSize: 11 },
        },
        series: [{
          name: '报警次数',
          type: 'line',
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: { color: '#ef4444', width: 2.5 },
          itemStyle: { color: '#ef4444' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(239, 68, 68, 0.5)' },
              { offset: 1, color: 'rgba(239, 68, 68, 0)' },
            ]),
          },
          markPoint: {
            data: [{ type: 'max', name: '最高' }],
            label: { color: '#fff', fontSize: 11, formatter: '{c}' },
          },
          data: alarmCountData,
        }],
      };

      chart.setOption(option);
      chart.resize();

      const handleResize = () => chart.resize();
      window.addEventListener('resize', handleResize);
      const observer = new ResizeObserver(handleResize);
      if (chartRef.current) observer.observe(chartRef.current);

      cleanup = () => {
        window.removeEventListener('resize', handleResize);
        observer.disconnect();
        chart.dispose();
      };
    }, 500);

    return () => {
      clearTimeout(timer);
      cleanup?.();
    };
  }, []);

  return (
    <div className={embedded ? 'eh-alarm-chart-embedded' : 'eh-alarm-chart-card'}>
      <div ref={chartRef} className="eh-alarm-chart" style={{ height }} />
      <style>{`
        .eh-alarm-chart-card {
          background: #fff;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          margin-bottom: 16px;
        }
        .eh-alarm-chart-embedded { margin-bottom: 16px; }
        .eh-alarm-chart { width: 100%; }
      `}</style>
    </div>
  );
};

export default AlarmTrendChart;
