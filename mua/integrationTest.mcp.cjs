// Automated MCP Server Integration Test Script (CommonJS)
// This script connects to the MCP server, sends test messages, and logs responses.
// Run with: node integrationTest.mcp.cjs

const WebSocket = require('ws');
// Conversational logging for MCP audit trail (Cascade/Windsurf compliance)
const { logUserPrompt, logAssistantResponse } = require('./src/devtools/useMCP.cjs');

const SERVER_URL = 'ws://localhost:8080';

const tests = [
  {
    label: 'GET_PLAN',
    payload: { type: 'GET_PLAN', messageId: 'test1' }
  },
  {
    label: 'UPDATE_PLAN (valid)',
    payload: {
      type: 'UPDATE_PLAN',
      payload: {
        steps: [
          { id: '1', description: 'Initial step', status: 'pending' },
          { id: '2', description: 'Second step', status: 'complete' }
        ],
        lastUpdated: new Date().toISOString()
      },
      messageId: 'test2'
    }
  },
  {
    label: 'UPDATE_PLAN (invalid)',
    payload: { type: 'UPDATE_PLAN', payload: { foo: 'bar' }, messageId: 'test3' }
  },
  {
    label: 'GET_GUIDELINES',
    payload: { type: 'GET_GUIDELINES', messageId: 'test4' }
  },
  {
    label: 'UPDATE_GUIDELINES (invalid)',
    payload: { type: 'UPDATE_GUIDELINES', payload: { bar: 123 }, messageId: 'test5' }
  },
  {
    label: 'UPDATE_GUIDELINES (valid)',
    payload: {
      type: 'UPDATE_GUIDELINES',
      payload: {
        rules: ['Always validate input', 'Log all errors', 'Follow audit trail'],
        lastUpdated: new Date().toISOString()
      },
      messageId: 'test6'
    }
  }
];

async function runTests() {
  const ws = new WebSocket(SERVER_URL);

  ws.on('open', async () => {
    console.log('Connected to MCP server:', SERVER_URL);
    await sendNext(0);
  });

  ws.on('message', async (data) => {
    try {
      const msg = JSON.parse(data);
      console.log('Received:', JSON.stringify(msg, null, 2));
      // Log assistant (Cascade) response for auditability
      await logAssistantResponse(JSON.stringify(msg));
    } catch (e) {
      console.log('Received (raw):', data);
      await logAssistantResponse(String(data));
    }
    // Wait a bit before sending the next test
    setTimeout(async () => {
      await sendNext(++runTests.currentTest);
    }, 350);
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
    process.exit(1);
  });

  ws.on('close', () => {
    console.log('Connection closed.');
  });

  async function sendNext(i) {
    if (i >= tests.length) {
      ws.close();
      console.log('All tests sent.');
      return;
    }
    const test = tests[i];
    console.log(`\n--- Sending test: ${test.label} ---`);
    // Log user prompt for auditability
    await logUserPrompt(JSON.stringify(test.payload));
    ws.send(JSON.stringify(test.payload));
  }
}
runTests.currentTest = 0;

runTests();
