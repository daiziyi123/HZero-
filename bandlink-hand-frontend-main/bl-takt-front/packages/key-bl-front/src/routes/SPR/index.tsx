import React, { useMemo, useState } from 'react';
import { Button, DatePicker, Select } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import ReactEcharts from 'echarts-for-react';
import formatterCollections from 'utils/intl/formatterCollections';
import styles from './index.less';

const modelPrompt = 'tarzan.sprRivetCurve';

const curveSeries = [
  { key: 'displacement', name: '位移(mm)', color: '#4aa3df' },
  { key: 'pressure', name: '压力(kN)', color: '#6cc051' },
  { key: 'firstDerivative', name: '一阶导数(dy/dx)', color: '#dfa846' },
  { key: 'speed', name: '速度(mm/s)', color: '#e06b71' },
  { key: 'torque', name: '扭矩(Nm)', color: '#9b62b6' },
];

const chartRows = [
  { device: 'SPR1', processId: '20', serialNo: '0234', chartId: 'Chart_075014_208_0234_20' },
  { device: 'SPR1', processId: '21', serialNo: '0234', chartId: 'Chart_075018_509_0234_21' },
  { device: 'SPR1', processId: '22', serialNo: '0234', chartId: 'Chart_075023_820_0234_22' },
  { device: 'SPR1', processId: '23', serialNo: '0234', chartId: 'Chart_075027_963_0234_23' },
  { device: 'SPR1', processId: '24', serialNo: '0234', chartId: 'Chart_075031_110_0234_24' },
];

const metrics = [
  { icon: '⚡', value: '66.3', label: '最大冲压力(kN)' },
  { icon: '📏', value: '277.9', label: '最大位移(mm)' },
  { icon: '🏃', value: '47.2', label: '平均速度(mm/s)' },
  { icon: '⚙', value: '55.8', label: '平均扭矩(Nm)' },
  { icon: '📈', value: '21.54', label: '最大一阶导数(dy/dx)' },
  { icon: '📍', value: '7389~65535', label: '铆钉位置范围(mm)' },
  { icon: '🔔', value: '-5.66', label: '最小一阶导数(dy/dx)' },
  { icon: '🛠', value: '24206', label: '平均铆钉位置(mm)' },
];

const detailRows = [
  { time: 1260, displacement: 256.47, pressure: 0.001, firstDerivative: 0.087, rivetPosition: 65535, speed: 146.1, torque: -33.3 },
  { time: 1280, displacement: 267.18, pressure: 0.002, firstDerivative: 0.421, rivetPosition: 65482, speed: 142.8, torque: -31.6 },
  { time: 1320, displacement: 318.92, pressure: 1.214, firstDerivative: 0.316, rivetPosition: 61208, speed: 133.5, torque: -24.2 },
  { time: 1380, displacement: 471.66, pressure: 26.384, firstDerivative: 58.783, rivetPosition: 44512, speed: 78.3, torque: 42.7 },
  { time: 1440, displacement: 612.31, pressure: 43.206, firstDerivative: 36.521, rivetPosition: 28631, speed: 12.4, torque: 55.1 },
  { time: 1500, displacement: 681.04, pressure: 52.114, firstDerivative: 84.903, rivetPosition: 19885, speed: 22.6, torque: 78.8 },
  { time: 1560, displacement: 734.6, pressure: 82.519, firstDerivative: 77.248, rivetPosition: 12503, speed: 10.1, torque: 88.6 },
  { time: 1640, displacement: 749.34, pressure: 99.104, firstDerivative: 40.206, rivetPosition: 8519, speed: 4.5, torque: 98.4 },
];

