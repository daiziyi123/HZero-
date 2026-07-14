import React from 'react';
import { Icon } from 'choerodon-ui';
import { robotStatusOptions, healthLevelOptions } from '../data/mockData';

interface FilterBarProps {
  selectedRobotStatus: string[];
  selectedHealthLevel: string[];
  lastUpdateTime: string;
  statusCounts?: Record<string, number>;
  onRobotStatusChange: (selected: string[]) => void;
  onHealthLevelChange: (selected: string[]) => void;
  onRefresh?: () => void;
}

// 状态颜色映射
const statusColorMap: Record<string, { color: string; bgColor: string }> = {
  running: { color: '#18a058', bgColor: '#dcfce7' },
  standby: { color: '#f59e0b', bgColor: '#fef3c7' },
  offline: { color: '#94a3b8', bgColor: '#f1f5f9' },
  uncollected: { color: '#94a3b8', bgColor: '#f1f5f9' },
  abnormal: { color: '#8b5cf6', bgColor: '#f3e8ff' },
  alarm: { color: '#ef4444', bgColor: '#fee2e2' },
};

const healthColorMap: Record<string, { color: string; dotColor: string }> = {
  health: { color: '#18a058', dotColor: '#18a058' },
  good: { color: '#f59e0b', dotColor: '#f59e0b' },
  warning: { color: '#ea580c', dotColor: '#ea580c' },
  critical: { color: '#dc2626', dotColor: '#dc2626' },
};

// 获取状态标签文本
const getStatusLabel = (key: string, option: any, statusCounts?: Record<string, number>): string => {
  const count = statusCounts?.[key] ?? option.count;
  const labels: Record<string, string> = {
    running: `运行(${count})`,
    standby: `待机(${count})`,
    offline: `离线(${count})`,
    uncollected: `未采集(${count})`,
    abnormal: `急停(${count})`,
    alarm: `报警(${count})`,
  };
  return labels[key] || option.label;
};

// 获取健康等级标签文本
const getHealthLabel = (key: string, option: any): string => {
  const labels: Record<string, string> = {
    health: `健康·HI>85 (${option.count})`,
    good: `良好·60≤HI≤85 (${option.count})`,
    warning: `警告·40≤HI<60 (${option.count})`,
    critical: `严重·HI<40 (${option.count})`,
  };
  return labels[key] || option.label;
};

