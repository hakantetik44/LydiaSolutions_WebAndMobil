import { Given, When, Then, And } from '@cucumber/cucumber';
import { LydiaLoginPage } from '../pages/LydiaLoginPage';
import { Driver } from '../utils/Driver';
import { expect } from 'chai';

let loginPage: LydiaLoginPage;

Given('l\'application Lydia est lancée', async function() {
    loginPage = new LydiaLoginPage();
    await loginPage.init();

    const driver = await Driver.getDriver();
    expect(driver).to.not.be.null;
    console.log('✅ Application Lydia lancée avec succès');

    // Attendre que le bouton soit cliquable
    await driver.$(loginPage.getBesoinAideButton()).waitForClickable({ timeout: 20000 });
});

When('l\'utilisateur clique sur {string}', async function(bouton: string) {
    switch (bouton) {
        case "Besoin d'aide":
            const driver = await Driver.getDriver();
            await driver.$(loginPage.getBesoinAideButton()).waitForClickable({ timeout: 20000 });
            await loginPage.clickBesoinAide();
            break;
        case "Un problème pour vous connecter":
            const driver2 = await Driver.getDriver();
            await driver2.$(loginPage.getProblemeConnexionButton()).waitForClickable({ timeout: 20000 });
            await loginPage.clickProblemeConnexion();
            break;
        default:
            throw new Error(`Bouton non reconnu : ${bouton}`);
    }
    console.log(`✅ Clic sur le bouton : ${bouton}`);
});

And('l\'utilisateur saisit le numéro {string}', async function(numero: string) {
    const driver = await Driver.getDriver();
    await driver.$(loginPage.getNumeroTelephoneInput()).waitForClickable({ timeout: 20000 });
    await loginPage.saisirNumeroTelephone(numero);
    console.log(`✅ Numéro de téléphone saisi : ${numero}`);
});

And('l\'utilisateur saisit l\'email {string}', async function(email: string) {
    await loginPage.saisirEmail(email);
    console.log(`✅ Email saisi : ${email}`);
});

Then('l\'utilisateur envoie la demande d\'aide', async function() {
    const driver = await Driver.getDriver();
    await driver.$(loginPage.getEnvoyerButton()).waitForClickable({ timeout: 20000 });
    await loginPage.clickEnvoyer();
    console.log('✅ Demande d\'aide envoyée avec succès');
});
import { Given, When, Then, Before, After, ITestCaseHookParameter } from '@cucumber/cucumber';
import { Driver } from '../utils/Driver';
import { ConfigReader } from '../utils/ConfigReader';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class Hooks {
    private scenario: ITestCaseHookParameter;
    private platform: string;

    @Before()
    public async setUp(scenario: ITestCaseHookParameter): Promise<void> {
        this.scenario = scenario;
        this.platform = (process.env.platformName || ConfigReader.getProperty('platformName', 'android') || 'android').toLowerCase();

        // Ajouter le nom de la plateforme au titre du scénario
        const platformName = this.platform.charAt(0).toUpperCase() + this.platform.slice(1);
        const originalName = scenario.pickle.name;
        const newName = `${originalName} - ${platformName}`;

        // Ajouter des informations sur la plateforme
        console.log(`Plateforme de test: ${this.platform.toUpperCase()}`);

        console.log(`\n🎬 === Nouveau Scénario Commence: ${newName} ===`);
        console.log(`📱 Plateforme: ${this.platform}`);

        // Forcer la fermeture de toute instance précédente
        await this.forceCloseApp();

        // S'assurer que le driver est fermé avant de démarrer un nouveau scénario
        await Driver.closeDriver();

        // Attendre un peu pour s'assurer que tout est bien fermé
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Démarrer l'application pour ce scénario
        await this.startApplication();
    }

    private async forceCloseApp(): Promise<void> {
        if (this.platform === 'android') {
            try {
                const appPackage = ConfigReader.getProperty('android.app.package');
                console.log(`Tentative de fermeture forcée de l'application Android: ${appPackage}`);

                // Exécuter la commande adb pour forcer l'arrêt de l'application
                const { stdout, stderr } = await execAsync(`adb shell am force-stop ${appPackage}`);

                console.log('Application Android fermée avec succès via ADB');

                if (stderr) {
                    console.error('ADB Error:', stderr);
                }

                // Attendre un peu après la fermeture forcée
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.error(`Erreur lors de la tentative de fermeture forcée de l'application Android: ${error}`);
            }
        } else if (this.platform === 'ios') {
            // Pour iOS, on pourrait utiliser xcrun simctl ou idevicedebug si nécessaire
            console.log('Fermeture forcée de l\'application iOS non implémentée');
        }
    }

    private async startApplication(): Promise<void> {
        try {
            console.log(`🚀 Démarrage de l'application pour le scénario - Plateforme: ${this.platform}`);

            const driver = await Driver.getDriver();
            if (!driver) {
                throw new Error(`❌ Impossible de démarrer le driver - Plateforme: ${this.platform}`);
            }

            console.log(`✅ Driver créé avec succès: ${this.platform}`);

            // Attendre que l'application soit prête
            await new Promise(resolve => setTimeout(resolve, 3000));

        } catch (error) {
            const errorMsg = `❌ Erreur lors du démarrage (${this.platform}): ${error}`;
            console.error(errorMsg);
            throw new Error(errorMsg);
        }
    }

    @After()
    public async tearDown(scenario: ITestCaseHookParameter): Promise<void> {
        try {
            const resultatTest = scenario.result?.status === 'FAILED' ? '❌ ÉCHEC' : '✅ RÉUSSITE';

            if (scenario.result?.status === 'FAILED') {
                try {
                    const driver = await Driver.getDriver();
                    const screenshot = await driver.takeScreenshot();
                    const screenshotName = `Échec-${this.platform}-${scenario.pickle.name}`;

                    // Attacher à Cucumber
                    await this.scenario.attach(Buffer.from(screenshot, 'base64'), 'image/png');

                } catch (error) {
                    console.error(`❌ Erreur lors de la capture d'écran: ${error}`);
                }
            }

            console.log(`\n🏁 === Scénario Terminé: ${scenario.pickle.name} ===`);
            console.log(`📊 Résultat: ${resultatTest}`);

        } finally {
            // Forcer la fermeture de l'application
            console.log('Fermeture forcée de l\'application...');

            // Fermer l'application via ADB pour Android
            await this.forceCloseApp();

            try {
                const driver = await Driver.getDriver();
                if (driver) {
                    await driver.deleteSession();
                }
            } catch (error) {
                console.error('Erreur lors de la fermeture du driver:', error);
            }

            // S'assurer que le driver est complètement fermé et réinitialisé
            await Driver.closeDriver();

            // Attendre un peu pour s'assurer que l'application est bien fermée
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Application fermée avec succès.\n');
        }
    }
}

