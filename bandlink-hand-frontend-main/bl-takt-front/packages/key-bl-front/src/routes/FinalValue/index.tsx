import React, { useEffect, useMemo, useState } from 'react';
import { Select } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ReactEcharts from 'echarts-for-react';
import styles from './index.less';

const rows = [
  ['2026-06-18 07:50:14', '389075', 'SPR1', '0234', 20, '0.0090', '5.600~7.000', '6.460', '-0.400~0.200', '-0.026', '0.000~0.000', '7540.000', '5.000~7.400', '5.999', '-1.000~284.388', '277.909', '-4.800~84.000', '66.342'],
  ['2026-06-18 07:50:18', '389076', 'SPR1', '0234', 21, '0.0090', '5.600~7.000', '6.340', '-0.400~0.200', '-0.016', '0.000~0.000', '7642.000', '5.000~7.400', '6.110', '-1.000~284.388', '277.681', '-4.800~84.000', '65.168'],
  ['2026-06-18 07:50:23', '389077', 'SPR1', '0234', 22, '0.0100', '4.600~6.000', '5.515', '-0.400~0.200', '0.003', '0.000~0.000', '7576.000', '4.800~7.700', '5.581', '-1.000~284.388', '277.273', '-4.800~84.000', '45.461'],
  ['2026-06-18 07:50:27', '389078', 'SPR1', '0234', 23, '0.0090', '4.600~6.000', '5.489', '-0.400~0.200', '-0.006', '0.000~0.000', '7628.000', '3.800~6.200', '4.403', '-1.000~284.388', '277.974', '-4.800~84.000', '39.094'],
  ['2026-06-18 07:50:31', '389079', 'SPR1', '0234', 24, '0.0090', '4.600~6.000', '5.498', '-0.400~0.200', '-0.007', '0.000~0.000', '7560.000', '3.800~6.200', '4.521', '-1.000~284.388', '278.011', '-4.800~84.000', '38.601'],
  ['2026-06-18 07:50:35', '389080', 'SPR1', '0234', 25, '0.0100', '4.600~6.000', '5.558', '-0.400~0.200', '-0.011', '0.000~0.000', '7607.000', '3.800~6.200', '4.458', '-1.000~284.388', '277.986', '-4.800~84.000', '38.648'],
  ['2026-06-18 07:50:39', '389081', 'SPR1', '0234', 26, '0.0090', '4.600~6.000', '5.542', '-0.400~0.200', '-0.008', '0.000~0.000', '7702.000', '3.800~6.200', '4.459', '-1.000~284.388', '277.894', '-4.800~84.000', '37.560'],
  ['2026-06-18 07:50:44', '389082', 'SPR1', '0234', 27, '0.0090', '4.600~6.000', '5.460', '-0.400~0.200', '-0.004', '0.000~0.000', '7610.000', '3.800~6.200', '4.797', '-1.000~284.388', '277.786', '-4.800~84.000', '39.140'],
  ['2026-06-18 07:50:49', '389083', 'SPR1', '0234', 29, '0.0080', '4.600~6.000', '5.462', '-0.400~0.200', '-0.006', '0.000~0.000', '7494.000', '3.600~6.000', '4.304', '-1.000~284.388', '278.074', '-4.800~84.000', '36.813'],
  ['2026-06-18 07:50:54', '389084', 'SPR1', '0234', 33, '0.0090', '4.600~6.000', '5.519', '-0.400~0.200', '-0.002', '0.000~0.000', '7686.000', '3.600~6.000', '4.455', '-1.000~284.388', '277.890', '-4.800~84.000', '36.302'],
  ['2026-06-18 07:52:19', '389085', 'SPR1', '0235', 20, '0.0100', '5.600~7.000', '6.222', '-0.400~0.200', '-0.023', '0.000~0.000', '7570.000', '5.000~7.400', '6.001', '-1.000~284.388', '277.880', '-4.800~84.000', '66.580'],
  ['2026-06-18 07:52:23', '389086', 'SPR1', '0235', 21, '0.0090', '5.600~7.000', '6.309', '-0.400~0.200', '-0.008', '0.000~0.000', '7464.000', '5.000~7.400', '6.117', '-1.000~284.388', '277.613', '-4.800~84.000', '64.286'],
  ['2026-06-18 07:52:27', '389087', 'SPR1', '0235', 22, '0.0100', '4.600~6.000', '5.457', '-0.400~0.200', '0.002', '0.000~0.000', '7794.000', '4.800~7.700', '5.673', '-1.000~284.388', '277.213', '-4.800~84.000', '45.014'],
  ['2026-06-18 07:52:31', '389088', 'SPR1', '0235', 23, '0.0090', '4.600~6.000', '5.612', '-0.400~0.200', '-0.006', '0.000~0.000', '7626.000', '3.800~6.200', '4.421', '-1.000~284.388', '277.915', '-4.800~84.000', '38.316'],
  ['2026-06-18 07:52:36', '389089', 'SPR1', '0235', 24, '0.0100', '4.600~6.000', '5.373', '-0.400~0.200', '-0.005', '0.000~0.000', '7634.000', '3.800~6.200', '4.511', '-1.000~284.388', '277.918', '-4.800~84.000', '37.456'],
];

