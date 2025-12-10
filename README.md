# Playwright POC - BDD (SauceDemo)

This is a Proof-of-Concept automation project using:
- Playwright (UI + API)
- TypeScript
- Cucumber (Gherkin) for BDD
- Pino for structured logging
- multiple-cucumber-html-reporter for HTML reports

Target application: https://www.saucedemo.com (open-source demo for testing)

## Quick start

1. Copy `.env.example` to `.env` and edit if needed.
2. Install packages:
   ```bash
   npm ci
   npm run prepare
   ```
3. Run tests:
   ```bash
   npm run test
   ```
4. Generate HTML report:
   ```bash
   npm run report
   ```

Reports will be in `reports/html`. Screenshots are in `screenshots/`. Logs in `logs/`.


## Azure CI and DB (Mock or Real)

This POC includes a sample `docker-compose.yml` that brings up a MySQL 8 container and seeds a simple `users` table used for DB validations.

Usage (local):
```bash
docker-compose up -d
# wait ~20s for DB to init, then run tests
npm run test
docker-compose down
```

A sample Azure Pipelines YAML (`azure-pipelines.yml`) is included for CI usage. It:
- installs Node
- brings up the MySQL container via docker-compose
- installs Playwright browsers
- runs tests and publishes `reports` as build artifacts
- tears down docker-compose after the run

### Mock DB mode (no container needed)

This POC supports a mock DB mode to demonstrate DB connectivity without spinning up a real database.
Set `DB_TYPE=mock` in your `.env` to enable mock responses for common queries (used for POC assertions).

If you want to connect to a real DB, set `DB_TYPE` to `mysql` or `mssql` and provide connection details in `.env`.

Example `.env` for mock mode:
```
DB_TYPE=mock
```

