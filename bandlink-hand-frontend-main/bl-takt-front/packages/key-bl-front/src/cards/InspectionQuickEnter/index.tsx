import React, { useEffect, useState } from 'react';
import { Button } from 'choerodon-ui/pro';
import { Badge, Card } from 'choerodon-ui';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { useRequest } from '@components/tarzan-hooks';
import { withRouter } from 'react-router-dom';
import styles from './styles/index.modules.less';
import { FetchWorkbenchType, FetchWorkbenchCount } from './services';
import chaoqian from './assets/chaoqian.png';
import kujian from './assets/kujian.png';
import lailiao from './assets/lailiao.png';
import sunshang from './assets/sunshang.png';
import wangong from './assets/wangong.png';
import xunjian from './assets/xunjian.png';

const modelPrompt = 'tarzan.qms.inspectionPlatform';

const InspectionPlatformList = props => {
  const { history } = props;

  const [iconList] = useState([chaoqian, kujian, lailiao, sunshang, wangong, xunjian]);

  const [quickEnter, setQuickEnter] = useState([]);

  const workbenchTypeRequest = useRequest(FetchWorkbenchType(), {
    manual: true,
    needPromise: true,
  });

  const workbenchCountRequest = useRequest(FetchWorkbenchCount(), {
    manual: true,
    needPromise: true,
  });

  useEffect(() => {
    getWorkbenchType();
  }, []);

  const getWorkbenchType = async () => {
    const res = await workbenchTypeRequest.run({});
    if (res?.success) {
      workbenchCount(res.rows);
    }
  };
  const workbenchCount = async params => {
    const res = await workbenchCountRequest.run({ params });
    if (res?.success) {
      setQuickEnter(res.rows);
    }
  };

  const goList = searchData => {
    history.push({
      pathname: `hwms/inspection-platform-performance/list/`,
      state: {
        searchData,
        needClear: true,
      },
    });
  };

  return (
    <Card
      className={styles['card-box']}
      title={intl.get(`${modelPrompt}.quickEnter`).d('快捷入口')}
      bordered={false}
      style={{ width: '100%', height: '100%' }}
      extra={
        <Button
          funcType={FuncType.link}
          onClick={() => {
            goList({});
          }}
        >
          全部
        </Button>
      }
    >
      <div className={styles['quick-enter-box']}>
        {quickEnter.map((item: any, index) => {
          return (
            <div
              className={styles['quick-item']}
              onClick={() => {
                goList({
                  inspectBusinessType: item.inspectBusinessType,
                  inspectBusinessTypeDesc: item.inspectBusinessTypeDesc,
                });
              }}
            >
              <div className={styles['quick-item-icon-box']}>
                <Badge
                  showZero
                  count={item.waitInspectTaskQty || 0}
                  className={styles['quick-item-icon']}
                >
                  <img src={iconList[index % iconList.length]} alt="" />
                </Badge>
              </div>
              <div>{item.inspectBusinessTypeDesc}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default formatterCollections({
  code: ['tarzan.qms.inspectionPlatform', 'tarzan.common'],
})(withRouter(InspectionPlatformList));
