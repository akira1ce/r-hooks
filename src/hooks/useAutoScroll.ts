import { RefObject, useEffect, useState } from 'react';

interface UseAutoScrollOptions {
  /* 触发自动滚动的依赖项 */
  dependencies?: any[];
  /* 判断是否在底部的阈值 */
  threshold?: number;
}

export const useAutoScroll = (target: RefObject<Element>, options: UseAutoScrollOptions = {}) => {
  const { dependencies = [], threshold = 1 } = options;

  const [enableAutoScroll, setEnableAutoScroll] = useState(true);

  /* 滚动到底部 */
  const scrollToBottom = () => {
    if (target.current && enableAutoScroll) {
      target.current.scrollTop = target.current.scrollHeight;
    }
  };

  /* 处理滚动事件 */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isScrolledToBottom =
      Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < threshold;
    setEnableAutoScroll(isScrolledToBottom);
  };

  /* 监听依赖项变化，自动滚动到底部 */
  useEffect(() => {
    scrollToBottom();
  }, dependencies);

  return {
    handleScroll,
    scrollToBottom,
    enableAutoScroll,
  };
};
