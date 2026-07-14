export const BASE_SERVER = process.env.BASE_SERVER || '/key-focus-aps';

export const API_HOST = process.env.API_HOST || 'http://172.22.3.195:30080';

/* 默认前后端交互格式-日期 */
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

/* 默认前后端交互格式-日期时间 */
export const DEFAULT_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/* 默认前后端交互格式-时间 */
export const DEFAULT_TIME_FORMAT = 'HH:mm:ss';

/* 特定格式的日期处理格式，时分秒指定为00:00:00 */
export const DATETIME_MIN = 'YYYY-MM-DD 00:00:00';

/* 特定格式的日期处理格式，时分秒指定为23:59:59 */
export const DATETIME_MAX = 'YYYY-MM-DD 23:59:59';

/* 方法调用时，防反跳时间 */
export const DEBOUNCE_TIME = 200;

/* 指定每页可以显示多少条，第一个值需保持与 GLOBAL_PAGE_SIZE 一致 */
export const PAGE_SIZE_OPTIONS = ['20', '50', '100', '200', '500', '1000', '3000', '5000'];

/* 获取默认的分页大小配置 */
export const PAGE_SIZE =
  sessionStorage.getItem('PAGE_SIZE') !== null
    ? parseInt(sessionStorage.getItem('PAGE_SIZE'), 10)
    : 100;

/* 模态框默认置顶间距 */
export const MODAL_DEFAULT_POSITION = { top: 30 };

// 按钮背景颜色
export const CustomButtonColors = {
  orange: 'rgb(230,162,60)',
  blue: 'rgb(64,158,255)',
  red: 'rgb(245,108,108)',
  green: 'rgb(103,194,58)',
  MediumVioletRed: 'rgb(199,21,133)', // 适中的紫罗兰红色
  BlueViolet: 'rgb(138,43,226)',

  import: 'rgb(103,194,58)', // 导入-绿
  add: 'rgb(64,158,255)', // 新建-蓝
  release: 'rgb(245,108,108)', // 发布-红
  cancel: 'rgb(199,21,133)', // 取消-适中的紫罗兰红色
  done: 'rgb(230,162,60)', // 完成-橙

  grey: 'rgb(192,192,192)', // 禁用时的灰色
};