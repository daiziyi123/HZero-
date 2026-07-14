import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Button, Icon } from 'choerodon-ui';
import { DatePicker, Table, DataSet } from 'choerodon-ui/pro';
import moment, { Moment } from 'moment';
import * as echarts from 'echarts';
import { ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { DailyHealthRecord } from '../data/detailMock';

interface HealthAnalysisTabProps {
  healthData: DailyHealthRecord[];
  active?: boolean;
}

const levelBadgeClass = (level: string) => {
  if (level === '健康') return 'sd-level-normal';
  if (level === '良好') return 'sd-level-attention';
  if (level === '警告') return 'sd-level-warning';
  return 'sd-level-severe';
};

const HealthAnalysisTab: React.FC<HealthAnalysisTabProps> = ({ healthData, active = true }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState<Moment>(() => moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState<Moment>(() => moment());
  const [filtered, setFiltered] = useState<DailyHealthRecord[]>(() => {
    const start = moment().subtract(7, 'days').format('YYYY-MM-DD');
    const end = moment().format('YYYY-MM-DD');
    return healthData.filter((d) => d.date >= start && d.date <= end);
  });

  const tableDs = useMemo(
    () =>
      new DataSet({
        autoQuery: false,
        selection: false,
        paging: true,
        pageSize: 10,
        fields: [
          { name: 'date', type: FieldType.string, label: '日期' },
          { name: 'level', type: FieldType.string, label: '健康度等级' },
          { name: 'score', type: FieldType.number, label: '健康得分' },
          { name: 'performance', type: FieldType.number, label: '性能类' },
          { name: 'status', type: FieldType.number, label: '状态类' },
          { name: 'life', type: FieldType.number, label: '寿命类' },
          { name: 'riskFactor', type: FieldType.string, label: '主要风险因子' },
        ],
        data: filtered,
      }),
    [filtered],
  );

  useLayoutEffect(() => {
    if (!active || !chartRef.current) return undefined;

    let cleanup: (() => void) | undefined;
    const timer = setTimeout(() => {
      if (!chartRef.current) return;
      const chart = echarts.init(chartRef.current);
      const dates = filtered.map((d) => d.date);
      chart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['综合健康得分', '性能类', '状态类', '寿命类'], top: 0, left: 'center' },
        xAxis: {
          type: 'category',
          data: dates,
          name: '日期',
          axisLabel: { rotate: 30, interval: Math.max(1, Math.floor(dates.length / 10)) },
        },
        yAxis: { type: 'value', name: '得分', min: 0, max: 100 },
        series: [
          {
            name: '综合健康得分',
            type: 'line',
            data: filtered.map((d) => d.score),
            smooth: true,
            lineStyle: { width: 2.5, color: '#3b82f6' },
            areaStyle: { opacity: 0.1, color: '#3b82f6' },
            symbol: 'circle',
            symbolSize: 5,
          },
          {
            name: '性能类',
            type: 'line',
            data: filtered.map((d) => d.performance),
            smooth: true,
            lineStyle: { width: 2, color: '#10b981' },
            symbol: 'diamond',
            symbolSize: 4,
          },
          {
            name: '状态类',
            type: 'line',
            data: filtered.map((d) => d.status),
            smooth: true,
            lineStyle: { width: 2, color: '#f59e0b' },
            symbol: 'triangle',
            symbolSize: 4,
          },
          {
            name: '寿命类',
            type: 'line',
            data: filtered.map((d) => d.life),
            smooth: true,
            lineStyle: { width: 2, color: '#ef4444' },
            symbol: 'rect',
            symbolSize: 4,
          },
        ],
        grid: { containLabel: true, top: 50, bottom: 20 },
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
  }, [filtered, active]);

  const applyFilter = () => {
    const start = startDate ? startDate.format('YYYY-MM-DD') : '';
    const end = endDate ? endDate.format('YYYY-MM-DD') : '';
    setFiltered(
      healthData.filter((d) => {
        if (start && d.date < start) return false;
        if (end && d.date > end) return false;
        return true;
      }),
    );
  };

  const resetFilter = () => {
    setStartDate(moment().subtract(7, 'days'));
    setEndDate(moment());
    const start = moment().subtract(7, 'days').format('YYYY-MM-DD');
    const end = moment().format('YYYY-MM-DD');
    setFiltered(healthData.filter((d) => d.date >= start && d.date <= end));
  };

  const levelDescriptions = [
    { level: '健康', className: 'sd-level-normal', text: '工作峰值未超过额定值，处于理想安全区，无异常过载风险。' },
    { level: '良好', className: 'sd-level-attention', text: '偶尔短时达到此区间（如加减速、轻微负载波动），但未持续。建议关注频次，检查负载惯量匹配或程序加减速时间。' },
    { level: '警告', className: 'sd-level-warning', text: '频繁或较长时间处于该区间，已接近伺服驱动器短时过载保护阈值。需排查机械卡滞、焊接飞溅导致的额外阻力、导轨润滑不良等问题。' },
    { level: '严重', className: 'sd-level-severe', text: '达到或超过电机/驱动器的最大过载能力，极易触发过载预警或停机。通常对应机构卡死、制动器未打开、严重碰撞等故障，需立即停机检修。' },
  ];

  return (
    <div className="sd-card">
      <div className="sd-card-title">
        <Icon type="favorite" />
        健康度分析
      </div>

      <div className="sd-filter-bar">
        <div className="sd-filter-group">
          <label>起始日期</label>
          <DatePicker value={startDate} onChange={(v) => v && setStartDate(v)} />
        </div>
        <div className="sd-filter-group">
          <label>结束日期</label>
          <DatePicker value={endDate} onChange={(v) => v && setEndDate(v)} />
        </div>
        <Button type="primary" className="sd-query-btn" onClick={applyFilter}>
          筛选
        </Button>
        <Button className="sd-reset-btn" onClick={resetFilter}>
          重置
        </Button>
      </div>

      <div ref={chartRef} className="sd-health-trend-chart" />

      <div className="sd-health-table-wrap">
        <Table
          dataSet={tableDs}
          columns={[
            { name: 'date', width: 110 },
            {
              name: 'level',
              width: 90,
              align: ColumnAlign.center,
              renderer: ({ value }) => (
                <span className={`sd-level-badge ${levelBadgeClass(String(value))}`}>{value}</span>
              ),
            },
            { name: 'score', width: 80, align: ColumnAlign.center },
            { name: 'performance', width: 70, align: ColumnAlign.center },
            { name: 'status', width: 70, align: ColumnAlign.center },
            { name: 'life', width: 70, align: ColumnAlign.center },
            { name: 'riskFactor', align: ColumnAlign.left },
          ]}
        />
      </div>

      <div className="sd-level-description">
        <div className="sd-level-desc-title">
          <Icon type="info" />
          健康等级说明
        </div>
        {levelDescriptions.map((item) => (
          <div key={item.level} className="sd-level-desc-item">
            <span className={`sd-level-badge ${item.className}`}>{item.level}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthAnalysisTab;
