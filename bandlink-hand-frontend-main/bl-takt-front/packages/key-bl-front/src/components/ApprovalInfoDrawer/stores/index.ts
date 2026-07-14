/**
 * @Description: 审批信息查看DS
 * @Author: LI.YANG04@HAND-CHINA.COM
 * @Date: 2023/7/21 15:33
 */
import intl from 'utils/intl';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { getCurrentOrganizationId } from 'utils/utils';
import { BASIC } from '@utils/config';

const modelPrompt = 'tarzan.common.approvalInfoDrawer';
const tenantId = getCurrentOrganizationId();

const tableDS: () => DataSetProps = () => ({
  autoQuery: false,
  autoCreate: false,
  selection: false,
  dataKey: 'content',
  totalKey: 'totalElements',
  primaryKey: 'requestId',
  fields: [
    {
      name: 'requestId',
    },
    {
      name: 'objectType',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.objectType`).d('审批类型'),
      lovCode: 'HQM_QIS.OA_APPROVAL_TYPE',
      lovPara: { tenantId },
      textField: 'meaning',
      valueField: 'value',
    },
    {
      name: 'createdName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.createdName`).d('审批提交人'),
    },
    {
      name: 'creationDate',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.creationDate`).d('审批提交日期'),
    },
    {
      name: 'approvalResult',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.approvalResult`).d('审批结果'),
      lovCode: 'HQM_QIS.APPROVAL_RESULT',
      lovPara: { tenantId },
      textField: 'meaning',
      valueField: 'value',
    },
    {
      name: 'approvalOpinion',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.approvalOpinion`).d('审批意见'),
    },
    {
      name: 'approvalName',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.approvalName`).d('审批人'),
    },
    {
      name: 'approvalDate',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.approvalDate`).d('审批时间'),
    },
    {
      name: 'oaReviewAddress',
      type: FieldType.string,
    },
    {
      name: 'operation',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.operation`).d('审批过程查看'),
    },
  ],
  transport: {
    read: () => {
      return {
        url: `${BASIC.TARZAN_SAMPLING}/v1/${tenantId}/qis-oa-approval-history/ui/list`,
        method: 'POST',
      };
    },
  },
});

export { tableDS };
