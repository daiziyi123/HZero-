import { configure } from 'choerodon-ui';
import getModuleRouters from './getModuleRouters';

export function getRouterData(app) {
  configure({
    // tableHighLightRow: false,
  });
  return {
    ...getModuleRouters(app),
  };
}
