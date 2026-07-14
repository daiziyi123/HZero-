import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Icon } from 'choerodon-ui';
import { Table, DataSet } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { lifespanWarningTableDS, mapSparePartWarningItems } from '../../../store/lifespanWarningDS';
import { querySparePartWarning, SparePartWarningResponse } from '../../../services';

interface LifespanWarningProps {
  active?: boolean;
  equipmentCode?: string;
}

const emptySummary: SparePartWarningResponse = {
  list: [],
  normalCount: 0,
  remindCount: 0,
  totalCount: 0,
  warningCount: 0,
};

const getStatusStyle = (status: string) => {
  const styles: Record<string, { backgroundColor: string; color: string }> = {
    '警告': { backgroundColor: '#fee2e2', color: '#dc2626' },
    '提醒': { backgroundColor: '#fef3c7', color: '#f59e0b' },
    '正常': { backgroundColor: '#dcfce7', color: '#18a058' },
  };
  return styles[status] || styles['正常'];
};

const LifespanWarning: React.FC<LifespanWarningProps> = ({ active = true, equipmentCode }) => {
  const tableDs = useMemo(() => new DataSet(lifespanWarningTableDS()), []);
  const [summary, setSummary] = useState<SparePartWarningResponse>(emptySummary);
  const [loading, setLoading] = useState(false);

  const columns: ColumnProps[] = useMemo(() => [
    { name: 'maintenanceItem', label: '保养项目', align: ColumnAlign.center },
    {
      name: 'usedHours',
      label: '已运行/已服役时长',
      align: ColumnAlign.center,
      renderer: ({ value }) => `${value ?? 0} 小时`,
    },
    {
      name: 'ratedLife',
      label: '额定寿命',
      align: ColumnAlign.center,
      renderer: ({ value }) => `${value ?? 0} 小时`,
    },
    { name: 'remainingLifePercentage', label: '剩余寿命百分比', align: ColumnAlign.center },
    { name: 'warningThreshold', label: '预警阈值', align: ColumnAlign.center },
    {
      name: 'status',
      label: '状态',
      align: ColumnAlign.center,
      renderer: ({ value }) => (
        <span
          style={{
            ...getStatusStyle(value),
            fontSize: 12,
            fontWeight: 600,
            padding: '4px 12px',
            borderRadius: 12,
          }}
        >
          {value}
        </span>
      ),
    },
  ], []);

  const fetchData = useCallback(async () => {
    if (!equipmentCode) {
      setSummary(emptySummary);
      tableDs.loadData([]);
      return;
    }

    setLoading(true);
    try {
      const data = await querySparePartWarning(equipmentCode);
      setSummary(data);
      tableDs.loadData(mapSparePartWarningItems(data.list));
    } catch {
      setSummary(emptySummary);
      tableDs.loadData([]);
    } finally {
      setLoading(false);
    }
  }, [equipmentCode, tableDs]);

  useEffect(() => {
    if (!active) return;
    fetchData();
  }, [active, fetchData]);

  const stats = [
    { label: '保养件总数', value: String(summary.totalCount), unit: '项', icon: 'schedule', color: '#64748b' },
    { label: '提醒数量', value: String(summary.remindCount), unit: '即将到期', icon: 'warning', color: '#f59e0b' },
    { label: '警告数量', value: String(summary.warningCount), unit: '紧急更换', icon: 'error', color: '#dc2626' },
    { label: '正常', value: String(summary.normalCount), unit: '余量充足', icon: 'check_circle', color: '#18a058' },
  ];

  return (
    <div className="lifespan-warning-panel">
      <div className="stats-card">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <div className="stat-header">
              <div className="stat-icon" style={{ color: stat.color }}>
                <Icon type={stat.icon} />
              </div>
              <span className="stat-label">{stat.label}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-unit">{stat.unit}</div>
          </div>
        ))}
      </div>

      <div className="lifespan-table-card">
        <div className="table-header">
          <Icon type="schedule" className="table-icon" />
          <span className="table-title">保养件预警列表</span>
          {loading && <span className="table-loading">加载中...</span>}
        </div>

        <Table
          dataSet={tableDs}
          columns={columns}
          pagination={true}
          checkable={false}
        />

        <div className="table-footer">
          <Icon type="info" className="footer-icon" />
          <span className="footer-text">说明：剩余寿命百分比根据实际运行/服役时间与额定寿命计算。当剩余百分比 ≤ 阈值时触发"警告"；剩余百分比在阈值~阈值+15%区间为"提醒"；其余为"正常"。本体电缆采用加权积分模型模拟剩余健康度。</span>
        </div>
      </div>

      <style>{`
        .lifespan-warning-panel {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          min-width: 100%;
          box-sizing: border-box;
        }

        .stats-card {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          width: 100%;
        }

        .stat-item {
          background: #ffffff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          border: 1px solid #e2e8eeff;
        }

        .stat-icon {
          font-size: 18px !important;
        }

        .stat-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .stat-label {
          font-size: 12px;
          color: #3a3e44ff;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1;
        }

        .stat-unit {
          font-size: 14px;
          color: #1e293b;
        }

        .lifespan-table-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .table-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .table-icon {
          font-size: 18px !important;
          color: #8b5cf6 !important;
        }

        .table-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .table-loading {
          margin-left: auto;
          font-size: 12px;
          color: #94a3b8;
        }

        .table-footer {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 16px;
          padding: 12px 16px;
          background: #f8fafc;
          border-radius: 8px;
          border-left: 3px solid #3b82f6;
        }

        .footer-icon {
          font-size: 14px !important;
          color: #3b82f6 !important;
          margin-top: 2px;
        }

        .footer-text {
          font-size: 12px;
          color: #64748b;
          line-height: 1.6;
        }

        .lifespan-table-card .c7n-pro-table {
          border: none !important;
        }

        .lifespan-table-card .c7n-pro-table table {
          border: none !important;
        }

        .lifespan-table-card .c7n-pro-table th,
        .lifespan-table-card .c7n-pro-table td {
          border: none !important;
          border-bottom: 1px solid #e1e4e7ff !important;
        }

        .lifespan-table-card .c7n-pro-table thead th {
          background: #eff3f7ff !important;
          font-weight: 600 !important;
          color: #475569 !important;
        }
      `}</style>
    </div>
  );
};

export default observer(LifespanWarning);
