/**
 * @Description: 检验项目维护-详情页组件
 * @Author: LI.YANG04@HAND-CHINA.COM
 * @Date: 2023/2/1 16:28
 */
import React, {
  useState,
  useEffect,
  useMemo,
  DependencyList,
} from 'react';
import {
  Form,
  DataSet,
  Select,
  TextField,
  NumberField,
  Lov,
  Table,
  DatePicker,
} from 'choerodon-ui/pro';
import { Collapse } from 'choerodon-ui';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { observer } from 'mobx-react';
import { useRequest } from '@components/tarzan-hooks';
import { getCurrentOrganizationId } from 'utils/utils';
import NumberComponent from './NumberComponent';
import { detailDS, numberListDS, tableDS } from './stores/DetailDS';
import { FetchRuleCodeDetailConfig } from '@/utils';

const tenantId = getCurrentOrganizationId();

const { Panel } = Collapse;
const { Option } = Select;
const modelPrompt = 'tarzan.hwms.inspectItemMaintain';

const useDataSetEvent = (
  ds: DataSet,
  eventName: string,
  eventListener: CallableFunction,
  deps: DependencyList,
) => {
  useEffect(() => {
    ds.addEventListener(eventName, eventListener);
    return () => {
      ds.removeEventListener(eventName, eventListener);
    };
  }, deps);
};

