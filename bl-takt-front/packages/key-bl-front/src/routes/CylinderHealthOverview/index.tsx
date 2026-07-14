import React, { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import SummaryBar from '../shared/equipmentHealth/SummaryBar';
import OverviewQueryBar, { OverviewQueryFilters } from '../shared/equipmentHealth/OverviewQueryBar';
import OverviewFilterPanel from '../shared/equipmentHealth/OverviewFilterPanel';
import OverviewPagination from '../shared/equipmentHealth/OverviewPagination';
import { hiToHealthKey } from '../shared/equipmentHealth/utils';
import DeviceCard from './components/DeviceCard';
import {
  cylinderDevices,
  fixtureOptions,
  healthLevelOptions,
  lineOptions,
  stationOptions,
} from './data/mockData';

const modelPrompt = 'tarzan.cylinderHealthOverview';

const defaultFilters: OverviewQueryFilters = {
  line: '全部产线',
  station: '全部工位',
  fixture: '全部夹具',
  name: '',
};

const CylinderHealthOverview = () => {
  const [selectedHealthLevels, setSelectedHealthLevels] = useState<string[]>([]);
  const [filters, setFilters] = useState<OverviewQueryFilters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredDevices = useMemo(() => {
    return cylinderDevices.filter((device) => {
      if (filters.line !== '全部产线' && device.line !== filters.line) return false;
      if (filters.station !== '全部工位' && device.station !== filters.station) return false;
      if (filters.fixture !== '全部夹具' && device.fixture !== filters.fixture) return false;
      if (filters.name && !device.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (selectedHealthLevels.length > 0 && !selectedHealthLevels.includes(hiToHealthKey(device.healthIndex))) return false;
      return true;
    });
  }, [filters, selectedHealthLevels]);

  const pageDevices = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredDevices.slice(start, start + pageSize);
  }, [filteredDevices, page, pageSize]);

  return (
    <div className="cylinder-health-overview">
      <Header title={intl.get(`${modelPrompt}.title`).d('气缸综合健康总览')} />
      <Content>
        <div className="eh-page-header">
          <h1 className="eh-main-title">焊装车间 · 气缸健康智控</h1>
          <p className="eh-sub-title">寿命驱动健康评分 | 预警分级 | 分类统计</p>
        </div>

        <OverviewFilterPanel>
          <SummaryBar
            title="健康度"
            icon="favorite"
            iconClassName="eh-summary-heart"
            options={healthLevelOptions}
            selectedKeys={selectedHealthLevels}
            onChange={(keys) => { setSelectedHealthLevels(keys); setPage(1); }}
          />
          <OverviewQueryBar
            filters={filters}
            lineOptions={lineOptions}
            stationOptions={stationOptions}
            fixtureOptions={fixtureOptions}
            nameLabel="气缸名称"
            onChange={(next) => { setFilters(next); setPage(1); }}
          />
        </OverviewFilterPanel>

        <div className="eh-card-grid">
          {pageDevices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>

        {filteredDevices.length === 0 && <div className="eh-empty">暂无符合条件的气缸数据</div>}

        <OverviewPagination
          page={page}
          pageSize={pageSize}
          total={filteredDevices.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        />
      </Content>

      <style>{`
        .cylinder-health-overview { background: #f5f7fa; }
        .eh-page-header { margin-bottom: 16px; }
        .eh-main-title { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 4px; }
        .eh-sub-title { font-size: 12px; color: #64748b; margin: 0; }
        .eh-card-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }
        .eh-empty {
          text-align: center; padding: 40px; color: #94a3b8; font-size: 13px;
          background: #fff; border-radius: 10px; border: 1px dashed #e2e8f0;
        }
      `}</style>
    </div>
  );
};

export default formatterCollections({ code: [modelPrompt, 'tarzan.common'] })(observer(CylinderHealthOverview));
