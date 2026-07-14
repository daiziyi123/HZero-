/*
 * @Author: Auto Generated
 * @Date: 2025-06-04
 * @Description: 产线工位车型动作节拍关系维护数据模型
 */

import { getCurrentOrganizationId } from 'utils/utils';
import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { FieldType, FieldIgnore, DataSetSelection } from 'choerodon-ui/pro/lib/data-set/enum';
import intl from 'utils/intl';

const apiPrefix = '/bl-base';
const organizationId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.modelActionTakt';

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
      name: 'workcellObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.workcell`).d('工位'),
      lovCode: 'IIOT.MT_WORKCELL_DATA_VIEW',
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
      name: 'workcellIds',
      bind: 'workcellObj.workcellId',
    },
    {
      name: 'modelObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.model`).d('车型'),
      lovCode: 'IIOT.MT_MODEL_DATA_VIEW',
      lovPara: { tenantId: organizationId, isEnable: '1' },
      ignore: FieldIgnore.always,
      multiple: true,
    },
    {
      name: 'modelIds',
      bind: 'modelObj.modelId',
    },
    {
      name: 'deviceObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.device`).d('设备'),
      lovCode: 'IIOT.MT_EQUIPMENT_DATA_VIEW',
      ignore: FieldIgnore.always,
      multiple: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          tenantId: organizationId,
          prodLineIds: record?.get('prodLineIds'),
          workcellIds: record?.get('workcellIds'),
        }),
      },
    },
    {
      name: 'deviceIds',
      bind: 'deviceObj.deviceId',
    },
    {
      name: 'actionObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.action`).d('动作'),
      lovCode: 'IIOT.MT_ACTION_DATA_VIEW',
      ignore: FieldIgnore.always,
      multiple: true,
      dynamicProps: {
        lovPara: ({ record }) => ({
          tenantId: organizationId,
          isValid: '1',
          deviceList: record?.get('deviceIds'),
        }),
      },
    },
    {
      name: 'actionIds',
      bind: 'actionObj.actionId',
    },
    {
      name: 'actionPropertyList',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.actionProperty`).d('属性'),
      lookupCode: 'IIOT.ACTION_PROPERTY',
      multiple: true,
    },
    {
      name: 'actionTypeList',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.actionType`).d('动作类型'),
      lookupCode: 'IIOT.ACTION_TYPE',
      multiple: true,
    },
  ],
  fields: [
    {
      name: 'actionTaktId',
      type: FieldType.number,
    },
    {
      name: 'prodLineObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.prodLineCode`).d('产线编码'),
      lovCode: 'MT.MODEL.PRODLINE',
      lovPara: { tenantId: organizationId },
      required: true,
      textField: 'prodLineCode',
    },
    {
      name: 'prodLineId',
      type: FieldType.number,
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'prodLineCode',
      type: FieldType.string,
      bind: 'prodLineObj.prodLineCode',
    },
    {
      name: 'prodLineName',
      type: FieldType.string,
      bind: 'prodLineObj.prodLineName',
      label: intl.get(`${modelPrompt}.prodLineName`).d('产线描述'),
    },
    {
      name: 'workcellObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.workcellCode`).d('工位编码'),
      lovCode: 'IIOT.MT_WORKCELL_DATA_VIEW',
      required: true,
      textField: 'workcellCode',
      dynamicProps: ({ record }) => {
        const prodLineId = record?.get('prodLineId');
        return {
          lovPara: {
            tenantId: organizationId,
            prodLineIds: [prodLineId],
          },
          disabled: !prodLineId,
        };
      },
    },
    {
      name: 'workcellId',
      type: FieldType.number,
      bind: 'workcellObj.workcellId',
    },
    {
      name: 'workcellCode',
      type: FieldType.string,
      bind: 'workcellObj.workcellCode',
    },
    {
      name: 'workcellName',
      type: FieldType.string,
      bind: 'workcellObj.workcellName',
      label: intl.get(`${modelPrompt}.workcellName`).d('工位描述'),
    },
    {
      name: 'modelObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.modelCode`).d('车型编码'),
      lovCode: 'IIOT.MT_MODEL_DATA_VIEW',
      lovPara: { tenantId: organizationId, isEnable: '1' },
      required: true,
      textField: 'modelCode',
    },
    {
      name: 'modelId',
      type: FieldType.number,
      bind: 'modelObj.modelId',
    },
    {
      name: 'modelCode',
      type: FieldType.string,
      bind: 'modelObj.modelCode',
    },
    {
      name: 'modelName',
      type: FieldType.string,
      bind: 'modelObj.modelName',
      label: intl.get(`${modelPrompt}.modelName`).d('车型名称'),
    },
    {
      name: 'deviceObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.deviceCode`).d('设备编码'),
      lovCode: 'IIOT.MT_EQUIPMENT_DATA_VIEW',
      required: true,
      textField: 'equipmentCode',
      dynamicProps: {
        lovPara: ({ record }) => ({
          tenantId: organizationId,
          prodLineIds: [record?.get('prodLineId')],
          workcellIds: [record?.get('workcellId')],
        }),
        disabled: ({ record }) => !record?.get('prodLineId') || !record?.get('workcellId'),
      },
    },
    {
      name: 'deviceId',
      type: FieldType.number,
      bind: 'deviceObj.deviceId',
    },
    {
      name: 'equipmentCode',
      type: FieldType.string,
      bind: 'deviceObj.equipmentCode',
    },
    {
      name: 'equipmentName',
      type: FieldType.string,
      bind: 'deviceObj.equipmentName',
      label: intl.get(`${modelPrompt}.equipmentName`).d('设备名称'),
    },
    {
      name: 'actionObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.actionCode`).d('动作编码'),
      lovCode: 'IIOT.MT_ACTION_DATA_VIEW',
      required: true,
      textField: 'actionCode',
      dynamicProps: {
        lovPara: ({ record }) => ({
          tenantId: organizationId,
          isValid: '1',
          deviceList: [record?.get('deviceId')],
        }),
      },
    },
    {
      name: 'actionId',
      type: FieldType.number,
      bind: 'actionObj.actionId',
    },
    {
      name: 'actionCode',
      type: FieldType.string,
      bind: 'actionObj.actionCode',
    },
    {
      name: 'actionName',
      type: FieldType.string,
      bind: 'actionObj.actionName',
      label: intl.get(`${modelPrompt}.actionName`).d('动作描述'),
    },
    {
      name: 'actionSequence',
      type: FieldType.number,
      label: intl.get(`${modelPrompt}.actionSequence`).d('动作顺序'),
      required: true,
      min: 1,
      step: 1,
    },
    {
      name: 'actionStep',
      type: FieldType.number,
      label: intl.get(`${modelPrompt}.actionStep`).d('动作步'),
      min: 1,
      step: 1,
    },
    {
      name: 'standardTakt',
      type: FieldType.number,
      label: intl.get(`${modelPrompt}.standardTakt`).d('标准节拍'),
      required: true,
      min: 0,
      precision: 2,
    },
    {
      name: 'taktLimitRange',
      type: FieldType.number,
      label: intl.get(`${modelPrompt}.taktLimitRange`).d('节拍上下限'),
      required: true,
      min: 0,
      precision: 2,
    },
    {
      name: 'actionProperty',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.actionProperty`).d('属性'),
      lookupCode: 'IIOT.ACTION_PROPERTY',
    },
    {
      name: 'actionType',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.actionType`).d('动作类型'),
      lookupCode: 'IIOT.ACTION_TYPE',
    },
  ],
  transport: {
    read: () => ({
      url: `${apiPrefix}/v1/${organizationId}/model-action-takt`,
      method: 'GET',
    }),
  },
});

export { tableDS };
