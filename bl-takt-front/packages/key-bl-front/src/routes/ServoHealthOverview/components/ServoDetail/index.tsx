import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button, Icon } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { findServoDevice } from '../../data/mockData';
import StatusBadges from './components/StatusBadges';
import NameplatePanel from './components/NameplatePanel';
import HealthScoreCard from './components/HealthScoreCard';
import DetailTabsNav, { ServoDetailTabKey } from './components/DetailTabsNav';
import TodayGanttTab from './tabs/TodayGanttTab';
import CycleTrendTab from './tabs/CycleTrendTab';
import ThresholdWarningTab from './tabs/ThresholdWarningTab';
import PeakAnalysisTab from './tabs/PeakAnalysisTab';
import HealthAnalysisTab from './tabs/HealthAnalysisTab';
import {
  buildMockCycles,
  DEFAULT_MOTOR_NAME,
  DEFAULT_THRESHOLDS,
  generateDailyHealthData,
  genGanttIntervals,
  getHealthScoreSummary,
  getInitialRealTimeState,
  getNameplateInfo,
  RealTimeState,
  ThresholdConfig,
  tickRealTimeState,
} from './data/detailMock';

const modelPrompt = 'tarzan.servoHealthDetail';

const ServoDetail: React.FC<RouteComponentProps<{ deviceId?: string }>> = (props) => {
  const { history, match } = props;
  const deviceId = match?.params?.deviceId || 'servo-el01';
  const device = useMemo(() => findServoDevice(deviceId), [deviceId]);

  const [activeTab, setActiveTab] = useState<ServoDetailTabKey>('gantt');
  const [realTime, setRealTime] = useState<RealTimeState>(() => getInitialRealTimeState());
  const [thresholds, setThresholds] = useState<ThresholdConfig>(DEFAULT_THRESHOLDS);

  const nameplate = useMemo(() => getNameplateInfo(), []);
  const cycles = useMemo(() => buildMockCycles(), []);
  const ganttIntervals = useMemo(() => genGanttIntervals(), []);
  const healthData = useMemo(() => generateDailyHealthData(), []);
  const healthSummary = useMemo(() => getHealthScoreSummary(cycles), [cycles]);

  useEffect(() => {
    setRealTime(getInitialRealTimeState());
  }, [deviceId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRealTime((prev) => tickRealTimeState(prev));
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  const handleBack = () => {
    history.push('/ipfm/servo-health-overview');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'gantt':
        return <TodayGanttTab intervals={ganttIntervals} active={activeTab === 'gantt'} />;
      case 'cycle':
        return (
          <CycleTrendTab
            cycles={cycles}
            thresholds={thresholds}
            active={activeTab === 'cycle'}
          />
        );
      case 'threshold':
        return (
          <ThresholdWarningTab
            thresholds={thresholds}
            onThresholdsChange={setThresholds}
            active={activeTab === 'threshold'}
          />
        );
      case 'peak':
        return (
          <PeakAnalysisTab
            cycles={cycles}
            thresholds={thresholds}
            active={activeTab === 'peak'}
          />
        );
      case 'health':
        return (
          <HealthAnalysisTab
            healthData={healthData}
            active={activeTab === 'health'}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="servo-detail-page">
      <Header title={intl.get(`${modelPrompt}.title`).d('伺服电机评估')}>
        <Button funcType="flat" icon="arrow_back" onClick={handleBack}>
          {intl.get(`${modelPrompt}.back`).d('返回')}
        </Button>
      </Header>

      <Content>
        <div className="sd-detail-header">
          <div className="sd-motor-title">
            <Icon type="memory" className="sd-motor-icon" />
            {device?.name || DEFAULT_MOTOR_NAME}
          </div>
        </div>

        <div className="sd-top-info-card">
          <div className="sd-card-title">
            <Icon type="memory" />
            伺服驱动器状态 & 铭牌信息
          </div>
          <StatusBadges state={realTime} />
          <NameplatePanel nameplate={nameplate} state={realTime} thresholds={thresholds} />
          <HealthScoreCard summary={healthSummary} />
        </div>

        <DetailTabsNav activeKey={activeTab} onChange={setActiveTab} />
        <div className="sd-tab-content">{renderTabContent()}</div>
      </Content>

      <style>{`
        .servo-detail-page { background: #f5f7fa; }

        .sd-detail-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        .sd-motor-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
        }
        .sd-motor-icon { font-size: 22px !important; color: #2563eb !important; }

        .sd-top-info-card,
        .sd-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.04);
          padding: 16px 20px;
          margin-bottom: 18px;
          border: 1px solid #e2e8f0;
        }
        .sd-card-mt { margin-top: 0; }

        .sd-card-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-left: 4px solid #2563eb;
          padding-left: 12px;
          color: #0f172a;
        }
        .sd-card-title i { color: #2563eb !important; font-size: 18px !important; }
        .sd-card-title-between { justify-content: space-between; border-left: none; padding-left: 0; }

        .sd-status-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
        .sd-status-badge {
          background: #f8fafc;
          border-radius: 50px;
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #1e293b;
        }
        .sd-led { width: 10px; height: 10px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
        .sd-led-green { background: #18a058; }
        .sd-led-red { background: #e53935; }
        .sd-led-yellow { background: #f59e0b; }
        .sd-led-gray { background: #94a3b8; }

        .sd-nameplate-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 12px;
        }
        .sd-realtime-col { flex: 1.2; min-width: 200px; }
        .sd-nameplate-box {
          flex: 1.3;
          min-width: 260px;
          background: #fafcff;
          border-radius: 14px;
          padding: 12px;
        }
        .sd-section-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
          margin-bottom: 8px;
        }
        .sd-section-icon { font-size: 16px !important; color: #64748b !important; }

        .sd-param-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .sd-param-block {
          background: #f1f5f9;
          border-radius: 16px;
          padding: 10px 16px;
          min-width: 130px;
          text-align: center;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }
        .sd-param-warn { animation: sdBlink 1s infinite; }
        .sd-param-mild { background: #fffbeb; border-left: 4px solid #f59e0b; }
        .sd-param-moderate { background: #fff7ed; border-left: 4px solid #ea580c; }
        .sd-param-severe { background: #fee2e2; border-left: 4px solid #e53935; }
        @keyframes sdBlink {
          0% { background-color: #fef2f2; }
          50% { background-color: #fecaca; }
          100% { background-color: #fef2f2; }
        }
        .sd-param-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #64748b;
          font-weight: 600;
        }
        .sd-param-value { font-size: 24px; font-weight: 700; line-height: 1.2; color: #0f172a; }
        .sd-param-sub { font-size: 11px; color: #64748b; margin-top: 2px; }

        .sd-info-row {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px;
          background: #f8fafc;
          padding: 12px;
          border-radius: 14px;
        }
        .sd-info-item { font-size: 13px; }
        .sd-info-label { color: #64748b; font-weight: 500; }
        .sd-info-value { font-weight: 700; color: #0f172a; }

        .sd-health-score-card {
          background: #f8fafc;
          border-radius: 16px;
          padding: 18px 20px;
          margin-top: 16px;
          border: 1px solid #e2e8f0;
        }
        .sd-score-header {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 16px;
          margin-bottom: 14px;
        }
        .sd-score-main { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .sd-big-score {
          background: #fff;
          border-radius: 50%;
          width: 90px;
          height: 90px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
          border: 1px solid #e2e8f0;
        }
        .sd-score-num { font-size: 38px; font-weight: 800; line-height: 1; }
        .sd-score-total { font-size: 12px; color: #64748b; }
        .sd-grade-badge {
          font-size: 14px;
          font-weight: 600;
          padding: 6px 18px;
          border-radius: 50px;
        }
        .sd-diagnosis-time {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f1f5f9;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 12px;
          color: #475569;
          font-weight: 500;
          white-space: nowrap;
        }
        .sd-time-icon { font-size: 14px !important; color: #2563eb !important; }

        .sd-metrics-grid { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 8px; }
        .sd-metric-item {
          flex: 1;
          min-width: 160px;
          background: #fff;
          border-radius: 14px;
          padding: 12px 14px;
          border: 1px solid #e2e8f0;
        }
        .sd-metric-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 8px;
        }
        .sd-metric-name {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: #64748b;
          letter-spacing: 0.5px;
        }
        .sd-metric-score { font-weight: 800; font-size: 19px; color: #1e293b; }
        .sd-metric-score small { font-size: 11px; font-weight: 500; color: #94a3b8; }
        .sd-progress-bg { background: #e2e8f0; border-radius: 50px; height: 6px; overflow: hidden; }
        .sd-progress-fill { height: 6px; border-radius: 50px; }
        .sd-fill-performance { background: #2563eb; }
        .sd-fill-status { background: #18a058; }
        .sd-fill-life { background: #f59e0b; }

        .sd-tabs-nav {
          display: flex;
          gap: 6px;
          margin-bottom: 18px;
          flex-wrap: wrap;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 4px;
        }
        .sd-tab-btn {
          background: transparent;
          border: none;
          padding: 8px 18px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 50px;
          cursor: pointer;
          color: #64748b;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .sd-tab-btn i { font-size: 16px !important; }
        .sd-tab-btn-active {
          background: #2563eb;
          color: #fff;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }
        .sd-tab-btn:not(.sd-tab-btn-active):hover { background: #e2e8f0; color: #1e293b; }

        .sd-tab-content { animation: sdFadeIn 0.2s ease; }
        @keyframes sdFadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .sd-legend-row {
          display: flex;
          gap: 20px;
          margin-bottom: 12px;
          font-size: 12px;
          align-items: center;
          color: #475569;
        }
        .sd-legend-color {
          width: 14px;
          height: 14px;
          display: inline-block;
          border-radius: 4px;
          margin-right: 6px;
          vertical-align: middle;
        }
        .sd-legend-run { background: #10b981; }
        .sd-legend-idle { background: #e2e8f0; border: 1px solid #cbd5e1; }
        .sd-gantt-chart { width: 100%; height: 320px; margin-top: 8px; }

        .sd-split-layout { display: flex; gap: 16px; flex-wrap: wrap; }
        .sd-trend-area { flex: 3; min-width: 260px; }
        .sd-records-area {
          flex: 1.2;
          min-width: 300px;
          max-width: 450px;
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          padding: 12px;
        }
        .sd-sub-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
          margin-bottom: 8px;
          font-size: 14px;
          color: #0f172a;
        }
        .sd-sub-title i { font-size: 16px !important; color: #64748b !important; }
        .sd-chart-container { height: 360px; width: 100%; }
        .sd-subnote { font-size: 12px; color: #64748b; margin-top: 6px; }

        .sd-filter-bar {
          display: flex;
          gap: 8px;
          align-items: flex-end;
          flex-wrap: wrap;
          margin-bottom: 10px;
          background: #f8fafc;
          padding: 8px 12px;
          border-radius: 14px;
        }
        .sd-filter-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sd-filter-group label {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
        }
        .sd-query-btn {
          border-radius: 50px !important;
          height: 32px !important;
          font-size: 12px !important;
        }
        .sd-reset-btn {
          border-radius: 50px !important;
          height: 32px !important;
          font-size: 12px !important;
          background: #6c757d !important;
          color: #fff !important;
          border: none !important;
        }
        .sd-over-threshold {
          color: #e53935;
          font-weight: bold;
          background: #fee2e2;
          border-radius: 50px;
          padding: 2px 6px;
          display: inline-block;
          font-size: 11px;
        }
        .sd-row-active { background: #dbeafe !important; border-left: 3px solid #2563eb; }

        .sd-warning-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 12px;
        }
        .sd-threshold-btn {
          background: #f59e0b !important;
          color: #fff !important;
          border: none !important;
          border-radius: 50px !important;
          height: 34px !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
        }
        .sd-gen-sample-btn {
          background: #18a058 !important;
          color: #fff !important;
          border: none !important;
          border-radius: 50px !important;
          height: 34px !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
        }

        .sd-stats-row { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 20px; }
        .sd-stat-card {
          flex: 1;
          min-width: 140px;
          background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
          border-radius: 16px;
          padding: 14px 12px;
          text-align: center;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          border: 1px solid #e2e8f0;
          position: relative;
          overflow: hidden;
        }
        .sd-stat-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 6px;
          border-radius: 16px 0 0 16px;
        }
        .sd-stat-card[data-type="torque"]::before { background: #e53935; }
        .sd-stat-card[data-type="speed"]::before { background: #f59e0b; }
        .sd-stat-card[data-type="position"]::before { background: #18a058; }
        .sd-stat-card[data-type="mild"]::before { background: #f59e0b; }
        .sd-stat-card[data-type="moderate"]::before { background: #ea580c; }
        .sd-stat-card[data-type="severe"]::before { background: #e53935; }
        .sd-stat-icon { font-size: 26px !important; margin-bottom: 8px; color: #64748b !important; }
        .sd-stat-number { font-size: 29px; font-weight: 800; color: #0f172a; line-height: 1.2; margin-bottom: 4px; }
        .sd-stat-label { font-size: 11px; font-weight: 500; color: #64748b; text-transform: uppercase; }

        .sd-trend-chart-container { height: 320px; width: 100%; margin-top: 14px; }
        .sd-warning-list-section { margin-top: 24px; }
        .sd-level-pill {
          padding: 2px 8px;
          border-radius: 20px;
          background: #fee2e2;
          font-size: 12px;
        }

        .sd-peak-chart { height: 400px; width: 100%; }
        .sd-health-trend-chart { height: 360px; width: 100%; margin-top: 8px; }
        .sd-health-table-wrap { margin-top: 24px; overflow-x: auto; }

        .sd-level-badge {
          min-width: 60px;
          padding: 2px 10px;
          border-radius: 50px;
          text-align: center;
          font-weight: 600;
          font-size: 12px;
          display: inline-block;
        }
        .sd-level-normal { background: #dcfce7; color: #18a058; }
        .sd-level-attention { background: #fef3c7; color: #d97706; }
        .sd-level-warning { background: #fee2e2; color: #e53935; }
        .sd-level-severe { background: #fee2e2; color: #dc2626; }

        .sd-level-description {
          background: #f8fafc;
          border-radius: 16px;
          padding: 16px;
          margin-top: 20px;
          border: 1px solid #e2e8f0;
        }
        .sd-level-desc-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #0f172a;
        }
        .sd-level-desc-item {
          margin-bottom: 12px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 13px;
          color: #475569;
        }

        .sd-threshold-config { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 12px; }
        .sd-threshold-card {
          flex: 1;
          min-width: 200px;
          background: #f8fafc;
          border-radius: 16px;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
        }
        .sd-threshold-card h4 {
          font-size: 14px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #0f172a;
        }
        .sd-threshold-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 12px;
          color: #475569;
        }
      `}</style>
    </div>
  );
};

export default withRouter(
  formatterCollections({ code: [modelPrompt, 'tarzan.common'] })(observer(ServoDetail)),
);
