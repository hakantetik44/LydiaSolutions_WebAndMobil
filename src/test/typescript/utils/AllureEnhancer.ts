/**
 * 🎯 AllureEnhancer - Enhances Allure reports to professional level
 *
 * This class adds the following to Allure reports:
 * ✅ Environment information (device, OS, app version)
 * ✅ Categories (error classification)
 * ✅ Executor information (who ran it, when)
 * ✅ Custom attachments (logcat, device info)
 * ✅ Test metadata and duration information
 *
 * @author Test Automation Framework
 */

import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ConfigReader } from './ConfigReader';
import { OS } from './OS';

const execAsync = promisify(exec);

interface EnvironmentInfo {
    'Platform': string;
    'OS Version': string;
    'Device Model': string;
    'App Package': string;
    'App Activity': string;
    'Automation Name': string;
    'Node Version': string;
    'Test Environment': string;
    'Execution Date': string;
    'Executor': string;
}

interface CategoryItem {
    name: string;
    matchedStatuses: string[];
    messageRegex?: string;
    traceRegex?: string;
}

interface ExecutorInfo {
    name: string;
    type: string;
    buildOrder: number;
    buildName: string;
    buildUrl?: string;
    reportUrl?: string;
    reportName?: string;
}

export class AllureEnhancer {
    private allureResultsDir: string;
    private platform: string;

    constructor(allureResultsDir: string = 'target/allure-results') {
        this.allureResultsDir = path.resolve(process.cwd(), allureResultsDir);
        this.platform = (process.env.platformName || 'android').toLowerCase();
        this.ensureDirectoryExists(this.allureResultsDir);
    }

    /**
     * 🚀 Run all Allure enhancements at once
     */
    public async enhanceAllureReport(): Promise<void> {
        console.log('\n🎨 Enhancing Allure report...\n');

        try {
            // 1. Add environment information
            await this.generateEnvironmentProperties();
            console.log('✅ Environment information added');

            // 2. Add categories (error classification)
            await this.generateCategories();
            console.log('✅ Test categories created');

            // 3. Add executor information
            await this.generateExecutor();
            console.log('✅ Executor information added');

            // 4. Add device information as attachment
            await this.attachDeviceInfo();
            console.log('✅ Device information added');

            // 5. Add logcat (Android only)
            if (this.platform === 'android') {
                await this.attachLogcat();
                console.log('✅ Logcat added');
            }

            console.log('\n🎉 Allure report successfully enhanced!\n');
        } catch (error) {
            console.error('❌ Allure enhancement error:', error);
        }
    }

    /**
     * 📱 Generate environment properties file (Allure compatible)
     */
    private async generateEnvironmentProperties(): Promise<void> {
        const envInfo = await this.collectEnvironmentInfo();

        // write in properties format for Allure
        const propertiesContent = Object.entries(envInfo)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');

        const propertiesPath = path.join(this.allureResultsDir, 'environment.properties');
        fs.writeFileSync(propertiesPath, propertiesContent, 'utf-8');
    }

