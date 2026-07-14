/*
 * @Description: 机器人基础数据维护数据模型
 */

import { getCurrentOrganizationId } from 'utils/utils';
import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { FieldType, FieldIgnore, DataSetSelection } from 'choerodon-ui/pro/lib/data-set/enum';
import intl from 'utils/intl';

const apiPrefix = '/dev-health-manager-yh';
const organizationId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.robotBasicData';

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
      name: 'equipmentName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.equipmentName`).d('设备名称'),
    },
  ],
  fields: [
    {
      name: 'id',
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
      name: 'robotModel',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.robotModel`).d('机器人型号'),
    },
    {
      name: 'robotName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.robotName`).d('机器人名称'),
    },
    {
      name: 'currentWorkcell',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.currentWorkcell`).d('当前工位'),
    },
    {
      name: 'runTime',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.runTime`).d('运行时间'),
    },
  ],
  transport: {
    read: () => ({
      url: `${apiPrefix}/v1/${organizationId}/robot-basic-data`,
      method: 'GET',
    }),
  },
});

export { tableDS };