# TypeScript Playwright Automation Framework — Architecture Document

## 1. Overview
The TypeScript Playwright Automation Framework is a modular, scalable, and maintainable solution designed to support automated testing across:

- **UI Testing**  
- **API Testing**  
- **Database Validation**  
- **BDD (Behavior-Driven Development)**  

The architecture emphasizes:

- Reusability  
- Test isolation  
- Clean separation of concerns  
- Strong typing and modern JavaScript/TypeScript standards  
- CI/CD readiness  
- Structured logging and detailed reporting  

The framework is designed to integrate seamlessly with enterprise pipelines while supporting future scalability and multi-project adoption.

---

## 2. High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                 BDD Specifications (Gherkin)              │
│              *.feature files defining business flow       │
└──────────────────────────┬───────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────┐
│  Step Definition Layer                                    │
│  • Converts Gherkin steps into executable code            │
│  • Delegates interactions to UI/API/DB layers             │
└──────────────────────────┬───────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────┐
│  Test Execution Runtime (Playwright + Cucumber)           │
│  • Scenario isolation (browser context per scenario)      │
│  • Automatic waiting and retry logic                      │
│  • Failure detection and reporting                        │
└──────────────────────────┬───────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────┐
│  Service Layers                                            │
│  • UI automation layer (Page Object Model)                │
│  • API client / request layer                             │
│  • Database client layer                                  │
│  • Config, logging, and utility modules                   │
└──────────────────────────┬───────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────┐
│  Reporting and Logging                                    │
│  • Cucumber JSON + HTML reporting                         │
│  • Screenshots & artifacts                                │
│  • Structured logging (JSON format)                       │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Key Architectural Components

### 3.1 BDD Layer
- Written in **Gherkin** (`*.feature` files).
- Defines user-focused workflows.
- Supports tags for grouping (e.g., `@smoke`, `@regression`).
- Fully decoupled from implementation details.

### 3.2 Step Definitions
- Implemented in TypeScript.
- Each step maps 1-to-1 with UI/API/DB interactions.
- Thin orchestration layer: no logic beyond delegating actions.

---

## 4. Execution Framework

### 4.1 Playwright Runtime
- Provides browser automation for Chromium, Firefox, WebKit.
- Automatic waiting, timeouts, and stability mechanisms.
- Fresh **browser context per scenario** ensures isolation and determinism.

### 4.2 Cucumber Runtime
- Drives execution in BDD style.
- Supports hooks, scenario-level context injection, and attachments.

### 4.3 Hooks Layer
- Central lifecycle management:
  - Browser & page initialization
  - Screenshot capture on failure
  - Scenario teardown
  - Optional trace recording

---

## 5. Test Layers

### 5.1 UI Automation Layer
- Follows Page Object Model (POM).
- Encapsulates selectors and UI actions.
- Enhances reusability and maintainability.

### 5.2 API Automation Layer
- Uses Playwright’s `APIRequestContext` for:
  - Executing HTTP requests
  - Handling authentication
  - Validating status codes and payloads  
- Fits naturally in BDD workflows.

### 5.3 Database Validation Layer
- Abstract DB client supporting MySQL, MSSQL, or **mock mode**.
- Executes SQL queries via typed functions.
- Optional mock mode for environments without DB access.

---

## 6. Configuration Management
- Centralized configuration module.
- Supports:
  - Environment URLs  
  - Browser options  
  - DB mode selection  
  - Logging level  
- Uses `.env` files + environment variables (CI-friendly).

---

## 7. Logging Architecture

### 7.1 Structured JSON Logging
- Implemented using **pino**.
- Logs include timestamps, levels, messages, and metadata.

### 7.2 Serilog-Compatible Format
- Optional wrapper outputs Serilog-style blocks:
  - `Timestamp`
  - `Level`
  - `Message`
  - `Properties`

---

## 8. Reporting Architecture

### 8.1 Cucumber JSON Output
- Captures full test execution:
  - Steps  
  - Errors  
  - Attachments (screenshots)  
  - Execution times  

### 8.2 HTML Reporting
- Generated using `multiple-cucumber-html-reporter`.
- Produces visually rich, drill-down dashboards.

### 8.3 Artifacts
- `/reports/json`  
- `/reports/html`  
- `/screenshots`  
- `/logs`  

---

## 9. Error Handling & Failure Analysis
- Captures full-page screenshot on any failure.
- Attaches screenshot into cucumber JSON for reporting.
- Logs detailed diagnostic information.
- Ensures browser context is closed cleanly.

Optional:
- Trace capture  
- Network logs  
- Console logs  

---

## 10. CI/CD Readiness

### 10.1 Azure DevOps Integration
The framework supports full CI execution:
- Node setup  
- Playwright browser installation  
- Env-var injection  
- Test execution & reporting  
- Artifact publishing  

### 10.2 Pipeline Characteristics
- Stateless execution  
- Parallelizable  
- DB mock mode supported  
- Secrets stored in CI variable groups or vaults  

---

## 11. Extensibility & Scalability

### Extensible Modules
- New Page Objects  
- New step libraries  
- Additional API clients  
- Additional DB drivers  
- Notification modules (email, Teams, Slack)

### Scalable Architecture
- Can handle:
  - Large test suites  
  - Multi-browser matrix execution  
  - Parallel sharding  
  - Multi-project structuring  

---

## 12. Design Principles

| Principle | Application |
|----------|-------------|
| Separation of concerns | UI/API/DB/BDD layers remain independent |
| Maintainability | Strong typing + modular structure |
| Observability | Logging + artifacts provide visibility |
| Test isolation | Scenario-level browser contexts |
| Reusability | POM + utilities enable shared logic |
| CI/CD alignment | Stateless, repeatable execution |

---

## 13. Folder Structure

```
features/           # BDD feature files
src/
  pages/            # Page Objects
  steps/            # Step Definitions
  api/              # API Clients
  db/               # DB Client
  support/          # Hooks, world, logger, config
  utils/            # Reusable utilities
scripts/            # Report generation
reports/            # HTML & JSON reports
logs/               # Structured logs
screenshots/        # Failure screenshots
```

---

## 14. Execution Flow

1. Runner loads feature files  
2. Step definitions resolve step logic  
3. Hooks initialize browser/page  
4. Test executes across UI/API/DB layers  
5. On failure → screenshot + logs  
6. Browser context teardown  
7. Cucumber JSON generated  
8. HTML report generated  

---

## 15. Framework Benefits

- Modular and extensible  
- Enterprise-ready architecture  
- Full BDD support  
- Unified UI/API/DB automation  
- Strong reporting and logging  
- CI/CD compatible  
- Predictable and stable execution model  
- Minimal maintenance overhead  

---

## 16. Production-Readiness Considerations

To move beyond POC into production:
- Add secret vault integration  
- Enable retry strategies  
- Add trace/video capturing  
- Strengthen test data management  
- Integrate with Test Management (Azure, Jira, etc.)  
- Implement parallel sharding for large-scale execution  

---