const columns = [
  '铆接时间', '编号', '设备', '车身流水号', '程序号', '铆钉长度', '中1-X范围', '铆钉头部高度(mm)', '中1-Y范围',
  '底部厚度(mm)', '中2-X范围', '铆钉总长度(mm)', '中2-Y范围', '底部厚度(mm)', '终-X范围', '伺服丝杠位置(mm)',
  '终-Y范围', '实际铆接力(kN)', '结果文本', '来源', '判定结果', '影响', '操作',
];

const FINAL_VALUE_STATISTICS_URL = '/api/v1/spr/final-value/statistics';
const FINAL_VALUE_OPTIONS_URL = '/api/v1/spr/final-value/options';
const FINAL_VALUE_PAGE_URL = '/api/v1/spr/final-value/page';
const FINAL_VALUE_CONTROL_CHART_URL = '/api/v1/spr/final-value/control-chart';
const PAGE_SIZE = 15;

const defaultStatistics = {
  qualifiedCount: 620,
  unqualifiedCount: 0,
  deviceCount: 1,
  serialCount: 62,
  qualifiedRate: 100,
};

const defaultOptions = {
  dates: [],
  devices: [{ label: 'SPR1', value: 'SPR1' }],
  serialNos: [{ label: '0234', value: '0234' }, { label: '0235', value: '0235' }],
  programNos: [{ label: '20', value: '20' }, { label: '21', value: '21' }, { label: '22', value: '22' }],
  results: [{ label: 'OK', value: 'OK' }, { label: 'NG', value: 'NG' }],
};

const defaultFilterValues = {
  date: 'all',
  device: 'all',
  serialNo: 'all',
  programNo: 'all',
  result: 'all',
};

const getMetricCards = statistics => [
  { icon: '✓', value: statistics.qualifiedCount, label: '合格', tone: 'green' },
  { icon: '×', value: statistics.unqualifiedCount, label: '不合格', tone: 'red' },
  { icon: '▣', value: statistics.deviceCount, label: '涉及设备', tone: 'blue' },
  { icon: '◼', value: statistics.serialCount, label: '车身流水号', tone: 'orange' },
  { icon: '★', value: `${Number(statistics.qualifiedRate || 0).toFixed(1)}%`, label: '合格率', tone: 'blue' },
];

const normalizeOptions = options =>
  (Array.isArray(options) ? options : [])
    .filter(item => item && String(item.value || item.label || '').trim() !== '')
    .map(item => ({
      label: String(item.label || item.value),
      value: String(item.value || item.label),
    }));

const withDefaultOptions = (options, fallback) => {
  const normalizedOptions = normalizeOptions(options);
  return normalizedOptions.length > 0 ? normalizedOptions : fallback;
};

const formatNumber = value => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  return Number.isFinite(Number(value)) ? Number(value).toFixed(3) : String(value);
};

const formatRange = (min, max) => `${formatNumber(min)}~${formatNumber(max)}`;

const mapPageRecordToRow = record => [
  record.detectTime || '-',
  record.id || '-',
  record.device || '-',
  record.serialNo || '-',
  record.programNo || '-',
  formatNumber(record.middle2XMin ?? record.pressure),
  formatRange(record.middleXMin, record.middleXMax),
  formatNumber(record.headHeight),
  formatRange(record.middleYMin, record.middleYMax),
  formatNumber(record.bottomThickness),
  formatRange(record.middle2XMin, record.middle2XMax),
  formatNumber(record.rivetLength),
  formatRange(record.middle2YMin, record.middle2YMax),
  formatNumber(record.bottomThickness),
  formatRange(record.endXMin, record.endXMax),
  formatNumber(record.closePosition),
  formatRange(record.endYMin, record.endYMax),
  formatNumber(record.pressure ?? record.middle2XMin),
  record.resultText || '-',
  record.source || '-',
  record.result || '-',
  record.impact || '-',
];

