/**
 * @Description: 用户权限抽屉-分配/取消分配按钮
 * @Author: <ruiqi.jiang01@hand-china.com>
 * @Date: 2022-10-13 17:58:46
 * @LastEditTime: 2023-04-11 10:21:44
 * @LastEditors: <yang.ni01@hand-china.com>
 */
import React, { useMemo } from 'react';
import { observer } from 'mobx-react';
import notification from 'utils/notification';
import intl from 'utils/intl';
import { DataSet, Button } from 'choerodon-ui/pro';
import { useRequest } from '@components/tarzan-hooks';
import { OrgTreeNode } from './OrganizationTree';
import { UserOrganizationSave } from './services';

interface DistributeButtonProps {
  ds: DataSet;
  className: any;
  orgTreeConfig: OrgTreeNode[];
  locatorTreeConfig: OrgTreeNode[];
  onSearch: (clearExpandFlag?: boolean) => void;
}

interface RevokeButtonProps {
  ds: DataSet;
  className: any;
  siteListDs: DataSet;
  onSearch: (clearExpandFlag?: boolean) => void;
}

const modelPrompt = 'tarzan.model.hmes.userRights';

const DistributeButton = observer((props: DistributeButtonProps) => {
  const { ds, className, orgTreeConfig, onSearch } = props;

  const userOrganizationSave = useRequest(UserOrganizationSave(), { manual: true });

  const handleSave = () => {
    const checkedKeys = ds!.current!.get('checkedKeys');
    const treeList = orgTreeConfig;
    const userOrganizationList: any[] = [];
    const getUserOrganizationList = orgList => {
      orgList.forEach(item => {
        if (checkedKeys.indexOf(`${item.organizationRelId}`) > -1) {
          userOrganizationList.push({
            organizationId: item.organizationId,
            organizationType: item.organizationType,
            organizationCode: item.organizationCode,
            organizationTypeDesc: item.organizationTypeDesc,
          });
        }
        if (item.subUserOrgRelList && item.subUserOrgRelList.length > 0) {
          getUserOrganizationList(item.subUserOrgRelList);
        }
      });
    };
    getUserOrganizationList(treeList);
    userOrganizationSave.run({
      params: {
        userId: ds!.current!.get('userId'),
        enableFlag: 'Y',
        userOrganizationList,
      },
      onSuccess: () => {
        notification.success({ message: intl.get(`${modelPrompt}.actionSuccess`).d('分配成功') });
        onSearch(false);
      },
    });
  };

  const treeCheckedKeysLength: number = ds!.current!.get('checkedKeys').length;

  return (
    <Button
      className={className}
      loading={userOrganizationSave.loading}
      disabled={!treeCheckedKeysLength}
      onClick={handleSave}
    >
      {!userOrganizationSave.loading && <span>&gt;</span>}
    </Button>
  );
});

const RevokeButton = observer((props: RevokeButtonProps) => {
  const { ds, className, siteListDs, onSearch } = props;

  const userOrganizationSave = useRequest(UserOrganizationSave(), { manual: true });

  const btnDisabled = useMemo(() => {
    if (siteListDs?.selected.length) {
      return false;
    }
    return true;
  }, [siteListDs?.selected.length]);

  const handleRevoke = () => {
    const userOrganizationRecordList = [...siteListDs.selected];
    const userOrganizationList = userOrganizationRecordList.map(item => item.toData());
    userOrganizationSave.run({
      params: {
        userId: ds!.current!.get('userId'),
        enableFlag: 'N',
        userOrganizationList,
      },
      onSuccess: () => {
        notification.success({
          message: intl.get(`${modelPrompt}.cancelActionSuccess`).d('取消分配成功'),
        });
        onSearch(false);
      },
    });
  };

  return (
    <Button
      className={className}
      loading={userOrganizationSave.loading}
      disabled={btnDisabled}
      onClick={handleRevoke}
    >
      {!userOrganizationSave.loading && <span>&lt;</span>}
    </Button>
  );
});

export { DistributeButton, RevokeButton };
