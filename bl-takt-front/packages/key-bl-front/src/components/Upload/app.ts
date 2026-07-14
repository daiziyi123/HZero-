// import { base64encode } from './base64';
import { getEnvConfig } from 'utils/iocUtils';
import { getUrlParam, getAccessToken, getCurrentOrganizationId } from 'utils/utils';

// const FILE_URL = `${process.env.FILE_URL}`;
const { HZERO_FILE } = getEnvConfig() as any;
const accessToken = getAccessToken();
const tenantId = getCurrentOrganizationId();

const onUploadPreview = (file) => {
  console.log('文件', file);
  const { fileUrl, response, bucketName = 'fyds-tms' } = file;
  const params = {
    url: encodeURIComponent(response || fileUrl),
    bucketName,
    access_token: accessToken,
  };
  const url = `${HZERO_FILE}/v1/${tenantId}/file-preview/by-url${getUrlParam(params)}`;
  // const url = `${FILE_URL}/onlinePreview?url=${encodeURIComponent(base64encode(file.response))}`;
  window.open(url);
};

export { onUploadPreview };
