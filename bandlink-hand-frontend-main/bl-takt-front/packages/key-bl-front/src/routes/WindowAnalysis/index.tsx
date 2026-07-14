import React, { useMemo, useState } from 'react';
import { DatePicker, Select } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ReactEcharts from 'echarts-for-react';
import styles from './index.less';

const charts = ['075014208', '075018509', '075023820', '075027963', '075031110'];

const metrics = [
  { icon: '▰', value: 15, label: '筛选窗口数', tone: 'blue' },
  { icon: '✓', value: 15, label: '合格窗口', tone: 'green' },
  { icon: '×', value: 0, label: '不合格窗口', tone: 'red' },
  { icon: '△', value: 0, label: '未激活', tone: 'orange' },
  { icon: '↗', value: '19.26', label: '平均力(kN)', tone: 'cyan' },
];

const tableRows = [
  ['2026-06-18 07:50:14', 'SPR1', '389075', 1, 0, '075014208', '6-OK', 0, '合格', '合格', '合格', '-', '合格', 3, 'X:259.61 Y:-0.063 Z:1288', 'X:266.86 Y:1.486 Z:1360', 1.486, 0.566, 74.0, '1/1/1/1', '-', '-', '0.000 / 0.000'],
  ['2026-06-18 07:50:14', 'SPR1', '389075', 2, 0, '075014208', '6-OK', 0, '合格', '合格', '合格', '-', '合格', 3, 'X:268.50 Y:5.194 Z:1377', 'X:269.30 Y:12.985 Z:1385', 12.985, 9.487, 8.0, '1/1/1/1', 'OK', '-', '8.987 / 11.286'],
  ['2026-06-18 07:50:14', 'SPR1', '389075', 3, 0, '075014208', '6-OK', 0, '合格', '合格', '合格', '-', '合格', 3, 'X:276.55 Y:46.294 Z:1535', 'X:0.00 Y:0.000 Z:0', 66.342, 60.609, 176.0, '1/1/1/1', '-', '-', '0.000 / 0.000'],
  ['2026-06-18 07:50:18', 'SPR1', '389076', 1, 0, '075018509', '6-OK', 0, '合格', '合格', '合格', '-', '合格', 3, 'X:259.61 Y:0.516 Z:1288', 'X:266.86 Y:1.998 Z:1360', 2.054, 1.197, 74.0, '1/1/1/1', '-', '-', '0.000 / 0.000'],
  ['2026-06-18 07:50:18', 'SPR1', '389076', 2, 0, '075018509', '6-OK', 0, '合格', '合格', '合格', '-', '合格', 3, 'X:268.51 Y:5.194 Z:1377', 'X:269.16 Y:12.985 Z:1383', 12.985, 8.949, 6.0, '1/1/1/1', 'OK', '-', '9.969 / 12.044'],
  ['2026-06-18 07:50:18', 'SPR1', '389076', 3, 0, '075018509', '6-OK', 0, '合格', '合格', '合格', '-', '合格', 3, 'X:276.47 Y:47.799 Z:1546', 'X:0.00 Y:0.000 Z:0', 65.168, 60.524, 182.0, '1/1/1/1', '-', '-', '0.000 / 0.000'],
  ['2026-06-18 07:50:23', 'SPR1', '389077', 1, 0, '075023820', '6-OK', 0, '合格', '合格', '合格', '-', '合格', 3, 'X:261.31 Y:0.656 Z:1296', 'X:268.56 Y:2.770 Z:1368', 2.770, 1.624, 74.0, '1/1/1/1', '-', '-', '0.000 / 0.000'],
  ['2026-06-18 07:50:23', 'SPR1', '389077', 2, 0, '075023820', '6-OK', 0, '合格', '合格', '合格', '-', '合格', 3, 'X:269.93 Y:5.194 Z:1382', 'X:270.68 Y:12.985 Z:1390', 12.985, 8.639, 8.0, '1/1/1/1', 'OK', '-', '7.016 / 10.445'],
  ['2026-06-18 07:50:23', 'SPR1', '389077', 3, 0, '075023820', '6-OK', 0, '合格', '合格', '合格', '-', '合格', 3, 'X:276.05 Y:32.217 Z:1470', 'X:0.00 Y:0.000 Z:0', 45.461, 41.521, 264.0, '1/1/1/1', '-', '-', '0.000 / 0.000'],
  ['2026-06-18 07:50:27', 'SPR1', '389078', 1, 0, '075027963', '6-OK', 0, '合格', '合格', '合格', '-', '合格', 3, 'X:262.81 Y:0.605 Z:1302', 'X:269.56 Y:2.611 Z:1369', 2.611, 1.557, 68.0, '1/1/1/1', '-', '-', '0.000 / 0.000'],
  ['2026-06-18 07:50:27', 'SPR1', '389078', 2, 0, '075027963', '6-OK', 0, '合格', '合格', '合格', '-', '合格', 3, 'X:271.07 Y:5.194 Z:1384', 'X:271.91 Y:12.985 Z:1393', 12.985, 9.854, 8.0, '1/1/1/1', 'OK', '-', '6.892 / 12.081'],
  ['2026-06-18 07:50:27', 'SPR1', '389078', 3, 0, '075027963', '6-OK', 0, '合格', '合格', '合格', '-', '合格', 3, 'X:276.61 Y:30.924 Z:1449', 'X:0.00 Y:0.000 Z:0', 39.094, 36.932, 142.0, '1/1/1/1', '-', '-', '0.000 / 0.000'],
  ['2026-06-18 07:50:31', 'SPR1', '389079', 1, 0, '075031110', '6-OK', 0, '合格', '合格', '合格', '-', '合格', 3, 'X:262.81 Y:0.642 Z:1302', 'X:269.56 Y:2.558 Z:1369', 2.558, 1.556, 68.0, '1/1/1/1', '-', '-', '0.000 / 0.000'],
  ['2026-06-18 07:50:31', 'SPR1', '389079', 2, 0, '075031110', '6-OK', 0, '合格', '合格', '合格', '-', '合格', 3, 'X:270.97 Y:5.194 Z:1383', 'X:272.09 Y:12.985 Z:1395', 12.985, 9.427, 12.0, '1/1/1/1', 'OK', '-', '5.378 / 8.880'],
  ['2026-06-18 07:50:31', 'SPR1', '389079', 3, 0, '075031110', '6-OK', 0, '合格', '合格', '合格', '-', '合格', 3, 'X:276.64 Y:31.288 Z:1454', 'X:0.00 Y:0.000 Z:0', 38.601, 36.490, 108.0, '1/1/1/1', '-', '-', '0.000 / 0.000'],
];

