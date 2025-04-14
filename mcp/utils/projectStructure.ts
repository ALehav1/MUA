import fs from 'fs';
import path from 'path';
import { ValidationResult } from '../types/mcpTypes';

export async function validateProjectStructure(projectRoot: string): Promise<ValidationResult> {
  const requiredDirectories = [
    'src',
    'src/components',
    'src/pages',
    'src/hooks',
    'src/utils',
    'mcp',
    'mcp/client',
    'mcp/server',
    'mcp/types',
    'mcp/utils'
  ];

  const requiredFiles = [
    'package.json',
    'tsconfig.json',
    'src/App.tsx',
    'src/main.tsx',
    'mcp/server/index.ts',
    'mcp/client/mcpClient.ts'
  ];

  const errors: string[] = [];

  // Check required directories
  for (const dir of requiredDirectories) {
    const dirPath = path.join(projectRoot, dir);
    if (!fs.existsSync(dirPath)) {
      errors.push(`Missing required directory: ${dir}`);
    }
  }

  // Check required files
  for (const file of requiredFiles) {
    const filePath = path.join(projectRoot, file);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing required file: ${file}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
} 