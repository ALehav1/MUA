/**
 * auditCompliance.mcp.js
 * 
 * Script: MCP-driven compliance audit for Moody's Underwriting Assistant (MUA)
 * Purpose: Scans the project directory for compliance with documented structure and naming conventions, logs the audit result via MCP protocol.
 *
 * Usage: node src/devtools/auditCompliance.mcp.js
 *
 * Dependencies:
 * - Node.js (>=16)
 * - guidelines.json (for rules)
 * - useMCP.js (for MCP logging utility)
 *
 * Author: Cascade (AI)
 * Date: 2025-04-15
 */

const fs = require('fs');
const path = require('path');
const { logMCPAction } = require('./useMCP'); // Assumes useMCP exports a logging function

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

// Example: Check naming conventions for components (expand as needed)
const componentsDir = path.join(projectRoot, 'src/components');
if (fs.existsSync(componentsDir)) {
  fs.readdirSync(componentsDir).forEach((file) => {
    if (!/^[A-Z][A-Za-z0-9]+\.(tsx|ts)$/.test(file)) {
      findings.push(`Component file does not follow PascalCase: ${file}`);
    }
  });
}

// Summarize result
const status = findings.length === 0 ? 'PASSED' : 'FAILED';
const summary = findings.length === 0 ? 'All checks passed.' : findings.join('; ');

// Log result via MCP
logMCPAction({
  actor: 'Cascade',
  action: 'COMPLIANCE_AUDIT',
  component: 'auditCompliance.mcp.js',
  rationale: `Compliance audit ${status}: ${summary}`,
  timestamp: new Date().toISOString()
});

console.log(`\nMCP Compliance Audit Result: ${status}\n${summary}\n`);

// Exit with code for CI integration
process.exit(status === 'PASSED' ? 0 : 1);
