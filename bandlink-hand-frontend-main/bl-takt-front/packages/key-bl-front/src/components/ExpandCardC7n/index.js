/**
 * @Description: c7n的卡片
 * @Author: <ruiqi.jiang01@hand-china.com>
 * @Date: 2021-01-22 16:40:56
 * @LastEditTime: 2022-02-10 21:02:12
 * @LastEditors: <ruiqi.jiang01@hand-china.com>
 */
import React, { useState, forwardRef, useEffect } from 'react';
import { Card, Icon, Tooltip } from 'choerodon-ui';
import intl from 'utils/intl';
import { DETAIL_CARD_CLASSNAME } from 'utils/constants';
import styles from './index.modules.less';

const ExpandCardC7n = forwardRef((props, ref) => {
  const {
    key,
    expandFlag: propsExpandFlag = true,
    className,
    tabList,
    children,
    title,
    tooltipMessage,
    differTitle,
    showExpandIcon,
    onChangeExpandFlag,
    ...others
  } = props;
  const [expandFlag, setExpandFlag] = useState(propsExpandFlag);

  useEffect(() => {
    setExpandFlag(propsExpandFlag);
  }, [propsExpandFlag]);

  const expandCardClassNames = [className, DETAIL_CARD_CLASSNAME];

  const expandTitle = (
    <>
      <span style={{ fontSize: '14px' }}>{title}</span>
      {tooltipMessage && (
        <Tooltip placement="right" title={tooltipMessage}>
          <Icon
            className={styles['split-qty-icon']}
            type="help_outline"
            style={{
              color: 'rgba(0, 0, 0, 0.3)',
              fontSize: 18,
              cursor: 'pointer',
              marginLeft: 5,
              marginBottom: 2,
            }}
          />
        </Tooltip>
      )}
      {showExpandIcon && (
        <a
          style={{ marginLeft: '16px', fontSize: '12px', height: '21px' }}
          onClick={() => {
            if (onChangeExpandFlag && typeof onChangeExpandFlag === 'function') {
              onChangeExpandFlag(!expandFlag);
            } else {
              setExpandFlag((prev) => !prev);
            }
          }}
        >
          {expandFlag
            ? intl.get(`tarzan.common.button.retract`).d('收起')
            : intl.get('tarzan.common.button.open').d('展开')}
          <Icon type={expandFlag ? 'expand_less' : 'expand_more'} />
        </a>
      )}
    </>
  );

  return (
    <>
      {tabList ? (
        <Card
          key={key}
          bordered={false}
          className={[className, styles.tabCard]}
          tabList={tabList}
          ref={ref}
          {...others}
        >
          {expandFlag && children}
        </Card>
      ) : (
        <Card
          key={key}
          title={differTitle || expandTitle}
          bordered={false}
          className={expandCardClassNames}
          ref={ref}
          {...others}
        >
          {expandFlag && children}
        </Card>
      )}
    </>
  );
});

export default ExpandCardC7n;
