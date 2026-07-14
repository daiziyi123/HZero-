/*
 * @Description: 通用表格卡片（只负责表格展示，筛选栏通过 children 传入）
 */

import React, { useMemo } from 'react';
import { Table, DataSet, Button } from 'choerodon-ui/pro';
import { Icon, Popconfirm } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import { ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';

/** 列配置接口 */
export interface ColumnProps {
  name: string;
  label?: string;
  header?: string;
  align?: ColumnAlign;
  width?: number | string;
  renderer?: (props: any) => React.ReactNode;
}

export interface ActionConfirm {
  title: string;
  okText?: string;
  cancelText?: string;
}

export interface ColumnAction {
  key: string;
  text: string;
  icon?: string;
  onClick: (record: any) => void;
  /** 气泡确认框配置，用于删除等危险操作 */
  confirm?: ActionConfirm;
}

export interface ToolbarButton {
  key: string;
  text: string;
  icon?: string;
  type?: 'default' | 'primary' | 'danger';
  onClick: () => void;
}

export interface BaseTableProps {
  titleIcon?: string;
  title?: string;
  columns: ColumnProps[];
  dsConfigOrData: DataSetProps | Record<string, any>[];
  /** 筛选栏内容（各 Tab 自定义） */
  children?: React.ReactNode;
  /** 表格 DataSet 引用，父组件通过回调获取用于搜索 */
  onTableDsReady?: (ds: DataSet) => void;
  /** 工具栏按钮列表（新增、批量导入等） */
  toolbarButtons?: ToolbarButton[];
  /** 操作列配置（详情/编辑/删除） */
  columnActions?: ColumnAction[];
}

const BaseTable = observer((props: BaseTableProps) => {
  const {
    titleIcon = 'dvr',
    title = '数据列表',
    columns,
    dsConfigOrData,
    children,
    onTableDsReady,
    toolbarButtons,
    columnActions,
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tableDsConfig: any = Array.isArray(dsConfigOrData)
    ? {
      autoQuery: true,
      autoCreate: false,
      primaryKey: 'id',
      selection: false,
      paging: 'normal',
      pageSize: 10,
      fields: columns.map((col) => ({
        name: col.name,
        type: FieldType.string,
        label: (col.label || col.header || col.name),
      })),
      data: dsConfigOrData,
    }
    : dsConfigOrData;

  const tableDs = useMemo(() => {
    const ds = new DataSet(tableDsConfig);
    onTableDsReady?.(ds);
    return ds;
  }, []);

  /** 构建带操作列的完整列配置 */
  const allColumns: ColumnProps[] = useMemo(() => {
    const cols: ColumnProps[] = [...columns];
    if (columnActions && columnActions.length > 0) {
      cols.push({
        name: '_action',
        header: '操作',
        align: ColumnAlign.center,
        width: columnActions.length * 80,
        renderer: ({ record }: any) => (
          <div >
            {columnActions.map((action) => {
              if (action.confirm) {
                return (
                  <Popconfirm
                    key={action.key}
                    title={action.confirm.title}
                    okText={action.confirm.okText || '确认'}
                    cancelText={action.confirm.cancelText || '取消'}
                    onConfirm={() => action.onClick(record?.toData())}
                  >
                    <Button
                      className={`bt-action-btn bt-action-btn-danger-pop`}
                      icon={action.icon}
                    >
                      {action.text}
                    </Button>
                  </Popconfirm>
                );
              }
              return (
                <Button
                  key={action.key}
                  className={`bt-action-btn ${action.key === 'delete' ? 'bt-action-btn-danger' : ''}`}
                  onClick={() => action.onClick(record?.toData())}
                  icon={action.icon}
                >
                  {action.text}
                </Button>
              );
            })}
          </div>
        ),
      });
    }
    return cols;
  }, [columns, columnActions]);

  return (
    <div className="bt-card">
      {/* 筛选栏 - 由各 Tab 通过 children 自定义传入 */}
      {children}

      {/* 表格标题 + 工具栏 */}
      <div className="bt-table-header-row">
        <div className="bt-table-header">
          <Icon type={titleIcon} className="bt-table-icon" />
          <span className="bt-table-title">{title}</span>
        </div>
        {toolbarButtons && toolbarButtons.length > 0 && (
          <div className="bt-toolbar">
            {toolbarButtons.map((btn) => (
              <Button
                key={btn.key}
                icon={btn.icon}
                funcType={btn.type === 'primary' ? 'raised' as any : undefined}
                className={`bt-toolbar-btn ${btn.type === 'primary' ? 'bt-toolbar-btn-primary' : ''}`}
                onClick={btn.onClick}
              >
                {btn.text}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* 表格 */}
      <Table
        dataSet={tableDs}
        columns={allColumns as any}
        pagination={{ showQuickJumper: true, showSizeChanger: true } as any}
      />

      <style>{`
        .bt-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .bt-filter-bar {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          padding: 16px 20px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .bt-filter-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .bt-filter-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .bt-filter-label {
          font-size: 13px;
          color: #64748b;
          white-space: nowrap;
        }

        .bt-filter-input {
          width: 140px;
        }

        .bt-filter-input .c7n-input {
          height: 30px !important;
          min-height: 30px !important;
          font-size: 12px !important;
          padding: 0 8px !important;
        }

        .bt-filter-select {
          width: 120px;
        }

        .bt-filter-select .c7n-select-selection {
          height: 30px !important;
          min-height: 30px !important;
          font-size: 12px !important;
          display: flex !important;
          align-items: center !important;
          padding: 0 30px 0 8px !important;
        }

        .bt-filter-select .c7n-select-arrow {
          right: 10px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          font-size: 10px !important;
        }

        .bt-filter-select .c7n-select-selection__rendered {
          line-height: 1 !important;
          margin: 0 !important;
          display: flex !important;
          align-items: center !important;
          height: 100% !important;
        }

        .bt-filter-select .c7n-select-selection-selected-value {
          font-size: 12px !important;
        }

        .bt-filter-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .bt-filter-btn-search {
          border-radius: 4px !important;
          padding: 0 20px !important;
          height: 28px !important;
          font-size: 13px !important;
          border: 1px solid #3b82f6 !important;
          background: #3b82f6 !important;
          color: #eff6ff !important;
        }

        .bt-filter-btn-reset {
          border-radius: 4px !important;
          padding: 0 20px !important;
          height: 28px !important;
          font-size: 13px !important;
          color: #64748b !important;
          background: #ffffff !important;
          border: 1px solid #d1d5db !important;
          box-shadow: none !important;
        }

        .bt-filter-btn-reset:hover {
          color: #3b82f6 !important;
          border-color: #3b82f6 !important;
        }

        .bt-table-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .bt-table-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .bt-toolbar {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .bt-toolbar-btn {
          font-size: 13px !important;
          height: 32px !important;
          border-radius: 4px !important;
          padding: 0 14px !important;
          color: #64748b !important;
          background: #fff !important;
          border: 1px solid #d1d5db !important;
          border-radius: 10px !important;
        }

        .bt-toolbar-btn-primary {
          background: #3b82f6 !important;
          border-color: #3b82f6 !important;
          color: #eff6ff !important;
        }

        .bt-action-btn {
          font-size: 12px;
          background: none;
          border-radius: 15px;
        }

        .bt-table-icon {
          font-size: 18px !important;
          color: #3b82f6 !important;
        }

        .bt-table-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .bt-card .c7n-pro-table {
          border: none !important;
        }

        .bt-card .c7n-pro-table table {
          border: none !important;
        }

        .bt-card .c7n-pro-table th,
        .bt-card .c7n-pro-table td {
          border: none !important;
          border-bottom: 1px solid #e1e4e7ff !important;
        }

        .bt-card .c7n-pro-table thead th {
          background: #eff3f7ff !important;
          font-weight: 600 !important;
          color: #475569 !important;
        }
      `}</style>
    </div>
  );
});

export default BaseTable;