const DetailComponent = (props) => {
  const {
    kid,
    canEdit,
    requiredField = [],
    validateType = '',
    initData,
    needDefault,
    handleChangeOutputParams,
    setEventFunction,
  } = props;

  const [trueValueDisabled, setTrueDisabled] = useState<boolean>(true);
  const [falseValueDisabled, setFalseDisabled] = useState<boolean>(true);
  const [warningValueDisabled, setWarningDisabled] = useState<boolean>(true);
  const [currentDataType, setDataType] = useState<string>('');
  const detailDs = useMemo(() => new DataSet(detailDS(requiredField, validateType)), [kid]);
  const trueNumberDs = useMemo(() => new DataSet(numberListDS()), [kid]);
  const falseNumberDs = useMemo(() => new DataSet(numberListDS()), [kid]);
  const warningNumberDs = useMemo(() => new DataSet(numberListDS()), [kid]);

  const tableDs = useMemo(() => new DataSet(tableDS()), [kid]);

  const { run: fetchRuleCodeDetail, loading: fetchRuleCodeDetailLoading } = useRequest(
    FetchRuleCodeDetailConfig(),
    {
      manual: true,
      needPromise: true,
    },
  );

  const submit = async () => {
    const validateFlag = await detailDs.validate();
    if (!validateFlag) {
      handleChangeOutputParams({
        property: 'success',
        data: false,
      });
      return false;
    }
    // 数值类型的符合值、不符合值必输校验
    let validValueTypeFlag = true;
    const dataType = detailDs.current?.get('dataType');
    if (['CALCULATE_FORMULA', 'VALUE'].includes(dataType)) {
      const trueValidValue = trueNumberDs.records.filter(item => item.get('dataValue'));
      const falseValidValue = falseNumberDs.records.filter(item => item.get('dataValue'));
      if (
        trueValidValue.length === 0 &&
        falseValidValue.length === 0 &&
        requiredField.length > 0
      ) {
        notification.error({
          message: intl
            .get(`${modelPrompt}.message.inputTrueOrFalseValue`)
            .d('请输入符合值或不符合值'),
        });
        validValueTypeFlag = false;
      }
    }
    if (!validValueTypeFlag) {
      handleChangeOutputParams({
        property: 'success',
        data: false,
      });
      return false;
    }

    handleChangeOutputParams({
      property: 'success',
      data: true,
    });
    handleChangeOutputParams({
      property: 'dataInfo',
      data: formatData(),
    });
  };

  useEffect(() => {
    setEventFunction?.('submit', submit);
    detailDs.loadData([initData]);
    handleValueList();
    handleUpdateDisabled();
  }, [initData]);

  // 处理符合值/不符合值/预警值数据
  const handleValueList = () => {
    const {
      dataType,
      trueValueList,
      falseValueList,
      warningValueList,
      formulaList,
    } = detailDs.current?.toData();
    setDataType(dataType);
    if (['CALCULATE_FORMULA', 'VALUE'].includes(dataType)) {
      trueNumberDs.loadData(trueValueList);
      falseNumberDs.loadData(falseValueList);
      warningNumberDs.loadData(warningValueList);
      tableDs.loadData(formulaList);
    } else {
      detailDs.current!.set('trueValue', formatValueList(dataType, trueValueList));
      detailDs.current!.set('falseValue', formatValueList(dataType, falseValueList));
    }
  };

  const formatValueList = (dataType, dataSource) => {
    switch (dataType) {
      case 'DECISION_VALUE':
      case 'TEXT':
        return dataSource?.length ? dataSource[0].dataValue : undefined;
      case 'VALUE_LIST':
        return dataSource?.map(item => item.dataValue);
      default:
        return null;
    }
  };

  const handleUpdateDisabled = () => {
    const { dataType } = detailDs.current?.toData();
    const trueValue = trueNumberDs.current?.get('multipleValue');
    const falseValue = falseNumberDs.current?.get('multipleValue');
    const _isTrueValueEdit = trueNumberDs.length > 1 || verifyHasValue(trueValue);
    const _isFalseValueEdit = falseNumberDs.length > 1 || verifyHasValue(falseValue);
    // 数据类型为“数值”： 符合值与不符合值可输入，且二者选其一，预警值只有在有符合值时才可输入
    if (['CALCULATE_FORMULA', 'VALUE'].includes(dataType)) {
      setTrueDisabled(_isFalseValueEdit);
      setFalseDisabled(_isTrueValueEdit);
      setWarningDisabled(!_isTrueValueEdit);
    } else {
      setTrueDisabled(true);
      setFalseDisabled(true);
      setWarningDisabled(true);
    }
  };

  useDataSetEvent(
    detailDs,
    'update',
    ({ name, record, value }) => {
      switch (name) {
        case 'dataType':
          setDataType(value);
          record.init('uomLov', {});
          record.init('decimalNumber', undefined);
          record.init('processMode', undefined);
          record.init('valueLists', undefined);
          record.init('recordNumber', undefined);
          record.init('trueValue', undefined);
          record.init('falseValue', undefined);
          record.init('defaultValue', undefined);

          // 计算公式相关
          tableDs.loadData([]);
          record.init('formulaLov', undefined);
          record.init('dimension', undefined);

          if (value === 'CALCULATE_FORMULA') {
            record.init('enterMethod', 'AUTOMATIC_COLLECTION');
            record.init('samplingMethodLov', undefined);
            record.init('employeePosition', undefined);
            record.init('inspectFrequency', undefined);
            record.init('frequencyParams', undefined);
            record.init('sameGroupIdentification', undefined);
            record.init('outsourceFlag', 'N');
            record.init('destructiveExperimentFlag', 'N');
          }

          trueNumberDs.loadData([{ leftChar: '[', rightChar: ']', valueType: 'single' }]);
          falseNumberDs.loadData([{ leftChar: '[', rightChar: ']', valueType: 'single' }]);
          warningNumberDs.loadData([{ leftChar: '[', rightChar: ']', valueType: 'single' }]);
          handleUpdateDisabled();
          break;
        case 'valueLists':
          record.init('trueValue', undefined);
          record.init('falseValue', undefined);
          break;
        case 'inspectFrequency':
          record.init('m', undefined);
          record.init('n', undefined);
          break;
        case 'formulaLov':
          formulaLovChange(value);
          break;
        default:
          break;
      }
    },
    [kid],
  );

  const handleUpdateWarning = () => {
    if (!verifyHasValue(trueNumberDs.current?.get('multipleValue'))) {
      warningNumberDs.loadData([{ leftChar: '[', rightChar: ']', valueType: 'single' }]);
    }
  };

  useDataSetEvent(
    trueNumberDs,
    'update',
    () => {
      handleUpdateDisabled();
      handleUpdateWarning();
    },
    [kid],
  );

  useDataSetEvent(falseNumberDs, 'update', handleUpdateDisabled, [kid]);

  const formatData = () => {
    const data = detailDs!.current!.toData();
    const _trueValueList = trueNumberDs.toData().filter((i: any) => i.dataValue).map((item: any) => ({
      ...item,
      dataValue: String(item.dataValue),
    }));
    const _falseValueList = falseNumberDs.toData().filter((i: any) => i.dataValue).map((item: any) => ({
      ...item,
      dataValue: String(item.dataValue),
    }));
    const _warningValueList = warningNumberDs.toData().filter((i: any) => i.dataValue).map((item: any) => ({
      ...item,
      dataValue: String(item.dataValue),
    }));
    switch (data.dataType) {
      case 'VALUE':
        data.trueValueList = _trueValueList;
        data.falseValueList = _falseValueList;
        data.warningValueList = _warningValueList;
        break;
      case 'CALCULATE_FORMULA':
        data.trueValueList = _trueValueList;
        data.falseValueList = _falseValueList;
        data.warningValueList = _warningValueList;
        break;
      case 'VALUE_LIST':
        data.trueValueList = data.trueValue?.map(item => ({ dataValue: item }));
        data.falseValueList = data.falseValue?.map(item => ({ dataValue: item }));
        break;
      case 'TEXT':
      case 'DECISION_VALUE':
        data.trueValueList = [{ dataValue: data.trueValue }];
        data.falseValueList = [{ dataValue: data.falseValue }];
        break;
      default:
        break;
    }
    if (data.dataType === 'CALCULATE_FORMULA') {
      data.formula = JSON.stringify({
        formulaId: data.formulaId,
        formulaCode: data.formulaCode,
        formulaName: data.formulaName,
        dimension: data.dimension,
        formulaList: data.formulaList,
      });
    } else {
      data.formula = '';
    }
    return data;
  };

  // 根据值类型不同使用不同的判空方法
  const verifyHasValue = value => {
    if (value instanceof Object) {
      // 数据类型为数值-区间
      return value?.leftValue || value?.rightValue;
    }
    // 数据类型为数值-单值
    return value;
  };

  const formulaLovChange = async value => {
    if (value) {
      const { ruleCode } = value;
      const ruleCodeDetail = await fetchRuleCodeDetail({
        params: {
          ruleCode,
          tenantId,
        },
      });
      if (ruleCodeDetail && typeof ruleCodeDetail === 'object') {
        const newRuleCodeDetail = ruleCodeDetail.map(item => {
          return {
            fieldCode: item.fieldCode,
            fieldName: item.fieldName,
            isRequired: item.fieldCode === 'decimalNumber' ? 'N' : item.isRequired,
          };
        });
        detailDs?.current?.set('formulaList', newRuleCodeDetail);
        tableDs.loadData(newRuleCodeDetail);
      } else {
        detailDs?.current?.set('formulaList', undefined);
      }
    } else {
      detailDs?.current?.set('formulaList', undefined);
    }
  };

  const ValueListInput = observer(props => {
    const { dataSet, name } = props;
    const dataType = dataSet?.current?.get('dataType');
    if (dataType === 'VALUE_LIST') {
      const valueLists = dataSet?.current?.get('valueLists') || [];
      if (name === 'defaultValue') {
        return (
          <Select name={name} dataSet={dataSet} style={{ width: '100%' }}>
            {valueLists.map(item => (
              <Option value={item}>{item}</Option>
            ))}
          </Select>
        );
      }
      return (
        <Select name={name} dataSet={dataSet} multiple style={{ width: '100%' }}>
          {valueLists.map(item => (
            <Option value={item}>{item}</Option>
          ))}
        </Select>
      );
    }
    if (dataType === 'DECISION_VALUE') {
      const _data: any = [];
      const _trueValue = dataSet?.current?.get('trueValue');
      const _falseValue = dataSet?.current?.get('falseValue');
      if (_trueValue) {
        _data.push(_trueValue);
      }
      if (_falseValue) {
        _data.push(_falseValue);
      }
      return (
        <Select name={name} dataSet={dataSet} style={{ width: '100%' }}>
          {_data.map(item => (
            <Option value={item}>{item}</Option>
          ))}
        </Select>
      );
    }
    return <Select name={name} dataSet={dataSet} style={{ width: '100%' }}></Select>;
  });

  const tableColumns = [
    {
      name: 'fieldCode',
    },
    {
      name: 'fieldName',
    },
    {
      name: 'inspectItemLov',
    },
  ];

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={['dataInfo', 'formula']}
    >
      <Panel key="dataInfo" header={intl.get(`${modelPrompt}.title.dataInfo`).d('数据信息')}>
        <Form dataSet={detailDs} columns={3} disabled={canEdit === 'false'}>
          <Select name="enterMethod" />
          <Select
            name="dataType"
            onChange={val => {
              setDataType(val);
              handleUpdateDisabled();
            }}
            // optionsFilter={record =>
            //   ['InspectionPlatform', 'InspectionPlatformCreateItem'].includes(validateType)
            //     ? record?.get('value') !== 'CALCULATE_FORMULA'
            //     : true
            // }
            optionsFilter={record => {
              return record.get('value') !== 'CALCULATE_FORMULA';
            }}
          />
          <TextField name="valueLists" />
          <Lov name="uomLov" />
          <NumberField name="decimalNumber" />
          <Select name="processMode" />
          {['VALUE', 'CALCULATE_FORMULA'].includes(currentDataType) && (
            <>
              <NumberComponent
                showStandard
                name="trueValue"
                parentDs={detailDs}
                dataSet={trueNumberDs}
                disabled={trueValueDisabled}
                canEdit={canEdit !== 'false'}
                handleUpdateDisabled={handleUpdateDisabled}
                handleUpdateWarning={handleUpdateWarning}
              />
              <NumberComponent
                showStandard={false}
                name="falseValue"
                parentDs={detailDs}
                dataSet={falseNumberDs}
                disabled={falseValueDisabled}
                canEdit={canEdit !== 'false'}
                handleUpdateDisabled={handleUpdateDisabled}
              />
            </>
          )}
          {currentDataType === 'VALUE_LIST' && (
            <>
              <ValueListInput name="trueValue" dataSet={detailDs} />
              <ValueListInput name="falseValue" dataSet={detailDs} />
            </>
          )}
          {!['VALUE', 'VALUE_LIST', 'CALCULATE_FORMULA'].includes(currentDataType) && (
            <>
              <TextField name="trueValue" />
              <TextField name="falseValue" />
            </>
          )}
          <NumberComponent
            showStandard={false}
            name="warningValue"
            parentDs={detailDs}
            dataSet={warningNumberDs}
            disabled={warningValueDisabled}
            canEdit={canEdit !== 'false'}
            handleUpdateDisabled={handleUpdateDisabled}
          />

          {needDefault !== 'false' && currentDataType === 'VALUE' && <NumberField name="defaultValue" />}
          {needDefault !== 'false' && currentDataType === 'DATE' && <DatePicker name="defaultValue" />}
          {needDefault !== 'false' && currentDataType === 'DECISION_VALUE' && (
            <ValueListInput name="defaultValue" dataSet={detailDs} />
          )}
          {needDefault !== 'false' && currentDataType === 'VALUE_LIST' && (
            <ValueListInput name="defaultValue" dataSet={detailDs} />
          )}

          {needDefault !== 'false' && (currentDataType === 'TEXT' || !currentDataType) && (
            <TextField name="defaultValue" />
          )}
          {needDefault !== 'false' && <Select name="dataQtyDisposition" />}

          {currentDataType === 'CALCULATE_FORMULA' && (
            <>
              <Lov name="formulaLov" disabled={fetchRuleCodeDetailLoading} />
              <Select name="dimension" />
            </>
          )}
        </Form>
      </Panel>
      {currentDataType === 'CALCULATE_FORMULA' && (
        <Panel
          key="formula"
          header={intl.get(`${modelPrompt}.formulaParams`).d('计算公式参数')}
        >
          <Table
            dataSet={tableDs}
            columns={tableColumns}
            filter={record => {
              return record.get('fieldCode') !== 'decimalNumber';
            }}
          />
        </Panel>
      )}
    </Collapse>
  );
};

export default DetailComponent;