    /**
     * 📊 Create test categories (error classification)
     */
    private async generateCategories(): Promise<void> {
        const categories: CategoryItem[] = [
            {
                name: '🐛 Product Defects',
                matchedStatuses: ['failed'],
                messageRegex: '.*(AssertionError|Expected|Actual).*'
            },
            {
                name: '⚠️ Test Defects',
                matchedStatuses: ['failed', 'broken'],
                messageRegex: '.*(NoSuchElementException|TimeoutException|ElementNotFound).*'
            },
            {
                name: '🔥 Known Issues',
                matchedStatuses: ['failed'],
                messageRegex: '.*(KNOWN|BUG|JIRA).*'
            },
            {
                name: '🌊 Flaky Tests',
                matchedStatuses: ['failed', 'broken'],
                messageRegex: '.*(flaky|intermittent|random).*'
            },
            {
                name: '⏰ Timeout Issues',
                matchedStatuses: ['broken'],
                messageRegex: '.*(timeout|timed out|TimeoutException).*'
            },
            {
                name: '📱 Device/Driver Issues',
                matchedStatuses: ['broken'],
                messageRegex: '.*(driver|device|connection|session).*'
            },
            {
                name: '✅ Passed Tests',
                matchedStatuses: ['passed']
            },
            {
                name: '⊘ Skipped Tests',
                matchedStatuses: ['skipped']
            }
        ];

        const categoriesPath = path.join(this.allureResultsDir, 'categories.json');
        fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2), 'utf-8');
    }

    /**
     * 👤 Generate executor information (who ran the tests)
     */
    private async generateExecutor(): Promise<void> {
        const buildNumber = process.env.BUILD_NUMBER || Date.now().toString();
        const userName = await this.getUserName();

        const executor: ExecutorInfo = {
            name: process.env.CI ? 'CI/CD Pipeline' : `Local - ${userName}`,
            type: process.env.CI ? 'jenkins' : 'local',
            buildOrder: parseInt(buildNumber),
            buildName: `Build #${buildNumber}`,
            buildUrl: process.env.BUILD_URL || undefined,
            reportUrl: process.env.REPORT_URL || undefined,
            reportName: `Lydia Mobile Tests - ${this.platform.toUpperCase()}`
        };

        const executorPath = path.join(this.allureResultsDir, 'executor.json');
        fs.writeFileSync(executorPath, JSON.stringify(executor, null, 2), 'utf-8');
    }

    /**
     * 📱 Collect device information and write as attachment
     */
    private async attachDeviceInfo(): Promise<void> {
        try {
            const deviceInfo = await this.getDeviceInfo();
            const deviceInfoPath = path.join(this.allureResultsDir, 'device-info.txt');

            const content = `
╔════════════════════════════════════════════════════════════╗
║                    📱 DEVICE INFORMATION                    ║
╚════════════════════════════════════════════════════════════╝

${deviceInfo}

═══════════════════════════════════════════════════════════════
Generated: ${new Date().toLocaleString('en-US')}
═══════════════════════════════════════════════════════════════
`;

            fs.writeFileSync(deviceInfoPath, content, 'utf-8');
        } catch (error) {
            console.warn('Device information could not be collected:', error);
        }
    }

    /**
     * 📋 Attach Android logcat (Android only)
     */
    private async attachLogcat(): Promise<void> {
        if (!OS.isAndroid()) return;

        try {
            const { stdout } = await execAsync('adb logcat -d -t 500');
            const logcatPath = path.join(this.allureResultsDir, 'logcat.txt');

            const content = `
╔════════════════════════════════════════════════════════════╗
║                    📋 ANDROID LOGCAT                        ║
╚════════════════════════════════════════════════════════════╝

${stdout}

═══════════════════════════════════════════════════════════════
Captured: ${new Date().toLocaleString('en-US')}
═══════════════════════════════════════════════════════════════
`;

            fs.writeFileSync(logcatPath, content, 'utf-8');
        } catch (error) {
            console.warn('Logcat could not be collected:', error);
        }
    }

    /**
     * 🔍 Collect environment information
     */
    private async collectEnvironmentInfo(): Promise<EnvironmentInfo> {
        const osVersion = await this.getOSVersion();
        const deviceModel = await this.getDeviceModel();
        const userName = await this.getUserName();
        const appPackage = (ConfigReader.getProperty('android.app.package', 'org.wikipedia.alpha') || 'org.wikipedia.alpha');
        const appActivity = (ConfigReader.getProperty('android.app.activity', '.main.MainActivity') || '.main.MainActivity');
        const automationName = (ConfigReader.getProperty('automationName', 'UiAutomator2') || 'UiAutomator2');
        const testEnv = process.env.TEST_ENV || 'LOCAL';
        const nodeVersion = process.version;
        const executionDate = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        return {
            'Platform': this.platform.toUpperCase(),
            'OS Version': osVersion,
            'Device Model': deviceModel,
            'App Package': appPackage,
            'App Activity': appActivity,
            'Automation Name': automationName,
            'Node Version': nodeVersion,
            'Test Environment': testEnv,
            'Execution Date': executionDate,
            'Executor': userName
        };
    }

    /**
     * 📱 Get OS version
     */
    private async getOSVersion(): Promise<string> {
        try {
            if (OS.isAndroid()) {
                const { stdout } = await execAsync('adb shell getprop ro.build.version.release');
                return `Android ${stdout.trim()}`;
            } else {
                return 'iOS (Simulator/Device)';
            }
        } catch {
            return 'Unknown';
        }
    }

    /**
     * 📱 Get device model
     */
    private async getDeviceModel(): Promise<string> {
        try {
            if (OS.isAndroid()) {
                const { stdout } = await execAsync('adb shell getprop ro.product.model');
                return stdout.trim();
            } else {
                return 'iOS Device/Simulator';
            }
        } catch {
            return 'Unknown Device';
        }
    }

    /**
     * 📱 Collect detailed device info
     */
    private async getDeviceInfo(): Promise<string> {
        const lines: string[] = [];

        try {
            if (OS.isAndroid()) {
                // Android device details
                lines.push('🤖 ANDROID DEVICE DETAILS\n');

                const commands = [
                    { label: '📱 Device Model', cmd: 'adb shell getprop ro.product.model' },
                    { label: '🏢 Manufacturer', cmd: 'adb shell getprop ro.product.manufacturer' },
                    { label: '🔢 Android Version', cmd: 'adb shell getprop ro.build.version.release' },
                    { label: '🏗️ SDK Version', cmd: 'adb shell getprop ro.build.version.sdk' },
                    { label: '📦 Build ID', cmd: 'adb shell getprop ro.build.id' },
                    { label: '🔧 Device Name', cmd: 'adb shell getprop ro.product.device' },
                    { label: '💾 Total Memory', cmd: 'adb shell cat /proc/meminfo | grep MemTotal' },
                    { label: '🔋 Battery Level', cmd: 'adb shell dumpsys battery | grep level' },
                    { label: '📶 WiFi State', cmd: 'adb shell dumpsys wifi | grep "Wi-Fi is"' }
                ];

                for (const { label, cmd } of commands) {
                    try {
                        const { stdout } = await execAsync(cmd);
                        const value = stdout.trim().replace(/\n/g, ' ').slice(0, 100);
                        lines.push(`${label}: ${value}`);
                    } catch {
                        lines.push(`${label}: N/A`);
                    }
                }

                // Screen size
                try {
                    const { stdout } = await execAsync('adb shell wm size');
                    lines.push(`📐 Screen Size: ${stdout.trim()}`);
                } catch { /* ignore */ }

                // App version
                try {
                    const appPackage = ConfigReader.getProperty('android.app.package', 'org.wikipedia.alpha');
                    const { stdout } = await execAsync(`adb shell dumpsys package ${appPackage} | grep versionName`);
                    lines.push(`📦 App Version: ${stdout.trim()}`);
                } catch { /* ignore */ }

            } else {
                // iOS device details
                lines.push('🍎 iOS DEVICE DETAILS\n');
                lines.push('Platform: iOS');
                lines.push('Device: Simulator or Physical Device');
                lines.push('Note: Detailed iOS info requires additional tools');
            }
        } catch (error) {
            lines.push(`Error collecting device info: ${error}`);
        }

        return lines.join('\n');
    }

    /**
     * 👤 Get current user name
     */
    private async getUserName(): Promise<string> {
        try {
            const { stdout } = await execAsync('whoami');
            return stdout.trim();
        } catch {
            return process.env.USER || process.env.USERNAME || 'Unknown User';
        }
    }

    /**
     * 📁 Ensure directory exists
     */
    private ensureDirectoryExists(directory: string): void {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    }

    /**
     * 🧹 Clean old report files
     */
    public cleanOldReports(): void {
        try {
            const files = [
                'environment.properties',
                'categories.json',
                'executor.json',
                'device-info.txt',
                'logcat.txt'
            ];

            files.forEach(file => {
                const filePath = path.join(this.allureResultsDir, file);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });

            console.log('🧹 Old report files cleaned');
        } catch (error) {
            console.warn('Cleanup error:', error);
        }
    }

    /**
     * 📊 Collect test statistics and write summary
     */
    public async generateTestStatistics(): Promise<void> {
        try {
            const cucumberJsonPath = path.join(process.cwd(), 'target', 'cucumber.json');

            if (!fs.existsSync(cucumberJsonPath)) {
                console.warn('Cucumber JSON not found');
                return;
            }

            const raw = fs.readFileSync(cucumberJsonPath, 'utf-8').trim();
            if (!raw) {
                console.warn('Cucumber JSON is empty');
                // still write an empty stats file with zeros
                const emptyStats = this.buildStatsContent(0, 0, 0, 0, 0);
                fs.writeFileSync(path.join(this.allureResultsDir, 'test-statistics.txt'), emptyStats, 'utf-8');
                return;
            }

            let cucumberData: any[];
            try {
                cucumberData = JSON.parse(raw);
            } catch (err) {
                console.warn('Failed to parse cucumber JSON:', err);
                const emptyStats = this.buildStatsContent(0, 0, 0, 0, 0);
                fs.writeFileSync(path.join(this.allureResultsDir, 'test-statistics.txt'), emptyStats, 'utf-8');
                return;
            }

            let totalTests = 0;
            let passed = 0;
            let failed = 0;
            let skipped = 0;
            let totalDuration = 0;

            for (const feature of cucumberData) {
                for (const scenario of feature.elements || []) {
                    totalTests++;
                    let scenarioStatus = 'passed';
                    let scenarioDuration = 0;

                    for (const step of scenario.steps || []) {
                        scenarioDuration += step.result?.duration || 0;
                        if (step.result?.status === 'failed') {
                            scenarioStatus = 'failed';
                        } else if (step.result?.status === 'skipped' && scenarioStatus !== 'failed') {
                            scenarioStatus = 'skipped';
                        }
                    }

                    if (scenarioStatus === 'passed') passed++;
                    else if (scenarioStatus === 'failed') failed++;
                    else skipped++;

                    totalDuration += scenarioDuration;
                }
            }

            const statsContent = this.buildStatsContent(totalTests, passed, failed, skipped, totalDuration);
            const statsPath = path.join(this.allureResultsDir, 'test-statistics.txt');
            fs.writeFileSync(statsPath, statsContent, 'utf-8');

        } catch (error) {
            console.warn('Test statistics could not be generated:', error);
        }
    }

    // Helper to build stats text consistently
    private buildStatsContent(totalTests: number, passed: number, failed: number, skipped: number, totalDurationNanoseconds: number): string {
        const totalDurationSeconds = (totalDurationNanoseconds / 1e9).toFixed(2);
        return `\n╔════════════════════════════════════════════════════════════╗\n║                    📊 TEST STATISTICS                       ║\n╚════════════════════════════════════════════════════════════╝\n\n📊 Total Tests: ${totalTests}\n✅ Passed: ${passed} (${totalTests > 0 ? ((passed / totalTests) * 100).toFixed(1) : 0}%)\n❌ Failed: ${failed} (${totalTests > 0 ? ((failed / totalTests) * 100).toFixed(1) : 0}%)\n⊘ Skipped: ${skipped} (${totalTests > 0 ? ((skipped / totalTests) * 100).toFixed(1) : 0}%)\n⏱️ Total Duration: ${totalDurationSeconds}s\n\n═══════════════════════════════════════════════════════════════\nPlatform: ${this.platform.toUpperCase()}\nGenerated: ${new Date().toLocaleString('en-US')}\n═══════════════════════════════════════════════════════════════\n`;
    }
}

// Exportable convenience function
export async function enhanceAllure(allureResultsDir?: string): Promise<void> {
    const enhancer = new AllureEnhancer(allureResultsDir);
    await enhancer.enhanceAllureReport();
    await enhancer.generateTestStatistics();
}
