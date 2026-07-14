/**
 * @Description: 用户检验权限维护-DS
 * @Author: <yang.ni01@hand-china.com>
 * @Date: 2023-02-28 10:23:48
 * @LastEditTime: 2023-06-14 14:19:36
 * @LastEditors: <yang.ni01@hand-china.com>
 */

import intl from 'utils/intl';
import { FieldType, DataSetSelection, FieldIgnore } from 'choerodon-ui/pro/lib/data-set/enum';
import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { getCurrentOrganizationId } from 'utils/utils';

const modelPrompt = 'tarzan.userInspectPermission';
const tenantId = getCurrentOrganizationId();


// 列表-ds
const tableDS = (): DataSetProps => ({
  forceValidate: true,
  autoQuery: false,
  autoCreate: false,
  selection: DataSetSelection.multiple,
  cacheSelection: true,
  primaryKey: 'userInspectPermissionId',
  dataKey: 'rows.content',
  totalKey: 'rows.totalElements',
  modifiedCheck: false,
  transport: {
    read: ({ data }) => {
      const newData = {
        ...data,
      };
      if (data.siteIds) {
        newData.siteIds = [data.siteIds];
      }
      return {
        url: `${BASIC.TARZAN_SAMPLING}/v1/${tenantId}/mt-user-inspect-permission/page/ui`,
        data: newData,
        method: 'POST',
      };
    },
  },
  queryFields: [
    {
      name: 'userLov',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.userName`).d('员工账号'),
      lovCode: 'MT.USER.ORG',
      lovPara: { tenantId },
      ignore: FieldIgnore.always,
      textField: 'realName',
      valueField: 'id',
      multiple: true,
    },
    {
      name: 'userIds',
      bind: 'userLov.id',
    },
    {
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.site`).d('站点'),
      name: 'siteObject',
      ignore: FieldIgnore.always,
      lovCode: 'MT.MODEL.SITE',
      textField: 'siteName',
      lovPara: {
        tenantId,
        enableFlag: 'Y',
        siteType: 'MANUFACTURING',
      },
    },
    {
      name: 'siteIds',
      bind: 'siteObject.siteId',
    },
    {
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.permissionType`).d('权限类型'),
      name: 'permissionTypes',
      lookupCode: 'MT.QMS.PURVIEW_TYPE',
      lovPara: {
        tenantId,
      },
      multiple: true,
    },
    {
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.inspectBusinessType`).d('检验业务类型'),
      name: 'inspectBusinessTypeObject',
      ignore: FieldIgnore.always,
      lovCode: 'MT.QMS.INSPECT_BUS_TYPE_RULE',
      lovPara: {
        tenantId,
      },
      multiple: true,
    },
    {
      name: 'inspectBusinessTypes',
      bind: 'inspectBusinessTypeObject.inspectBusinessType',
    },
    {
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.inspectObjectType`).d('检验对象类型'),
      ignore: FieldIgnore.always,
      name: 'inspectObjectTypeObject',
      lookupCode: 'MT.QMS.USER_INSPECT_OBJECT_TYPE ',
      lovPara: {
        tenantId,
      },
    },
    {
      name: 'inspectObjectType',
      bind: 'inspectObjectTypeObject.value',
    },
    {
      name: 'inspectObjectTypeDesc',
      bind: 'inspectObjectTypeObject.meaning',
    },
    {
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.inspectSchemeObject`).d('检验对象'),
      name: 'inspectSchemeObject',
      ignore: FieldIgnore.always,
      multiple: true,
      dynamicProps: {
        lovCode: ({ record }) => {
          switch (record.get('inspectObjectType')) {
            case 'MATERIAL':
              return 'MT.MATERIAL';
            case 'MATERIAL_CATEGORY':
              return 'MT.METHOD.MATERIAL_CATEGORY';
            case 'WORKCELL':
              return 'MT.MODEL.WORKCELL';
            case 'PROCESS_WORKCELL':
              return 'MT.MODEL.WORKCELL';
            case 'PROD_LINE':
              return 'MT.MODEL.PRODLINE';
            case 'AREA':
              return 'MT.MODEL.AREA';
            default:
              return 'MT.MATERIAL';
          }
        },
        lovPara: ({ record }) => {
          switch (record.get('inspectObjectType')) {
            case 'MATERIAL':
              return {
                tenantId,
                siteId: record.get('siteIds'),
              };
            case 'MATERIAL_CATEGORY':
              return {
                tenantId,
                siteId: record.get('siteIds'),
              };
            case 'WORKCELL':
              return {
                tenantId,
                siteId: record.get('siteIds'),
                workcellType: 'STATION',
              };
            case 'PROCESS_WORKCELL':
              return {
                tenantId,
                siteId: record.get('siteIds'),
                workcellType: 'PROCESS',
              };
            case 'PROD_LINE':
              return {
                tenantId,
                siteId: record.get('siteIds'),
              };
            case 'AREA':
              return {
                tenantId,
                siteId: record.get('siteIds'),
              };
            default:
              return {
                tenantId,
                siteId: record.get('siteIds'),
              };
          }
        },
        disabled: ({ record }) => {
          return !record.get('inspectObjectType') || !record.get('siteIds');
        },
        textField: ({ record }) => {
          switch (record.get('inspectObjectType')) {
            case 'MATERIAL':
              return 'materialName';
            case 'MATERIAL_CATEGORY':
              return 'description';
            case 'WORKCELL':
              return 'workcellName';
            case 'PROCESS_WORKCELL':
              return 'workcellName';
            case 'PROD_LINE':
              return 'prodLineName';
            case 'AREA':
              return 'areaName';
            default:
              return 'materialName';
          }
        },
        valueField: ({ record }) => {
          switch (record.get('inspectObjectType')) {
            case 'MATERIAL':
              return 'materialId';
            case 'MATERIAL_CATEGORY':
              return 'materialCategoryId';
            case 'WORKCELL':
              return 'workcellId';
            case 'PROCESS_WORKCELL':
              return 'workcellId';
            case 'PROD_LINE':
              return 'prodLineId';
            case 'AREA':
              return 'areaId';
            default:
              return 'materialId';
          }
        },
      },
    },
    {
      name: 'inspectObjectIds',
      dynamicProps: {
        bind: ({ record }) => {
          switch (record.get('inspectObjectType')) {
            case 'MATERIAL':
              return 'inspectSchemeObject.materialId';
            case 'MATERIAL_CATEGORY':
              return 'inspectSchemeObject.materialCategoryId';
            case 'WORKCELL':
              return 'inspectSchemeObject.workcellId';
            case 'PROCESS_WORKCELL':
              return 'inspectSchemeObject.workcellId';
            case 'PROD_LINE':
              return 'inspectSchemeObject.prodLineId';
            case 'AREA':
              return 'inspectSchemeObject.areaId';
            default:
              return 'inspectSchemeObject.materialId';
          }
        },
      },
    },
    {
      name: 'inspectObjectCode',
      dynamicProps: {
        bind: ({ record }) => {
          switch (record.get('inspectObjectType')) {
            case 'MATERIAL':
              return 'inspectSchemeObject.materialCode';
            case 'MATERIAL_CATEGORY':
              return 'inspectSchemeObject.description';
            case 'WORKCELL':
              return 'inspectSchemeObject.workcellCode';
            case 'PROCESS_WORKCELL':
              return 'inspectSchemeObject.workcellCode';
            case 'PROD_LINE':
              return 'inspectSchemeObject.prodLineCode';
            case 'AREA':
              return 'inspectSchemeObject.areaCode';
            default:
              return 'inspectSchemeObject.materialCode';
          }
        },
      },
    },
    {
      name: 'inspectObjectName',
      dynamicProps: {
        bind: ({ record }) => {
          switch (record.get('inspectObjectType')) {
            case 'MATERIAL':
              return 'inspectSchemeObject.materialName';
            case 'MATERIAL_CATEGORY':
              return 'inspectSchemeObject.description';
            case 'WORKCELL':
              return 'inspectSchemeObject.workcellName';
            case 'PROCESS_WORKCELL':
              return 'inspectSchemeObject.workcellName';
            case 'PROD_LINE':
              return 'inspectSchemeObject.prodLineName';
            case 'AREA':
              return 'inspectSchemeObject.areaName';
            default:
              return 'inspectSchemeObject.materialName';
          }
        },
      },
    },
    {
      name: 'taskCategory',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.taskCategory`).d('任务类别'),
    },
    {
      name: 'inspectPermissionFlag',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.inspectPermissionFlag`).d('初检权限'),
      lovPara: { tenantId },
      lookupCode: 'MT.YES_NO',
      trueValue: 'Y',
      falseValue: 'N',
    },
    {
      name: 'reinspectPermissionFlag',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.reinspectPermissionFlag`).d('复检权限'),
      lovPara: { tenantId },
      lookupCode: 'MT.YES_NO',
      trueValue: 'Y',
      falseValue: 'N',
    },
  ],
  fields: [
    {
      name: 'userLov',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.userName`).d('员工账号'),
      lovCode: 'MT.USER.ORG',
      lovPara: { tenantId },
      required: true,
      textField: 'realName',
      valueField: 'id',
    },
    {
      name: 'userId',
      bind: 'userLov.id',
    },
    {
      name: 'userName',
      bind: 'userLov.realName',
    },
    {
      name: 'loginName',
      bind: 'userLov.loginName',
    },
    {
      name: 'userDesc',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.userDesc`).d('员工姓名'),
      bind: 'userLov.realName',
      disabled: true,
    },
    {
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.site`).d('站点'),
      name: 'siteObject',
      ignore: FieldIgnore.always,
      lovCode: 'MT.MODEL.ORGANIZATION',
      textField: 'organizationDesc',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => {
          return {
            tenantId,
            enableFlag: 'Y',
            siteType: 'MANUFACTURING',
            organizationType: 'SITE',
            userId: record.get('userId'),
          };
        },
        disabled: ({ record }) => {
          return !record.get('userLov');
        },
      },
    },
    {
      name: 'siteId',
      bind: 'siteObject.organizationId',
    },
    {
      name: 'siteName',
      bind: 'siteObject.organizationDesc',
    },
    {
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.permissionType`).d('权限类型'),
      name: 'permissionType',
      lookupCode: 'MT.QMS.PURVIEW_TYPE',
      lovPara: {
        tenantId,
      },
      required: true,
    },
    {
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.inspectBusinessType`).d('检验业务类型'),
      name: 'inspectBusinessTypeObject',
      ignore: FieldIgnore.always,
      lovCode: 'MT.QMS.INSPECT_BUS_TYPE_RULE',
      required: true,
      dynamicProps: {
        lovPara: ({ record }) => {
          return {
            tenantId,
            siteId: record.get('siteId'),
          };
        },
        disabled: ({ record }) => {
          return !record.get('siteId');
        },
      },
    },
    {
      name: 'inspectBusinessType',
      bind: 'inspectBusinessTypeObject.inspectBusinessType',
    },
    {
      name: 'inspectBusinessTypeDesc',
      bind: 'inspectBusinessTypeObject.inspectBusinessTypeDesc',
    },
    {
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.inspectObjectType`).d('检验对象类型'),
      ignore: FieldIgnore.always,
      name: 'inspectObjectTypeObject',
      lookupCode: 'MT.QMS.USER_INSPECT_OBJECT_TYPE ',
      lovPara: {
        tenantId,
      },
    },
    {
      name: 'inspectObjectType',
      bind: 'inspectObjectTypeObject.value',
    },
    {
      name: 'inspectObjectTypeDesc',
      bind: 'inspectObjectTypeObject.meaning',
    },
    {
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.inspectSchemeObject`).d('检验对象'),
      name: 'inspectSchemeObject',
      ignore: FieldIgnore.always,
      dynamicProps: {
        lovCode: ({ record }) => {
          switch (record.get('inspectObjectType')) {
            case 'MATERIAL':
              return 'MT.MATERIAL';
            case 'MATERIAL_CATEGORY':
              return 'MT.METHOD.MATERIAL_CATEGORY';
            case 'WORKCELL':
              return 'MT.MODEL.WORKCELL';
            case 'PROCESS_WORKCELL':
              return 'MT.MODEL.WORKCELL';
            case 'PROD_LINE':
              return 'MT.MODEL.PRODLINE';
            case 'AREA':
              return 'MT.MODEL.AREA';
            default:
              return 'MT.MATERIAL';
          }
        },
        lovPara: ({ record }) => {
          switch (record.get('inspectObjectType')) {
            case 'MATERIAL':
              return {
                tenantId,
                siteId: record.get('siteId'),
              };
            case 'MATERIAL_CATEGORY':
              return {
                tenantId,
                siteId: record.get('siteId'),
              };
            case 'WORKCELL':
              return {
                tenantId,
                siteId: record.get('siteId'),
                workcellType: 'STATION',
              };
            case 'PROCESS_WORKCELL':
              return {
                tenantId,
                siteId: record.get('siteId'),
                workcellType: 'PROCESS',
              };
            case 'PROD_LINE':
              return {
                tenantId,
                siteId: record.get('siteId'),
              };
            case 'AREA':
              return {
                tenantId,
                siteId: record.get('siteId'),
              };
            default:
              return {
                tenantId,
                siteId: record.get('siteId'),
              };
          }
        },
        disabled: ({ record }) => {
          return !record.get('inspectObjectType') || !record.get('siteId');
        },
        textField: ({ record }) => {
          switch (record.get('inspectObjectType')) {
            case 'MATERIAL':
              return 'materialName';
            case 'MATERIAL_CATEGORY':
              return 'description';
            case 'WORKCELL':
              return 'workcellName';
            case 'PROCESS_WORKCELL':
              return 'workcellName';
            case 'PROD_LINE':
              return 'prodLineName';
            case 'AREA':
              return 'areaName';
            default:
              return 'materialName';
          }
        },
        valueField: ({ record }) => {
          switch (record.get('inspectObjectType')) {
            case 'MATERIAL':
              return 'materialId';
            case 'MATERIAL_CATEGORY':
              return 'materialCategoryId';
            case 'WORKCELL':
              return 'workcellId';
            case 'PROCESS_WORKCELL':
              return 'workcellId';
            case 'PROD_LINE':
              return 'prodLineId';
            case 'AREA':
              return 'areaId';
            default:
              return 'materialId';
          }
        },
        required: ({ record }) => {
          return record.get('inspectObjectType');
        },
      },
    },
    {
      name: 'inspectObjectId',
      dynamicProps: {
        bind: ({ record }) => {
          switch (record.get('inspectObjectType')) {
            case 'MATERIAL':
              return 'inspectSchemeObject.materialId';
            case 'MATERIAL_CATEGORY':
              return 'inspectSchemeObject.materialCategoryId';
            case 'WORKCELL':
              return 'inspectSchemeObject.workcellId';
            case 'PROCESS_WORKCELL':
              return 'inspectSchemeObject.workcellId';
            case 'PROD_LINE':
              return 'inspectSchemeObject.prodLineId';
            case 'AREA':
              return 'inspectSchemeObject.areaId';
            default:
              return 'inspectSchemeObject.materialId';
          }
        },
      },
    },
    {
      name: 'inspectObjectCode',
      dynamicProps: {
        bind: ({ record }) => {
          switch (record.get('inspectObjectType')) {
            case 'MATERIAL':
              return 'inspectSchemeObject.materialCode';
            case 'MATERIAL_CATEGORY':
              return 'inspectSchemeObject.description';
            case 'WORKCELL':
              return 'inspectSchemeObject.workcellCode';
            case 'PROCESS_WORKCELL':
              return 'inspectSchemeObject.workcellCode';
            case 'PROD_LINE':
              return 'inspectSchemeObject.prodLineCode';
            case 'AREA':
              return 'inspectSchemeObject.areaCode';
            default:
              return 'inspectSchemeObject.materialCode';
          }
        },
      },
    },
    {
      name: 'inspectObjectName',
      dynamicProps: {
        bind: ({ record }) => {
          switch (record.get('inspectObjectType')) {
            case 'MATERIAL':
              return 'inspectSchemeObject.materialName';
            case 'MATERIAL_CATEGORY':
              return 'inspectSchemeObject.description';
            case 'WORKCELL':
              return 'inspectSchemeObject.workcellName';
            case 'PROCESS_WORKCELL':
              return 'inspectSchemeObject.workcellName';
            case 'PROD_LINE':
              return 'inspectSchemeObject.prodLineName';
            case 'AREA':
              return 'inspectSchemeObject.areaName';
            default:
              return 'inspectSchemeObject.materialName';
          }
        },
      },
    },
    {
      name: 'taskCategory',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.taskCategory`).d('任务类别'),
    },
    {
      name: 'inspectPermissionFlag',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.inspectPermissionFlag`).d('初检权限'),
      lovPara: { tenantId },
      lookupCode: 'MT.YES_NO',
      trueValue: 'Y',
      falseValue: 'N',
    },
    {
      name: 'reinspectPermissionFlag',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.reinspectPermissionFlag`).d('复检权限'),
      lovPara: { tenantId },
      lookupCode: 'MT.YES_NO',
      trueValue: 'Y',
      falseValue: 'N',
    },
  ],
});

const searchDS = (): DataSetProps => ({
  autoQuery: false,
  autoCreate: true,
  fields: [
    {
      name: 'userLov',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.userName`).d('员工账号'),
      lovCode: 'MT.USER.ORG',
      lovPara: { tenantId },
      disabled: true,
      textField: 'loginName',
    },
    {
      name: 'userId',
      bind: 'userLov.id',
    },
    {
      name: 'userName',
      bind: 'userLov.realName',
    },
    {
      name: 'loginName',
      bind: 'userLov.loginName',
    },
    {
      name: 'userDesc',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.userDesc`).d('员工姓名'),
      bind: 'userLov.realName',
      disabled: true,
    },
    {
      name: 'organizationType',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.drawerOrganizationType`).d('组织类型'),
      lookupCode: 'MT.MODEL.USER_ORGANIZATION_TYPE',
      textField: 'meaning',
      valueField: 'value',
      disabled: true,
    },
    {
      name: 'organizationLov',
      type: FieldType.object,
      lovCode: 'MT.MODEL.USER_ORG_LOCTOR',
      label: intl.get(`${modelPrompt}.calendarOrganizationId`).d('组织编码'),
      textField: 'organizationCode',
      valueField: 'organizationId',
      lovPara: {
        tenantId,
        organizationType: 'SITE',
      },
      computedProps: {
        disabled: ({ record }) => {
          return !record.get('organizationType');
        },
      },
    },
    {
      name: 'organizationId',
      bind: 'organizationLov.organizationId',
    },
    {
      name: 'organizationCode',
      bind: 'organizationLov.organizationCode',
    },
    {
      // 树展选中
      name: 'checkedKeys',
      type: FieldType.object,
      defaultValue: [],
    },
  ],
});

const orgTableDS = (): DataSetProps => ({
  autoQuery: false,
  autoCreate: false,
  selection: DataSetSelection.multiple,
  paging: false,
  fields: [
    {
      name: 'organizationId',
      type: FieldType.string,
    },
    {
      name: 'organizationCode',
      type: FieldType.string,
    },
    {
      name: 'defaultOrganizationFlag',
      type: FieldType.string,
    },
  ],
});

export { tableDS, searchDS, orgTableDS };
