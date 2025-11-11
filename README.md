<div align="center">

<img src="https://upload.wikimedia.org/wikipedia/fr/thumb/c/c7/Logo_Lydia.png/1200px-Logo_Lydia.png" height="120" alt="Lydia" />

<h1 style="border-bottom:none; margin-top:12px;">Lydia Mobile & API E2E Test Automation</h1>

<p>
<b>Appium 3 • WebdriverIO 9 • Cucumber.js • TypeScript 5 • Allure Report • API Testing</b>
</p>

<p>
<a href="#continuous-integration"><img src="https://img.shields.io/badge/Jenkins-Pipeline-blue" alt="Jenkins" /></a>
<img src="https://img.shields.io/badge/Node.js-20.x-brightgreen" alt="Node 20" />
<img src="https://img.shields.io/badge/Appium-3.1.0-9cf" alt="Appium 3.1" />
<img src="https://img.shields.io/badge/Platform-Android%20|%20iOS%20|%20API-orange" alt="Platforms" />
<img src="https://img.shields.io/badge/Reports-Allure-success" alt="Allure" />
</p>

</div>

---

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Setup & Installation](#setup--installation)
5. [Mobile Tests](#mobile-tests)
6. [API Tests](#api-tests)
7. [Allure Reporting](#allure-reporting)
8. [Video & Logs](#video--logs)
9. [Jenkins Pipeline](#continuous-integration)
10. [Configuration](#configuration)
11. [Troubleshooting](#troubleshooting)
12. [Next Improvements](#next-improvements)

## Overview
Comprehensive end-to-end automation test suite for Lydia mobile applications and APIs. The suite includes:
- **Mobile Tests**: Full user journey covering onboarding, carousel navigation, searching, language change, deep scroll, and link navigation
- **API Tests**: REST API testing with reqres.in endpoints (POST Create, GET User)
- **Rich Reporting**: Allure reports with video recordings, device logs, environment info, and test statistics
- **CI/CD Ready**: Jenkins pipeline integration with platform-specific builds

## Tech Stack
- **Language:** TypeScript 5+
- **Test Runner:** Cucumber.js
- **Mobile Automation:** WebdriverIO 9 + Appium 3.1 (UiAutomator2 / XCUITest)
- **API Testing:** Native Fetch API with TypeScript
- **Reporting:** Allure (custom enhancers for both mobile and API tests)
- **Media:** Screen recording per scenario (Base64 -> MP4 attach)
- **Node:** 20.x LTS
- **CI:** Jenkins (declarative pipeline)

## Project Structure
```
├─ api-tests/                    # API Test Framework (Independent)
│  ├─ features/                  # Gherkin feature files
│  ├─ stepDefinitions/           # API step definitions & hooks
│  ├─ pages/                     # API Clients (POM pattern)
│  │  ├─ BaseApiClient.ts        # Base HTTP client
│  │  └─ ReqResApiClient.ts      # reqres.in API client
│  ├─ utils/                      # API utilities
│  │  ├─ ApiAllureEnhancer.ts    # API Allure enhancer
│  │  ├─ ApiResponse.ts          # Response types
│  │  └─ LaunchGenerator.ts      # Launch.json generator
│  ├─ config/                     # API configuration
│  │  └─ api.config.ts           # API base URL & headers
│  └─ cucumber.js                # API Cucumber config
├─ src
│  └─ test
│     ├─ resources
│     │  ├─ features/            # Mobile Cucumber feature files
│     │  └─ configuration.properties
│     └─ typescript
│        ├─ stepDefinitions/     # Mobile hooks + step implementations
│        ├─ pages/               # Page Objects (HomePage, BasePage)
│        └─ utils/               # Driver, ConfigReader, AllureEnhancer, OS helpers
├─ target
│  ├─ allure-results/           # Mobile Allure results
│  ├─ allure-report/            # Mobile Allure report
│  ├─ allure-api-results/       # API Allure results
│  ├─ allure-api-report/        # API Allure report
│  ├─ videos/                    # Scenario recordings (.mp4)
│  └─ logcat.txt                 # Android log extraction
├─ Jenkinsfile                   # CI pipeline
├─ package.json
├─ cucumber.js                   # Mobile Cucumber config
└─ tsconfig.json
```

## Setup & Installation

### Prerequisites
- macOS with Xcode tools (for iOS) / Android SDK (for Android)
- Node.js 20.x (use `nvm`)
- Java 11+ (for Appium drivers if required)
- Appium 3.1.0 (will be installed automatically in Jenkins pipeline)

### Install Node Dependencies
```bash
npm ci   # or: npm install
```

### Environment Variables (local)
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
# Optional if you use PATH for platform-tools
export PATH=$ANDROID_HOME/platform-tools:$PATH
```

---

## Mobile Tests

### Start Appium (Local)
To start Appium locally (Android), export environment variables first:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk && export ANDROID_SDK_ROOT=$ANDROID_HOME && appium
```

### Run Mobile Tests

#### Android
```bash
nvm use 20
export ANDROID_HOME=$HOME/Library/Android/sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
platformName=android npm test
```

#### iOS
```bash
nvm use 20
platformName=ios npm test
```

#### Run Only Tests (Quick)
Quick run without opening report (e.g., for CI or debug):
```bash
platformName=android npm run test:only
```

### Mobile Test Scenarios
- Launch the app
- Swipe through carousel until the last image
- Search for "Lydia"
- Scroll until finding the city "Lydia" and dismiss popup
- Change website language to French
- Scroll down to the bottom of the page
- Click on "Crésus" and navigate to the newly opened page

### Mobile Allure Report
```bash
npm run allure:report
```

### Clean Mobile Results
```bash
npm run allure:clean
```

---

## API Tests

### Run API Tests

#### Run API Tests (with report)
```bash
npm run test:api
```

#### Run Tests Only (without opening report)
```bash
npm run test:api:only
```

### API Test Scenarios

#### 1. Create User (POST)
- **Endpoint:** `POST /api/users`
- **Validations:**
  - Status code: 201
  - Response body contains name, job, id, createdAt fields
  - Response time < 5000ms

#### 2. Get User (GET)
- **Endpoint:** `GET /api/users/{id}`
- **Validations:**
  - Status code: 200
  - Response body contains id, email, first_name, last_name, avatar fields
  - Response time < 3000ms

### API Allure Report

#### Generate and Open Report
```bash
npm run allure:api:report
```

#### Generate Report Only
```bash
npm run allure:api:generate
```

#### Open Report
```bash
npm run allure:api:open
```

#### Serve Report (Recommended)
```bash
npm run allure:api:serve
```

### Clean API Results
```bash
npm run allure:api:clean
```

### API Test Framework Features
- ✅ Written in TypeScript
- ✅ Uses Cucumber/Gherkin syntax
- ✅ Page Object Model (POM) pattern - as API Clients
- ✅ Independent hooks and setup
- ✅ Separate Allure report (`target/allure-api-report`)
- ✅ Completely independent from mobile tests

---

## Allure Reporting

### Mobile Tests Enhancements
Automatically executed at the end of the run:
- Environment properties (`environment.properties`)
- Executor metadata (`executor.json`)
- Device information (`device-info.txt`)
- Logcat (Android)
- Scenario video attachments
- Categories + test statistics

### API Tests Enhancements
Automatically executed at the end of the run:
- Environment properties (API Base URL, Node Version, etc.)
- Executor metadata
- Test categories (API Errors, Test Defects, Network Issues)
- Launch.json generation

### Report Locations
- **Mobile:** `target/allure-report/index.html`
- **API:** `target/allure-api-report/index.html`

Local runs will attempt to open the HTML report automatically. In CI (`CI=true`), only generation occurs; Jenkins plugin handles publishing.

### Manual View (if auto open fails)
```bash
# Mobile
allure generate target/allure-results --clean -o target/allure-report
open target/allure-report/index.html

# API
allure generate target/allure-api-results --clean -o target/allure-api-report
open target/allure-api-report/index.html
```

## Video & Logs

| Artifact | Location | Notes |
|----------|----------|-------|
| Mobile Videos | `target/videos/*.mp4` | Per scenario recording (stopped in After hook) |
| Mobile Logcat | `target/allure-results/logcat.txt` | Captured via enhancer |
| Device Info | `target/allure-results/device-info.txt` | Capabilities + platform |
| Test Statistics | `target/allure-results/test-statistics.txt` | Aggregated counts |
| API Attachments | `target/allure-api-results/*-attachment.json` | Request/Response JSON |

## Continuous Integration

Jenkins Declarative Pipeline (`Jenkinsfile`) stages:
1. Prepare (Node / PATH)
2. Install Dependencies
3. Setup Appium (drivers per platform)
4. Start Appium
5. Prechecks (adb / xcrun / appium / allure)
6. Run Tests (platformName env)
7. Post (archive + Allure publish + cleanup)

### Trigger Example
```bash
# Android job
build with parameters: PLATFORM=android
# iOS job
build with parameters: PLATFORM=ios
```

### Jenkins Allure Publish
Ensure the **Allure Jenkins Plugin** is installed and configured. The pipeline calls:
```groovy
allure(results: [[path: 'target/allure-results']])
```

For API tests, you can add:
```groovy
allure(results: [[path: 'target/allure-api-results']])
```

## Configuration

### Mobile Tests
Managed via `src/test/resources/configuration.properties`:
```
android.no.reset=false
ios.no.reset=false
android.app.package=org.wikipedia.alpha
android.app.activity=org.wikipedia.DefaultIcon
web.implicit.wait=10
```
Adjust `android.full.reset` or `ios.full.reset` (uncomment) for full reinstall behavior.

### API Tests
Managed via `api-tests/config/api.config.ts`:
```typescript
BASE_URL: 'https://reqres.in/api'
TIMEOUT: 30000
HEADERS: {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| App launches with previous state | noReset true | Set `android.no.reset=false` (already) or enable full reset |
| Allure shows "Loading..." | Opened via file:// too early | Run generate then open; let enhancer finish. For API, use `npm run allure:api:serve` |
| Appium not found in CI | Global install failed | Check npm prefix permissions, rerun Setup Appium stage |
| iOS fails (xcrun missing) | Xcode CLT absent | `xcode-select --install` |
| Video not attached | Driver stopRecording error | Ignored by design; check device logs |
| API tests return 401 | reqres.in API issue | Check API status, may be temporary |

## Next Improvements
- Parallel execution (matrix) for Android + iOS
- Add retry for flaky scenarios
- Add ESLint / Prettier for style consistency
- Integrate Slack notifications post-build
- Add Web platform WDIO config (if web tests added)
- Expand API test coverage (PUT, DELETE, PATCH endpoints)
- Add API test data management
- Add API mocking capabilities

---

> Maintained with focus on speed (aggressive polling), clean page objects, rich reporting for fast feedback, and independent mobile/API test frameworks.
