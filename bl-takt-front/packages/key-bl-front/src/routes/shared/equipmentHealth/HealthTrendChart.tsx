import React, { useLayoutEffect, useRef } from 'react';
import * as echarts from 'echarts';

export interface TrendSeriesConfig {
  name: string;
  color: string;
  base: number;
  end: number;
  symbol?: string;
  smooth?: boolean;
  showArea?: boolean;
  showMarkPoint?: boolean;
}

interface HealthTrendChartProps {
  series: TrendSeriesConfig[];
  days?: number;
  height?: number;
  /** y 轴名称，默认「评分」 */
  yAxisName?: string;
  yMin?: number;
  yMax?: number;
  yInterval?: number;
  /** 图表右上角标题 */
  chartTitle?: string;
  /** 是否隐藏外层卡片阴影（嵌入 Tab 时使用） */
  embedded?: boolean;
}

const buildDates = (days: number) => {
  const today = new Date();
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(`${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`);
  }
  return dates;
};

const generateTrendData = (dates: string[], base: number, end: number, decimals = 1) =>
  dates.map((_, i) => {
    const raw = base + (end - base) * (i / (dates.length - 1)) + Math.sin(i * 1.5) * (decimals >= 1 ? 3 : 0.03);
    const factor = 10 ** decimals;
    return Math.round(raw * factor) / factor;
  });

const HealthTrendChart: React.FC<HealthTrendChartProps> = ({
  series,
  days = 14,
  height = 320,
  yAxisName = '评分',
  yMin = 0,
  yMax = 100,
  yInterval = 20,
  chartTitle,
  embedded = false,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!chartRef.current) return undefined;

    let cleanup: (() => void) | undefined;

    const timer = setTimeout(() => {
      const chart = echarts.init(chartRef.current);
      const dates = buildDates(days);
      const decimals = yMax <= 1 ? 2 : 1;

      const option: echarts.EChartsOption = {
        title: chartTitle
          ? {
              text: chartTitle,
              right: 0,
              top: 0,
              textStyle: { fontSize: 13, fontWeight: 600, color: '#475569' },
            }
          : undefined,
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#ffffff',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          borderRadius: 6,
          textStyle: { color: '#1e293b', fontSize: 12 },
          extraCssText: 'box-shadow: 0 2px 8px rgba(0,0,0,0.08);',
          formatter: (params: unknown) => {
            const items = params as Array<{ axisValue: string; seriesName: string; value: number; color: string }>;
            let result = `<div style="font-weight:600;margin-bottom:10px;color:#64748b;font-size:14px;">${items[0].axisValue}</div>`;
            items.forEach((item) => {
              result += `<div style="display:flex;align-items:center;gap:10px;margin:6px 0;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${item.color};"></span>
                <span style="flex:1;font-size:13px;">${item.seriesName}</span>
                <span style="font-weight:600;font-size:13px;color:${item.color};">${item.value}</span>
              </div>`;
            });
            return result;
          },
        },
        legend: {
          show: true,
          top: 0,
          left: 'center',
          itemWidth: 40,
          itemHeight: 20,
          itemGap: 20,
          textStyle: { color: '#64748b', fontSize: 13 },
          data: series.map((s) => ({ name: s.name })),
        },
        grid: { left: 44, right: chartTitle ? 160 : 10, top: chartTitle ? 48 : 55, bottom: 55 },
        xAxis: {
          type: 'category',
          data: dates,
          axisLine: { lineStyle: { color: '#cbd5e1' } },
          axisTick: { show: false },
          axisLabel: { color: '#94a3b8', fontSize: 11 },
        },
        yAxis: {
          type: 'value',
          name: yAxisName,
          nameTextStyle: { color: '#64748b', fontSize: 12, padding: [0, 40, 0, 0] },
          min: yMin,
          max: yMax,
          interval: yInterval,
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#e2e8f0', type: 'solid' } },
          axisLabel: { color: '#94a3b8', fontSize: 11 },
        },
        series: series.map((s) => ({
          name: s.name,
          type: 'line',
          smooth: s.smooth ?? false,
          symbol: s.symbol ?? 'circle',
          symbolSize: 10,
          lineStyle: { color: s.color, width: 2.5 },
          itemStyle: { color: s.color },
          areaStyle: s.showArea
            ? {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: `${s.color}80` },
                  { offset: 1, color: `${s.color}00` },
                ]),
              }
            : undefined,
          markPoint: s.showMarkPoint
            ? {
                data: [{ type: 'max', name: '最高' }, { type: 'min', name: '最低' }],
                label: { color: '#fff', fontSize: 11, formatter: '{c}' },
              }
            : undefined,
          data: generateTrendData(dates, s.base, s.end, decimals),
        })),
      };

      chart.setOption(option);
      chart.resize();

      let resizeTimer: ReturnType<typeof setTimeout>;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => chart.resize(), 100);
      };
      window.addEventListener('resize', handleResize);

      const resizeObserver = new ResizeObserver(handleResize);
      if (chartRef.current) resizeObserver.observe(chartRef.current);

      setTimeout(() => chart.resize(), 500);

      cleanup = () => {
        window.removeEventListener('resize', handleResize);
        resizeObserver.disconnect();
        chart.dispose();
      };
    }, 500);

    return () => {
      clearTimeout(timer);
      cleanup?.();
    };
  }, [series, days, yAxisName, yMin, yMax, yInterval, chartTitle]);

  return (
    <div className={embedded ? 'eh-trend-chart-embedded' : 'eh-trend-chart-card'}>
      <div ref={chartRef} className="eh-trend-chart" style={{ height }} />
      <style>{`
        .eh-trend-chart-card {
          background: #fff;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          width: 100%;
          box-sizing: border-box;
        }
        .eh-trend-chart-embedded {
          width: 100%;
          box-sizing: border-box;
        }
        .eh-trend-chart { width: 100%; display: block; box-sizing: border-box; }
      `}</style>
    </div>
  );
};

export default HealthTrendChart;
