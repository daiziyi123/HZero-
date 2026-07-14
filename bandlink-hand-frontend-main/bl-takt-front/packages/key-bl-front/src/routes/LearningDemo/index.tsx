/**
 * @Description: 学习示例页面 - 演示表格、弹框、组件使用
 * @Author: Assistant
 * @Date: 2026-06-10
 * 
 * 本页面用于学习如何：
 * 1. 创建新页面
 * 2. 使用 DataSet 和 Table 展示数据
 * 3. 实现增删改查功能
 * 4. 使用弹框组件
 * 5. 使用 useRequest 处理请求
 */

import React, { useMemo, useState } from 'react';
import {
  Table,
  DataSet,
  Button,
  Modal,
  Form,
  TextField,  // choerodon-ui/pro 使用 TextField 而不是 Input
  Select,
  DatePicker,
  TextArea,
} from 'choerodon-ui/pro';
import Chart from '@/utils/chart'; // 引入封装的图表组件
import { observer } from 'mobx-react-lite';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { TableQueryBarType, ColumnLock, ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { useRequest } from '@components/tarzan-hooks';
import formatterCollections from 'utils/intl/formatterCollections';

// 引入本地创建的 store 和 services
import { tableDS, modalDS } from './store/index';
import {
  fetchDemoData,
  saveDemoData,
  updateDemoData,
  deleteDemoData,
} from './services/index';

// 国际化配置前缀
const modelPrompt = 'tarzan.learningDemo';

/**
 * 主页面组件
 */
const LearningDemo = () => {
  // ========== 1. 创建 DataSet ==========
  // useMemo 确保 DataSet 只在组件首次渲染时创建
  const tableDs = useMemo(() => new DataSet(tableDS()), []);

  // ========== 2. 使用 useRequest 封装请求 ==========
  // manual: true 表示不自动执行，需要手动调用 run 方法
  // needPromise: true 表示 run 方法返回 Promise，可以 await
  const { run: runSave, loading: saveLoading } = useRequest(saveDemoData(), {
    manual: true,
    needPromise: true,
  });

  const { run: runUpdate, loading: updateLoading } = useRequest(updateDemoData(), {
    manual: true,
    needPromise: true,
  });

  // ========== 3. 弹框相关状态 ==========
  const [currentRecord, setCurrentRecord] = useState(null);
  let modalInstance = null;

  // ========== 3.5 图表数据（示例数据，实际可从接口获取）==========
  const chartData = useMemo(() => ({
    categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    barData: [120, 200, 150, 80, 70, 110, 130], // 柱状图数据
    lineData: [80, 120, 90, 60, 50, 90, 100],   // 折线图数据
  }), []);

  const chartOption = useMemo(() => ({
    title: {
      text: '柱状折线混合图示例',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        show: false, // 完全禁用指示器
      },
    },
    legend: {
      data: ['柱状图数据', '折线图数据'],
      top: '30px',
    },
    xAxis: {
      data: chartData.categories,
      axisLabel: {
        interval: 0,
        rotate: 30,
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '柱状图轴',
        position: 'left',
      },
      {
        type: 'value',
        name: '折线图轴',
        position: 'right',
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '柱状图数据',
        type: 'bar',
        data: chartData.barData,
        itemStyle: {
          // color: '#29BECE',
          color: '#4c7cf5',
        },
        barWidth: '20%',
        // 禁用高亮效果，防止柱子消失
        emphasis: {
          disabled: true, // 禁用鼠标移入时的高亮
        },
        // 或者自定义高亮效果
        // emphasis: {
        //   itemStyle: {
        //     opacity: 1, // 保持不透明
        //   },
        // },
      },
      {
        name: '折线图数据',
        type: 'line',
        yAxisIndex: 1, // 使用右侧 Y 轴
        data: chartData.lineData,
        itemStyle: {
          color: '#FE8530',
        },
        lineStyle: {
          width: 3,
        },
        symbol: 'circle',
        symbolSize: 8,
      },
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
  }), [chartData]);

  // ========== 4. 定义表格列配置 ==========
  const columns: ColumnProps[] = useMemo(() => [
    {
      // name 对应 DataSet fields 中的字段名
      name: 'demoCode',
      // header 自定义列头
      header: intl.get(`${modelPrompt}.demoCode`).d('编码'),
      // width 列宽
      width: 150,
      // lock 固定列
      lock: ColumnLock.left,
    },
    {
      name: 'demoName',
      header: intl.get(`${modelPrompt}.demoName`).d('名称'),
      width: 200,
    },
    {
      name: 'demoType',
      header: intl.get(`${modelPrompt}.demoType`).d('类型'),
      width: 120,
      // renderer 自定义渲染
      renderer: ({ value }) => {
        // 根据值显示不同的颜色标签
        const colors = {
          TYPE1: '#4c7cf5',
          TYPE2: '#f56c6c',
          TYPE3: '#67c23a',
        };
        return (
          <span style={{ color: colors[value] || '#909399', fontWeight: 'bold' }}>
            {value}
          </span>
        );
      },
    },
    {
      name: 'demoDate',
      header: intl.get(`${modelPrompt}.demoDate`).d('日期'),
      width: 150,
    },
    {
      name: 'remark',
      header: intl.get(`${modelPrompt}.remark`).d('备注'),
      // 超出长度省略
      width: 300,
    },
    // 新增列
    {
      name: 'demoStatus',
      header: intl.get(`${modelPrompt}.demoStatus`).d('状态'),
      width: 120,
    },
    {
      name: 'demoAmount',
      header: intl.get(`${modelPrompt}.demoAmount`).d('金额'),
      width: 120,
      align: ColumnAlign.right,
    },
    {
      name: 'demoFlag',
      header: intl.get(`${modelPrompt}.demoFlag`).d('标志'),
      width: 100,
      align: ColumnAlign.center,
    },
    {
      name: 'demoUser',
      header: intl.get(`${modelPrompt}.demoUser`).d('创建人'),
      width: 120,
    },
    {
      name: 'demoDept',
      header: intl.get(`${modelPrompt}.demoDept`).d('部门'),
      width: 150,
    },
    {
      // 操作列
      name: 'operation',
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 200,
      align: ColumnAlign.center,
      lock: ColumnLock.right, // 固定在右侧
      renderer: ({ record }) => {
        // 判断当前行是否处于编辑状态
        if (record && record.getState('editing')) {
          return (
            <>
              <Button
                funcType={FuncType.link}
                onClick={() => handleRowCancel(record)}
              >
                {intl.get('tarzan.common.button.cancel').d('取消')}
              </Button>
              <Button
                funcType={FuncType.link}
                color={ButtonColor.primary}
                loading={saveLoading || updateLoading}
                onClick={() => handleRowSave(record)}
              >
                {intl.get('tarzan.common.button.save').d('保存')}
              </Button>
            </>
          );
        }
        // 正常显示编辑和删除按钮
        return (
          <>
            <Button
              funcType={FuncType.link}
              onClick={() => handleRowEdit(record!)}
            >
              {intl.get('tarzan.common.button.edit').d('编辑')}
            </Button>
            <Button
              funcType={FuncType.link}
              color={ButtonColor.danger}
              onClick={() => handleRowDelete(record!)}
            >
              {intl.get('tarzan.common.button.delete').d('删除')}
            </Button>
          </>
        );
      },
    },
  ], []);

  // ========== 5. 处理函数 ==========

  /**
   * 检查是否已有新增中的行（防止重复新增）
   */
  const hasAddingRow = () => {
    return tableDs.records.some((r) => r.status === 'add');
  };

  /**
   * 新增行（表格内编辑模式）
   */
  const handleAdd = () => {
    if (hasAddingRow()) {
      notification.warning({ message: '请保存或取消当前新增的行' });
      return;
    }
    // 创建空记录，index: 0 表示插入到第一行
    const record = tableDs.create({}, 0);
    // 设置为编辑状态
    record.setState('editing', true);
  };

  /**
   * 新增（弹框模式）
   */
  const handleAddModal = () => {
    setCurrentRecord(null);
    // 创建弹框的 DataSet
    const tempModalDataSet = new DataSet(modalDS());
    tempModalDataSet.loadData([{}]);
    
    modalInstance = Modal.open({
      key: Modal.key(),
      title: '新增',
      destroyOnClose: true,
      width: 600,
      children: (
        <Form dataSet={tempModalDataSet} columns={1} labelWidth={100}>
          <TextField name="demoCode" label="编码" />
          <TextField name="demoName" label="名称" />
          <Select name="demoType" label="类型" />
          <DatePicker name="demoDate" label="日期" />
          <TextArea name="remark" label="备注" rows={4} />
          {/* 新增字段 */}
          <Select name="demoStatus" label="状态" />
          <TextField name="demoAmount" label="金额" type="number" />
          <TextField name="demoFlag" label="标志" type="boolean" />
          <TextField name="demoUser" label="创建人" />
          <TextField name="demoDept" label="部门" />
        </Form>
      ),
      okText: '保存',
      cancelText: '取消',
      onOk: async () => {
        const valid = await tempModalDataSet.validate();
        if (!valid) {
          return false; // 返回 false 阻止弹框关闭
        }
        const data = tempModalDataSet.current?.toData();
        const res = await runSave({ params: data });
        if (res && !res.failed) {
          notification.success({ message: '保存成功' });
          tableDs.query();
          return true; // 返回 true 关闭弹框
        } else {
          notification.error({ message: res?.message || '保存失败' });
          return false; // 返回 false 阻止弹框关闭
        }
      },
      onCancel: () => {
        // 取消时关闭弹框
      },
    });
  };

  /**
   * 编辑行
   */
  const handleRowEdit = (record) => {
    record.setState('editing', true);
  };

  /**
   * 取消编辑
   */
  const handleRowCancel = (record) => {
    if (record.status === 'add') {
      // 如果是新增状态，直接删除该行
      tableDs.remove(record);
    } else {
      // 如果是编辑状态，重置为原数据
      record.reset();
      record.setState('editing', false);
    }
  };

  /**
   * 保存行（新增或编辑）
   */
  const handleRowSave = async (record) => {
    try {
      // 1. 验证字段
      const valid = await record.validate();
      if (!valid) {
        return;
      }

      // 2. 获取行数据
      const data = record.toData();

      // 3. 判断是新增还是编辑
      const isAdd = record.status === 'add';

      // 4. 调用对应的接口
      const res = await (isAdd ? runSave({ params: data }) : runUpdate({ params: data }));

      // 5. 处理结果
      if (res && !res.failed) {
        notification.success({ message: intl.get('tarzan.common.message.saveSuccess').d('保存成功') });
        record.setState('editing', false);
        // 重新查询数据
        tableDs.query();
      } else {
        notification.error({ message: res?.message || '保存失败' });
      }
    } catch (e) {
      console.error('保存失败:', e);
      notification.error({ message: '保存失败，请重试' });
    }
  };

  /**
   * 删除行
   */
  const handleRowDelete = async (record) => {
    // 确认删除
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除 "${record.get('demoName')}" 吗？`,
      onOk: async () => {
        try {
          const res = await deleteDemoData([{ demoId: record.get('demoId') }]);
          if (res && !res.failed) {
            notification.success({ message: '删除成功' });
            tableDs.query();
          } else {
            notification.error({ message: res?.message || '删除失败' });
          }
        } catch (e) {
          notification.error({ message: '删除失败，请重试' });
        }
      },
    });
  };

  /**
   * 批量删除（选中行）
   */
  const handleBatchDelete = async () => {
    const selected = tableDs.selected;
    if (!selected || selected.length === 0) {
      notification.error({ message: '请先选择要删除的数据' });
      return;
    }

    Modal.confirm({
      title: '批量删除',
      content: `确定要删除选中的 ${selected.length} 条数据吗？`,
      onOk: async () => {
        try {
          const data = selected.map((r) => ({ demoId: r.get('demoId') }));
          const res = await deleteDemoData(data);
          if (res && !res.failed) {
            notification.success({ message: `成功删除 ${selected.length} 条数据` });
            tableDs.query();
          } else {
            notification.error({ message: res?.message || '删除失败' });
          }
        } catch (e) {
          notification.error({ message: '删除失败，请重试' });
        }
      },
    });
  };

  /**
   * 弹框编辑
   */
  const handleModalEdit = (record) => {
    setCurrentRecord(record);
    // 创建弹框的 DataSet
    const tempModalDataSet = new DataSet(modalDS());
    tempModalDataSet.loadData([record.toData()]);
    
    modalInstance = Modal.open({
      key: Modal.key(),
      title: '编辑',
      destroyOnClose: true,
      width: 600,
      children: (
        <Form dataSet={tempModalDataSet} columns={1} labelWidth={100}>
          <TextField name="demoCode" label="编码" />
          <TextField name="demoName" label="名称" />
          <Select name="demoType" label="类型" />
          <DatePicker name="demoDate" label="日期" />
          <TextArea name="remark" label="备注" rows={4} />
          {/* 新增字段 */}
          <Select name="demoStatus" label="状态" />
          <TextField name="demoAmount" label="金额" type="number" />
          <TextField name="demoFlag" label="标志" type="boolean" />
          <TextField name="demoUser" label="创建人" />
          <TextField name="demoDept" label="部门" />
        </Form>
      ),
      okText: '保存',
      cancelText: '取消',
      onOk: async () => {
        const valid = await tempModalDataSet.validate();
        if (!valid) {
          return false; // 返回 false 阻止弹框关闭
        }
        const data = tempModalDataSet.current?.toData();
        const res = await runUpdate({ params: { ...data, demoId: record.get('demoId') } });
        if (res && !res.failed) {
          notification.success({ message: '保存成功' });
          tableDs.query();
          return true; // 返回 true 关闭弹框
        } else {
          notification.error({ message: res?.message || '保存失败' });
          return false; // 返回 false 阻止弹框关闭
        }
      },
      onCancel: () => {
        // 取消时关闭弹框
      },
    });
  };

  // ========== 6. 渲染页面 ==========
  return (
    <div className="hmes-style">
      {/* 页面头部：标题和按钮 */}
      <Header title={intl.get(`${modelPrompt}.title`).d('学习示例页面')}>
        {/* 新增按钮（表格内编辑） */}
        <Button
          key="add"
          icon="add"
          onClick={handleAdd}
          color={ButtonColor.primary}
        >
          {intl.get('tarzan.common.button.create').d('新建')}
        </Button>

        {/* 新增按钮（弹框模式） */}
        <Button
          key="addModal"
          icon="playlist_add"
          onClick={handleAddModal}
          color={ButtonColor.success}
        >
          新增（弹框）
        </Button>

        {/* 批量删除按钮 */}
        <Button
          key="batchDelete"
          icon="delete"
          onClick={handleBatchDelete}
          color={ButtonColor.danger}
        >
          批量删除
        </Button>

        {/* 刷新按钮 */}
        <Button
          key="refresh"
          icon="refresh"
          onClick={() => tableDs.query()}
        >
          刷新
        </Button>
      </Header>

      {/* 页面内容区 */}
      <Content>
        <Table
          dataSet={tableDs}
          columns={columns}
          // 查询栏类型：filterBar | normal | none
          queryBar={TableQueryBarType.filterBar}
          // 查询栏配置  // 是否开启模糊查询
          queryBarProps={{ fuzzyQuery: false }}
          // 查询编码（用于保存查询条件）
          searchCode="LearningDemo_searchCode"
          // 个性化编码
          customizedCode="LearningDemo_customizedCode"
          // 多选配置
          selection={true}
          // 行高
          rowHeight={52}
        />

        {/* 柱状折线混合图 */}
        <div style={{ marginTop: 20, padding: 20, background: '#fff', borderRadius: 4, height: 400 }}>
          <Chart option={chartOption} />
        </div>
      </Content>
    </div>
  );
};

// 使用 formatterCollections 包裹，支持国际化
export default formatterCollections(
  { code: [modelPrompt, 'tarzan.common'] },
)(observer(LearningDemo));
