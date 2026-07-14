import React from 'react';
import { Icon } from 'choerodon-ui/pro';

interface ChangeRecord {
  id: string;
  time: string;
  version: string;
  description: string;
  operator: string;
}

const mockHistoryData: ChangeRecord[] = [
  { id: '1', time: '2025-12-16 14:30', version: 'V3.2.1', description: '优化焊接轨迹插补算法，提升焊接精度', operator: '李工' },
  { id: '2', time: '2025-12-08 09:15', version: 'V3.2.0', description: '新增视觉引导定位功能模块', operator: '王工' },
  { id: '3', time: '2025-11-20 16:45', version: 'V3.1.8', description: '修复安全区域监控误触发问题', operator: '张工' },
];

const ChangeHistory: React.FC = () => {
  return (
    <div className="change-history">
      {/* 表格 */}
      <div className="history-table-wrap">
        <table className="history-table">
          <thead>
            <tr>
              <th className="history-th-time">变更时间</th>
              <th className="history-th-version">版本</th>
              <th className="history-th-desc">变更内容</th>
              <th className="history-th-operator">操作人</th>
            </tr>
          </thead>
          <tbody>
            {mockHistoryData.map((record) => (
              <tr key={record.id}>
                <td className="history-td-time">{record.time}</td>
                <td>
                  <span className="history-td-version">{record.version}</span>
                </td>
                <td className="history-td-desc">{record.description}</td>
                <td className="history-td-operator">{record.operator}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 程序备份按钮 */}
      <div className="history-backup-wrap">
        <button className="history-backup-btn">
          <Icon type="download_black-o" />
          <span>程序备份</span>
        </button>
      </div>

      <style>{`
        .history-table-wrap {
          background: #ffffff;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }

        .history-table thead {
          background: #f8fafc;
        }

        .history-table th {
          padding: 14px 18px;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          text-align: center;
          white-space: nowrap;
          border-bottom: 1px solid #d1d5db;
          border-right: 1px solid #d1d5db;
        }

        .history-table th:last-child {
          border-right: none;
        }

        .history-th-time { width: 160px; }
        .history-th-version { width: 90px; }
        .history-th-operator { width: 80px; }

        .history-table td {
          padding: 16px 18px;
          font-size: 13px;
          color: #374151;
          border-bottom: 1px solid #d1d5db;
          border-right: 1px solid #d1d5db;
          vertical-align: middle;
          text-align: center;
        }

        .history-table td:last-child {
          border-right: none;
        }

        .history-table tbody tr:last-child td {
          border-bottom: none;
        }

        .history-td-time {
          color: #6b7280 !important;
          font-size: 13px !important;
        }

        .history-td-version {
          display: inline-block;
          padding: 3px 10px;
          background: #f3f4f6;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          color: #374151;
          font-family: 'SF Mono', 'Menlo', monospace;
        }

        .history-td-desc {
          color: #374151 !important;
          line-height: 1.5;
        }

        .history-td-operator {
          color: #374151 !important;
          font-weight: 500;
        }

        .history-backup-wrap {
          display: flex;
          justify-content: flex-start;
        }

        .history-backup-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 20px;
          background: #3b82f6;
          border: none;
          border-radius: 6px;
          color: #ffffff;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .history-backup-btn:hover {
          background: #2563eb;
        }
      `}</style>
    </div>
  );
};

export default ChangeHistory;
