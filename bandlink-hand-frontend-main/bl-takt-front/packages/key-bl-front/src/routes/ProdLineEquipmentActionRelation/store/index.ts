/*
 * @Author: Auto Generated
 * @Date: 2025-01-20
 * @Description: 产线设备动作关系维护数据模型
 */

import { getCurrentOrganizationId } from 'utils/utils';
import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { FieldType, FieldIgnore, DataSetSelection } from 'choerodon-ui/pro/lib/data-set/enum';
import intl from 'utils/intl';

const apiPrefix = '/bl-base';
const organizationId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.prodLineEquipmentActionRelation';

const tableDS: () => DataSetProps = () => ({
  autoQuery: true,
  autoCreate: false,
  selection: DataSetSelection.multiple,
  queryFields: [
    {
      name: 'prodLineObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.prodLine`).d('产线'),
      lovCode: 'MT.MODEL.PRODLINE',
      lovPara: { tenantId: organizationId },
      ignore: FieldIgnore.always,
      multiple: true,
    },
    {
      name: 'prodLineIds',
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'thingObj',
      type: FieldType.object,
      lovCode: 'IIOT.MT_EQUIPMENT_DATA_VIEW',
      label: intl.get(`${modelPrompt}.thing`).d('设备'),
      ignore: FieldIgnore.always,
      multiple: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          tenantId: organizationId,
          prodLineIds: record?.get('prodLineIds'),
        }),
      },
    },
    {
      name: 'deviceIds',
      bind: 'thingObj.deviceId',
    },
    {
      name: 'actionCode',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.actionCode`).d('动作编码'),
    },
    {
      name: 'actionName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.actionName`).d('动作描述'),
    },
  ],
  fields: [
    {
      name: 'prodLineObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.prodLine`).d('产线'),
      lovCode: 'MT.MODEL.PRODLINE',
      lovPara: { tenantId: organizationId },
      required: true,
      textField: 'prodLineCode',
    },
    {
      name: 'prodLineId',
      type: FieldType.string,
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'prodLineCode',
      type: FieldType.string,
      bind: 'prodLineObj.prodLineCode',
      label: intl.get(`${modelPrompt}.prodLineCode`).d('产线编码'),
      disabled: true,
    },
    {
      name: 'prodLineName',
      type: FieldType.string,
      bind: 'prodLineObj.prodLineName',
      label: intl.get(`${modelPrompt}.prodLineName`).d('产线名称'),
      disabled: true,
    },
    {
      name: 'thingObj',
      type: FieldType.object,
      lovCode: 'IIOT.MT_EQUIPMENT_DATA_VIEW',
      label: intl.get(`${modelPrompt}.thing`).d('设备'),
      required: true,
      textField: 'equipmentCode',
      ignore: FieldIgnore.always,
      dynamicProps: {
        lovPara: ({ record }) => ({
          tenantId: organizationId,
          prodLineIds: [record?.get('prodLineId')],
        }),
        disabled: ({ record }) => !record?.get('prodLineId'),
      },
    },
    {
      name: 'equipmentCode',
      type: FieldType.string,
      bind: 'thingObj.equipmentCode',
      label: intl.get(`${modelPrompt}.deviceCode`).d('设备编码'),
      disabled: true,
    },
    {
      name: 'deviceId',
      bind: 'thingObj.deviceId',
    },
    {
      name: 'equipmentName',
      type: FieldType.string,
      bind: 'thingObj.equipmentName',
      label: intl.get(`${modelPrompt}.equipmentName`).d('设备名称'),
      disabled: true,
    },
    {
      name: 'actionCode',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.actionCode`).d('动作编码'),
      required: true,
    },
    {
      name: 'actionName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.actionName`).d('动作描述'),
      required: true,
    },
    {
      name: 'isValid',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.isValid`).d('是否有效'),
      lookupCode: 'IIOT.IS_VALID_STATUS',
      required: true,
      defaultValue: '1',
    },
  ],
  transport: {
    read: () => ({
      url: `${apiPrefix}/v1/${organizationId}/mt-action`,
      method: 'GET',
    }),
  },
});

export { tableDS };
