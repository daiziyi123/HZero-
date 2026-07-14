import React, { useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { withRouter } from 'react-router-dom';
import { Header, Content } from 'components/Page';
import { Button, Icon } from 'choerodon-ui';
import { Tabs } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { allZonesData, DeviceInfo } from '../../data/mockData';
import HealthScore from './HealthScore';
import AlarmAnalysis from './AlarmAnalysis';
import LifespanWarning from './LifespanWarning';

const modelPrompt = 'tarzan.robotHealthDetail';

const RobotDetail = (props: any) => {
  const { match } = props;
  const [activeTab, setActiveTab] = useState('health');

  const deviceId = match?.params?.deviceId || 'weld-a1-01';
  const device = useMemo((): DeviceInfo | undefined => {
    for (const zone of allZonesData) {
      const found = zone.devices.find((d) => d.id === deviceId);
      if (found) return found;
    }
    return undefined;
  }, [deviceId]);

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="robot-detail-page">
      <Header title={intl.get(`${modelPrompt}.title`).d('机器人健康详情')}>
        <Button key="back" icon="arrow_back" onClick={handleBack}>
          {intl.get(`${modelPrompt}.back`).d('返回总览')}
        </Button>
      </Header>

      <div className="device-info-bar">
        <div className="device-name">{device?.name || '焊接机器人-A1-01'}</div>
        <div className="device-meta">
          <span className="meta-item">
            <Icon type="bar_chart" className="meta-icon" />
            <span>健康评分</span>
          </span>
          <span className="meta-item">
            <Icon type="bell" className="meta-icon" />
            <span>报警分析</span>
          </span>
          <span className="meta-item">
            <Icon type="schedule" className="meta-icon" />
            <span>寿命预警</span>
          </span>
        </div>
      </div>

      <Content>
        <Tabs activeKey={activeTab} onChange={setActiveTab} className="robot-tabs">
          <Tabs.TabPane
            tab={
              <span className="tab-item">
                <Icon type="bar_chart" />
                <span className="tab-text">{intl.get(`${modelPrompt}.healthScore`).d('健康评分')}</span>
              </span>
            }
            key="health"
          >
            <HealthScore active={activeTab === 'health'} device={device} equipmentId={device?.equipmentId} />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span className="tab-item">
                <Icon type="notification_important" />
                <span className="tab-text">{intl.get(`${modelPrompt}.alarmAnalysis`).d('报警分析')}</span>
              </span>
            }
            key="alarm"
          >
            <AlarmAnalysis
              active={activeTab === 'alarm'}
              deviceId={device?.deviceId}
              prodLineId={device?.prodLineId}
              workcellId={device?.workcellId}
            />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span className="tab-item">
                <Icon type="handyman" />
                <span className="tab-text">{intl.get(`${modelPrompt}.lifespanWarning`).d('寿命件预警')}</span>
              </span>
            }
            key="lifespan"
          >
            <LifespanWarning active={activeTab === 'lifespan'} equipmentCode={device?.equipmentCode || device?.id} />
          </Tabs.TabPane>
        </Tabs>
      </Content>

      <style>{`
        .robot-detail-page {
          background: #f5f7fa;
        }

        .robot-detail-page .robot-tabs {
          background: #ffffff;
          border-bottom: 1px solid #e8e8e8;
        }

        .robot-detail-page .robot-tabs .c7n-tabs-bar {
          margin: 0;
          padding: 0 24px;
          background: #ffffff;
        }

        .robot-detail-page .robot-tabs .c7n-tabs-tab {
          padding: 8px 15px;
          font-size: 14px;
          font-weight: bold;
          color: rgb(100, 116, 139);
          margin-right: 0;
          border-right: 1px solid #e8e8e8;
          border-radius: 10px 10px 0 0;
        }

        .robot-detail-page .robot-tabs .c7n-tabs-tab:first-child {
          border-left: 1px solid #e8e8e8;
        }

        .robot-detail-page .robot-tabs .c7n-tabs-content {
          width: 100%;
          min-width: 100%;
          padding: 0;
        }

        .robot-detail-page .robot-tabs .c7n-tabs-tabpane {
          width: 100%;
          min-width: 100%;
          padding: 0;
        }

        .robot-detail-page .device-info-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .robot-detail-page .device-name {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.5px;
        }

        .robot-detail-page .device-meta {
          display: flex;
          gap: 20px;
        }

        .robot-detail-page .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
        }

        .robot-detail-page .meta-icon {
          font-size: 16px !important;
        }
      `}</style>
    </div>
  );
};

export default withRouter(formatterCollections(
  { code: [modelPrompt, 'tarzan.common'] },
)(observer(RobotDetail)));
