/**
 * @Description: 审批信息查看页面代码
 * @Author: LI.YANG04@HAND-CHINA.COM
 * @Date: 2023/7/21 15:34
 */
import React, { useMemo } from 'react';
import { Button, DataSet, Modal, Table } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { drawerPropsC7n } from '@components/tarzan-ui';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import formatterCollections from 'utils/intl/formatterCollections';
import { FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { Badge } from 'choerodon-ui';
import { tableDS } from './stores';

const modelPrompt = 'tarzan.common.approvalInfoDrawer';

export interface ApprovalDrawerProps {
  type?: 'button' | 'text';
  objectTypeList: String[];
  objectId: string;
  disabled?: boolean;
}

const AttributeDrawer: React.FC<ApprovalDrawerProps> = ({
  type = 'button',
  objectTypeList,
  objectId,
  disabled = false,
}) => {
  const tableDs = useMemo(() => new DataSet(tableDS()), []);

  const handleJump = record => {
    window.open(`${record?.get('oaReviewAddress')}${record?.get('requestId')}`)
  }

  const columns: ColumnProps[] = useMemo(
    () => [
      { name: 'objectType', width: 180 },
      { name: 'createdName' },
      { name: 'creationDate', width: 150, align: ColumnAlign.center },
      {
        name: 'approvalResult',
        align: ColumnAlign.center,
        width: 100,
        renderer: ({ value }) => {
          if (!value) {
            return;
          }
          return (
            <Badge
              status={value === 'Y' ? 'success' : 'error'}
              text={
                value === 'Y'
                  ? intl.get(`${modelPrompt}.badge.pass`).d('通过')
                  : intl.get(`${modelPrompt}.badge.refuse`).d('驳回')
              }
            />
          );
        },
      },
      { name: 'approvalOpinion', width: 350 },
      { name: 'approvalName' },
      { name: 'approvalDate', width: 150, align: ColumnAlign.center },
      {
        name: 'operation',
        width: 150,
        align: ColumnAlign.center,
        renderer: ({ record }) => (
          <span className="action-link">
            <a onClick={() => handleJump(record)}>
              {intl.get(`${modelPrompt}.button.detail`).d('审批过程查看')}
            </a>
          </span>
        ),
      },
    ],
    [],
  );

  const handleOpenDrawer = () => {
    if (objectId !== 'create') {
      tableDs.setQueryParameter('objectId', objectId);
      tableDs.setQueryParameter('objectTypeList', objectTypeList || []);
      tableDs.query();
    }
    Modal.open({
      ...drawerPropsC7n({
        canEdit: false,
        ds: tableDs,
      }),
      title: intl.get(`${modelPrompt}.title.approvalInfo`).d('审批信息'),
      style: {
        width: 1080,
      },
      children: <Table dataSet={tableDs} columns={columns} />,
    });
  };

  return (
    <>
      {type === 'text' ? (
        <span className="action-link">
          <Button funcType={FuncType.flat} onClick={handleOpenDrawer} disabled={disabled}>
            {intl.get(`${modelPrompt}.button.approvalInfo`).d('审批信息查看')}
          </Button>
        </span>
      ) : (
        <Button onClick={handleOpenDrawer} disabled={disabled}>
          {intl.get(`${modelPrompt}.button.approvalInfo`).d('审批信息查看')}
        </Button>
      )}
    </>
  );
};

export default formatterCollections({
  code: [modelPrompt],
})(AttributeDrawer);
