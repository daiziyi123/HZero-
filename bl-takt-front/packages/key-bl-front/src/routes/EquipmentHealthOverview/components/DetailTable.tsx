import React from 'react';
import { Icon } from 'choerodon-ui';
import { message } from 'choerodon-ui';

interface DetailItem {
  category: string;
  equipmentName: string;
  location: string;
  healthScore: number;
  healthLevel: number;
  mainRiskFactor: string;
}

interface DetailTableProps {
  data: DetailItem[];
}

/** healthLevel: 1-健康，2-良好，3-警告，4-严重 */
const HEALTH_LEVEL_STYLE_MAP: Record<number, { bgColor: string; textColor: string; borderColor: string }> = {
  4: { bgColor: '#fff1f0', textColor: '#ff4d4f', borderColor: '#ffccc7' },
  3: { bgColor: '#fff7e6', textColor: '#fa8c16', borderColor: '#ffd666' },
  1: { bgColor: '#dcfce7', textColor: '#18a058', borderColor: '#b7eb8f' },
  2: { bgColor: '#fef3c7', textColor: '#d9774a', borderColor: '#d9774a' },
};

const HEALTH_LEVEL_NAME_MAP: Record<number, string> = {
  1: '健康',
  2: '良好',
  3: '警告',
  4: '严重',
};

const getLevelStyle = (level: number) => HEALTH_LEVEL_STYLE_MAP[level] || HEALTH_LEVEL_STYLE_MAP[2];

const getLevelName = (level: number) => HEALTH_LEVEL_NAME_MAP[level] || '未知';

const DetailTable: React.FC<DetailTableProps> = ({ data }) => {
  const handleCopy = () => {
    const header = ['设备分类', '设备名称', '所属线体/工位', 'HI评分', 'HI等级', '健康状态', '主要风险因子'];
    const rows = data.map((item) => [
      item.category,
      item.equipmentName,
      item.location,
      item.healthScore,
      getLevelName(item.healthLevel),
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
    <div className="detail-table-container">
      <div className="detail-table-header">
        <Icon type="agile_schedule" style={{ color: '#2563eb', fontSize: '26px', marginRight: '5px' }} />
        <span className="detail-table-title">全部设备健康明细数据集</span>
        <button className="copy-btn" onClick={handleCopy}>
          <Icon type="content_copy" style={{ fontSize: '14px', marginRight: '4px' }} />
          复制到Excel
        </button>
      </div>
      <p className="detail-table-desc">
        下表包含三类设备的核心健康指标，支持一键复制粘贴到Excel进行数据透视分析。
      </p>
      <div className="detail-table-wrapper">
        <table className="detail-table">
          <thead>
            <tr>
              <th className="detail-th-category">设备分类</th>
              <th className="detail-th-name">设备名称</th>
              <th className="detail-th-location">所属线体/工位</th>
              <th className="detail-th-score">HI评分</th>
              <th className="detail-th-level">HI等级</th>
              <th className="detail-th-status">健康状态</th>
              <th className="detail-th-factor">主要风险因子</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', height: '300px' }}>
                  暂无数据
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const levelStyle = getLevelStyle(item.healthLevel);
                return (
                  <tr key={index}>
                    <td className="detail-td-category">{item.category}</td>
                    <td className="detail-td-name" style={{ fontWeight: 600 }}>{item.equipmentName}</td>
                    <td className="detail-td-location">{item.location}</td>
                    <td className="detail-td-score">{item.healthScore}</td>
                    <td className="detail-td-level">
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
                    <td className="detail-td-status">{getLevelName(item.healthLevel)}</td>
                    <td className="detail-td-factor">{item.mainRiskFactor}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailTable;