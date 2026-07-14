import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Header, Content } from 'components/Page';
import { Button, Icon } from 'choerodon-ui';
import { Tabs } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';

export interface DetailTabItem {
  key: string;
  label: string;
  icon: string;
  content: React.ReactNode;
}

export interface EquipmentDetailShellProps extends RouteComponentProps {
  modelPrompt: string;
  pageTitle: string;
  deviceName: string;
  gradient: string;
  metaItems: { icon: string; label: string }[];
  tabs: DetailTabItem[];
}

const EquipmentDetailShell: React.FC<EquipmentDetailShellProps> = (props) => {
  const { modelPrompt, pageTitle, deviceName, gradient, metaItems, tabs } = props;
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || 'health');

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="equipment-detail-page">
      <Header title={intl.get(`${modelPrompt}.title`).d(pageTitle)}>
        <Button key="back" icon="arrow_back" onClick={handleBack}>
          {intl.get(`${modelPrompt}.back`).d('返回总览')}
        </Button>
      </Header>

      <div className="ed-info-bar" style={{ background: gradient }}>
        <div className="ed-device-name">{deviceName}</div>
        <div className="ed-device-meta">
          {metaItems.map((item) => (
            <span key={item.label} className="ed-meta-item">
              <Icon type={item.icon} className="ed-meta-icon" />
              <span>{item.label}</span>
            </span>
          ))}
        </div>
      </div>

      <Content>
        <Tabs activeKey={activeTab} onChange={setActiveTab} className="ed-tabs">
          {tabs.map((tab) => (
            <Tabs.TabPane
              key={tab.key}
              tab={
                <span className="ed-tab-item">
                  <Icon type={tab.icon} />
                  <span>{tab.label}</span>
                </span>
              }
            >
              {tab.content}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Content>

      <style>{`
        .equipment-detail-page { background: #f5f7fa; }
        .ed-info-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
        }
        .ed-device-name { font-size: 18px; font-weight: 700; color: #fff; }
        .ed-device-meta { display: flex; gap: 20px; }
        .ed-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
        }
        .ed-tabs .c7n-tabs-bar { margin: 0; padding: 0 24px; background: #fff; border-bottom: 1px solid #e8e8e8; }
        .ed-tabs .c7n-tabs-tab {
          padding: 8px 15px;
          font-size: 14px;
          font-weight: bold;
          color: rgb(100, 116, 139);
          margin-right: 0;
          border-right: 1px solid #e8e8e8;
          border-radius: 10px 10px 0 0;
        }
        .ed-tabs .c7n-tabs-tab:first-child { border-left: 1px solid #e8e8e8; }
        .ed-tabs .c7n-tabs-tab-active { color: #1890ff; background: #e6f7ff; }
        .ed-tabs .c7n-tabs-content { padding: 0; width: 100%; }
        .ed-tabs .c7n-tabs-tabpane { width: 100%; padding: 0; }
        .ed-tab-item { display: inline-flex; align-items: center; gap: 6px; }
        .ed-tab-item i { margin-right: 4px; }
      `}</style>
    </div>
  );
};

export default withRouter(
  formatterCollections({ code: ['tarzan.common'] })(observer(EquipmentDetailShell)),
);
