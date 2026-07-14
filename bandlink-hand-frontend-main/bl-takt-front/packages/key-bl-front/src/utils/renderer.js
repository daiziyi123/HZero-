import React from 'react';
import { Badge } from 'choerodon-ui';

import intl from 'utils/intl';

export function enableRender(val) {
  return (
    <Badge
      status={val === 'Y' ? 'success' : 'error'}
      text={
        val === 'Y'
          ? intl.get('hzero.common.enable').d('启用')
          : intl.get('hzero.common.disable').d('禁用')
      }
    />
  );
}
