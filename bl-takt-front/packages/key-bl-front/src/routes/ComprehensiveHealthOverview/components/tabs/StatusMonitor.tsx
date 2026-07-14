import React from 'react';
import { Icon } from 'choerodon-ui/pro';
import { DeviceInfo, AlarmItem, MaintenanceItem } from '../../data/mockData';

interface StatusMonitorProps {
  device: DeviceInfo;
}

const getScoreColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    '健康': '#18a058',
    '良好': '#f59e0b',
    '警告': '#ea580c',
    '严重': '#dc2626',
  };
  return colorMap[status] || '#f59e0b';
};

const getRobotStatusLabel = (robotStatus?: string): string => {
  const map: Record<string, string> = {
    running: '运行中',
    standby: '待机',
    alarm: '报警',
    abnormal: '急停',
    offline: '离线',
  };
  return map[robotStatus || ''] || '未知';
};

const getRobotStatusColor = (robotStatus?: string): string => {
  const map: Record<string, string> = {
    running: '#18a058',
    standby: '#64748b',
    alarm: '#dc2626',
    abnormal: '#ea580c',
    offline: '#94a3b8',
  };
  return map[robotStatus || ''] || '#64748b';
};

const getAlarmLevelStyle = (level: string): { bg: string; color: string; icon: string } => {
  const map: Record<string, { bg: string; color: string; icon: string }> = {
    critical: { bg: '#fee2e2', color: '#dc2626', icon: 'cancel' },
    warning: { bg: '#fef3c7', color: '#f59e0b', icon: 'error' },
    info: { bg: '#dcfce7', color: '#18a058', icon: 'info' },
  };
  return map[level] || map.info;
};

const getUrgencyStyle = (urgency: string): { bg: string; color: string } => {
  const map: Record<string, { bg: string; color: string }> = {
    high: { bg: '#fee2e2', color: '#dc2626' },
    medium: { bg: '#fef3c7', color: '#f59e0b' },
    low: { bg: '#dcfce7', color: '#18a058' },
  };
  return map[urgency] || map.low;
};

const StatusMonitor: React.FC<StatusMonitorProps> = ({ device }) => {
  const scoreColor = getScoreColor(device.status);
  const robotStatusLabel = getRobotStatusLabel(device.robotStatus);
  const robotStatusColor = getRobotStatusColor(device.robotStatus);

  return (
    <div className="status-monitor">
      {/* 信息卡片网格 2x2 */}
      <div className="info-cards-grid">
        <div className="info-card">
          <div className="info-card-title">当前状态</div>
          <div className="info-card-value">
            <span
              className="robot-status-tag"
              style={{ background: `${robotStatusColor}14`, color: robotStatusColor, borderColor: robotStatusColor }}
            >
              {robotStatusLabel}
            </span>
          </div>
        </div>

        <div className="info-card">
          <div className="info-card-title">健康评分</div>
          <div className="info-card-value" style={{ color: scoreColor }}>
            {device.score}
            <span className="score-suffix">分</span>
            <span className="score-status" style={{ color: scoreColor }}>
              ({device.status})
            </span>
          </div>
        </div>

        <div className="info-card">
          <div className="info-card-title">累计运行时间</div>
          <div className="info-card-value info-card-number">
            {device.totalRuntime != null ? (
              <>
                {device.totalRuntime}
                <span className="number-unit">小时</span>
              </>
            ) : (
              <span className="no-data">--</span>
            )}
          </div>
        </div>

        <div className="info-card">
          <div className="info-card-title">最后通信</div>
          <div className="info-card-value info-card-number">
            {device.shiftBest ? (
              device.shiftBest
            ) : (
              <span className="no-data">--</span>
            )}
          </div>
        </div>
      </div>

      {/* 实时报警信息 */}
      <div className="detail-section">
        <div className="section-title">实时报警信息</div>
        {(!device.alarmList || device.alarmList.length === 0) ? (
          <div className="tip-bar">
            <span className="tip-bar-left" />
            <Icon type="check_circle" className="tip-bar-icon" />
            <span className="tip-bar-text">无活动报警</span>
          </div>
        ) : (
          <div className="alarm-list">
            {device.alarmList.map((alarm: AlarmItem) => {
              const levelStyle = getAlarmLevelStyle(alarm.level);
              return (
                <div key={alarm.id} className="alarm-item" style={{ background: levelStyle.bg }}>
                  <Icon type={levelStyle.icon} className="alarm-item-icon" style={{ color: levelStyle.color }} />
                  <span className="alarm-item-msg" style={{ color: levelStyle.color }}>{alarm.msg}</span>
                  <span className="alarm-item-time">{alarm.time}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 到期维护提醒 */}
      <div className="detail-section">
        <div className="section-title">到期维护提醒</div>
        {(!device.maintenanceList || device.maintenanceList.length === 0) ? (
          <div className="tip-bar">
            <span className="tip-bar-left" />
            <Icon type="check_circle" className="tip-bar-icon" />
            <span className="tip-bar-text">无到期维护项</span>
          </div>
        ) : (
          <div className="tip-bar">
            <span className="tip-bar-left" />
            <div className="maintenance-list">
              {device.maintenanceList.map((item: MaintenanceItem) => {
                const urgencyStyle = getUrgencyStyle(item.urgency);
                const remaining = item.urgency === 'high' ? '150点' : item.urgency === 'medium' ? '420h' : '2个月';
                return (
                  <div key={item.id} className="maintenance-row">
                    <span className="maintenance-dot" style={{ background: urgencyStyle.color }} />
                    <span className="maintenance-label">{item.item} 剩余{remaining}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .info-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 24px;
        }

        .info-card {
          background: #ffffff;
          border-radius: 10px;
          padding: 16px 18px;
          border: 1px solid #e8ecf0;
        }

        .info-card-title {
          font-size: 12px;
          color: #030303ff;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .info-card-value {
          font-size: 22px;
          font-weight: 700;
          display: flex;
          align-items: baseline;
          gap: 2px;
        }

        .info-card-number {
          font-size: 20px;
          color: #1e293b;
        }

        .number-unit {
          font-size: 13px;
          font-weight: 500;
          color: #94a3b8;
          margin-left: 2px;
        }

        .no-data {
          font-size: 18px;
          color: #cbd5e1;
          font-weight: 500;
        }

        .score-suffix {
          font-size: 14px;
          font-weight: 500;
          margin-left: 2px;
        }

        .score-status {
          font-size: 14px;
          font-weight: 500;
          margin-left: 4px;
          opacity: 0.75;
        }

        .robot-status-tag {
          display: inline-block;
          padding: 5px 14px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid;
        }


        .detail-section {
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .tip-bar {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 16px;
          background: #fefce8;
          border: 1px solid #facc15;
          border-radius: 8px;
        }

        .tip-bar-left {
          width: 4px;
          height: 20px;
          background: #f59e0b;
          border-radius: 2px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .tip-bar-icon {
          font-size: 16px !important;
          color: #eab308;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .tip-bar-text {
          font-size: 13px;
          color: #854d0e;
          line-height: 1.6;
        }

        .alarm-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .alarm-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
        }

        .alarm-item-icon {
          font-size: 16px !important;
          flex-shrink: 0;
        }

        .alarm-item-msg {
          flex: 1;
          font-weight: 500;
        }

        .alarm-item-time {
          font-size: 12px;
          color: #94a3b8;
          white-space: nowrap;
        }

        .maintenance-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }

        .maintenance-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .maintenance-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .maintenance-label {
          font-size: 13px;
          color: #854d0e;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default StatusMonitor;