function buildForceSeries() {
  return Array.from({ length: 84 }, (_, index) => {
    const x = `0${Math.floor(index / 12) + 1}${String(index % 12).padStart(2, '0')}`;
    const value = 38 + (index % 3) * 1.3 + (index % 4 === 0 ? 28 : 0) + Math.sin(index * 0.7) * 1.6;
    return [x, Number(value.toFixed(2))];
  });
}

const forceFallbackData = buildForceSeries();

const defaultControlChart = {
  legend: ['实际铆接力', 'UCL (CL+3σ)', 'LCL (CL-3σ)'],
  series: [
    { name: '实际铆接力', type: 'line', data: forceFallbackData.map(item => item[1]) },
    { name: 'UCL (CL+3σ)', type: 'line', data: forceFallbackData.map(() => 75) },
    { name: 'LCL (CL-3σ)', type: 'line', data: forceFallbackData.map(() => 12) },
  ],
  xaxis: forceFallbackData.map(item => item[0]),
};

function buildTrackSeries(row: any[]) {
  const offset = (Number(row[4]) - 20) * 0.22;
  const points = Array.from({ length: 64 }, (_, index) => {
    const ratio = index / 63;
    const time = 1260 + ratio * 460;
    const displacement = 256.47 + ratio * 21.45;
    const pressure =
      index < 18
        ? ratio * 5
        : index < 42
        ? 8 + (ratio - 0.28) * 82 + Math.sin(index * 0.58) * 2.8
        : 45 + ratio * 24 + Math.sin(index * 0.32) * 5.5;
    const torque =
      index < 7
        ? -36 + index * 7.2
        : index < 34
        ? 12 + Math.sin(index * 3.1) * 3.8 + (index - 7) * 1.6
        : 62 + Math.sin(index * 0.42) * 19 + ratio * 40;
    const speed =
      index < 20
        ? 102 + Math.sin(index * 2.8) * 2.5
        : index < 34
        ? 98 - (index - 20) * 7.2
        : Math.max(0, 30 - (index - 34) * 1.25 + Math.sin(index * 0.55) * 8);
    const derivative =
      index < 36
        ? Math.sin(index * 1.7) * 0.6
        : index < 49
        ? 11 - (index - 36) * 0.8 + Math.sin(index * 0.9) * 1.4
        : 5 + Math.sin(index * 1.2) * 5 + (index - 49) * 0.85;

    return {
      time: Number(time.toFixed(0)),
      displacement: Number((displacement + offset).toFixed(3)),
      pressure: Number(Math.max(0, pressure + offset * 1.6).toFixed(3)),
      torque: Number(Math.min(106, torque + offset * 3).toFixed(3)),
      speed: Number(Math.max(0, speed - offset).toFixed(3)),
      derivative: Number(derivative.toFixed(3)),
    };
  });

  return {
    pressureDisplacement: points.map(item => [item.displacement, item.pressure]),
    pressureTime: points.map(item => [item.time, item.pressure]),
    displacementTime: points.map(item => [item.time, item.displacement]),
    torqueTime: points.map(item => [item.time, item.torque]),
    speedTime: points.map(item => [item.time, item.speed]),
    derivativeDisplacement: points.map(item => [item.displacement, item.derivative]),
  };
}

const getTrackOption = (xName: string, yName: string, data: number[][], yMin?: number, yMax?: number) => ({
  color: ['#5ba8ff'],
  animation: false,
  tooltip: { trigger: 'axis' },
  grid: { left: 58, right: 28, top: 24, bottom: 48 },
  xAxis: {
    type: 'value',
    name: xName,
    nameLocation: 'middle',
    nameGap: 30,
    splitLine: { lineStyle: { color: '#e1e7f0' } },
    axisLine: { lineStyle: { color: '#8f9bad' } },
    axisLabel: { color: '#697586' },
  },
  yAxis: {
    type: 'value',
    name: yName,
    min: yMin,
    max: yMax,
    splitLine: { lineStyle: { color: '#e1e7f0' } },
    axisLine: { lineStyle: { color: '#8f9bad' } },
    axisLabel: { color: '#697586' },
  },
  series: [
    {
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2 },
      data,
    },
  ],
});

