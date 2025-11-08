import { remote } from 'webdriverio';
import { ConfigReader } from './ConfigReader';
import * as fs from 'fs';
import * as path from 'path';

export class Driver {
    private static driverPool: WebdriverIO.Browser | null = null;
    private static readonly APPIUM_URL: string = ConfigReader.getProperty('appium.server.url') || 'http://localhost:4723';
    private static readonly IMPLICIT_WAIT: number = parseInt(ConfigReader.getProperty('web.implicit.wait') || '3');

    private constructor() {
        // Private constructor to prevent instantiation
    }

    public static async getDriver(): Promise<WebdriverIO.Browser> {
        if (this.driverPool === null) {
            const platform = process.env.platformName;

            if (!platform) {
                throw new Error("Platform is not specified! Please run with platformName=android or platformName=ios");
            }

            await this.initializeDriver(platform.toLowerCase());
        }
        return this.driverPool!;
    }

    private static async initializeDriver(platform: string): Promise<void> {
        try {
            switch (platform) {
                case 'android':
                    await this.initializeAndroidDriver();
                    break;
                case 'ios':
                    await this.initializeIOSDriver();
                    break;
                default:
                    throw new Error(`Invalid platform! Platform: ${platform}. Only 'android' and 'ios' are supported.`);
            }

            await this.configureDriver();

        } catch (error) {
            throw new Error(`Failed to initialize driver: ${error}`);
        }
    }

    private static async initializeAndroidDriver(): Promise<void> {
        // Read raw values from configuration
        const configuredPackage = ConfigReader.getProperty('android.app.package');
        let configuredActivity = ConfigReader.getProperty('android.app.activity') || '';

        // If activity is provided in the form 'package/activity', split it
        let appPackage = configuredPackage;
        let appActivity = configuredActivity;
        if (configuredActivity.includes('/')) {
            const parts = configuredActivity.split('/');
            if (parts.length === 2) {
                if (!appPackage || appPackage.trim().length === 0) {
                    appPackage = parts[0];
                }
                appActivity = parts[1].startsWith('.') ? parts[1] : parts[1];
            }
        }

        // Optional: include local APK if configured
        const appPathConfig = ConfigReader.getProperty('android.app.path');
        let resolvedAppPath: string | undefined = undefined;
        if (appPathConfig) {
            const absPath = path.isAbsolute(appPathConfig) ? appPathConfig : path.join(process.cwd(), appPathConfig);
            if (fs.existsSync(absPath)) {
                resolvedAppPath = absPath;
            }
        }

        // Fresh start flags from config (default to noReset=false, fullReset optional)
        const noResetCfg = (ConfigReader.getProperty('android.no.reset') || 'false').toLowerCase() === 'true';
        const fullResetCfg = (ConfigReader.getProperty('android.full.reset') || 'false').toLowerCase() === 'true';

        const androidCapabilities: any = {
            platformName: ConfigReader.getProperty('android.platform.name') || 'Android',
            'appium:deviceName': ConfigReader.getProperty('android.device.name'),
            'appium:platformVersion': ConfigReader.getProperty('android.platform.version'),
            'appium:automationName': ConfigReader.getProperty('android.automation.name') || 'UiAutomator2',
            'appium:udid': ConfigReader.getProperty('android.udid'),
            'appium:appPackage': appPackage,
            'appium:appActivity': appActivity,
            'appium:noReset': noResetCfg,
            'appium:fullReset': fullResetCfg,
            'appium:autoGrantPermissions': ConfigReader.getProperty('android.auto.grant.permissions') === 'true',
            'appium:adbExecTimeout': parseInt(ConfigReader.getProperty('android.adb.execution.timeout') || '20000')
        };

        if (resolvedAppPath) {
            androidCapabilities['appium:app'] = resolvedAppPath;
        }

        const androidOptions = {
            logLevel: 'silent' as const,
            hostname: new URL(this.APPIUM_URL).hostname,
            port: parseInt(new URL(this.APPIUM_URL).port) || 4723,
            path: '/',
            capabilities: androidCapabilities
        };
        this.driverPool = await remote(androidOptions);
    }

    private static async initializeIOSDriver(): Promise<void> {
        // Fresh start flags from config (default to noReset=false)
        const noResetCfg = (ConfigReader.getProperty('ios.no.reset') || 'false').toLowerCase() === 'true';
        const fullResetCfg = (ConfigReader.getProperty('ios.full.reset') || 'false').toLowerCase() === 'true';

        const iOSOptions = {
            logLevel: 'silent' as const,
            hostname: new URL(this.APPIUM_URL).hostname,
            port: parseInt(new URL(this.APPIUM_URL).port) || 4723,
            path: '/',
            capabilities: {
                platformName: ConfigReader.getProperty('ios.platform.name') || 'iOS',
                'appium:platformVersion': ConfigReader.getProperty('ios.platform.version'),
                'appium:deviceName': ConfigReader.getProperty('ios.device.name'),
                'appium:udid': ConfigReader.getProperty('ios.udid'),
                'appium:automationName': ConfigReader.getProperty('ios.automation.name') || 'XCUITest',
                'appium:bundleId': ConfigReader.getProperty('ios.bundle.id'),
                'appium:noReset': noResetCfg,
                'appium:fullReset': fullResetCfg,
                'appium:usePrebuiltWDA': true,
                'appium:showXcodeLog': true,
                'appium:useNewWDA': false,
                'appium:wdaStartupRetries': 4,
                'appium:iosInstallPause': 8000,
                'appium:wdaStartupRetryInterval': 20000
            }
        };
        this.driverPool = await remote(iOSOptions);
    }

    private static async configureDriver(): Promise<void> {
        if (this.driverPool !== null) {
            await this.driverPool.setTimeout({ 'implicit': this.IMPLICIT_WAIT * 1000 });
        }
    }

    public static async closeDriver(): Promise<void> {
        try {
            if (this.driverPool !== null) {
                await this.driverPool.deleteSession();
                this.driverPool = null;
            }
        } catch { /* ignore */ }
    }
}
