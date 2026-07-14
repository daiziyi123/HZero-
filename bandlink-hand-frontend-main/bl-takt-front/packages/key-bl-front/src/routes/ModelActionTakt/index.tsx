/*
 * @Author: Auto Generated
 * @Date: 2025-06-04
 * @Description: 产线工位车型动作节拍关系维护页面
 */

import React, { useMemo } from 'react';
import { Table, DataSet, Button } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { openTab } from 'utils/menuTab';
import intl from 'utils/intl';
import { isNil, isArray } from 'lodash';
import queryString from 'query-string';
import formatterCollections from 'utils/intl/formatterCollections';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { TableQueryBarType, ColumnLock, ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { useRequest } from '@components/tarzan-hooks';
import notification from 'utils/notification';
import { tableDS } from './store/index';
import { saveActionTakt, updateModel, deleteModel, exportActionTakt } from './services';

const modelPrompt = 'tarzan.modelActionTakt';

const ModelActionTakt = () => {
  const tableDs = useMemo(() => new DataSet(tableDS()), []);

  const { run: runSave } = useRequest(saveActionTakt(), {
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
      name: 'modelObj',
      editor: (record) => record.status === 'add' && !!record.getState('editing'),
    },
    { name: 'modelName' },
    {
      name: 'deviceObj',
      editor: (record) => record.status === 'add' && !!record.getState('editing'),
    },
    { name: 'equipmentName' },
    {
      name: 'actionObj',
      editor: (record) => record.status === 'add' && !!record.getState('editing'),
    },
    { name: 'actionName' },
    {
      name: 'actionSequence',
      editor: (record) => !!record.getState('editing'),
    },
    {
      name: 'actionStep',
      editor: (record) => !!record.getState('editing'),
    },
    {
      name: 'standardTakt',
      editor: (record) => !!record.getState('editing'),
    },
    {
      name: 'taktLimitRange',
      editor: (record) => !!record.getState('editing'),
    },
    {
      name: 'actionProperty',
      editor: (record) => !!record.getState('editing'),
    },
    {
      name: 'actionType',
      editor: (record) =>!!record.getState('editing'),
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
      const data = selected.map((r) => ({ actionTaktId: r.get('actionTaktId') }));
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
      key: '/himp/commentImport/IIOT.MT_ACTION_TAKT_IMP',
      title: intl.get(`${modelPrompt}.title.import`).d('产线工位车型动作节拍关系维护-导入'),
      search: queryString.stringify({
        action: intl.get(`${modelPrompt}.title.import`).d('产线工位车型动作节拍关系维护-导入'),
        prefixPatch: '/himp',
      }),
    });
  };

  const getExportQueryParams = () => {
    if (tableDs.selected?.length) {
      return {
        actionTaktIds: tableDs.selected?.map(record => record?.get('actionTaktId')),
      }
    };
    const current = tableDs.queryDataSet?.current;
    if (!current) {
      return {};
    }
    const {
      prodLineObj,
      workcellObj,
      modelObj,
      deviceObj,
      actionObj,
      ...rest
    } = current.toData();
    Object.keys(rest).forEach(i => {
      if ((isArray(rest[i]) && !rest[i]?.length) || isNil(rest[i])) {
        delete rest[i];
      }
    });
    return rest;
  };

  return (
    <>
      <Header title={intl.get(`${modelPrompt}.title.list`).d('产线工位车型动作节拍关系维护')}>
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
          requestUrl={exportActionTakt()}
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
          searchCode="ModelActionTakt_searchCode"
          customizedCode="ModelActionTakt_customizedCode"
        />
      </Content>
    </>
  );
};

export default formatterCollections(
  { code: [modelPrompt, 'tarzan.common'] },
)(observer(ModelActionTakt));
