import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface PieChartProps {
  data: { name: string; value: number; percentage: string; color: string }[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
    const isEmpty = total === 0;

    const option: echarts.EChartsOption = {
      tooltip: isEmpty
        ? { show: false }
        : {
            trigger: 'item',
            formatter: '{b}: {c}台 ({d}%)',
          },
      legend: {
        orient: 'horizontal',
        left: 'center',
        top: '5%',
        itemWidth: 14,
        itemHeight: 14,
        itemGap: 20,
        textStyle: {
          fontSize: 12,
          color: '#475569',
        },
      },
      series: [
        {
          name: '健康状态',
          type: 'pie',
          radius: isEmpty ? ['45%', '65%'] : '65%',
          center: ['50%', '60%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 0,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: !isEmpty,
            position: 'outside',
            fontSize: 12,
            color: '#64748b',
            formatter: '{b}: {d}%',
          },
          emphasis: {
            label: {
              show: !isEmpty,
              fontSize: 12,
            },
          },
          labelLine: {
            show: !isEmpty,
            length: 15,
            length2: 10,
            smooth: false,
          },
          data: isEmpty
            ? [{ value: 1, name: '暂无数据', itemStyle: { color: '#e2e8f0' } }]
            : data.map((item) => ({
                value: item.value,
                name: item.name,
                itemStyle: { color: item.color },
              })),
        },
      ],
      graphic: isEmpty
        ? {
            type: 'text',
            left: 'center',
            top: '58%',
            style: {
              text: '暂无数据',
              fontSize: 14,
              fill: '#94a3b8',
              textAlign: 'center',
            },
          }
        : undefined,
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [data]);

  return (
    <div
      ref={chartRef}
      style={{ width: '100%', height: 280 }}
    />
  );
};

export default PieChart;