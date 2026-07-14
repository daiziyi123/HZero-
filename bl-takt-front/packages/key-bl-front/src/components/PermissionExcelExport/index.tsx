/*
 * @Description: 导出-权限组件
 * @Author: <LI.YANG04@HAND-CHINA.COM>
 * @Date: 2024-01-25 16:50:12
 * @LastEditors: <LI.YANG04@HAND-CHINA.COM>
 * @LastEditTime: 2024-01-25 17:32:36
 */
import React, { useEffect, useState } from 'react';
import ExcelExport from 'components/ExcelExport';
import notification from 'utils/notification';
import { useRequest } from '@components/tarzan-hooks';

export default (props) => {
  const { permissionList, otherButtonProps, ...otherProps } = props;
  const { run: queryPermissionList } = useRequest({
    url: `/iam/hzero/v1/menus/check-permissions`,
    method: 'POST',
  }, { manual: true, needPromise: true });
  const [permissionConfig, setPermissionConfig] = useState<any>(null);

  useEffect(() => {
    handleInitConfig();
  }, []);

  const handleInitConfig = async () => {
    if (!permissionList?.length) {
      return notification.error({
        message: '未传入权限配置，请检查！',
      });
    }
    const res = await queryPermissionList({
      params: [ permissionList[0]?.code ],
    });
    if (res?.length) {
      setPermissionConfig(res[0]);
    }
  };

  return (
    <>
      {!(permissionConfig?.controllerType === 'hidden' && !permissionConfig?.approve) && (
        <ExcelExport
          { ...otherProps}
          otherButtonProps={{
            ...otherButtonProps,
            disabled: Object.keys(otherButtonProps)?.includes('disabled')
              ? otherButtonProps?.disabled || permissionConfig?.controllerType !== 'hidden' && !permissionConfig?.approve
              : permissionConfig?.controllerType !== 'hidden' && !permissionConfig?.approve,
          }}
        />
      )}
    </>
  )
}