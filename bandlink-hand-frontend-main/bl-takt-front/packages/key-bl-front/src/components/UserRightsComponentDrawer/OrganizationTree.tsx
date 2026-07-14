/**
 * @Description: 用户检验权限维护
 * @Author: <yang.ni01@hand-china.com>
 * @Date: 2023-02-28 11:44:46
 * @LastEditTime: 2023-04-11 10:38:17
 * @LastEditors: <yang.ni01@hand-china.com>
 */

import React from 'react';
import { observer } from 'mobx-react';
import { DataSet, Tree } from 'choerodon-ui/pro';

const { TreeNode } = Tree;

/**
 * 树节点类型
 * @export
 * @interface OrgTreeNode
 */
export interface OrgTreeNode {
  organizationRelId: number; // 节点唯一Id
  organizationId: number; // 节点Id
  organizationCode: string; // 节点编码
  organizationDesc: string | null; // 节点描述
  organizationType: string; // 节点类型
  organizationTypeDesc: string; // 节点类型描述
  alreadyDefined: boolean | null; // 是否已分配
  sequence: number | null; // 排序
  subUserOrgRelList: OrgTreeNode[]; // 子节点信息
}

interface OrganizationTreeProps {
  ds: DataSet;
  orgTreeConfig: OrgTreeNode[];
  maxHeight: number;
}

const OrganizationTree = observer((props: OrganizationTreeProps) => {
  const { ds, orgTreeConfig, maxHeight } = props;

  const renderTreeItems = (nodes: OrgTreeNode[] | null) => {
    if (!nodes || !nodes.length) {
      return;
    }
    return nodes.map(item => {
      return (
        <TreeNode
          title={
            <div>
              {item.organizationTypeDesc}-{item.organizationCode}
            </div>
          }
          key={`${item.organizationRelId}`}
          id={item.organizationRelId}
          dataRef={item}
          disableCheckbox={
            item.organizationType === 'ENTERPRISE' || item.alreadyDefined || undefined
          }
        />
      );
    });
  };

  const handleCheck = _checkedKeys => {
    const { checked } = _checkedKeys;
    ds!.current!.set('checkedKeys', checked);
  };

  return (
    <Tree
      checkable
      onCheck={handleCheck}
      checkedKeys={{ checked: ds?.current!.get('checkedKeys'), halfChecked: [] }}
      checkStrictly
      height={maxHeight}
    >
      {renderTreeItems(orgTreeConfig)}
    </Tree>
  );
});

export default OrganizationTree;
