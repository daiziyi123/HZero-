import React from 'react';
import { Icon } from 'choerodon-ui';
import { Select } from 'choerodon-ui/pro';

const { Option } = Select;

export interface ServoFilters {
  line: string;
  station: string;
  name: string;
  healthLevel: string;
}

interface ServoFilterBarProps {
  filters: ServoFilters;
  lineOptions: string[];
  stationOptions: string[];
  nameOptions: string[];
  healthLevelOptions: string[];
  onChange: (filters: ServoFilters) => void;
  onReset: () => void;
}

const ServoFilterBar: React.FC<ServoFilterBarProps> = ({
  filters,
  lineOptions,
  stationOptions,
  nameOptions,
  healthLevelOptions,
  onChange,
  onReset,
}) => {
  const update = (key: keyof ServoFilters, value: string, fallback: string) => {
    onChange({ ...filters, [key]: value || fallback });
  };

  return (
    <div className="sfb-bar">
      <div className="sfb-item">
        <span className="sfb-label"><Icon type="linear_scale" className="sfb-icon" />产线</span>
        <Select className="sfb-select" value={filters.line} onChange={(v) => update('line', v, lineOptions[0])}>
          {lineOptions.map((item) => <Option key={item} value={item}>{item}</Option>)}
        </Select>
      </div>
      <div className="sfb-item">
        <span className="sfb-label"><Icon type="place" className="sfb-icon" />工位</span>
        <Select className="sfb-select" value={filters.station} onChange={(v) => update('station', v, stationOptions[0])}>
          {stationOptions.map((item) => <Option key={item} value={item}>{item}</Option>)}
        </Select>
      </div>
      <div className="sfb-item">
        <span className="sfb-label"><Icon type="search" className="sfb-icon" />电机名称</span>
        <Select className="sfb-select sfb-select--wide" value={filters.name} onChange={(v) => update('name', v, nameOptions[0])}>
          {nameOptions.map((item) => <Option key={item} value={item}>{item}</Option>)}
        </Select>
      </div>
      <div className="sfb-item">
        <span className="sfb-label"><Icon type="favorite" className="sfb-icon" />健康度等级</span>
        <Select className="sfb-select" value={filters.healthLevel} onChange={(v) => update('healthLevel', v, healthLevelOptions[0])}>
          {healthLevelOptions.map((item) => <Option key={item} value={item}>{item}</Option>)}
        </Select>
      </div>

      <button type="button" className="sfb-reset" onClick={onReset}>
        <Icon type="refresh" />
        重置筛选
      </button>

      <style>{`
        .sfb-bar {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 20px;
        }
        .sfb-item { display: flex; flex-direction: column; gap: 6px; }
        .sfb-label { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: #64748b; }
        .sfb-icon { font-size: 14px !important; color: #94a3b8 !important; }
        .sfb-select { min-width: 150px; }
        .sfb-select--wide { min-width: 180px; }
        .sfb-select .c7n-pro-select { border-radius: 8px !important; min-height: 32px !important; }
        .sfb-reset {
          margin-left: auto;
          align-self: flex-end;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 32px;
          padding: 0 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #f8fafc;
          color: #475569;
          font-size: 13px;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .sfb-reset:hover { background: #eef2f7; border-color: #cbd5e1; }
        .sfb-reset i { font-size: 15px !important; }
      `}</style>
    </div>
  );
};

export default ServoFilterBar;
