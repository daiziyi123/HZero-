import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Icon } from 'choerodon-ui';
import { CylinderDeviceInfo } from '../../shared/equipmentHealth/types';
import { getScoreColor, getStatusStyle, resolveStatusFromHi } from '../../shared/equipmentHealth/utils';

interface CylinderDeviceCardProps extends RouteComponentProps {
  device: CylinderDeviceInfo;
}

const rows: { key: keyof CylinderDeviceInfo; label: string }[] = [
  { key: 'cylinderState', label: '状态' },
  { key: 'clampTimeRange', label: '夹紧起/止' },
  { key: 'totalDuration', label: '累计时长' },
  { key: 'actionCount', label: '动作次数' },
  { key: 'healthIndex', label: '健康度(HI)' },
  { key: 'lifeRate', label: '寿命率' },
];

const CylinderDeviceCard: React.FC<CylinderDeviceCardProps> = ({ device, history }) => {
  const displayStatus = resolveStatusFromHi(device.healthIndex);
  const statusStyle = getStatusStyle(displayStatus);
  const barColor = getScoreColor(displayStatus);

  const renderValue = (key: keyof CylinderDeviceInfo) => {
    const val = device[key];
    if (key === 'lifeRate') return `${val}%`;
    if (key === 'healthIndex') return String(val);
    return String(val);
  };

  const goDetail = () => history.push(`/ipfm/cylinder-health-detail/${device.id}`);

  return (
    <div
      className="cho-device-card"
      onClick={goDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && goDetail()}
    >
      <div className="cho-card-header">
        <div className="cho-card-title">
          <Icon type="handyman" className="cho-card-icon" />
          <span>{device.name}</span>
        </div>
        <span className="cho-card-badge" style={{ backgroundColor: statusStyle.bgColor, color: statusStyle.textColor }}>
          {displayStatus}
        </span>
      </div>
      <div className="cho-card-body">
        {rows.map((row) => (
          <div key={row.key} className="cho-card-row">
            <span className="cho-row-label">{row.label}</span>
            <span className="cho-row-value">{renderValue(row.key)}</span>
          </div>
        ))}
      </div>
      <div className="cho-card-progress-track">
        <div className="cho-card-progress-fill" style={{ width: `${Math.min(device.lifeRate, 100)}%`, backgroundColor: barColor }} />
      </div>

      <style>{`
        .cho-device-card {
          background: #fff;
          border-radius: 10px;
          padding: 12px 14px 10px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
          cursor: pointer;
          transition: box-shadow 0.2s;
          min-width: 0;
        }
        .cho-device-card:hover { box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08); }
        .cho-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .cho-card-title {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 700; color: #0f172a;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .cho-card-icon { font-size: 14px !important; color: #0f172a !important; flex-shrink: 0; }
        .cho-card-badge {
          font-size: 11px; font-weight: 600; padding: 2px 8px;
          border-radius: 8px; flex-shrink: 0; margin-left: 4px;
        }
        .cho-card-body { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
        .cho-card-row { display: flex; justify-content: space-between; font-size: 12px; line-height: 1.45; }
        .cho-row-label { color: #64748b; flex-shrink: 0; margin-right: 6px; }
        .cho-row-value { color: #1e293b; font-weight: 500; text-align: right; word-break: break-all; }
        .cho-card-progress-track { height: 5px; background: #f1f5f9; border-radius: 3px; overflow: hidden; }
        .cho-card-progress-fill { height: 100%; border-radius: 3px; }
      `}</style>
    </div>
  );
};

export default withRouter(CylinderDeviceCard);
