import React, { useMemo } from 'react';
import { Table, DataSet } from 'choerodon-ui/pro';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';

interface DetailTablePanelProps {
  title: string;
  columns: { name: string; label: string; width?: number; align?: ColumnAlign }[];
  data: Record<string, unknown>[];
}

const DetailTablePanel: React.FC<DetailTablePanelProps> = ({ title, columns, data }) => {
  const tableDs = useMemo(
    () =>
      new DataSet({
        autoQuery: false,
        selection: false,
        paging: 'normal' as const,
        pageSize: 5,
        fields: columns.map((col) => ({
          name: col.name,
          type: FieldType.string,
          label: col.label,
        })),
        data,
      }),
    [columns, data],
  );

  return (
    <div className="ed-panel">
      <div className="ed-panel-title">{title}</div>
      <Table
        dataSet={tableDs}
        columns={columns.map((col) => ({
          name: col.name,
          header: col.label,
          width: col.width,
          align: col.align || ColumnAlign.center,
        }))}
        pagination={{ showQuickJumper: true, showSizeChanger: true }}
      />
      <style>{`
        .ed-panel {
          background: #fff;
          border-radius: 12px;
          padding: 20px 24px;
          margin: 16px 0;
          border: 1px solid #e8ecf0;
        }
        .ed-panel-title {
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 16px;
          border-left: 3px solid #2563eb;
          padding-left: 10px;
        }
      `}</style>
    </div>
  );
};

export default DetailTablePanel;
