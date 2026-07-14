import React, { useMemo } from 'react';
import { Icon } from 'choerodon-ui';
import { Table, DataSet } from 'choerodon-ui/pro';
import { ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import HealthMultiLineChart from '../components/charts/HealthMultiLineChart';
import { healthMonitorDetails, healthTrendPoints } from '../data/detailMock';

interface HealthAnalysisTabProps {
  active?: boolean;
}

const HealthAnalysisTab: React.FC<HealthAnalysisTabProps> = ({ active = true }) => {
  const tableDs = useMemo(
    () =>
      new DataSet({
        autoQuery: false,
        selection: false,
        paging: true,
        pageSize: 10,
        fields: [
          { name: 'date', type: FieldType.string, label: '日期' },
          { name: 'healthLevel', type: FieldType.string, label: '健康等级' },
          { name: 'healthScore', type: FieldType.number, label: '健康得分' },
          { name: 'perfScore', type: FieldType.number, label: '性能类' },
          { name: 'stateScore', type: FieldType.number, label: '状态类' },
          { name: 'lifeScore', type: FieldType.number, label: '寿命类' },
          { name: 'mainRiskFactors', type: FieldType.string, label: '主要风险因子' },
        ],
        data: healthMonitorDetails,
      }),
    [],
  );

  if (!active) return null;

  return (
    <div className="cd-tab-pane">
      <HealthMultiLineChart data={healthTrendPoints} />

      <div className="cd-table-section">
        <div className="cd-table-head">
          <Icon type="grid_on" className="cd-table-head-icon" />
          <span className="cd-table-head-title">健康度分项监控详情 (得分 0-100)</span>
        </div>
        <Table
          dataSet={tableDs}
          columns={[
            { name: 'date', width: 90, align: ColumnAlign.center },
            {
              name: 'healthLevel',
              width: 90,
              align: ColumnAlign.center,
              renderer: ({ value }) => (
                <span className="cd-level-severe">{value}</span>
              ),
            },
            {
              name: 'healthScore',
              width: 90,
              align: ColumnAlign.center,
              renderer: ({ value }) => Number(value).toFixed(1),
            },
            { name: 'perfScore', width: 80, align: ColumnAlign.center },
            { name: 'stateScore', width: 80, align: ColumnAlign.center },
            { name: 'lifeScore', width: 80, align: ColumnAlign.center },
            {
              name: 'mainRiskFactors',
              align: ColumnAlign.left,
              renderer: ({ value }) => (
                <span className="cd-risk-text">{value}</span>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default HealthAnalysisTab;
