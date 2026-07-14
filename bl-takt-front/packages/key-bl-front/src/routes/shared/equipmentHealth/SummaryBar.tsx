import React, { useState } from 'react';
import { Icon } from 'choerodon-ui';

export interface SummaryOption {
  key: string;
  label: string;
  count: number;
  color: string;
}

interface SummaryBarProps {
  title: string;
  icon?: string;
  iconClassName?: string;
  customIcon?: React.ReactNode;
  options: SummaryOption[];
  selectedKeys: string[];
  onChange: (keys: string[]) => void;
  darkLabel?: boolean;
}

const SummaryBar: React.FC<SummaryBarProps> = ({
  title,
  icon = 'favorite',
  iconClassName = 'eh-summary-heart',
  customIcon,
  options,
  selectedKeys,
  onChange,
  darkLabel = false,
}) => {
  const toggle = (key: string) => {
    onChange(
      selectedKeys.includes(key)
        ? selectedKeys.filter((k) => k !== key)
        : [...selectedKeys, key],
    );
  };

  return (
    <div className="eh-summary-row">
      {customIcon || (icon && <Icon type={icon} className={iconClassName} />)}
      <span className={`eh-summary-label ${darkLabel ? 'dark' : ''}`}>{title}</span>
      <div className="eh-summary-tags">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            className={`eh-summary-tag ${selectedKeys.includes(option.key) ? 'active' : ''}`}
            onClick={() => toggle(option.key)}
          >
            <span className="eh-tag-name">{option.label}</span>
            <span className="eh-tag-count" style={{ color: option.color }}>
              {option.count}
            </span>
          </button>
        ))}
      </div>

      <style>{`
        .eh-summary-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          background: #f6f8fa;
          padding: 8px 16px;
          border-radius: 24px;
        }
        .eh-summary-heart { font-size: 18px !important; color: #334155 !important; }
        .eh-summary-warn { font-size: 18px !important; color: #64748b !important; }
        .eh-summary-label {
          font-size: 13px;
          font-weight: 600;
          padding: 5px 14px;
          border-radius: 20px;
          white-space: nowrap;
          color: #475569;
          background: #e7edf5;
        }
        .eh-summary-label.dark {
          background: #334155;
          color: #fff;
        }
        .eh-summary-tags {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .eh-summary-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: transparent;
          border: none;
          border-radius: 20px;
          cursor: pointer;
        }
        .eh-summary-tag:hover,
        .eh-summary-tag.active { background: #eff6ff; }
        .eh-tag-name { font-size: 13px; color: #475569; font-weight: 500; }
        .eh-tag-count { font-size: 14px; font-weight: 700; }
      `}</style>
    </div>
  );
};

export default SummaryBar;
