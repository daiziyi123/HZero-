/*
 * @Description: 机器人 Tab 页（产线+工位+设备编号+设备名称）
 */

import React, { useMemo, useState, useRef, useCallback } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import BaseTable, { ToolbarButton } from './BaseTable';
import CommonFilter from './CommonFilter';
import RobotModal from './RobotModal';
import { getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import { saveRobotEquipment, updateRobotEquipment, deleteRobotEquipment } from '../services';

const organizationId = getCurrentOrganizationId();
const apiPrefix = '/dev-health-manager-yh';

const RobotTab = () => {
  const [tableDs, setTableDs] = useState<DataSet | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'detail' | 'edit' | 'add'>('detail');
  const [currentRecord, setCurrentRecord] = useState<Record<string, any>>({});
  const tableDsRef = useRef(tableDs);
  tableDsRef.current = tableDs;

  const columns = useMemo(() => [
    { name: 'prodLineName', label: '产线', align: ColumnAlign.center },
    { name: 'workcellName', label: '工位', align: ColumnAlign.center },
    { name: 'equipmentCode', label: '设备编号', align: ColumnAlign.center },
    { name: 'equipmentName', label: '设备名称', align: ColumnAlign.center },
    { name: 'equipmentTypeName', label: '设备类型', align: ColumnAlign.center },
    {
      name: 'productionFieldId',
      label: '存放位置',
      align: ColumnAlign.center,
      renderer: ({ record }: any) => {
        const line = record?.get('prodLineName') || '';
        const station = record?.get('workcellName') || '';
        return line && station ? `${line}/${station}` : line || station || '-';
      },
    },
    { name: 'creationDate', label: '操作时间', align: ColumnAlign.center },
  ], []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tableDsConfig: any = useMemo(() => ({
    autoQuery: true,
    autoCreate: false,
    primaryKey: 'id',
    selection: false,
    paging: 'normal',
    pageSize: 10,
    fields: columns.map((col) => ({
      name: col.name,
      type: FieldType.string,
      label: (col as any).label || col.name,
    })),
    transport: {
      read: () => ({
        url: `${apiPrefix}/v1/${organizationId}/ehm-robot-equipment-exts`,
        method: 'GET',
      }),
    },
  }), [columns]);

  const handleOpenModal = useCallback((mode: 'detail' | 'edit' | 'add', record?: Record<string, any>) => {
    setModalMode(mode);
    setCurrentRecord(record || {});
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setCurrentRecord({});
  }, []);

  const handleSaveModal = useCallback(async (data: Record<string, any>) => {
    try {
      if (modalMode === 'add') {
        await saveRobotEquipment([data]);
      } else if (modalMode === 'edit') {
        await saveRobotEquipment([data]);
      }
      tableDs?.query();
      notification.success({ message: '保存成功' });
    } catch (error) {
      console.error('保存失败:', error);
      notification.error({ message: '保存失败' });
    }
    setModalVisible(false);
    setCurrentRecord({});
  }, [modalMode, tableDs]);

  const handleDelete = useCallback(async (record: any) => {
    try {
      const data = [{ id: record.id, _token: record._token }];
      const res = await deleteRobotEquipment(data);
      if (res && !res.failed) {
        notification.success({ message: '删除成功' });
        tableDs?.query();
      } else {
        notification.error({ message: res?.message || '删除失败' });
      }
    } catch (e) {
      console.error('删除失败:', e);
    }
  }, [tableDs]);

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

  return (
    <>
      <BaseTable
        titleIcon="smart_toy"
        title="机器人数据列表"
        columns={columns}
        dsConfigOrData={tableDsConfig}
        onTableDsReady={setTableDs}
        toolbarButtons={toolbarButtons}
        columnActions={columnActions}
      >
        {tableDs && (
          <CommonFilter
            tableDs={tableDs}
            queryParamMap={{
              line: 'prodLineId',
              workcell: 'workcellId',
              deviceCode: 'equipmentCode',
              deviceName: 'equipmentName',
            }}
          />
        )}
      </BaseTable>
      <RobotModal
        visible={modalVisible}
        mode={modalMode}
        record={currentRecord}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
      />
    </>
  );
};

export default RobotTab;
