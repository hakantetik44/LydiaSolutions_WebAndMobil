<div align="center">

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Lydia_Logo.svg/512px-Lydia_Logo.svg.png" height="84" alt="Lydia" />

<h1 style="border-bottom:none; margin-top:12px;">Lydia Mobile & Web E2E Test Automation</h1>

<p>
<b>Appium 3 • WebdriverIO 9 • Cucumber.js • TypeScript 5 • Allure Report • Video & Device Logs</b>
</p>

<p>
<a href="#continuous-integration"><img src="https://img.shields.io/badge/Jenkins-Pipeline-blue" alt="Jenkins" /></a>
<img src="https://img.shields.io/badge/Node.js-20.x-brightgreen" alt="Node 20" />
<img src="https://img.shields.io/badge/Appium-3.1.0-9cf" alt="Appium 3.1" />
<img src="https://img.shields.io/badge/Platform-Android%20|%20iOS%20|%20Web-orange" alt="Platforms" />
<img src="https://img.shields.io/badge/Reports-Allure-success" alt="Allure" />
</p>

</div>

---

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Setup & Installation](#setup--installation)
5. [Running Tests (Local)](#running-tests-local)
6. [Allure Reporting](#allure-reporting)
7. [Video & Logs](#video--logs)
8. [Jenkins Pipeline](#continuous-integration)
9. [Configuration](#configuration)
10. [Troubleshooting](#troubleshooting)
11. [Next Improvements](#next-improvements)
12. [License](#license)

## Overview
End-to-end automation test suite for the Lydia mobile & web applications. The suite covers a full user journey: onboarding skip, carousel navigation, searching, language change, deep scroll, link navigation, and validation of a target page (Crésus) with enriched reporting (video, logcat, device info, environment, statistics) and CI-friendly behavior.

## Tech Stack
- **Language:** TypeScript 5+
- **Test Runner:** Cucumber.js
- **Automation:** WebdriverIO 9 + Appium 3.1 (UiAutomator2 / XCUITest)
- **Reporting:** Allure (custom enhancer adds: environment, categories, executor, device info, logcat, test statistics)
- **Media:** Screen recording per scenario (Base64 -> MP4 attach)
- **Node:** 20.x LTS
- **CI:** Jenkins (declarative pipeline)

## Project Structure
```
├─ src
│  └─ test
│     ├─ resources
│     │  └─ features            # Cucumber feature files
│     └─ typescript
│        ├─ stepDefinitions     # Hooks + Step implementations
│        ├─ pages               # Page Objects (HomePage, BasePage, etc.)
│        └─ utils               # Driver, ConfigReader, AllureEnhancer, OS helpers
├─ target
│  ├─ allure-results            # Raw Allure JSON + attachments
│  ├─ allure-report             # Generated static report (local runs)
│  ├─ videos                    # Scenario recordings (.mp4)
│  └─ logcat.txt                # Android log extraction
├─ Jenkinsfile                  # CI pipeline
├─ wdio.conf.ts (if present)    # WDIO config (hybrid usage if needed)
├─ package.json
├─ cucumber.js
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

## Running Tests (Local)
### Android
```bash
nvm use 20
export ANDROID_HOME=$HOME/Library/Android/sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
platformName=android npm test
```

### iOS
```bash
nvm use 20
platformName=ios npm test
```

### Only Generate / Open Allure After Finished
(Already part of `npm test` scripts.)
```bash
npm run allure:report
```

### Clean Previous Results
```bash
npm run allure:clean
```

## Allure Reporting
Enhancements automatically executed at the end of the run:
- Environment properties (`environment.properties`)
- Executor metadata (`executor.json`)
- Device information (`device-info.txt`)
- Logcat (Android)
- Scenario video attachments
- Categories + test statistics

Local run will attempt to open the HTML report automatically. In CI (`CI=true`), only generation occurs; Jenkins plugin handles publishing.

### Manual View (if auto open fails)
```bash
allure generate target/allure-results --clean -o target/allure-report
open target/allure-report/index.html
```

## Video & Logs
| Artifact | Location | Notes |
|----------|----------|-------|
| Videos | `target/videos/*.mp4` | Per scenario recording (stopped in After hook) |
| Logcat | `target/allure-results/logcat.txt` | Captured via enhancer |
| Device Info | `target/allure-results/device-info.txt` | Capabilities + platform |
| Test Statistics | `target/allure-results/test-statistics.txt` | Aggregated counts |

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

## Configuration
Managed via `src/test/resources/configuration.properties`:
```
android.no.reset=false
ios.no.reset=false
android.app.package=org.wikipedia.alpha
android.app.activity=org.wikipedia.DefaultIcon
web.implicit.wait=10
```
Adjust `android.full.reset` or `ios.full.reset` (uncomment) for full reinstall behavior.

## Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
| App launches with previous state | noReset true | Set `android.no.reset=false` (already) or enable full reset |
| Allure shows "Loading..." | Opened via file:// too early | Run generate then open; let enhancer finish |
| Appium not found in CI | Global install failed | Check npm prefix permissions, rerun Setup Appium stage |
| iOS fails (xcrun missing) | Xcode CLT absent | `xcode-select --install` |
| Video not attached | Driver stopRecording error | Ignored by design; check device logs |

## Next Improvements
- Parallel execution (matrix) for Android + iOS
- Add retry for flaky scenarios
- Add ESLint / Prettier for style consistency
- Integrate Slack notifications post-build
- Add Web platform WDIO config (if web tests added)

## License
Internal / proprietary test automation assets. Adjust license header if distributing.

---
> Maintained with focus on speed (aggressive polling), clean page objects, and rich reporting for fast feedback.
