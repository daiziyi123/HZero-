import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Icon } from 'choerodon-ui/pro';

const TrendChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const dates = ['12/01', '12/08', '12/15', '12/22', '12/29', '01/05', '01/12', '01/19', '01/26', '02/02', '02/09', '02/16'];
    const hiData = [92, 93, 91, 88, 85, 82, 79, 76, 74, 77, 80, 83];

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        borderColor: '#e2e8f0',
        textStyle: { color: '#1e293b', fontSize: 13 },
        extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-radius: 8px; padding: 10px 14px;',
        formatter: (params: any) => {
          const item = Array.isArray(params) ? params[0] : params;
          return `<div style="font-weight:600;font-size:14px;margin-bottom:8px;color:#0f172a;">${item.axisValue}</div>
            <div style="display:flex;align-items:center;gap:10px;margin:5px 0;">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#5470c6;"></span>
              <span style="color:#475569;">健康指数(HI)</span>
              <span style="font-weight:600;color:#0f172a;">${item.value} 分</span>
            </div>`;
        },
      },
      legend: { show: false },
      grid: {
        left: 48,
        right: 24,
        top: 60,
        bottom: 24,
      },
      xAxis: {
        type: 'category',
        data: dates,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#e2e8f0' } },
        axisTick: { show: false },
        axisLabel: { color: '#94a3b8', fontSize: 11, rotate: 0 },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        interval: 20,
        name: '健康指数(HI)',
        nameTextStyle: {
          color: '#64748b',
          fontSize: 12,
        },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
      },
      series: [
        {
          name: '健康指数(HI)',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          lineStyle: { color: '#5470c6', width: 2 },
          itemStyle: { color: '#5470c6' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(84,112,198,0.15)' },
              { offset: 1, color: 'rgba(84,112,198,0.02)' },
            ]),
          },
          data: hiData,
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: 300 }} />;
};

const ParameterTrend: React.FC = () => {
  return (
    <div className="parameter-trend">
      {/* 折线图卡片 */}
      <div className="trend-chart-card">
        <TrendChart />
      </div>

      {/* 预警提示 */}
      <div className="trend-warning-bar">
        <Icon type="warning" className="trend-warning-icon" />
        <span className="trend-warning-text">健康指数(HI)近期呈下降趋势，请密切关注设备运行状态，必要时安排维护计划。</span>
      </div>

      <style>{`
        .trend-chart-card {
          background: #ffffff;
          border-radius: 10px;
          border: 1px solid #e8ecf0;
          padding: 16px 20px 8px 20px;
          margin-bottom: 16px;
        }

        .trend-warning-bar {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #fefce8;
          border: 1px solid #facc15;
          border-radius: 8px;
          padding: 12px 16px;
        }

        .trend-warning-icon {
          font-size: 16px !important;
          color: #eab308;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .trend-warning-text {
          font-size: 13px;
          color: #854d0e;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default ParameterTrend;
