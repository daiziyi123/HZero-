/**
 * @Description:
 * @Author: <yang.ni01@hand-china.com>
 * @Date: 2023-02-28 11:42:29
 * @LastEditTime: 2023-04-11 10:31:15
 * @LastEditors: <yang.ni01@hand-china.com>
 */

import React, { useMemo, useEffect, useRef } from 'react';
import intl from 'utils/intl';
import {
  DataSet,
  Row,
  Col,
  Form,
  Select,
  Lov,
  Button,
  SelectBox,
  TextField,
  Spin,
} from 'choerodon-ui/pro';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';
import { ViewMode } from 'choerodon-ui/pro/lib/radio/enum';
import { useDataSetEvent } from 'utils/hooks';
import { useRequest } from '@components/tarzan-hooks';
import OrganizationTree from './OrganizationTree';
import OrganizationTable from './OrganizationTable';
import { searchDS, orgTableDS } from './stores';
import { GetOrgTree, GetLocatorTree, GetUserOrgList } from './services';
import { DistributeButton, RevokeButton } from './Buttons';
import styles from './index.module.less';

const UserRightsDrawer = props => {
  const { userInfo } = props;

  // 包裹层为获取tree外层高度
  const treeTableWrapRef = useRef<HTMLDivElement>(null);
  const treeMaxHeight = useRef<number>(600);

  const searchDs = useMemo(() => new DataSet(searchDS()), []);
  const getOrgTree = useRequest(GetOrgTree(), { manual: true });
  const getLocatorTree = useRequest(GetLocatorTree(), { manual: true });
  const getUserOrgList = useRequest(GetUserOrgList(), { manual: true });
  const siteListDs = useMemo(() => new DataSet(orgTableDS()), []);

  useEffect(() => {
    if (treeTableWrapRef.current && treeMaxHeight.current === 600) {
      treeMaxHeight.current = treeTableWrapRef.current.clientHeight - 128;
    }
  }, [treeTableWrapRef?.current?.clientHeight]);

  useEffect(() => {
    searchDs!.current!.init('userId', userInfo.id);
    searchDs!.current!.init('userName', userInfo.realName);
    searchDs!.current!.init('loginName', userInfo.loginName);
    searchDs!.current!.init('organizationType', 'SITE');
    getTreeData();
    getTablesData();
  }, []);

  // 切换查询树类型时，进行查询
  useDataSetEvent(searchDs, 'update', ({ name, record }) => {
    switch (name) {
      case 'organizationType':
        record.set('organizationLov', null);
        getTreeData();
        break;
      case 'checkedKeys':
        break;
      default:
        getTreeData();
    }
  });

  const getTreeData = () => {
    searchDs!.current!.set('checkedKeys', []);
    return getOrgTree.run({
      params: {
        orgId: searchDs!.current!.get('organizationId'),
        organizationId: searchDs!.current!.get('organizationId'),
        organizationType: searchDs!.current!.get('organizationType'),
        userId: searchDs!.current!.get('userId'),
      },
    });
  };

  // 获取用户已分配的权限数据
  const getTablesData = () =>
    getUserOrgList.run({
      params: { userId: searchDs.current!.get('userId') },
      onSuccess: res => {
        formatTablesData(res);
      },
    });

  const formatTablesData = list => {
    const listStore: any[] = [];
    list.forEach(item => {
      if (item.organizationType === 'SITE') {
        listStore.push(item);
      }
    });
    siteListDs.loadData(listStore);
  };

  const handleSearch = () => {
    searchDs.validate().then(res => {
      if (res) {
        getTreeData();
        getTablesData();
      }
    });
  };

  return (
    <div className={styles.modalWrap} ref={treeTableWrapRef}>
      <Row>
        <Col span={16} offset={3}>
          <Form dataSet={searchDs} columns={2} labelWidth={112}>
            <Lov name="userLov" />
            <TextField name="userDesc" disabled />
            <Select name="organizationType" />
            <Lov name="organizationLov" />
          </Form>
        </Col>
        <Col span={3}>
          <Form dataSet={searchDs} columns={1} labelWidth={0}>
            <Form.Item>
              <Button
                onClick={handleSearch}
                loading={getOrgTree.loading || getLocatorTree.loading || getUserOrgList.loading}
                icon="search"
                color={ButtonColor.primary}
                style={{ width: 'auto' }}
              >
                {intl.get(`tarzan.common.button.search`).d('查询')}
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={16}>
          <Form dataSet={searchDs} columns={1} labelWidth={0}>
            <SelectBox name="allotType" mode={ViewMode.button} />
          </Form>
        </Col>
      </Row>
      <div className={styles.treeTableWrap}>
        <div className={styles.leftTree}>
          <Spin
            spinning={getOrgTree.loading || getLocatorTree.loading}
            style={{ height: treeMaxHeight.current }}
          >
            <OrganizationTree
              ds={searchDs}
              orgTreeConfig={getOrgTree.data || []}
              maxHeight={treeMaxHeight.current}
            />
          </Spin>
        </div>
        <div className={styles.centerButton}>
          <Row className={styles.centerButtonRow}>
            <DistributeButton
              ds={searchDs}
              className={styles.centerButtonItem}
              orgTreeConfig={getOrgTree.data || []}
              locatorTreeConfig={getLocatorTree.data || []}
              onSearch={handleSearch}
            />
          </Row>
          <Row className={styles.centerButtonRow}>
            <RevokeButton
              ds={searchDs}
              className={styles.centerButtonItem}
              siteListDs={siteListDs}
              onSearch={handleSearch}
            />
          </Row>
        </div>
        <div className={styles.rightTable}>
          <OrganizationTable
            ds={searchDs}
            siteListDs={siteListDs}
            maxHeight={treeMaxHeight.current}
          />
        </div>
      </div>
    </div>
  );
};

export default UserRightsDrawer;
