import React, { useState } from 'react';
import PieChart from './PieChart';
import StatCard from './StatCard';
import RiskTable from './RiskTable';
import { Icon } from 'choerodon-ui';
interface CategoryCardProps {
  title: string;
  iconType: string;
  iconColor: string;
  total: number;
  pieData: { name: string; value: number; percentage: string; color: string }[];
  statData: { label: string; count: number; percentage: string; color: string }[];
  riskTitle: string;
  nameColumnTitle: string;
  riskData: { rank: number; equipmentName: string; location: string; healthScore: number; healthLevel: number; mainRiskFactor: string }[];
  modalContent: {
    title: string;
    content: string;
  };
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  iconType,
  iconColor,
  total,
  pieData,
  statData,
  riskTitle,
  nameColumnTitle,
  riskData,
  modalContent,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleMoreClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="category-card">
      <div className="category-header">
        <Icon type={iconType} style={{ color: iconColor, fontSize: '26px', marginRight: '5px' }} />
        <span className="category-title">{title}</span>
        <span className="category-total">共计 {total} 台</span>
      </div>
      <div className="category-content">
        <div className="category-chart-section">
          <PieChart data={pieData} />
          <StatCard items={statData} />
        </div>
        <RiskTable title={riskTitle} nameColumnTitle={nameColumnTitle} data={riskData} onMoreClick={handleMoreClick} />
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">此网页显示</div>
            <div className="modal-body">
              <div className="modal-title">{modalContent.title}</div>
              <div className="modal-text">{modalContent.content}</div>
            </div>
            <div className="modal-footer">
              <button className="modal-confirm" onClick={handleCloseModal}>确定</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
