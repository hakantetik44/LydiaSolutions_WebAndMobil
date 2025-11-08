export interface AppiumConfig {
    android: {
        platformName: string;
        deviceName: string;
        platformVersion: string;
        automationName: string;
        udid: string;
        appPackage: string;
        appActivity: string;
        noReset: boolean;
        autoGrantPermissions: boolean;
        adbExecTimeout: number;
    };
    ios: {
        platformName: string;
        platformVersion: string;
        deviceName: string;
        udid: string;
        automationName: string;
        bundleId: string;
    };
    appium: {
        serverUrl: string;
    };
    wait: {
        implicitWait: number;
    };
}

export const config: AppiumConfig = {
    android: {
        platformName: 'Android',
        deviceName: 'sdk_gphone64_x86_64',
        platformVersion: '16.0',
        automationName: 'UiAutomator2',
        udid: 'emulator-5554',
        appPackage: 'org.wikipedia.alpha',
        appActivity: 'org.wikipedia.DefaultIcon',
        noReset: true,
        autoGrantPermissions: true,
        adbExecTimeout: 20000
    },
    ios: {
        platformName: 'iOS',
        platformVersion: '26.0.1',
        deviceName: 'İphone fr',
        udid: '00008101-000A3DA60CD1003A',
        automationName: 'XCUITest',
        bundleId: 'com.lydia-app'
    },
    appium: {
        serverUrl: 'http://127.0.0.1:4723'
    },
    wait: {
        implicitWait: 3
    }
};

export default config;
