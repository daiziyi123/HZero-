/*
 * @Author: Auto Generated
 * @Date: 2025-01-20
 * @Description: 车型维护数据模型
 */

import { getCurrentOrganizationId } from 'utils/utils';
import { DataSet } from 'choerodon-ui/pro';
import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { FieldType, DataSetSelection } from 'choerodon-ui/pro/lib/data-set/enum';
import intl from 'utils/intl';

const apiPrefix = '/bl-base';
const organizationId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.vehicleModelMaintenance';

const queryDataSet = new DataSet({
  autoQuery: false,
  autoCreate: true,
  fields: [
    {
      name: 'modelCodeLike',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.modelCodeLike`).d('车型编码'),
      multiple: ',',
    },
    {
      name: 'modelNameLike',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.modelNameLike`).d('车型名称'),
      multiple: ',',
    },
    {
      name: 'isEnable',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.enableFlag`).d('是否启用'),
      lookupCode: 'IIOT.IS_ENABLE_STATUS',
    },
  ],
  events:{
    update: ({ record, name, value }) => {
      if (name === 'modelCodeLike' || name === 'modelNameLike') {
        const flatList = value.flatMap((item) => {
          if (typeof item === 'string') {
            return item.trim().split(/\s+/);
          }
          return [];
        });
        record?.set(name, flatList);
      }
    },
  },
})

const tableDS: () => DataSetProps = () => ({
  autoQuery: true,
  autoCreate: false,
  selection: DataSetSelection.multiple,
  queryDataSet,
  fields: [
    {
      name: 'modelCode',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.modelCode`).d('车型编码'),
      required: true,
    },
    {
      name: 'modelName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.modelName`).d('车型名称'),
      required: true,
    },
    {
      name: 'isEnable',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.isEnable`).d('是否启用'),
      lookupCode: 'IIOT.IS_ENABLE_STATUS',
      required: true,
      defaultValue: '1',
    },
  ],
  transport: {
    read: () => ({
      url: `${apiPrefix}/v1/${organizationId}/mt-model`,
      method: 'GET',
    }),
  },
});

export { tableDS };
