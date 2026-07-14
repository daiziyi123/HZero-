import React from 'react';

interface OverviewFilterPanelProps {
  children: React.ReactNode;
}

/** 设计稿：健康度/筛选区统一白色面板 */
const OverviewFilterPanel: React.FC<OverviewFilterPanelProps> = ({ children }) => (
  <div className="eh-filter-panel">
    {children}
    <style>{`
      .eh-filter-panel {
        background: #ffffff;
        border-radius: 12px;
        padding: 16px 20px;
        margin-bottom: 16px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
    `}</style>
  </div>
);

export default OverviewFilterPanel;
