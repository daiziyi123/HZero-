/**
 * @Description: 设备健康概览页面
 * @Author: Assistant
 * @Date: 2026-06-24
 */

import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import CategoryCard from './components/CategoryCard';
import DetailTable from './components/DetailTable';
import {
  getQuantityStatisticsByDeviceType,
  HealthScoreQuantityItem,
  listQuantityStatisticsByDeviceType,
  listAllHealthScoreResults,
} from './services';

const modelPrompt = 'tarzan.equipmentHealthOverview';

/**
 * type → 健康等级映射配置
 */
const HEALTH_LEVEL_MAP: Record<number, {
  name: string;
  label: string;
  chartColor: string;
  statColor: string;
}> = {
  1: { name: '健康(HI>85)', label: '健康(HI>85)', chartColor: '#18a058', statColor: '#52c41a' },
  2: { name: '良好(60<HI≤85)', label: '良好(60<HI≤85)', chartColor: '#f59e0b', statColor: '#faad14' },
  3: { name: '警告(40<HI≤60)', label: '警告(40<HI≤60)', chartColor: '#ea580c', statColor: '#fa8c16' },
  4: { name: '严重(HI≤40)', label: '严重(HI≤40)', chartColor: '#dc2626', statColor: '#ff4d4f' },
};

/** 健康等级 type 枚举，由 HEALTH_LEVEL_MAP 驱动，单点维护即可 */
const HEALTH_LEVEL_TYPES = Object.keys(HEALTH_LEVEL_MAP).map(Number);

const FALLBACK_LEVEL = { name: '未知', label: '未知', chartColor: '#94a3b8', statColor: '#94a3b8' };

interface ChartDataSet {
  pieData: { name: string; value: number; percentage: string; color: string }[];
  statData: { label: string; count: number; percentage: string; color: string }[];
  total: number;
}

const DEFAULT_CHART_DATA: ChartDataSet = (() => {
  const sortedTypes = [...HEALTH_LEVEL_TYPES].sort((a, b) => a - b);
  return {
    total: 0,
    pieData: sortedTypes.map((type) => {
      const cfg = HEALTH_LEVEL_MAP[type] || FALLBACK_LEVEL;
      return { name: cfg.name, value: 0, percentage: '0%', color: cfg.chartColor };
    }),
    statData: sortedTypes.map((type) => {
      const cfg = HEALTH_LEVEL_MAP[type] || FALLBACK_LEVEL;
      return { label: cfg.label, count: 0, percentage: '0%', color: cfg.statColor };
    }),
  };
})();

/**
 * 将接口返回数据转换为饼图和统计列表所需格式
 * 接口未返回某类型时，用 0 补齐，保证页面始终有 4 个等级展示
 */
function transformToChartData(list: HealthScoreQuantityItem[] = []): ChartDataSet {
  if (!list || list.length === 0) {
    return DEFAULT_CHART_DATA;
  }

  const total = list.reduce((sum, item) => sum + (item.number || 0), 0);
  const dataMap = new Map<number, HealthScoreQuantityItem>(
    list.map((item) => [item.type, item]),
  );

  const fullList = HEALTH_LEVEL_TYPES.map((type) => ({
    type,
    number: dataMap.get(type)?.number || 0,
    proportion: dataMap.get(type)?.proportion != null ? dataMap.get(type)!.proportion : 0,
  }));

  const pieData = fullList.map((item) => {
    const cfg = HEALTH_LEVEL_MAP[item.type] || FALLBACK_LEVEL;
    return {
      name: cfg.name,
      value: item.number,
      percentage: `${(item.proportion * 100).toFixed(1)}%`,
      color: cfg.chartColor,
    };
  });

  const statData = fullList.map((item) => {
    const cfg = HEALTH_LEVEL_MAP[item.type] || FALLBACK_LEVEL;
    return {
      label: cfg.label,
      count: item.number,
      percentage: `${(item.proportion * 100).toFixed(1)}%`,
      color: cfg.statColor,
    };
  });

  return { pieData, statData, total };
}

const DEVICE_TYPE = { ROBOT: 'EHM_ROBOT', SERVO: 'EHM_SERVO_MOTOR', CYLINDER: 'EHM_FIXTURE_CYLINDER' };

/** 后端 healthLevel 数值映射 1-健康，2-良好，3-警告，4-严重，组件内自行展示转换 */

