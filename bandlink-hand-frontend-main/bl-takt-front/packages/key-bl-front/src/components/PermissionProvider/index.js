/**
 * @Description: 权限控制，如果没有权限，显示403没有权限，需要在类前第一个引用
 * @Author: <ruiqi.jiang01@hand-china.com>
 * @date: description
 * @Date: 2020-12-28 11:10:05
 * @LastEditTime: 2022-05-09 11:19:17
 * @LastEditors: <yang.ni01@hand-china.com>
 * @reactProps {!string} [noDisplayCode=''] - 获取权限编码（需要找一个已有权限组件的权限编码，${path}.后的值）
 * @example
 *    import { PermissionProvider } from '@/components/tarzan-ui';
 *
 *    Component:
 *    @PermissionProvider({ noDisplayCode: 'button.create'})
 *    export default class ErrorMessage extends React.Component {
 *
 *    React Hooks:
 *    import _ from 'lodash';
 *
 *    const enhance = _.flow([
 *        PermissionProvider({ noDisplayCode: 'button.create1' }),
 *        formatterCollections({ code: ['tarzan.org.customer.model', 'tarzan.common'] }),
 *    ]);
 *    export default enhance(
 *        CustomerSite
 *    );
 *
 *    或：
 *
 *    function validatePagePermission(component) {
 *        return PermissionProvider({ noDisplayCode: 'button.create1' })(component);
 *    }
 *    export default validatePagePermission(formatterCollections({ code: ['tarzan.org.customer.model', 'tarzan.common'] })(
 *        CustomerSite
 *    ));
 */

import React, { Component } from 'react';
import { checkPermission } from '@services/api';
import { getResponse } from '@utils/utils';
import { Spin } from 'choerodon-ui/pro';

const PermissionProvider = ({ noDisplayCode = '', modelPrompt = null } = {}) => {
  return WrappedComponent => {
    class ABC extends Component {
      state = {
        loaded: false,
        permissionDetail: {},
      };

      async getPermission(path) {
        const data = await checkPermission([
          `${path}.${noDisplayCode}`
            .replace(/^\//g, '')
            .replace(/\//g, '.')
            .replace(/:/g, '-'),
        ]);
        if (getResponse(data)) {
          const [permissionDetail] = data;
          this.setState({
            permissionDetail,
          });
        }
        this.setState({
          loaded: true,
        });
      }

      componentDidMount() {
        this.getPermission(modelPrompt || location.pathname);
      }

      shouldComponentUpdate(_, nextState) {
        return nextState.loaded;
      }

      render() {
        const { permissionDetail, loaded } = this.state;
        return loaded ? (
          <WrappedComponent {...this.props} permissionDetail={permissionDetail} />
        ) : (
          <Spin />
        );
      }
    }
    return ABC;
  };
};

export default PermissionProvider;
