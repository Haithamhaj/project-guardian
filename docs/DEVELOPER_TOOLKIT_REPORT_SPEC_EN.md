# Developer Toolkit Debug Report Spec – v0.1.0

This document defines the JSON debug report produced by the **Developer Toolkit** (e.g. `ToolkitView` / “Save for AI” button).  
The report is a single snapshot of the system, intended to be consumed by:

- Non-technical users  
- AI models (diagnostics / code agents)  
- Human developers  

---

## 1. Purpose

The Debug Report provides a **single, structured bundle** of:

- System information (browser / platform)
- Runtime state (WebSocket, listening status, optional memory stats)
- Frontend logs
- Backend logs
- Network activity between frontend and backend

Typical use cases:

1. Let a non-developer understand “what is going on” in simple language (via AI).
2. Give AI models enough context to analyze failures and propose fixes.
3. Give a developer all relevant data without asking for screenshots or console copies.

---

## 2. Top-level structure

The report is a JSON object with the following top-level shape:

```json
{
  "timestamp": "...",
  "system": { ... },
  "state": { ... },
  "logs": {
    "frontend": [ ... ],
    "backend": [ ... ]
  },
  "network": [ ... ]
}
```

Each field is documented below.

> Note: this spec matches what `ToolkitView.generateReport()` produces in HVA and can be reused in other projects.

---

## 3. Full example

```json
{
  "timestamp": "2025-12-02T14:35:10.123Z",

  "system": {
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
    "platform": "MacIntel"
  },

  "state": {
    "wsConnected": false,
    "isListening": false,
    "memoryStats": {
      "totalMemories": 12,
      "activeGroups": 3
    }
  },

  "logs": {
    "frontend": [
      {
        "id": 1700000000000,
        "timestamp": "2025-12-02T14:34:59.000Z",
        "level": "error",
        "message": "WebSocket Disconnected: Code 1006",
        "details": {
          "code": 1006,
          "reason": ""
        }
      },
      {
        "id": 1700000000500,
        "timestamp": "2025-12-02T14:35:00.500Z",
        "level": "warn",
        "message": "Failed to fetch backend logs",
        "details": {
          "url": "http://127.0.0.1:8765/system/logs",
          "error": "Failed to fetch"
        }
      }
    ],

    "backend": [
      {
        "timestamp": "2025-12-02T14:34:58.500Z",
        "level": "ERROR",
        "source": "backend",
        "message": "Failed to connect to WebSocket server",
        "details": {
          "exception": "ConnectionRefusedError",
          "stack": "Traceback (most recent call last): ..."
        }
      }
    ]
  },

  "network": [
    {
      "id": 1700000001111,
      "timestamp": "2025-12-02T14:34:57.800Z",
      "url": "http://127.0.0.1:8765/system/logs",
      "method": "GET",
      "status": "error",
      "statusCode": 0,
      "durationMs": 123,
      "requestBody": null,
      "responseBody": null,
      "error": "Failed to fetch"
    }
  ]
}
```

Values are illustrative only. Real values depend on the app at the moment the report is generated.

---

## 4. Field reference

### 4.1 Root

| Path              | Type    | Description                                                             | Required |
|-------------------|---------|-------------------------------------------------------------------------|----------|
| `timestamp`       | string  | ISO 8601 timestamp (`new Date().toISOString()`) of report generation   | yes      |
| `system`          | object  | Host / browser information                                              | yes      |
| `state`           | object  | High-level runtime state                                                | yes      |
| `logs`            | object  | Frontend and backend logs                                               | yes      |
| `logs.frontend`   | array   | Array of frontend log entries                                          | yes      |
| `logs.backend`    | array   | Array of backend log entries                                           | yes      |
| `network`         | array   | Array of network request entries                                       | yes      |

---

### 4.2 `system`

Source: `navigator.userAgent`, `navigator.platform` (or equivalent).

| Path                 | Type   | Description                                   | Required |
|----------------------|--------|-----------------------------------------------|----------|
| `system.userAgent`   | string | Browser / environment user agent string       | yes      |
| `system.platform`    | string | Platform string (e.g. `MacIntel`, `Win32`)    | yes      |

---

### 4.3 `state`

Source: props passed into the Toolkit component from the host app.

| Path                    | Type             | Description                                                      | Required |
|-------------------------|------------------|------------------------------------------------------------------|----------|
| `state.wsConnected`     | boolean          | Whether the WebSocket connection is currently established        | yes      |
| `state.isListening`     | boolean          | Whether the app is actively listening (e.g. for voice input)     | yes      |
| `state.memoryStats`     | object \| null   | Optional opaque object describing internal memory / app state    | no       |

