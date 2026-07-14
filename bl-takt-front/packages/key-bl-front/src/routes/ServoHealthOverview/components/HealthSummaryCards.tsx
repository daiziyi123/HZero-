import React from 'react';
import { Icon } from 'choerodon-ui';

export interface HealthSummaryCardItem {
  key: string;
  label: string;
  range: string;
  desc: string;
  color: string;
  bg: string;
  border: string;
  icon: string;
  count: number;
}

interface HealthSummaryCardsProps {
  items: HealthSummaryCardItem[];
  selectedKey?: string;
  onSelect?: (key: string) => void;
}

const HealthSummaryCards: React.FC<HealthSummaryCardsProps> = ({ items, selectedKey, onSelect }) => (
  <div className="ss-cards">
    {items.map((item) => {
      const active = selectedKey === item.key;
      return (
        <div
          key={item.key}
          className={`ss-card${active ? ' ss-card--active' : ''}`}
          style={{ background: item.bg, borderColor: active ? item.color : item.border }}
          onClick={() => onSelect?.(item.key)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onSelect?.(item.key)}
        >
          <div className="ss-card-left">
            <div className="ss-card-title">
              <span className="ss-card-label" style={{ color: item.color }}>{item.label}</span>
              <span className="ss-card-range">({item.range})</span>
            </div>
            <div className="ss-card-count" style={{ color: item.color }}>{item.count}</div>
            <div className="ss-card-desc">{item.desc}</div>
          </div>
          <Icon type={item.icon} className="ss-card-icon" style={{ color: item.color }} />
        </div>
      );
    })}

    <style>{`
      .ss-cards {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 16px;
        margin-bottom: 16px;
      }
      .ss-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1.5px solid;
        border-radius: 14px;
        padding: 16px 20px;
        cursor: pointer;
        transition: box-shadow 0.2s, transform 0.2s;
      }
      .ss-card:hover { box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08); transform: translateY(-1px); }
      .ss-card--active { box-shadow: 0 4px 14px rgba(15, 23, 42, 0.12); }
      .ss-card-title { display: flex; align-items: baseline; gap: 6px; }
      .ss-card-label { font-size: 14px; font-weight: 700; }
      .ss-card-range { font-size: 12px; color: #94a3b8; }
      .ss-card-count { font-size: 34px; font-weight: 800; line-height: 1.1; margin: 4px 0 2px; }
      .ss-card-desc { font-size: 12px; color: #64748b; }
      .ss-card-icon { font-size: 40px !important; opacity: 0.85; }
    `}</style>
  </div>
);

export default HealthSummaryCards;
