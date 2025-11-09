import { Before, After, Status, setDefaultTimeout, AfterAll } from '@cucumber/cucumber';
import { Driver } from '../utils/Driver';
import { ConfigReader } from '../utils/ConfigReader';
import { AllureEnhancer } from '../utils/AllureEnhancer';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);
const shExec = promisify(exec);

// Augmenter le timeout par défaut à 120 secondes
setDefaultTimeout(120000);

let platform: string;
let isRecording: boolean = false;

Before(async function(scenario) {
    platform = (process.env.platformName || ConfigReader.getProperty('platformName', 'android') || 'android').toLowerCase();

    await forceCloseApp(platform);
    await Driver.closeDriver();
    await startApplication(platform);

    // Démarrer l'enregistrement vidéo
    try {
        const driver = await Driver.getDriver();
        await driver.startRecordingScreen({
            videoQuality: 'medium',
            videoFps: 10,
            timeLimit: '180'
        });
        isRecording = true;
    } catch (error) {
        isRecording = false;
    }
});

After(async function(scenario) {
    let videoBase64: string | null = null;

    try {
        // Arrêter l'enregistrement vidéo
        if (isRecording) {
            try {
                const driver = await Driver.getDriver();
                videoBase64 = await driver.stopRecordingScreen();
                isRecording = false;
            } catch { /* ignore */ }
        }

        // Capture d'écran en cas d'échec
        if (scenario.result?.status === Status.FAILED) {
            try {
                const driver = await Driver.getDriver();
                const screenshot = await driver.takeScreenshot();
                await this.attach(Buffer.from(screenshot, 'base64'), 'image/png');
            } catch { /* ignore */ }
        }

        // Attacher la vidéo au rapport Allure
        if (videoBase64) {
            try {
                const videoDir = path.join(process.cwd(), 'target', 'videos');
                if (!fs.existsSync(videoDir)) {
                    fs.mkdirSync(videoDir, { recursive: true });
                }

                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const videoFileName = `${scenario.pickle.name.replace(/[^a-z0-9]/gi, '_')}_${timestamp}.mp4`;
                const videoPath = path.join(videoDir, videoFileName);

                fs.writeFileSync(videoPath, videoBase64, 'base64');
                await this.attach(Buffer.from(videoBase64, 'base64'), 'video/mp4');
            } catch { /* ignore */ }
        }

    } finally {
        await forceCloseApp(platform); // ensure app is stopped & cleared

        try {
            const driver = await Driver.getDriver();
            if (driver) {
                await driver.deleteSession();
            }
        } catch { /* ignore */ }

        await Driver.closeDriver();
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
});

async function forceCloseApp(platform: string): Promise<void> {
    if (platform === 'android') {
        try {
            const appPackage = ConfigReader.getProperty('android.app.package');
            if (appPackage) {
                await execAsync(`adb shell am force-stop ${appPackage}`);
                await execAsync(`adb shell pm clear ${appPackage}`); // clear app data
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch { /* ignore */ }
    }
}

async function startApplication(platform: string): Promise<void> {
    try {
        const driver = await Driver.getDriver();
        if (!driver) {
            throw new Error(`Driver initialization failed for platform: ${platform}`);
        }
    } catch (error) {
        throw new Error(`Application start failed (${platform}): ${error}`);
    }
}

// 🎨 Enhance Allure report after all tests complete
AfterAll(async function() {
    const isCI = process.env.CI === 'true' || process.env.CI === '1';
    console.log('\n' + '='.repeat(60));
    console.log('🎨 Enhancing Allure report...');
    console.log('='.repeat(60));

    try {
        const enhancer = new AllureEnhancer();
        await enhancer.enhanceAllureReport();
        await enhancer.generateTestStatistics();
        await new Promise(r => setTimeout(r, 300));

        // In CI, do not try to open UI; just generate results for Jenkins plugin
        if (isCI) {
            try {
                await shExec('allure generate target/allure-results --clean -o target/allure-report');
                console.log('Allure report generated (CI mode).');
            } catch (e) {
                console.warn('Allure generate failed in CI:', e);
            }
        } else {
            let opened = false;
            try {
                await shExec('allure generate target/allure-results --clean -o target/allure-report');
            } catch (e) { console.warn('Allure generate failed:', e); }

            try {
                await shExec('allure open target/allure-report');
                opened = true;
                console.log('Allure opened with: allure open target/allure-report');
            } catch (eOpen) {
                console.warn('allure open (report) failed, trying allure serve (results):', eOpen);
                try {
                    await shExec('allure serve target/allure-results');
                    opened = true;
                    console.log('Allure opened with: allure serve target/allure-results');
                } catch (eServe) {
                    console.warn('allure serve failed, trying macOS open:', eServe);
                    try {
                        await shExec('open target/allure-report/index.html');
                        opened = true;
                        console.log('Allure opened with: open target/allure-report/index.html');
                    } catch (eMac) {
                        console.warn('macOS open failed as well:', eMac);
                    }
                }
            }

            if (!opened) {
                console.warn('Allure could not be opened automatically. Open it manually if needed.');
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ Allure report finalized.');
        console.log('='.repeat(60) + '\n');
    } catch (error) {
        console.error('⚠️ Allure enhancement error:', error);
    }
});