const getTrackTitle = (row: any[]) => `${row[1]}/${row[2]}/${row[3]}/${row[4]}`;

const FinalValue = () => {
  const [activeRow, setActiveRow] = useState<any[] | null>(null);
  const [statistics, setStatistics] = useState(defaultStatistics);
  const [filterOptions, setFilterOptions] = useState(defaultOptions);
  const [filterValues, setFilterValues] = useState(defaultFilterValues);
  const [tableRows, setTableRows] = useState<any[]>(rows);
  const [tableTotal, setTableTotal] = useState(620);
  const [currentPage, setCurrentPage] = useState(1);
  const [controlChart, setControlChart] = useState(defaultControlChart);
  const totalCount = Number(statistics.qualifiedCount || 0) + Number(statistics.unqualifiedCount || 0);
  const totalPages = Math.max(1, Math.ceil(tableTotal / PAGE_SIZE));
  const metricCards = useMemo(() => getMetricCards(statistics), [statistics]);
  const filterFields = useMemo(() => [
    { key: 'date', label: '日期:', options: filterOptions.dates },
    { key: 'device', label: '设备:', options: filterOptions.devices },
    { key: 'serialNo', label: '车身流水号:', options: filterOptions.serialNos },
    { key: 'programNo', label: '程序号:', options: filterOptions.programNos },
    { key: 'result', label: '结果判定:', options: filterOptions.results },
  ], [filterOptions]);

  useEffect(() => {
    let ignore = false;

    fetch(FINAL_VALUE_STATISTICS_URL)
      .then(response => response.json())
      .then(res => {
        if (!ignore && res && res.success && res.data) {
          setStatistics({
            qualifiedCount: Number(res.data.qualifiedCount || 0),
            unqualifiedCount: Number(res.data.unqualifiedCount || 0),
            deviceCount: Number(res.data.deviceCount || 0),
            serialCount: Number(res.data.serialCount || 0),
            qualifiedRate: Number(res.data.qualifiedRate || 0),
          });
        }
      })
      .catch(() => {
        if (!ignore) {
          setStatistics(defaultStatistics);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams({
      pageNum: String(currentPage),
      pageSize: String(PAGE_SIZE),
    });

    if (filterValues.device !== 'all') {
      params.set('device', filterValues.device);
    }
    if (filterValues.serialNo !== 'all') {
      params.set('serialNo', filterValues.serialNo);
    }
    if (filterValues.programNo !== 'all') {
      params.set('programNo', filterValues.programNo);
    }
    if (filterValues.result !== 'all') {
      params.set('result', filterValues.result);
    }

    fetch(`${FINAL_VALUE_PAGE_URL}?${params.toString()}`)
      .then(response => response.json())
      .then(res => {
        if (!ignore && res && res.success && res.data) {
          const content = Array.isArray(res.data.content) ? res.data.content : [];
          setTableRows(content.map(mapPageRecordToRow));
          setTableTotal(Number(res.data.totalElements || content.length));
        }
      })
      .catch(() => {
        if (!ignore) {
          setTableRows(rows);
          setTableTotal(rows.length);
        }
      });

    return () => {
      ignore = true;
    };
  }, [currentPage, filterValues]);

  useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams();

    if (filterValues.device !== 'all') {
      params.set('device', filterValues.device);
    }
    if (filterValues.serialNo !== 'all') {
      params.set('serialNo', filterValues.serialNo);
    }
    if (filterValues.programNo !== 'all') {
      params.set('programNo', filterValues.programNo);
    }
    if (filterValues.result !== 'all') {
      params.set('result', filterValues.result);
    }

    const queryString = params.toString();
    fetch(queryString ? `${FINAL_VALUE_CONTROL_CHART_URL}?${queryString}` : FINAL_VALUE_CONTROL_CHART_URL)
      .then(response => response.json())
      .then(res => {
        if (!ignore && res && res.success && res.data) {
          setControlChart({
            legend: Array.isArray(res.data.legend) ? res.data.legend : defaultControlChart.legend,
            series: Array.isArray(res.data.series) ? res.data.series : defaultControlChart.series,
            xaxis: Array.isArray(res.data.xaxis) ? res.data.xaxis : defaultControlChart.xaxis,
          });
        }
      })
      .catch(() => {
        if (!ignore) {
          setControlChart(defaultControlChart);
        }
      });

    return () => {
      ignore = true;
    };
  }, [filterValues]);

  useEffect(() => {
    let ignore = false;

    fetch(FINAL_VALUE_OPTIONS_URL)
      .then(response => response.json())
      .then(res => {
        if (!ignore && res && res.success && res.data) {
          setFilterOptions({
            dates: withDefaultOptions(res.data.dates || res.data.dateOptions, defaultOptions.dates),
            devices: withDefaultOptions(res.data.devices, defaultOptions.devices),
            serialNos: withDefaultOptions(res.data.serialNos, defaultOptions.serialNos),
            programNos: withDefaultOptions(res.data.programNos, defaultOptions.programNos),
            results: withDefaultOptions(res.data.results || res.data.resultOptions, defaultOptions.results),
          });
        }
      })
      .catch(() => {
        if (!ignore) {
          setFilterOptions(defaultOptions);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const qualifiedOption = useMemo(() => ({
    color: ['#62c238', '#ff6b6b'],
    tooltip: { trigger: 'axis' },
    legend: { top: 10, data: ['合格', '不合格'] },
    grid: { left: 54, right: 28, top: 58, bottom: 48 },
    xAxis: { type: 'category', data: ['SPR1'], axisLabel: { color: '#697586' } },
    yAxis: {
      type: 'value',
      name: '铆接次数',
      max: Math.max(10, Math.ceil(totalCount * 1.15)),
      splitLine: { lineStyle: { color: '#e2e8f0' } },
    },
    series: [
      { name: '合格', type: 'bar', barWidth: 320, stack: 'total', data: [statistics.qualifiedCount] },
      { name: '不合格', type: 'bar', barWidth: 320, stack: 'total', data: [statistics.unqualifiedCount] },
    ],
  }), [statistics.qualifiedCount, statistics.unqualifiedCount, totalCount]);

  const forceOption = useMemo(() => {
    const labels = Array.isArray(controlChart.xaxis) ? controlChart.xaxis : [];
    const seriesList = Array.isArray(controlChart.series) ? controlChart.series : [];
    const allValues = seriesList.reduce((result, item) => result.concat(item.data || []), [] as any[]);
    const numericValues = allValues.map(value => Number(value)).filter(value => Number.isFinite(value));
    const yMax = Math.max(80, Math.ceil((Math.max(...numericValues, 0) || 0) * 1.12));

    return {
      color: ['#4fa3ff', '#ff6464', '#62c238', '#eea33a'],
      tooltip: { trigger: 'axis' },
      legend: { top: 8, data: controlChart.legend },
      dataZoom: [{ type: 'slider', height: 18, bottom: 10, start: 0, end: 100 }],
      grid: { left: 58, right: 28, top: 62, bottom: 62 },
      xAxis: { type: 'category', data: labels, axisLabel: { rotate: 45, color: '#697586', fontSize: 10 } },
      yAxis: { type: 'value', name: '实际铆接力(kN)', min: 0, max: yMax, splitLine: { lineStyle: { color: '#e2e8f0' } } },
      series: seriesList.map((item, index) => ({
        ...item,
        type: item.type || 'line',
        smooth: index === 0,
        symbolSize: index === 0 ? 4 : 0,
        symbol: index === 0 ? 'circle' : 'none',
        lineStyle: index === 0 ? { width: 2 } : { type: 'dashed', width: 2 },
      })),
    };
  }, [controlChart]);
  const trackCharts = useMemo(() => {
    if (!activeRow) {
      return [];
    }

    const series = buildTrackSeries(activeRow);
    return [
      { title: '1. 压力/位移轨迹', option: getTrackOption('位移(mm)', '压力(kN)', series.pressureDisplacement, -10, 70) },
      { title: '2. 压力/时间轨迹', option: getTrackOption('时间(ms)', '压力(kN)', series.pressureTime, -10, 70) },
      { title: '3. 位移/时间轨迹', option: getTrackOption('时间(ms)', '位移(mm)', series.displacementTime, 0, 300) },
      { title: '4. 扭矩/时间轨迹', option: getTrackOption('时间(ms)', '扭矩(Nm)', series.torqueTime, -60, 120) },
      { title: '5. 速度/时间轨迹', option: getTrackOption('时间(ms)', '速度(mm/s)', series.speedTime, -30, 150) },
      { title: '6. 一阶导数/位移轨迹', option: getTrackOption('位移(mm)', '一阶导数(dy/dx)', series.derivativeDisplacement, -10, 25) },
    ];
  }, [activeRow]);

  return (
    <>
      <Header title="铆接终值" />
      <Content>
        <div className={styles.page}>
          <div className={styles.titleLine}>
            <span>铆接终值 - 终值数据</span>
            <em>共 {totalCount} 条</em>
          </div>

          <div className={styles.metricGrid}>
            {metricCards.map(item => (
              <div className={styles.metricCard} key={item.label}>
                <i className={`${styles.metricIcon} ${styles[item.tone]}`}>{item.icon}</i>
                <div>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.chartGrid}>
            <section className={styles.chartCard}>
              <h3>各设备合格率</h3>
              <ReactEcharts option={qualifiedOption} style={{ height: 280 }} notMerge lazyUpdate />
            </section>
            <section className={styles.chartCard}>
              <h3>各铆点测量值分布 (铆接力)</h3>
              <ReactEcharts option={forceOption} style={{ height: 280 }} notMerge lazyUpdate />
            </section>
          </div>

          <div className={styles.filterBar}>
            {filterFields.map(field => (
              <React.Fragment key={field.label}>
                <span>{field.label}</span>
                <Select
                  className={styles.select}
                  value={filterValues[field.key]}
                  onChange={value => {
                    setCurrentPage(1);
                    setFilterValues(prev => ({ ...prev, [field.key]: value || 'all' }));
                  }}
                >
                  <Select.Option value="all">全部</Select.Option>
                  {field.options.map(option => (
                    <Select.Option key={`${field.label}-${option.value}`} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </React.Fragment>
            ))}
            <button
              type="button"
              onClick={() => {
                setCurrentPage(1);
                setFilterValues(defaultFilterValues);
              }}
            >
              重置
            </button>
          </div>

          <section className={styles.tableCard}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  {columns.map(column => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map(row => (
                  <tr
                    key={`${row[1]}-${row[4]}`}
                    className={styles.clickableRow}
                    title="点击查看曲线轨迹"
                    onClick={() => setActiveRow(row)}
                  >
                    {row.slice(0, 18).map((cell, index) => (
                      <td key={`${columns[index]}-${cell}`}>{index === 3 ? <strong>{cell}</strong> : cell}</td>
                    ))}
                    <td>{row[18]}</td>
                    <td>{row[19]}</td>
                    <td><span className={styles.okTag}>{row[20]}</span></td>
                    <td>{row[21]}</td>
                    <td>
                      <a>曲线轨迹</a>
                      <a>铆接曲线</a>
                      <a className={styles.greenLink}>窗口分析</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.pagination}>
              <span>
                {(currentPage - 1) * PAGE_SIZE + (tableRows.length > 0 ? 1 : 0)}-
                {(currentPage - 1) * PAGE_SIZE + tableRows.length} / 共 {tableTotal} 条
              </span>
              <div>
                <button type="button">15条/页</button>
                <button type="button" disabled={currentPage <= 1} onClick={() => setCurrentPage(1)}>«</button>
                <button type="button" disabled={currentPage <= 1} onClick={() => setCurrentPage(page => Math.max(1, page - 1))}>‹</button>
                {Array.from({ length: Math.min(7, totalPages) }, (_, index) => index + 1).map(page => (
                  <button
                    type="button"
                    key={page}
                    className={page === currentPage ? styles.activePage : undefined}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button type="button" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}>›</button>
                <button type="button" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(totalPages)}>»</button>
              </div>
            </div>
          </section>

          {activeRow && (
            <div className={styles.modalMask} onClick={() => setActiveRow(null)}>
              <section className={styles.trackModal} onClick={event => event.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <strong>曲线轨迹: {getTrackTitle(activeRow)}</strong>
                  <button type="button" aria-label="关闭" onClick={() => setActiveRow(null)}>
                    ×
                  </button>
                </div>
                <div className={styles.trackGrid}>
                  {trackCharts.map(chart => (
                    <section className={styles.trackCard} key={chart.title}>
                      <h4>{chart.title}</h4>
                      <ReactEcharts option={chart.option} style={{ height: 224 }} notMerge lazyUpdate />
                    </section>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </Content>
    </>
  );
};

export default FinalValue;
