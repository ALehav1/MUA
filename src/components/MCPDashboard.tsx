import React, { useState, useEffect } from 'react';
import { useMCP } from './MCPProvider';
import { ComponentMetrics } from '../../mcp/client/mcpClient';

export const MCPDashboard: React.FC = () => {
  const [components, setComponents] = useState<ComponentMetrics[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const mcp = useMCP();

  useEffect(() => {
    const updateMetrics = () => {
      const state = mcp.getState();
      setComponents(state.components);
    };

    // Update metrics every second
    const interval = setInterval(updateMetrics, 1000);
    return () => clearInterval(interval);
  }, [mcp]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Show MCP Dashboard
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white shadow-lg rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">MCP Dashboard</h2>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-2 rounded">
          <h3 className="font-semibold mb-2">Components</h3>
          <div className="space-y-2">
            {components.map((component) => (
              <div key={component.name} className="bg-white p-2 rounded shadow">
                <div className="font-medium">{component.name}</div>
                <div className="text-sm text-gray-600">
                  Renders: {component.renderCount}
                </div>
                <div className="text-sm text-gray-600">
                  Last Render: {component.lastRenderTime.toFixed(2)}ms
                </div>
                <div className="text-sm text-gray-600">
                  Mount Time: {component.mountTime.toFixed(2)}ms
                </div>
                <div className="text-sm text-gray-600">
                  Last Update: {new Date(component.lastUpdate).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 