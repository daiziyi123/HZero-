import React, { useMemo } from 'react';
import { Icon } from 'choerodon-ui';
import { Table, DataSet } from 'choerodon-ui/pro';
import { ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import DurationTrendChart from '../components/charts/DurationTrendChart';
import ActionBoxPlotChart from '../components/charts/ActionBoxPlotChart';
import {
  actionBoxPlotData,
  clampDurationTrend,
  clampThresholds,
  dailyActionStats,
  detailDates,
  releaseDurationTrend,
  releaseThresholds,
} from '../data/detailMock';

interface ActionTrendTabProps {
  active?: boolean;
}

const ActionTrendTab: React.FC<ActionTrendTabProps> = ({ active = true }) => {
  const tableDs = useMemo(
    () =>
      new DataSet({
        autoQuery: false,
        selection: false,
        paging: true,
        pageSize: 10,
        fields: [
          { name: 'date', type: FieldType.string, label: '日期' },
          { name: 'actionType', type: FieldType.string, label: '动作类型' },
          { name: 'avgDuration', type: FieldType.number, label: '平均时长(s)' },
          { name: 'maxDuration', type: FieldType.number, label: '最大时长(s)' },
          { name: 'minDuration', type: FieldType.number, label: '最小时长(s)' },
          { name: 'operation', type: FieldType.string, label: '操作' },
        ],
        data: dailyActionStats,
      }),
    [],
  );

  if (!active) return null;

  return (
    <div className="cd-tab-pane">
      <div className="cd-trend-chart-row">
        <DurationTrendChart
          title="夹紧时长趋势 (秒)"
          titleColor="#2563eb"
          yAxisName="夹紧时长 (秒)"
          yMax={1.2}
          dates={detailDates}
          data={clampDurationTrend}
          thresholds={clampThresholds}
        />
        <DurationTrendChart
          title="松开时长趋势 (秒)"
          titleColor="#f59e0b"
          yAxisName="松开时长 (秒)"
          yMax={1.15}
          dates={detailDates}
          data={releaseDurationTrend}
          thresholds={releaseThresholds}
        />
      </div>

      <ActionBoxPlotChart data={actionBoxPlotData} />

      <div className="cd-table-section">
        <div className="cd-table-head">
          <Icon type="grid_on" className="cd-table-head-icon" />
          <span className="cd-table-head-title">每日动作统计</span>
        </div>
        <Table
          dataSet={tableDs}
          columns={[
            { name: 'date', width: 90, align: ColumnAlign.center },
            { name: 'actionType', width: 90, align: ColumnAlign.center },
            {
              name: 'avgDuration',
              width: 110,
              align: ColumnAlign.center,
              renderer: ({ value }) => Number(value).toFixed(3),
            },
            {
              name: 'maxDuration',
              width: 110,
              align: ColumnAlign.center,
              renderer: ({ value }) => Number(value).toFixed(3),
            },
            {
              name: 'minDuration',
              width: 110,
              align: ColumnAlign.center,
              renderer: ({ value }) => Number(value).toFixed(3),
            },
            {
              name: 'operation',
              width: 90,
              align: ColumnAlign.center,
              renderer: () => <span className="cd-link-btn">日趋势</span>,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ActionTrendTab;
