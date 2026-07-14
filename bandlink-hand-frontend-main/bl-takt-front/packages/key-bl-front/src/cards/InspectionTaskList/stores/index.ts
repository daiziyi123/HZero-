import intl from 'utils/intl';
import { FieldIgnore, FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { getCurrentOrganizationId } from 'utils/utils';
import { BASIC } from '@utils/config';

const modelPrompt = 'tarzan.qms.inspectionPlatform';
const tenantId = getCurrentOrganizationId();
const endUrl = ``;

// 主界面列表DS
const QueryDS: () => DataSetProps = () => ({
  autoQuery: false,
  autoCreate: false,
  paging: false,
  fields: [
    {
      name: 'inspectTaskCode',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.inspectTaskCode`).d('检验任务编码'),
    },
    {
      name: 'siteObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.siteCode`).d('站点'),
      lovCode: 'MT.MODEL.SITE',
      textField: 'siteName',
      ignore: FieldIgnore.always,
      lovPara: {
        tenantId,
        siteType: 'MANUFACTURING',
        enableFlag: 'Y',
      },
    },
    {
      name: 'siteId',
      type: FieldType.string,
      bind: 'siteObj.siteId',
    },
    {
      name: 'inspectBusinessTypeObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.inspectBusinessType`).d('检验业务类型'),
      lovCode: 'MT.QMS.INSPECT_BUS_TYPE_RULE',
      ignore: FieldIgnore.always,
      // lovPara: {
      //   tenantId,
      // },
      computedProps: {
        disabled: ({ record }) => {
          return !record.get('siteId');
        },
        lovPara: ({ record }) => {
          return {
            tenantId,
            siteId: record.get('siteId'),
          };
        },
      },
    },
    {
      name: 'inspectBusinessType',
      type: FieldType.string,
      bind: 'inspectBusinessTypeObj.inspectBusinessType',
    },
    {
      name: 'inspectTaskStatus',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.inspectTaskStatus`).d('检验任务状态'),
      lookupUrl: `${BASIC.TARZAN_COMMON}/v1/${tenantId}/mt-gen-status/combo-box/ui?statusGroup=INSPECT_TASK_STATUS`,
      noCache: true,
      valueField: 'statusCode',
      textField: 'description',
      lookupAxiosConfig: {
        transformResponse(data) {
          if (Array.isArray(data)) {
            return data;
          }
          const { rows } = JSON.parse(data);
          return rows;
        },
      },
    },
    {
      name: 'reviewStatus',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.reviewStatus`).d('审核状态'),
      lovPara: { tenantId },
      lookupCode: 'MT.QMS.REVIEW_STATUS',
      textField: 'meaning',
      valueField: 'value',
    },
    {
      name: 'inspectDocObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.sourceInspectDocNum`).d('所属检验单'),
      lovCode: 'MT.QMS.INSPECT_DOC',
      ignore: FieldIgnore.always,
      lovPara: {
        tenantId,
      },
    },
    {
      name: 'inspectDocId',
      type: FieldType.string,
      bind: 'inspectDocObj.inspectDocId',
    },
    {
      name: 'inspectorObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.inspectorName`).d('检验员'),
      lovCode: 'HIAM.USER.ORG',
      ignore: FieldIgnore.always,
      lovPara: {
        tenantId,
      },
    },
    {
      name: 'inspectorId',
      type: FieldType.string,
      bind: 'inspectorObj.id',
    },
    {
      name: 'sourceObjectType',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.`).d('来源单据类型'),
      lookupCode: 'MT.SOURCE_OBJECT_TYPE',
    },
    {
      name: 'sourceObjectCode',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.`).d('来源单据编码'),
    },
    {
      name: 'materialObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.materialName`).d('物料'),
      lovCode: 'MT.MATERIAL',
      ignore: FieldIgnore.always,
      dynamicProps: {
        lovPara: ({ record }) => ({
          tenantId,
          siteId: record?.get('siteId'),
        }),
      },
      multiple: true,
    },
    {
      name: 'materialIds',
      type: FieldType.string,
      bind: 'materialObj.materialId',
    },
    {
      name: 'revisionCode',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.materialVersion`).d('物料版本'),
    },
    {
      name: 'supplierObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.supplierName`).d('供应商'),
      lovCode: 'MT.MODEL.SUPPLIER',
      ignore: FieldIgnore.always,
      lovPara: {
        tenantId,
      },
      multiple: true,
    },
    {
      name: 'supplierIds',
      type: FieldType.string,
      bind: 'supplierObj.supplierId',
    },
    {
      name: 'customerObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.customerName`).d('客户'),
      lovCode: 'MT.MODEL.CUSTOMER',
      ignore: FieldIgnore.always,
      lovPara: {
        tenantId,
      },
      multiple: true,
    },
    {
      name: 'customerIds',
      type: FieldType.string,
      bind: 'customerObj.customerId',
    },
    {
      name: 'areaObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.areaName`).d('区域'),
      lovCode: 'MT.MODEL.AREA',
      ignore: FieldIgnore.always,
      dynamicProps: {
        lovPara: ({ record }) => ({
          tenantId,
          siteId: record?.get('siteId'),
        }),
      },
      multiple: true,
    },
    {
      name: 'areaIds',
      type: FieldType.string,
      bind: 'areaObj.areaId',
    },
    {
      name: 'prodLineObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.prodLineName`).d('产线'),
      lovCode: 'MT.MODEL.PRODLINE',
      ignore: FieldIgnore.always,
      dynamicProps: {
        lovPara: ({ record }) => ({
          tenantId,
          siteId: record?.get('siteId'),
        }),
      },
      multiple: true,
    },
    {
      name: 'prodLineIds',
      type: FieldType.string,
      bind: 'prodLineObj.prodLineId',
    },
    {
      name: 'operationObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.operationName`).d('工艺'),
      lovCode: 'MT.METHOD.OPERATION',
      ignore: FieldIgnore.always,
      lovPara: {
        tenantId,
      },
      multiple: true,
    },
    {
      name: 'operationIds',
      type: FieldType.string,
      bind: 'operationObj.operationId',
    },
    {
      name: 'processWorkcellObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.processWorkcellName`).d('工序'),
      lovCode: 'MT.MODEL.WORKCELL',
      ignore: FieldIgnore.always,
      dynamicProps: {
        lovPara: ({ record }) => ({
          tenantId,
          workcellType: 'PROCESS',
          siteId: record?.get('siteId'),
        }),
      },
      multiple: true,
    },
    {
      name: 'processWorkcellIds',
      type: FieldType.string,
      bind: 'processWorkcellObj.workcellId',
    },
    {
      name: 'stationWorkcellObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.stationWorkcellName`).d('工位'),
      lovCode: 'MT.MODEL.WORKCELL',
      ignore: FieldIgnore.always,
      dynamicProps: {
        lovPara: ({ record }) => ({
          tenantId,
          workcellType: 'STATION',
          siteId: record?.get('siteId'),
        }),
      },
      multiple: true,
    },
    {
      name: 'stationWorkcellIds',
      type: FieldType.string,
      bind: 'stationWorkcellObj.workcellId',
    },
    {
      name: 'equipmentObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.equipment`).d('设备'),
      lovCode: 'MT.MODEL.EQUIPMENT',
      ignore: FieldIgnore.always,
      lovPara: {
        tenantId,
      },
      multiple: true,
    },
    {
      name: 'equipmentIds',
      type: FieldType.string,
      bind: 'equipmentObj.equipmentId',
    },
    {
      name: 'locatorObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.locatorName`).d('库位'),
      lovCode: 'MT.MODEL.LOCATOR',
      ignore: FieldIgnore.always,
      lovPara: {
        tenantId,
      },
      multiple: true,
    },
    {
      name: 'locatorIds',
      type: FieldType.string,
      bind: 'locatorObj.locatorId',
    },
    {
      name: 'materialLotObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.materialLotCode`).d('物料批'),
      lovCode: 'MT.MATERIAL_LOT',
      ignore: FieldIgnore.always,
      lovPara: {
        tenantId,
      },
      multiple: true,
    },
    {
      name: 'materialLotIds',
      type: FieldType.string,
      bind: 'materialLotObj.materialLotId',
      ignore: FieldIgnore.always,
    },
    {
      name: 'materialLotCodes',
      type: FieldType.string,
      bind: 'materialLotObj.materialLotCode',
    },
    {
      name: 'lotIdentification',
      type: FieldType.string,
      bind: 'materialLotObj.identification',
    },
    {
      name: 'executeJobObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.executeJobCode`).d('执行作业'),
      lovCode: ' MT.EO',
      ignore: FieldIgnore.always,
      lovPara: {
        tenantId,
      },
      multiple: true,
    },
    {
      name: 'eoIds',
      type: FieldType.string,
      bind: 'executeJobObj.eoId',
      ignore: FieldIgnore.always,
    },
    {
      name: 'eoCodes',
      type: FieldType.string,
      bind: 'executeJobObj.eoNum',
    },
    {
      name: 'eoIdentification',
      type: FieldType.string,
      bind: 'executeJobObj.identification',
    },
    {
      name: 'workOrderObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.woNumber`).d('工单'),
      lovCode: 'MT.WORK_ORDER_NUM',
      ignore: FieldIgnore.always,
      lovPara: {
        tenantId,
      },
      multiple: true,
    },
    {
      name: 'woIds',
      type: FieldType.string,
      bind: 'workOrderObj.workOrderId',
      ignore: FieldIgnore.always,
    },
    {
      name: 'woNumbers',
      type: FieldType.string,
      bind: 'workOrderObj.workOrderNum',
    },
    {
      name: 'sourceTaskObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.sourceTaskCode`).d('来源检验任务'),
      lovCode: 'MT.QMS.INSPECT_TASK',
      ignore: FieldIgnore.always,
      lovPara: {
        tenantId,
      },
      multiple: true,
    },
    {
      name: 'sourceTaskIds',
      type: FieldType.string,
      bind: 'sourceTaskObj.inspectTaskId',
    },
    {
      name: 'outsourceSupplierObj',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.outsourceSupplierName`).d('委外供应商'),
      lovCode: 'MT.MODEL.SUPPLIER',
      ignore: FieldIgnore.always,
      lovPara: {
        tenantId,
      },
      multiple: true,
    },
    {
      name: 'outsourceSupplierIds',
      type: FieldType.string,
      bind: 'outsourceSupplierObj.supplierId',
    },
    {
      name: 'creationDateFrom',
      type: FieldType.dateTime,
      label: intl.get(`${modelPrompt}.creationDateFrom`).d('创建时间从'),
      max: 'creationDateTo',
    },
    {
      name: 'creationDateTo',
      type: FieldType.dateTime,
      label: intl.get(`${modelPrompt}.creationDateTo`).d('创建时间至'),
      min: 'creationDateFrom',
    },
    {
      name: 'actualStartTime',
      type: FieldType.dateTime,
      label: intl.get(`${modelPrompt}.actualTimeFrom`).d('实际时间从'),
      max: 'actualEndTime',
    },
    {
      name: 'actualEndTime',
      type: FieldType.dateTime,
      label: intl.get(`${modelPrompt}.actualTimeTo`).d('实际时间至'),
      min: 'actualStartTime',
    },
    {
      name: 'inspectResult',
      type: FieldType.string,
      lookupCode: 'MT.QMS.INSPECT_RESULT',
      label: intl.get(`${modelPrompt}.inspectResult`).d('检验结果'),
    },
  ],
});

// 主界面列表DS
const TableDS: () => DataSetProps = () => ({
  autoQuery: false,
  autoCreate: false,
  selection: false,
  dataKey: 'rows.content',
  totalKey: 'rows.totalElements',
  primaryKey: 'inspectTaskId',
  fields: [
    {
      name: 'inspectTaskCode',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.inspectTaskCode`).d('检验任务编码'),
    },
    {
      name: 'siteCode',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.siteCode`).d('站点'),
    },
    {
      name: 'inspectBusinessTypeDesc',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.inspectBusinessType`).d('检验业务类型'),
    },
    {
      name: 'inspectTaskStatusDesc',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.inspectTaskStatus`).d('检验任务状态'),
    },
    {
      name: 'reviewStatusMeaning',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.reviewStatus`).d('审核状态'),
    },
    {
      name: 'urgentFlag',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.urgentFlag`).d('加急标识'),
      lookupCode: 'MT.YES_NO',
    },
    {
      name: 'materialCode',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
    },
    {
      name: 'materialName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.materialName`).d('物料'),
    },
    {
      name: 'revisionCode',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.materialVersion`).d('物料版本'),
    },
    {
      name: 'inspectSumQty',
      type: FieldType.number,
      label: intl.get(`${modelPrompt}.inspectQty`).d('报检数量'),
    },
    {
      name: 'uomName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.uomName`).d('单位'),
    },
    {
      name: 'woNumber',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.woNumber`).d('工单'),
    },
    {
      name: 'supplierName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.supplierName`).d('供应商'),
    },
    {
      name: 'customerName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.customerName`).d('客户'),
    },
    {
      name: 'areaName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.areaName`).d('区域'),
    },
    {
      name: 'prodLineName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.prodLineName`).d('产线'),
    },
    {
      name: 'operationName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.operationName`).d('工艺'),
    },
    {
      name: 'processWorkcellName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.processWorkcellName`).d('工序'),
    },
    {
      name: 'stationWorkcellName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.stationWorkcellName`).d('工位'),
    },
    {
      name: 'equipmentCode',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.equipment`).d('设备'),
    },
    {
      name: 'locatorName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.locatorName`).d('库位'),
    },
    {
      name: 'inspectDocNum',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.sourceInspectDocNum`).d('所属检验单'),
    },
    {
      name: 'inspectResultDesc',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.inspectResult`).d('检验结果'),
    },
    {
      name: 'okQty',
      type: FieldType.number,
      label: intl.get(`${modelPrompt}.okQty`).d('合格品数'),
    },
    {
      name: 'ngQty',
      type: FieldType.number,
      label: intl.get(`${modelPrompt}.ngQty`).d('不合格品数'),
    },
    {
      name: 'scrapQty',
      type: FieldType.number,
      label: intl.get(`${modelPrompt}.scrapQty`).d('报废数'),
    },
    {
      name: 'inspectorName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.inspectorName`).d('检验员'),
    },
    {
      name: 'sourceTaskCode',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.sourceTaskCode`).d('来源检验任务'),
    },
    {
      name: 'taskCategory',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.taskCategory`).d('任务类别'),
    },
    {
      name: 'sourceObjectTypeDesc',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.sourceObjectType`).d('来源单据类型'),
    },
    {
      name: 'sourceObjectCode',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.sourceObjectCode`).d('来源单据编码'),
    },
    {
      name: 'sourceObjectLineCode',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.sourceObjectLineCode`).d('来源单据行号'),
    },
    {
      name: 'inspectInfoUserName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.inspectInfoUser`).d('报检人'),
    },
    {
      name: 'inspectInfoCreationDate',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.inspectInfoCreationDate`).d('报检时间'),
    },
    {
      name: 'shiftTeamCode',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.shiftTeamCode`).d('班组'),
    },
    {
      name: 'shiftDate',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.shiftDate`).d('班次日期'),
    },
    {
      name: 'shiftCode',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.shiftCode`).d('班次编码'),
    },
    {
      name: 'outsourceSupplierName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.outsourceSupplierName`).d('委外供应商'),
    },
    {
      name: 'actualStartTime',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.actualStartTime`).d('实际开始时间'),
    },
    {
      name: 'actualEndTime',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.actualEndTime`).d('实际结束时间'),
    },
    {
      name: 'creationDate',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.creationDate`).d('创建时间'),
    },
    {
      name: 'remark',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.remark`).d('备注'),
    },
  ],
  transport: {
    read: () => {
      return {
        url: `${BASIC.TARZAN_SAMPLING}${endUrl}/v1/${tenantId}/mt-inspect-task/list/ui`,
        method: 'GET',
      };
    },
  },
});

export { TableDS, QueryDS };
