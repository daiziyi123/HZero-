import React from 'react';
import Yqcloud from 'hzerojs-plugin-yqcloud-jssdk';
import { configure } from 'choerodon-ui';

const SPR_ROOT_CODE = 'spr.rivet.process';
const SPR_CURVE_PATH = '/voyahRF/SPR/';

const sprMenu = {
  id: 900000,
  code: SPR_ROOT_CODE,
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
      id: 900001,
      code: 'spr.rivet.dashboard',
      name: '仪表板',
      quickIndex: 'YBB',
      level: 'site',
      parentId: 900000,
      type: 'menu',
      sort: 10,
      icon: 'chart',
      route: '/voyahRF/dashboard',
      parentName: 'SPR铆接工艺管理',
      viewCode: 'spr.rivet.dashboard',
    },
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
      route: SPR_CURVE_PATH,
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
    {
      id: 900005,
      code: 'spr.rivet.hmi-message',
      name: 'HMI消息',
      quickIndex: 'HMIXX',
      level: 'site',
      parentId: 900000,
      type: 'menu',
      sort: 50,
      icon: 'message',
      route: '/voyahRF/hmi-message',
      parentName: 'SPR铆接工艺管理',
      viewCode: 'spr.rivet.hmi-message',
    },
  ],
  viewCode: SPR_ROOT_CODE,
};

const hasSprRoot = menuData =>
  Array.isArray(menuData) && menuData.some(item => item && item.code === SPR_ROOT_CODE);

const withSprMenu = menuData => {
  if (!Array.isArray(menuData) || hasSprRoot(menuData)) {
    return menuData;
  }
  return [sprMenu, ...menuData];
};

const toHzeroMenu = (item, parent?) => {
  const menuItem: any = {
    name: item.name,
    title: item.name,
    icon: item.icon,
    path: item.route || '',
    id: item.id,
    parentId: item.parentId,
    quickIndex: item.quickIndex,
    type: item.type,
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

const toLeafMenus = (menuList, result: any[] = []) => {
  if (!Array.isArray(menuList)) {
    return result;
  }
  menuList.forEach(item => {
    const children = item && (item.children || item.subMenus);
    if (Array.isArray(children) && children.length > 0) {
      toLeafMenus(children, result);
    } else if (item) {
      result.push(item);
    }
  });
  return result;
};

const sprLeafMenus = toLeafMenus([sprHzeroMenu]);

const hasSprHzeroRoot = menuData =>
  Array.isArray(menuData) &&
  menuData.some(item => item && (item.menuItem?.code === SPR_ROOT_CODE || item.name === sprMenu.name));

const withSprHzeroMenu = menuData => {
  if (!Array.isArray(menuData) || hasSprHzeroRoot(menuData)) {
    return menuData;
  }
  return [sprHzeroMenu, ...menuData];
};

const withSprLeafMenus = leafMenus => {
  if (!Array.isArray(leafMenus)) {
    return leafMenus;
  }
  const existingKeys = new Set(
    leafMenus.map(item => item && (item.path || item.route || item.menuItem?.code)).filter(Boolean)
  );
  const missingSprLeaves = sprLeafMenus.filter(
    item => !existingKeys.has(item.path || item.route || item.menuItem?.code)
  );
  return [...missingSprLeaves, ...leafMenus];
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
    const hasMenu = hasSprHzeroRoot(globalState.menu);
    const hasLeaf = Array.isArray(globalState.menuLeafNode)
      && globalState.menuLeafNode.some(item => item && item.path === SPR_CURVE_PATH);
    if (hasMenu && hasLeaf) {
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

const patchSprMenuApi = () => {
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
    // HZERO may change the API module shape between versions; keep boot resilient.
  }
};

const registerTraceLogFallback = () => {
  try {
    const { setTraceLog } = require('hzero-front/lib/customize/traceLog');
    setTraceLog({
      code: 'TraceLog',
      priority: -1,
      component: async () => null,
    });
  } catch (e) {
    // TraceLog is optional in this app. Missing HADM should not block the shell.
  }
};

export const dva = {
  config: {
    onAction: sprMenuActionMiddleware,
  },
};

const customSuspensionComponent = () => {
  const map = new Map([
    [
      'HZERO.ZKNOW',
      <Yqcloud
        tokenPath="/iam/v1/zknow/encrypt/quick"
        apiHost="https://api.test.yqcloud.com"
        token="288d1464-2be6-4b35-87c6-bbcc522f6ae4"
      />,
    ],
  ]);
  return map;
};

export const appInit = () => {
  const { overWriteConfig } = require('hzero-boot');
  patchSprMenuApi();
  registerTraceLogFallback();
  overWriteConfig({
    dvaAppInit: syncSprMenuToStore,
  });
  configure({ defaultActiveFirstOption: true, xlsx: () => import('xlsx') });
};

export default { customSuspensionComponent };
