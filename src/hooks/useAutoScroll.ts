import { DependencyList, RefObject, useEffect, useState } from 'react';

export const useAutoScroll = (target: RefObject<Element>, deps: DependencyList = []) => {
  const [enableAutoScroll, setEnableAutoScroll] = useState(true);

  // 滚动到底部
  const scrollToBottom = () => {
    if (target.current) {
      target.current.scrollTop = target.current.scrollHeight;
    }
  };

  // 处理滚动事件
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isScrolledToBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;
    setEnableAutoScroll(isScrolledToBottom);
  };

  // 监听依赖项变化，自动滚动到底部
  useEffect(() => {
    enableAutoScroll && scrollToBottom();
  }, [...deps, enableAutoScroll]);

  return {
    handleScroll,
    scrollToBottom,
    enableAutoScroll,
  };
};
