import React from 'react';
import { Icon, message } from 'choerodon-ui';

interface RiskItem {
  rank: number;
  equipmentName: string;
  location: string;
  healthScore: number;
  healthLevel: number;
  mainRiskFactor: string;
}

interface RiskTableProps {
  title: string;
  nameColumnTitle: string;
  data: RiskItem[];
  onMoreClick: () => void;
}

/** healthLevel: 1-健康，2-良好，3-警告，4-严重 */
const HEALTH_LEVEL_STYLE_MAP: Record<number, { bgColor: string; textColor: string; borderColor: string }> = {
  4: { bgColor: '#fee2e2', textColor: '#dc324a', borderColor: 'transparent' },
  3: { bgColor: '#fff7ed', textColor: '#ea580c', borderColor: 'transparent' },
  2: { bgColor: '#fef3c7', textColor: '#d97706', borderColor: 'transparent' },
  1: { bgColor: '#dcfce7', textColor: '#52c41a', borderColor: 'transparent' },
};

const HEALTH_LEVEL_NAME_MAP: Record<number, string> = {
  1: '健康',
  2: '良好',
  3: '警告',
  4: '严重',
};

const getLevelStyle = (level: number) => HEALTH_LEVEL_STYLE_MAP[level] || HEALTH_LEVEL_STYLE_MAP[2];

const getLevelName = (level: number) => HEALTH_LEVEL_NAME_MAP[level] || '未知';

const RiskTable: React.FC<RiskTableProps> = ({ title, nameColumnTitle, data, onMoreClick }) => {
  const handleCopy = () => {
    const header = ['排名', nameColumnTitle, '所属线体/工位', 'HI评分', 'HI等级', '主要风险因子'];
    const rows = data.map((item) => [
      item.rank,
      item.equipmentName,
      item.location,
      item.healthScore,
      getLevelName(item.healthLevel),
      item.mainRiskFactor,
    ]);
    const tsv = [header.join('\t'), ...rows.map((row) => row.join('\t'))].join('\n');
    try {
      const textarea = document.createElement('textarea');
      textarea.value = tsv;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      message.success('已复制到剪贴板，可粘贴到Excel');
    } catch {
      message.error('复制失败，请手动选中表格复制');
    }
  };

  return (
    <div className="risk-table-container">
      <div className="risk-table-header">
        <span className="risk-table-title">
          <Icon type="warning_amber-o" style={{ fontSize: 16 ,marginRight: '5px'}} />
          {title}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="copy-btn" onClick={handleCopy}>
            <Icon type="content_copy" style={{ fontSize: '14px', marginRight: '4px' }} />
            复制到Excel
          </button>
          <button className="risk-table-more" onClick={onMoreClick}>更多</button>
        </div>
      </div>
      <table className="risk-table">
        <thead>
          <tr>
            <th className="risk-th-rank">排名</th>
            <th className="risk-th-name">{nameColumnTitle}</th>
            <th className="risk-th-location">所属线体/工位</th>
            <th className="risk-th-score">HI评分</th>
            <th className="risk-th-level">HI等级</th>
            <th className="risk-th-factor">主要风险因子</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', height: '300px' }}>
                暂无数据
              </td>
            </tr>
          ) : (
            data.map((item) => {
              const levelStyle = getLevelStyle(item.healthLevel);
              return (
                <tr key={item.rank}>
                  <td className="risk-td-rank">{item.rank}</td>
                  <td className="risk-td-name" style={{ fontWeight: 600 }}>{item.equipmentName}</td>
                  <td className="risk-td-location">{item.location}</td>
                  <td className="risk-td-score">{item.healthScore}</td>
                  <td className="risk-td-level">
                    <span
                      className="level-badge"
                      style={{
                        backgroundColor: levelStyle.bgColor,
                        color: levelStyle.textColor,
                        borderColor: levelStyle.borderColor,
                      }}
                    >
                      {getLevelName(item.healthLevel)}
                    </span>
                  </td>
                  <td className="risk-td-factor">{item.mainRiskFactor}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RiskTable;