const columns = [
  '铆接时间',
  '设备',
  '关联ID',
  '窗口号',
  '通道',
  '图表ID',
  '评估结果',
  '原因',
  '边缘检测',
  '窗口评估',
  '扩展评估',
  '平均评估',
  '总体',
  '严重级',
  '入口X(位移mm)/Y(压力kN)/Z(时间ms)',
  '出口X(位移mm)/Y(压力kN)/Z(时间ms)',
  '最大力(kN)',
  '平均力(kN)',
  '耗时(ms)',
  '激活:边缘/窗口/扩展/总体',
  '斜率监测',
  '时间监测',
  '斜率(最小/最大)',
];

function buildEnvelopeData(offset = 0) {
  const data: any[] = [];
  for (let i = 0; i < 24; i += 1) {
    const x = 258 + i * 0.8 + offset;
    const y = i < 15 ? 0.45 + i * 0.13 : 5.2 + (i - 15) * 0.95;
    data.push([Number(x.toFixed(2)), Number(y.toFixed(2))]);
  }
  return data;
}

const barOption = {
  color: ['#62c238', '#ff6b6b'],
  tooltip: { trigger: 'axis' },
  legend: { top: 8, right: 210, data: ['合格', '不合格'] },
  grid: { left: 50, right: 28, top: 58, bottom: 50 },
  xAxis: {
    type: 'category',
    data: charts,
    axisLabel: { rotate: 18, color: '#697586' },
    axisLine: { lineStyle: { color: '#aeb8c5' } },
  },
  yAxis: {
    type: 'value',
    name: '窗口数',
    max: 3,
    splitLine: { lineStyle: { color: '#e2e8f0' } },
    axisLabel: { color: '#697586' },
  },
  series: [
    { name: '合格', type: 'bar', barWidth: 58, stack: 'window', data: [3, 3, 3, 3, 3] },
    { name: '不合格', type: 'bar', barWidth: 58, stack: 'window', data: [0, 0, 0, 0, 0] },
  ],
};

const getEnvelopeOption = (title: string, xMax: number, xName: string) => ({
  color: ['#55c35a', '#f15d65', '#e7a13b', '#7a7f8a'],
  tooltip: { trigger: 'axis' },
  grid: { left: 58, right: 28, top: 52, bottom: 44 },
  xAxis: {
    type: 'value',
    min: 0,
    max: xMax,
    name: xName,
    nameLocation: 'middle',
    nameGap: 28,
    splitLine: { lineStyle: { color: '#e2e8f0' } },
    axisLabel: { color: '#697586' },
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 15,
    splitLine: { lineStyle: { color: '#e2e8f0' } },
    axisLabel: { color: '#697586' },
  },
  series: [
    {
      name: '合格窗口',
      type: 'line',
      smooth: true,
      symbolSize: 6,
      data: buildEnvelopeData(xMax > 500 ? 1060 : 0).map(([x, y]) => [xMax > 500 ? x + 20 : x, y]),
      markArea: {
        silent: true,
        itemStyle: { color: 'rgba(80, 80, 80, 0.12)' },
        data: [[{ xAxis: xMax > 500 ? 1326 : 266 }, { xAxis: xMax > 500 ? 1362 : 272 }]],
      },
    },
    {
      name: '边界上限',
      type: 'line',
      symbol: 'none',
      lineStyle: { type: 'dashed', width: 2 },
      data: [
        [xMax > 500 ? 1340 : 268, 5.2],
        [xMax > 500 ? 1340 : 268, 13],
      ],
    },
    {
      name: '边界下限',
      type: 'line',
      symbol: 'none',
      lineStyle: { type: 'dashed', width: 2 },
      data: [
        [xMax > 500 ? 1350 : 271, 5.2],
        [xMax > 500 ? 1350 : 271, 13],
      ],
    },
    {
      name: title,
      type: 'scatter',
      symbolSize: 7,
      data: [
        [xMax > 500 ? 1338 : 267, 5.2],
        [xMax > 500 ? 1340 : 268, 13],
        [xMax > 500 ? 1348 : 270, 13],
      ],
    },
  ],
});

