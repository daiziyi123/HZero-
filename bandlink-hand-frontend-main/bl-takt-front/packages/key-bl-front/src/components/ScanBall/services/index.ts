import { BASIC } from '@utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

const endUrl = ``;

// 实物条码扫描
export function FetchBarcodeScan() {
  return {
    url: `${BASIC.TARZAN_SAMPLING}${endUrl}/v1/${tenantId}/mt-inspect-workbench/permission/barcode/scan/ui`,
    method: 'POST',
  };
}
