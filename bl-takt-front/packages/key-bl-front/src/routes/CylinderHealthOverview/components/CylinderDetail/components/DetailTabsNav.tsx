import React from 'react';
import { Icon } from 'choerodon-ui';

export type CylinderDetailTabKey = 'action' | 'alarm' | 'health';

export interface CylinderDetailTabItem {
  key: CylinderDetailTabKey;
  label: string;
  icon: string;
}

export const CYLINDER_DETAIL_TABS: CylinderDetailTabItem[] = [
  { key: 'action', label: '动作趋势分析', icon: 'insert_chart' },
  { key: 'alarm', label: '报警分析', icon: 'warning' },
  { key: 'health', label: '健康度分析', icon: 'favorite' },
];

interface DetailTabsNavProps {
  activeKey: CylinderDetailTabKey;
  onChange: (key: CylinderDetailTabKey) => void;
}

const DetailTabsNav: React.FC<DetailTabsNavProps> = ({ activeKey, onChange }) => (
  <div className="cd-tabs-header">
    {CYLINDER_DETAIL_TABS.map((tab) => (
      <button
        key={tab.key}
        type="button"
        className={`cd-tab-btn${activeKey === tab.key ? ' cd-tab-btn-active' : ''}`}
        onClick={() => onChange(tab.key)}
      >
        <Icon type={tab.icon} />
        {tab.label}
      </button>
    ))}
  </div>
);

export default DetailTabsNav;
