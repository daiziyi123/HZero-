import React from 'react';
import { withRouter } from 'react-router-dom';
import { Icon } from 'choerodon-ui';
import { DeviceInfo } from '../data/mockData';

interface DeviceCardProps {
  device: DeviceInfo;
  onDetailClick: (device: DeviceInfo) => void;
  history?: any;
}

const getScoreColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    '健康': '#18a058',
    '良好': '#f59e0b',
    '警告': '#ea580c',
    '严重': '#dc2626',
  };
  return colorMap[status] || colorMap['良好'];
};

const getStatusStyle = (status: string): { bgColor: string; textColor: string } => {
  const styles: Record<string, { bgColor: string; textColor: string }> = {
    '健康': { bgColor: '#dcfce7', textColor: '#18a058' },
    '良好': { bgColor: '#fef3c7', textColor: '#f59e0b' },
    '警告': { bgColor: '#fed7aa', textColor: '#ea580c' },
    '严重': { bgColor: '#fee2e2', textColor: '#dc2626' },
  };
  return styles[status] || styles['良好'];
};

const getRobotStatusConfig = (robotStatus?: string): { label: string; className: string; dotClass: string; alertBgColor: string; alertIconColor: string } => {
  const configs: Record<string, { label: string; className: string; dotClass: string; alertBgColor: string; alertIconColor: string }> = {
    running: { label: '运行中', className: 'status-running', dotClass: 'status-dot-green', alertBgColor: '', alertIconColor: '' },
    standby: { label: '待机', className: 'status-standby', dotClass: 'status-dot-orange', alertBgColor: '', alertIconColor: '' },
    abnormal: { label: '急停', className: 'status-abnormal', dotClass: 'status-dot-purple', alertBgColor: '', alertIconColor: '' },
    alarm: { label: '报警', className: 'status-alarm', dotClass: 'status-dot-red', alertBgColor: '', alertIconColor: '' },
    offline: { label: '离线', className: 'status-offline', dotClass: 'status-dot-gray', alertBgColor: '', alertIconColor: '' },
    uncollected: { label: '未采集', className: 'status-uncollected', dotClass: 'status-dot-gray', alertBgColor: '', alertIconColor: '' },
  };
  return configs[robotStatus || ''] || { label: '未知', className: 'status-offline', dotClass: 'status-dot-gray', alertBgColor: '', alertIconColor: '' };
};

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onDetailClick, history }) => {
  const scoreColor = getScoreColor(device.status);
  const statusStyle = getStatusStyle(device.status);
  const robotStatusConfig = getRobotStatusConfig(device.robotStatus);

  return (
    <div className="device-card">
      {/* 卡片头部 */}
      <div className="card-header">
        <span className="device-name">{device.name}</span>
        <span className="device-type">{device.type}</span>
      </div>

      {/* 分数和状态区域 */}
      <div className="card-score-section">
        <span className="device-score" style={{ color: scoreColor }}>
          {device.score}
          <span className="score-unit">分</span>
        </span>
        <span
          className="device-status-badge"
          style={{
            backgroundColor: statusStyle.bgColor,
            color: statusStyle.textColor,
          }}
        >
          {device.status}
        </span>
      </div>

      {/* 状态信息 */}
      <div className="card-status-info">
        <span className={`status-tag ${robotStatusConfig.className}`}>
          <span className={`status-dot ${robotStatusConfig.dotClass}`}></span>
          {robotStatusConfig.label}
        </span>
      </div>

      {/* 告警提示条 - 由 alarm 点位独立控制显示 */}
      {device.isAlarm && (
        <div className="alert-wrapper">
          <div className="alert-bar">
            <Icon type="error" className="alert-decor-icon" />
            <span className="alert-text">
              {device.alertMsg || '设备异常，请及时处理'}
            </span>
          </div>
        </div>
      )}

      {/* 按钮区域 */}
      <div className="card-buttons">
        {/* <button className="detail-btn" onClick={() => onDetailClick(device)}>
          详情
        </button> */}
        <button className="detail-btn" onClick={() => { history?.push({ pathname: `/ipfm/robot-health-detail` }); }}>
          详情
        </button>
      </div>

      <style>{`
        .device-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 18px 20px;
          border: 1px solid #e8ecf0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: all 0.25s ease;
          position: relative;
        }

        .device-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
          border-color: #d0d7de;
        }

        .device-card .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .device-card .device-name {
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
          letter-spacing: 0.3px;
        }

        .device-card .device-type {
          font-size: 11px;
          font-weight: 500;
          color: #2563eb ;
          background: #eff6ff;
          padding: 3px 10px;
          border-radius: 12px;
          white-space: nowrap;
        }

        .device-card .card-score-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
        }

        .device-card .device-score {
          font-size: 32px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.5px;
        }

        .device-card .score-unit {
          font-size: 14px;
          font-weight: 600;
          margin-left: 2px;
          opacity: 0.9;
        }

        .device-card .device-status-badge {
          font-size: 13px;
          font-weight: 600;
          padding: 5px 14px;
          border-radius: 15px;
          white-space: nowrap;
          letter-spacing: 0.3px;
        }

        .device-card .card-status-info {
          display: flex;
          align-items: center;
          min-height: 24px;
        }

        .device-card .status-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.3px;
        }

        .device-card .status-running {
          background-color: #dcfce7;
          color: #16a34a;
        }

        .device-card .status-standby {
          background-color: #fef3c7;
          color: #d97706;
        }

        .device-card .status-abnormal {
          background-color: #f3e8ff;
          color: #7c3aed;
        }

        .device-card .status-alarm {
          background-color: #fee2e2;
          color: #dc2626;
        }

        .device-card .status-offline {
          background-color: #f1f5f9;
          color: #64748b;
        }

        .device-card .status-uncollected {
          background-color: #f1f5f9;
          color: #94a3b8;
        }

        .device-card .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .device-card .status-dot-green {
          background: #22c55e;
          animation: pulse-animation 2s ease-in-out infinite;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
        }

        .device-card .status-dot-red {
          background: #ef4444;
        }

        .device-card .status-dot-orange {
          background: #f59e0b;
        }

        .device-card .status-dot-purple {
          background: #8b5cf6;
        }

        .device-card .status-dot-gray {
          background: #94a3b8;
        }

        .device-card .alert-wrapper {
          background: #dc2626;
          border-radius: 20px 60% 60% 20px;
          padding-left: 4px;
        }

        .device-card .alert-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 15px;
          border-radius: 20px;
          background: #fef2f2;
        }

        .device-card .alert-decor-icon {
          font-size: 14px !important;
          color: #dc2626 !important;
          flex-shrink: 0;
        }

        .device-card .alert-text {
          font-size: 12px;
          font-weight: 500;
          line-height: 1.5;
          color: #dc2626;
          flex: 1;
        }

        .device-card .card-buttons {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          align-items: center;
        }

        .device-card .detail-btn {
          padding: 3px 15px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: #ffffff;
          border: none;
          border-radius: 15px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          letter-spacing: 0.5px;
        }

        .device-card .detail-btn:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.35);
          transform: translateY(-1px);
        }

        .device-card .detail-btn:active {
          transform: translateY(0);
        }

        .device-card .detail-page-btn {
          padding: 3px 12px;
          background: linear-gradient(135deg, #18a058 0%, #15803d 100%);
          color: #ffffff;
          border: none;
          border-radius: 15px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          letter-spacing: 0.3px;
        }

        .device-card .detail-page-btn:hover {
          background: linear-gradient(135deg, #15803d 0%, #166534 100%);
          box-shadow: 0 4px 10px rgba(24, 160, 88, 0.35);
          transform: translateY(-1px);
        }

        .device-card .detail-page-btn:active {
          transform: translateY(0);
        }

        @keyframes pulse-animation {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.9);
          }
        }
      `}</style>
    </div>
  );
};

export default withRouter(DeviceCard);
