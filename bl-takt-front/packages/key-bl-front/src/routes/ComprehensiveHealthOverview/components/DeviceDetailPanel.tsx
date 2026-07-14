import React, { useEffect, useState } from 'react';
import { Modal } from 'choerodon-ui/pro';
import { DeviceInfo } from '../data/mockData';
import StatusMonitor from './tabs/StatusMonitor';
import FaultAnalysis from './tabs/FaultAnalysis';
import ParameterTrend from './tabs/ParameterTrend';
import LifespanWarning from './tabs/LifespanWarning';
import ChangeHistory from './tabs/ChangeHistory';

interface DeviceDetailPanelProps {
  device: DeviceInfo | null;
  visible: boolean;
  onClose: () => void;
}

const tabs = [
  { key: 'status', label: '状态监控' },
  { key: 'fault', label: '故障统计分析' },
  { key: 'trend', label: '关键参数趋势' },
  { key: 'lifespan', label: '寿命预警' },
  { key: 'history', label: '程序变更履历' },
];

const PanelContent: React.FC<{ device: DeviceInfo }> = ({ device }) => {
  const [activeKey, setActiveKey] = useState('status');

  const renderTabContent = () => {
    switch (activeKey) {
      case 'status':
        return <StatusMonitor device={device} />;
      case 'fault':
        return <FaultAnalysis />;
      case 'trend':
        return <ParameterTrend />;
      case 'lifespan':
        return <LifespanWarning />;
      case 'history':
        return <ChangeHistory />;
      default:
        return null;
    }
  };

  return (
    <div className="device-detail-inner">
      <div className="panel-tabs-bar">
        {tabs.map((tab) => (
          <span
            key={tab.key}
            className={`panel-tab-item ${activeKey === tab.key ? 'panel-tab-active' : ''}`}
            onClick={() => setActiveKey(tab.key)}
          >
            {tab.label}
          </span>
        ))}
      </div>

      <div className="panel-tabs-content">
        {renderTabContent()}
      </div>

      <style>{`
        .device-detail-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #f8fafc;
        }

        .panel-tabs-bar {
          display: flex;
          padding: 12px 24px;
          background: #ffffff;
          border-bottom: 1px solid #e8ecf0;
          gap: 8px;
          flex-shrink: 0;
        }

        .panel-tab-item {
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 400;
          color: #64748b;
          border-radius: 20px;
          background: transparent;
          cursor: pointer;
          white-space: nowrap;
          line-height: 1.5;
          transition: all 0.2s;
          border: none;
        }

        .panel-tab-item:hover {
          color: #1f2937;
        }

        .panel-tab-active {
          color: #ffffff;
          background: #2563eb;
          font-weight: 500;
        }

        .panel-tabs-content {
          padding: 20px 24px;
          flex: 1;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

const DeviceDetailPanel: React.FC<DeviceDetailPanelProps> = ({ device, visible, onClose }) => {
  useEffect(() => {
    if (!visible || !device) return;

    Modal.open({
      key: `device-detail-drawer-${device.id}`,
      title: <span style={{ fontSize: 18, fontWeight: 700 }}>{device.name} ({device.type})</span>,
      drawer: true,
      closable: true,
      okCancel: false,
      destroyOnClose: true,
      maskClosable: true,
      style: { width: 800 },
      onClose,
      children: <PanelContent device={device} />,
    });
  }, [visible, device, onClose]);

  return null;
};

export default DeviceDetailPanel;
