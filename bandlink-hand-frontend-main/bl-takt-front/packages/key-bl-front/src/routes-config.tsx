import React, { useContext, useEffect } from 'react';
import { ThemeContext } from '@hzero-front-ui/core';
import { ConfigProvider, configure } from 'choerodon-ui';
import { getCurrentOrganizationId } from 'utils/utils';
import moment from 'moment';
import { initUserCurrentSiteInfo, getResponse } from '@utils/utils';
import myInstance from 'hcm-components-front/lib/utils/myAxios';
import notification from 'utils/notification';
import intl from 'utils/intl';
import { loadConfig } from 'hzero-front/lib/utils/c7nUiConfig';

if (process.env.ADDITIONAL === 'true') {
  loadConfig(configure);
}

const imgs = ['png', 'gif', 'jpg', 'webp', 'jpeg', 'bmp', 'tif', 'pic', 'svg'];
// const tenantId = getCurrentOrganizationId();
// console.log('tenantId', tenantId);

const configProps = {
  feedback: {
    loadSuccess(resp) {
      getResponse(resp);
    },
    submitSuccess() {},
  },
  dateTimePickerOkButton: true,
  attachment: {
    defaultFileKey: 'file',
    defaultFileSize: 500 * 1024 * 1024,
    defaultChunkSize: 5 * 1024 * 1024,
    defaultChunkThreads: 3,
    action: ({ bucketName, bucketDirectory, attachmentUUID }) => {
      return {
        url: `/hfle/v1/${getCurrentOrganizationId()}/files/attachment/multipart`,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        data: {
          bucketName,
          directory: bucketDirectory,
          attachmentUUID,
        },
      };
    },
    fetchList({ attachmentUUID }) {
      return myInstance
        .get(
          `/hfle/v1/${getCurrentOrganizationId()}/files/${attachmentUUID}/file?attachmentUUID=${attachmentUUID}`,
        )
        .then(response => {
          const { data } = response;
          return data.map(file => ({
            uid: file.fileId,
            name: file.fileName,
            size: file.fileSize,
            type: file.fileType,
            url: file.fileUrl,
            creationDate: moment(file.creationDate).toDate(),
            status: 'done',
          }));
        });
    },
    fetchFileSize: () => Promise.resolve(500 * 1024 * 1024),
    batchFetchCount(uuids) {
      return myInstance
        .post(`/hfle/v1/${getCurrentOrganizationId()}/files/count/batch`, uuids)
        .then(res => res.data);
    },
    onRemove: ({ attachment, attachmentUUID }) => {
      return myInstance.post(
        `/hfle/v1/${getCurrentOrganizationId()}/files/delete-by-uuidurl/not-null?attachmentUUID=${attachmentUUID}`,
        [attachment.url],
      );
    },
    onOrderChange(attachments) {
      return myInstance.post(
        `/hfle/v1/${getCurrentOrganizationId()}/files/${attachments.attachmentUUID}/file/order`,
        attachments.attachments.map(item => item.uid),
      );
    },
    getAttachmentUUID() {
      return myInstance.post(`/hfle/v1/4/files/uuid`).then(res => {
        return res.data.content;
      });
    },
    getPreviewUrl({ attachment, bucketName }) {
      const { ext, type, url } = attachment;
      const isPicture = type.startsWith('image') || imgs.includes(ext);
      if (isPicture) {
        return url;
      }
      // 可以异步获取一些认证信息再跳转预览
      return () =>
        myInstance
          .get(
            `/hfle/v1/${getCurrentOrganizationId()}/files/signedUrl?bucketName=${bucketName}&url=${url}&download=0`,
          )
          .then(res => {
            const elink = document.createElement('a');
            elink.style.display = 'none';
            elink.href = res.data;
            elink.target = '_blank';
            document.body.appendChild(elink);
            elink.click();
            document.body.removeChild(elink);
          });
    },
    getDownloadUrl({ attachment, bucketName }) {
      return () =>
        myInstance
          .get(
            `/hfle/v1/${getCurrentOrganizationId()}/files/signedUrl?bucketName=${bucketName}&url=${
              attachment.url
            }`,
          )
          .then(res => {
            const elink = document.createElement('a');
            elink.style.display = 'none';
            elink.href = res.data;
            document.body.appendChild(elink);
            elink.click();
            document.body.removeChild(elink);
          });
    },
    onUploadSuccess(res, attachment) {
      attachment.load({
        // uid: attachment.attachmentUUID,
        // name: attachment.name,
        // size: attachment.fileSize,
        // type: attachment.fileType,
        // url: res,
        // creationDate: attachment.creationDate,
        // status: attachment.status,
        ...res,
        uid: res.fileId,
        name: res.fileName,
        size: res.fileSize,
        type: res.fileType,
        url: res.fileUrl,
        creationDate: moment(res.creationDate).toDate(),
      });
      notification.success({
        message: intl.get('tarzan.common.file.upload.success').d('文件上传成功'),
      });
    },
    renderHistory() {
      return 'empty';
    },
  },
  lovTableProps: {
    selectionMode: 'click',
    alwaysShowRowBox: true,
  },
  tableColumnEditorBorder: false,
  tableBorder: true,
};

export const PageWrapper = () => {
  const PageWrapperComponent = ({ children }: any) => {
    useEffect(() => {
      // 初始化用户当前站点信息
      initUserCurrentSiteInfo();
    }, []);

    const { schema } = useContext(ThemeContext);
    const baseTheme = () => import('@utils/hmesStyle.base.less');
    baseTheme();
    if (schema === 'nightingale') {
      const overrideTheme = () => import('@utils/theme5.override.less');
      overrideTheme();
    }
    const addIconfont = () => import('@assets/iconfonts/iconfont.css');
    addIconfont();
    // @ts-ignore
    configure(configProps);
    // @ts-ignore
    return <ConfigProvider {...configProps}>{children}</ConfigProvider>;
  };
  return PageWrapperComponent;
};

export default {};
