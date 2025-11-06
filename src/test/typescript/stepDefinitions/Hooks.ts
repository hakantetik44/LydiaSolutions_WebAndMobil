import { Before, After, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { Driver } from '../utils/Driver';
import { ConfigReader } from '../utils/ConfigReader';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

// Augmenter le timeout par défaut à 120 secondes
setDefaultTimeout(120000);

let platform: string;
let isRecording: boolean = false;

Before(async function(scenario) {
    platform = (process.env.platformName || ConfigReader.getProperty('platformName', 'android') || 'android').toLowerCase();

    const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
    const originalName = scenario.pickle.name;
    const newName = `${originalName} - ${platformName}`;

    console.log(`Plateforme de test: ${platform.toUpperCase()}`);
    console.log(`\n🎬 === Nouveau Scénario Commence: ${newName} ===`);
    console.log(`📱 Plateforme: ${platform}`);

    await forceCloseApp(platform);
    await Driver.closeDriver();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await startApplication(platform);

    // Démarrer l'enregistrement vidéo
    try {
        const driver = await Driver.getDriver();
        console.log('🎥 Démarrage de l\'enregistrement vidéo...');
        await driver.startRecordingScreen({
            videoQuality: 'medium',
            videoFps: 10,
            timeLimit: '180'
        });
        isRecording = true;
        console.log('✅ Enregistrement vidéo démarré');
    } catch (error) {
        console.error('⚠️  Erreur lors du démarrage de l\'enregistrement vidéo:', error);
        isRecording = false;
    }
});

After(async function(scenario) {
    let videoBase64: string | null = null;

    try {
        const resultatTest = scenario.result?.status === Status.FAILED ? '❌ ÉCHEC' : '✅ RÉUSSITE';

        // Arrêter l'enregistrement vidéo
        if (isRecording) {
            try {
                const driver = await Driver.getDriver();
                console.log('🎥 Arrêt de l\'enregistrement vidéo...');
                videoBase64 = await driver.stopRecordingScreen();
                console.log('✅ Enregistrement vidéo arrêté');
                isRecording = false;
            } catch (error) {
                console.error('⚠️  Erreur lors de l\'arrêt de l\'enregistrement vidéo:', error);
            }
        }

        // Capture d'écran en cas d'échec
        if (scenario.result?.status === Status.FAILED) {
            try {
                const driver = await Driver.getDriver();
                const screenshot = await driver.takeScreenshot();
                await this.attach(Buffer.from(screenshot, 'base64'), 'image/png');
            } catch (error) {
                console.error(`❌ Erreur lors de la capture d'écran: ${error}`);
            }
        }

        // Attacher la vidéo au rapport Allure
        if (videoBase64) {
            try {
                console.log('📎 Attachement de la vidéo au rapport Allure...');

                // Créer le dossier pour les vidéos
                const videoDir = path.join(process.cwd(), 'target', 'videos');
                if (!fs.existsSync(videoDir)) {
                    fs.mkdirSync(videoDir, { recursive: true });
                }

                // Sauvegarder la vidéo
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const videoFileName = `${scenario.pickle.name.replace(/[^a-z0-9]/gi, '_')}_${timestamp}.mp4`;
                const videoPath = path.join(videoDir, videoFileName);

                fs.writeFileSync(videoPath, videoBase64, 'base64');
                console.log(`✅ Vidéo sauvegardée: ${videoPath}`);

                // Attacher au rapport Allure
                await this.attach(Buffer.from(videoBase64, 'base64'), 'video/mp4');
                console.log('✅ Vidéo attachée au rapport Allure');

            } catch (error) {
                console.error('❌ Erreur lors de l\'attachement de la vidéo:', error);
            }
        }

        console.log(`\n🏁 === Scénario Terminé: ${scenario.pickle.name} ===`);
        console.log(`📊 Résultat: ${resultatTest}`);

    } finally {
        console.log('Fermeture forcée de l\'application...');
        await forceCloseApp(platform);

        try {
            const driver = await Driver.getDriver();
            if (driver) {
                await driver.deleteSession();
            }
        } catch (error) {
            console.error('Erreur lors de la fermeture du driver:', error);
        }

        await Driver.closeDriver();
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Application fermée avec succès.\n');
    }
});

async function forceCloseApp(platform: string): Promise<void> {
    if (platform === 'android') {
        try {
            const appPackage = ConfigReader.getProperty('android.app.package');
            console.log(`Tentative de fermeture forcée de l'application Android: ${appPackage}`);

            const { stderr } = await execAsync(`adb shell am force-stop ${appPackage}`);
            console.log('Application Android fermée avec succès via ADB');

            if (stderr) {
                console.error('ADB Error:', stderr);
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`Erreur lors de la tentative de fermeture forcée de l'application Android: ${error}`);
        }
    } else if (platform === 'ios') {
        console.log('Fermeture forcée de l\'application iOS non implémentée');
    }
}

async function startApplication(platform: string): Promise<void> {
    try {
        console.log(`🚀 Démarrage de l'application pour le scénario - Plateforme: ${platform}`);

        const driver = await Driver.getDriver();
        if (!driver) {
            throw new Error(`❌ Impossible de démarrer le driver - Plateforme: ${platform}`);
        }

        console.log(`✅ Driver créé avec succès: ${platform}`);
        await new Promise(resolve => setTimeout(resolve, 3000));

    } catch (error) {
        const errorMsg = `❌ Erreur lors du démarrage (${platform}): ${error}`;
        console.error(errorMsg);
        throw new Error(errorMsg);
    }
}

