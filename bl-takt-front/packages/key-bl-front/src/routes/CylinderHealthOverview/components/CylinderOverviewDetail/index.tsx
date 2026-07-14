import React, { useMemo, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Button, Icon } from 'choerodon-ui';
import { DatePicker } from 'choerodon-ui/pro';
import moment, { Moment } from 'moment';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import SimpleLineChart from '../../../shared/equipmentHealth/SimpleLineChart';
import { getScoreColor, resolveStatusFromHi } from '../../../shared/equipmentHealth/utils';
import {
  cylinderAlarmRecords,
  cylinderClampDurationData,
  cylinderHiIndexData,
  cylinderReleaseDurationData,
  findCylinderDevice,
  getCylinderDetailMeta,
} from '../../data/mockData';

const modelPrompt = 'tarzan.cylinderOverviewDetail';

/** 气缸综合健康总览 · 卡片点击跳转页（P04-1 设计稿） */
const CylinderOverviewDetail: React.FC<RouteComponentProps<{ deviceId?: string }>> = (props) => {
  const { history, match } = props;
  const deviceId = match?.params?.deviceId || 'clamp-cyl-01';
  const device = useMemo(() => findCylinderDevice(deviceId), [deviceId]);
  const meta = useMemo(() => getCylinderDetailMeta(deviceId), [deviceId]);

  const [startDate, setStartDate] = useState<Moment>(moment('2025-06-06'));
  const [endDate, setEndDate] = useState<Moment>(moment('2026-07-06'));

  const healthIndex = device ? device.healthIndex : 25.8;
  const status = resolveStatusFromHi(healthIndex);
  const statusColor = getScoreColor(status);
  const lifeRate = device ? device.lifeRate : 90.8;
  const actionCount = device ? device.actionCount : '890,198';

  const handleBack = () => {
    history.push('/ipfm/cylinder-health-overview');
  };

  const infoItems: { label: string; value: string; color?: string }[] = [
    { label: '品牌', value: meta.brand },
    { label: '型号', value: meta.model },
    { label: '标准日期', value: meta.standardDate },
    { label: '使用年限', value: meta.serviceYears },
    { label: '动作次数', value: actionCount },
    { label: '设计寿命', value: meta.designLife.replace('次', '') },
    { label: '寿命消耗', value: `${lifeRate}%` },
    { label: '健康度', value: `${status} (${healthIndex})`, color: statusColor },
  ];

  return (
    <div className="cylinder-overview-detail-page">
      <Header title={intl.get(`${modelPrompt}.title`).d('气缸综合健康总览')}>
        <Button funcType="flat" icon="arrow_back" onClick={handleBack}>
          {intl.get(`${modelPrompt}.back`).d('返回总览')}
        </Button>
      </Header>

      <Content>
        <div className="cod-info-card">
          {infoItems.map((item) => (
            <div key={item.label} className="cod-info-cell">
              <span className="cod-info-label">{item.label}</span>
              <span className="cod-info-value" style={item.color ? { color: item.color } : undefined}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div className="cod-filter-bar">
          <div className="cod-date-group">
            <span className="cod-date-label">开始日期</span>
            <DatePicker value={startDate} onChange={(val) => val && setStartDate(val)} />
          </div>
          <div className="cod-date-group">
            <span className="cod-date-label">结束日期</span>
            <DatePicker value={endDate} onChange={(val) => val && setEndDate(val)} />
          </div>
          <Button type="primary" className="cod-query-btn">
            <Icon type="show_chart" />
            查询趋势
          </Button>
        </div>

        <div className="cod-chart-row">
          <div className="cod-chart-card">
            <SimpleLineChart unit="秒" color="#3b82f6" data={cylinderClampDurationData} yMax={0.8} height={240} />
            <div className="cod-chart-caption">夹紧时长趋势 (秒)</div>
          </div>
          <div className="cod-chart-card">
            <SimpleLineChart unit="秒" color="#f59e0b" data={cylinderReleaseDurationData} yMax={0.7} height={240} />
            <div className="cod-chart-caption">松开时长趋势 (秒)</div>
          </div>
        </div>

        <div className="cod-alarm-card">
          <div className="cod-alarm-title">
            <Icon type="notifications_active" className="cod-alarm-title-icon" />
            报警记录
          </div>
          <div className="cod-alarm-list">
            {cylinderAlarmRecords.map((record) => (
              <div key={record.alarmTime} className="cod-alarm-item">
                <Icon type="warning" className="cod-alarm-icon" />
                <span className="cod-alarm-type">{record.alarmType}</span>
                <span className="cod-alarm-time">{record.alarmTime}</span>
                <span className="cod-alarm-reason">{record.alarmReason}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cod-chart-card cod-chart-card-full">
          <SimpleLineChart unit="HI" color="#18a058" data={cylinderHiIndexData} yMax={100} height={260} area />
          <div className="cod-chart-caption">健康度HI指数 (0-100)</div>
        </div>
      </Content>

      <style>{`
        .cylinder-overview-detail-page { background: #f5f7fa; }
        .cod-info-card {
          display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 12px 20px;
          background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 24px; margin-bottom: 14px;
        }
        .cod-info-cell { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .cod-info-label { font-size: 12px; color: #94a3b8; }
        .cod-info-value { font-size: 15px; color: #0f172a; font-weight: 700; word-break: break-word; }
        .cod-filter-bar {
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
          background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; margin-bottom: 14px;
        }
        .cod-date-group { display: flex; align-items: center; gap: 8px; }
        .cod-date-label { font-size: 13px; color: #64748b; white-space: nowrap; }
        .cod-query-btn {
          border-radius: 8px !important; height: 32px !important;
          display: inline-flex !important; align-items: center !important; gap: 6px !important;
        }
        .cod-chart-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-bottom: 14px; }
        .cod-chart-card {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
          padding: 16px 16px 8px; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
        }
        .cod-chart-card-full { margin-bottom: 14px; }
        .cod-chart-caption { text-align: center; font-size: 13px; color: #475569; padding: 6px 0 4px; }
        .cod-alarm-card {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; margin-bottom: 14px;
        }
        .cod-alarm-title {
          display: flex; align-items: center; gap: 6px;
          font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 12px;
        }
        .cod-alarm-title-icon { font-size: 16px !important; color: #dc2626 !important; }
        .cod-alarm-list { display: flex; flex-direction: column; gap: 10px; }
        .cod-alarm-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #475569; }
        .cod-alarm-icon { font-size: 15px !important; color: #dc2626 !important; flex-shrink: 0; }
        .cod-alarm-type { color: #0f172a; font-weight: 600; }
        .cod-alarm-time { color: #64748b; }
        .cod-alarm-reason { color: #94a3b8; }
      `}</style>
    </div>
  );
};

export default withRouter(
  formatterCollections({ code: [modelPrompt, 'tarzan.common'] })(observer(CylinderOverviewDetail)),
);
