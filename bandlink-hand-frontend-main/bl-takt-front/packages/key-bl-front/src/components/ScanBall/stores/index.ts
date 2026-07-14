import intl from 'utils/intl';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { getCurrentOrganizationId } from 'utils/utils';
import { BASIC } from '@utils/config';

const modelPrompt = 'tarzan.qms.inspectionPlatform';
const tenantId = getCurrentOrganizationId();

const controlDS: () => DataSetProps = () => ({
  autoQuery: false,
  autoCreate: false,
  selection: false,
  paging: false,
  fields: [
    {
      name: 'scanEnter',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.scanEnter`).d('扫描完直接跳转至检验平台'),
      trueValue: 'Y',
      falseValue: 'N',
      defaultValue: 'Y',
    },
    {
      name: 'barcode',
      type: FieldType.string,
      placeholder: intl
        .get(`${modelPrompt}.barcode`)
        .d('请输入或扫描实物标签进入检验任务(单据号/物料批/EO/容器/物料/批次)'),
    },
  ],
});
const needLoadDataTableDS: () => DataSetProps = () => ({
  autoQuery: false,
  autoCreate: false,
  selection: false,
  paging: false,
  fields: [
    {
      name: 'sequence',
      label: intl.get(`${modelPrompt}.sequence`).d('序号'),
      type: FieldType.string,
    },
    {
      name: 'inspectTaskCode',
      label: intl.get(`${modelPrompt}.inspectTaskCode`).d('检验任务编码'),
      type: FieldType.string,
    },
    {
      name: 'inspectBusinessType',
      label: intl.get(`${modelPrompt}.inspectBusinessType`).d('检验业务类型'),
      type: FieldType.string,
    },
    {
      name: 'materialCode',
      label: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
      type: FieldType.string,
    },
    {
      name: 'materialDesc',
      label: intl.get(`${modelPrompt}.materialDesc`).d('物料描述'),
      type: FieldType.string,
    },
    {
      name: 'inspectTaskStatus',
      label: intl.get(`${modelPrompt}.inspectTaskStatus`).d('状态'),
      type: FieldType.string,
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
      name: 'inspectInfoCreationDate',
      label: intl.get(`${modelPrompt}.inspectInfoCreationDate`).d('报检时间'),
      type: FieldType.string,
    },
  ],
});

export { controlDS, needLoadDataTableDS };