const FilterBar: React.FC<FilterBarProps> = ({
  selectedRobotStatus,
  selectedHealthLevel,
  lastUpdateTime,
  statusCounts,
  onRobotStatusChange,
  onHealthLevelChange,
  onRefresh,
}) => {
  const handleRobotStatusToggle = (key: string) => {
    if (selectedRobotStatus.includes(key)) {
      onRobotStatusChange(selectedRobotStatus.filter((k) => k !== key));
    } else {
      onRobotStatusChange([...selectedRobotStatus, key]);
    }
  };

  const handleHealthLevelToggle = (key: string) => {
    if (selectedHealthLevel.includes(key)) {
      onHealthLevelChange(selectedHealthLevel.filter((k) => k !== key));
    } else {
      onHealthLevelChange([...selectedHealthLevel, key]);
    }
  };

  return (
    <div className="filter-bar-container">
      {/* 第一行：机器人状态 */}
      <div className="filter-row">
        <div className="filter-row-left">
          <Icon type="smart_toy" className="row-icon" />
          <span className="row-title">机器人状态</span>
          <div className="tag-group">
            {robotStatusOptions.map((option) => {
              const colors = statusColorMap[option.key] || statusColorMap.running;
              const isSelected = selectedRobotStatus.includes(option.key);
              return (
                <button
                  key={option.key}
                  className={`filter-tag-btn ${isSelected ? 'active' : ''}`}
                  style={{
                    '--dot-color': colors.color,
                    '--text-color': colors.color,
                    '--bg-hover': colors.bgColor,
                  } as React.CSSProperties}
                  onClick={() => handleRobotStatusToggle(option.key)}
                >
                  <span className="tag-dot"></span>
                  <span className="tag-text">{getStatusLabel(option.key, option, statusCounts)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 第二行：健康等级 */}
      <div className="filter-row">
        <div className="filter-row-left">
          <Icon type="favorite" className="row-icon heart-icon" />
          <span className="row-title">健康等级</span>
          <div className="tag-group">
            {healthLevelOptions.map((option) => {
              const colors = healthColorMap[option.key] || healthColorMap.health;
              const isSelected = selectedHealthLevel.includes(option.key);
              return (
                <button
                  key={option.key}
                  className={`filter-tag-btn ${isSelected ? 'active' : ''}`}
                  style={{
                    '--dot-color': colors.dotColor,
                    '--text-color': colors.color,
                    '--bg-hover': '#fef9c3',
                  } as React.CSSProperties}
                  onClick={() => handleHealthLevelToggle(option.key)}
                >
                  <span className="tag-dot"></span>
                  <span className="tag-text">{getHealthLabel(option.key, option)}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="refresh-time" onClick={onRefresh} style={{ cursor: onRefresh ? 'pointer' : 'default' }}>
          <Icon type="schedule" className="time-icon" />
          <span>实时更新：{lastUpdateTime}</span>
        </div>
      </div>

      <style>{`
        .filter-bar-container {
          background: #ffffff;
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 20px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
          border: 1px solid #e8ecf0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .filter-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .filter-row-left {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          background-color: #f6f8faff;
          padding: 7px 18px;
          border-radius: 20px;
        }

        .row-icon {
          font-size: 18px;
          color: #334155;
        }

        .heart-icon {
          color: #ec4899 !important;
        }

        .row-title {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          white-space: nowrap;
          background-color: #e7edf5ff;
          padding: 6px 14px;
          border-radius: 20px;
        }

        .tag-group {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }

        .filter-tag-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          background: transparent;
          border: none;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
        }

        .filter-tag-btn:hover {
          background: var(--bg-hover, #f1f5f9);
        }

        .filter-tag-btn.active {
          background: #eff6ff;
        }

        .filter-tag-btn.active:hover {
          background: #dbeafe;
        }

        .tag-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--dot-color, #64748b);
          flex-shrink: 0;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8), 0 0 0 3px var(--dot-color, #64748b);
        }

        .tag-text {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-color, #475569);
          line-height: 1.2;
        }

        /* 特定颜色覆盖 */
        .filter-tag-btn[style*="--dot-color: #18a058"] .tag-text,
        .filter-tag-btn[style*="#18a058"] .tag-text {
          color: #18a058;
        }

        .filter-tag-btn[style*="--dot-color: #f59e0b"] .tag-text,
        .filter-tag-btn[style*="#f59e0b"] .tag-text {
          color: #f59e0b;
        }

        .filter-tag-btn[style*="--dot-color: #ea580c"] .tag-text,
        .filter-tag-btn[style*="#ea580c"] .tag-text {
          color: #ea580c;
        }

        .filter-tag-btn[style*="--dot-color: #94a3b8"] .tag-text,
        .filter-tag-btn[style*="#94a3b8"] .tag-text {
          color: #64748b;
        }

        .filter-tag-btn[style*="--dot-color: #ef4444"] .tag-text,
        .filter-tag-btn[style*="#ef4444"] .tag-text {
          color: #dc2626;
        }

        .filter-tag-btn[style*="--dot-color: #8b5cf6"] .tag-text,
        .filter-tag-btn[style*="#8b5cf6"] .tag-text {
          color: #7c3aed;
        }

        .filter-tag-btn[style*="--dot-color: #dc2626"] .tag-text,
        .filter-tag-btn[style*="#dc2626"] .tag-text {
          color: #dc2626;
        }

        .refresh-time {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 13px;
          white-space: nowrap;
          margin-left: 20px;
          background-color: #f1f5f9;
          padding: 6px 14px;
          border-radius: 20px;
        }

        .time-icon {
          font-size: 16px;
          color: #3b82f6;
        }
      `}</style>
    </div>
  );
};

export default FilterBar;
