# MUA: Modern Underwriting Agent

---

## Overview

MUA is a modular, agentic insurance application designed for rapid prototyping and compliance-driven development. It leverages agent workflows, project guidelines, and audit trails to ensure clarity, transparency, and extensibility.

---

## MCP: What It Actually Does (Current State)

### Purpose (Current Implementation)

The MCP server is a **passive tool** in this project.

- It serves project metadata and documentation (`plan.json`, `guidelines.json`, `README.md`) via REST/WebSocket endpoints.
- It collects audit logs from the insurance app (user submissions, AI recommendations) and writes them to `data/audit.json`.
- **It is NOT integrated with the coding agent (Cascade)** and does not enforce guidelines, review changes, or provide agentic context automatically.
- All enforcement of process, onboarding, and guidelines is by convention and documentation (README, MCP_SETUP.md), not by the MCP server.

### When to Use MCP (Current Value)

- If you need a machine-readable API for project plan/guidelines (for future automation or bots).
- If you want to keep an audit log of app actions (not needed for this project, but implemented).
- If you want a central place to store project meta-data (for future extensibility).

### When MCP Is Superfluous

- If you do not need audit logging or machine APIs.
- If you and your coding agent (Cascade) can fully leverage README, docs, and semantic codebase search.
- If you want to keep the project stack minimal and reduce maintenance overhead.

### Limitations (Current State)

- MCP does **not** enforce or mediate project changes.
- MCP is **not** actively used by Cascade or Windsurf CLI for agentic context or logging.
- All guideline/process enforcement is manual, via documentation and memory.

### Future Directions (If Needed)

- MCP could be extended to provide validation, real-time context, or automated enforcement for agentic workflows.
- Could serve as a coordination layer for multi-agent or distributed development.

---

## Table of Contents