> `memoryStats` is intentionally flexible. Example fields: `totalMemories`, `activeGroups`, etc.

---

### 4.4 `logs.frontend[]`

Source: `logger.js` (`useLogs()` hook).

Each entry represents a single frontend log event.

| Path                          | Type    | Description                                                | Required |
|-------------------------------|---------|------------------------------------------------------------|----------|
| `logs.frontend[].id`         | number  | Unique id (e.g. `Date.now() + Math.random()`)             | yes      |
| `logs.frontend[].timestamp`  | string  | ISO 8601 timestamp                                         | yes      |
| `logs.frontend[].level`      | string  | `info` \| `warn` \| `error` \| etc.                        | yes      |
| `logs.frontend[].message`    | string  | Short human-readable summary                              | yes      |
| `logs.frontend[].details`    | any     | Optional structured details (object, string, null, etc.)   | no       |

The UI may use `diagnoseError(log)` on these entries to generate human-friendly diagnostics, but the diagnosis itself is **not** stored in the report.

---

### 4.5 `logs.backend[]`

Backend log entries are provided by the host application. The Toolkit does not enforce a strict schema, but this is the recommended shape:

| Path                          | Type    | Description                                                | Required |
|-------------------------------|---------|------------------------------------------------------------|----------|
| `logs.backend[].timestamp`   | string  | ISO 8601 timestamp                                         | yes      |
| `logs.backend[].level`       | string  | `INFO` \| `WARN` \| `ERROR` \| etc.                        | yes      |
| `logs.backend[].source`      | string  | Optional source/service/module name                        | no       |
| `logs.backend[].message`     | string  | Short human-readable summary                              | yes      |
| `logs.backend[].details`     | any     | Optional structured details (stack trace, params, etc.)    | no       |

Extra fields (e.g. `requestId`, `userId`) are allowed and will not break the spec.

---

### 4.6 `network[]`

Source: `networkMonitor.js` wrapping `fetch` (or equivalent).

Each entry represents one network request.

| Path                          | Type    | Description                                                                 | Required |
|-------------------------------|---------|-----------------------------------------------------------------------------|----------|
| `network[].id`               | number  | Unique id for the request                                                  | yes      |
| `network[].timestamp`       | string  | ISO 8601 timestamp when the request started                                | yes      |
| `network[].url`             | string  | Request URL (full or relative)                                             | yes      |
| `network[].method`          | string  | HTTP method: `GET`, `POST`, `PUT`, `DELETE`, …                             | yes      |
| `network[].status`          | string  | App-level status: `success`, `error`, `pending`, …                         | yes      |
| `network[].statusCode`      | number  | HTTP status code (e.g. 200, 404, 500). May be `0` for network-level errors | no       |
| `network[].durationMs`      | number  | Request duration in milliseconds                                           | no       |
| `network[].requestBody`     | any     | Request payload (usually JSON or text)                                     | no       |
| `network[].responseBody`    | any     | Response payload (usually JSON or text)                                    | no       |
| `network[].error`           | string  | Human-readable error message if the request failed                         | no       |

---

## 5. Using the report with AI

### 5.1 Example prompt for diagnostics (English first)

```text
You are a senior software diagnostics assistant.

I will give you a JSON debug report produced by the Developer Toolkit.
It contains:
- system info
- runtime state
- frontend logs
- backend logs
- network requests

TASKS:
1) Summarize the main problem in 3–5 lines in clear technical English (problem, impact, likely root cause).
2) Suggest up to 3 concrete steps I can try as a non-programmer user (also in English).
3) If I explicitly ask for another language (for example Arabic) in my question, provide an additional short summary in that language at the end.

Here is the JSON report:

[PASTE JSON HERE]
```

> Default output is English. Any other language (Arabic, etc.) is optional and should only be produced when the user explicitly requests it.

### 5.2 With a code agent

When asking a code-editing agent to fix an issue, always attach the latest debug report and instruct it to:

- Read the report first.
- Identify the failing layer (frontend, backend, network, config).
- Propose a plan.
- Only then edit code.

This reduces guesswork and aligns the agent with the real runtime behaviour.

---

## 6. Versioning

- This document describes **specVersion = "0.1.0"**.
- Future changes SHOULD:
  - Add a `specVersion` field at the root of the JSON.
  - Document differences in a changelog section or a separate file.
