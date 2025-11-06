import { remote } from 'webdriverio';
import { ConfigReader } from './ConfigReader';

export class Driver {
    private static driverPool: WebdriverIO.Browser | null = null;
    private static readonly APPIUM_URL: string = ConfigReader.getProperty('appium.server.url') || 'http://localhost:4723';
    private static readonly IMPLICIT_WAIT: number = parseInt(ConfigReader.getProperty('web.implicit.wait') || '10');

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
            console.log(`${platform.toUpperCase()} driver created successfully!`);

        } catch (error) {
            console.error(`Error creating driver for platform ${platform}:`, error);
            throw new Error(`Failed to initialize driver: ${error}`);
        }
    }

    private static async initializeAndroidDriver(): Promise<void> {
        console.log("Starting Android driver...");

        const androidOptions = {
            logLevel: 'info' as const,
            hostname: new URL(this.APPIUM_URL).hostname,
            port: parseInt(new URL(this.APPIUM_URL).port) || 4723,
            path: '/',
            capabilities: {
                platformName: ConfigReader.getProperty('android.platform.name') || 'Android',
                'appium:deviceName': ConfigReader.getProperty('android.device.name'),
                'appium:platformVersion': ConfigReader.getProperty('android.platform.version'),
                'appium:automationName': ConfigReader.getProperty('android.automation.name') || 'UiAutomator2',
                'appium:udid': ConfigReader.getProperty('android.udid'),
                'appium:appPackage': ConfigReader.getProperty('android.app.package'),
                'appium:appActivity': ConfigReader.getProperty('android.app.activity'),
                'appium:noReset': ConfigReader.getProperty('android.no.reset') === 'true',
                'appium:autoGrantPermissions': ConfigReader.getProperty('android.auto.grant.permissions') === 'true',
                'appium:adbExecTimeout': parseInt(ConfigReader.getProperty('android.adb.execution.timeout') || '20000')
            }
        };

        this.driverPool = await remote(androidOptions);
    }

    private static async initializeIOSDriver(): Promise<void> {
        console.log("Starting iOS driver...");

        const iOSOptions = {
            logLevel: 'info' as const,
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
                'appium:noReset': true,
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
                console.log("Driver closed successfully");
            }
        } catch (error) {
            console.error("Error while closing driver:", error);
        }
    }
}

