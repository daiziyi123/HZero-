import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Icon } from 'choerodon-ui/pro';

const faultColors = {
  electrical: '#5470c6',
  mechanical: '#91cc75',
  process: '#fac858',
  communication: '#ee6666',
};

const mockFaultData = {
  weeks: ['第18周', '第19周', '第20周', '第21周', '第22周', '本周'],
  series: [
    { name: '电气故障', data: [4, 3, 5, 4, 3, 3], color: faultColors.electrical },
    { name: '机械故障', data: [3, 2, 3, 3, 2, 2], color: faultColors.mechanical },
    { name: '工艺故障', data: [2, 1, 2, 2, 1, 1], color: faultColors.process },
    { name: '通信故障', data: [1, 1, 1, 1, 1, 0], color: faultColors.communication },
  ],
};

const FaultAnalysisChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#fff',
        borderColor: '#e2e8f0',
        textStyle: { color: '#1e293b', fontSize: 12 },
        extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-radius: 6px;',
        formatter: (params: any) => {
          let result = `<div style="font-weight:600;margin-bottom:8px;">${params[0].axisValue}</div>`;
          params.forEach((item: any) => {
            result += `<div style="display:flex;align-items:center;gap:8px;margin:4px 0;">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${item.color};"></span>
              <span style="flex:1;">${item.seriesName}</span>
              <span style="font-weight:600;">${item.value}</span>
            </div>`;
          });
          return result;
        },
      },
      legend: {
        show: true,
        bottom: 0,
        icon: 'roundRect',
        itemWidth: 14,
        itemHeight: 10,
        textStyle: {
          color: '#64748b',
          fontSize: 12,
        },
      },
      grid: {
        left: 40,
        right: 20,
        top: 16,
        bottom: 60,
      },
      xAxis: {
        type: 'category',
        data: mockFaultData.weeks,
        axisLine: { lineStyle: { color: '#e2e8f0' } },
        axisTick: { show: false },
        axisLabel: { color: '#64748b', fontSize: 12 },
      },
      yAxis: {
        type: 'value',
        name: '故障次数',
        nameTextStyle: { color: '#94a3b8', fontSize: 12 },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
        axisLabel: { color: '#94a3b8', fontSize: 12 },
      },
      series: mockFaultData.series.map((s) => ({
        name: s.name,
        type: 'bar',
        barWidth: 18,
        barGap: '20%',
        emphasis: { focus: 'series' },
        itemStyle: {
          color: s.color,
          borderRadius: 0,
          borderWidth: 0,
        },
        data: s.data,
      })),
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: 260 }} />;
};

const FaultAnalysis: React.FC = () => {
  return (
    <div className="fault-analysis">
      <div className="fault-section-title">
        <Icon type="assessment" className="fault-section-icon" />
        <span>近6周故障次数统计</span>
      </div>

      <div className="fault-chart-card">
        <FaultAnalysisChart />
      </div>

      <div className="fault-tip-bar">
        <Icon type="warning" className="fault-tip-icon" />
        <span className="fault-tip-text">近期电气故障占比最高，建议检查伺服驱动及线束。</span>
      </div>

      <style>{`
        .fault-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 16px;
        }

        .fault-section-icon {
          font-size: 18px !important;
          color: #3b82f6;
        }

        .fault-chart-card {
          background: #ffffff;
          border-radius: 10px;
          border: 1px solid #e8ecf0;
          padding: 16px 20px 8px 20px;
          margin-bottom: 16px;
        }

        .fault-tip-bar {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #fefce8;
          border: 1px solid #facc15;
          border-radius: 8px;
          padding: 12px 16px;
        }

        .fault-tip-icon {
          font-size: 16px !important;
          color: #eab308;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .fault-tip-text {
          font-size: 13px;
          color: #854d0e;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default FaultAnalysis;
