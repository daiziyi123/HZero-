/*
 * @Author: Auto Generated
 * @Date: 2025-06-04
 * @Description: 产线车型工位节拍关系维护数据模型
 */

import { getCurrentOrganizationId } from 'utils/utils';
import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { FieldType, FieldIgnore, DataSetSelection } from 'choerodon-ui/pro/lib/data-set/enum';
import intl from 'utils/intl';

const apiPrefix = '/bl-base';
const organizationId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.modelWorkcellTakt';

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
      lovPara: { tenantId: organizationId },
      ignore: FieldIgnore.always,
      multiple: true,
      dynamicProps: ({ record }) => {
        return {
          lovPara: {
            tenantId: organizationId,
            prodLineIds: record?.get('prodLineIds'),
          },
        };
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
      name: 'standardTakt',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.standardTakt`).d('标准节拍'),
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
      type: FieldType.number,
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'prodLineCode',
      type: FieldType.string,
      bind: 'prodLineObj.prodLineCode',
      label: intl.get(`${modelPrompt}.prodLineCode`).d('产线编码'),
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
      label: intl.get(`${modelPrompt}.workcell`).d('工位'),
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
      label: intl.get(`${modelPrompt}.workcellCode`).d('工位编码'),
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
      label: intl.get(`${modelPrompt}.model`).d('车型'),
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
      label: intl.get(`${modelPrompt}.modelCode`).d('车型编码'),
    },
    {
      name: 'modelName',
      type: FieldType.string,
      bind: 'modelObj.modelName',
      label: intl.get(`${modelPrompt}.modelName`).d('车型名称'),
    },
    {
      name: 'standardTakt',
      type: FieldType.number,
      label: intl.get(`${modelPrompt}.standardTakt`).d('标准节拍(min)'),
      required: true,
      min: 0,
      precision: 2,
    },
    {
      name: 'taktLimitRange',
      type: FieldType.number,
      label: intl.get(`${modelPrompt}.taktLimitRange`).d('节拍上下限(min)'),
      required: true,
      min: 0,
      precision: 2,
    },
  ],
  transport: {
    read: () => ({
      url: `${apiPrefix}/v1/${organizationId}/model-workcell-takt`,
      method: 'GET',
    }),
  },
});

export { tableDS };
