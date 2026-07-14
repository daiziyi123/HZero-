import React from 'react';
import { Icon } from 'choerodon-ui';
import { getScoreColor, getStatusStyle } from '../../../../shared/equipmentHealth/utils';
import { HealthScoreSummary } from '../data/detailMock';

interface HealthScoreCardProps {
  summary: HealthScoreSummary;
}

const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ summary }) => {
  const statusStyle = getStatusStyle(summary.overallGrade);
  const scoreColor = getScoreColor(summary.overallGrade);

  const metrics = [
    { label: '性能类', value: summary.performanceScore, color: '#2563eb', fillClass: 'sd-fill-performance' },
    { label: '状态类', value: summary.statusScore, color: '#18a058', fillClass: 'sd-fill-status' },
    { label: '寿命类', value: summary.lifeScore, color: '#f59e0b', fillClass: 'sd-fill-life' },
  ];

  return (
    <div className="sd-health-score-card">
      <div className="sd-score-header">
        <div className="sd-score-main">
          <div className="sd-big-score">
            <div className="sd-score-num" style={{ color: scoreColor }}>
              {summary.overallScore}
            </div>
            <div className="sd-score-total">/100</div>
          </div>
          <span
            className="sd-grade-badge"
            style={{ backgroundColor: statusStyle.bgColor, color: statusStyle.textColor }}
          >
            综合评级 · {summary.overallGrade}
          </span>
        </div>
        <div className="sd-diagnosis-time">
          <Icon type="access_time" className="sd-time-icon" />
          诊断时间：{summary.diagnosisTime}
        </div>
      </div>

      <div className="sd-metrics-grid">
        {metrics.map((m) => (
          <div key={m.label} className="sd-metric-item">
            <div className="sd-metric-header">
              <span className="sd-metric-name">{m.label}</span>
              <span className="sd-metric-score">
                {m.value}
                <small>/100</small>
              </span>
            </div>
            <div className="sd-progress-bg">
              <div
                className={`sd-progress-fill ${m.fillClass}`}
                style={{ width: `${m.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthScoreCard;