- [Project Overview](#overview)
- [MCP: What It Actually Does (Current State)](#mcp-what-it-actually-does-current-state)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Linting and Formatting](#linting-and-formatting)
- [Changelog and Audit Trail](#changelog-and-audit-trail)
- [See Also](#see-also)

---

## Project Structure

```text
mua/
├── README.md             # Project documentation (source of truth)
├── MCP_SETUP.md          # MCP onboarding and setup guide
├── data/
│   ├── plan.json         # Project plan (machine-readable)
│   ├── guidelines.json   # Project guidelines (machine-readable)
│   └── audit.json        # Audit log (user/AI actions)
├── src/
│   ├── mcp/              # MCP server implementation
│   └── ...               # App source code
└── ...
```

---

## Setup and Installation

Refer to [MCP_SETUP.md](./MCP_SETUP.md) for detailed onboarding and troubleshooting.

---

## Development Workflow

1. **Review the [README.md](./README.md) and [MCP_SETUP.md](./MCP_SETUP.md) before making changes.**
2. **Document planned changes and update the README first.**
3. **Keep the README as the source of truth for structure, rationale, and guidelines.**
4. **Use semantic codebase search and audit logs for context.**

---

## Testing

- All test mocks are in `src/__tests__/test-utils/mocks/`.
- Use TypeScript for type safety and import mocks from central locations.
- Use `beforeAll`/`beforeEach` for setup and group tests with `describe` blocks.
- Test user interactions, state changes, and error handling.

---

## Linting and Formatting

- Use `eslint` and `prettier` for code quality.
- Fix all lint warnings before merging changes.
- For markdown, use `markdownlint` and follow these conventions:
  - One top-level heading (`#`) per document.
  - Blank lines before/after headings, lists, and code blocks.
  - No trailing punctuation in headings.
  - No bare URLs—use markdown links.
  - No duplicate headings.
  - Heading levels increment by one at a time.

---

## Changelog and Audit Trail

- All major changes are documented in the audit log (`data/audit.json`).
- Use REST endpoints to log user prompts and assistant responses if MCP is active.

---

## See Also

- [MCP_SETUP.md](./MCP_SETUP.md): MCP onboarding and troubleshooting
- [plan.json](./data/plan.json): Project plan (machine-readable)
- [guidelines.json](./data/guidelines.json): Project guidelines (machine-readable)
- [audit.json](./data/audit.json): Audit log

---

## MCPMetaServer Setup and Agentic Workflow

See `src/mcp/SETUP.md` for full, step-by-step setup and troubleshooting instructions, including logic flow diagrams and best practices.

### Recommended: Start both the dev server and MCPMetaServer together using:

```sh
npm run start
```

### If you only want to run the MCPMetaServer (for testing or headless workflows):

```sh
npx ts-node src/mcp/server/index.ts
```

### Always ensure MCPMetaServer is running before submitting prompts or developing agent logic. All agent activity should be mediated via the MCPMetaServer for compliance and auditability.

---

## Local Development: Troubleshooting & Checklist

- **Install dependencies:**
  ```sh
  npm install
  ```
- **Start all services (frontend + audit backend):**
  ```sh
  npm run start
  ```
- **If you see a PostCSS or Node loader error:**
  - Ensure `postcss.config.js` uses CommonJS syntax:
    ```js
    module.exports = { /* ... */ }
    ```
  - Do **not** use `export default` in this file.
- **If you see a port-in-use error:**
  - Find and stop the process with:
    ```sh
    lsof -i :<PORT>
    kill -9 <PID>
    ```
  - Or change the port in your config.
- **Verify audit logging:**
  - All prompts and responses should be logged to `data/audit.json` when interacting with the app.
- **Checklist for fresh clone:**
  1. Clone repo
  2. Run `npm install`
  3. Run `npm run start`
  4. Visit the local URL (see terminal, e.g. http://localhost:3005)
  5. Confirm audit log is being written

---

## Audit Logging & Compliance (UPDATED)

MUA now logs **both user prompts and assistant (AI) responses** for every submission, ensuring full compliance and auditability.

#### How Audit Logging Works
- **User Prompt**: When a user submits a new insurance application, the form data is logged via `logUserPrompt`.
- **Assistant Response**: When a submission is viewed, the AI's recommendation/summary is logged via `logAssistantResponse` (first 200 chars).
- All logs are written to `data/audit.json` by the MCPMetaServer REST API.

#### Logic Flow Diagram
```mermaid
flowchart TD
    A[User submits application] --> B[logUserPrompt]
    B --> C[audit.json]
    D[User views submission dossier] --> E[logAssistantResponse (AI summary)]
    E --> C
```

#### Relevant Files
- `src/screens/NewSubmission.tsx`: Logs user prompt on submission.
- `src/screens/SubmissionDossier.tsx`: Logs AI summary when viewing a submission.
- `src/devtools/useMCP.ts`: Logging utilities.
- `data/audit.json`: Audit log file (JSON).
- `MCP_SETUP.md`: Setup and compliance details.

#### Developer Notes
- Logging is robust and errors are surfaced in the browser console.
- Only the first 200 characters of the AI summary are logged for compliance.
- If you see no log, check that both the app and MCPMetaServer are running.

---

## MCP Server Startup and Conversational Logging (Unified Flow)

### Unified Startup
To ensure full auditability and compliance, **run only this command to start both the WebSocket and REST audit servers:**

```bash
npx ts-node src/mcp/server/index.ts
```

- This launches:
  - The main MCP WebSocket server (port 8080, for protocol and integration tests)
  - The REST audit server (port 8081, for conversational logging, audit trail, and compliance)

### Logic Flow Diagram

```mermaid
graph TD
    A[Start index.ts] --> B[Start MCPServer (WebSocket, 8080)]
    A --> C[Import MCPMetaServer (Express app)]
    C --> D[Start REST Audit Server (8081)]
    E[Integration Test / Agent] -->|WebSocket| B
    E -->|POST logPrompt/logResponse| D
    D -->|Write| F[Audit Log (data/audit.json)]
```

### File Purposes
- `src/mcp/server/index.ts`: Unified entrypoint. Starts both servers. **Only run this file.**
- `src/mcp/server/MCPServer.ts`: WebSocket protocol server (8080).
- `src/mcp/server/MCPMetaServer.ts`: Express REST server (8081) for audit/compliance. Exported as an app, not run directly.

### Node.js Module System: CommonJS vs ESM

### What Changed?
- The project now uses **CommonJS** (the default Node.js module system) for all backend/server code.
- All local imports use the CommonJS-compatible form (no `.js` extensions, just the module name).
- This avoids ESM/TypeScript loader errors and makes development and onboarding easier.

### Why CommonJS?
- CommonJS is the most widely supported and reliable module system for Node.js projects.
- ESM (ECMAScript Modules) is more modern, but can be tricky to set up in Node.js, especially with TypeScript.
- For most backend/server code, there is no practical difference for developers.
- If you ever need to switch to ESM in the future (for package publishing or browser compatibility), see the [project history](#project-history) for migration notes.

### What Do I Need To Do?
- Use `import ... from '...'` for all imports, but do **not** add `.js` extensions to local files.
- Run the server with:
  ```bash
  npx ts-node src/mcp/server/index.ts
  ```
- You do **not** need to worry about ESM vs CommonJS unless you hit a specific package compatibility issue.

### Troubleshooting
If you see errors about unknown file extensions or ESM loaders, make sure:
- `package.json` contains: `"type": "commonjs"`
- `tsconfig.json` contains: `"module": "commonjs"`
- All local imports omit the `.js` extension (e.g., `import foo from './foo'` not `import foo from './foo.js'`)

### Onboarding & Compliance Notes
- **Never run MCPMetaServer.ts directly.** It is imported and started by index.ts.
- All conversational logging (user prompts, assistant responses) is POSTed to the REST server and written to `data/audit.json`.
- For integration tests and agentic logging, ensure both servers are running via the unified command above.
- See logic flow diagram above for audit/compliance traceability.

---

## MCP Server and MetaMCP: Dynamic, Auditable, and Future-Proof Setup

### Overview
This project implements a robust, auditable agent orchestration backend using:
- **MCPServer**: WebSocket protocol server for agent/assistant communication.
- **MCPMetaServer**: REST API for audit, compliance, project plan, guidelines, and live directory structure.
- **Unified Startup**: Both servers are started together for full traceability and onboarding simplicity.

### Dynamic Port Management
- **Why?**
  - Prevents port conflicts during tests and multi-instance dev.
  - Enables parallel test execution and CI reliability.
- **How?**
  - Set `port: 0` in `MCPConfig` to let the OS assign a free port.
  - After startup, call `server.getPort()` to retrieve the actual port.
  - All tests and clients should use this dynamic port for connections.
- **Best Practice**: Use `host: '127.0.0.1'` for local dev/tests. Use `'0.0.0.0'` for production (all interfaces).

### Error Handling & Auditability
- **Invalid messages** sent to MCPServer result in:
  - A JSON error response: `{ success: false, error: 'Invalid message format' }`
  - The connection is closed with code 1003 (unsupported data).
  - All such events are logged for audit.
- **All conversational and compliance events** are POSTed to `/logPrompt` and `/logResponse` on the REST server and written to `data/audit.json`.
- **MetaMCP** (MCPMetaServer) exposes REST endpoints for plan, guidelines, audit, README, and directory structure. See below for details.

### Logic Flow Diagram
```mermaid
graph TD
    A[Start index.ts] --> B[Start MCPServer (WebSocket, dynamic port)]
    A --> C[Import MCPMetaServer (Express app)]
    C --> D[Start REST Audit Server (8081)]
    E[Integration Test / Agent] -->|WebSocket| B
    E -->|POST logPrompt/logResponse| D
    D -->|Write| F[Audit Log (data/audit.json)]
```

### File Purposes (Audit-Ready)
- `src/mcp/server/index.ts`: **Unified entrypoint.** Starts both servers. Annotated for audit, config, and future extension.
- `src/mcp/server/MCPServer.ts`: WebSocket protocol server. Handles dynamic ports, message routing, and error/audit logic.
- `src/mcp/server/MCPMetaServer.ts`: REST server for audit/compliance, plan, guidelines, and directory structure. Exported as an app, not run directly.

### Using This MCP/MetaMCP Setup for Future Apps
1. **Clone/Copy the MCP setup (`src/mcp/server/`) and adapt `index.ts` config for your app.**
2. **For dynamic port assignment:**
   - Set `port: 0` in the config.
   - After startup, use `server.getPort()` for the actual port.
3. **For audit/compliance:**
   - Use the REST endpoints in MCPMetaServer for logging, plan/guideline management, and onboarding.
   - All conversational events should be POSTed to `/logPrompt` and `/logResponse`.
4. **MetaMCP (MCPMetaServer) endpoints:**
   - `GET/POST /plan` — Project plan management.
   - `GET/POST /guidelines` — Agent guidelines.
   - `GET/POST /audit` — Audit log access.
   - `POST /logPrompt`, `POST /logResponse` — Conversational logging.
   - `GET /readme` — Fetches the current README.
   - `GET /structure` — Returns live directory structure for agentic navigation.
5. **Extend as needed:**
   - Add new REST/WebSocket endpoints to MCPMetaServer for agent orchestration, push notifications, or real-time audit.
   - Use the provided directory watcher to trigger events or audits on file changes.

### Best Practices & Testing
- **All tests should use dynamic ports and connect to `127.0.0.1` for reliability.**
- **Audit logs and error responses should be asserted in tests for compliance.**
- **No inline mocks or hardcoded test data—use central test-utils/mocks.**
- **All config and startup logic is heavily annotated for future onboarding.**

### Project Structure (Updated)
- `src/mcp/server/index.ts`: Unified entrypoint. Starts both servers. **Only run this file.**
- `src/mcp/server/MCPServer.ts`: WebSocket protocol server (dynamic port).
- `src/mcp/server/MCPMetaServer.ts`: REST audit server (8081). Exported as an app, not run directly.
- `data/`: Audit log, plan, and guidelines JSON files.

---

## MCP Audit Log: Developer Tool, Not End-User Logging

**Purpose:**
- The audit log (`data/audit.json`) is strictly a developer tool for tracking agent/assistant development, debugging, and compliance audits.
- It is NOT intended for logging end-user application usage or production conversations.

**What Should Be Logged:**
- Compliance checks (naming, structure, test requirements)
- Manual/test actions for debugging or development
- Example conversational turns for agent/assistant development, e.g.:
  ```json
  {
    "type": "USER_PROMPT",
    "actor": "USER",
    "content": "What is the underwriting guideline for X?",
    "timestamp": "2025-04-15T14:00:00Z"
  }
  ```

**What Should NOT Be Logged:**
- Actual production user data or conversations (unless for explicit debugging/compliance, with privacy controls)
- Sensitive or personally identifiable information (PII)

**How to Use:**
- Use `/logPrompt` and `/logResponse` endpoints only in test/dev workflows, not in production user flows.
- Review the log as part of development, debugging, and compliance checks.
- For production analytics or audit, implement a separate, privacy-compliant logging solution as needed.

**Best Practices:**
- Always clarify in onboarding and documentation that the MCP audit log is a developer tool.
- Regularly review and clear logs to avoid accidental retention of sensitive data.
- Ensure all contributors understand the boundaries and intended use of this logging system.

---

## Selective Logging of Prompts and Responses (Cascade Agent Chat)

**Policy:**
- **All user prompts/instructions** in Cascade chat are logged in full to the MCP audit log (developer tool).
- **Assistant (Cascade) responses** are logged as a summary (first 200 characters) by default.
- **Full responses** are logged only if they contain errors, are flagged for audit, or you explicitly request it.

**Why:**
- Ensures traceability and auditability of developer instructions without bloating the audit log with every agent response.
- Keeps logs actionable, lightweight, and privacy-conscious.

**How to Integrate:**
- Add a logging hook to your Cascade chat system:
  - On every user prompt: POST to `/logPrompt` on MCPMetaServer.
  - On every assistant response: POST a summary to `/logResponse`, unless flagged for full logging.

**Code Sample:**
```typescript
import axios from 'axios';

const MCP_META_SERVER_URL = 'http://localhost:8081';

async function postToMCP(endpoint: string, payload: any) {
  try {
    await axios.post(`${MCP_META_SERVER_URL}${endpoint}`, payload);
  } catch (e) {
    console.error(`[MCP Logging] Failed to log to ${endpoint}:`, e);
  }
}

export async function logUserPrompt(prompt: string) {
  await postToMCP('/logPrompt', {
    type: 'USER_PROMPT',
    actor: 'USER',
    content: prompt,
    timestamp: new Date().toISOString()
  });
}

export async function logAssistantResponse(response: string, opts?: { forceFull?: boolean }) {
  const shouldLogFull = opts?.forceFull || /error|fail|exception/i.test(response);
  await postToMCP('/logResponse', {
    type: 'ASSISTANT_RESPONSE',
    actor: 'Cascade',
    content: shouldLogFull ? response : response.slice(0, 200) + (response.length > 200 ? '...' : ''),
    fullLogged: shouldLogFull,
    timestamp: new Date().toISOString()
  });
}
```

**Best Practices:**
- Log all user prompts in full for audit/compliance.
- Log responses as summaries unless full detail is required.
- Reference this policy in onboarding and compliance docs.

---

## MetaMCP (MCPMetaServer) Protocol and Usage

- **Purpose**: Central REST API for audit, plan, guidelines, onboarding, and agent orchestration.
- **Key Endpoints:**
  - `GET/POST /plan` — Get/set the current project plan.
  - `GET/POST /guidelines` — Get/set agent guidelines.
  - `GET/POST /audit` — Get/append audit log entries.
  - `POST /logPrompt`, `POST /logResponse` — Log user/assistant conversational turns.
  - `GET /readme` — Fetches the current README.
  - `GET /structure` — Returns live directory structure for agentic navigation.
- **WebSocket (future):**
  - Port 8090, for real-time push notifications and agent sync.
- **Directory Watcher:**
  - Watches `src/`, `data/`, and `README.md` for changes (future: triggers agentic events or audits).

### Example: Starting Both Servers
```bash
npx ts-node src/mcp/server/index.ts
```

### Example: Dynamic Port Usage in Your App
```typescript
const config = { port: 0, host: '127.0.0.1', ... };
const server = new MCPServer(config);
server.start();
// Wait for 'started' event, then:
const actualPort = server.getPort();
const ws = new WebSocket(`ws://127.0.0.1:${actualPort}`);
```

### Example: Logging a User Prompt
```bash
curl -X POST http://localhost:8081/logPrompt -H 'Content-Type: application/json' -d '{ "content": "What is the underwriting guideline for X?" }'
```

---

## Logic Flow: MCP/MetaMCP Startup and Audit

```mermaid
graph TD
    Start[Start index.ts] --> MCPServer
    Start --> MCPMetaServer
    MCPServer -->|WebSocket| Agent
    Agent -->|POST logPrompt/logResponse| MCPMetaServer
    MCPMetaServer -->|Write| AuditLog[data/audit.json]
```

---

## File List and Purposes (for Audit/Blueprint)
- `src/mcp/server/index.ts`: Unified startup, config, and audit entrypoint.
- `src/mcp/server/MCPServer.ts`: WebSocket server, dynamic port, audit/error logic.
- `src/mcp/server/MCPMetaServer.ts`: REST/audit server, plan/guidelines, onboarding.
- `data/audit.json`: Audit log of all conversational and compliance events.
- `data/plan.json`: Current project plan (editable via REST).
- `data/guidelines.json`: Current agent guidelines (editable via REST).

---

## Extending This System for Your Own App
- **Copy/adapt the MCP/MetaMCP setup as your backend foundation.**
- **Use dynamic port assignment for test/dev reliability.**
- **Leverage the REST audit endpoints for compliance and onboarding.**
- **Extend with new endpoints, directory watchers, or agentic protocols as needed.**
- **Heavily annotate all config and startup logic for future maintainers.**

---

## Changelog and Audit Trail

- All major changes, architectural decisions, and workflow updates are documented in this section.
- See the audit log (`data/audit.json`) for a full machine-readable trail of agentic and compliance actions.
- For details on selective logging and startup, see the sections above and `src/mcp/SETUP.md`.

---

## See Also

- `src/__tests__/README.md` for test structure and best practices.
- All config and logic is heavily annotated in code for onboarding and audit.

---
