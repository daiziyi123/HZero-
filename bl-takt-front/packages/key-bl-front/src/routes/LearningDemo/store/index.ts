/**
 * @Description: 学习示例页面 - DataSet 配置
 * @Author: Assistant
 * @Date: 2026-06-10
 * 
 * 本文件定义：
 * 1. 表格的 DataSet 配置（tableDS）
 * 2. 弹框的 DataSet 配置（modalDS）
 */

import { getCurrentOrganizationId } from 'utils/utils';
import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { FieldType, FieldIgnore, DataSetSelection } from 'choerodon-ui/pro/lib/data-set/enum';
import intl from 'utils/intl';

// const apiPrefix = '/bl-demo-wxs';
const apiPrefix = '/dev-health-manager-yh';
const organizationId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.learningDemo';

/**
 * 表格 DataSet 配置
 * 用于管理表格数据和查询条件
 */
export function tableDS(): DataSetProps {
  return {
    autoQuery: true,
    autoCreate: false,
    selection: DataSetSelection.multiple,
    primaryKey: 'id',
    queryFields: [
      {
        name: 'name',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.name`).d('名称'),
        fuzzy: true,
      },
    ],
    fields: [
      {
        name: 'id',
        type: FieldType.number,
        label: intl.get(`${modelPrompt}.id`).d('ID'),
      },
      {
        name: 'name',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.name`).d('名称'),
        required: true,
        maxLength: 100,
      },
      {
        name: '_token',
        type: FieldType.string,
      },
    ],
    transport: {
      read: () => ({
        // url: `${apiPrefix}/v1/${organizationId}/bl-tests`,
        url: `${apiPrefix}/v1/${organizationId}/bl-tests`,
        method: 'GET',
      }),
    },
    pageSize: 20,
    paging: 'normal',
  };
}

/**
 * 弹框 DataSet 配置
 * 用于管理弹框中的表单数据
 */
export function modalDS(): DataSetProps {
  return {
    autoCreate: false,
    fields: [
      {
        name: 'name',
        type: FieldType.string,
        label: intl.get(`${modelPrompt}.name`).d('名称'),
        required: true,
        maxLength: 100,
      },
    ],
  };
}
