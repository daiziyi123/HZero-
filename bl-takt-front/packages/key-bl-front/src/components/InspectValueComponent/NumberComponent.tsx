/**
 * @Description: 检验项目维护-详情页
 * @Author: LI.YANG04@HAND-CHINA.COM
 * @Date: 2023/1/10 11:09
 */
import React from 'react';
import { Button, Col, DataSet, Dropdown, NumberField, Row, Tooltip, Menu, Form } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { observer } from 'mobx-react';
import { Size } from 'choerodon-ui/lib/_util/enum';
import { FuncType } from 'choerodon-ui/pro/lib/button/enum';
import cs from 'classnames';
import Decimal from 'decimal.js';
import styles from './index.module.less';

const modelPrompt = 'tarzan.hwms.inspectItemMaintain';

interface NumberComponentProps {
  name: string;
  parentDs: DataSet | undefined;
  dataSet: DataSet;
  disabled: boolean;
  showStandard: boolean;
  canEdit: boolean;
  dataType?: string | undefined;
  handleUpdateDisabled: () => void;
  handleUpdateWarning?: () => void;
}

const { ItemGroup } = Form;

const NumberComponent = observer((props: NumberComponentProps) => {
  const {
    dataSet,
    disabled,
    canEdit,
    name,
    handleUpdateDisabled,
    handleUpdateWarning,
    showStandard,
  } = props;
  const currentDisabled = disabled || !canEdit;

  const updateDataValue = (record) => {
    const {
      valueType,
      multipleValue,
      leftValue: originLeftValue,
      rightValue: originRightValue,
      leftChar,
      rightChar,
      toleranceType,
      standard,
      tolerance,
    } = record.toData();
    let _val: any = null;
    const regPos = /^[+-]?[0-9]+.?[0-9]*/;
    if (valueType === 'single') {
      _val = multipleValue;
      record.set('dataValue', _val);
      record.set('standard', undefined);
    } else if (valueType === 'section') {
      if (originLeftValue || originRightValue) {
        const leftValue = regPos.test(originLeftValue) ? originLeftValue : '-∞';
        const rightValue = regPos.test(originRightValue) ? originRightValue : '+∞';
        _val = `${leftChar}${leftValue},${rightValue}${rightChar}`;
      }
      record.set('dataValue', _val);
    } else if (valueType === 'tolerance') {
      if (toleranceType && regPos.test(standard) && regPos.test(tolerance)) {
        let leftValue = new Decimal(standard).sub(new Decimal(tolerance)).toNumber();
        let rightValue = new Decimal(standard).add(new Decimal(tolerance)).toNumber();
        if (toleranceType === '±') {
          leftValue = new Decimal(standard).sub(new Decimal(tolerance)).toNumber();
          rightValue = new Decimal(standard).add(new Decimal(tolerance)).toNumber();
        } else if (toleranceType === '+') {
          leftValue = standard;
          rightValue = new Decimal(standard).add(new Decimal(tolerance)).toNumber();
        } else if (toleranceType === '-') {
          leftValue = new Decimal(standard).sub(new Decimal(tolerance)).toNumber();
          rightValue = standard;
        }
        record.set({
          dataValue: `[${leftValue},${rightValue}]`,
          leftChar: '[',
          leftValue,
          rightChar: ']',
          rightValue,
          valueShow: `${leftValue}≤X≤${rightValue}`,
        });
      } else {
        record.set({
          dataValue: null,
          leftChar: '[',
          leftValue: '',
          rightChar: ']',
          rightValue: '',
          valueShow: '≤X≤',
        });
      }
    }
    handleUpdateDisabled();
    if (name === 'trueValue' && handleUpdateWarning) {
      handleUpdateWarning();
    }
  };

  // 切换单值/范围的回调
  const handleMenuClick = (record, key) => {
    record.set('valueType', key);
    record.set('standard', undefined);
    record.set('tolerance', undefined);
    if (key === 'tolerance') {
      record.set('toleranceType', '±');
    }
    updateDataValue(record);
  };

  // 切换区间开闭的回调
  const handleChangeChar = (record, name) => {
    switch (record.get(name)) {
      case '(':
        record.set(name, '[');
        break;
      case '[':
        record.set(name, '(');
        break;
      case ')':
        record.set(name, ']');
        break;
      default:
        record.set(name, ')');
    }
    updateDataValue(record);
  };

  const handleCreate = () => {
    dataSet.create();
    handleUpdateDisabled();
    if (name === 'trueValue' && handleUpdateWarning) {
      handleUpdateWarning();
    }
  };

  const handleRemove = record => {
    dataSet.remove(record);
    handleUpdateDisabled();
    if (name === 'trueValue' && handleUpdateWarning) {
      handleUpdateWarning();
    }
  };

  const getTypeMenu = record => (
    <Menu className={styles['split-menu']} style={{ width: '100px' }} onClick={({key}) => handleMenuClick(record, key)}>
      <Menu.Item key="single">
        <a target="_blank" rel="noopener noreferrer">
          {intl.get(`${modelPrompt}.button.single`).d('单值')}
        </a>
      </Menu.Item>
      <Menu.Item key="section">
        <a target="_blank" rel="noopener noreferrer">
          {intl.get(`${modelPrompt}.button.section`).d('区间')}
        </a>
      </Menu.Item>
      <Menu.Item key="tolerance">
        <a target="_blank" rel="noopener noreferrer">
          {intl.get(`${modelPrompt}.button.tolerance`).d('公差')}
        </a>
      </Menu.Item>
    </Menu>
  );

  const handleChangeToleranceType = (record, key) => {
    record?.set('toleranceType', key);
    updateDataValue(record);
  };

  const getToleranceMenu = record => (
    <Menu className={cs(styles['dropdown-menu'], styles['split-menu'])} style={{ width: '100px', fontSize: '16px' }} onClick={({ key }) => handleChangeToleranceType(record, key)}>
      <Menu.Item key="±">
        <a target="_blank" rel="noopener noreferrer">
          {intl.get(`${modelPrompt}.button.addAndSub`).d('±')}
        </a>
      </Menu.Item>
      <Menu.Item key="+">
        <a target="_blank" rel="noopener noreferrer">
          {intl.get(`${modelPrompt}.button.add`).d('+')}
        </a>
      </Menu.Item>
      <Menu.Item key="-">
        <a target="_blank" rel="noopener noreferrer">
          {intl.get(`${modelPrompt}.button.sub`).d('-')}
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Row>
      {dataSet.map((record, index) => (
        <>
          <Col className={styles['number-col']} key={record.key}>
            {!currentDisabled && (
              <Dropdown
                overlay={() => getTypeMenu(record)}
              >
                <div
                  className={cs(styles['tag-change-button'], {
                    [styles['tag-change-button-tolerance']]: record.get('valueType') === 'tolerance',
                  })}
                >
                  {record.get('valueType') === 'single'
                    ? 'X'
                    : record.get('valueType') === 'section'
                      ? '(X)'
                      : '±'}
                </div>
              </Dropdown>
            )}
            <div className={styles['input-number-inner']}>
              {record?.get('valueType') !== 'tolerance' && (
                <NumberField
                  name="multipleValue"
                  record={record}
                  disabled={currentDisabled}
                  style={{ width: '100%' }}
                  onChange={() => updateDataValue(record)}
                  prefix={
                    record.get('valueType') === 'section' &&
                    (!currentDisabled ? (
                      <Tooltip
                        title={
                          record.get('rightChar') === '('
                            ? intl.get(`${modelPrompt}.contain`).d('点击切换为包含')
                            : intl.get(`${modelPrompt}.not.contain`).d('点击切换为不包含')
                        }
                      >
                        <div
                          className={styles['char-style']}
                          onClick={() => handleChangeChar(record, 'leftChar')}
                        >
                          {record.get('leftChar')}
                        </div>
                      </Tooltip>
                    ) : (
                      <div>{record.get('leftChar')}</div>
                    ))
                  }
                  suffix={
                    record.get('valueType') === 'section' &&
                    (!currentDisabled ? (
                      <Tooltip
                        title={
                          record.get('rightChar') === ')'
                            ? intl.get(`${modelPrompt}.contain`).d('点击切换为包含')
                            : intl.get(`${modelPrompt}.not.contain`).d('点击切换为不包含')
                        }
                      >
                        <div
                          className={styles['char-style']}
                          onClick={() => handleChangeChar(record, 'rightChar')}
                        >
                          {record.get('rightChar')}
                        </div>
                      </Tooltip>
                    ) : (
                      <div>{record.get('rightChar')}</div>
                    ))
                  }
                />
              )}
              {record?.get('valueType') === 'tolerance' && (
                <ItemGroup compact>
                  <NumberField name="standard" record={record} style={{ width: '47%' }} onChange={() => updateDataValue(record)} />
                  <div style={{ width: '6%', textAlign: 'center' }}>
                    <Dropdown
                      overlay={() => getToleranceMenu(record)}
                    >
                      <Button funcType={FuncType.link} style={{ fontSize: '16px' }}>
                        {record?.get('toleranceType')}
                      </Button>
                    </Dropdown>
                  </div>
                  <NumberField name="tolerance" record={record} style={{ width: '47%' }} onChange={() => updateDataValue(record)} />
                </ItemGroup>
              )}
              {showStandard && record.get('valueType') === 'section' && (
                <NumberField
                  placeholder={intl.get(`${modelPrompt}.standard`).d('标准值')}
                  name="standard"
                  record={dataSet.get(index)}
                />
              )}
            </div>
            {!currentDisabled && (
              <Button
                icon="remove"
                size={Size.small}
                funcType={FuncType.flat}
                disabled={dataSet.length === 1}
                onClick={() => handleRemove(record)}
              />
            )}
            {!currentDisabled && (
              <Button
                icon="add"
                size={Size.small}
                funcType={FuncType.flat}
                style={{ visibility: index === 0 ? 'visible' : 'hidden' }}
                onClick={handleCreate}
              />
            )}
          </Col>
          {record.get('valueType') !== 'single' && (
            <div
              className={styles['detail-shows']}
              style={{ paddingLeft: currentDisabled ? 0 : '25px' }}
            >
              {record.get('valueShow')}
            </div>
          )}
        </>
      ))}
    </Row>
  );
});

export default NumberComponent;
