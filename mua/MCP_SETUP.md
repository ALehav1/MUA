# MCP (Model Context Protocol) – General Setup & Onboarding Guide

---

## Overview

The Model Context Protocol (MCP) is a meta-brain architecture for project management, agent orchestration, and auditability. It enables:

- A single source of truth for project plan, guidelines, and audit log
- Enforced protocol for agent and human actions (pre- and post-change logging)
- REST and WebSocket endpoints for easy integration
- Full traceability and compliance for agentic and collaborative development

**This guide is a reusable template for wrapping any project with an MCP server.**

---

## When to Use MCP

- You want to log, track, and guide all codebase changes (by humans or agents)
- You need a protocol for auditability and compliance
- You want to enforce project guidelines and plans
- You want to expose project meta-data (plan, guidelines, audit, README, structure) via API

---

## Directory Structure (Reference)

```text
<your-project>/
├── mcp/                # MCP implementation (server, types, utils)
│   ├── server/         # MCPMetaServer and related logic
│   ├── types/          # Protocol types, enums, interfaces
│   ├── utils/          # Validation, logging, helpers
├── data/               # Project meta-data (plan.json, guidelines.json, audit.json)
├── src/                # Application source code (optional)
├── README.md           # Project-specific documentation
├── MCP_SETUP.md        # This onboarding guide (copy & adapt for your project)
└── ...                 # Other project files
```

---

## Quickstart Checklist (Any Project)

1. **Clone your project & install dependencies**
   ```bash
   git clone <your-repo-url>
   cd <your-project>
   npm install
   ```
2. **Add/verify MCP directories and files**
   - Place all MCP files in `mcp/` or `data/`.
   - Create `data/plan.json`, `data/guidelines.json`, `data/audit.json` as needed.
3. **Start the MCPMetaServer**
   ```bash
   # Compile if needed
   npx tsc mcp/server/MCPMetaServer.ts --outDir dist/mcp/server --module commonjs --esModuleInterop
   # Run as CommonJS (use .cjs extension if needed)
   node dist/mcp/server/MCPMetaServer.cjs
   ```
   - Default server port: `http://localhost:8081`
4. **Test Endpoints (REST API)**
   ```bash
   curl http://localhost:8081/plan
   curl http://localhost:8081/guidelines
   curl http://localhost:8081/audit
   curl http://localhost:8081/readme
   curl http://localhost:8081/structure
   ```
5. **Log an Action to the Audit Log**
   ```bash
   curl -X POST http://localhost:8081/audit -H "Content-Type: application/json" -d '{"actor": "YOUR_NAME","action": "TEST_ACTION","component": "MCPMetaServer","rationale": "Testing audit log."}'
   ```
6. **Review Audit Log**
   ```bash
   curl http://localhost:8081/audit | jq .
   ```

---

## MCP Server (Backend) Setup & Troubleshooting

### Starting the MCP Server

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the MCP server:**
   ```bash
   node --loader ts-node/esm src/mcp/server/index.ts
   ```
   - You should see logs like:
     ```
     [MCPServer] WebSocketServer started on ws://localhost:8080
     MCP server started at ws://localhost:8080
     ```
   - If you see loader/ESM errors, upgrade ts-node and TypeScript, and ensure your tsconfig.json uses `module` and `moduleResolution` set to `NodeNext`.

3. **Shut down the server:**
   - Press `Ctrl+C` in the terminal; you should see `Shutting down MCP server...`.

### Troubleshooting
- **ExperimentalWarning:** This is expected with Node’s loader API and does not affect functionality.
- **Port in use:** Run `lsof -i :8080` and `kill <PID>`.
- **Cannot find module:** Check all import paths and tsconfig.json.
- **No startup log:** Ensure logging is present in `src/mcp/server/index.ts`.
- **Frontend not connecting:** Confirm frontend uses `ws://localhost:8080`.

---

## Protocol Workflow (General)

1. **Before any codebase change:**
   - Query `/plan`, `/guidelines`, `/audit`, `/readme`, and `/structure`.
   - Log intended action (with rationale) to `/audit`.
2. **After change:**
   - Log completion and outcome to `/audit`.
   - Ensure all changes are reflected in the plan and audit log.

### Logic Flow Diagram

```mermaid
sequenceDiagram
    participant User as USER/Agent
    participant UI as Frontend (React)
    participant MCP as MCP Server (ws://localhost:8080)

    User->>UI: Interacts with UI
    UI->>MCP: Sends/receives messages (WebSocket)
    MCP-->>UI: Responds with plan, guidelines, audit, etc.
    UI-->>User: Updates state/UX

    User->>MCP: Direct API/audit actions (optional)
    MCP-->>User: Logs, compliance, onboarding info
```

---

## Best Practices

- **Keep README.md and MCP_SETUP.md in sync.**
- **Never modify files in `data/` directly—always use the server endpoints.**
- **Log all actions and rationale for full auditability.**
- **Document component purposes, relationships, and rationale in your project README.**
- **Update documentation with every protocol or structural change.**
- Always check README.md and MCP_SETUP.md for onboarding and compliance before making changes.
- All server actions and audit logs are in `data/audit.json` for traceability.
- Keep logic flow diagrams and onboarding steps up to date with every major change.

---

## Auditable Compliance Checks with MCP

This project includes an automated compliance audit script that checks your directory structure and naming conventions against documented guidelines and logs the result via the MCP protocol.

### How to Run the Audit

From the project root, run:

```bash
node src/devtools/auditCompliance.mcp.cjs
```

- The audit checks for required directories, files, and naming conventions (PascalCase for components, camelCase for hooks like `useXyz.ts`).
- Results are logged in `data/audit.json` for traceability.
- Use the audit log to track compliance and support onboarding or automation.

### Customizing Checks

- Edit `data/guidelines.json` or the audit script to adjust rules for your project.
- Audit logs are always appended to `data/audit.json` for a complete compliance trail.

---

## Troubleshooting

- **Port in use:** Kill with `lsof -i :8081` and `kill <PID>`
- **TypeScript errors:** Check `tsconfig.json` and file locations
- **API errors:** Ensure server is running and endpoints are correct
- **Audit log not updating:** Only use API to modify `data/audit.json`

---

## Onboarding Checklist for Any Project

- [ ] Copy this MCP_SETUP.md into your project root
- [ ] Set up directory structure as above
- [ ] Copy and configure MCPMetaServer and data files
- [ ] Update plan, guidelines, and README for your project
- [ ] Test all endpoints and audit logging
- [ ] Train agents/humans on protocol workflow
- [ ] Keep all documentation up to date

---

## Security & Compliance Notes

- **Authentication:** Add as needed for production use
- **Message validation:** Validate all incoming data
- **Audit log:** Review regularly for suspicious or non-compliant actions

---

## References & Customization

- **See your project README.md** for project-specific structure, objectives, and rationale.
- **See `mcp/server/MCPMetaServer.ts`** for implementation details (adapt as needed).
- **Expose `/readme` endpoint** for agent-accessible documentation.
- **Customize this guide** for your project’s unique needs—this file is a template!

---

*Last updated: 2025-04-15T10:12:56-04:00*