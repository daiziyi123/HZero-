import React, { useMemo, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Button, Icon } from 'choerodon-ui';
import { DatePicker } from 'choerodon-ui/pro';
import moment, { Moment } from 'moment';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getScoreColor, resolveStatusFromHi } from '../../../shared/equipmentHealth/utils';
import {
  findCylinderDevice,
  getCylinderDetailMeta,
  getCylinderSubScores,
} from '../../data/mockData';
import DetailTabsNav, { CylinderDetailTabKey } from './components/DetailTabsNav';
import ActionTrendTab from './tabs/ActionTrendTab';
import AlarmAnalysisTab from './tabs/AlarmAnalysisTab';
import HealthAnalysisTab from './tabs/HealthAnalysisTab';

const modelPrompt = 'tarzan.cylinderHealthDetail';

/** 气缸详情 · 菜单独立页（P04-2 设计稿） */
const CylinderDetail: React.FC<RouteComponentProps<{ deviceId?: string }>> = (props) => {
  const { history, match } = props;
  const deviceId = match?.params?.deviceId || 'clamp-cyl-01';
  const device = useMemo(() => findCylinderDevice(deviceId), [deviceId]);
  const meta = useMemo(() => getCylinderDetailMeta(deviceId), [deviceId]);
  const subScores = useMemo(() => getCylinderSubScores(device), [device]);

  const [startDate, setStartDate] = useState<Moment>(moment('2026-06-06'));
  const [endDate, setEndDate] = useState<Moment>(moment('2026-07-06'));
  const [activeTab, setActiveTab] = useState<CylinderDetailTabKey>('action');

  const score = device ? Math.round(device.healthIndex) : 16;
  const status = device ? resolveStatusFromHi(device.healthIndex) : '严重';
  const scoreColor = getScoreColor(status);

  const handleBack = () => {
    history.push('/ipfm/cylinder-health-overview');
  };

  const infoItems: { label: string; value: string }[] = [
    { label: '夹具编号', value: meta.fixtureCode },
    { label: '夹具名称', value: meta.fixtureName },
    { label: '组号', value: meta.groupNo },
    { label: '气缸用途', value: meta.usage },
    { label: '气缸品牌', value: meta.brand },
    { label: '气缸型号', value: meta.model },
    { label: '标准行程', value: meta.standardStroke },
    { label: '开合角度', value: meta.openAngle },
    { label: '5BAR夹紧力矩', value: meta.clampTorque },
    { label: '缸径', value: meta.bore },
    { label: '重量', value: meta.weight },
    { label: '电磁阀编号', value: meta.valveCode },
    { label: '使用日期', value: meta.startDate },
    { label: '使用年限', value: meta.serviceYears },
    { label: '动作次数', value: device ? String(device.actionCount) : meta.actionCount },
    { label: '设计寿命', value: meta.designLife },
    { label: '累计报警次数', value: meta.alarmCount },
  ];

  return (
    <div className="cylinder-detail-page">
      <Header
        title={
          <span className="cd-header-title">
            <Icon type="show_chart" className="cd-header-icon" />
            {intl.get(`${modelPrompt}.title`).d('气缸健康详情')}
            <span className="cd-header-sep">·</span>
            <span className="cd-header-code">{meta.detailTitle}</span>
          </span>
        }
      >
        <Button icon="arrow_back" onClick={handleBack}>
          {intl.get(`${modelPrompt}.back`).d('返回总览')}
        </Button>
      </Header>

      <Content>
        <div className="cd-info-card">
          {infoItems.map((item) => (
            <div key={item.label} className="cd-info-cell">
              <span className="cd-info-label">{item.label}</span>
              <span className="cd-info-value">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="cd-score-card">
          <div className="cd-score-main">
            <div className="cd-score-left">
              <div className="cd-score-circle">
                <span className="cd-score-value" style={{ color: scoreColor }}>{score}</span>
                <span className="cd-score-total">/100</span>
              </div>
              <span
                className="cd-score-badge"
                style={{ backgroundColor: `${scoreColor}1a`, color: scoreColor }}
              >
                综合评级 · {status}
              </span>
            </div>
            <div className="cd-score-time">
              <Icon type="access_time_filled" className="cd-time-icon" />
              <span>诊断时间: 2026-07-06 11:23:43</span>
            </div>
          </div>

          <div className="cd-sub-scores">
            {subScores.map((item) => (
              <div key={item.label} className="cd-sub-item">
                <div className="cd-sub-head">
                  <span className="cd-sub-label">{item.label}</span>
                  <span className="cd-sub-value">
                    <span style={{ color: item.color }}>{item.value}</span>
                    <span className="cd-sub-total">/100</span>
                  </span>
                </div>
                <div className="cd-sub-bar">
                  <div
                    className="cd-sub-fill"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cd-filter-bar">
          <div className="cd-date-group">
            <span className="cd-date-label">开始日期</span>
            <DatePicker value={startDate} onChange={(val) => val && setStartDate(val)} />
          </div>
          <div className="cd-date-group">
            <span className="cd-date-label">结束日期</span>
            <DatePicker value={endDate} onChange={(val) => val && setEndDate(val)} />
          </div>
          <Button type="primary" className="cd-query-btn">
            <Icon type="search" />
            查询
          </Button>
        </div>

        <div className="cd-tabs-container">
          <DetailTabsNav activeKey={activeTab} onChange={setActiveTab} />
          <div className="cd-tabs-content">
            <ActionTrendTab active={activeTab === 'action'} />
            <AlarmAnalysisTab active={activeTab === 'alarm'} />
            <HealthAnalysisTab active={activeTab === 'health'} />
          </div>
        </div>
      </Content>

      <style>{`
        .cylinder-detail-page { background: #f5f7fa; }

        .cd-header-title { display: inline-flex; align-items: center; gap: 8px; }
        .cd-header-icon { color: #2563eb !important; font-size: 20px !important; }
        .cd-header-sep { color: #cbd5e1; }
        .cd-header-code { color: #475569; font-weight: 600; font-size: 15px; }

        .cd-info-card {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 16px 24px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 16px;
        }
        .cd-info-cell { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .cd-info-label { font-size: 12px; color: #94a3b8; }
        .cd-info-value { font-size: 14px; color: #0f172a; font-weight: 600; word-break: break-word; }

        .cd-score-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 16px;
        }
        .cd-score-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 20px;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 20px;
        }
        .cd-score-left { display: flex; align-items: center; gap: 16px; }
        .cd-score-circle {
          width: 84px; height: 84px;
          background: #fff;
          border: 2px solid #e2e8f0;
          border-radius: 50%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }
        .cd-score-value { font-size: 34px; font-weight: 700; line-height: 1; }
        .cd-score-total { font-size: 12px; color: #94a3b8; }
        .cd-score-badge { font-size: 14px; font-weight: 600; padding: 6px 16px; border-radius: 20px; }
        .cd-score-time { display: flex; align-items: center; gap: 6px; background: #f1f5f9; padding: 6px 12px; border-radius: 20px; }
        .cd-time-icon { font-size: 14px !important; color: #64748b !important; }
        .cd-score-time span { font-size: 13px; color: #64748b; }

        .cd-sub-scores { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .cd-sub-item { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; }
        .cd-sub-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .cd-sub-label { font-size: 13px; font-weight: 500; color: #64748b; }
        .cd-sub-value { font-size: 18px; font-weight: 700; }
        .cd-sub-total { font-size: 12px; color: #94a3b8; margin-left: 2px; }
        .cd-sub-bar { height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
        .cd-sub-fill { height: 100%; border-radius: 4px; }

        .cd-filter-bar {
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
          background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
          padding: 12px 16px; margin-bottom: 14px;
        }
        .cd-date-group { display: flex; align-items: center; gap: 8px; }
        .cd-date-label { font-size: 13px; color: #64748b; white-space: nowrap; }
        .cd-query-btn {
          border-radius: 8px !important; height: 32px !important;
          display: inline-flex !important; align-items: center !important; gap: 6px !important;
        }

        .cd-tabs-container {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.04);
          overflow: hidden;
        }
        .cd-tabs-header {
          display: flex;
          gap: 4px;
          padding: 0 16px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .cd-tab-btn {
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #64748b;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }
        .cd-tab-btn i { font-size: 16px !important; }
        .cd-tab-btn-active {
          color: #2563eb;
          border-bottom-color: #2563eb;
          background: #fff;
        }
        .cd-tab-btn:hover:not(.cd-tab-btn-active) {
          color: #475569;
          background: #f1f5f9;
        }
        .cd-tabs-content {
          padding: 18px 20px;
          background: #fff;
        }

        .cd-tab-pane { animation: cdFadeIn 0.2s ease; }
        @keyframes cdFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .cd-trend-chart-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 14px;
        }
        .cd-duration-chart-card,
        .cd-boxplot-card,
        .cd-alarm-chart-card,
        .cd-health-chart-card,
        .cd-table-section {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 14px;
        }
        .cd-duration-chart-head,
        .cd-boxplot-head,
        .cd-alarm-chart-head,
        .cd-health-chart-head,
        .cd-table-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .cd-table-head-between { justify-content: flex-end; gap: 8px; }
        .cd-duration-chart-title {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: #0f172a;
        }
        .cd-threshold-link {
          background: none; border: none; padding: 0;
          font-size: 12px; color: #2563eb; cursor: pointer; font-weight: 500;
        }
        .cd-threshold-link:hover { text-decoration: underline; }
        .cd-boxplot-icon,
        .cd-alarm-chart-icon,
        .cd-table-head-icon { font-size: 16px !important; color: #64748b !important; }
        .cd-boxplot-title,
        .cd-alarm-chart-title,
        .cd-health-chart-title,
        .cd-table-head-title {
          font-size: 13px; font-weight: 600; color: #475569;
        }
        .cd-health-chart-icon { font-size: 16px !important; color: #18a058 !important; }
        .cd-health-chart-head { justify-content: space-between; }
        .cd-alarm-chart-head { justify-content: space-between; }
        .cd-alarm-chart-icon { color: #f59e0b !important; }

        .cd-table-section { padding: 12px 16px 8px; }
        .cd-link-btn { color: #2563eb; cursor: pointer; font-size: 13px; }
        .cd-link-btn:hover { text-decoration: underline; }

        .cd-alarm-list-section {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 16px;
        }
        .cd-alarm-list-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 12px;
        }
        .cd-alarm-summary {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
          font-size: 13px; color: #475569;
        }
        .cd-alarm-summary b { color: #0f172a; font-weight: 700; }
        .cd-alarm-summary-sep { color: #cbd5e1; }
        .cd-alarm-bell { font-size: 16px !important; color: #dc2626 !important; }
        .cd-alarm-list-title { font-size: 13px; font-weight: 600; color: #475569; }
        .cd-alarm-records { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
        .cd-alarm-record-row {
          display: grid;
          grid-template-columns: 12px 80px 170px 1fr;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          background: #f8fafc;
          border-radius: 8px;
          font-size: 13px;
        }
        .cd-alarm-dot {
          width: 8px; height: 8px; border-radius: 50%; display: inline-block;
        }
        .cd-alarm-dot-clamp { background: #dc2626; }
        .cd-alarm-dot-release { background: #f59e0b; }
        .cd-alarm-record-type { font-weight: 600; color: #0f172a; }
        .cd-alarm-record-time { color: #64748b; }
        .cd-alarm-record-desc { color: #94a3b8; text-align: right; }
        .cd-alarm-pagination {
          display: flex; justify-content: flex-end; align-items: center; gap: 12px;
        }
        .cd-page-indicator { font-size: 12px; color: #64748b; }

        .cd-level-severe {
          display: inline-block; padding: 2px 10px; border-radius: 12px;
          font-size: 12px; font-weight: 600; background: #fee2e2; color: #dc2626;
        }
        .cd-risk-text { color: #dc2626; font-size: 13px; }
      `}</style>
    </div>
  );
};

export default withRouter(
  formatterCollections({ code: [modelPrompt, 'tarzan.common'] })(observer(CylinderDetail)),
);
