import React from 'react';
import Yqcloud from 'hzerojs-plugin-yqcloud-jssdk';
import { configure } from 'choerodon-ui';

const customSuspensionComponent = () => {
  // tokenPath 为hzero插件接口
  // apiHost  为燕千云对应环境的网关
  // token 为燕千云对应环境中三方应用的token
  const map = new Map([
    [
      'HZERO.ZKNOW',
      <Yqcloud tokenPath="/iam/v1/zknow/encrypt/quick" apiHost="https://api.test.yqcloud.com" token="288d1464-2be6-4b35-87c6-bbcc522f6ae4"></Yqcloud>,
    ],
  ]);
  return map;
};
// 初始化
export const appInit = () => {
  const { overWriteConfig } = require('hzero-boot');
  overWriteConfig({
  });
  configure({ defaultActiveFirstOption: true, xlsx: () => import("xlsx") });
};

export default { customSuspensionComponent }
