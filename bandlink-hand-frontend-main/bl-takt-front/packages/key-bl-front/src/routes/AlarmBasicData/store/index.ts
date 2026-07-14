/*
 * @Author: Auto Generated
 * @Date: 2026-06-09
 * @Description: 报警基础数据 数据模型
 */

import { getCurrentOrganizationId } from 'utils/utils';
import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { FieldType, FieldIgnore, DataSetSelection } from 'choerodon-ui/pro/lib/data-set/enum';
import intl from 'utils/intl';

const apiPrefix = '/bl-base';
const organizationId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.alarmBasicData';

const tableDS: () => DataSetProps = () => ({
  autoQuery: true,
  autoCreate: false,
  selection: DataSetSelection.multiple,
  primaryKey: 'alarmId',
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
      name: 'deviceObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.deviceType`).d('设备类型'),
      lovCode: 'IIOT.MT_EQUIPMENT_DATA_VIEW',
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
      bind: 'deviceObj.deviceId',
    },
    {
      name: 'alarmCode',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.alarmCode`).d('报警编码'),
    },
    {
      name: 'alarmName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.alarmName`).d('报警描述'),
    },
    {
      name: 'alarmLevelList',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.alarmLevel`).d('报警等级'),
      lookupCode: 'IIOT.ALARM_LEVEL',
      multiple: true,
    },
    {
      name: 'categoryList',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.alarmCategory`).d('报警类型'),
      lookupCode: 'IIOT.ALARM_CATEGORY',
      multiple: true,
    },
  ],
  fields: [
    {
      name: 'alarmId',
      type: FieldType.string,
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
      type: FieldType.string,
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
      label: intl.get(`${modelPrompt}.prodLineName`).d('产线名称'),
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
      type: FieldType.string,
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
      label: intl.get(`${modelPrompt}.workcellName`).d('工位名称'),
    },
    {
      name: 'deviceObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.deviceCode`).d('设备编码'),
      lovCode: 'IIOT.MT_EQUIPMENT_DATA_VIEW',
      required: true,
      textField: 'equipmentCode',
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
      name: 'deviceId',
      type: FieldType.string,
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
      name: 'alarmPoint',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.alarmPoint`).d('报警点位'),
      required: true,
    },
    {
      name: 'description',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.description`).d('标签描述'),
    },
    {
      name: 'alarmCode',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.alarmCode`).d('报警编码/值'),
      required: true,
    },
    {
      name: 'alarmName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.alarmName`).d('报警描述'),
    },
    {
      name: 'alarmLevel',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.alarmLevel`).d('报警等级'),
      lookupCode: 'IIOT.ALARM_LEVEL',
      required: true,
    },
    {
      name: 'category',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.category`).d('报警类型'),
      lookupCode: 'IIOT.ALARM_CATEGORY',
      required: true,
    },
  ],
  transport: {
    read: () => ({
      url: `${apiPrefix}/v1/${organizationId}/alarm-type`,
      method: 'GET',
    }),
  },
});

export { tableDS };
