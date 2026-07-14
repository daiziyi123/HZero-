import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Icon } from 'choerodon-ui';
import { ServoDeviceInfo } from '../../shared/equipmentHealth/types';
import { getStatusStyle } from '../../shared/equipmentHealth/utils';

interface ServoDeviceCardProps extends RouteComponentProps {
  device: ServoDeviceInfo;
}

const ServoDeviceCard: React.FC<ServoDeviceCardProps> = ({ device, history }) => {
  const statusStyle = getStatusStyle(device.status);
  const hasRisk = Boolean(device.riskFactor);

  const goDetail = () => history.push(`/ipfm/servo-health-detail/${device.id}`);

  return (
    <div
      className="svc-card"
      onClick={goDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && goDetail()}
    >
      <div className="svc-top">
        <div className="svc-icon-box">
          <Icon type={device.iconType || 'memory'} />
        </div>
        <div className="svc-info">
          <div className="svc-name">{device.name}</div>
          <div className="svc-location">
            <Icon type="place" className="svc-loc-icon" />
            {device.station}
          </div>
          <div className="svc-line">{device.line}</div>
        </div>
      </div>

      <div className="svc-footer">
        <span
          className="svc-badge"
          style={{ backgroundColor: statusStyle.bgColor, color: statusStyle.textColor }}
        >
          <span className="svc-badge-dot" style={{ backgroundColor: statusStyle.textColor }} />
          {device.status}
        </span>

        <div className={`svc-risk${hasRisk ? ' svc-risk--warn' : ''}`}>
          <Icon type={hasRisk ? 'warning' : 'verified_user'} className="svc-risk-icon" />
          {hasRisk ? (
            <span className="svc-risk-text">
              {device.riskFactor}
              {device.riskTag ? (
                <span
                  className="svc-risk-tag"
                  style={{ backgroundColor: statusStyle.bgColor, color: statusStyle.textColor }}
                >
                  {device.riskTag}
                </span>
              ) : null}
            </span>
          ) : (
            <span className="svc-risk-text">无风险</span>
          )}
        </div>
      </div>

      <style>{`
        .svc-card {
          background: #fff;
          border: 1px solid #e8edf3;
          border-radius: 14px;
          padding: 18px;
          cursor: pointer;
          transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
          min-width: 0;
        }
        .svc-card:hover { box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08); transform: translateY(-1px); border-color: #dbe3ec; }
        .svc-top { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
        .svc-icon-box {
          width: 46px; height: 46px; border-radius: 12px;
          background: #eef2ff;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .svc-icon-box i { color: #6366f1 !important; font-size: 24px !important; }
        .svc-info { flex: 1; min-width: 0; padding-top: 2px; }
        .svc-name {
          font-size: 14px; font-weight: 700; color: #0f172a;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .svc-location { display: flex; align-items: center; gap: 3px; font-size: 12px; color: #64748b; margin-top: 6px; }
        .svc-loc-icon { font-size: 13px !important; color: #94a3b8 !important; }
        .svc-line { font-size: 11px; color: #94a3b8; margin-top: 3px; }

        .svc-footer { display: flex; align-items: center; gap: 10px; }
        .svc-badge {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 600; padding: 4px 10px;
          border-radius: 10px; flex-shrink: 0;
        }
        .svc-badge-dot { width: 6px; height: 6px; border-radius: 50%; }
        .svc-risk {
          display: inline-flex; align-items: center; gap: 6px;
          background: #f6f8fb; border: 1px solid #eef2f6; border-radius: 9px;
          padding: 6px 10px; font-size: 12px; color: #16a34a;
          min-width: 0; flex: 0 1 auto;
        }
        .svc-risk--warn { color: #64748b; }
        .svc-risk-icon { font-size: 14px !important; flex-shrink: 0; }
        .svc-risk--warn .svc-risk-icon { color: #f59e0b !important; }
        .svc-risk-text {
          display: inline-flex; align-items: center; gap: 6px; min-width: 0;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .svc-risk-tag {
          font-size: 11px; padding: 1px 7px; border-radius: 6px; flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};

export default withRouter(ServoDeviceCard);
