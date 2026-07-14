/*
 * @Author: Auto Generated
 * @Date: 2025-01-20
 * @Description: 车型维护页面
 */

import React, { useMemo } from 'react';
import { Table, DataSet, Button } from 'choerodon-ui/pro';
import { Badge } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { openTab } from 'utils/menuTab';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { TableQueryBarType, ColumnLock, ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import queryString from 'query-string';
import { useRequest } from '@components/tarzan-hooks';
import notification from 'utils/notification';
import { tableDS } from './store/index';
import { saveModel, updateModel, deleteModel, exportModel } from './services';

const modelPrompt = 'tarzan.vehicleModelMaintenance';

const VehicleModelMaintenance = () => {
  const tableDs = useMemo(() => new DataSet(tableDS()), []);

  const { run: runSave } = useRequest(saveModel(), {
    manual: true,
    needPromise: true,
  });

  const columns: ColumnProps[] = useMemo(() => [
    {
      name: 'modelCode',
      editor: (record) => record.status === 'add' && !!record.getState('editing'),
    },
    {
      name: 'modelName',
      editor: (record) => !!record.getState('editing'),
    },
    {
      name: 'isEnable',
      editor: (record) => !!record.getState('editing'),
      renderer: ({value}) => (<Badge status={value === '1' ? 'success' : 'error'} text={value === '1' ? '启用' : '禁用'}/>),
    },
    {
      name: 'operation',
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 150,
      align: ColumnAlign.center,
      lock: ColumnLock.right,
      renderer: ({ record }) => {
        if (record && record.getState('editing')) {
          return (
            <>
              <Button
                funcType={FuncType.link}
                onClick={() => handleRowCancel(record)}
              >
                {intl.get('tarzan.common.button.cancel').d('取消')}
              </Button>
              <Button
                funcType={FuncType.link}
                color={ButtonColor.primary}
                onClick={() => handleRowSave(record)}
              >
                {intl.get('tarzan.common.button.save').d('保存')}
              </Button>
            </>
          );
        }
        return (
          <Button
            funcType={FuncType.link}
            onClick={() => handleRowEdit(record!)}
          >
            {intl.get('tarzan.common.button.edit').d('编辑')}
          </Button>
        );
      },
    },
  ], []);

  // 是否已有新增中的行
  const hasAddingRow = () => {
    return tableDs.records.some((r) => r.status === 'add');
  };

  const handleAdd = () => {
    if (hasAddingRow()) return;
    const record = tableDs.create({}, 0);
    record.setState('editing', true);
  };

  const handleDelete = async () => {
    const selected = tableDs.selected;
    if (!selected || selected.length === 0) {
      notification.error({ message: intl.get('tarzan.common.message.noSelected').d('请先选择数据') });
      return;
    }
    try {
      const data = selected.map((r) => ({
        modelId: r.get('modelId'),
        objectVersionNumber: r.get('objectVersionNumber'),
      }));
      const res = await deleteModel(data);
      if (res && !res.failed) {
        notification.success({ message: intl.get('tarzan.common.message.deleteSuccess').d('删除成功') });
        tableDs.query();
      } else {
        notification.error({ message: res?.message || intl.get('tarzan.common.message.deleteFailed').d('删除失败') });
      }
    } catch (e) {
      // request failed
    }
  };

  const handleRowEdit = (record) => {
    record.setState('editing', true);
  };

  const handleRowCancel = (record) => {
    if (record.status === 'add') {
      tableDs.remove(record);
    } else {
      record.reset();
      record.setState('editing', false);
    }
  };

  const handleRowSave = async (record) => {
    try {
      const valid = await record.validate();
      if (!valid) {
        return;
      }
      const data = record.toData();
      const isAdd = record.status === 'add';
      const res = await (isAdd ? runSave({ params: data }) : updateModel(data));
      if (res && !res.failed) {
        notification.success({ });
        record.setState('editing', false);
        tableDs.query();
      } else {
        notification.error({ message: res?.message });
      }
    } catch (e) {
      // request failed
    }
  };

  const handleImport = () => {
    openTab({
      key: '/himp/commentImport/IIOT.MT_MODEL_IMP',
      title: intl.get(`${modelPrompt}.title.import`).d('车型维护-导入'),
      search: queryString.stringify({
        action: intl.get(`${modelPrompt}.title.import`).d('车型维护-导入'),
        prefixPatch: '/himp',
      }),
    });
  };

  const getExportQueryParams = () => {
    if (tableDs.selected?.length) {
      return {
        modelIds: tableDs.selected?.map(record => record?.get('modelId')),
      }
    };
    const current = tableDs.queryDataSet?.current;
    if (!current) {
      return {};
    }
    return current.toData();
  };

  return (
    <>
      <Header title={intl.get(`${modelPrompt}.title.list`).d('车型维护')}>
        <Button key="add" icon="add" onClick={handleAdd} color={ButtonColor.primary}>
          {intl.get('tarzan.common.button.create').d('新建')}
        </Button>
        <Button key="delete" icon="delete" onClick={handleDelete}>
          {intl.get('tarzan.common.button.delete').d('删除')}
        </Button>
        <Button key="import" icon="import_export" onClick={handleImport}>
          {intl.get('tarzan.common.button.import').d('导入')}
        </Button>
        <ExcelExport
          exportAsync={false}
          defaultSelectAll
          hiddenFillerType
          requestUrl={exportModel()}
          queryParams={getExportQueryParams}
        />
      </Header>
      <Content>
        <Table
          dataSet={tableDs}
          columns={columns}
          queryBar={TableQueryBarType.filterBar}
          queryBarProps={{
            fuzzyQuery: false,
          }}
          searchCode="VehicleModelMaintenance_searchCode"
          customizedCode="VehicleModelMaintenance_customizedCode"
        />
      </Content>
    </>
  );
};

export default formatterCollections(
  { code: [modelPrompt, 'tarzan.common'] },
)(observer(VehicleModelMaintenance));
