import React, { useState } from 'react';
import { Icon } from 'choerodon-ui';
import DeviceCard from './DeviceCard';
import { ZoneInfo, DeviceInfo } from '../data/mockData';

interface ZoneSectionProps {
  zone: ZoneInfo;
  onDeviceDetailClick: (device: DeviceInfo) => void;
}

const getRobotStatusCount = (devices: DeviceInfo[], robotStatus: string): number => {
  return devices.filter((d) => d.robotStatus === robotStatus).length;
};

const ZoneSection: React.FC<ZoneSectionProps> = ({ zone, onDeviceDetailClick }) => {
  const [collapsed, setCollapsed] = useState(false);

  const { devices } = zone;
  const totalCount = devices.length;

  const statusItems = [
    { key: 'running', label: '运行', color: '#18a058' },
    { key: 'standby', label: '待机', color: '#64748b' },
    { key: 'alarm', label: '报警', color: '#dc2626' },
    { key: 'abnormal', label: '急停', color: '#ea580c' },
    { key: 'offline', label: '离线', color: '#94a3b8' },
  ]
    .map((item) => ({ ...item, count: getRobotStatusCount(devices, item.key) }))
    .filter((item) => item.count > 0);

  const handleToggle = () => {
    setCollapsed((prev) => !prev);
    // if (collapsed) {
    //   onOverviewClick(zone.id);
    // }
  };

  return (
    <div className="zone-section">
      {/* 区域头部 */}
      <div className="zone-header">
        <div className="zone-title-area">
          <Icon type="location" className="zone-icon" />
          <span className="zone-name">{zone.name}</span>
          <span className="zone-stats">
            <span className="stat-total">{totalCount}台</span>
            {statusItems.map((item) => (
              <React.Fragment key={item.key}>
                <span className="stat-divider">|</span>
                <span style={{ color: item.color }}>{item.label}{item.count}</span>
              </React.Fragment>
            ))}
          </span>
        </div>
        <span className="toggle-text" onClick={handleToggle}>
          {collapsed ? '展开' : '收起'}
        </span>
      </div>

      {/* 设备卡片网格 */}
      {!collapsed && (
        <div className="devices-grid">
          {zone.devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onDetailClick={onDeviceDetailClick}
            />
          ))}
        </div>
      )}

      <style>{`
        .zone-section {
          background: #ffffff;
          border-radius: 12px;
          padding: 0;
          margin-bottom: 20px;
          border: 1px solid #e8ecf0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        /* 区域头部 */
        .zone-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 28px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .zone-title-area {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .zone-icon {
          font-size: 20px !important;
          color: #0f172a !important;
          flex-shrink: 0;
        }

        .zone-name {
          font-size: 17px;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: 0.5px;
        }

        .zone-stats {
          display: flex;
          align-items: center;
          gap: 0;
          margin-left: 12px;
          font-size: 13px;
          font-weight: 500;
        }

        .stat-total {
          color: #1e293b;
          font-weight: 600;
        }

        .stat-divider {
          color: #cbd5e1;
          margin: 0 6px;
        }

        .toggle-text {
          font-size: 14px;
          font-weight: 500;
          color: #2563eb;
          background: #eff6ff;
          border-radius: 15px;
          padding: 6px 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          user-select: none;
        }

        .toggle-text:hover {
          color: #1d4ed8;
          background: #e5effdff;
        }

        /* 设备卡片网格 */
        .devices-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 18px;
          padding: 20px 28px 24px;
        }
      `}</style>
    </div>
  );
};

export default ZoneSection;
