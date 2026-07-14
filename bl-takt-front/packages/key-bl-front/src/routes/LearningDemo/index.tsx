/**
 * @Description: 学习示例页面
 * @Author: Assistant
 * @Date: 2026-06-10
 */

import React, { useMemo } from 'react';
import { Table, DataSet, Button } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { openTab } from 'utils/menuTab';
import queryString from 'query-string';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { TableQueryBarType, ColumnLock, ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { useRequest } from '@components/tarzan-hooks';
import notification from 'utils/notification';
import { tableDS } from './store/index';
import { saveDemoData, updateDemoData, deleteDemoData, exportDemoData } from './services/index';

const modelPrompt = 'tarzan.learningDemo';

const LearningDemo = () => {
  const tableDs = useMemo(() => new DataSet(tableDS()), []);

  const { run: runSave } = useRequest(saveDemoData(), {
    manual: true,
    needPromise: true,
  });

  const columns: ColumnProps[] = useMemo(() => [
    {
      name: 'id',
      editor: () => false,
      align: ColumnAlign.center,
      width: 150,
    },
    {
      name: 'name',
      editor: (record) => !!record.getState('editing'),
      align: ColumnAlign.center,
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
    try {
      const data = selected.map((r) => ({
        id: r.get('id'),
        _token: r.get('_token'),
      }));
      const res = await deleteDemoData(data);
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
    console.log(record);
    
    try {
      const valid = await record.validate();
      if (!valid) {
        return;
      }
      const data = record.toData();
      console.log(data);

      const isAdd = record.status === 'add';
      //  const res = await (isAdd ? runSave({ params: [data] }) : updateDemoData([data]));
      const submitData = isAdd ? [data] : [{
        // ...data,
        id: data.id,
        name: data.name,
        objectVersionNumber: data.objectVersionNumber,
        _token: data._token,
      }];
      const res = await (isAdd ? runSave({ params: submitData }) : updateDemoData(submitData));
      if (res && !res.failed) {
        notification.success({});
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
      key: '/himp/commentImport/BD.DEMO.BLTEST.IMPORT',
      title: intl.get(`${modelPrompt}.title.import`).d('学习示例页面-导入'),
      search: queryString.stringify({
        action: intl.get(`${modelPrompt}.title.import`).d('学习示例页面-导入'),
        prefixPatch: '/himp',
      }),
    });
  };

  const getExportQueryParams = () => {
    if (tableDs.selected?.length) {
      return {
        ids: tableDs.selected?.map((record) => record?.get('id')),
      };
    }
    const current = tableDs.queryDataSet?.current;
    if (!current) {
      return {};
    }
    return current.toData();
  };

  return (
    <>
      <Header title={intl.get(`${modelPrompt}.title`).d('学习示例页面')}>
        <Button key="add" icon="add" onClick={handleAdd} color={ButtonColor.primary}>
          {intl.get('tarzan.common.button.create').d('新建')}
        </Button>
        <Button key="delete" icon="delete" onClick={handleDelete}>
          {intl.get('tarzan.common.button.delete').d('删除')}
        </Button>
        <Button key="import" icon="import_export" onClick={handleImport}>
          {intl.get('tarzan.common.button.import').d('导入')}
        </Button>
        <Button key="refresh" icon="refresh" onClick={() => tableDs.query()}>
          {intl.get('tarzan.common.button.refresh').d('刷新')}
        </Button>
        <ExcelExport
          exportAsync={false}
          defaultSelectAll
          hiddenFillerType
          requestUrl={exportDemoData()}
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
          searchCode="LearningDemo_searchCode"
          customizedCode="LearningDemo_customizedCode"
        />
      </Content>
    </>
  );
};

export default formatterCollections(
  { code: [modelPrompt, 'tarzan.common'] },
)(observer(LearningDemo));
