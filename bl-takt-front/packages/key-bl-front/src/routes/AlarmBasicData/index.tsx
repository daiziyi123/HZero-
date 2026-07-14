/*
 * @Author: Auto Generated
 * @Date: 2026-06-09
 * @Description: 报警基础数据页面
 */

import React, { useMemo } from 'react';
import { Table, DataSet, Button } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { openTab } from 'utils/menuTab';
import intl from 'utils/intl';
import { isNil, isArray } from 'lodash';
import formatterCollections from 'utils/intl/formatterCollections';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { TableQueryBarType, ColumnLock, ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { useRequest } from '@components/tarzan-hooks';
import queryString from 'query-string';
import notification from 'utils/notification';
import { tableDS } from './store/index';
import { saveAlarmType, updateAlarmType, deleteAlarmType, exportAlarmBasicData } from './services';

const modelPrompt = 'tarzan.alarmBasicData';

const AlarmBasicData = () => {
  const tableDs = useMemo(() => new DataSet(tableDS()), []);

  const { run: runSave } = useRequest(saveAlarmType(), {
    manual: true,
    needPromise: true,
  });

  const columns: ColumnProps[] = useMemo(() => [
    {
      name: 'prodLineObj',
      editor: (record) => record.status === 'add' && !!record.getState('editing'),
    },
    { name: 'prodLineName' },
    {
      name: 'workcellObj',
      editor: (record) => record.status === 'add' && !!record.getState('editing'),
    },
    { name: 'workcellName' },
    {
      name: 'deviceObj',
      editor: (record) => record.status === 'add' && !!record.getState('editing'),
    },
    { name: 'equipmentName' },
    {
      name: 'alarmPoint',
      editor: (record) => !!record.getState('editing'),
    },
    {
      name: 'description',
      editor: (record) => !!record.getState('editing'),
    },
    {
      name: 'alarmCode',
      editor: (record) => !!record.getState('editing'),
    },
    {
      name: 'alarmName',
      editor: (record) => !!record.getState('editing'),
    },
    {
      name: 'alarmLevel',
      editor: (record) => !!record.getState('editing'),
    },
    {
      name: 'category',
      editor: (record) => !!record.getState('editing'),
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
    const data = selected.map((r) => ({ alarmId: r.get('alarmId') }));
    const res = await deleteAlarmType(data);
    if (res && !res.failed) {
      notification.success({ message: intl.get('tarzan.common.message.deleteSuccess').d('删除成功') });
      tableDs.query();
    } else {
      notification.error({ message: res?.message || intl.get('tarzan.common.message.deleteFailed').d('删除失败') });
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
      const res = await (isAdd ? runSave({ params: data }) : updateAlarmType(data));
      if (res && !res.failed) {
        notification.success({ message: intl.get('tarzan.common.message.saveSuccess').d('保存成功') });
        record.setState('editing', false);
        tableDs.query();
      } else {
        notification.error({ message: res?.message || intl.get('tarzan.common.message.saveFailed').d('保存失败') });
      }
    } catch (e) {
      // request failed
    }
  };

  const handleImport = () => {
    openTab({
      key: '/himp/commentImport/IIOT.MT_ALARM_TYPE_IMP',
      title: intl.get(`${modelPrompt}.title.import`).d('报警基础数据-导入'),
      search: queryString.stringify({
        action: intl.get(`${modelPrompt}.title.import`).d('报警基础数据-导入'),
        prefixPatch: '/himp',
      }),
    });
  };

  const getExportQueryParams = () => {
    if (tableDs.selected?.length) {
      return {
        alarmIds: tableDs.selected?.map(record => record?.get('alarmId')),
      }
    };
    const current = tableDs.queryDataSet?.current;
    if (!current) {
      return {};
    }
    const { prodLineObj, workcellObj, deviceObj, ...rest } = current.toData();
    Object.keys(rest).forEach((i) => {
      if ((isArray(rest[i]) && !rest[i]?.length) || isNil(rest[i])) {
        delete rest[i];
      }
    });
    return rest;
  };

  return (
    <div className="hmes-style">
      <Header title={intl.get(`${modelPrompt}.title.list`).d('报警基础数据')}>
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
          requestUrl={exportAlarmBasicData()}
          queryParams={getExportQueryParams}
        />
      </Header>
      <Content>
        <Table
          dataSet={tableDs}
          columns={columns}
          queryBar={TableQueryBarType.filterBar}
          queryBarProps={{ fuzzyQuery: false }}
          searchCode="AlarmBasicData_searchCode"
          customizedCode="AlarmBasicData_customizedCode"
        />
      </Content>
    </div>
  );
};

export default formatterCollections(
  { code: [modelPrompt, 'tarzan.common'] },
)(observer(AlarmBasicData));
