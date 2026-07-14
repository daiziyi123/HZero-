import React, { useMemo, useState } from 'react';
import { Icon } from 'choerodon-ui';
import { Pagination } from 'choerodon-ui/pro';
import AlarmStackChart from '../components/charts/AlarmStackChart';
import { alarmListItems, alarmSummary, dailyAlarmStats } from '../data/detailMock';

interface AlarmAnalysisTabProps {
  active?: boolean;
}

const PAGE_SIZE = 8;

const AlarmAnalysisTab: React.FC<AlarmAnalysisTabProps> = ({ active = true }) => {
  const [page, setPage] = useState(1);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return alarmListItems.slice(start, start + PAGE_SIZE);
  }, [page]);

  const totalPages = Math.ceil(alarmListItems.length / PAGE_SIZE);

  if (!active) return null;

  return (
    <div className="cd-tab-pane">
      <AlarmStackChart data={dailyAlarmStats} />

      <div className="cd-alarm-list-section">
        <div className="cd-alarm-list-head">
          <div className="cd-alarm-summary">
            <Icon type="notifications_active" className="cd-alarm-bell" />
            <span>夹紧超时: <b>{alarmSummary.clampTimeout}</b> 次</span>
            <span className="cd-alarm-summary-sep">|</span>
            <span>松开超时: <b>{alarmSummary.releaseTimeout}</b> 次</span>
            <span className="cd-alarm-summary-sep">|</span>
            <span>总计: <b>{alarmSummary.total}</b> 次</span>
          </div>
          <span className="cd-alarm-list-title">报警记录列表</span>
        </div>

        <div className="cd-alarm-records">
          {pageItems.map((item) => (
            <div key={item.id} className="cd-alarm-record-row">
              <span className={`cd-alarm-dot cd-alarm-dot-${item.alarmType === '夹紧超时' ? 'clamp' : 'release'}`} />
              <span className="cd-alarm-record-type">{item.alarmType}</span>
              <span className="cd-alarm-record-time">{item.alarmTime}</span>
              <span className="cd-alarm-record-desc">{item.description}</span>
            </div>
          ))}
        </div>

        <div className="cd-alarm-pagination">
          <Pagination
            page={page}
            total={alarmListItems.length}
            pageSize={PAGE_SIZE}
            onChange={(p) => setPage(p)}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total) => `共 ${total} 条`}
          />
          <span className="cd-page-indicator">第 {page} / {totalPages} 页</span>
        </div>
      </div>
    </div>
  );
};

export default AlarmAnalysisTab;
