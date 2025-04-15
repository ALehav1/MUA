import { useContext } from 'react';
import { MCPContext } from './MCPContext';

export const useMCP = () => {
  const context = useContext(MCPContext);
  if (!context) {
    throw new Error('useMCP must be used within an MCPProvider');
  }
  return context;
};
