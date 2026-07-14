/*
 * @Description: 机器人基础数据 - 主页面（含 Tabs 标签卡）
 */

import React, { useState } from 'react';
import { Tabs } from 'choerodon-ui/pro';
import { Icon } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import { Header, Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import RobotTab from './tabs/RobotTab';
import RivetingMotorTab from './tabs/RivetingMotorTab';
import SpareCylinderTab from './tabs/SpareCylinderTab';

const modelPrompt = 'tarzan.robotBasicData';

const RobotBasicData = () => {
  const [activeKey, setActiveKey] = useState('robot');

  const handleTabChange = (key: string) => {
    setActiveKey(key);
  };

  const renderTable = () => {
    switch (activeKey) {
      case 'robot':
        return <RobotTab />;
      case 'rivetingMotor':
        return <RivetingMotorTab />;
      case 'spareCylinder':
        return <SpareCylinderTab />;
      default:
        return null;
    }
  };

  return (
    <div className="robot-basic-data-page">
      <Header title={intl.get(`${modelPrompt}.title.list`).d('基础数据管理')} />
      <Content>
        <Tabs
          activeKey={activeKey}
          onChange={handleTabChange}
          className="robot-basic-data-tabs"
        >
          <Tabs.TabPane
            tab={
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <Icon type="smart_toy" style={{ fontSize: 18 }} />
                机器人
              </span>
            }
            key="robot"
          />
          <Tabs.TabPane
            tab={
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <Icon type="memory" style={{ fontSize: 18 }} />
                伺服电机
              </span>
            }
            key="rivetingMotor"
          />
          <Tabs.TabPane
            tab={
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <Icon type="handyman" style={{ fontSize: 18 }} />
                夹具气缸
              </span>
            }
            key="spareCylinder"
          />
        </Tabs>
        {renderTable()}
      </Content>
      <style>{`
        .robot-basic-data-page {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .robot-basic-data-tabs {
          background: #ffffff;
          border-bottom: 1px solid #e8e8e8;
        }

        .robot-basic-data-tabs .c7n-tabs-bar {
          margin: 0;
          padding: 0 24px;
          background: #ffffff;
        }

        .robot-basic-data-tabs .c7n-tabs-tab {
          padding: 8px 15px;
          font-size: 14px;
          font-weight: bold;
          color: rgb(100, 116, 139);
          margin-right: 0;
          border-right: 1px solid #e8e8e8;
          border-radius: 10px 10px 0 0;
        }

        .robot-basic-data-tabs .c7n-tabs-tab:first-child {
          border-left: 1px solid #e8e8e8;
        }

        .robot-basic-data-tabs .c7n-tabs-tab-active {
          color: #1890ff;
          background: #e6f7ff;
        }

        .robot-basic-data-tabs .c7n-tabs-tab i {
          margin-right: 8px;
          font-size: 14px;
        }

        .robot-basic-data-tab-content {
          background: #ffffff;
          padding: 24px;
        }
      `}</style>
    </div>
  );
};

const intl = {
  get: (key: string) => ({
    d: (defaultValue: string) => defaultValue,
  }),
};

export default formatterCollections(
  { code: [modelPrompt, 'tarzan.common'] },
)(observer(RobotBasicData));
