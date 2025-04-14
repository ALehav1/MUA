import React, { useEffect, useState } from 'react';
import { useMCP } from '../hooks/useMCP';

export const MCPTest: React.FC = () => {
  const { trackComponentAdded, trackPerformance } = useMCP();
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Track component addition
    trackComponentAdded('MCPTest', 'src/components/MCPTest.tsx', ['useMCP']);

    // Track initial performance
    const startTime = performance.now();
    const mountTime = performance.now() - startTime;
    trackPerformance('MCPTest', {
      renderTime: 0,
      mountTime,
      updateTime: 0
    });
  }, [trackComponentAdded, trackPerformance]);

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">MCP Test Component</h2>
      <p className="mb-4">Count: {count}</p>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setCount(c => c + 1)}
      >
        Increment
      </button>
    </div>
  );
}; 