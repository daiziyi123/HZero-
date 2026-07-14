import React, { useLayoutEffect, useRef } from 'react';
import { Icon } from 'choerodon-ui';
import * as echarts from 'echarts';
import { GanttInterval } from '../data/detailMock';

interface TodayGanttTabProps {
  intervals: GanttInterval[];
  active?: boolean;
}

const TodayGanttTab: React.FC<TodayGanttTabProps> = ({ intervals, active = true }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!active || !chartRef.current) return undefined;

    let cleanup: (() => void) | undefined;
    const timer = setTimeout(() => {
      if (!chartRef.current) return;
      const chart = echarts.init(chartRef.current);
      const today = new Date();
      const min = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0).getTime();
      const max = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).getTime();

      chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: (params: { data?: { intervalData?: GanttInterval } }) =>
            params.data?.intervalData
              ? `稼动: ${params.data.intervalData.startStr} - ${params.data.intervalData.endStr}`
              : '',
        },
        xAxis: {
          type: 'time',
          min,
          max,
          axisLabel: { rotate: -25, formatter: '{HH}:{mm}' },
        },
        yAxis: { type: 'category', data: ['稼动状态'] },
        series: [{
          type: 'custom',
          renderItem: (_params: unknown, api: echarts.CustomSeriesRenderItemAPI) => {
            const s = api.value(0) as number;
            const e = api.value(1) as number;
            const y = api.coord([0, 0])[1];
            const x1 = api.coord([s, 0])[0];
            const x2 = api.coord([e, 0])[0];
            return {
              type: 'rect',
              shape: { x: x1, y: y - 12, width: x2 - x1, height: 24 },
              style: { fill: '#10b981' },
            };
          },
          data: intervals.map((inter) => ({
            value: [inter.start.getTime(), inter.end.getTime()],
            intervalData: inter,
          })),
        }],
        dataZoom: [{ type: 'slider', xAxisIndex: 0 }],
      });

      const handleResize = () => chart.resize();
      window.addEventListener('resize', handleResize);
      const observer = new ResizeObserver(handleResize);
      observer.observe(chartRef.current);
      cleanup = () => {
        window.removeEventListener('resize', handleResize);
        observer.disconnect();
        chart.dispose();
      };
    }, 300);

    return () => {
      clearTimeout(timer);
      cleanup?.();
    };
  }, [intervals, active]);

  return (
    <div className="sd-card">
      <div className="sd-card-title">
        <Icon type="show_chart" />
        今日稼动运行图 · 横条甘特图
      </div>
      <div className="sd-legend-row">
        <span>
          <span className="sd-legend-color sd-legend-run" />
          运行状态
        </span>
        <span>
          <span className="sd-legend-color sd-legend-idle" />
          停机/待机
        </span>
      </div>
      <div ref={chartRef} className="sd-gantt-chart" />
    </div>
  );
};

export default TodayGanttTab;
