import React from 'react';
import { Icon } from 'choerodon-ui';

export type ServoDetailTabKey = 'gantt' | 'cycle' | 'threshold' | 'peak' | 'health';

export interface DetailTabItem {
  key: ServoDetailTabKey;
  label: string;
  icon: string;
}

export const DETAIL_TABS: DetailTabItem[] = [
  { key: 'gantt', label: '今日稼动运行图', icon: 'show_chart' },
  { key: 'cycle', label: '循环趋势与生产记录', icon: 'scatter_plot' },
  { key: 'threshold', label: '参数阈值预警设置+预警列表', icon: 'tune' },
  { key: 'peak', label: '循环峰值分析', icon: 'bar_chart' },
  { key: 'health', label: '健康度分析', icon: 'favorite' },
];

interface DetailTabsNavProps {
  activeKey: ServoDetailTabKey;
  onChange: (key: ServoDetailTabKey) => void;
}

const DetailTabsNav: React.FC<DetailTabsNavProps> = ({ activeKey, onChange }) => (
  <div className="sd-tabs-nav">
    {DETAIL_TABS.map((tab) => (
      <button
        key={tab.key}
        type="button"
        className={`sd-tab-btn${activeKey === tab.key ? ' sd-tab-btn-active' : ''}`}
        onClick={() => onChange(tab.key)}
      >
        <Icon type={tab.icon} />
        {tab.label}
      </button>
    ))}
  </div>
);

export default DetailTabsNav;
