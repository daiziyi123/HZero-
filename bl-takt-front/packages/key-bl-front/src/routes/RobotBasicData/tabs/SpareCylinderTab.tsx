/*
 * @Description: 夹具气缸 Tab 页
 */

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { DataSet, TextField, Select } from 'choerodon-ui/pro';
import { ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import BaseTable, { ToolbarButton } from './BaseTable';
import CommonFilter from './CommonFilter';
import SpareCylinderModal from './SpareCylinderModal';
import { getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
const organizationId = getCurrentOrganizationId();
const apiPrefix = '/dev-health-manager-yh';
import { saveFixtureCylinder, updateFixtureCylinder, deleteFixtureCylinder, fetchFixtureLov } from '../services';

const { Option } = Select;

const SpareCylinderTab = () => {
  const [tableDs, setTableDs] = useState<DataSet | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'detail' | 'edit' | 'add'>('detail');
  const [currentRecord, setCurrentRecord] = useState<Record<string, any>>({});
  const [fixtureCodeFilter, setFixtureCodeFilter] = useState('');
  const [fixtureNameFilter, setFixtureNameFilter] = useState('');
  const [selectedLineId, setSelectedLineId] = useState<string | undefined>(undefined);
  const [selectedWorkcellId, setSelectedWorkcellId] = useState<string | undefined>(undefined);
  const [fixtureOptions, setFixtureOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedFixture, setSelectedFixture] = useState<string | undefined>(undefined);
  const tableDsRef = useRef(tableDs);
  tableDsRef.current = tableDs;

  const columns = useMemo(() => [
    { name: 'prodLineName', label: '产线', align: ColumnAlign.center },
    { name: 'workcellName', label: '工位', align: ColumnAlign.center },
    { name: 'fixtureCode', label: '夹具编号', align: ColumnAlign.center },
    { name: 'fixtureName', label: '夹具名称', align: ColumnAlign.center },
    { name: 'groupNo', label: '组号', align: ColumnAlign.center },
    { name: 'equipmentCode', label: '气缸编号', align: ColumnAlign.center },
    { name: 'equipmentName', label: '气缸名称', align: ColumnAlign.center },
    { name: 'cylinderPurpose', label: '气缸用途', align: ColumnAlign.center },
    { name: 'cylinderBrand', label: '气缸品牌', align: ColumnAlign.center },
    { name: 'cylinderModel', label: '气缸型号', align: ColumnAlign.center },
    { name: 'lifeCount', label: '寿命次数', align: ColumnAlign.center },
    { name: 'actionCount', label: '已动作次数', align: ColumnAlign.center },
    { name: 'solenoidValveCode', label: '电磁阀编号', align: ColumnAlign.center },
    { name: 'solenoidValveModel', label: '电磁阀型号', align: ColumnAlign.center },
  ], []);

  const tableDsConfig = useMemo(() => ({
    autoQuery: true,
    autoCreate: false,
    primaryKey: 'id',
    selection: false,
    paging: 'normal',
    pageSize: 10,
    fields: columns.map((col) => ({
      name: col.name,
      type: FieldType.string,
      label: col.label || col.header || col.name,
    })),
    transport: {
      read: () => ({
        url: `${apiPrefix}/v1/${organizationId}/ehm-fixture-cylinder-exts`,
        method: 'GET',
      }),
      create: saveFixtureCylinder,
      update: updateFixtureCylinder,
      destroy: deleteFixtureCylinder,
    },
  }), [columns]);

  const handleOpenModal = (mode: 'detail' | 'edit' | 'add', record?: Record<string, any>) => {
    setModalMode(mode);
    setCurrentRecord(record || {});
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setCurrentRecord({});
  };

  const handleSaveModal = async (data: Record<string, any>) => {
    try {
      if (modalMode === 'add') {

        await saveFixtureCylinder([data]);
      } else if (modalMode === 'edit') {
        await saveFixtureCylinder([data]);
      }
      tableDs?.query();
    } catch (error) {
      console.error('保存失败:', error);
    }
    setModalVisible(false);
    setCurrentRecord({});
  };

  const handleDelete = async (record: any) => {
    try {
      const data = [{ id: record.id, _token: record._token }]
      const res = await deleteFixtureCylinder(data);
      if (res && !res.failed) {
        notification.success({ message: '删除成功' });
        tableDs?.query();
      } else {
        notification.error({ message: res?.message || '删除失败' });
      }
    } catch (e) {
      // request failed
    }
  };

  const toolbarButtons: ToolbarButton[] = useMemo(() => [
    { key: 'add', text: '新增', icon: 'add_circle_outline', type: 'primary', onClick: () => handleOpenModal('add') },
    { key: 'batchImport', text: '批量导入', icon: 'cloud_upload', onClick: () => console.log('批量导入') },
    { key: 'downloadTemplate', text: '下载模板', icon: 'get_app', onClick: () => console.log('下载模板') },
  ], []);

  const columnActions = useMemo(() => [
    { key: 'detail', text: '详情', icon: 'visibility', onClick: (record: any) => handleOpenModal('detail', record) },
    { key: 'edit', text: '编辑', icon: 'edit-o', onClick: (record: any) => handleOpenModal('edit', record) },
    {
      key: 'delete',
      text: '删除',
      icon: 'delete_forever',
      onClick: handleDelete,
      confirm: {
        title: '确定要删除该数据吗？删除后不可恢复。',
        okText: '确认删除',
        cancelText: '取消',
      },
    },
  ], [tableDs, handleDelete]);

  // 产线/工位变更时，联动加载夹具下拉数据（需要同时传入产线id和工位id）
  useEffect(() => {
    if (selectedLineId && selectedWorkcellId) {
      setFixtureOptions([]);
      setSelectedFixture(undefined);
      tableDsRef.current?.setQueryParameter('fixtureCode', undefined);
      fetchFixtureLov(selectedLineId, selectedWorkcellId)
        .then((res: any) => {
          if (res && res.content) {
            setFixtureOptions(
              res.content.map((item: any) => ({
                value: String(item.value),
                label: item.meaning,
              }))
            );
          }
        })
        .catch((err: any) => {
          console.error('获取夹具下拉数据失败:', err);
        });
    } else {
      setFixtureOptions([]);
      setSelectedFixture(undefined);
    }
  }, [selectedLineId, selectedWorkcellId]);

  const handleExtraReset = () => {
    setFixtureCodeFilter('');
    setFixtureNameFilter('');
    setSelectedFixture(undefined);
    setFixtureOptions([]);
    tableDsRef.current?.setQueryParameter('fixtureCode', undefined);
    tableDsRef.current?.setQueryParameter('equipmentCode', undefined);
    tableDsRef.current?.setQueryParameter('equipmentName', undefined);
  };

  const extraFilter = (
    <>
      <div className="bt-filter-item">
        <span className="bt-filter-label">全部夹具</span>
        <Select
          className="bt-filter-select"
          value={selectedFixture}
          onChange={(v: any) => {
            setSelectedFixture(v);
            tableDsRef.current?.setQueryParameter('fixtureCode', v);
          }}
          placeholder={selectedWorkcellId ? '全部' : '请先选择工位'}
          disabled={!selectedWorkcellId}
        >
          {fixtureOptions.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </Select>
      </div>
      <div className="bt-filter-item">
        <span className="bt-filter-label">气缸编号</span>
        <TextField
          className="bt-filter-input"
          placeholder="气缸编号"
          value={fixtureCodeFilter}
          onChange={(value) => {
            setFixtureCodeFilter(value);
            tableDsRef.current?.setQueryParameter('equipmentCode', value);
          }}
        />
      </div>
      <div className="bt-filter-item">
        <span className="bt-filter-label">气缸名称</span>
        <TextField
          className="bt-filter-input"
          placeholder="气缸名称"
          value={fixtureNameFilter}
          onChange={(value) => {
            setFixtureNameFilter(value);
            tableDsRef.current?.setQueryParameter('equipmentName', value);
          }}
        />
      </div>
    </>
  );

  return (
    <>
      <BaseTable
        titleIcon="handyman"
        title="夹具气缸数据列表"
        columns={columns}
        dsConfigOrData={tableDsConfig}
        onTableDsReady={setTableDs}
        toolbarButtons={toolbarButtons}
        columnActions={columnActions}
      >
        {tableDs && (
          <CommonFilter
            tableDs={tableDs}
            showDeviceCode={false}
            showDeviceName={false}
            extraChildren={extraFilter}
            onReset={handleExtraReset}
            onWorkcellChange={setSelectedWorkcellId}
            onLineChange={setSelectedLineId}
          />
        )}
      </BaseTable>
      <SpareCylinderModal
        visible={modalVisible}
        mode={modalMode}
        record={currentRecord}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
      />
    </>
  );
};

export default SpareCylinderTab;