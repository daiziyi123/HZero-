import React, { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import OverviewPagination from '../shared/equipmentHealth/OverviewPagination';
import { hiToHealthKey } from '../shared/equipmentHealth/utils';
import HealthSummaryCards from './components/HealthSummaryCards';
import ServoFilterBar, { ServoFilters } from './components/ServoFilterBar';
import ServoAnalytics from './components/ServoAnalytics';
import DeviceCard from './components/DeviceCard';
import {
  healthLevelSelectOptions,
  lineOptions,
  servoDevices,
  servoSummaryCards,
  stationOptions,
} from './data/mockData';

const modelPrompt = 'tarzan.servoHealthOverview';

const healthLevelLabelToKey: Record<string, string> = {
  健康: 'health', 良好: 'good', 警告: 'warning', 严重: 'critical',
};

const defaultFilters: ServoFilters = {
  line: '全部产线',
  station: '全部工位',
  name: '全部电机',
  healthLevel: '全部等级',
};

const ServoHealthOverview = () => {
  const [filters, setFilters] = useState<ServoFilters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const nameOptions = useMemo(
    () => ['全部电机', ...servoDevices.map((d) => d.name)],
    [],
  );

  const filteredDevices = useMemo(() => {
    return servoDevices.filter((device) => {
      if (filters.line !== '全部产线' && device.line !== filters.line) return false;
      if (filters.station !== '全部工位' && device.station !== filters.station) return false;
      if (filters.name !== '全部电机' && device.name !== filters.name) return false;
      if (
        filters.healthLevel !== '全部等级' &&
        hiToHealthKey(device.healthIndex) !== healthLevelLabelToKey[filters.healthLevel]
      ) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const pageDevices = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredDevices.slice(start, start + pageSize);
  }, [filteredDevices, page, pageSize]);

  const handleFilterChange = (next: ServoFilters) => {
    setFilters(next);
    setPage(1);
  };

  const handleSummarySelect = (key: string) => {
    const label = Object.keys(healthLevelLabelToKey).find((k) => healthLevelLabelToKey[k] === key);
    const nextLevel = filters.healthLevel === label ? '全部等级' : label || '全部等级';
    handleFilterChange({ ...filters, healthLevel: nextLevel });
  };

  const selectedSummaryKey = healthLevelLabelToKey[filters.healthLevel];

  return (
    <div className="servo-health-overview">
      <Header title={intl.get(`${modelPrompt}.title`).d('伺服电机综合健康总览')} />
      <Content>
        <div className="sho-page-header">
          <h1 className="sho-main-title">
            <Icon type="hvac" className="sho-title-icon" />
            焊装车间 · 伺服电机诊断总览
          </h1>
          <p className="sho-sub-title">滑台 / 转台健康监控 | 风险预警 &amp; 智能运维 | 每行5卡片 + 分页浏览</p>
        </div>

        <HealthSummaryCards
          items={servoSummaryCards}
          selectedKey={selectedSummaryKey}
          onSelect={handleSummarySelect}
        />

        <ServoFilterBar
          filters={filters}
          lineOptions={lineOptions}
          stationOptions={stationOptions}
          nameOptions={nameOptions}
          healthLevelOptions={healthLevelSelectOptions}
          onChange={handleFilterChange}
          onReset={() => handleFilterChange(defaultFilters)}
        />

        <div className="sho-section-title">
          <Icon type="hvac" className="sho-section-icon" />
          电机最新健康详情
        </div>

        <div className="sho-card-grid">
          {pageDevices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>

        {filteredDevices.length === 0 && <div className="sho-empty">暂无符合条件的伺服电机数据</div>}

        <OverviewPagination
          page={page}
          pageSize={pageSize}
          total={filteredDevices.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        />

        <ServoAnalytics />
      </Content>

      <style>{`
        .servo-health-overview { background: #f5f7fa; }
        .sho-page-header { margin-bottom: 16px; }
        .sho-main-title {
          display: flex; align-items: center; gap: 8px;
          font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 4px;
        }
        .sho-title-icon { font-size: 24px !important; color: #2563eb !important; }
        .sho-sub-title { font-size: 12px; color: #64748b; margin: 0; }
        .sho-section-title {
          display: flex; align-items: center; gap: 8px;
          font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 14px;
        }
        .sho-section-icon { font-size: 20px !important; color: #2563eb !important; }
        .sho-card-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
        }
        .sho-empty {
          text-align: center; padding: 40px; color: #94a3b8; font-size: 13px;
          background: #fff; border-radius: 10px; border: 1px dashed #e2e8f0;
        }
      `}</style>
    </div>
  );
};

export default formatterCollections({ code: [modelPrompt, 'tarzan.common'] })(observer(ServoHealthOverview));