function buildCurveData() {
  const points: any[] = [];
  for (let i = 0; i <= 120; i += 1) {
    const time = 1237 + i * 4.22;
    const progress = i / 120;
    const pulse = Math.sin(i * 0.85) * 2.4;
    const displacement = Math.min(100, Math.max(0, progress * 122 - Math.max(0, progress - 0.38) * 52 + Math.sin(i / 5) * 2));
    const pressure = Math.max(0, Math.min(100, (progress - 0.32) * 148 + Math.sin(i / 9) * 8));
    const speed = Math.max(0, 98 * Math.pow(1 - progress, 2.8) + Math.sin(i / 3.2) * 8);
    const firstDerivative =
      progress < 0.34
        ? 20 + pulse
        : progress < 0.55
          ? 36 + Math.sin(i / 2.4) * 22
          : progress < 0.72
            ? 78 + Math.sin(i / 2) * 16
            : 88 - (progress - 0.72) * 190 + pulse;
    const torque =
      progress < 0.18
        ? progress * 190 + pulse
        : progress < 0.45
          ? 32 + Math.sin(i * 0.75) * 5 + progress * 45
          : progress < 0.62
            ? 70 + Math.sin(i / 2.2) * 11
            : Math.min(100, 80 + (progress - 0.62) * 75 + Math.sin(i) * 2);
    points.push({
      time: Number(time.toFixed(0)),
      displacement: Number(displacement.toFixed(2)),
      pressure: Number(pressure.toFixed(2)),
      firstDerivative: Number(Math.max(0, Math.min(100, firstDerivative)).toFixed(2)),
      speed: Number(Math.max(0, Math.min(100, speed)).toFixed(2)),
      torque: Number(Math.max(0, Math.min(100, torque)).toFixed(2)),
    });
  }
  return points;
}

const curveData = buildCurveData();

