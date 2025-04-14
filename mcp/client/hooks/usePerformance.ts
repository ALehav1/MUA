import { useEffect, useRef } from 'react';
import { mcpClient } from '../mcpClient';

export const usePerformance = (componentName: string) => {
  const mountTime = useRef<number>(0);
  const lastRenderTime = useRef<number>(0);

  useEffect(() => {
    // Track component mount
    mountTime.current = performance.now();
    mcpClient.trackPerformance(componentName, {
      renderTime: 0,
      mountTime: mountTime.current,
      updateTime: 0
    });

    // Track component unmount
    return () => {
      const unmountTime = performance.now();
      mcpClient.trackPerformance(componentName, {
        renderTime: unmountTime - lastRenderTime.current,
        mountTime: mountTime.current,
        updateTime: unmountTime - mountTime.current
      });
    };
  }, [componentName]);

  useEffect(() => {
    // Track re-renders
    const now = performance.now();
    const renderTime = now - lastRenderTime.current;
    lastRenderTime.current = now;

    if (mountTime.current !== 0) { // Skip initial mount
      mcpClient.trackPerformance(componentName, {
        renderTime,
        mountTime: mountTime.current,
        updateTime: now - mountTime.current
      });
    }
  });
}; 