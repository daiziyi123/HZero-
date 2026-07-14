import React, { useMemo, useState } from 'react';
import { Icon, DatePicker, Button } from 'choerodon-ui';
import { Table, DataSet, Select } from 'choerodon-ui/pro';
import moment from 'moment';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import HealthTrendChart, { TrendSeriesConfig } from './HealthTrendChart';

export interface SubScoreItem {
  label: string;
  value: number;
  color: string;
}

export interface HealthHistoryRow {
  scoreDate: string;
  healthScore: string | number;
  healthLevel: string;
  mainRiskFactors: string;
  [key: string]: string | number;
}

interface EquipmentHealthScoreTabProps {
  score: number;
  status: string;
  diagnosisTime?: string;
  subScores: SubScoreItem[];
  trendSeries: TrendSeriesConfig[];
  historyData: HealthHistoryRow[];
  historyColumns: ColumnProps[];
}

const getHealthLevelStyle = (level: string) => {
  const styles: Record<string, { backgroundColor: string; color: string }> = {
    健康: { backgroundColor: '#dcfce7', color: '#18a058' },
    良好: { backgroundColor: '#fef3c7', color: '#f59e0b' },
    警告: { backgroundColor: '#fed7aa', color: '#ea580c' },
    严重: { backgroundColor: '#fee2e2', color: '#dc2626' },
  };
  return styles[level] || styles['良好'];
};