const SPRRivetCurve = observer(() => {
  const [activeChartId, setActiveChartId] = useState(chartRows[0].chartId);
  const [visibleSeries, setVisibleSeries] = useState(curveSeries.map(item => item.key));

  const chartOption = useMemo(
    () => ({
      color: curveSeries.map(item => item.color),
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      legend: {
        top: 0,
        right: 160,
        itemWidth: 22,
        itemHeight: 8,
        textStyle: { color: '#4b5563', fontSize: 12 },
        data: curveSeries.filter(item => visibleSeries.includes(item.key)).map(item => item.name),
      },
      toolbox: {
        right: 8,
        top: 0,
        feature: {
          dataZoom: {},
          restore: {},
          saveAsImage: {},
        },
      },
      grid: {
        top: 48,
        left: 56,
        right: 24,
        bottom: 56,
      },
      dataZoom: [
        {
          type: 'slider',
          height: 18,
          bottom: 16,
          start: 0,
          end: 100,
        },
        { type: 'inside' },
      ],
      xAxis: {
        type: 'category',
        name: '时间(ms)',
        nameLocation: 'middle',
        nameGap: 30,
        boundaryGap: false,
        data: curveData.map(item => item.time),
        axisLine: { lineStyle: { color: '#cfd6e1' } },
        axisLabel: { color: '#6b7280' },
        splitLine: { show: true, lineStyle: { color: '#e7ebf1' } },
      },
      yAxis: {
        type: 'value',
        name: '归一化(%)',
        min: 0,
        max: 100,
        axisLine: { lineStyle: { color: '#cfd6e1' } },
        axisLabel: { color: '#6b7280' },
        splitLine: { lineStyle: { color: '#e7ebf1' } },
      },
      series: curveSeries
        .filter(item => visibleSeries.includes(item.key))
        .map(item => ({
          name: item.name,
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 2, color: item.color },
          data: curveData.map(row => row[item.key]),
        })),
    }),
    [visibleSeries],
  );

  const handleSeriesChange = (key: string) => {
    setVisibleSeries(prev => {
      if (prev.includes(key)) {
        return prev.length > 1 ? prev.filter(item => item !== key) : prev;
      }
      return [...prev, key];
    });
  };

  return (
    <>
      <Header title={intl.get(`${modelPrompt}.title`).d('铆接曲线分析')} />
      <Content>
        <div className={styles.page}>
          <div className={styles.filterBar}>
            <span className={styles.formLabel}>铆接日期:</span>
            <DatePicker placeholder="yyyy/mm/dd" clearButton />
            <span className={styles.splitText}>至</span>
            <DatePicker placeholder="yyyy/mm/dd" clearButton />
            <span className={styles.formLabel}>设备:</span>
            <Select className={styles.select} value="all" clearButton>
              <Select.Option value="all">全部设备</Select.Option>
              <Select.Option value="spr1">SPR1</Select.Option>
              <Select.Option value="spr2">SPR2</Select.Option>
            </Select>
            <span className={styles.formLabel}>车身流水号:</span>
            <Select className={styles.select} value="all" clearButton>
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="0234">0234</Select.Option>
              <Select.Option value="0235">0235</Select.Option>
            </Select>
            <Button color="primary">查询</Button>
            <Button>重置</Button>
          </div>

          <div className={styles.workbench}>
            <aside className={styles.summaryPanel}>
              <div className={styles.panelHeader}>
                <span>图表摘要</span>
                <Select className={styles.headerSelect} value="all">
                  <Select.Option value="all">全部编号</Select.Option>
                  <Select.Option value="spr1">SPR1</Select.Option>
                </Select>
              </div>
              <div className={styles.summaryTable}>
                <div className={styles.summaryHead}>
                  <span>设备</span>
                  <span>流程程序号(ID)</span>
                  <span>流水号</span>
                  <span>图表ID</span>
                </div>
                {chartRows.map(row => (
                  <button
                    type="button"
                    className={`${styles.summaryRow} ${activeChartId === row.chartId ? styles.activeRow : ''}`}
                    key={row.chartId}
                    onClick={() => setActiveChartId(row.chartId)}
                  >
                    <span>{row.device}</span>
                    <span>{row.processId}</span>
                    <span>{row.serialNo}</span>
                    <span title={row.chartId}>{row.chartId}</span>
                  </button>
                ))}
              </div>
              <div className={styles.pagination}>
                <span>共 20 条 | 第1/4页</span>
                <button type="button">‹</button>
                <button type="button" className={styles.currentPage}>1</button>
                <button type="button">2</button>
                <button type="button">3</button>
                <button type="button">4</button>
                <button type="button">›</button>
              </div>
            </aside>

            <main className={styles.chartArea}>
              <div className={styles.metricGrid}>
                {metrics.map(item => (
                  <div className={styles.metricCard} key={item.label}>
                    <span className={styles.metricIcon}>{item.icon}</span>
                    <div>
                      <strong>{item.value}</strong>
                      <p>{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <section className={styles.chartPanel}>
                <div className={styles.chartControls}>
                  <span>X轴:</span>
                  <Select className={styles.axisSelect} value="time">
                    <Select.Option value="time">时间</Select.Option>
                    <Select.Option value="displacement">位移</Select.Option>
                  </Select>
                  <span>Y轴:</span>
                  {curveSeries.map(item => (
                    <label className={styles.checkItem} key={item.key}>
                      <input
                        type="checkbox"
                        checked={visibleSeries.includes(item.key)}
                        onChange={() => handleSeriesChange(item.key)}
                      />
                      {item.name.replace(/\(.+\)/, '')}
                    </label>
                  ))}
                  <span className={styles.hint}>多通道曲线窗口 - 化显示(0-100%)</span>
                </div>
                <div className={styles.chartTitle}>SPR1 / {activeChartId}</div>
                <ReactEcharts option={chartOption} style={{ height: 430, width: '100%' }} notMerge lazyUpdate />
              </section>
            </main>
          </div>

          <section className={styles.dataPanel}>
            <div className={styles.dataTitle}>
              <span>曲线数据点 | SPR1 / {activeChartId}</span>
              <em>231个数据点</em>
            </div>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>时间(ms)</th>
                  <th>位移(mm)</th>
                  <th>压力(kN)</th>
                  <th>一阶导数(dy/dx)</th>
                  <th>铆钉位置(mm)</th>
                  <th>速度(mm/s)</th>
                  <th>扭矩(Nm)</th>
                </tr>
              </thead>
              <tbody>
                {detailRows.map(row => (
                  <tr key={row.time}>
                    <td>{row.time}</td>
                    <td>{row.displacement}</td>
                    <td>{row.pressure}</td>
                    <td>{row.firstDerivative}</td>
                    <td>{row.rivetPosition}</td>
                    <td>{row.speed}</td>
                    <td>{row.torque}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </Content>
    </>
  );
});

export default formatterCollections({
  code: [modelPrompt],
})(SPRRivetCurve);
