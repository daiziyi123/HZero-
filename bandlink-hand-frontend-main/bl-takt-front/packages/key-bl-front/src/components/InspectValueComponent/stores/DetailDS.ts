/**
 * @Description: 检验项目维护-详情页DS
 * @Author: LI.YANG04@HAND-CHINA.COM
 * @Date: 2023/1/9 16:37
 */
import intl from 'utils/intl';
import { FieldIgnore, FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { getCurrentOrganizationId } from 'utils/utils';
import { BASIC } from '@utils/config';
import { isJSONString } from '@/utils';

const modelPrompt = 'tarzan.hwms.inspectItemMaintain';
const tenantId = getCurrentOrganizationId();

const detailDS: (requiredField, validateType) => DataSetProps = (requiredField, validateType) => ({
  selection: false,
  autoQuery: false,
  autoCreate: true,
  paging: false,
  forceValidate: true,
  dataKey: 'rows',
  fields: [
    // 数据信息
    {
      name: 'enterMethod',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.enterMethod`).d('录入方式'),
      textField: 'description',
      valueField: 'typeCode',
      lovPara: { tenantId },
      lookupUrl: `${BASIC.TARZAN_COMMON}/v1/${tenantId}/mt-gen-type/combo-box/ui?typeGroup=TAG_COLLECTION_METHOD`,
      defaultValue: 'MANUAL_COLLECTION',
      lookupAxiosConfig: {
        transformResponse(data) {
          // data会有缓存，第一次查询得到结果为JSON字符串，再后来得到的是数组
          if (data instanceof Array) {
            return data;
          }
          const { rows } = JSON.parse(data);
          return rows;
        },
      },
      dynamicProps: {
        required: () => {
          return requiredField.indexOf('enterMethod') > -1;
        },
        disabled: ({ record }) => record.get('dataType') === 'CALCULATE_FORMULA',
      },
    },
    {
      name: 'dataType',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.dataType`).d('数据类型'),
      lookupCode: 'MT.QMS.INSPECT_ITEM_DATA_TYPE',
      lovPara: { tenantId },
      textField: 'meaning',
      valueField: 'value',
      required: true,
    },
    {
      name: 'uomLov',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.uomName`).d('单位'),
      lovCode: 'MT.COMMON.UOM',
      lovPara: { tenantId },
      ignore: FieldIgnore.always,
      textField: 'uomName',
      dynamicProps: {
        disabled: ({ record }) => !['CALCULATE_FORMULA', 'VALUE'].includes(record.get('dataType')),
      },
    },
    {
      name: 'uomId',
      bind: 'uomLov.uomId',
    },
    {
      name: 'uomName',
      bind: 'uomLov.uomName',
    },

    {
      name: 'formulaLov',
      type: FieldType.object,
      label: intl.get(`${modelPrompt}.formula`).d('计算公式'),
      lovCode: 'HRES.RULE.LIST',
      lovPara: { tenantId },
      ignore: FieldIgnore.always,
      textField: 'ruleName',
      valueField: 'ruleId',
      dynamicProps: {
        disabled: ({ record }) => record.get('dataType') !== 'CALCULATE_FORMULA',
        required: ({ record }) => record.get('dataType') === 'CALCULATE_FORMULA',
      },
    },
    {
      name: 'formulaId',
      bind: 'formulaLov.ruleId',
    },
    {
      name: 'formulaCode',
      bind: 'formulaLov.ruleCode',
    },
    {
      name: 'formulaName',
      bind: 'formulaLov.ruleName',
    },

    {
      name: 'formulaList',
    },

    {
      name: 'dimension',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.formulaDimension`).d('计算维度'),
      lookupCode: 'MT.QMS.CALCULATE_DIMENSION',
      lovPara: { tenantId },
      textField: 'meaning',
      valueField: 'value',
      dynamicProps: {
        disabled: ({ record }) => record.get('dataType') !== 'CALCULATE_FORMULA',
        required: ({ record }) => record.get('dataType') === 'CALCULATE_FORMULA',
      },
    },

    {
      name: 'decimalNumber',
      type: FieldType.number,
      label: intl.get(`${modelPrompt}.decimalNumber`).d('小数位数'),
      min: 0,
      step: 1,
      dynamicProps: {
        disabled: ({ record }) => !['CALCULATE_FORMULA', 'VALUE'].includes(record.get('dataType')),
      },
    },
    {
      name: 'processMode',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.processMode`).d('尾数处理'),
      textField: 'description',
      valueField: 'typeCode',
      lovPara: { tenantId },
      lookupUrl: `${BASIC.TARZAN_COMMON}/v1/${tenantId}/mt-gen-type/combo-box/ui?typeGroup=DECIMAL_PROCESS_MODE`,
      lookupAxiosConfig: {
        transformResponse(data) {
          // data会有缓存，第一次查询得到结果为JSON字符串，再后来得到的是数组
          if (data instanceof Array) {
            return data;
          }
          const { rows } = JSON.parse(data);
          return rows;
        },
      },
      dynamicProps: {
        disabled: ({ record }) => !['CALCULATE_FORMULA', 'VALUE'].includes(record.get('dataType')),
      },
    },
    {
      name: 'valueLists',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.valueList`).d('值列表'),
      multiple: true,
      dynamicProps: {
        disabled: ({ record }) => record.get('dataType') !== 'VALUE_LIST',
        required: ({ record }) => {
          const dataType = record.get('dataType');
          if (dataType === 'VALUE_LIST') {
            if (validateType === 'InspectionScheme') {
              return true;
            }
            return false;
          }
          return false;
        },
      },
    },
    {
      name: 'trueValue',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.trueValue`).d('符合值'),
      dynamicProps: {
        disabled: ({ record }) => {
          console.log('dataType===>', record.get('falseValue'));
          switch (record.get('dataType')) {
            case 'VALUE_LIST':
              return (
                !record.get('valueLists') ||
                !record.get('valueLists').length ||
                (!['InspectionPlatform', 'InspectionPlatformCreateItem'].includes(validateType) &&
                  record.get('falseValue')?.length)
              );
            case 'TEXT':
              return record.get('falseValue');
            case 'DECISION_VALUE':
              return false;
            default:
              return true;
          }
        },
        required: ({ record }) => {
          const dataType = record.get('dataType');
          if (dataType === 'DECISION_VALUE') {
            if (
              ['InspectionScheme', 'InspectionPlatform', 'InspectionPlatformCreateItem'].includes(
                validateType,
              )
            ) {
              return true;
            }
            return record.get('falseValue');
          }
          if (dataType === 'VALUE_LIST') {
            if (validateType === 'InspectionScheme') {
              if (!record.get('falseValue') && !record.get('trueValue')) {
                return true;
              }
              return !record.get('falseValue');
            }
            if (['InspectionPlatform', 'InspectionPlatformCreateItem'].includes(validateType)) {
              return true;
            }
            return false;
          }
          return false;
        },
      },
    },
    { name: 'trueValueList' },
    {
      name: 'falseValue',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.falseValue`).d('不符合值'),
      dynamicProps: {
        disabled: ({ record }) => {
          switch (record.get('dataType')) {
            case 'VALUE_LIST':
              return (
                !record.get('valueLists') ||
                !record.get('valueLists').length ||
                (!['InspectionPlatform', 'InspectionPlatformCreateItem'].includes(validateType) &&
                  record.get('trueValue')?.length)
              );
            case 'TEXT':
              return record.get('trueValue');
            case 'DECISION_VALUE':
              return false;
            default:
              return true;
          }
        },
        required: ({ record }) => {
          const dataType = record.get('dataType');

          if (dataType === 'DECISION_VALUE') {
            if (
              ['InspectionScheme', 'InspectionPlatform', 'InspectionPlatformCreateItem'].includes(
                validateType,
              )
            ) {
              return true;
            }
            return record.get('trueValue');
          }
          if (dataType === 'VALUE_LIST') {
            if (validateType === 'InspectionScheme') {
              if (!record.get('falseValue') && !record.get('trueValue')) {
                return true;
              }
              return !record.get('trueValue');
            }
            if (['InspectionPlatform', 'InspectionPlatformCreateItem'].includes(validateType)) {
              return true;
            }
            return false;
          }
          return false;
        },
      },
    },
    { name: 'falseValueList' },
    {
      name: 'warningValue',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.warningValue`).d('预警值'),
      dynamicProps: {
        disabled: ({ record }) =>
          !['CALCULATE_FORMULA', 'VALUE'].includes(record.get('dataType')) ||
          (record.get('dataType') === 'VALUE' && !record.get('trueValue')),
      },
    },
    { name: 'warningValueList' },

    {
      name: 'defaultValue',
      label: intl.get(`${modelPrompt}.defaultValue`).d('默认值'),
      computedProps: {
        type: ({ record }) => {
          const dataType = record.get('dataType');
          if (dataType === 'VALUE') {
            return FieldType.number;
          }
          if (dataType === 'DATE') {
            return FieldType.date;
          }
          if (dataType === 'DECISION_VALUE' || dataType === 'TEXT') {
            return FieldType.string;
          }
          return FieldType.string;
        },
        disabled: ({ record }) => {
          const dataType = record.get('dataType');
          if (!dataType) {
            return true;
          }
          return false;
        },
      },
    },
    {
      name: 'dataQtyDisposition',
      type: FieldType.string,
      label: intl.get(`${modelPrompt}.dataQtyDispositionDesc`).d('记录值个数配置'),
      lookupCode: 'MT.QMS_DATA_QTY_DISPOSITION',
      lovPara: { tenantId },
      textField: 'meaning',
      valueField: 'value',
    },
  ],
});

const numberListDS: () => DataSetProps = () => ({
  autoCreate: true,
  autoLocateFirst: true,
  dataKey: 'rows',
  fields: [
    { name: 'dataValue' },
    {
      name: 'multipleValue',
      dynamicProps: {
        range: ({ record }) => {
          return (record.get('valueType') === 'section' || record.get('valueType') === 'tolerance') ? ['leftValue', 'rightValue'] : false;
        },
      },
    },
    {
      name: 'leftChar',
      type: FieldType.string,
      defaultValue: '[',
    },
    {
      name: 'leftValue',
      type: FieldType.string,
      dynamicProps: {
        bind: ({ record }) => {
          if (record.get('valueType') === 'section') {
            return 'multipleValue.leftValue';
          }
        },
      },
    },
    {
      name: 'rightChar',
      type: FieldType.string,
      defaultValue: ']',
    },
    {
      name: 'rightValue',
      type: FieldType.string,
      dynamicProps: {
        bind: ({ record }) => {
          if (record.get('valueType') === 'section') {
            return 'multipleValue.rightValue';
          }
        },
      },
    },
    // single - 单值  section - 区间  tolerance - 公差
    {
      name: 'valueType',
      type: FieldType.string,
      defaultValue: 'single',
    },
    {
      name: 'valueShow',
      type: FieldType.string,
    },
    {
      name: 'standard',
      type: FieldType.string,
    },
    {
      name: 'tolerance',
      type: FieldType.string,
    },
    // +/-/±
    {
      name: 'toleranceType',
      type: FieldType.string,
      defaultValue: '±',
    },
  ],
  events: {
    load: ({ dataSet }) => {
      if (!dataSet.length) {
        dataSet.loadData([{ leftChar: '(', rightChar: ')', valueType: 'single' }]);
        return;
      }
      dataSet.forEach(record => {
        if (record?.get('valueType') === 'section') {
          record?.set('multipleValue', {
            leftValue: record?.get('leftValue'),
            rightValue: record?.get('rightValue'),
          });
        } else {
          record?.set('multipleValue', record?.get('dataValue'));
        }
      });
    },
    update: ({ record, name }) => {
      switch (name) {
        case 'valueType':
        case 'leftValue':
        case 'rightValue':
        case 'leftChar':
        case 'rightChar':
        case 'multipleValue':
          handleUpdateRangeValue(record, name);
          break;
        default:
          break;
      }
    },
  },
});

const tableDS: () => DataSetProps = () => ({
  autoCreate: true,
  autoLocateFirst: true,
  dataKey: 'rows',
  selection: false,
  paging: false,
  fields: [
    { name: 'fieldCode', label: intl.get(`${modelPrompt}.formulaParams`).d('公式参数') },
    { name: 'fieldName', label: intl.get(`${modelPrompt}.formulaParamsDesc`).d('公式参数描述') },
    {
      name: 'inspectItemLov',
      label: intl.get(`${modelPrompt}.associatedItems`).d('关联项目'),
    },
    {
      name: 'isRequired',
    },
  ],
});

const handleUpdateRangeValue = (record, name) => {
  if (record.get('valueType') === 'section') {
    if (!record.get('leftChar')) {
      record.set('leftChar', '(');
    }
    if (!record.get('rightChar')) {
      record.set('rightChar', ')');
    }
    const regPos = /^[+-]?[0-9]+.?[0-9]*/;
    const leftValue = regPos.test(record.get('leftValue')) ? record.get('leftValue') : '-∞';
    const rightValue = regPos.test(record.get('rightValue')) ? record.get('rightValue') : '+∞';
    const leftChar = record.get('leftChar') === '(' ? '<' : '≤';
    const rightChar = record.get('rightChar') === ')' ? '<' : '≤';
    record.set('valueShow', `${leftValue}${leftChar}X${rightChar}${rightValue}`);
  } else if (name === 'valueType') {
    record.set('multipleValue', undefined);
  }
};

export { detailDS, numberListDS, tableDS };
