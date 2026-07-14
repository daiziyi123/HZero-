import React from 'react';

interface StatItem {
  label: string;
  count: number;
  percentage: string;
  color: string;
}

interface StatCardProps {
  items: StatItem[];
}

const getBgColor = (color: string) => {
  const colorMap: Record<string, string> = {
    '#52c41a': '#d9f7be',
    '#faad14': '#fff7e6',
    '#fa8c16': '#fff7e6',
    '#ff4d4f': '#fff1f0',
  };
  return colorMap[color] || '#f1f5f9';
};

const StatCard: React.FC<StatCardProps> = ({ items }) => {
  return (
    <div className="stat-card-container">
      {items.map((item, index) => (
        <div key={index} className="stat-item">
          <div className="stat-item-header">
            <span
              className="stat-label"
              style={{ 
                backgroundColor: getBgColor(item.color),
                color: item.color,
              }}
            >
              {item.label}
            </span>
          </div>
          <div className="stat-item-values">
            <span className="stat-count">{item.count}台</span>
            <span className="stat-percentage">占比 {item.percentage}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCard;