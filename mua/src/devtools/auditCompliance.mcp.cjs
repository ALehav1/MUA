/**
 * auditCompliance.mcp.cjs
 * 
 * Script: MCP-driven compliance audit for Moody's Underwriting Assistant (MUA)
 * Purpose: Scans the project directory for compliance with documented structure and naming conventions, logs the audit result via MCP protocol.
 *
 * Usage: node src/devtools/auditCompliance.mcp.cjs
 *
 * Dependencies:
 * - Node.js (>=16)
 * - guidelines.json (for rules)
 *
 * Author: Cascade (AI)
 * Date: 2025-04-15
 */

const fs = require('fs');
const path = require('path');

// Load guidelines for structure/naming rules
const guidelinesPath = path.resolve(__dirname, '../../data/guidelines.json');
let guidelines = {};
try {
  guidelines = JSON.parse(fs.readFileSync(guidelinesPath, 'utf-8'));
} catch (err) {
  console.error('ERROR: Could not load guidelines.json:', err);
  process.exit(1);
}

// Define root project path
const projectRoot = path.resolve(__dirname, '../../');

// Example rules (expand as needed)
const requiredDirs = guidelines.requiredDirs || ['src', 'data', 'docs', 'public'];
const requiredFiles = guidelines.requiredFiles || ['README.md', 'package.json'];

// Collect findings
const findings = [];

// Check required directories
requiredDirs.forEach((dir) => {
  const dirPath = path.join(projectRoot, dir);
  if (!fs.existsSync(dirPath) || !fs.lstatSync(dirPath).isDirectory()) {
    findings.push(`Missing required directory: ${dir}`);
  }
});

// Check required files
requiredFiles.forEach((file) => {
  const filePath = path.join(projectRoot, file);
  if (!fs.existsSync(filePath) || !fs.lstatSync(filePath).isFile()) {
    findings.push(`Missing required file: ${file}`);
  }
});

// Example: Check naming conventions for components and hooks (expand as needed)
const componentsDir = path.join(projectRoot, 'src/components');
if (fs.existsSync(componentsDir)) {
  fs.readdirSync(componentsDir).forEach((file) => {
    // Allow PascalCase for components and camelCase for hooks (files starting with 'use')
    if (!/^([A-Z][A-Za-z0-9]+|use[A-Z][A-Za-z0-9]+)\.(tsx|ts)$/.test(file)) {
      findings.push(`Component/hook file does not follow naming convention: ${file}`);
    }
  });
}

// === TEST & MOCKS COMPLIANCE CHECKS ===

// 1. Check for test directory
const testsDir = path.join(projectRoot, 'src/__tests__');
if (!fs.existsSync(testsDir)) {
  findings.push(
    'WARNING: Directory src/__tests__ is missing. TODO: Create this directory for all test files as per guidelines.'
  );
} else {
  // 2. Check for mocks directory
  const mocksDir = path.join(testsDir, 'test-utils/mocks');
  if (!fs.existsSync(mocksDir)) {
    findings.push(
      'WARNING: Directory src/__tests__/test-utils/mocks/ is missing. TODO: Create and organize mocks by type (ui.tsx, api.ts, etc.).'
    );
  } else {
    // 3. Check for index.ts in mocks
    if (!fs.existsSync(path.join(mocksDir, 'index.ts'))) {
      findings.push(
        'WARNING: index.ts missing in mocks directory. TODO: Export all mocks centrally via index.ts.'
      );
    }
    // 4. Check that all mocks are TypeScript and separated by type
    fs.readdirSync(mocksDir).forEach((mockFile) => {
      if (mockFile !== 'index.ts' && !mockFile.endsWith('.ts') && !mockFile.endsWith('.tsx')) {
        findings.push(
          `WARNING: Mock file ${mockFile} is not a TypeScript file. TODO: Convert all mocks to .ts or .tsx.`
        );
      }
      // Optionally, check for type-based separation (e.g., ui.tsx, api.ts)
    });
  }

  // 5. Check test file naming and mock import
  const testFiles = [];
  function findTestFiles(dir) {
    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file);
      // Exclude index.ts and index.tsx from test file naming checks
      if (file === 'index.ts' || file === 'index.tsx') {
        return;
      }
      if (fs.lstatSync(fullPath).isDirectory()) {
        findTestFiles(fullPath);
      } else if (file.endsWith('.test.ts') || file.endsWith('.test.tsx') || file.endsWith('.spec.ts') || file.endsWith('.spec.tsx')) {
        testFiles.push(fullPath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        findings.push(
          `WARNING: Test file ${file} does not follow naming convention (*.test.ts(x) or *.spec.ts(x)). TODO: Rename for clarity and compliance.`
        );
      }
    });
  }
  findTestFiles(testsDir);

  // 6. Check for central mock import in test files (simple pattern match)
  testFiles.forEach((testFile) => {
    const content = fs.readFileSync(testFile, 'utf-8');
    if (!content.includes('from "../test-utils/mocks"') && !content.includes('from "./test-utils/mocks"')) {
      findings.push(
        `WARNING: Test file ${path.basename(testFile)} does not import mocks from central location. TODO: Import mocks from src/__tests__/test-utils/mocks/ only.`
      );
    }
    // Optionally, check for inline/hardcoded mock data (advanced: regex for object literals)
  });
}

// Summarize result
const status = findings.length === 0 ? 'PASSED' : 'FAILED';
const summary = findings.length === 0 ? 'All checks passed.' : findings.join('; ');

// Log result directly to audit.json (MCP protocol stub)
const auditLogPath = path.resolve(projectRoot, 'data/audit.json');
let auditLog = [];
try {
  if (fs.existsSync(auditLogPath)) {
    auditLog = JSON.parse(fs.readFileSync(auditLogPath, 'utf-8'));
  }
} catch (err) {
  console.error('ERROR: Could not read audit.json:', err);
}

auditLog.push({
  actor: 'Cascade',
  action: 'COMPLIANCE_AUDIT',
  component: 'auditCompliance.mcp.cjs',
  rationale: `Compliance audit ${status}: ${summary}`,
  timestamp: new Date().toISOString()
});

try {
  fs.writeFileSync(auditLogPath, JSON.stringify(auditLog, null, 2));
} catch (err) {
  console.error('ERROR: Could not write to audit.json:', err);
}

console.log(`\nMCP Compliance Audit Result: ${status}\n${summary}\n`);

// Exit with code for CI integration
process.exit(status === 'PASSED' ? 0 : 1);
