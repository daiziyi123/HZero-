/**
 * @Description: 质检相关公共接口
 * @Author: <yang.ni01@hand-china.com>
 * @Date: 2023-03-02 10:31:20
 * @LastEditTime: 2023-03-02 11:04:36
 * @LastEditors: <yang.ni01@hand-china.com>
 */
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

// 详情数据查询
export function FetchRuleCodeDetailConfig() {
  return {
    url: `/hres/v1/${tenantId}/in-parameter`,
    method: 'GET',
  };
}

export function isJSONString(str) {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
        return obj;
      }
      return false;
    } catch {
      return false;
    }
  }
  return false;
}

// 保留小数精度的乘除法计算（加法：'add', 减法： 'subtraction', 乘法：'multiply', 除法： 'division'）
export function getProductWithPrecision(a, b, precision = 6, operationType = 'multiply') {
  // a的小数位数
  let aDigits = 1;
  // b的小数位数
  let bDigits = 1;
  if (a.toString().indexOf('.') !== -1) {
    aDigits = 10 ** a.toString().split('.')[1].length;
  }
  if (b.toString().indexOf('.') !== -1) {
    bDigits = 10 ** b.toString().split('.')[1].length;
  }
  const maxDigits = Math.max(aDigits, bDigits);
  switch (operationType) {
    case 'add':
      return Number(((maxDigits * a + maxDigits * b) / maxDigits).toFixed(precision));
    case 'subtraction':
      return Number(((maxDigits * a - maxDigits * b) / maxDigits).toFixed(precision));
    case 'multiply':
      return Number(((aDigits * a * bDigits * b) / aDigits / bDigits).toFixed(precision));
    case 'division':
      return Number(((aDigits * a) / (bDigits * b) / aDigits / bDigits).toFixed(precision));
    default:
      return 0;
  }
}
