/**
 * @Description: 定时器
 * @Author: <ruiqi.jiang01@hand-china.com>
 * @Date: 2021-11-30 14:07:46
 * @LastEditTime: 2021-11-30 14:28:14
 * @LastEditors: <ruiqi.jiang01@hand-china.com>
 */

import { useRef, useEffect } from 'react';

const useInterval = (callback: Function, delay: number) => {
  const savedCallback = useRef<Function>();

  // 保存回调
  useEffect(() => {
    savedCallback.current = callback;
  }, []);

  // 建立 interval
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export default useInterval;
