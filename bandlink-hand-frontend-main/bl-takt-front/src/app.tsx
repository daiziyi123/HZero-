import React from 'react';
import Yqcloud from 'hzerojs-plugin-yqcloud-jssdk';
import { configure } from 'choerodon-ui';

const sprMenu = {
  id: 900000,
  code: 'spr.rivet.process',
  name: 'SPR铆接工艺管理',
  quickIndex: 'SPR',
  level: 'site',
  parentId: 0,
  type: 'root',
  sort: -100,
  icon: 'setting',
  route: '',
  subMenus: [
    {
      id: 900002,
      code: 'spr.rivet.final-value',
      name: '铆接终值',
      quickIndex: 'MJZZ',
      level: 'site',
      parentId: 900000,
      type: 'menu',
      sort: 20,
      icon: 'check',
      route: '/voyahRF/final-value',
      parentName: 'SPR铆接工艺管理',
      viewCode: 'spr.rivet.final-value',
    },
    {
      id: 900003,
      code: 'spr.rivet.curve',
      name: '铆接曲线',
      quickIndex: 'MJQX',
      level: 'site',
      parentId: 900000,
      type: 'menu',
      sort: 30,
      icon: 'chart-line',
      route: '/voyahRF/SPR/',
      parentName: 'SPR铆接工艺管理',
      viewCode: 'spr.rivet.curve',
    },
    {
      id: 900004,
      code: 'spr.rivet.window-analysis',
      name: '窗口分析',
      quickIndex: 'CKFX',
      level: 'site',
      parentId: 900000,
      type: 'menu',
      sort: 40,
      icon: 'search',
      route: '/voyahRF/window-analysis',
      parentName: 'SPR铆接工艺管理',
      viewCode: 'spr.rivet.window-analysis',
    },
  ],
  viewCode: 'spr.rivet.process',
};

const withSprMenu = menuData => {
  if (!Array.isArray(menuData)) {
    return menuData;
  }
  if (menuData.some(item => item && item.code === sprMenu.code)) {
    return menuData;
  }
  return [sprMenu, ...menuData];
};

const toLeafMenus = (menuList, result = []) => {
  if (!Array.isArray(menuList)) {
    return result;
  }
  menuList.forEach(item => {
    if (Array.isArray(item.children) && item.children.length > 0) {
      toLeafMenus(item.children, result);
    } else if (Array.isArray(item.subMenus) && item.subMenus.length > 0) {
      toLeafMenus(item.subMenus, result);
    } else {
      result.push(item);
    }
  });
  return result;
};

const toHzeroMenu = (item, parent?) => {
  const menuItem = {
    name: item.name,
    icon: item.icon,
    path: item.route || '',
    id: item.id,
    parentId: item.parentId,
    quickIndex: item.quickIndex,
    type: item.type,
    title: item.name,
    menuItem: {
      code: item.code,
      level: item.level,
      sort: item.sort,
      parentName: item.parentName,
      viewCode: item.viewCode,
    },
  };
  if (parent) {
    menuItem.parent = parent;
  }
  if (Array.isArray(item.subMenus) && item.subMenus.length > 0) {
    menuItem.children = item.subMenus.map(child => toHzeroMenu(child, menuItem));
  }
  return menuItem;
};

const sprHzeroMenu = toHzeroMenu(sprMenu);
const sprLeafMenus = toLeafMenus([sprHzeroMenu]).map(item => ({
  ...item,
  title: item.title || item.name,
}));

const withSprHzeroMenu = menuData => {
  if (!Array.isArray(menuData)) {
    return menuData;
  }
  if (menuData.some(item => item && (item.name === sprMenu.name || item.menuItem?.code === sprMenu.code))) {
    return menuData;
  }
  return [sprHzeroMenu, ...menuData];
};

const withSprLeafMenus = leafMenus => {
  if (!Array.isArray(leafMenus)) {
    return leafMenus;
  }
  const existingPaths = new Set(leafMenus.map(item => item && item.path));
  return [...sprLeafMenus.filter(item => !existingPaths.has(item.path)), ...leafMenus];
};

const sprMenuActionMiddleware = () => next => action => {
  if (action && action.type === 'global/updateState' && action.payload) {
    const payload = { ...action.payload };
    if (payload.menu) {
      payload.menu = withSprHzeroMenu(payload.menu);
    }
    if (payload.menuLeafNode) {
      payload.menuLeafNode = withSprLeafMenus(payload.menuLeafNode);
    }
    return next({ ...action, payload });
  }
  return next(action);
};

const syncSprMenuToStore = app => {
  const store = app && app._store;
  if (!store || store.__sprMenuSynced) {
    return;
  }
  store.__sprMenuSynced = true;
  let dispatching = false;
  const inject = () => {
    if (dispatching) {
      return;
    }
    const state = store.getState && store.getState();
    const globalState = state && state.global;
    if (!globalState || !globalState.menuLoad) {
      return;
    }
    const menu = withSprHzeroMenu(globalState.menu || []);
    const menuLeafNode = withSprLeafMenus(globalState.menuLeafNode || []);
    const hasSprMenu = Array.isArray(globalState.menu)
      && globalState.menu.some(
        item => item && (item.name === sprMenu.name || item.menuItem?.code === sprMenu.code)
      );
    const hasSprLeaf = Array.isArray(globalState.menuLeafNode)
      && globalState.menuLeafNode.some(item => item && item.path === '/voyahRF/SPR/');
    if (hasSprMenu && hasSprLeaf) {
      return;
    }
    dispatching = true;
    store.dispatch({
      type: 'global/updateState',
      payload: {
        menu,
        menuLeafNode,
      },
    });
    dispatching = false;
  };
  store.subscribe(inject);
  setTimeout(inject, 0);
  setTimeout(inject, 1000);
};

const patchSprMenu = () => {
  try {
    [
      require('hzero-front/lib/services/api/primary'),
      require('hzero-front/lib/services/api'),
    ].forEach(apiModule => {
      if (apiModule && apiModule.queryMenu && !apiModule.__sprMenuPatched) {
        const originalQueryMenu = apiModule.queryMenu;
        apiModule.queryMenu = async (...args) => {
          const data = await originalQueryMenu(...args);
          return withSprMenu(data);
        };
        apiModule.__sprMenuPatched = true;
      }
    });
  } catch (e) {
    // Keep boot resilient if the HZERO API module shape changes.
  }
};

export const dva = {
  config: {
    onAction: sprMenuActionMiddleware,
  },
};

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
  patchSprMenu();
  overWriteConfig({
    dvaAppInit: syncSprMenuToStore,
  });
  configure({ defaultActiveFirstOption: true, xlsx: () => import("xlsx") });
};

export default { customSuspensionComponent }
