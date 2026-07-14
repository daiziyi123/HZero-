import React from 'react';
import { Select, TextField } from 'choerodon-ui/pro';

const { Option } = Select;

export interface OverviewQueryFilters {
  line: string;
  station: string;
  fixture: string;
  name: string;
}

interface OverviewQueryBarProps {
  filters: OverviewQueryFilters;
  lineOptions: string[];
  stationOptions: string[];
  fixtureOptions: string[];
  nameLabel?: string;
  onChange: (filters: OverviewQueryFilters) => void;
}

const OverviewQueryBar: React.FC<OverviewQueryBarProps> = ({
  filters,
  lineOptions,
  stationOptions,
  fixtureOptions,
  nameLabel = '设备名称',
  onChange,
}) => {
  const update = (key: keyof OverviewQueryFilters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="eh-query-row">
      <div className="eh-query-item">
        <span className="eh-query-label">产线</span>
        <Select className="eh-query-select" value={filters.line} onChange={(v) => update('line', v || lineOptions[0])}>
          {lineOptions.map((item) => (
            <Option key={item} value={item}>{item}</Option>
          ))}
        </Select>
      </div>
      <div className="eh-query-item">
        <span className="eh-query-label">工位</span>
        <Select className="eh-query-select" value={filters.station} onChange={(v) => update('station', v || stationOptions[0])}>
          {stationOptions.map((item) => (
            <Option key={item} value={item}>{item}</Option>
          ))}
        </Select>
      </div>
      <div className="eh-query-item">
        <span className="eh-query-label">夹具</span>
        <Select className="eh-query-select" value={filters.fixture} onChange={(v) => update('fixture', v || fixtureOptions[0])}>
          {fixtureOptions.map((item) => (
            <Option key={item} value={item}>{item}</Option>
          ))}
        </Select>
      </div>
      <div className="eh-query-item eh-query-name">
        <span className="eh-query-label">{nameLabel}</span>
        <TextField
          className="eh-query-input"
          placeholder="名称搜索..."
          value={filters.name}
          onChange={(v) => update('name', v || '')}
        />
      </div>

      <style>{`
        .eh-query-row {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          padding-top: 4px;
        }
        .eh-query-item { display: flex; align-items: center; gap: 8px; }
        .eh-query-label { font-size: 13px; color: #64748b; white-space: nowrap; }
        .eh-query-select { min-width: 120px; }
        .eh-query-name { flex: 1; min-width: 180px; }
        .eh-query-input { width: 100%; min-width: 140px; }
        .eh-query-select .c7n-pro-select,
        .eh-query-input .c7n-pro-input {
          border-radius: 8px !important;
          font-size: 12px !important;
          min-height: 30px !important;
        }
      `}</style>
    </div>
  );
};

export default OverviewQueryBar;