/** 列表接口返回的设备项 */
interface DeviceHealthItem {
  equipmentName: string;
  equipmentType: string;
  prodLineName: string;
  workcellName: string;
  healthScore: number;
  healthLevel: number;
  mainRiskFactor: string;
}

/** RiskTable / DetailTable 共用数据项：仅补充 computed 字段（rank / location / category） */
interface RiskItem {
  rank: number;
  equipmentName: string;
  location: string;
  healthScore: number;
  healthLevel: number;
  mainRiskFactor: string;
}

interface DetailItem {
  category: string;
  equipmentName: string;
  location: string;
  healthScore: number;
  healthLevel: number;
  mainRiskFactor: string;
}

const DEVICE_CATEGORY_LABEL: Record<string, string> = {
  EHM_ROBOT: '机器人',
  EHM_SERVO_MOTOR: '伺服电机',
  EHM_FIXTURE_CYLINDER: '夹具气缸',
};

/** 拼接产线/工位 */
function formatLocation(prodLineName?: string, workcellName?: string): string {
  if (prodLineName && workcellName) return `${prodLineName}/${workcellName}`;
  return prodLineName || workcellName || '-';
}

/** 将 listQuantityStatisticsByDeviceType 返回数据转为 RiskTable 所需格式 */
function transformToRiskData(list: DeviceHealthItem[] = []): RiskItem[] {
  if (!list || list.length === 0) return [];
  return list
    .sort((a, b) => (a.healthScore || 0) - (b.healthScore || 0))
    .slice(0, 10)
    .map((item, index) => ({
      rank: index + 1,
      equipmentName: item.equipmentName || '-',
      location: formatLocation(item.prodLineName, item.workcellName),
      healthScore: item.healthScore || 0,
      healthLevel: item.healthLevel,
      mainRiskFactor: item.mainRiskFactor || '-',
    }));
}

/** 将 listAll 返回数据转为 DetailTable 所需格式 */
function transformToDetailData(list: DeviceHealthItem[] = []): DetailItem[] {
  if (!list || list.length === 0) return [];
  return list.map((item) => ({
    category: DEVICE_CATEGORY_LABEL[item.equipmentType] || item.equipmentType || '-',
    equipmentName: item.equipmentName || '-',
    location: formatLocation(item.prodLineName, item.workcellName),
    healthScore: item.healthScore || 0,
    healthLevel: item.healthLevel,
    mainRiskFactor: item.mainRiskFactor || '-',
  }));
}

