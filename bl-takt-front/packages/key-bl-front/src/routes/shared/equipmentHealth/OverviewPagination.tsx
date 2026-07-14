import React, { useEffect, useState } from 'react';

interface OverviewPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const OverviewPagination: React.FC<OverviewPaginationProps> = ({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const [jumpPage, setJumpPage] = useState(String(page));

  useEffect(() => {
    setJumpPage(String(page));
  }, [page]);

  const handleJump = () => {
    const val = Number(jumpPage);
    if (val >= 1 && val <= totalPages) onPageChange(val);
  };

  return (
    <div className="eh-overview-pagination">
      <span className="eh-page-text">
        第{page}页 / 共{totalPages}页（总计{total}条）
      </span>
      <div className="eh-page-btns">
        <button type="button" className="eh-page-btn" disabled={page <= 1} onClick={() => onPageChange(1)} title="首页">
          «
        </button>
        <button type="button" className="eh-page-btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)} title="上一页">
          ‹
        </button>
        <input
          className="eh-page-num"
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleJump()}
        />
        <button type="button" className="eh-page-jump" onClick={handleJump}>
          跳转
        </button>
        <button type="button" className="eh-page-btn" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} title="下一页">
          ›
        </button>
        <button type="button" className="eh-page-btn" disabled={page >= totalPages} onClick={() => onPageChange(totalPages)} title="末页">
          »
        </button>
        <select className="eh-page-size" value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
          <option value={10}>10条/页</option>
          <option value={20}>20条/页</option>
          <option value={50}>50条/页</option>
        </select>
      </div>

      <style>{`
        .eh-overview-pagination {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 12px;
          padding: 14px 0 6px;
          flex-wrap: wrap;
        }
        .eh-page-text {
          font-size: 13px;
          color: #64748b;
          margin-right: 8px;
        }
        .eh-page-btns {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .eh-page-btn,
        .eh-page-jump,
        .eh-page-size {
          background: #fff;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          height: 28px;
          min-width: 28px;
          padding: 0 8px;
          font-size: 13px;
          color: #595959;
          cursor: pointer;
          line-height: 26px;
        }
        .eh-page-btn:disabled {
          color: #bfbfbf;
          cursor: not-allowed;
          background: #f5f5f5;
        }
        .eh-page-num {
          width: 42px;
          height: 28px;
          text-align: center;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          font-size: 13px;
        }
        .eh-page-jump {
          padding: 0 10px;
        }
        .eh-page-size {
          margin-left: 4px;
          padding: 0 6px;
        }
      `}</style>
    </div>
  );
};

export default OverviewPagination;