const EquipmentHealthScoreTab: React.FC<EquipmentHealthScoreTabProps> = ({
  score,
  status,
  diagnosisTime = '2026/6/15 11:45:48',
  subScores,
  trendSeries,
  historyData,
  historyColumns,
}) => {
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(moment());

  const tableDs = useMemo(
    () =>
      new DataSet({
        autoQuery: false,
        selection: false,
        paging: 'normal',
        pageSize: 5,
        fields: historyColumns.map((col) => ({
          name: col.name as string,
          type: FieldType.string,
          label: col.label as string,
        })),
        data: historyData,
      }),
    [historyColumns, historyData],
  );

  const levelStyle = getHealthLevelStyle(status);

  const columns: ColumnProps[] = useMemo(
    () =>
      historyColumns.map((col) => {
        if (col.name === 'healthScore') {
          return {
            ...col,
            align: ColumnAlign.center,
            renderer: ({ value }) => (
              <span style={{ fontWeight: 600, color: '#1e293b' }}>{value}</span>
            ),
          };
        }
        if (col.name === 'healthLevel') {
          return {
            ...col,
            align: ColumnAlign.center,
            renderer: ({ value }) => (
              <span
                style={{
                  ...getHealthLevelStyle(String(value)),
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '4px 12px',
                  borderRadius: 12,
                }}
              >
                {value}
              </span>
            ),
          };
        }
        if (col.name === 'mainRiskFactors') {
          return {
            ...col,
            align: ColumnAlign.left,
            renderer: ({ value }) => (
              <span style={{ color: '#64748b', fontSize: 13 }}>{value}</span>
            ),
          };
        }
        return { ...col, align: col.align || ColumnAlign.center };
      }),
    [historyColumns],
  );

  return (
    <div className="eh-health-score-panel">
      <div className="eh-score-card">
        <div className="eh-main-score-section">
          <div className="eh-left-section">
            <div className="eh-score-circle-container">
              <div className="eh-score-circle">
                <span className="eh-score-value">{score}</span>
                <span className="eh-score-total">/100</span>
              </div>
            </div>
            <span className="eh-health-level-badge" style={levelStyle}>
              综合评级 · {status}
            </span>
          </div>
          <div className="eh-score-time">
            <Icon type="access_time_filled" className="eh-time-icon" />
            <span>诊断时间: {diagnosisTime}</span>
          </div>
        </div>

        <div
          className="eh-sub-scores"
          style={{ gridTemplateColumns: `repeat(${Math.min(subScores.length, 4)}, 1fr)` }}
        >
          {subScores.map((item) => (
            <div key={item.label} className="eh-sub-score-item">
              <div className="eh-sub-score-header">
                <span className="eh-sub-score-label">{item.label}</span>
                <span className="eh-sub-score-value">
                  <span style={{ color: item.color }}>{item.value}</span>
                  <span className="eh-sub-score-total">/100</span>
                </span>
              </div>
              <div className="eh-sub-score-bar">
                <div
                  className="eh-sub-score-fill"
                  style={{ width: `${item.value}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <HealthTrendChart series={trendSeries} />

      <div className="eh-history-table-card">
        <div className="eh-filter-bar">
          <div className="eh-filter-row">
            <div className="eh-filter-item">
              <span className="eh-filter-label">起始日期</span>
              <DatePicker className="eh-filter-input" value={startDate} onChange={setStartDate} />
            </div>
            <div className="eh-filter-item">
              <span className="eh-filter-label">结束日期</span>
              <DatePicker className="eh-filter-input" value={endDate} onChange={setEndDate} />
            </div>
            <div className="eh-filter-item">
              <span className="eh-filter-label">HI等级</span>
              <Select className="eh-filter-select" placeholder="全部" />
            </div>
            <div className="eh-filter-actions">
              <Button type="primary" className="eh-filter-btn-search" onClick={() => tableDs.query()}>
                查询
              </Button>
              <Button className="eh-filter-btn-reset" onClick={() => tableDs.reset()}>
                重置
              </Button>
            </div>
          </div>
        </div>

        <div className="eh-table-header">
          <Icon type="history" className="eh-table-icon" />
          <span className="eh-table-title">健康评分历史记录</span>
        </div>

        <Table dataSet={tableDs} columns={columns} pagination checkable={false} />
      </div>

      <style>{`
        .eh-health-score-panel { padding: 12px; display: flex; flex-direction: column; gap: 16px; width: 100%; box-sizing: border-box; }
        .eh-score-card { background: #f8fafc; border-radius: 16px; padding: 24px; border: 1px solid #e8e9eb; }
        .eh-main-score-section { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0; margin-bottom: 20px; }
        .eh-left-section { display: flex; align-items: center; gap: 16px; }
        .eh-score-circle-container { width: 80px; height: 80px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #e2e8f0; }
        .eh-score-circle { display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .eh-score-value { font-size: 32px; font-weight: 700; color: #1e293b; line-height: 1; }
        .eh-score-total { font-size: 12px; color: #94a3b8; }
        .eh-health-level-badge { font-size: 14px; font-weight: 600; padding: 6px 16px; border-radius: 20px; }
        .eh-score-time { display: flex; align-items: center; gap: 6px; background: #f1f5f9; padding: 6px 12px; border-radius: 20px; }
        .eh-time-icon { font-size: 14px !important; color: #64748b !important; }
        .eh-score-time span { font-size: 13px; color: #64748b; }
        .eh-sub-scores { display: grid; gap: 12px; }
        .eh-sub-score-item { background: #fff; border-radius: 10px; padding: 12px; border: 1px solid #e2e8f0; }
        .eh-sub-score-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .eh-sub-score-label { font-size: 13px; font-weight: 500; color: #64748b; }
        .eh-sub-score-value { font-size: 16px; font-weight: 700; color: #1e293b; }
        .eh-sub-score-total { font-size: 12px; color: #94a3b8; margin-left: 2px; }
        .eh-sub-score-bar { height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; }
        .eh-sub-score-fill { height: 100%; border-radius: 3px; }
        .eh-history-table-card { background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); }
        .eh-table-header { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
        .eh-table-icon { font-size: 18px !important; color: #1e293b !important; }
        .eh-table-title { font-size: 16px; font-weight: 600; color: #1e293b; }
        .eh-filter-bar { display: flex; align-items: center; margin-bottom: 16px; padding: 16px 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
        .eh-filter-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .eh-filter-item { display: flex; align-items: center; gap: 8px; }
        .eh-filter-label { font-size: 13px; color: #64748b; white-space: nowrap; }
        .eh-filter-input { width: 130px; }
        .eh-filter-select { width: 120px; }
        .eh-filter-actions { display: flex; gap: 8px; }
        .eh-filter-btn-search { border-radius: 4px !important; padding: 0 20px !important; height: 28px !important; font-size: 13px !important; }
        .eh-filter-btn-reset { border-radius: 4px !important; padding: 0 20px !important; height: 28px !important; font-size: 13px !important; }
        .eh-history-table-card .c7n-pro-table th { background: #eff3f7 !important; font-weight: 600 !important; color: #475569 !important; }
      `}</style>
    </div>
  );
};

export default EquipmentHealthScoreTab;