const EquipmentHealthOverview = () => {
  const [robotChart, setRobotChart] = useState<ChartDataSet>(DEFAULT_CHART_DATA);
  const [servoChart, setServoChart] = useState<ChartDataSet>(DEFAULT_CHART_DATA);
  const [cylinderChart, setCylinderChart] = useState<ChartDataSet>(DEFAULT_CHART_DATA);

  const [robotRiskList, setRobotRiskList] = useState<RiskItem[]>([]);
  const [servoRiskList, setServoRiskList] = useState<RiskItem[]>([]);
  const [cylinderRiskList, setCylinderRiskList] = useState<RiskItem[]>([]);
  const [detailTableList, setDetailTableList] = useState<DetailItem[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [
        robotRes, servoRes, cylinderRes,
        robotListRes, servoListRes, cylinderListRes,
        allListRes,
      ] = await Promise.all([
        getQuantityStatisticsByDeviceType(DEVICE_TYPE.ROBOT),
        getQuantityStatisticsByDeviceType(DEVICE_TYPE.SERVO),
        getQuantityStatisticsByDeviceType(DEVICE_TYPE.CYLINDER),
        listQuantityStatisticsByDeviceType(DEVICE_TYPE.ROBOT),
        listQuantityStatisticsByDeviceType(DEVICE_TYPE.SERVO),
        listQuantityStatisticsByDeviceType(DEVICE_TYPE.CYLINDER),
        listAllHealthScoreResults(),
      ]);

      setRobotChart(transformToChartData(robotRes));
      setServoChart(transformToChartData(servoRes));
      setCylinderChart(transformToChartData(cylinderRes));

      // 调试：打印列表接口原始数据，前后端字段联调后移除
      console.log('[listQuantityStatisticsByDeviceType] 机器人列表:', robotListRes);
      console.log('[listQuantityStatisticsByDeviceType] 伺服电机列表:', servoListRes);
      console.log('[listQuantityStatisticsByDeviceType] 夹具气缸列表:', cylinderListRes);
      console.log('[listAllHealthScoreResults] 全部设备健康明细:', allListRes);

      setRobotRiskList(transformToRiskData(robotListRes));
      setServoRiskList(transformToRiskData(servoListRes));
      setCylinderRiskList(transformToRiskData(cylinderListRes));

      setDetailTableList(transformToDetailData(allListRes));
    } catch (error) {
      console.error('获取设备健康统计数据失败:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="equipment-health-overview">
      <Header title={intl.get(`${modelPrompt}.title`).d('设备健康总览')} />
      <Content>
        <CategoryCard
          title="机器人类设备"
          iconType="smart_toy"
          iconColor="#2563eb"
          total={robotChart.total}
          pieData={robotChart.pieData}
          statData={robotChart.statData}
          riskTitle="风险机器人排行榜（HI评分最低Top10）"
          nameColumnTitle="机器人名称"
          riskData={robotRiskList}
          modalContent={{
            title: '[机器人设备风险更多信息]',
            content: '当前展示Top10风险机器人，完整风险列表共包含20台机器人（HI<85）。\n\n主要高发风险：轴抖动超标、伺服电机过载、轨迹偏移、减速机异常等。\n建议立即关注HI低于40的机器人，安排预测性维护。\n\n点击确定可跳转至完整风险报表页面。',
          }}
        />

        <CategoryCard
          title="伺服电机类"
          iconType="memory"
          iconColor="#f59e0b"
          total={servoChart.total}
          pieData={servoChart.pieData}
          statData={servoChart.statData}
          riskTitle="风险伺服电机排行榜（HI评分最低Top10）"
          nameColumnTitle="电机名称"
          riskData={servoRiskList}
          modalContent={{
            title: '[伺服电机风险更多信息]',
            content: '当前展示Top10风险伺服电机，完整风险列表共24台（HI<85）。\n\n主要风险模式：扭矩过载、电流不平衡、轴承异响、编码器噪声。\n重点干预：主线转台伺服M07、升降机电机E02、输送变频VFD3。\n\n点击确定查看详细趋势分析。',
          }}
        />

        <CategoryCard
          title="夹具气缸类"
          iconType="handyman"
          iconColor="#18a058"
          total={cylinderChart.total}
          pieData={cylinderChart.pieData}
          statData={cylinderChart.statData}
          riskTitle="风险夹具气缸排行榜（HI评分最低Top10）"
          nameColumnTitle="气缸名称"
          riskData={cylinderRiskList}
          modalContent={{
            title: '[夹具气缸风险更多信息]',
            content: '当前展示Top10风险气缸，完整风险列表共28台（HI<85）。\n\n典型故障：动作超时、到位信号丢失、密封圈磨损、活塞杆划伤。\n建议优先处理侧围夹具气缸C23及定位气缸C11，动作次数已超寿命。\n\n更多详细数据请查看完整报表。',
          }}
        />

        <DetailTable data={detailTableList} />
      </Content>

      <style>{`
        .equipment-health-overview {
          background: #f5f7fa;
        }

        .category-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
          border: 1px solid #e9e6faff;
          margin-bottom: 24px;
          overflow: hidden;
        }

        .category-header {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #f0f0f0;
          background: linear-gradient(90deg, #f8fafc 0%, #ffffff 100%);
        }

        .category-icon {
          font-size: 20px;
          margin-right: 8px;
        }

        .category-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .category-total {
          font-size: 14px;
          color: #64748b;
          background: #f1f5f9;
          padding: 4px 12px;
          border-radius: 12px;
          margin-left: 8px;
        }

        .category-content {
          display: flex;
          gap: 24px;
          padding: 20px;
        }

        .category-chart-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          flex: 3.2;
        }

        .stat-card-container {
          display: flex;
          flex-direction: column;
          // min-width: 500px;
          // max-width: 550px;
          gap: 8px;
          width: 100%;
        }

        .risk-table-container {
          flex: 6.8;
          min-width: 0;
        }

        .risk-table-container {
          flex: 6.8;
          min-width: 0;
        }

        .stat-item {
          display: flex;
          align-items: center;
          padding: 10px 14px;
          background: #f1f5f9;
          border-radius: 8px;
        }

        .stat-item-header {
          flex: 1;
          text-align: center;
        }

        .stat-label {
          font-size: 13px;
          padding: 4px 12px;
          border-radius: 12px;
          font-weight: 500;
        }

        .stat-item-values {
          display: flex;
          flex: 2;
        }

        .stat-count {
          flex: 1;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }

        .stat-percentage {
          flex: 1;
          text-align: center;
          font-size: 13px;
          color: #64748b;
        }

        .risk-table-container {
          flex: 6.8;
          min-width: 0;
        }

        .risk-table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .risk-table-title {
          display: flex;
          align-items: center;
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        .risk-icon {
          color: #f97316;
          font-size: 12px;
          margin-right: 6px;
        }

        .risk-table-more {
          background: #e8effaff;
          border: none;
          color: #3b82f6;
          font-size: 13px;
          cursor: pointer;
          padding: 4px 15px;
          border-radius: 12px;
          transition: background 0.2s;
        }

        .risk-table-more:hover {
          background: #dbeafe;
        }

        .risk-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .risk-table th {
          text-align: center;
          padding: 10px 12px;
          background: #f8fafc;
          color: #64748b;
          font-weight: 600;
          border-bottom: 1px solid #e2e8f0;
        }

        .risk-table td {
          text-align: center;
          padding: 10px 12px;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
        }

        .risk-table tbody tr:hover {
          background: #f8fafc;
        }

        .risk-th-rank {
          width: 60px;
        }

        .risk-th-name {
          width: 150px;
        }

        .risk-th-location {
          width: 160px;
        }

        .risk-th-score {
          width: 80px;
        }

        .risk-th-level {
          width: 80px;
        }

        .risk-th-factor {
          width: 280px;
        }

        .level-badge {
          display: inline-block;
          padding: 2px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .detail-table-container {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
          border: 1px solid #e2e8f0;
          padding: 20px;
        }

        .detail-table-header {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .detail-table-icon {
          font-size: 18px;
          margin-right: 8px;
        }

        .detail-table-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .copy-btn {
          display: inline-flex;
          align-items: center;
          background: #eff6ff;
          border: none;
          color: #3b82f6;
          font-size: 13px;
          cursor: pointer;
          padding: 4px 12px;
          border-radius: 12px;
          margin-left: 12px;
          transition: background 0.2s;
        }

        .copy-btn:hover {
          background: #dbeafe;
        }

        .detail-table-subtitle {
          font-size: 14px;
          color: #64748b;
          margin-left: 4px;
        }

        .detail-table-desc {
          font-size: 13px;
          color: #94a3b8;
          margin-bottom: 16px;
          padding-left: 26px;
        }

        .detail-table-wrapper {
          overflow-x: auto;
          overflow-y: hidden;
        }

        .detail-table {
          width: 100%;
          min-width: 1000px;
          border-collapse: collapse;
          font-size: 13px;
        }

        .detail-table th {
          text-align: center;
          padding: 12px 16px;
          background: #f1f5f9;
          color: #64748b;
          font-weight: 600;
          border-bottom: 2px solid #e2e8f0;
        }

        .detail-table td {
          text-align: center;
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
        }

        .detail-table tbody tr:hover {
          background: #f8fafc;
        }

        .detail-th-category {
          width: 100px;
        }

        .detail-th-name {
          width: 180px;
        }

        .detail-th-location {
          width: 180px;
        }

        .detail-th-score {
          width: 80px;
        }

        .detail-th-level {
          width: 80px;
        }

        .detail-th-status {
          width: 80px;
        }

        .detail-th-factor {
          width: 300px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: #ffffff;
          border-radius: 8px;
          width: 480px;
          max-width: 90%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }

        .modal-header {
          padding: 16px 20px;
          background: #f8fafc;
          font-size: 14px;
          color: #64748b;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-body {
          padding: 20px;
        }

        .modal-title {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 12px;
        }

        .modal-text {
          font-size: 13px;
          color: #475569;
          line-height: 1.8;
          white-space: pre-wrap;
        }

        .modal-footer {
          padding: 16px 20px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
        }

        .modal-confirm {
          background: #3b82f6;
          color: #ffffff;
          border: none;
          padding: 6px 24px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .modal-confirm:hover {
          background: #2563eb;
        }
      `}</style>
    </div>
  );
};

export default formatterCollections(
  { code: [modelPrompt, 'tarzan.common'] },
)(observer(EquipmentHealthOverview));