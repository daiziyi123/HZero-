import React from 'react';
import { Icon } from 'choerodon-ui/pro';

interface LifespanItem {
  id: string;
  name: string;
  used: number;
  total: number;
  unit: string;
  progressColor: string;
}

const mockLifespanData: LifespanItem[] = [
  { id: '1', name: '减速机润滑油', used: 8450, total: 10000, unit: '小时', progressColor: '#e67e22' },
  { id: '2', name: '控制柜主板电池', used: 28, total: 30, unit: '月', progressColor: '#e74c3c' },
  { id: '3', name: '平衡缸润滑油', used: 7010, total: 8760, unit: '小时', progressColor: '#e67e22' },
  { id: '4', name: '电极帽寿命', used: 1820, total: 2000, unit: '点', progressColor: '#e74c3c' },
];

const LifespanWarning: React.FC = () => {
  return (
    <div className="lifespan-warning">
      {/* 部件列表 */}
      <div className="lifespan-list">
        {mockLifespanData.map((item) => {
          const usedPercent = Math.round((item.used / item.total) * 100);
          const remaining = item.total - item.used;

          return (
            <div key={item.id} className="lifespan-item">
              <div className="lifespan-item-header">
                <span className="lifespan-item-name">{item.name}</span>
                <span className="lifespan-item-usage">
                  已用 {item.used} / {item.total} {item.unit}
                </span>
              </div>

              <div className="lifespan-progress-bar">
                <div
                  className="lifespan-progress-fill"
                  style={{
                    width: `${usedPercent}%`,
                    background: item.progressColor,
                  }}
                />
              </div>

              <div className="lifespan-item-footer">
                <span className="lifespan-remaining">
                  剩余: <span className="lifespan-remaining-num" style={{ color: item.progressColor }}>{remaining}</span> {item.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部建议提示 */}
      <div className="lifespan-tip-bar">
        <Icon type="build" className="lifespan-tip-icon" />
        <span className="lifespan-tip-text">减速机润滑油建议1000h内更换，电池1个月内更换。</span>
      </div>

      <style>{`
        .lifespan-warning {
          display: flex;
          flex-direction: column;
        }

        .lifespan-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }

        .lifespan-item {
          background: #ffffff;
          border: 1px solid #e8ecf0;
          border-radius: 10px;
          padding: 16px 20px;
        }

        .lifespan-item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .lifespan-item-name {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
        }

        .lifespan-item-usage {
          font-size: 13px;
          color: #64748b;
        }

        .lifespan-progress-bar {
          width: 100%;
          height: 10px;
          background: #f1f5f9;
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .lifespan-progress-fill {
          height: 100%;
          border-radius: 5px;
          transition: width 0.3s ease;
          min-width: 0;
        }

        .lifespan-item-footer {
          display: flex;
          align-items: center;
        }

        .lifespan-remaining {
          font-size: 13px;
          color: #64748b;
        }

        .lifespan-remaining-num {
          font-weight: 600;
        }

        .lifespan-tip-bar {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #fefce8;
          border: 1px solid #facc15;
          border-radius: 8px;
          padding: 12px 16px;
        }

        .lifespan-tip-icon {
          font-size: 16px !important;
          color: #eab308;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .lifespan-tip-text {
          font-size: 13px;
          color: #854d0e;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default LifespanWarning;