function buildTrackSeries(row: any[]) {
  const rowOffset = Number(row[3] || 1) * 0.35;
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
      displacement: Number((displacement + rowOffset).toFixed(3)),
      pressure: Number(Math.max(0, pressure + rowOffset * 2).toFixed(3)),
      torque: Number(Math.min(106, torque + rowOffset * 4).toFixed(3)),
      speed: Number(Math.max(0, speed - rowOffset * 1.5).toFixed(3)),
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

const getTrackTitle = (row: any[]) => `${row[2]}/${row[1]}/0234/${20 + Number(row[3] || 1) - 1}`;

const WindowAnalysis = () => {
  const [activeRow, setActiveRow] = useState<any[] | null>(null);
  const pressureDisplacementOption = useMemo(
    () => getEnvelopeOption('压力/位移包络线', 300, '位移(mm)'),
    []
  );
  const pressureTimeOption = useMemo(
    () => getEnvelopeOption('压力/时间包络线', 1500, '时间(ms)'),
    []
  );
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
      <Header title="窗口分析 - 包络线质量评估" />
      <Content>
        <div className={styles.page}>
          <div className={styles.titleLine}>
            <span>窗口分析 - 包络线质量评估</span>
            <em>共 15 条</em>
          </div>

          <div className={styles.infoBar}>
            <strong>窗口评估原理:</strong>
            通过监测铆接力-位移曲线是否在预设包络线(窗口)范围内来判定铆接质量。评估维度: 边缘检测 · 窗口内监测 · 扩展窗口监测 · 斜率监测 · 时间监测 · 平均力比较
          </div>

          <div className={styles.filterBar}>
            <span>铆接日期:</span>
            <DatePicker placeholder="yyyy/mm/dd" clearButton />
            <span>至</span>
            <DatePicker placeholder="yyyy/mm/dd" clearButton />
            <span>设备:</span>
            <Select className={styles.select} value="all">
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="spr1">SPR1</Select.Option>
            </Select>
            <span>图表ID:</span>
            <Select className={styles.select} value="all">
              <Select.Option value="all">全部</Select.Option>
              {charts.map(item => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
            <span>窗口号:</span>
            <Select className={styles.select} value="all">
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="1">1</Select.Option>
              <Select.Option value="2">2</Select.Option>
              <Select.Option value="3">3</Select.Option>
            </Select>
            <span>结果:</span>
            <Select className={styles.select} value="all">
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="ok">合格</Select.Option>
              <Select.Option value="ng">不合格</Select.Option>
            </Select>
          </div>

          <div className={styles.metricGrid}>
            {metrics.map(item => (
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
              <h3>各图表窗口合格率</h3>
              <ReactEcharts option={barOption} style={{ height: 280 }} notMerge lazyUpdate />
            </section>
            <section className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h3>压力/位移包络线</h3>
                <Select className={styles.tinySelect} value="all">
                  <Select.Option value="all">全部</Select.Option>
                </Select>
              </div>
              <ReactEcharts option={pressureDisplacementOption} style={{ height: 280 }} notMerge lazyUpdate />
            </section>
            <section className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h3>压力/时间包络线</h3>
                <Select className={styles.tinySelect} value="all">
                  <Select.Option value="all">全部</Select.Option>
                </Select>
              </div>
              <ReactEcharts option={pressureTimeOption} style={{ height: 280 }} notMerge lazyUpdate />
            </section>
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
                {tableRows.map((row, rowIndex) => (
                  <tr
                    key={`${row[0]}-${row[2]}-${row[3]}`}
                    className={styles.clickableRow}
                    title="点击查看曲线轨迹"
                    onClick={() => setActiveRow(row)}
                  >
                    {row.map((cell, cellIndex) => (
                      <td key={`${columns[cellIndex]}-${rowIndex}`}>
                        {['6-OK', '合格', 'OK'].includes(String(cell)) ? (
                          <span className={styles.okTag}>{cell}</span>
                        ) : String(cell) === '-' ? (
                          <span className={styles.emptyTag}>-</span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.pagination}>
              <span>1-15 / 共 15 条</span>
              <div>
                <button type="button">15条/页</button>
                <button type="button">«</button>
                <button type="button">‹</button>
                <button type="button" className={styles.activePage}>1</button>
                <button type="button">›</button>
                <button type="button">»</button>
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

export default WindowAnalysis;
