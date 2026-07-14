import React, { useLayoutEffect, useRef } from 'react';
import { Icon } from 'choerodon-ui';
import * as echarts from 'echarts';
import { BoxPlotItem } from '../../data/detailMock';

interface ActionBoxPlotChartProps {
  data: BoxPlotItem[];
  height?: number;
}

const ActionBoxPlotChart: React.FC<ActionBoxPlotChartProps> = ({ data, height = 260 }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!chartRef.current) return undefined;
    let cleanup: (() => void) | undefined;

    const timer = setTimeout(() => {
      const chart = echarts.init(chartRef.current);
      const boxData = data.map((d) => [d.min, d.q1, d.median, d.q3, d.max]);

      chart.setOption({
        tooltip: { trigger: 'item' },
        grid: { left: 48, right: 24, top: 36, bottom: 36 },
        xAxis: {
          type: 'category',
          data: data.map((d) => d.name),
          axisLine: { lineStyle: { color: '#cbd5e1' } },
          axisTick: { show: false },
          axisLabel: { color: '#475569', fontSize: 12, fontWeight: 600 },
        },
        yAxis: {
          type: 'value',
          name: '时长(s)',
          min: 0.3,
          max: 1.2,
          nameTextStyle: { color: '#64748b', fontSize: 11 },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#e2e8f0' } },
          axisLabel: { color: '#94a3b8', fontSize: 10 },
        },
        series: [{
          type: 'boxplot',
          data: boxData,
          itemStyle: {
            color: 'rgba(59, 130, 246, 0.35)',
            borderColor: '#2563eb',
            borderWidth: 1.5,
          },
          emphasis: { itemStyle: { borderColor: '#1d4ed8' } },
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
  }, [data]);

  return (
    <div className="cd-boxplot-card">
      <div className="cd-boxplot-head">
        <Icon type="bar_chart" className="cd-boxplot-icon" />
        <span className="cd-boxplot-title">动作时长分布 (箱形图)</span>
      </div>
      <div ref={chartRef} style={{ width: '100%', height }} />
    </div>
  );
};

export default ActionBoxPlotChart;
